import { v4 as uuidv4 } from 'uuid';
import { run, get, all } from '../database/db.js';
import { AuditService } from './auditService.js';

export class ScenarioService {
  /**
   * List Scenarios with category, channel, and difficulty filters
   */
  static async listScenarios(params: {
    organization_id?: string;
    channel?: string;
    category?: string;
    difficulty?: string;
    search?: string;
  }) {
    const { organization_id, channel, category, difficulty, search } = params;

    let query = 'SELECT * FROM scenarios WHERE (is_system_template = 1 OR organization_id = ? OR organization_id IS NULL)';
    const queryParams: any[] = [organization_id || 'system'];

    if (channel && channel !== 'ALL') {
      query += ' AND channel = ?';
      queryParams.push(channel);
    }

    if (category && category !== 'ALL') {
      query += ' AND category = ?';
      queryParams.push(category);
    }

    if (difficulty && difficulty !== 'ALL') {
      query += ' AND difficulty = ?';
      queryParams.push(difficulty);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY is_system_template ASC, created_at DESC';

    const rows = await all<any>(query, queryParams);

    return rows.map(r => this.parseScenario(r));
  }

  static async getScenarioById(id: string) {
    const row = await get<any>('SELECT * FROM scenarios WHERE id = ?', [id]);
    if (!row) throw new Error('Scenario not found.');
    return this.parseScenario(row);
  }

  /**
   * Create custom organizational scenario
   */
  static async createScenario(orgId: string, data: {
    name: string;
    channel: 'EMAIL' | 'SMS' | 'VOICE' | 'MULTI_STAGE';
    category: string;
    difficulty: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    sender_profile: Record<string, any>;
    payload_config: Record<string, any>;
    learning_indicators: Array<Record<string, any>>;
    decision_tree?: Record<string, any>;
  }, actor: { id: string; name: string; role: string }) {
    this.validateScenarioSafety(data);

    const id = uuidv4();
    const code = `CUSTOM_${data.channel}_${Date.now()}`;

    await run(`
      INSERT INTO scenarios (id, organization_id, name, code, channel, category, difficulty, description, sender_profile, payload_config, learning_indicators, decision_tree, is_system_template, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, DATETIME('now'))
    `, [
      id,
      orgId,
      data.name.trim(),
      code,
      data.channel,
      data.category,
      data.difficulty,
      data.description || 'Custom security awareness simulation scenario.',
      JSON.stringify(data.sender_profile || {}),
      JSON.stringify(data.payload_config || {}),
      JSON.stringify(data.learning_indicators || []),
      JSON.stringify(data.decision_tree || { actions: ['OPEN', 'CLICK', 'REPORT', 'DISCLOSE'] })
    ]);

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'SCENARIO_CREATED',
      resource: 'SCENARIO',
      resource_id: id,
      details: { name: data.name, channel: data.channel, category: data.category }
    });

    return this.getScenarioById(id);
  }

  /**
   * Delete custom scenario
   */
  static async deleteScenario(orgId: string, scenarioId: string, actor: { id: string; name: string; role: string }) {
    const scen = await get<any>('SELECT * FROM scenarios WHERE id = ? AND organization_id = ?', [scenarioId, orgId]);
    if (!scen) throw new Error('Scenario not found or cannot delete system template.');

    await run('DELETE FROM scenarios WHERE id = ? AND organization_id = ?', [scenarioId, orgId]);

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'SCENARIO_DELETED',
      resource: 'SCENARIO',
      resource_id: scenarioId
    });

    return { success: true };
  }

  /**
   * Scenario Freshness Algorithm & Adaptive Variation Generator
   */
  static async selectScenarioForEmployee(employeeId: string, scenarioPoolIds: string[]): Promise<any> {
    if (!scenarioPoolIds || scenarioPoolIds.length === 0) {
      throw new Error('Scenario pool is empty. Please select at least one scenario.');
    }

    const recentSimulations = await all<any>(`
      SELECT scenario_id, created_at 
      FROM simulations 
      WHERE employee_id = ? AND created_at >= DATETIME('now', '-90 days')
      ORDER BY created_at DESC
    `, [employeeId]);

    const recentScenarioIds = new Set(recentSimulations.map(s => s.scenario_id));
    let candidatePool = scenarioPoolIds.filter(id => !recentScenarioIds.has(id));

    if (candidatePool.length === 0) {
      candidatePool = [...scenarioPoolIds];
    }

    const selectedId = candidatePool[Math.floor(Math.random() * candidatePool.length)];
    return this.getScenarioById(selectedId);
  }

  /**
   * Inject dynamic variables to create unique scenario variations
   */
  static personalizeScenario(scenario: any, employee: any, orgName: string, simulationId: string): any {
    const referenceId = Math.floor(100000 + Math.random() * 900000).toString();
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const simulationLink = `/simulations/landing/${simulationId}`;

    const replaceVars = (text: string) => {
      if (!text) return text;
      return text
        .replace(/\{\{first_name\}\}/g, employee.first_name || 'Team Member')
        .replace(/\{\{last_name\}\}/g, employee.last_name || '')
        .replace(/\{\{email\}\}/g, employee.email || '')
        .replace(/\{\{company\}\}/g, orgName || 'Corporate')
        .replace(/\{\{department\}\}/g, employee.department_name || employee.department_id || 'General')
        .replace(/\{\{date\}\}/g, today)
        .replace(/\{\{reference_id\}\}/g, referenceId)
        .replace(/\{\{simulation_link\}\}/g, simulationLink);
    };

    const personalized = JSON.parse(JSON.stringify(scenario));

    if (personalized.payload_config) {
      if (personalized.payload_config.subject) {
        personalized.payload_config.subject = replaceVars(personalized.payload_config.subject);
      }
      if (personalized.payload_config.body_html) {
        personalized.payload_config.body_html = replaceVars(personalized.payload_config.body_html);
      }
      if (personalized.payload_config.body_text) {
        personalized.payload_config.body_text = replaceVars(personalized.payload_config.body_text);
      }
      if (personalized.payload_config.smish_text) {
        personalized.payload_config.smish_text = replaceVars(personalized.payload_config.smish_text);
      }
      if (personalized.payload_config.voice_opening) {
        personalized.payload_config.voice_opening = replaceVars(personalized.payload_config.voice_opening);
      }
      personalized.payload_config.simulation_link = simulationLink;
    }

    return personalized;
  }

  private static parseScenario(row: any) {
    const safeParse = (val: any, fallback: any) => {
      if (!val) return fallback;
      if (typeof val === 'object') return val;
      try {
        return JSON.parse(val);
      } catch {
        return fallback;
      }
    };

    return {
      ...row,
      sender_profile: safeParse(row.sender_profile, {}),
      payload_config: safeParse(row.payload_config, {}),
      learning_indicators: safeParse(row.learning_indicators, []),
      decision_tree: safeParse(row.decision_tree, {})
    };
  }

  private static validateScenarioSafety(data: any) {
    const jsonStr = JSON.stringify(data).toLowerCase();
    const prohibitedKeywords = ['malware.exe', 'trojan', 'real-bank-steal.com', 'metasploit', 'cobaltstrike'];
    for (const kw of prohibitedKeywords) {
      if (jsonStr.includes(kw)) {
        throw new Error(`Scenario content failed safety verification: prohibited keyword '${kw}' detected.`);
      }
    }
  }
}
