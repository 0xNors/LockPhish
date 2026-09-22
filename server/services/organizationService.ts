import { v4 as uuidv4 } from 'uuid';
import { run, get, all, transaction } from '../database/db.js';
import { AuditService } from './auditService.js';

export class OrganizationService {
  static async getOrganization(orgId: string) {
    const org = await get<any>('SELECT * FROM organizations WHERE id = ?', [orgId]);
    if (!org) throw new Error('Organization not found.');
    return {
      ...org,
      risk_policy: org.risk_policy ? JSON.parse(org.risk_policy) : {},
      safety_whitelist: org.safety_whitelist ? JSON.parse(org.safety_whitelist) : []
    };
  }

  static async updateSettings(orgId: string, data: {
    name?: string;
    industry?: string;
    size_range?: string;
    risk_policy?: Record<string, any>;
    safety_whitelist?: string[];
  }, actor: { id: string; name: string; role: string }) {
    const current = await this.getOrganization(orgId);

    const updatedName = data.name || current.name;
    const updatedIndustry = data.industry || current.industry;
    const updatedSize = data.size_range || current.size_range;
    const updatedRiskPolicy = data.risk_policy ? JSON.stringify(data.risk_policy) : current.risk_policy;
    const updatedWhitelist = data.safety_whitelist ? JSON.stringify(data.safety_whitelist) : current.safety_whitelist;

    await run(`
      UPDATE organizations
      SET name = ?, industry = ?, size_range = ?, risk_policy = ?, safety_whitelist = ?, updated_at = DATETIME('now')
      WHERE id = ?
    `, [updatedName, updatedIndustry, updatedSize, typeof updatedRiskPolicy === 'string' ? updatedRiskPolicy : JSON.stringify(updatedRiskPolicy), typeof updatedWhitelist === 'string' ? updatedWhitelist : JSON.stringify(updatedWhitelist), orgId]);

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'ORGANIZATION_SETTINGS_UPDATED',
      resource: 'ORGANIZATION_SETTINGS',
      resource_id: orgId,
      details: { updated_fields: Object.keys(data) }
    });

    return this.getOrganization(orgId);
  }

  // Departments
  static async getDepartments(orgId: string) {
    // Auto-sync any unlinked users into employees table so counts are always 100% accurate
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
        const newEmpId = uuidv4();

        await run(`
          INSERT INTO employees (id, organization_id, user_id, email, first_name, last_name, department_id, job_title, status, current_risk_score, current_risk_level, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 100.0, 'LOW', DATETIME('now'), DATETIME('now'))
        `, [newEmpId, orgId, u.id, u.email, firstName, lastName, defaultDept?.id || null, u.role === 'ORG_ADMIN' ? 'Chief Administrator' : 'Staff Member']);

        await run(`
          INSERT INTO risk_profiles (id, organization_id, employee_id, profile_type, security_score, risk_level, updated_at)
          VALUES (?, ?, ?, 'EMPLOYEE', 100.0, 'LOW', DATETIME('now'))
          ON CONFLICT(id) DO NOTHING
        `, [uuidv4(), orgId, newEmpId]);
      }
    }

    // Auto-assign any unassigned employees to default department if available
    const defaultDept = await get<any>('SELECT id FROM departments WHERE organization_id = ? AND name = "Executive & Leadership" LIMIT 1', [orgId])
      || await get<any>('SELECT id FROM departments WHERE organization_id = ? ORDER BY created_at ASC LIMIT 1', [orgId]);
    if (defaultDept) {
      await run('UPDATE employees SET department_id = ? WHERE organization_id = ? AND (department_id IS NULL OR department_id = "" OR department_id = "unassigned")', [defaultDept.id, orgId]);
    }

    const depts = await all<any>(`
      SELECT d.*, 
        COUNT(e.id) as employee_count,
        AVG(COALESCE(e.current_risk_score, 100)) as avg_risk_score
      FROM departments d
      LEFT JOIN employees e ON e.department_id = d.id AND e.status != 'INACTIVE'
      WHERE d.organization_id = ?
      GROUP BY d.id
      ORDER BY d.name ASC
    `, [orgId]);

    return depts;
  }

  static async createDepartment(orgId: string, data: { name: string; description?: string; manager_name?: string }, actor: { id: string; name: string; role: string }) {
    const existing = await get('SELECT id FROM departments WHERE organization_id = ? AND name = ?', [orgId, data.name.trim()]);
    if (existing) {
      throw new Error(`A department named '${data.name}' already exists.`);
    }

    const id = uuidv4();
    await run(`
      INSERT INTO departments (id, organization_id, name, description, manager_name, created_at)
      VALUES (?, ?, ?, ?, ?, DATETIME('now'))
    `, [id, orgId, data.name.trim(), data.description || '', data.manager_name || '']);

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'DEPARTMENT_CREATED',
      resource: 'DEPARTMENT',
      resource_id: id,
      details: { name: data.name }
    });

    return { id, organization_id: orgId, name: data.name, description: data.description, manager_name: data.manager_name };
  }

  static async updateDepartment(orgId: string, deptId: string, data: { name?: string; description?: string; manager_name?: string }, actor: { id: string; name: string; role: string }) {
    const dept = await get('SELECT * FROM departments WHERE id = ? AND organization_id = ?', [deptId, orgId]);
    if (!dept) throw new Error('Department not found.');

    await run(`
      UPDATE departments
      SET name = COALESCE(?, name), description = COALESCE(?, description), manager_name = COALESCE(?, manager_name)
      WHERE id = ? AND organization_id = ?
    `, [data.name, data.description, data.manager_name, deptId, orgId]);

    return get('SELECT * FROM departments WHERE id = ?', [deptId]);
  }

  static async deleteDepartment(orgId: string, deptId: string, actor: { id: string; name: string; role: string }) {
    const dept = await get('SELECT * FROM departments WHERE id = ? AND organization_id = ?', [deptId, orgId]);
    if (!dept) throw new Error('Department not found.');

    await run('UPDATE employees SET department_id = NULL WHERE department_id = ?', [deptId]);
    await run('DELETE FROM departments WHERE id = ? AND organization_id = ?', [deptId, orgId]);

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'DEPARTMENT_DELETED',
      resource: 'DEPARTMENT',
      resource_id: deptId
    });

    return { success: true };
  }

  // Groups
  static async getGroups(orgId: string) {
    const groups = await all<any>(`
      SELECT g.*, COUNT(eg.employee_id) as member_count
      FROM groups g
      LEFT JOIN employee_groups eg ON eg.group_id = g.id
      WHERE g.organization_id = ?
      GROUP BY g.id
      ORDER BY g.name ASC
    `, [orgId]);
    return groups;
  }

  static async createGroup(orgId: string, data: { name: string; description?: string }, actor: { id: string; name: string; role: string }) {
    const id = uuidv4();
    await run(`
      INSERT INTO groups (id, organization_id, name, description, created_at)
      VALUES (?, ?, ?, ?, DATETIME('now'))
    `, [id, orgId, data.name.trim(), data.description || '']);

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'GROUP_CREATED',
      resource: 'GROUP',
      resource_id: id,
      details: { name: data.name }
    });

    return { id, organization_id: orgId, name: data.name, description: data.description };
  }
}
