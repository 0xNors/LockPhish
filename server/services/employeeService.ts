import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { run, get, all, transaction } from '../database/db.js';
import { AuditService } from './auditService.js';

export class EmployeeService {
  /**
   * List employees with filtering, searching, department names, and risk indicators
   */
  static async listEmployees(orgId: string, params: {
    department_id?: string;
    status?: string;
    risk_level?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const { department_id, status, risk_level, search, limit = 200, offset = 0 } = params;

    // Auto-sync any users belonging to this organization into employees table
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

    let query = `
      SELECT 
        e.*,
        d.name as department_name,
        u.last_login_at,
        u.role as user_role
      FROM employees e
      LEFT JOIN departments d ON d.id = e.department_id
      LEFT JOIN users u ON u.id = e.user_id
      WHERE e.organization_id = ?
    `;
    const queryParams: any[] = [orgId];

    if (department_id && department_id !== 'ALL' && department_id !== 'undefined' && department_id !== 'null') {
      query += ' AND e.department_id = ?';
      queryParams.push(department_id);
    }

    if (status && status !== 'ALL' && status !== 'undefined' && status !== 'null') {
      query += ' AND e.status = ?';
      queryParams.push(status);
    }

    if (risk_level && risk_level !== 'ALL' && risk_level !== 'undefined' && risk_level !== 'null') {
      query += ' AND e.current_risk_level = ?';
      queryParams.push(risk_level);
    }

    if (search && search !== 'undefined' && search !== 'null' && search.trim()) {
      query += ' AND (e.first_name LIKE ? OR e.last_name LIKE ? OR (e.first_name || " " || e.last_name) LIKE ? OR e.email LIKE ? OR e.job_title LIKE ? OR d.name LIKE ?)';
      const s = `%${search.trim()}%`;
      queryParams.push(s, s, s, s, s, s);
    }

    query += ' ORDER BY e.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    const employees = await all(query, queryParams);

    const countQuery = `
      SELECT COUNT(*) as count 
      FROM employees e 
      LEFT JOIN departments d ON d.id = e.department_id
      WHERE e.organization_id = ?
      ${department_id && department_id !== 'ALL' && department_id !== 'undefined' && department_id !== 'null' ? ' AND e.department_id = ?' : ''}
      ${status && status !== 'ALL' && status !== 'undefined' && status !== 'null' ? ' AND e.status = ?' : ''}
      ${risk_level && risk_level !== 'ALL' && risk_level !== 'undefined' && risk_level !== 'null' ? ' AND e.current_risk_level = ?' : ''}
      ${search && search !== 'undefined' && search !== 'null' && search.trim() ? ' AND (e.first_name LIKE ? OR e.last_name LIKE ? OR (e.first_name || " " || e.last_name) LIKE ? OR e.email LIKE ? OR e.job_title LIKE ? OR d.name LIKE ?)' : ''}
    `;
    const countParams = queryParams.slice(0, -2);
    const countRow = await get<{ count: number }>(countQuery, countParams);

    return {
      employees,
      total: countRow ? countRow.count : employees.length,
      limit,
      offset
    };
  }

  /**
   * Create Employee and auto-provision / invite user account
   */
  static async createEmployee(orgId: string, data: {
    first_name: string;
    last_name: string;
    email: string;
    department_id?: string;
    job_title?: string;
    phone_number?: string;
    role?: 'EMPLOYEE' | 'TRAINER' | 'CAMPAIGN_MANAGER' | 'ORG_ADMIN';
    password?: string;
  }, actor: { id: string; name: string; role: string }) {
    const cleanEmail = data.email.toLowerCase().trim();

    const existingEmp = await get('SELECT id FROM employees WHERE organization_id = ? AND email = ?', [orgId, cleanEmail]);
    if (existingEmp) {
      throw new Error(`An employee with email '${cleanEmail}' already exists in this organization.`);
    }

    const employeeId = uuidv4();
    const userId = uuidv4();
    const assignedRole = data.role || 'EMPLOYEE';

    // If department_id is missing or empty, assign to the organization's primary department
    let targetDeptId = data.department_id;
    if (!targetDeptId || targetDeptId === 'unassigned' || targetDeptId.trim() === '') {
      const defaultDept = await get<any>('SELECT id FROM departments WHERE organization_id = ? ORDER BY created_at ASC LIMIT 1', [orgId]);
      targetDeptId = defaultDept ? defaultDept.id : null;
    }

    const rawPassword = data.password || 'TemporaryPassword123!';
    const passwordHash = await bcrypt.hash(rawPassword, 10);
    const initialStatus = 'ACTIVE';

    await transaction(async () => {
      // 1. Create User
      await run(`
        INSERT INTO users (id, organization_id, email, password_hash, full_name, role, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
      `, [userId, orgId, cleanEmail, passwordHash, `${data.first_name.trim()} ${data.last_name.trim()}`, assignedRole, initialStatus]);

      // 2. Create Employee
      await run(`
        INSERT INTO employees (id, organization_id, user_id, email, first_name, last_name, department_id, job_title, phone_number, status, current_risk_score, current_risk_level, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 100.0, 'LOW', DATETIME('now'), DATETIME('now'))
      `, [employeeId, orgId, userId, cleanEmail, data.first_name.trim(), data.last_name.trim(), targetDeptId || null, data.job_title || 'Staff Member', data.phone_number || null, initialStatus]);

      // 3. Create initial Risk Profile
      await run(`
        INSERT INTO risk_profiles (id, organization_id, employee_id, profile_type, security_score, risk_level, updated_at)
        VALUES (?, ?, ?, 'EMPLOYEE', 100.0, 'LOW', DATETIME('now'))
      `, [uuidv4(), orgId, employeeId]);

      // 4. Record initial Risk History
      const today = new Date().toISOString().split('T')[0];
      await run(`
        INSERT INTO risk_history (id, organization_id, employee_id, recorded_date, security_score, risk_level, reason_event, created_at)
        VALUES (?, ?, ?, ?, 100.0, 'LOW', 'INITIAL_ONBOARDING', DATETIME('now'))
      `, [uuidv4(), orgId, employeeId, today]);
    });

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'EMPLOYEE_CREATED',
      resource: 'EMPLOYEE',
      resource_id: employeeId,
      details: { email: cleanEmail, name: `${data.first_name} ${data.last_name}`, department_id: targetDeptId }
    });

    return this.getEmployeeDetail(orgId, employeeId);
  }

  /**
   * Seed 2-3 realistic sample employees for a specific department folder (1-Click feature)
   */
  static async seedSampleDepartmentEmployees(orgId: string, departmentId: string, actor: { id: string; name: string; role: string }) {
    const org = await get<any>('SELECT * FROM organizations WHERE id = ?', [orgId]);
    if (!org) throw new Error('Organization not found.');

    const dept = await get<any>('SELECT * FROM departments WHERE id = ? AND organization_id = ?', [departmentId, orgId]);
    if (!dept) throw new Error('Department not found.');

    const domain = org.domain || 'company.internal';
    const deptName = dept.name.toLowerCase();

    let sampleStaff: Array<{ firstName: string; lastName: string; title: string; score: number; level: string; role: 'EMPLOYEE' | 'TRAINER' | 'CAMPAIGN_MANAGER' }> = [];

    if (deptName.includes('engineer') || deptName.includes('it')) {
      sampleStaff = [
        { firstName: 'Alex', lastName: 'Rivera', title: 'Senior DevOps & Cloud Engineer', score: 95, level: 'LOW', role: 'EMPLOYEE' },
        { firstName: 'Devina', lastName: 'Chen', title: 'Full-Stack Software Architect', score: 88, level: 'LOW', role: 'EMPLOYEE' },
        { firstName: 'Marcus', lastName: 'Vance', title: 'IT Systems Administrator', score: 92, level: 'LOW', role: 'TRAINER' }
      ];
    } else if (deptName.includes('finance') || deptName.includes('account')) {
      sampleStaff = [
        { firstName: 'Sophia', lastName: 'Martinez', title: 'Senior Financial Controller', score: 78, level: 'MEDIUM', role: 'EMPLOYEE' },
        { firstName: 'Liam', lastName: 'Gallagher', title: 'Accounts Payable Specialist', score: 68, level: 'MEDIUM', role: 'EMPLOYEE' },
        { firstName: 'Priya', lastName: 'Patel', title: 'Lead Treasury & Payroll Officer', score: 84, level: 'LOW', role: 'EMPLOYEE' }
      ];
    } else if (deptName.includes('exec') || deptName.includes('leader')) {
      sampleStaff = [
        { firstName: 'Jonathan', lastName: 'Drake', title: 'Chief Technology Officer', score: 90, level: 'LOW', role: 'CAMPAIGN_MANAGER' },
        { firstName: 'Victoria', lastName: 'Sterling', title: 'VP of Global Operations', score: 85, level: 'LOW', role: 'EMPLOYEE' },
        { firstName: 'Eleanor', lastName: 'Hughes', title: 'Chief Risk & Information Officer', score: 94, level: 'LOW', role: 'TRAINER' }
      ];
    } else if (deptName.includes('human') || deptName.includes('hr')) {
      sampleStaff = [
        { firstName: 'Chloe', lastName: 'Bennett', title: 'Head of People & Culture', score: 76, level: 'MEDIUM', role: 'EMPLOYEE' },
        { firstName: 'Daniel', lastName: 'Washington', title: 'HR Operations & Onboarding Lead', score: 82, level: 'LOW', role: 'EMPLOYEE' },
        { firstName: 'Maya', lastName: 'Lin', title: 'Senior Technical Recruiter', score: 86, level: 'LOW', role: 'EMPLOYEE' }
      ];
    } else if (deptName.includes('sale') || deptName.includes('market')) {
      sampleStaff = [
        { firstName: 'Ethan', lastName: 'Harper', title: 'Senior Enterprise Account Executive', score: 64, level: 'HIGH', role: 'EMPLOYEE' },
        { firstName: 'Olivia', lastName: 'Rossi', title: 'Director of Demand Generation', score: 79, level: 'MEDIUM', role: 'EMPLOYEE' },
        { firstName: 'Lucas', lastName: 'Wright', title: 'Lead Customer Success Manager', score: 83, level: 'LOW', role: 'EMPLOYEE' }
      ];
    } else {
      sampleStaff = [
        { firstName: 'Jordan', lastName: 'Taylor', title: 'Senior Operations Lead', score: 88, level: 'LOW', role: 'EMPLOYEE' },
        { firstName: 'Samira', lastName: 'Khan', title: 'Quality Assurance Specialist', score: 82, level: 'LOW', role: 'EMPLOYEE' }
      ];
    }

    const createdEmployees: any[] = [];

    for (const staff of sampleStaff) {
      let baseEmail = `${staff.firstName.toLowerCase()}.${staff.lastName.toLowerCase()}@${domain}`;
      const existing = await get('SELECT id FROM employees WHERE organization_id = ? AND email = ?', [orgId, baseEmail]);
      if (existing) {
        baseEmail = `${staff.firstName.toLowerCase()}.${staff.lastName.toLowerCase()}${Math.floor(Math.random() * 89 + 10)}@${domain}`;
      }

      const empId = uuidv4();
      const userId = uuidv4();
      const passwordHash = await bcrypt.hash('LockPhish2026!', 10);

      await transaction(async () => {
        await run(`
          INSERT INTO users (id, organization_id, email, password_hash, full_name, role, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', DATETIME('now'), DATETIME('now'))
        `, [userId, orgId, baseEmail, passwordHash, `${staff.firstName} ${staff.lastName}`, staff.role]);

        await run(`
          INSERT INTO employees (id, organization_id, user_id, email, first_name, last_name, department_id, job_title, status, current_risk_score, current_risk_level, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?, DATETIME('now'), DATETIME('now'))
        `, [empId, orgId, userId, baseEmail, staff.firstName, staff.lastName, departmentId, staff.title, staff.score, staff.level]);

        await run(`
          INSERT INTO risk_profiles (id, organization_id, employee_id, profile_type, security_score, risk_level, updated_at)
          VALUES (?, ?, ?, 'EMPLOYEE', ?, ?, DATETIME('now'))
        `, [uuidv4(), orgId, empId, staff.score, staff.level]);

        const today = new Date().toISOString().split('T')[0];
        await run(`
          INSERT INTO risk_history (id, organization_id, employee_id, recorded_date, security_score, risk_level, reason_event, created_at)
          VALUES (?, ?, ?, ?, ?, ?, 'INITIAL_ONBOARDING', DATETIME('now'))
        `, [uuidv4(), orgId, empId, today, staff.score, staff.level]);
      });

      const detail = await this.getEmployeeDetail(orgId, empId);
      createdEmployees.push(detail);
    }

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'DEPARTMENT_STAFF_SEEDED',
      resource: 'DEPARTMENT',
      resource_id: departmentId,
      details: { department_name: dept.name, count: createdEmployees.length }
    });

    return createdEmployees;
  }

  /**
   * Detailed Employee Security Profile
   */
  static async getEmployeeDetail(orgId: string, employeeId: string) {
    const employee = await get<any>(`
      SELECT e.*, d.name as department_name, u.role as user_role, u.last_login_at
      FROM employees e
      LEFT JOIN departments d ON d.id = e.department_id
      LEFT JOIN users u ON u.id = e.user_id
      WHERE e.id = ? AND e.organization_id = ?
    `, [employeeId, orgId]);

    if (!employee) throw new Error('Employee not found in this organization.');

    // Simulation History
    const simulations = await all<any>(`
      SELECT s.*, c.name as campaign_name, sc.name as scenario_name, sc.category as scenario_category
      FROM simulations s
      JOIN campaigns c ON c.id = s.campaign_id
      JOIN scenarios sc ON sc.id = s.scenario_id
      WHERE s.employee_id = ?
      ORDER BY s.created_at DESC
      LIMIT 50
    `, [employeeId]);

    // Training Assignments
    const trainings = await all<any>(`
      SELECT ta.*, tc.title as course_title, tc.category as course_category, tc.difficulty as course_difficulty
      FROM training_assignments ta
      JOIN training_courses tc ON tc.id = ta.course_id
      WHERE ta.employee_id = ?
      ORDER BY ta.assigned_at DESC
      LIMIT 50
    `, [employeeId]);

    // Risk History Timeline
    const riskHistory = await all<any>(`
      SELECT * FROM risk_history WHERE employee_id = ? ORDER BY created_at ASC
    `, [employeeId]);

    // Behavioral Events
    const events = await all<any>(`
      SELECT * FROM simulation_events WHERE employee_id = ? ORDER BY timestamp DESC LIMIT 50
    `, [employeeId]);

    return {
      ...employee,
      simulations,
      trainings,
      risk_history: riskHistory,
      recent_events: events.map(e => ({
        ...e,
        safe_metadata: e.safe_metadata ? JSON.parse(e.safe_metadata) : {}
      }))
    };
  }

  /**
   * Update Employee
   */
  static async updateEmployee(orgId: string, employeeId: string, data: {
    first_name?: string;
    last_name?: string;
    department_id?: string;
    job_title?: string;
    phone_number?: string;
    status?: 'ACTIVE' | 'INVITED' | 'INACTIVE';
  }, actor: { id: string; name: string; role: string }) {
    const emp = await get<any>('SELECT * FROM employees WHERE id = ? AND organization_id = ?', [employeeId, orgId]);
    if (!emp) throw new Error('Employee not found.');

    await run(`
      UPDATE employees
      SET first_name = COALESCE(?, first_name),
          last_name = COALESCE(?, last_name),
          department_id = COALESCE(?, department_id),
          job_title = COALESCE(?, job_title),
          phone_number = COALESCE(?, phone_number),
          status = COALESCE(?, status),
          updated_at = DATETIME('now')
      WHERE id = ? AND organization_id = ?
    `, [data.first_name, data.last_name, data.department_id, data.job_title, data.phone_number, data.status, employeeId, orgId]);

    if (data.status && emp.user_id) {
      await run('UPDATE users SET status = ? WHERE id = ?', [data.status === 'INACTIVE' ? 'SUSPENDED' : 'ACTIVE', emp.user_id]);
    }

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'EMPLOYEE_UPDATED',
      resource: 'EMPLOYEE',
      resource_id: employeeId,
      details: data
    });

    return this.getEmployeeDetail(orgId, employeeId);
  }

  /**
   * Permanently Delete Employee & Associated User Account
   */
  static async deleteEmployee(orgId: string, employeeId: string, actor: { id: string; name: string; role: string }) {
    const emp = await get<any>('SELECT * FROM employees WHERE id = ? AND organization_id = ?', [employeeId, orgId]);
    if (!emp) throw new Error('Employee not found.');

    await transaction(async () => {
      await run('DELETE FROM simulation_events WHERE employee_id = ?', [employeeId]);
      await run('DELETE FROM voice_sessions WHERE employee_id = ?', [employeeId]);
      await run('DELETE FROM simulations WHERE employee_id = ?', [employeeId]);
      await run('DELETE FROM campaign_targets WHERE employee_id = ?', [employeeId]);
      await run('DELETE FROM training_assignments WHERE employee_id = ?', [employeeId]);
      await run('DELETE FROM assessment_attempts WHERE employee_id = ?', [employeeId]);
      await run('DELETE FROM risk_history WHERE employee_id = ?', [employeeId]);
      await run('DELETE FROM risk_profiles WHERE employee_id = ?', [employeeId]);
      await run('DELETE FROM employee_groups WHERE employee_id = ?', [employeeId]);

      await run('DELETE FROM employees WHERE id = ? AND organization_id = ?', [employeeId, orgId]);

      if (emp.user_id) {
        await run('DELETE FROM users WHERE id = ? AND organization_id = ?', [emp.user_id, orgId]);
      }
    });

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'EMPLOYEE_DELETED',
      resource: 'EMPLOYEE',
      resource_id: employeeId,
      details: { email: emp.email, name: `${emp.first_name} ${emp.last_name}` }
    });

    return { success: true, deleted_id: employeeId };
  }

  /**
   * Deactivate Employee (Soft Deactivation)
   */
  static async deactivateEmployee(orgId: string, employeeId: string, actor: { id: string; name: string; role: string }) {
    return this.updateEmployee(orgId, employeeId, { status: 'INACTIVE' }, actor);
  }
}
