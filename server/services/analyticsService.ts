import { v4 as uuidv4 } from 'uuid';
import { get, all, run } from '../database/db.js';

export class AnalyticsService {
  /**
   * Comprehensive Organization Overview Analytics
   */
  static async getOrganizationOverview(orgId: string) {
    // Auto-sync unlinked users
    const unlinkedUsers = await all<any>(`
      SELECT u.* FROM users u
      LEFT JOIN employees e ON (e.user_id = u.id OR (e.organization_id = u.organization_id AND e.email = u.email))
      WHERE u.organization_id = ? AND e.id IS NULL
    `, [orgId]);

    if (unlinkedUsers.length > 0) {
      const execDept = await get<any>('SELECT id FROM departments WHERE organization_id = ? AND name = "Executive & Leadership" LIMIT 1', [orgId]);
      const defaultDept = execDept || await get<any>('SELECT id FROM departments WHERE organization_id = ? ORDER BY created_at ASC LIMIT 1', [orgId]);
      for (const u of unlinkedUsers) {
        const parts = (u.full_name || 'Admin User').trim().split(' ');
        const firstName = parts[0] || 'Admin';
        const lastName = parts.slice(1).join(' ') || 'User';

        await run(`
          INSERT INTO employees (id, organization_id, user_id, email, first_name, last_name, department_id, job_title, status, current_risk_score, current_risk_level, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 100.0, 'LOW', DATETIME('now'), DATETIME('now'))
        `, [uuidv4(), orgId, u.id, u.email, firstName, lastName, defaultDept?.id || null, u.role === 'ORG_ADMIN' ? 'Chief Administrator' : 'Staff Member']);
      }
    }

    // 1. Employee stats
    const empStats = await get<any>(`
      SELECT 
        COUNT(*) as total_employees,
        AVG(COALESCE(current_risk_score, 100)) as avg_risk_score,
        SUM(CASE WHEN current_risk_level = 'LOW' THEN 1 ELSE 0 END) as low_risk_count,
        SUM(CASE WHEN current_risk_level = 'MEDIUM' THEN 1 ELSE 0 END) as medium_risk_count,
        SUM(CASE WHEN current_risk_level = 'HIGH' THEN 1 ELSE 0 END) as high_risk_count,
        SUM(CASE WHEN current_risk_level = 'CRITICAL' THEN 1 ELSE 0 END) as critical_risk_count
      FROM employees 
      WHERE organization_id = ? AND status != 'INACTIVE'
    `, [orgId]);

    // 2. Campaign stats
    const campStats = await get<any>(`
      SELECT 
        COUNT(*) as total_campaigns,
        SUM(CASE WHEN status = 'RUNNING' THEN 1 ELSE 0 END) as active_campaigns,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_campaigns
      FROM campaigns
      WHERE organization_id = ?
    `, [orgId]);

    // 3. Simulation interaction stats
    const simStats = await get<any>(`
      SELECT 
        COUNT(*) as total_simulations,
        SUM(CASE WHEN status IN ('COMPLETED', 'REPORTED', 'FAILED', 'CREDENTIALS_ENTERED', 'LINK_CLICKED') THEN 1 ELSE 0 END) as completed_simulations,
        SUM(CASE WHEN status = 'REPORTED' THEN 1 ELSE 0 END) as reported_simulations,
        SUM(CASE WHEN status IN ('LINK_CLICKED', 'PAYLOAD_TRIGGERED', 'CREDENTIALS_ENTERED', 'FAILED') THEN 1 ELSE 0 END) as compromised_simulations
      FROM simulations
      WHERE organization_id = ?
    `, [orgId]);

    // 4. Training stats
    const trainStats = await get<any>(`
      SELECT 
        COUNT(*) as total_assigned,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_trainings,
        AVG(score_pre_assessment) as avg_pre_score,
        AVG(score_post_assessment) as avg_post_score
      FROM training_assignments
      WHERE organization_id = ?
    `, [orgId]);

    const totalSims = simStats?.total_simulations || 0;
    const reportingRate = totalSims > 0 ? Math.round(((simStats?.reported_simulations || 0) / totalSims) * 100) : 0;
    const compromiseRate = totalSims > 0 ? Math.round(((simStats?.compromised_simulations || 0) / totalSims) * 100) : 0;
    const trainingCompletionRate = (trainStats?.total_assigned || 0) > 0 ? Math.round(((trainStats?.completed_trainings || 0) / trainStats.total_assigned) * 100) : 0;

    const avgPre = trainStats?.avg_pre_score ? Math.round(trainStats.avg_pre_score * 10) / 10 : 0;
    const avgPost = trainStats?.avg_post_score ? Math.round(trainStats.avg_post_score * 10) / 10 : 0;
    const trainingDelta = (avgPost && avgPre) ? Math.round((avgPost - avgPre) * 10) / 10 : (avgPost || 0);

    return {
      employees: {
        total: empStats?.total_employees || 0,
        avg_security_score: Math.round((empStats?.avg_risk_score || 100) * 10) / 10,
        distribution: {
          LOW: empStats?.low_risk_count || 0,
          MEDIUM: empStats?.medium_risk_count || 0,
          HIGH: empStats?.high_risk_count || 0,
          CRITICAL: empStats?.critical_risk_count || 0
        }
      },
      campaigns: {
        total: campStats?.total_campaigns || 0,
        active: campStats?.active_campaigns || 0,
        completed: campStats?.completed_campaigns || 0
      },
      simulations: {
        total: totalSims,
        completed: simStats?.completed_simulations || 0,
        reported: simStats?.reported_simulations || 0,
        compromised: simStats?.compromised_simulations || 0,
        reporting_rate: reportingRate,
        compromise_rate: compromiseRate
      },
      training: {
        total_assigned: trainStats?.total_assigned || 0,
        completed: trainStats?.completed_trainings || 0,
        completion_rate: trainingCompletionRate,
        pre_training_avg: avgPre,
        post_training_avg: avgPost,
        improvement_delta: trainingDelta
      }
    };
  }

  /**
   * Channel Analytics (Email vs SMS vs Voice vs Multi-Stage)
   */
  static async getChannelAnalytics(orgId: string) {
    const channels = ['EMAIL', 'SMS', 'VOICE', 'MULTI_STAGE'];
    const channelData: Record<string, any> = {};

    for (const ch of channels) {
      const stats = await get<any>(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'REPORTED' THEN 1 ELSE 0 END) as reported,
          SUM(CASE WHEN status IN ('LINK_CLICKED', 'PAYLOAD_TRIGGERED', 'CREDENTIALS_ENTERED', 'FAILED') THEN 1 ELSE 0 END) as compromised,
          SUM(CASE WHEN status IN ('COMPLETED', 'REPORTED', 'FAILED') THEN 1 ELSE 0 END) as completed
        FROM simulations
        WHERE organization_id = ? AND channel = ?
      `, [orgId, ch]);

      const total = stats?.total || 0;
      channelData[ch] = {
        total,
        completed: stats?.completed || 0,
        reported: stats?.reported || 0,
        compromised: stats?.compromised || 0,
        reporting_rate: total > 0 ? Math.round(((stats?.reported || 0) / total) * 100) : 0,
        compromise_rate: total > 0 ? Math.round(((stats?.compromised || 0) / total) * 100) : 0
      };
    }

    return channelData;
  }

  /**
   * Department Risk Matrix / Heatmap
   */
  static async getDepartmentAnalytics(orgId: string) {
    const depts = await all<any>(`
      SELECT 
        d.id, d.name, d.manager_name,
        COUNT(e.id) as employee_count,
        AVG(COALESCE(e.current_risk_score, 100)) as avg_risk_score,
        SUM(e.simulations_received) as total_simulations,
        SUM(e.simulations_failed) as total_failures,
        SUM(e.simulations_reported) as total_reported,
        SUM(e.trainings_completed) as total_trainings_completed
      FROM departments d
      LEFT JOIN employees e ON e.department_id = d.id AND e.status != 'INACTIVE'
      WHERE d.organization_id = ?
      GROUP BY d.id
      ORDER BY avg_risk_score ASC
    `, [orgId]);

    return depts.map(d => {
      const avgScore = Math.round((d.avg_risk_score || 100) * 10) / 10;
      let riskLevel = 'LOW';
      if (avgScore < 40) riskLevel = 'CRITICAL';
      else if (avgScore < 65) riskLevel = 'HIGH';
      else if (avgScore < 85) riskLevel = 'MEDIUM';

      const totalSims = d.total_simulations || 0;
      return {
        id: d.id,
        name: d.name,
        manager_name: d.manager_name,
        employee_count: d.employee_count,
        avg_security_score: avgScore,
        risk_level: riskLevel,
        failure_rate: totalSims > 0 ? Math.round(((d.total_failures || 0) / totalSims) * 100) : 0,
        reporting_rate: totalSims > 0 ? Math.round(((d.total_reported || 0) / totalSims) * 100) : 0,
        trainings_completed: d.total_trainings_completed || 0
      };
    });
  }

  /**
   * Historical Risk Trends (30-day time series)
   */
  static async getRiskTrends(orgId: string, days = 30) {
    const rows = await all<any>(`
      SELECT 
        rh.recorded_date,
        AVG(rh.security_score) as avg_score,
        COUNT(DISTINCT rh.employee_id) as sample_size
      FROM risk_history rh
      WHERE rh.organization_id = ? AND rh.recorded_date >= DATE('now', '-' || ? || ' days')
      GROUP BY rh.recorded_date
      ORDER BY rh.recorded_date ASC
    `, [orgId, days]);

    return rows.map(r => ({
      date: r.recorded_date,
      security_score: Math.round((r.avg_score || 100) * 10) / 10,
      sample_size: r.sample_size
    }));
  }
}
