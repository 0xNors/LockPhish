import { all, get } from '../database/db.js';

export interface UnifiedUserActivity {
  id: string;
  timestamp: string;
  user_id?: string;
  employee_id?: string;
  user_name: string;
  user_email: string;
  department_name?: string;
  category: 'AUTH' | 'SIMULATION' | 'TRAINING' | 'RISK' | 'ADMIN';
  action: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk_impact?: number;
  ip_address?: string;
  metadata?: Record<string, any>;
}

export class ActivityService {
  /**
   * Get unified chronological activity stream of all user and employee actions
   */
  static async getActivityStream(orgId: string, params: {
    category?: string;
    employee_id?: string;
    severity?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const { category, employee_id, severity, search, limit = 100, offset = 0 } = params;

    const activities: UnifiedUserActivity[] = [];

    // 1. Simulation Behavioral Events (LEFT JOIN to prevent any event drop)
    if (!category || category === 'ALL' || category === 'SIMULATION') {
      let simQuery = `
        SELECT 
          se.id, se.timestamp, se.event_type, se.channel, se.risk_weight, se.safe_metadata,
          e.id as employee_id, e.first_name, e.last_name, e.email,
          d.name as department_name,
          sc.name as scenario_name, sc.category as scenario_category
        FROM simulation_events se
        LEFT JOIN employees e ON e.id = se.employee_id
        LEFT JOIN departments d ON d.id = e.department_id
        LEFT JOIN scenarios sc ON sc.id = se.scenario_id
        WHERE se.organization_id = ?
      `;
      const simParams: any[] = [orgId];
      if (employee_id) {
        simQuery += ' AND se.employee_id = ?';
        simParams.push(employee_id);
      }
      simQuery += ' ORDER BY se.timestamp DESC LIMIT 150';

      const simEvents = await all<any>(simQuery, simParams);

      for (const ev of simEvents) {
        let actSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
        let desc = `Interacted with ${ev.channel || 'Security'} simulation (${ev.scenario_name || ev.scenario_category || 'Phishing Exercise'}).`;

        if (ev.event_type === 'CREDENTIAL_SUBMISSION_ATTEMPTED') {
          actSeverity = 'CRITICAL';
          desc = `Submitted password on simulated phishing landing page for ${ev.scenario_name || 'Phishing'} scenario. (Intercepted & Redacted)`;
        } else if (ev.event_type === 'CALL_SECRET_DISCLOSED') {
          actSeverity = 'CRITICAL';
          desc = `Disclosed numeric verification code/secret during Voice Call. (Intercepted & Redacted)`;
        } else if (ev.event_type === 'LINK_CLICKED') {
          actSeverity = 'HIGH';
          desc = `Clicked simulated phishing hyperlink in ${ev.channel} mission.`;
        } else if (ev.event_type.startsWith('REPORTED')) {
          actSeverity = 'LOW';
          desc = `Safely detected and reported ${ev.channel} simulation mission as suspicious!`;
        } else if (ev.event_type === 'OPENED') {
          actSeverity = 'MEDIUM';
          desc = `Opened ${ev.channel} simulation email message.`;
        }

        const userName = ev.first_name ? `${ev.first_name} ${ev.last_name}` : 'Monitored User';
        const userEmail = ev.email || 'user@internal';

        activities.push({
          id: ev.id,
          timestamp: ev.timestamp,
          employee_id: ev.employee_id,
          user_name: userName,
          user_email: userEmail,
          department_name: ev.department_name || 'General',
          category: 'SIMULATION',
          action: ev.event_type,
          title: `Simulation: ${ev.event_type.replace(/_/g, ' ')}`,
          description: desc,
          severity: actSeverity,
          risk_impact: ev.risk_weight,
          metadata: ev.safe_metadata ? (typeof ev.safe_metadata === 'string' ? JSON.parse(ev.safe_metadata) : ev.safe_metadata) : {}
        });
      }
    }

    // 2. Training Assignments & Progress
    if (!category || category === 'ALL' || category === 'TRAINING') {
      let trainQuery = `
        SELECT 
          ta.id, ta.assigned_at, ta.completed_at, ta.status, ta.progress_percent, ta.score_post_assessment,
          e.id as employee_id, e.first_name, e.last_name, e.email,
          d.name as department_name,
          tc.title as course_title, tc.category as course_category
        FROM training_assignments ta
        LEFT JOIN employees e ON e.id = ta.employee_id
        LEFT JOIN departments d ON d.id = e.department_id
        LEFT JOIN training_courses tc ON tc.id = ta.course_id
        WHERE ta.organization_id = ?
      `;
      const trainParams: any[] = [orgId];
      if (employee_id) {
        trainQuery += ' AND ta.employee_id = ?';
        trainParams.push(employee_id);
      }
      trainQuery += ' ORDER BY ta.assigned_at DESC LIMIT 100';

      const trainEvents = await all<any>(trainQuery, trainParams);

      for (const t of trainEvents) {
        const time = t.completed_at || t.assigned_at;
        const isDone = t.status === 'COMPLETED';
        const userName = t.first_name ? `${t.first_name} ${t.last_name}` : 'Trained Employee';

        activities.push({
          id: `train-${t.id}`,
          timestamp: time,
          employee_id: t.employee_id,
          user_name: userName,
          user_email: t.email || 'user@internal',
          department_name: t.department_name || 'General',
          category: 'TRAINING',
          action: isDone ? 'COURSE_COMPLETED' : 'TRAINING_IN_PROGRESS',
          title: isDone ? 'Completed Training Course' : 'Training Module Active',
          description: isDone
            ? `Successfully finished "${t.course_title}" with score ${t.score_post_assessment || 100}%.`
            : `Progress: ${t.progress_percent}% on course "${t.course_title}".`,
          severity: isDone ? 'LOW' : 'MEDIUM',
          risk_impact: isDone ? -15 : 0
        });
      }
    }

    // 3. User Authentication & Administrative Audit Events
    if (!category || category === 'ALL' || category === 'AUTH' || category === 'ADMIN') {
      let auditQuery = `
        SELECT 
          al.id, al.created_at, al.actor_name, al.actor_role, al.action, al.resource, al.ip_address, al.details,
          u.id as user_id, u.email as user_email
        FROM audit_logs al
        LEFT JOIN users u ON u.id = al.actor_id
        WHERE (al.organization_id = ? OR al.organization_id IS NULL)
      `;
      const auditParams: any[] = [orgId];
      auditQuery += ' ORDER BY al.created_at DESC LIMIT 100';

      const auditEvents = await all<any>(auditQuery, auditParams);

      for (const a of auditEvents) {
        let isAuth = a.action.startsWith('LOGIN') || a.action.startsWith('ACCOUNT') || a.action.startsWith('PASSWORD');
        if (category === 'AUTH' && !isAuth) continue;
        if (category === 'ADMIN' && isAuth) continue;

        let actSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
        if (a.action === 'LOGIN_FAILED') actSeverity = 'HIGH';
        if (a.action.includes('STOP') || a.action.includes('KILL')) actSeverity = 'CRITICAL';

        activities.push({
          id: `audit-${a.id}`,
          timestamp: a.created_at,
          user_id: a.user_id,
          user_name: a.actor_name || 'System Actor',
          user_email: a.user_email || `${(a.actor_name || 'admin').toLowerCase().replace(/\s+/g, '.')}@internal`,
          category: isAuth ? 'AUTH' : 'ADMIN',
          action: a.action,
          title: a.action.replace(/_/g, ' '),
          description: `Executed ${a.action} on ${a.resource}.`,
          severity: actSeverity,
          ip_address: a.ip_address,
          metadata: a.details ? (typeof a.details === 'string' ? JSON.parse(a.details) : a.details) : {}
        });
      }
    }

    // Sort all activities chronologically descending
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply filtering
    let filtered = activities;
    if (severity && severity !== 'ALL') {
      filtered = filtered.filter(a => a.severity === severity);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(a =>
        a.user_name.toLowerCase().includes(s) ||
        a.user_email.toLowerCase().includes(s) ||
        a.action.toLowerCase().includes(s) ||
        a.description.toLowerCase().includes(s)
      );
    }

    const paginated = filtered.slice(offset, offset + limit);

    return {
      activities: paginated,
      total: filtered.length,
      limit,
      offset
    };
  }

  /**
   * Summary Activity Stats for live monitoring cards
   */
  static async getActivityStats(orgId: string) {
    const simToday = await get<any>(`
      SELECT 
        COUNT(*) as total_actions_today,
        SUM(CASE WHEN event_type IN ('LINK_CLICKED', 'CREDENTIAL_SUBMISSION_ATTEMPTED', 'CALL_SECRET_DISCLOSED') THEN 1 ELSE 0 END) as high_risk_events_today,
        SUM(CASE WHEN event_type IN ('REPORTED_PHISH', 'REPORTED_SMISH', 'REPORTED_VISH') THEN 1 ELSE 0 END) as reports_today
      FROM simulation_events
      WHERE organization_id = ?
    `, [orgId]);

    const activeUsersToday = await get<any>(`
      SELECT COUNT(DISTINCT actor_id) as active_logins_today
      FROM audit_logs
      WHERE organization_id = ? AND action = 'LOGIN_SUCCESS'
    `, [orgId]);

    const totalMonitoredEmployees = await get<any>(`
      SELECT COUNT(*) as count FROM employees WHERE organization_id = ? AND status != 'INACTIVE'
    `, [orgId]);

    return {
      monitored_workforce: totalMonitoredEmployees?.count || 0,
      total_actions_today: (simToday?.total_actions_today || 0) + (activeUsersToday?.active_logins_today || 0),
      high_risk_events_today: simToday?.high_risk_events_today || 0,
      reports_today: simToday?.reports_today || 0,
      active_users_today: activeUsersToday?.active_logins_today || 0
    };
  }
}
