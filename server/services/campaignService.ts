import { v4 as uuidv4 } from 'uuid';
import { run, get, all, transaction } from '../database/db.js';
import { AuditService } from './auditService.js';
import { ScenarioService } from './scenarioService.js';

export class CampaignService {
  /**
   * List campaigns for an organization with target metrics
   */
  static async listCampaigns(orgId: string, params: { status?: string; channel?: string; limit?: number; offset?: number }) {
    const { status, channel, limit = 100, offset = 0 } = params;

    let query = `
      SELECT c.*,
        u.full_name as creator_name,
        (SELECT COUNT(*) FROM campaign_targets WHERE campaign_id = c.id) as target_count,
        (SELECT COUNT(*) FROM simulations WHERE campaign_id = c.id AND status IN ('COMPLETED', 'REPORTED', 'FAILED', 'CREDENTIALS_ENTERED')) as completed_count,
        (SELECT COUNT(*) FROM simulations WHERE campaign_id = c.id AND status = 'REPORTED') as reported_count,
        (SELECT COUNT(*) FROM simulations WHERE campaign_id = c.id AND status IN ('LINK_CLICKED', 'PAYLOAD_TRIGGERED', 'CREDENTIALS_ENTERED', 'FAILED')) as compromised_count
      FROM campaigns c
      LEFT JOIN users u ON u.id = c.created_by
      WHERE c.organization_id = ?
    `;
    const queryParams: any[] = [orgId];

    if (status && status !== 'ALL') {
      query += ' AND c.status = ?';
      queryParams.push(status);
    }

    if (channel && channel !== 'ALL') {
      query += ' AND c.channel = ?';
      queryParams.push(channel);
    }

    query += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    const campaigns = await all<any>(query, queryParams);

    return campaigns.map(c => this.parseCampaign(c));
  }

  static async getCampaignById(orgId: string, campaignId: string) {
    const campaign = await get<any>(`
      SELECT c.*,
        u.full_name as creator_name,
        (SELECT COUNT(*) FROM campaign_targets WHERE campaign_id = c.id) as target_count,
        (SELECT COUNT(*) FROM simulations WHERE campaign_id = c.id AND status IN ('COMPLETED', 'REPORTED', 'FAILED', 'CREDENTIALS_ENTERED')) as completed_count,
        (SELECT COUNT(*) FROM simulations WHERE campaign_id = c.id AND status = 'REPORTED') as reported_count,
        (SELECT COUNT(*) FROM simulations WHERE campaign_id = c.id AND status IN ('LINK_CLICKED', 'PAYLOAD_TRIGGERED', 'CREDENTIALS_ENTERED', 'FAILED')) as compromised_count
      FROM campaigns c
      LEFT JOIN users u ON u.id = c.created_by
      WHERE c.id = ? AND c.organization_id = ?
    `, [campaignId, orgId]);

    if (!campaign) throw new Error('Campaign not found.');

    // Targets & Simulation details
    const targets = await all<any>(`
      SELECT ct.*, 
        e.first_name, e.last_name, e.email, e.job_title,
        d.name as department_name,
        s.name as scenario_name,
        sim.id as simulation_id,
        sim.status as simulation_status,
        sim.risk_delta,
        sim.opened_at,
        sim.clicked_at,
        sim.reported_at,
        sim.completed_at
      FROM campaign_targets ct
      JOIN employees e ON e.id = ct.employee_id
      LEFT JOIN departments d ON d.id = e.department_id
      JOIN scenarios s ON s.id = ct.scenario_id
      LEFT JOIN simulations sim ON sim.campaign_id = ct.campaign_id AND sim.employee_id = ct.employee_id
      WHERE ct.campaign_id = ?
      ORDER BY e.last_name ASC
    `, [campaignId]);

    return {
      ...this.parseCampaign(campaign),
      targets
    };
  }

  /**
   * Create a new Campaign
   */
  static async createCampaign(orgId: string, data: {
    name: string;
    description?: string;
    channel: 'EMAIL' | 'SMS' | 'VOICE' | 'MULTI_STAGE';
    target_type: 'ALL' | 'DEPARTMENT' | 'GROUP' | 'CUSTOM';
    target_filter?: { department_ids?: string[]; group_ids?: string[]; employee_ids?: string[] };
    scenario_ids: string[];
    difficulty?: string;
    start_time?: string;
    end_time?: string;
    training_auto_assign?: boolean;
    risk_policy?: Record<string, any>;
  }, actor: { id: string; name: string; role: string }) {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Campaign name is required.');
    }

    if (!data.scenario_ids || data.scenario_ids.length === 0) {
      throw new Error('Please select at least one scenario for the scenario pool.');
    }

    const id = uuidv4();
    const targetFilter = data.target_filter || {};
    const autoAssign = data.training_auto_assign !== false ? 1 : 0;

    await run(`
      INSERT INTO campaigns (id, organization_id, name, description, channel, status, target_type, target_filter, scenario_ids, difficulty, start_time, end_time, training_auto_assign, risk_policy, safety_review_passed, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'DRAFT', ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, DATETIME('now'), DATETIME('now'))
    `, [
      id,
      orgId,
      data.name.trim(),
      data.description || '',
      data.channel,
      data.target_type,
      JSON.stringify(targetFilter),
      JSON.stringify(data.scenario_ids),
      data.difficulty || 'MEDIUM',
      data.start_time || null,
      data.end_time || null,
      autoAssign,
      JSON.stringify(data.risk_policy || {}),
      actor.id
    ]);

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'CAMPAIGN_CREATED',
      resource: 'CAMPAIGN',
      resource_id: id,
      details: { name: data.name, channel: data.channel, target_type: data.target_type }
    });

    return this.getCampaignById(orgId, id);
  }

  /**
   * Pre-flight Safety Validation Review
   */
  static async validateCampaign(orgId: string, campaignId: string, actor: { id: string; name: string; role: string }) {
    const campaign = await this.getCampaignById(orgId, campaignId);
    const matchingEmployees = await this.resolveTargetEmployees(orgId, campaign.target_type, campaign.target_filter);

    if (matchingEmployees.length === 0) {
      throw new Error('No active employees matched the selected targeting criteria. Please add employees or adjust targeting.');
    }

    if (campaign.scenario_ids.length === 0) {
      throw new Error('Scenario pool is empty.');
    }

    await run(`
      UPDATE campaigns
      SET status = 'VALIDATED', safety_review_passed = 1, updated_at = DATETIME('now')
      WHERE id = ? AND organization_id = ?
    `, [campaignId, orgId]);

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'CAMPAIGN_VALIDATED',
      resource: 'CAMPAIGN',
      resource_id: campaignId,
      details: { target_count: matchingEmployees.length, safety_review: 'PASSED' }
    });

    return {
      validated: true,
      target_count: matchingEmployees.length,
      employees: matchingEmployees.map(e => ({ id: e.id, name: `${e.first_name} ${e.last_name}`, email: e.email }))
    };
  }

  /**
   * Launch Campaign (Dispatches simulation missions to employees)
   */
  static async launchCampaign(orgId: string, campaignId: string, actor: { id: string; name: string; role: string }) {
    const campaign = await this.getCampaignById(orgId, campaignId);

    if (campaign.status === 'RUNNING') {
      throw new Error('Campaign is already running.');
    }

    if (campaign.status === 'COMPLETED' || campaign.status === 'STOPPED') {
      throw new Error(`Cannot launch a campaign with status '${campaign.status}'.`);
    }

    const matchingEmployees = await this.resolveTargetEmployees(orgId, campaign.target_type, campaign.target_filter);

    if (matchingEmployees.length === 0) {
      throw new Error('Cannot launch campaign: 0 active target employees found. Please add employees first.');
    }

    await transaction(async () => {
      // 1. Update campaign status
      await run(`
        UPDATE campaigns
        SET status = 'RUNNING', safety_review_passed = 1, start_time = COALESCE(start_time, DATETIME('now')), updated_at = DATETIME('now')
        WHERE id = ? AND organization_id = ?
      `, [campaignId, orgId]);

      // 2. Generate targets & simulations
      for (const emp of matchingEmployees) {
        const scenario = await ScenarioService.selectScenarioForEmployee(emp.id, campaign.scenario_ids);
        const targetId = uuidv4();
        const simId = uuidv4();

        // Campaign target
        await run(`
          INSERT INTO campaign_targets (id, campaign_id, employee_id, scenario_id, status, sent_at)
          VALUES (?, ?, ?, ?, 'SENT', DATETIME('now'))
          ON CONFLICT(campaign_id, employee_id) DO UPDATE SET
            scenario_id = excluded.scenario_id,
            status = 'SENT',
            sent_at = DATETIME('now')
        `, [targetId, campaignId, emp.id, scenario.id]);

        // Simulation instance
        await run(`
          INSERT INTO simulations (id, organization_id, campaign_id, employee_id, scenario_id, channel, stage_number, total_stages, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, 1, ?, 'DELIVERED', DATETIME('now'), DATETIME('now'))
        `, [
          simId,
          orgId,
          campaignId,
          emp.id,
          scenario.id,
          campaign.channel,
          campaign.channel === 'MULTI_STAGE' ? 3 : 1
        ]);

        // Record Initial Event
        await run(`
          INSERT INTO simulation_events (id, organization_id, simulation_id, campaign_id, employee_id, scenario_id, channel, event_type, timestamp, risk_weight, safe_metadata)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'DELIVERED', DATETIME('now'), 0, ?)
        `, [
          uuidv4(),
          orgId,
          simId,
          campaignId,
          emp.id,
          scenario.id,
          campaign.channel,
          JSON.stringify({ delivery_status: 'SUCCESS', recipient_email: emp.email })
        ]);

        // Update employee simulation stats
        await run(`
          UPDATE employees
          SET simulations_received = simulations_received + 1, updated_at = DATETIME('now')
          WHERE id = ?
        `, [emp.id]);
      }
    });

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'CAMPAIGN_LAUNCHED',
      resource: 'CAMPAIGN',
      resource_id: campaignId,
      details: { name: campaign.name, channel: campaign.channel, dispatched_targets: matchingEmployees.length }
    });

    return this.getCampaignById(orgId, campaignId);
  }

  /**
   * Complete Campaign Successfully (Concludes campaign and sets status to COMPLETED)
   */
  static async completeCampaign(orgId: string, campaignId: string, actor: { id: string; name: string; role: string }) {
    await transaction(async () => {
      // 1. Update campaign status to COMPLETED with end_time
      await run(`
        UPDATE campaigns
        SET status = 'COMPLETED', end_time = COALESCE(end_time, DATETIME('now')), updated_at = DATETIME('now')
        WHERE id = ? AND organization_id = ?
      `, [campaignId, orgId]);

      // 2. Mark any remaining pending targets as COMPLETED
      await run(`
        UPDATE campaign_targets
        SET status = 'COMPLETED', completed_at = COALESCE(completed_at, DATETIME('now'))
        WHERE campaign_id = ? AND status IN ('PENDING', 'SENT')
      `, [campaignId]);

      // 3. Mark any open simulations as COMPLETED
      await run(`
        UPDATE simulations
        SET status = 'COMPLETED', completed_at = COALESCE(completed_at, DATETIME('now')), updated_at = DATETIME('now')
        WHERE campaign_id = ? AND status IN ('PENDING', 'DELIVERED', 'OPENED')
      `, [campaignId]);
    });

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'CAMPAIGN_COMPLETED',
      resource: 'CAMPAIGN',
      resource_id: campaignId,
      details: { status: 'COMPLETED', conclusion: 'SUCCESSFUL' }
    });

    return this.getCampaignById(orgId, campaignId);
  }

  /**
   * Pause Campaign
   */
  static async pauseCampaign(orgId: string, campaignId: string, actor: { id: string; name: string; role: string }) {
    await run(`
      UPDATE campaigns
      SET status = 'PAUSED', updated_at = DATETIME('now')
      WHERE id = ? AND organization_id = ? AND status = 'RUNNING'
    `, [campaignId, orgId]);

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'CAMPAIGN_PAUSED',
      resource: 'CAMPAIGN',
      resource_id: campaignId
    });

    return this.getCampaignById(orgId, campaignId);
  }

  /**
   * Resume Campaign
   */
  static async resumeCampaign(orgId: string, campaignId: string, actor: { id: string; name: string; role: string }) {
    await run(`
      UPDATE campaigns
      SET status = 'RUNNING', updated_at = DATETIME('now')
      WHERE id = ? AND organization_id = ? AND status = 'PAUSED'
    `, [campaignId, orgId]);

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'CAMPAIGN_RESUMED',
      resource: 'CAMPAIGN',
      resource_id: campaignId
    });

    return this.getCampaignById(orgId, campaignId);
  }

  /**
   * EMERGENCY STOP (Kill Switch)
   */
  static async emergencyStop(orgId: string, campaignId: string, actor: { id: string; name: string; role: string }) {
    await transaction(async () => {
      await run(`
        UPDATE campaigns
        SET status = 'STOPPED', end_time = DATETIME('now'), updated_at = DATETIME('now')
        WHERE id = ? AND organization_id = ?
      `, [campaignId, orgId]);

      await run(`
        UPDATE campaign_targets
        SET status = 'CANCELLED'
        WHERE campaign_id = ? AND status IN ('PENDING', 'SENT')
      `, [campaignId]);
    });

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'EMERGENCY_STOP_TRIGGERED',
      resource: 'CAMPAIGN',
      resource_id: campaignId,
      details: { severity: 'HIGH_PRIORITY_ADMIN_KILL_SWITCH' }
    });

    return this.getCampaignById(orgId, campaignId);
  }

  /**
   * Update / Edit an existing Campaign
   */
  static async updateCampaign(orgId: string, campaignId: string, data: {
    name?: string;
    description?: string;
    difficulty?: string;
    target_type?: string;
    target_filter?: any;
    scenario_ids?: string[];
    training_auto_assign?: boolean;
    risk_policy?: Record<string, any>;
  }, actor: { id: string; name: string; role: string }) {
    const existing = await this.getCampaignById(orgId, campaignId);

    const updatedName = data.name !== undefined ? data.name.trim() : existing.name;
    const updatedDesc = data.description !== undefined ? data.description : existing.description;
    const updatedDiff = data.difficulty !== undefined ? data.difficulty : existing.difficulty;
    const updatedTargetType = data.target_type !== undefined ? data.target_type : existing.target_type;
    const updatedTargetFilter = data.target_filter !== undefined ? JSON.stringify(data.target_filter) : JSON.stringify(existing.target_filter || {});
    const updatedScenIds = data.scenario_ids !== undefined ? JSON.stringify(data.scenario_ids) : JSON.stringify(existing.scenario_ids || []);
    const updatedAutoAssign = data.training_auto_assign !== undefined ? (data.training_auto_assign ? 1 : 0) : existing.training_auto_assign;
    const updatedRiskPolicy = data.risk_policy !== undefined ? JSON.stringify(data.risk_policy) : JSON.stringify(existing.risk_policy || {});

    await run(`
      UPDATE campaigns
      SET name = ?, description = ?, difficulty = ?, target_type = ?, target_filter = ?, scenario_ids = ?, training_auto_assign = ?, risk_policy = ?, updated_at = DATETIME('now')
      WHERE id = ? AND organization_id = ?
    `, [
      updatedName,
      updatedDesc,
      updatedDiff,
      updatedTargetType,
      updatedTargetFilter,
      updatedScenIds,
      updatedAutoAssign,
      updatedRiskPolicy,
      campaignId,
      orgId
    ]);

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'CAMPAIGN_UPDATED',
      resource: 'CAMPAIGN',
      resource_id: campaignId,
      details: { name: updatedName, difficulty: updatedDiff }
    });

    return this.getCampaignById(orgId, campaignId);
  }

  /**
   * Delete Campaign (Cascade delete all associated simulation instances & targets)
   */
  static async deleteCampaign(orgId: string, campaignId: string, actor: { id: string; name: string; role: string }) {
    const existing = await this.getCampaignById(orgId, campaignId);

    await transaction(async () => {
      // 1. Delete simulation events
      await run('DELETE FROM simulation_events WHERE campaign_id = ?', [campaignId]);
      // 2. Delete voice sessions
      await run('DELETE FROM voice_sessions WHERE simulation_id IN (SELECT id FROM simulations WHERE campaign_id = ?)', [campaignId]);
      // 3. Delete simulations
      await run('DELETE FROM simulations WHERE campaign_id = ?', [campaignId]);
      // 4. Delete campaign targets
      await run('DELETE FROM campaign_targets WHERE campaign_id = ?', [campaignId]);
      // 5. Delete campaign record
      await run('DELETE FROM campaigns WHERE id = ? AND organization_id = ?', [campaignId, orgId]);
    });

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'CAMPAIGN_DELETED',
      resource: 'CAMPAIGN',
      resource_id: campaignId,
      details: { name: existing.name, channel: existing.channel }
    });

    return { success: true, deleted_id: campaignId };
  }

  private static async resolveTargetEmployees(orgId: string, targetType: string, filter: any): Promise<any[]> {
    if (targetType === 'ALL') {
      return all('SELECT id, first_name, last_name, email, department_id FROM employees WHERE organization_id = ? AND status != "INACTIVE"', [orgId]);
    }

    if (targetType === 'DEPARTMENT') {
      const deptIds = filter.department_ids || [];
      if (deptIds.length === 0) return [];
      const placeholders = deptIds.map(() => '?').join(',');
      return all(`SELECT id, first_name, last_name, email, department_id FROM employees WHERE organization_id = ? AND status != "INACTIVE" AND department_id IN (${placeholders})`, [orgId, ...deptIds]);
    }

    if (targetType === 'GROUP') {
      const groupIds = filter.group_ids || [];
      if (groupIds.length === 0) return [];
      const placeholders = groupIds.map(() => '?').join(',');
      return all(`
        SELECT DISTINCT e.id, e.first_name, e.last_name, e.email, e.department_id 
        FROM employees e
        JOIN employee_groups eg ON eg.employee_id = e.id
        WHERE e.organization_id = ? AND e.status != "INACTIVE" AND eg.group_id IN (${placeholders})
      `, [orgId, ...groupIds]);
    }

    if (targetType === 'CUSTOM') {
      const empIds = filter.employee_ids || [];
      if (empIds.length === 0) return [];
      const placeholders = empIds.map(() => '?').join(',');
      return all(`SELECT id, first_name, last_name, email, department_id FROM employees WHERE organization_id = ? AND status != "INACTIVE" AND id IN (${placeholders})`, [orgId, ...empIds]);
    }

    return [];
  }

  private static parseCampaign(c: any) {
    return {
      ...c,
      target_filter: typeof c.target_filter === 'string' ? JSON.parse(c.target_filter) : (c.target_filter || {}),
      scenario_ids: typeof c.scenario_ids === 'string' ? JSON.parse(c.scenario_ids) : (c.scenario_ids || []),
      risk_policy: typeof c.risk_policy === 'string' ? JSON.parse(c.risk_policy) : (c.risk_policy || {})
    };
  }
}
