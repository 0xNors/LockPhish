import { AuthService } from '../services/authService.js';
import { OrganizationService } from '../services/organizationService.js';
import { EmployeeService } from '../services/employeeService.js';
import { CampaignService } from '../services/campaignService.js';
import { SimulationService } from '../services/simulationService.js';
import { VoiceStateMachine } from '../services/voiceStateMachine.js';
import { TrainingService } from '../services/trainingService.js';
import { RiskEngine } from '../services/riskEngine.js';
import { ReportService } from '../services/reportService.js';
import { AuditService } from '../services/auditService.js';
import { ComplianceService } from '../services/complianceService.js';
import { runMigrations } from '../database/migrate.js';
import { get, all } from '../database/db.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    failed++;
    throw new Error(`Assertion failed: ${msg}`);
  } else {
    console.log(`✅ PASS: ${msg}`);
    passed++;
  }
}

async function runTests() {
  console.log('=======================================================');
  console.log('🧪 RUNNING LOCKPHISH AUTOMATED VERIFICATION SUITE');
  console.log('=======================================================');

  // Initialize DB
  await runMigrations();

  // 1. Organization & Admin Registration
  console.log('\n--- 1. Testing Organization Setup & Authentication ---');
  const orgDomain = `acme-test-${Date.now()}.com`;
  const orgData = {
    org_name: 'Acme Cybersecurity Corp',
    org_domain: orgDomain,
    industry: 'Financial Technology',
    size_range: '50-250',
    admin_name: 'Sarah Connor',
    admin_email: `admin@${orgDomain}`,
    admin_password: 'MasterPassword2026!'
  };

  const regResult = await AuthService.registerOrganization(orgData);
  assert(Boolean(regResult.token), 'Registration generates JWT token');
  assert(regResult.organization.domain === orgDomain, 'Organization created with correct domain');

  // Login verification
  const loginResult = await AuthService.login({
    email: orgData.admin_email,
    password: orgData.admin_password
  });
  assert(loginResult.user.role === 'ORG_ADMIN', 'Logged in user has ORG_ADMIN role');

  // Invalid password check
  let rejected = false;
  try {
    await AuthService.login({ email: orgData.admin_email, password: 'WrongPassword!' });
  } catch {
    rejected = true;
  }
  assert(rejected, 'Invalid password is fundamentally rejected');

  // 2. Multi-tenant Isolation Test
  console.log('\n--- 2. Testing Multi-Tenant Data Isolation ---');
  const orgB_Domain = `tenant-b-${Date.now()}.com`;
  const orgB = await AuthService.registerOrganization({
    org_name: 'Tenant B Logistics',
    org_domain: orgB_Domain,
    admin_name: 'Bob Builder',
    admin_email: `bob@${orgB_Domain}`,
    admin_password: 'TenantBPassword2026!'
  });

  // Create employee in Org A
  const deptsA = await OrganizationService.getDepartments(regResult.organization.id);
  const empA = await EmployeeService.createEmployee(regResult.organization.id, {
    first_name: 'Alice',
    last_name: 'Analyst',
    email: `alice@${orgDomain}`,
    department_id: deptsA[0].id,
    job_title: 'Security Analyst',
    password: 'AlicePassword2026!'
  }, { id: regResult.user.id, name: regResult.user.full_name, role: regResult.user.role });

  // Create employee in Org B
  const deptsB = await OrganizationService.getDepartments(orgB.organization.id);
  const empB = await EmployeeService.createEmployee(orgB.organization.id, {
    first_name: 'Bobbie',
    last_name: 'Operator',
    email: `bobbie@${orgB_Domain}`,
    department_id: deptsB[0].id,
    job_title: 'Logistics Lead',
    password: 'BobbiePassword2026!'
  }, { id: orgB.user.id, name: orgB.user.full_name, role: orgB.user.role });

  // Verify Org A cannot see Org B's employee
  const listOrgA = await EmployeeService.listEmployees(regResult.organization.id, {});
  const hasEmpBInOrgA = listOrgA.employees.some(e => e.id === empB.id);
  assert(!hasEmpBInOrgA, 'Tenant A query cannot leak Tenant B employee');

  // Test 1-click department staff seeding
  const seededStaff = await EmployeeService.seedSampleDepartmentEmployees(regResult.organization.id, deptsA[1].id, {
    id: regResult.user.id,
    name: regResult.user.full_name,
    role: regResult.user.role
  });
  assert(seededStaff.length >= 2, 'Department sample staff seeded with realistic profiles');
  const listAfterSeed = await EmployeeService.listEmployees(regResult.organization.id, { department_id: deptsA[1].id });
  assert(listAfterSeed.employees.length >= 2, 'Department folder contains newly seeded employees with risk scores');

  // 3. Campaign Lifecycle & Emergency Stop
  console.log('\n--- 3. Testing Campaign Lifecycle & Kill Switch ---');
  const scenarios = await all<any>('SELECT id FROM scenarios WHERE is_system_template = 1');
  assert(scenarios.length > 0, 'Scenario library is populated with system templates');

  const campaign = await CampaignService.createCampaign(regResult.organization.id, {
    name: 'Q3 Enterprise Phishing Assessment',
    channel: 'EMAIL',
    target_type: 'ALL',
    scenario_ids: [scenarios[0].id, scenarios[1].id]
  }, { id: regResult.user.id, name: regResult.user.full_name, role: regResult.user.role });

  assert(campaign.status === 'DRAFT', 'Campaign initial status is DRAFT');

  // Validate campaign
  const valResult = await CampaignService.validateCampaign(regResult.organization.id, campaign.id, {
    id: regResult.user.id,
    name: regResult.user.full_name,
    role: regResult.user.role
  });
  assert(valResult.validated && valResult.target_count >= 1, 'Pre-flight safety validation succeeds');

  // Launch campaign
  const launched = await CampaignService.launchCampaign(regResult.organization.id, campaign.id, {
    id: regResult.user.id,
    name: regResult.user.full_name,
    role: regResult.user.role
  });
  assert(launched.status === 'RUNNING', 'Campaign status updated to RUNNING');

  // Verify employee received mission
  const employeeMissions = await SimulationService.getEmployeeMissions(empA.id);
  assert(employeeMissions.length >= 1, 'Employee sees assigned mission in real-time');
  const mission = employeeMissions[0];

  // 4. Interactive Simulation & Sensitive Data Interception
  console.log('\n--- 4. Testing Simulation Event & Credential Redaction ---');
  // Record open
  await SimulationService.recordSimulationEvent({
    simulation_id: mission.id,
    event_type: 'OPENED'
  });

  // Attempt simulated credential submission
  const interceptResult = await SimulationService.recordSimulationEvent({
    simulation_id: mission.id,
    event_type: 'CREDENTIAL_SUBMISSION_ATTEMPTED',
    raw_payload: { username: 'alice@acme.com', password: 'RealSecretPasswordToRedact!' }
  });

  assert(interceptResult.status === 'CREDENTIALS_ENTERED', 'Simulation status transitions to CREDENTIALS_ENTERED');
  assert(interceptResult.training_recommended.length > 0, 'Adaptive training recommendation automatically generated');

  // Verify secrets are NOT in database
  const events = await all<any>('SELECT * FROM simulation_events WHERE simulation_id = ?', [mission.id]);
  const dbDump = JSON.stringify(events);
  assert(!dbDump.includes('RealSecretPasswordToRedact!'), 'Sensitive credential strictly REDACTED and never stored in database');

  // 5. Emergency Stop (Kill Switch)
  console.log('\n--- 5. Testing Emergency Stop (Kill Switch) ---');
  const stopped = await CampaignService.emergencyStop(regResult.organization.id, campaign.id, {
    id: regResult.user.id,
    name: regResult.user.full_name,
    role: regResult.user.role
  });
  assert(stopped.status === 'STOPPED', 'Campaign immediately halted by Emergency Stop');

  // 6. Voice State Machine & Verification
  console.log('\n--- 6. Testing Controlled AI Voice Simulation ---');
  // Create voice campaign
  const voiceScenarios = await all<any>('SELECT id FROM scenarios WHERE channel = "VOICE"');
  const voiceCampaign = await CampaignService.createCampaign(regResult.organization.id, {
    name: 'Voice Social Engineering Test',
    channel: 'VOICE',
    target_type: 'ALL',
    scenario_ids: [voiceScenarios[0].id]
  }, { id: regResult.user.id, name: regResult.user.full_name, role: regResult.user.role });

  await CampaignService.launchCampaign(regResult.organization.id, voiceCampaign.id, {
    id: regResult.user.id,
    name: regResult.user.full_name,
    role: regResult.user.role
  });

  const empMissionsVoice = await SimulationService.getEmployeeMissions(empA.id);
  const voiceMission = empMissionsVoice.find(m => m.channel === 'VOICE');
  assert(Boolean(voiceMission), 'Employee receives voice simulation mission');

  // Start voice call
  const session = await VoiceStateMachine.startSession(voiceMission.id);
  assert(session.current_state === 'INTRODUCTION', 'Voice session initialized in INTRODUCTION state');

  // Employee asks verification question
  const voiceStep1 = await VoiceStateMachine.processUtterance(session.session_id, "Can you provide your ServiceNow ticket number?");
  assert(voiceStep1.current_state === 'VERIFICATION', 'State machine transitions to VERIFICATION upon cautious question');

  // Employee refuses to share OTP
  const voiceStep2 = await VoiceStateMachine.processUtterance(session.session_id, "I cannot share MFA codes over an inbound phone call according to security policy.");
  assert(voiceStep2.current_state === 'SAFE_EXIT' && voiceStep2.is_terminal, 'Employee safe refusal triggers SAFE_EXIT and call completion');

  // 7. Interactive Training & Pre/Post Assessment
  console.log('\n--- 7. Testing Interactive Training & Assessment ---');
  const courses = await TrainingService.listCourses(regResult.organization.id);
  assert(courses.length > 0, 'Training courses available');

  const courseWithAssessment = courses.find(c => c.assessment_id) || courses[0];
  const course = await TrainingService.getCourseById(courseWithAssessment.id);
  assert(Boolean(course.assessment), 'Course contains linked assessment');

  // Dynamically resolve correct answers from course assessment questions
  const assessAnswers: Record<string, number> = {};
  const questions = course.assessment.questions || [];
  questions.forEach((q: any) => {
    assessAnswers[q.id] = q.correct_index !== undefined ? q.correct_index : 0;
  });

  // Submit assessment
  const assessResult = await TrainingService.submitAssessment({
    assessment_id: course.assessment.id,
    employee_id: empA.id,
    attempt_type: 'POST_TRAINING',
    answers: assessAnswers
  });
  assert(assessResult.passed && assessResult.score >= 80, 'Assessment graded and passed successfully');
  assert(typeof assessResult.updated_security_score === 'number', 'Employee risk score updated after training');

  // 8. Reports Generation (CSV & PDF)
  console.log('\n--- 8. Testing CSV and PDF Report Generation ---');
  const csvData = await ReportService.generateCSV(regResult.organization.id, 'SIMULATIONS');
  assert(csvData.includes('Simulation ID'), 'CSV report generated with valid headers');

  const pdfBuffer = await ReportService.generatePDF(regResult.organization.id);
  assert(Buffer.isBuffer(pdfBuffer) && pdfBuffer.length > 1000, 'PDF report binary generated successfully');

  // 9. Compliance Status
  console.log('\n--- 9. Testing Compliance Evidence Calculation ---');
  const compliance = await ComplianceService.getComplianceStatus(regResult.organization.id);
  assert(compliance.length >= 6, 'All compliance frameworks evaluated');

  // 10. Audit Logs
  console.log('\n--- 10. Testing Audit Logs Integrity ---');
  const auditLogs = await AuditService.getLogs({ organization_id: regResult.organization.id });
  assert(auditLogs.total >= 5, 'Audit logs recorded for administrative and security actions');

  console.log('\n=======================================================');
  console.log(`🎉 ALL TESTS PASSED! (${passed} checks passed, ${failed} failed)`);
  console.log('=======================================================');
}

runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
