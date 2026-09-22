// TypeScript Domain Types for LockPhish

export type Role = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'CAMPAIGN_MANAGER' | 'TRAINER' | 'EMPLOYEE';

export type Channel = 'EMAIL' | 'SMS' | 'VOICE' | 'MULTI_STAGE';

export type Category = 
  | 'BILLING' 
  | 'FINANCE' 
  | 'IT_SUPPORT' 
  | 'HR' 
  | 'PAYROLL' 
  | 'ACCOUNT_SECURITY' 
  | 'MFA' 
  | 'DELIVERY' 
  | 'VENDOR' 
  | 'EXECUTIVE_IMPERSONATION' 
  | 'SOCIAL_ENGINEERING' 
  | 'PASSWORD_SECURITY' 
  | 'DATA_PROTECTION' 
  | 'REMOTE_WORK' 
  | 'CLOUD_SECURITY';

export type Difficulty = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type CampaignStatus = 'DRAFT' | 'VALIDATED' | 'SCHEDULED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'STOPPED' | 'ARCHIVED';

export type SimulationStatus = 
  | 'PENDING' 
  | 'DELIVERED' 
  | 'OPENED' 
  | 'INSPECTED' 
  | 'LINK_CLICKED' 
  | 'PAYLOAD_TRIGGERED' 
  | 'CREDENTIALS_ENTERED' 
  | 'REPORTED' 
  | 'SAFE_IGNORED' 
  | 'FAILED' 
  | 'COMPLETED';

export type TrainingStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';

export interface User {
  id: string;
  organization_id: string | null;
  email: string;
  full_name: string;
  role: Role;
  employee_id?: string;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  industry?: string;
  size_range?: string;
  risk_policy?: Record<string, any>;
  safety_whitelist?: string[];
  created_at?: string;
}

export interface Department {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  manager_name?: string;
  employee_count?: number;
  avg_risk_score?: number;
}

export interface Group {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  member_count?: number;
}

export interface Employee {
  id: string;
  organization_id: string;
  user_id?: string;
  user_role?: string;
  email: string;
  first_name: string;
  last_name: string;
  department_id?: string;
  department_name?: string;
  job_title?: string;
  phone_number?: string;
  status: 'ACTIVE' | 'INVITED' | 'INACTIVE';
  current_risk_score: number;
  current_risk_level: RiskLevel;
  simulations_received: number;
  simulations_failed: number;
  simulations_reported: number;
  trainings_assigned: number;
  trainings_completed: number;
  created_at: string;
}

export interface Scenario {
  id: string;
  name: string;
  code: string;
  channel: Channel;
  category: Category;
  difficulty: Difficulty;
  description: string;
  sender_profile: {
    name?: string;
    email?: string;
    phone?: string;
    reply_to?: string;
    return_path?: string;
    spoofed_domain?: string;
    spf_pass?: boolean;
    dkim_pass?: boolean;
    caller_id?: string;
    sender_id?: string;
    title?: string;
  };
  payload_config: {
    subject?: string;
    body_html?: string;
    body_text?: string;
    smish_text?: string;
    voice_persona?: string;
    voice_opening?: string;
    simulation_link?: string;
    landing_url?: string;
    fake_landing_type?: string;
    attachment_name?: string;
    states?: Record<string, any>;
    stages?: any[];
  };
  learning_indicators: Array<{
    type?: string;
    title: string;
    description: string;
  }>;
  decision_tree?: Record<string, any>;
  is_system_template: number;
}

export interface Campaign {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  channel: Channel;
  status: CampaignStatus;
  target_type: 'ALL' | 'DEPARTMENT' | 'GROUP' | 'CUSTOM';
  target_filter?: {
    department_ids?: string[];
    group_ids?: string[];
    employee_ids?: string[];
  };
  scenario_ids: string[];
  difficulty?: string;
  start_time?: string;
  end_time?: string;
  training_auto_assign: number;
  safety_review_passed: number;
  target_count?: number;
  completed_count?: number;
  reported_count?: number;
  compromised_count?: number;
  creator_name?: string;
  created_at: string;
  targets?: any[];
}

export interface Simulation {
  id: string;
  organization_id: string;
  campaign_id: string;
  campaign_name?: string;
  campaign_description?: string;
  employee_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  department_name?: string;
  scenario_id: string;
  scenario_name?: string;
  scenario_category?: Category;
  scenario_difficulty?: Difficulty;
  channel: Channel;
  stage_number: number;
  total_stages: number;
  status: SimulationStatus;
  opened_at?: string;
  clicked_at?: string;
  reported_at?: string;
  completed_at?: string;
  risk_delta?: number;
  training_recommended?: any[];
  debrief_viewed?: number;
  sender_profile: Scenario['sender_profile'];
  payload_config: Scenario['payload_config'];
  learning_indicators: Scenario['learning_indicators'];
  decision_tree?: Scenario['decision_tree'];
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  category: string;
  difficulty: Difficulty;
  duration_minutes: number;
  description: string;
  modules: any[];
  assessment_id?: string;
  assessment_title?: string;
  passing_score?: number;
  assigned_count?: number;
  completed_count?: number;
}

export interface TrainingAssignment {
  id: string;
  course_id: string;
  course_title: string;
  course_code: string;
  course_category: string;
  course_difficulty: Difficulty;
  duration_minutes: number;
  description?: string;
  course_description?: string;
  modules: any[];
  status: TrainingStatus;
  progress_percent: number;
  score_pre_assessment?: number;
  score_post_assessment?: number;
  assessment_id?: string;
  assessment_title?: string;
  passing_score?: number;
  assigned_at: string;
  completed_at?: string;
}

export interface AuditLog {
  id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  resource: string;
  resource_id?: string;
  ip_address?: string;
  details: Record<string, any>;
  created_at: string;
}

export interface ComplianceFramework {
  id: string;
  code: string;
  name: string;
  status: 'COMPLIANT' | 'PARTIAL' | 'NEEDS_ATTENTION';
  evidence_score: number;
  metrics: {
    training_completion_rate: number;
    simulation_coverage: number;
    reporting_efficacy: number;
  };
  last_assessed_at: string;
}
