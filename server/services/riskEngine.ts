import { v4 as uuidv4 } from 'uuid';
import { run, get, all, transaction } from '../database/db.js';

export class RiskEngine {
  /**
   * Recalculate security risk score for an employee based on all historical behavioral events and training records
   */
  static async recalculateEmployeeRisk(orgId: string, employeeId: string, triggerReason = 'SCHEDULED_RECALC') {
    // 1. Get all events
    const events = await all<any>(`
      SELECT event_type, risk_weight, timestamp 
      FROM simulation_events 
      WHERE employee_id = ? 
      ORDER BY timestamp ASC
    `, [employeeId]);

    // 2. Get training records
    const trainings = await all<any>(`
      SELECT ta.*, aa.score as post_score
      FROM training_assignments ta
      LEFT JOIN assessment_attempts aa ON aa.assignment_id = ta.id AND aa.attempt_type = 'POST_TRAINING'
      WHERE ta.employee_id = ?
    `, [employeeId]);

    // 3. Compute score: Start from baseline 100
    let score = 100.0;

    for (const ev of events) {
      // risk_weight > 0 represents penalty (unsafe behavior), < 0 represents safe reward
      score -= ev.risk_weight;
    }

    for (const t of trainings) {
      if (t.status === 'COMPLETED') {
        score += 15.0; // Reward for completing assigned remediation training
      }
      if (t.score_post_assessment && t.score_post_assessment >= 80) {
        score += 10.0; // Reward for passing assessment
      }
    }

    // Clamp score between 10 and 100
    score = Math.max(10.0, Math.min(100.0, Math.round(score * 10) / 10));

    // Determine Risk Level
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (score < 40) riskLevel = 'CRITICAL';
    else if (score < 65) riskLevel = 'HIGH';
    else if (score < 85) riskLevel = 'MEDIUM';
    else riskLevel = 'LOW';

    // Simulation metrics
    const simStats = await get<any>(`
      SELECT 
        COUNT(*) as total_sims,
        SUM(CASE WHEN event_type IN ('LINK_CLICKED', 'CREDENTIAL_SUBMISSION_ATTEMPTED', 'ATTACHMENT_OPENED') THEN 1 ELSE 0 END) as phishing_fails,
        SUM(CASE WHEN event_type = 'SMS_REPLIED' THEN 1 ELSE 0 END) as smishing_fails,
        SUM(CASE WHEN event_type = 'CALL_SECRET_DISCLOSED' THEN 1 ELSE 0 END) as vishing_fails,
        SUM(CASE WHEN event_type IN ('REPORTED_PHISH', 'REPORTED_SMISH', 'REPORTED_VISH') THEN 1 ELSE 0 END) as reported_count
      FROM simulation_events
      WHERE employee_id = ?
    `, [employeeId]);

    const totalSims = simStats?.total_sims || 1;
    const phishingSusc = Math.min(100, Math.round(((simStats?.phishing_fails || 0) / totalSims) * 100));
    const smishingSusc = Math.min(100, Math.round(((simStats?.smishing_fails || 0) / totalSims) * 100));
    const vishingSusc = Math.min(100, Math.round(((simStats?.vishing_fails || 0) / totalSims) * 100));
    const reportingRate = Math.min(100, Math.round(((simStats?.reported_count || 0) / totalSims) * 100));

    // Pre vs Post training assessment averages
    const assessStats = await get<any>(`
      SELECT 
        AVG(CASE WHEN attempt_type = 'PRE_TRAINING' THEN score ELSE NULL END) as pre_avg,
        AVG(CASE WHEN attempt_type = 'POST_TRAINING' THEN score ELSE NULL END) as post_avg
      FROM assessment_attempts
      WHERE employee_id = ?
    `, [employeeId]);

    const preAvg = assessStats?.pre_avg ? Math.round(assessStats.pre_avg * 10) / 10 : 0.0;
    const postAvg = assessStats?.post_avg ? Math.round(assessStats.post_avg * 10) / 10 : 0.0;
    const deltaImprovement = (postAvg && preAvg) ? Math.round((postAvg - preAvg) * 10) / 10 : (postAvg ? postAvg : 0.0);

    // Update employee table
    await run(`
      UPDATE employees
      SET current_risk_score = ?, current_risk_level = ?, updated_at = DATETIME('now')
      WHERE id = ?
    `, [score, riskLevel, employeeId]);

    // Upsert employee risk profile
    await run(`
      INSERT INTO risk_profiles (id, organization_id, employee_id, profile_type, security_score, risk_level, phishing_susceptibility, smishing_susceptibility, vishing_susceptibility, reporting_rate, pre_training_avg_score, post_training_avg_score, delta_improvement, updated_at)
      VALUES (?, ?, ?, 'EMPLOYEE', ?, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
      ON CONFLICT(id) DO UPDATE SET
        security_score = excluded.security_score,
        risk_level = excluded.risk_level,
        phishing_susceptibility = excluded.phishing_susceptibility,
        smishing_susceptibility = excluded.smishing_susceptibility,
        vishing_susceptibility = excluded.vishing_susceptibility,
        reporting_rate = excluded.reporting_rate,
        pre_training_avg_score = excluded.pre_training_avg_score,
        post_training_avg_score = excluded.post_training_avg_score,
        delta_improvement = excluded.delta_improvement,
        updated_at = DATETIME('now')
    `, [
      uuidv4(),
      orgId,
      employeeId,
      score,
      riskLevel,
      phishingSusc,
      smishingSusc,
      vishingSusc,
      reportingRate,
      preAvg,
      postAvg,
      deltaImprovement
    ]);

    // Record today's risk history snapshot
    const today = new Date().toISOString().split('T')[0];
    await run(`
      INSERT INTO risk_history (id, organization_id, employee_id, recorded_date, security_score, risk_level, reason_event, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
    `, [uuidv4(), orgId, employeeId, today, score, riskLevel, triggerReason]);

    return {
      employee_id: employeeId,
      security_score: score,
      risk_level: riskLevel,
      phishing_susceptibility: phishingSusc,
      smishing_susceptibility: smishingSusc,
      vishing_susceptibility: vishingSusc,
      reporting_rate: reportingRate,
      pre_training_avg: preAvg,
      post_training_avg: postAvg,
      delta_improvement: deltaImprovement
    };
  }

  /**
   * Automatic Adaptive Training Recommendation Generator
   * Maps failure vector to specific targeted interactive training course
   */
  static async generateTrainingRecommendations(orgId: string, employeeId: string, category: string, channel: string): Promise<any[]> {
    let targetCourseCode = 'COURSE-02-PHISHING-INTRO';

    if (channel === 'SMS' || category === 'DELIVERY' || category === 'MFA') {
      targetCourseCode = 'COURSE-41-WHAT-IS-SMISHING';
    } else if (channel === 'VOICE' || category === 'IT_SUPPORT') {
      targetCourseCode = 'COURSE-51-WHAT-IS-VISHING';
    } else if (category === 'EXECUTIVE_IMPERSONATION' || category === 'FINANCE' || category === 'VENDOR' || category === 'SOCIAL_ENGINEERING') {
      targetCourseCode = 'COURSE-04-SOCIAL-ENGINEERING';
    } else if (category === 'ACCOUNT_SECURITY' || category === 'PAYROLL') {
      targetCourseCode = 'COURSE-19-FAKE-ACCOUNT-ALERTS';
    }

    let course = await get<any>('SELECT * FROM training_courses WHERE code = ?', [targetCourseCode]);
    if (!course) {
      let mappedCat = 'EMAIL_SECURITY';
      if (channel === 'SMS') mappedCat = 'SMS_SECURITY';
      else if (channel === 'VOICE') mappedCat = 'VOICE_SECURITY';
      else if (category === 'SOCIAL_ENGINEERING' || category === 'EXECUTIVE_IMPERSONATION') mappedCat = 'SOCIAL_ENGINEERING';
      else if (category === 'ACCOUNT_SECURITY' || category === 'PAYROLL') mappedCat = 'ACCOUNT_SECURITY';
      
      course = await get<any>('SELECT * FROM training_courses WHERE category = ? ORDER BY difficulty ASC LIMIT 1', [mappedCat])
        || await get<any>('SELECT * FROM training_courses ORDER BY created_at ASC LIMIT 1');
    }

    if (!course) return [];

    // Check if already actively assigned
    const existing = await get<any>(
      'SELECT id FROM training_assignments WHERE employee_id = ? AND course_id = ? AND status IN ("ASSIGNED", "IN_PROGRESS")',
      [employeeId, course.id]
    );

    if (!existing) {
      const assignmentId = uuidv4();
      await run(`
        INSERT INTO training_assignments (id, organization_id, course_id, employee_id, trigger_reason, status, progress_percent, assigned_at)
        VALUES (?, ?, ?, ?, 'POST_SIMULATION_FAILURE', 'ASSIGNED', 0, DATETIME('now'))
      `, [assignmentId, orgId, course.id, employeeId]);

      await run('UPDATE employees SET trainings_assigned = trainings_assigned + 1 WHERE id = ?', [employeeId]);
    }

    return [{
      course_id: course.id,
      course_code: course.code,
      title: course.title,
      category: course.category,
      difficulty: course.difficulty,
      duration_minutes: course.duration_minutes,
      reason: `Automated remediation recommended for recent ${channel} simulation failure.`
    }];
  }

  /**
   * Get Organization-wide Risk Profile
   */
  static async getOrganizationRisk(orgId: string) {
    const employees = await all<any>('SELECT current_risk_score, current_risk_level FROM employees WHERE organization_id = ? AND status != "INACTIVE"', [orgId]);

    if (employees.length === 0) {
      return {
        avg_security_score: 100.0,
        overall_risk_level: 'LOW',
        risk_distribution: { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 },
        total_employees: 0
      };
    }

    const total = employees.length;
    const avgScore = Math.round(employees.reduce((acc, e) => acc + (e.current_risk_score || 100), 0) / total * 10) / 10;

    const distribution = {
      LOW: employees.filter(e => e.current_risk_level === 'LOW').length,
      MEDIUM: employees.filter(e => e.current_risk_level === 'MEDIUM').length,
      HIGH: employees.filter(e => e.current_risk_level === 'HIGH').length,
      CRITICAL: employees.filter(e => e.current_risk_level === 'CRITICAL').length
    };

    let overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (avgScore < 40) overallRisk = 'CRITICAL';
    else if (avgScore < 65) overallRisk = 'HIGH';
    else if (avgScore < 85) overallRisk = 'MEDIUM';

    return {
      avg_security_score: avgScore,
      overall_risk_level: overallRisk,
      risk_distribution: distribution,
      total_employees: total
    };
  }
}
