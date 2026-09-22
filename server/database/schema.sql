-- LockPhish Production Database Schema (SQLite Normalized Schema)
-- PRAGMA foreign_keys = ON;

-- 1. Organizations (Tenants)
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  industry TEXT DEFAULT 'Technology',
  size_range TEXT DEFAULT '1-50',
  risk_policy TEXT DEFAULT '{"base_score":100,"click_penalty":25,"credential_penalty":40,"voice_disclosure_penalty":45,"report_reward":15,"training_reward":20,"assessment_reward":15}',
  safety_whitelist TEXT DEFAULT '["lockphish.internal","training.lockphish.internal","verify.lockphish.internal"]',
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);

-- 2. Users (Authentication & System Access)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  organization_id TEXT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('SUPER_ADMIN', 'ORG_ADMIN', 'CAMPAIGN_MANAGER', 'TRAINER', 'EMPLOYEE')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'INVITED', 'SUSPENDED')),
  activation_token TEXT,
  password_reset_token TEXT,
  password_reset_expires TEXT,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TEXT,
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- 3. Password Reset Requests Queue (Admin-Assisted Reset)
CREATE TABLE IF NOT EXISTS password_reset_requests (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT,
  email TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'RESOLVED', 'CANCELLED')),
  temporary_password TEXT,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  resolved_at TEXT,
  resolved_by TEXT,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- 4. Departments
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  manager_name TEXT,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  UNIQUE(organization_id, name)
);

-- 5. Groups
CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  UNIQUE(organization_id, name)
);

-- 6. Employees
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  department_id TEXT,
  job_title TEXT DEFAULT 'Staff Member',
  phone_number TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'INVITED', 'INACTIVE')),
  current_risk_score REAL NOT NULL DEFAULT 100.0,
  current_risk_level TEXT NOT NULL DEFAULT 'LOW' CHECK(current_risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  simulations_received INTEGER DEFAULT 0,
  simulations_failed INTEGER DEFAULT 0,
  simulations_reported INTEGER DEFAULT 0,
  trainings_assigned INTEGER DEFAULT 0,
  trainings_completed INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  UNIQUE(organization_id, email)
);

-- 7. Employee Groups Junction
CREATE TABLE IF NOT EXISTS employee_groups (
  employee_id TEXT NOT NULL,
  group_id TEXT NOT NULL,
  PRIMARY KEY (employee_id, group_id),
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- 8. Scenarios (Master Threat Vector Library)
CREATE TABLE IF NOT EXISTS scenarios (
  id TEXT PRIMARY KEY,
  organization_id TEXT,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  channel TEXT NOT NULL CHECK(channel IN ('EMAIL', 'SMS', 'VOICE', 'MULTI_STAGE')),
  category TEXT NOT NULL CHECK(category IN ('BILLING', 'FINANCE', 'IT_SUPPORT', 'HR', 'PAYROLL', 'ACCOUNT_SECURITY', 'MFA', 'DELIVERY', 'VENDOR', 'EXECUTIVE_IMPERSONATION', 'SOCIAL_ENGINEERING', 'PASSWORD_SECURITY', 'DATA_PROTECTION', 'REMOTE_WORK', 'CLOUD_SECURITY')),
  difficulty TEXT NOT NULL CHECK(difficulty IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  description TEXT NOT NULL,
  sender_profile TEXT NOT NULL,
  payload_config TEXT NOT NULL,
  learning_indicators TEXT NOT NULL,
  decision_tree TEXT NOT NULL,
  is_system_template INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- 9. Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  channel TEXT NOT NULL CHECK(channel IN ('EMAIL', 'SMS', 'VOICE', 'MULTI_STAGE')),
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK(status IN ('DRAFT', 'VALIDATED', 'SCHEDULED', 'RUNNING', 'PAUSED', 'COMPLETED', 'STOPPED', 'ARCHIVED')),
  target_type TEXT NOT NULL DEFAULT 'ALL' CHECK(target_type IN ('ALL', 'DEPARTMENT', 'GROUP', 'CUSTOM')),
  target_filter TEXT DEFAULT '{}',
  scenario_ids TEXT NOT NULL,
  difficulty TEXT DEFAULT 'MEDIUM',
  start_time TEXT,
  end_time TEXT,
  training_auto_assign INTEGER NOT NULL DEFAULT 1,
  risk_policy TEXT DEFAULT '{}',
  safety_review_passed INTEGER NOT NULL DEFAULT 0,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 10. Campaign Targets
CREATE TABLE IF NOT EXISTS campaign_targets (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  scenario_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'SENT', 'DELIVERED', 'INTERACTED', 'COMPLETED', 'CANCELLED')),
  sent_at TEXT,
  completed_at TEXT,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE,
  UNIQUE(campaign_id, employee_id)
);

-- 11. Simulations
CREATE TABLE IF NOT EXISTS simulations (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  campaign_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  scenario_id TEXT NOT NULL,
  channel TEXT NOT NULL CHECK(channel IN ('EMAIL', 'SMS', 'VOICE', 'MULTI_STAGE')),
  stage_number INTEGER NOT NULL DEFAULT 1,
  total_stages INTEGER NOT NULL DEFAULT 1,
  current_stage_channel TEXT,
  status TEXT NOT NULL DEFAULT 'DELIVERED' CHECK(status IN ('PENDING', 'DELIVERED', 'OPENED', 'INSPECTED', 'LINK_CLICKED', 'PAYLOAD_TRIGGERED', 'CREDENTIALS_ENTERED', 'REPORTED', 'SAFE_IGNORED', 'FAILED', 'COMPLETED')),
  opened_at TEXT,
  clicked_at TEXT,
  payload_triggered_at TEXT,
  reported_at TEXT,
  completed_at TEXT,
  risk_delta REAL DEFAULT 0,
  training_recommended TEXT,
  debrief_viewed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE
);

-- 12. Simulation Events
CREATE TABLE IF NOT EXISTS simulation_events (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  simulation_id TEXT NOT NULL,
  campaign_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  scenario_id TEXT NOT NULL,
  channel TEXT NOT NULL,
  event_type TEXT NOT NULL,
  timestamp TEXT NOT NULL DEFAULT (DATETIME('now')),
  risk_weight REAL NOT NULL DEFAULT 0,
  safe_metadata TEXT DEFAULT '{}',
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (simulation_id) REFERENCES simulations(id) ON DELETE CASCADE,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE
);

-- 13. Voice Sessions
CREATE TABLE IF NOT EXISTS voice_sessions (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  scenario_id TEXT NOT NULL,
  current_state TEXT NOT NULL DEFAULT 'INTRODUCTION',
  transcript TEXT NOT NULL DEFAULT '[]',
  verification_passed INTEGER NOT NULL DEFAULT 0,
  secret_disclosed INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'IN_PROGRESS' CHECK(status IN ('IN_PROGRESS', 'COMPLETED', 'TERMINATED_BY_EMPLOYEE', 'FAILED', 'TIMEOUT')),
  started_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  ended_at TEXT,
  FOREIGN KEY (simulation_id) REFERENCES simulations(id) ON DELETE CASCADE,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE
);

-- 14. Training Courses (Master Modules)
CREATE TABLE IF NOT EXISTS training_courses (
  id TEXT PRIMARY KEY,
  organization_id TEXT,
  title TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK(category IN ('EMAIL_SECURITY', 'SMS_SECURITY', 'VOICE_SECURITY', 'SOCIAL_ENGINEERING', 'ACCOUNT_SECURITY', 'COMPLIANCE')),
  difficulty TEXT NOT NULL CHECK(difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  duration_minutes INTEGER NOT NULL DEFAULT 10,
  description TEXT NOT NULL,
  modules TEXT NOT NULL,
  assessment_id TEXT,
  is_system INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- 15. Assessments
CREATE TABLE IF NOT EXISTS assessments (
  id TEXT PRIMARY KEY,
  course_id TEXT,
  title TEXT NOT NULL,
  passing_score INTEGER NOT NULL DEFAULT 80,
  questions TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (course_id) REFERENCES training_courses(id) ON DELETE CASCADE
);

-- 16. Training Assignments
CREATE TABLE IF NOT EXISTS training_assignments (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  campaign_id TEXT,
  simulation_id TEXT,
  trigger_reason TEXT NOT NULL DEFAULT 'MANUAL',
  status TEXT NOT NULL DEFAULT 'ASSIGNED' CHECK(status IN ('ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE')),
  progress_percent INTEGER NOT NULL DEFAULT 0,
  score_pre_assessment REAL,
  score_post_assessment REAL,
  assigned_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  completed_at TEXT,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES training_courses(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
  FOREIGN KEY (simulation_id) REFERENCES simulations(id) ON DELETE SET NULL
);

-- 17. Assessment Attempts
CREATE TABLE IF NOT EXISTS assessment_attempts (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL,
  assignment_id TEXT,
  employee_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  attempt_type TEXT NOT NULL,
  score REAL NOT NULL,
  passed INTEGER NOT NULL,
  answers TEXT NOT NULL DEFAULT '{}',
  completed_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  FOREIGN KEY (assignment_id) REFERENCES training_assignments(id) ON DELETE SET NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- 18. Risk Profiles
CREATE TABLE IF NOT EXISTS risk_profiles (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  employee_id TEXT,
  department_id TEXT,
  profile_type TEXT NOT NULL,
  security_score REAL NOT NULL DEFAULT 100.0,
  risk_level TEXT NOT NULL DEFAULT 'LOW',
  phishing_susceptibility REAL DEFAULT 0.0,
  smishing_susceptibility REAL DEFAULT 0.0,
  vishing_susceptibility REAL DEFAULT 0.0,
  reporting_rate REAL DEFAULT 0.0,
  pre_training_avg_score REAL DEFAULT 0.0,
  post_training_avg_score REAL DEFAULT 0.0,
  delta_improvement REAL DEFAULT 0.0,
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- 19. Risk History
CREATE TABLE IF NOT EXISTS risk_history (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  recorded_date TEXT NOT NULL,
  security_score REAL NOT NULL,
  risk_level TEXT NOT NULL,
  reason_event TEXT,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 20. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  organization_id TEXT,
  actor_id TEXT,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  details TEXT DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);

-- 21. Compliance Frameworks
CREATE TABLE IF NOT EXISTS compliance_frameworks (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PARTIAL',
  evidence_score REAL NOT NULL DEFAULT 0.0,
  requirements TEXT NOT NULL DEFAULT '[]',
  last_assessed_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  UNIQUE(organization_id, code)
);

-- 22. Integrations
CREATE TABLE IF NOT EXISTS integrations (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  is_enabled INTEGER NOT NULL DEFAULT 0,
  config TEXT DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'NOT_CONFIGURED',
  last_sync_at TEXT,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  UNIQUE(organization_id, type)
);

-- 23. Learning Paths (Visual Learning Journeys)
CREATE TABLE IF NOT EXISTS learning_paths (
  id TEXT PRIMARY KEY,
  organization_id TEXT,
  title TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT DEFAULT 'BEGINNER',
  estimated_minutes INTEGER DEFAULT 45,
  badge_reward TEXT DEFAULT 'SECURITY_CHAMPION',
  is_system INTEGER DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- 24. Learning Path Modules Junction
CREATE TABLE IF NOT EXISTS learning_path_modules (
  id TEXT PRIMARY KEY,
  path_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  FOREIGN KEY (path_id) REFERENCES learning_paths(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES training_courses(id) ON DELETE CASCADE
);

-- 25. Training Certificates (Official PDF/Digital Certificates)
CREATE TABLE IF NOT EXISTS training_certificates (
  id TEXT PRIMARY KEY,
  certificate_id TEXT NOT NULL UNIQUE,
  organization_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  course_title TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  score REAL NOT NULL,
  issued_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  verification_hash TEXT NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES training_courses(id) ON DELETE CASCADE
);

-- 26. Employee Achievements (Security Champions Program)
CREATE TABLE IF NOT EXISTS employee_achievements (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  badge_code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  awarded_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  UNIQUE(employee_id, badge_code)
);

-- 27. Training External Resources (Safe Curated Guidance)
CREATE TABLE IF NOT EXISTS training_external_resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  source_organization TEXT NOT NULL,
  category TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  is_verified INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_org ON employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_dept ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_org ON campaigns(organization_id);
CREATE INDEX IF NOT EXISTS idx_simulations_org ON simulations(organization_id);
CREATE INDEX IF NOT EXISTS idx_simulations_emp ON simulations(employee_id);
CREATE INDEX IF NOT EXISTS idx_sim_events_org ON simulation_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_train_assign_org ON training_assignments(organization_id);
CREATE INDEX IF NOT EXISTS idx_risk_prof_org ON risk_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_org ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_certs_emp ON training_certificates(employee_id);
CREATE INDEX IF NOT EXISTS idx_achieve_emp ON employee_achievements(employee_id);
