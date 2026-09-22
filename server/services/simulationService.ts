import { v4 as uuidv4 } from 'uuid';
import { run, get, all, transaction } from '../database/db.js';
import { AuditService } from './auditService.js';
import { RiskEngine } from './riskEngine.js';
import { ScenarioService } from './scenarioService.js';

export class SimulationService {
  /**
   * Get active simulations assigned to an employee (Employee Missions)
   */
  static async getEmployeeMissions(employeeId: string) {
    const rows = await all<any>(`
      SELECT 
        s.*,
        c.name as campaign_name,
        c.description as campaign_description,
        sc.name as scenario_name,
        sc.category as scenario_category,
        sc.difficulty as scenario_difficulty,
        sc.sender_profile,
        sc.payload_config,
        sc.learning_indicators,
        sc.decision_tree,
        org.name as org_name
      FROM simulations s
      JOIN campaigns c ON c.id = s.campaign_id
      JOIN scenarios sc ON sc.id = s.scenario_id
      JOIN organizations org ON org.id = s.organization_id
      WHERE s.employee_id = ? AND c.status = 'RUNNING'
      ORDER BY s.created_at DESC
    `, [employeeId]);

    const emp = await get<any>('SELECT * FROM employees WHERE id = ?', [employeeId]);

    return rows.map(r => {
      const parsedScenario = {
        ...r,
        sender_profile: typeof r.sender_profile === 'string' ? JSON.parse(r.sender_profile) : r.sender_profile,
        payload_config: typeof r.payload_config === 'string' ? JSON.parse(r.payload_config) : r.payload_config,
        learning_indicators: typeof r.learning_indicators === 'string' ? JSON.parse(r.learning_indicators) : r.learning_indicators,
        decision_tree: typeof r.decision_tree === 'string' ? JSON.parse(r.decision_tree) : r.decision_tree,
        training_recommended: typeof r.training_recommended === 'string' ? JSON.parse(r.training_recommended) : (r.training_recommended || [])
      };

      // Apply dynamic variation
      return ScenarioService.personalizeScenario(parsedScenario, emp || {}, r.org_name, r.id);
    });
  }

  /**
   * Get specific simulation by ID with personalized data
   */
  static async getSimulationById(simulationId: string) {
    const row = await get<any>(`
      SELECT 
        s.*,
        c.name as campaign_name,
        c.status as campaign_status,
        sc.name as scenario_name,
        sc.category as scenario_category,
        sc.difficulty as scenario_difficulty,
        sc.sender_profile,
        sc.payload_config,
        sc.learning_indicators,
        sc.decision_tree,
        e.first_name, e.last_name, e.email, e.job_title, e.department_id,
        d.name as department_name,
        org.name as org_name
      FROM simulations s
      JOIN campaigns c ON c.id = s.campaign_id
      JOIN scenarios sc ON sc.id = s.scenario_id
      JOIN employees e ON e.id = s.employee_id
      LEFT JOIN departments d ON d.id = e.department_id
      JOIN organizations org ON org.id = s.organization_id
      WHERE s.id = ?
    `, [simulationId]);

    if (!row) throw new Error('Simulation not found.');

    const parsed = {
      ...row,
      sender_profile: typeof row.sender_profile === 'string' ? JSON.parse(row.sender_profile) : row.sender_profile,
      payload_config: typeof row.payload_config === 'string' ? JSON.parse(row.payload_config) : row.payload_config,
      learning_indicators: typeof row.learning_indicators === 'string' ? JSON.parse(row.learning_indicators) : row.learning_indicators,
      decision_tree: typeof row.decision_tree === 'string' ? JSON.parse(row.decision_tree) : row.decision_tree,
      training_recommended: typeof row.training_recommended === 'string' ? JSON.parse(row.training_recommended) : (row.training_recommended || [])
    };

    return ScenarioService.personalizeScenario(parsed, {
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      department_name: row.department_name
    }, row.org_name, row.id);
  }

  /**
   * Record Behavioral Simulation Event
   * Strict Security Boundary: NEVER saves credentials or sensitive secrets
   */
  static async recordSimulationEvent(data: {
    simulation_id: string;
    event_type: string;
    raw_payload?: any;
    client_ip?: string;
  }) {
    const sim = await this.getSimulationById(data.simulation_id);
    const eventId = uuidv4();

    // Map UI multi-stage event types to database supported event types
    let dbEventType = data.event_type;
    const safeMetadata: Record<string, any> = {
      recorded_at: new Date().toISOString(),
      client_ip: data.client_ip || '127.0.0.1',
      stage: data.raw_payload?.stage || sim.stage_number || 1
    };

    let riskWeight = 0;
    let newSimStatus = sim.status;

    if (data.event_type === 'DECISION_MADE') {
      const choice = data.raw_payload?.choice;
      safeMetadata.decision_choice = choice;
      safeMetadata.time_to_decision = data.raw_payload?.time_to_decision;
      if (choice === 'REPORT') {
        dbEventType = 'REPORTED_PHISH';
        riskWeight = -15;
        newSimStatus = 'REPORTED';
        await run('UPDATE simulations SET status = "REPORTED", reported_at = DATETIME("now") WHERE id = ?', [sim.id]);
        await run('UPDATE employees SET simulations_reported = simulations_reported + 1 WHERE id = ?', [sim.employee_id]);
      } else if (choice === 'CONTACT_IT') {
        dbEventType = 'LINK_INSPECTED';
        riskWeight = -10;
      } else if (choice === 'UNLOCK' || choice === 'VERIFY') {
        dbEventType = 'LINK_CLICKED';
        riskWeight = 15;
        newSimStatus = 'LINK_CLICKED';
      } else {
        dbEventType = 'LINK_INSPECTED';
        riskWeight = 0;
      }
    } else if (data.event_type === 'FOLLOW_UP_TRIGGERED') {
      dbEventType = 'OPENED';
      safeMetadata.stage_name = 'STAGE_3_PRESSURE_FOLLOWUP';
    } else if (data.event_type === 'LOGIN_PAGE_OPENED') {
      dbEventType = 'LINK_CLICKED';
      riskWeight = 10;
      safeMetadata.portal_type = data.raw_payload?.portal_type || 'MICROSOFT_SSO';
    } else if (data.event_type === 'FIELD_FOCUSED') {
      dbEventType = 'LINK_INSPECTED';
      safeMetadata.focused_field = data.raw_payload?.field_name;
    } else if (data.event_type === 'TRAINING_STARTED' || data.event_type === 'TRAINING_COMPLETED' || data.event_type === 'ASSESSMENT_PASSED') {
      dbEventType = 'DEBRIEF_COMPLETED';
      safeMetadata.action_name = data.event_type;
    } else if (data.event_type === 'OPENED') {
      riskWeight = 2;
      if (sim.status === 'DELIVERED' || sim.status === 'PENDING') newSimStatus = 'OPENED';
      await run('UPDATE simulations SET opened_at = COALESCE(opened_at, DATETIME("now")), status = ? WHERE id = ?', [newSimStatus, sim.id]);
    } else if (data.event_type === 'HEADER_INSPECTED' || data.event_type === 'SENDER_INSPECTED' || data.event_type === 'LINK_INSPECTED') {
      riskWeight = -3;
      safeMetadata.inspected_item = data.event_type;
    } else if (data.event_type === 'LINK_CLICKED' || data.event_type === 'ATTACHMENT_OPENED') {
      riskWeight = 25;
      newSimStatus = 'LINK_CLICKED';
      await run(`
        UPDATE simulations 
        SET clicked_at = COALESCE(clicked_at, DATETIME("now")), status = ?, updated_at = DATETIME("now")
        WHERE id = ?
      `, [newSimStatus, sim.id]);
      await run('UPDATE employees SET simulations_failed = simulations_failed + 1 WHERE id = ?', [sim.employee_id]);
    } else if (data.event_type === 'CREDENTIAL_SUBMISSION_ATTEMPTED') {
      riskWeight = 40;
      newSimStatus = 'CREDENTIALS_ENTERED';
      safeMetadata.interception_type = 'SENSITIVE_SECRET_PREVENTED';
      safeMetadata.redacted_fields = ['username', 'password'];
      await run(`
        UPDATE simulations 
        SET status = 'CREDENTIALS_ENTERED', completed_at = DATETIME("now"), updated_at = DATETIME("now")
        WHERE id = ?
      `, [sim.id]);
      await run('UPDATE campaign_targets SET status = "COMPLETED", completed_at = DATETIME("now") WHERE campaign_id = ? AND employee_id = ?', [sim.campaign_id, sim.employee_id]);
    } else if (data.event_type === 'SMS_REPLIED') {
      riskWeight = 10;
      safeMetadata.reply_length = typeof data.raw_payload?.text === 'string' ? data.raw_payload.text.length : 0;
    } else if (data.event_type === 'REPORTED_PHISH' || data.event_type === 'REPORTED_SMISH' || data.event_type === 'REPORTED_VISH') {
      riskWeight = -15;
      newSimStatus = 'REPORTED';
      await run(`
        UPDATE simulations 
        SET reported_at = DATETIME("now"), status = 'REPORTED', completed_at = DATETIME("now"), updated_at = DATETIME("now")
        WHERE id = ?
      `, [sim.id]);
      await run('UPDATE campaign_targets SET status = "COMPLETED", completed_at = DATETIME("now") WHERE campaign_id = ? AND employee_id = ?', [sim.campaign_id, sim.employee_id]);
      await run('UPDATE employees SET simulations_reported = simulations_reported + 1 WHERE id = ?', [sim.employee_id]);
    } else if (data.event_type === 'DEBRIEF_COMPLETED') {
      await run('UPDATE simulations SET debrief_viewed = 1 WHERE id = ?', [sim.id]);
    }

    // Insert behavioral event with valid database schema event type
    await run(`
      INSERT INTO simulation_events (id, organization_id, simulation_id, campaign_id, employee_id, scenario_id, channel, event_type, timestamp, risk_weight, safe_metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'), ?, ?)
    `, [
      eventId,
      sim.organization_id,
      sim.id,
      sim.campaign_id,
      sim.employee_id,
      sim.scenario_id,
      sim.channel,
      dbEventType,
      riskWeight,
      JSON.stringify(safeMetadata)
    ]);

    // Recalculate Risk & Generate Recommendations
    const updatedRisk = await RiskEngine.recalculateEmployeeRisk(sim.organization_id, sim.employee_id, `SIMULATION_${dbEventType}`);

    // If compromised or unsafe decision, recommend relevant training course
    let recommendedTraining: any[] = [];
    if (['LINK_CLICKED', 'CREDENTIAL_SUBMISSION_ATTEMPTED', 'CALL_SECRET_DISCLOSED'].includes(dbEventType) || newSimStatus === 'CREDENTIALS_ENTERED') {
      recommendedTraining = await RiskEngine.generateTrainingRecommendations(sim.organization_id, sim.employee_id, sim.scenario_category, sim.channel);
      await run('UPDATE simulations SET training_recommended = ? WHERE id = ?', [JSON.stringify(recommendedTraining), sim.id]);
    }

    return {
      simulation_id: sim.id,
      status: newSimStatus,
      event_type: dbEventType,
      risk_score: updatedRisk.security_score,
      risk_level: updatedRisk.risk_level,
      training_recommended: recommendedTraining
    };
  }

  /**
   * Launch a direct security simulation mission for an individual employee
   */
  static async launchEmployeeSimulation(orgId: string, employeeId: string, scenarioId?: string) {
    const emp = await get<any>('SELECT * FROM employees WHERE id = ? AND organization_id = ?', [employeeId, orgId]);
    if (!emp) throw new Error('Employee not found in this organization.');

    let scenario: any = null;
    if (scenarioId) {
      scenario = await get<any>('SELECT * FROM scenarios WHERE id = ? OR code = ?', [scenarioId, scenarioId]);
    }
    if (!scenario) {
      scenario = await get<any>('SELECT * FROM scenarios WHERE is_system_template = 1 ORDER BY RANDOM() LIMIT 1');
    }
    if (!scenario) {
      throw new Error('No simulation scenarios found in library.');
    }

    const campaignId = uuidv4();
    const simId = uuidv4();

    await transaction(async () => {
      // 1. Create Drill Campaign
      await run(`
        INSERT INTO campaigns (id, organization_id, name, description, channel, status, target_type, scenario_ids, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'RUNNING', 'CUSTOM', ?, DATETIME('now'), DATETIME('now'))
      `, [campaignId, orgId, `Security Assessment for ${emp.first_name} ${emp.last_name}`, `Single-employee simulated assessment on ${scenario.name}`, scenario.channel, JSON.stringify([scenario.id])]);

      // 2. Create Campaign Target
      await run(`
        INSERT INTO campaign_targets (id, campaign_id, employee_id, scenario_id, status, sent_at)
        VALUES (?, ?, ?, ?, 'SENT', DATETIME('now'))
      `, [uuidv4(), campaignId, employeeId, scenario.id]);

      // 3. Create Simulation Record
      await run(`
        INSERT INTO simulations (id, organization_id, campaign_id, employee_id, scenario_id, channel, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'DELIVERED', DATETIME('now'), DATETIME('now'))
      `, [simId, orgId, campaignId, employeeId, scenario.id, scenario.channel]);

      // 4. Update employee simulations received
      await run('UPDATE employees SET simulations_received = simulations_received + 1 WHERE id = ?', [employeeId]);
    });

    return this.getSimulationById(simId);
  }

  /**
   * Safe Simulation Replay Generator
   */
  static async getSimulationReplay(simulationId: string) {
    const sim = await this.getSimulationById(simulationId);
    const events = await all<any>(`
      SELECT * FROM simulation_events WHERE simulation_id = ? ORDER BY timestamp ASC
    `, [simulationId]);

    let voiceSession = null;
    if (sim.channel === 'VOICE') {
      voiceSession = await get<any>('SELECT * FROM voice_sessions WHERE simulation_id = ?', [simulationId]);
      if (voiceSession && voiceSession.transcript) {
        voiceSession.transcript = JSON.parse(voiceSession.transcript);
      }
    }

    return {
      simulation: sim,
      events: events.map(e => ({
        ...e,
        safe_metadata: e.safe_metadata ? JSON.parse(e.safe_metadata) : {}
      })),
      voice_session: voiceSession
    };
  }
}
