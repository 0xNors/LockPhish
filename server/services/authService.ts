import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { get, run, all, transaction } from '../database/db.js';
import { generateToken, AuthUser } from '../middleware/auth.js';
import { AuditService } from './auditService.js';

export class AuthService {
  /**
   * Register a new Organization along with its initial Super/Org Admin
   */
  static async registerOrganization(data: {
    org_name: string;
    org_domain: string;
    industry?: string;
    size_range?: string;
    admin_name: string;
    admin_email: string;
    admin_password: string;
  }) {
    const existingOrg = await get('SELECT id FROM organizations WHERE domain = ?', [data.org_domain.toLowerCase().trim()]);
    if (existingOrg) {
      throw new Error(`An organization with domain '${data.org_domain}' is already registered. Please choose another domain or sign in.`);
    }

    const existingUser = await get('SELECT id FROM users WHERE email = ?', [data.admin_email.toLowerCase().trim()]);
    if (existingUser) {
      throw new Error(`A user account with email '${data.admin_email}' already exists. Please log in.`);
    }

    if (data.admin_password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const orgId = uuidv4();
    const userId = uuidv4();
    const empId = uuidv4();
    const passwordHash = await bcrypt.hash(data.admin_password, 10);

    const nameParts = data.admin_name.trim().split(' ');
    const firstName = nameParts[0] || 'Admin';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    await transaction(async () => {
      // 1. Create Organization
      await run(`
        INSERT INTO organizations (id, name, domain, industry, size_range, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
      `, [orgId, data.org_name.trim(), data.org_domain.toLowerCase().trim(), data.industry || 'Technology', data.size_range || '1-50']);

      // 2. Create Initial Org Admin User
      await run(`
        INSERT INTO users (id, organization_id, email, password_hash, full_name, role, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'ORG_ADMIN', 'ACTIVE', DATETIME('now'), DATETIME('now'))
      `, [userId, orgId, data.admin_email.toLowerCase().trim(), passwordHash, data.admin_name.trim()]);

      // 3. Create default departments
      const deptIds = [
        { id: uuidv4(), name: 'Executive & Leadership', desc: 'C-Suite and executive management' },
        { id: uuidv4(), name: 'Engineering & IT', desc: 'Software development, DevOps, and internal IT' },
        { id: uuidv4(), name: 'Finance & Accounting', desc: 'Treasury, accounts payable, and payroll' },
        { id: uuidv4(), name: 'Human Resources', desc: 'Talent acquisition, employee relations, and benefits' },
        { id: uuidv4(), name: 'Sales & Marketing', desc: 'Customer outreach and commercial operations' }
      ];

      for (const d of deptIds) {
        await run(`
          INSERT INTO departments (id, organization_id, name, description, created_at)
          VALUES (?, ?, ?, ?, DATETIME('now'))
        `, [d.id, orgId, d.name, d.desc]);
      }

      // 4. Create Employee Record for the initial Admin
      await run(`
        INSERT INTO employees (id, organization_id, user_id, email, first_name, last_name, department_id, job_title, status, current_risk_score, current_risk_level, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Chief Executive / Admin', 'ACTIVE', 100.0, 'LOW', DATETIME('now'), DATETIME('now'))
      `, [empId, orgId, userId, data.admin_email.toLowerCase().trim(), firstName, lastName, deptIds[0].id]);

      // 5. Create initial Risk Profile & History for Admin
      await run(`
        INSERT INTO risk_profiles (id, organization_id, employee_id, profile_type, security_score, risk_level, updated_at)
        VALUES (?, ?, ?, 'EMPLOYEE', 100.0, 'LOW', DATETIME('now'))
      `, [uuidv4(), orgId, empId]);

      const today = new Date().toISOString().split('T')[0];
      await run(`
        INSERT INTO risk_history (id, organization_id, employee_id, recorded_date, security_score, risk_level, reason_event, created_at)
        VALUES (?, ?, ?, ?, 100.0, 'LOW', 'INITIAL_ONBOARDING', DATETIME('now'))
      `, [uuidv4(), orgId, empId, today]);

      // 6. Initialize compliance frameworks for org
      const frameworks = [
        { code: 'NIST_800_53', name: 'NIST SP 800-53 Rev 5 (AT-2, AT-3, IR-2)' },
        { code: 'ISO_27001', name: 'ISO/IEC 27001:2022 (A.7.2.2 Security Awareness)' },
        { code: 'SOC_2', name: 'SOC 2 Type II (CC2.2, CC2.3 Awareness Training)' },
        { code: 'HIPAA', name: 'HIPAA Security Rule (45 CFR § 164.308(a)(5))' },
        { code: 'PCI_DSS_4', name: 'PCI-DSS v4.0 (Requirement 12.6 Security Awareness)' },
        { code: 'GDPR', name: 'GDPR Article 39 (Staff Training & Awareness)' }
      ];

      for (const f of frameworks) {
        await run(`
          INSERT INTO compliance_frameworks (id, organization_id, code, name, status, evidence_score, last_assessed_at)
          VALUES (?, ?, ?, ?, 'PARTIAL', 20.0, DATETIME('now'))
        `, [uuidv4(), orgId, f.code, f.name]);
      }
    });

    await AuditService.log({
      organization_id: orgId,
      actor_id: userId,
      actor_name: data.admin_name,
      actor_role: 'ORG_ADMIN',
      action: 'ORGANIZATION_REGISTERED',
      resource: 'ORGANIZATION',
      resource_id: orgId,
      details: { org_name: data.org_name, domain: data.org_domain }
    });

    const authUser: AuthUser = {
      id: userId,
      organization_id: orgId,
      email: data.admin_email.toLowerCase().trim(),
      full_name: data.admin_name.trim(),
      role: 'ORG_ADMIN',
      employee_id: empId
    };

    const token = generateToken(authUser);

    return {
      token,
      user: authUser,
      organization: {
        id: orgId,
        name: data.org_name,
        domain: data.org_domain
      }
    };
  }

  /**
   * User login (Admin or Employee)
   */
  static async login(data: { email: string; password: string; ip_address?: string; user_agent?: string }) {
    const cleanEmail = data.email.toLowerCase().trim();
    const user = await get<any>('SELECT * FROM users WHERE email = ?', [cleanEmail]);

    if (!user) {
      throw new Error(`No registered account found for '${cleanEmail}'. Please check your email or contact your administrator.`);
    }

    if (user.status === 'SUSPENDED') {
      throw new Error('This account has been suspended by an administrator.');
    }

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      throw new Error(`Account is temporarily locked due to repeated failed attempts. Please try again after ${new Date(user.locked_until).toLocaleTimeString()}.`);
    }

    const isMatch = await bcrypt.compare(data.password, user.password_hash);

    if (!isMatch) {
      const failedAttempts = (user.failed_login_attempts || 0) + 1;
      let lockedUntil: string | null = null;

      if (failedAttempts >= 5) {
        const lockTime = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        lockedUntil = lockTime;
      }

      await run(
        'UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?',
        [failedAttempts, lockedUntil, user.id]
      );

      await AuditService.log({
        organization_id: user.organization_id,
        actor_id: user.id,
        actor_name: user.full_name,
        actor_role: user.role,
        action: 'LOGIN_FAILED',
        resource: 'USER_SESSION',
        resource_id: user.id,
        ip_address: data.ip_address,
        user_agent: data.user_agent,
        details: { reason: 'Incorrect password', failed_attempts: failedAttempts }
      });

      throw new Error('Incorrect password. Please verify your credentials or click Forgot Password.');
    }

    await run(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login_at = DATETIME("now") WHERE id = ?',
      [user.id]
    );

    // Auto-link or auto-provision employee record if missing
    let employee = await get<any>(
      'SELECT * FROM employees WHERE user_id = ? OR (organization_id = ? AND email = ?)',
      [user.id, user.organization_id, user.email]
    );

    if (!employee && user.organization_id) {
      const parts = (user.full_name || 'Admin User').trim().split(' ');
      const firstName = parts[0] || 'Admin';
      const lastName = parts.slice(1).join(' ') || 'User';
      const newEmpId = uuidv4();

      const defaultDept = await get<any>('SELECT id FROM departments WHERE organization_id = ? ORDER BY created_at ASC LIMIT 1', [user.organization_id]);

      await run(`
        INSERT INTO employees (id, organization_id, user_id, email, first_name, last_name, department_id, job_title, status, current_risk_score, current_risk_level, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 100.0, 'LOW', DATETIME('now'), DATETIME('now'))
      `, [newEmpId, user.organization_id, user.id, user.email, firstName, lastName, defaultDept?.id || null, user.role === 'ORG_ADMIN' ? 'Chief Administrator' : 'Staff Member']);

      employee = await get<any>('SELECT * FROM employees WHERE id = ?', [newEmpId]);
    }

    let organization = null;
    if (user.organization_id) {
      organization = await get<any>('SELECT id, name, domain, industry FROM organizations WHERE id = ?', [user.organization_id]);
    }

    const authUser: AuthUser = {
      id: user.id,
      organization_id: user.organization_id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      employee_id: employee ? employee.id : undefined
    };

    const token = generateToken(authUser);

    await AuditService.log({
      organization_id: user.organization_id,
      actor_id: user.id,
      actor_name: user.full_name,
      actor_role: user.role,
      action: 'LOGIN_SUCCESS',
      resource: 'USER_SESSION',
      resource_id: user.id,
      ip_address: data.ip_address,
      user_agent: data.user_agent
    });

    return {
      token,
      user: authUser,
      employee,
      organization
    };
  }

  /**
   * Request Password Reset (Dispatches notification to Admin queue)
   */
  static async requestPasswordReset(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    const user = await get<any>('SELECT id, email, full_name, organization_id FROM users WHERE email = ?', [cleanEmail]);

    if (!user) {
      return {
        success: true,
        message: `Password reset request submitted. If '${cleanEmail}' is registered, an alert has been dispatched to your company security administrator.`
      };
    }

    const requestId = uuidv4();

    // Insert into pending reset requests table
    await run(`
      INSERT INTO password_reset_requests (id, organization_id, user_id, email, employee_name, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'PENDING', DATETIME('now'))
    `, [requestId, user.organization_id, user.id, cleanEmail, user.full_name]);

    await AuditService.log({
      organization_id: user.organization_id,
      actor_id: user.id,
      actor_name: user.full_name,
      actor_role: 'EMPLOYEE',
      action: 'PASSWORD_RESET_REQUESTED',
      resource: 'USER_ACCOUNT',
      resource_id: user.id,
      details: { email: cleanEmail, request_id: requestId }
    });

    return {
      success: true,
      request_id: requestId,
      message: `Password reset request has been logged and sent to your Organization Security Administrator. Your administrator can now approve and set your new password.`
    };
  }

  /**
   * List Pending Password Reset Requests for Admin
   */
  static async listPasswordRequests(orgId: string) {
    const requests = await all<any>(`
      SELECT pr.*, d.name as department_name
      FROM password_reset_requests pr
      LEFT JOIN employees e ON e.email = pr.email AND e.organization_id = pr.organization_id
      LEFT JOIN departments d ON d.id = e.department_id
      WHERE pr.organization_id = ? AND pr.status = 'PENDING'
      ORDER BY pr.created_at DESC
    `, [orgId]);

    return requests;
  }

  /**
   * Admin Resets Employee Password
   */
  static async adminResetPassword(orgId: string, data: {
    request_id?: string;
    user_id?: string;
    email?: string;
    new_password: string;
  }, actor: { id: string; name: string; role: string }) {
    if (!data.new_password || data.new_password.length < 8) {
      throw new Error('New password must be at least 8 characters long.');
    }

    let targetUser: any = null;

    if (data.user_id) {
      targetUser = await get<any>('SELECT * FROM users WHERE id = ? AND organization_id = ?', [data.user_id, orgId]);
    } else if (data.email) {
      targetUser = await get<any>('SELECT * FROM users WHERE email = ? AND organization_id = ?', [data.email.toLowerCase().trim(), orgId]);
    } else if (data.request_id) {
      const req = await get<any>('SELECT * FROM password_reset_requests WHERE id = ? AND organization_id = ?', [data.request_id, orgId]);
      if (req) {
        targetUser = await get<any>('SELECT * FROM users WHERE email = ? AND organization_id = ?', [req.email, orgId]);
      }
    }

    if (!targetUser) {
      throw new Error('Target employee user account not found in this organization.');
    }

    const passwordHash = await bcrypt.hash(data.new_password, 10);

    await transaction(async () => {
      // 1. Update user password
      await run(`
        UPDATE users
        SET password_hash = ?, failed_login_attempts = 0, locked_until = NULL, updated_at = DATETIME('now')
        WHERE id = ?
      `, [passwordHash, targetUser.id]);

      // 2. Mark pending reset request as RESOLVED
      if (data.request_id) {
        await run(`
          UPDATE password_reset_requests
          SET status = 'RESOLVED', resolved_at = DATETIME('now'), resolved_by = ?
          WHERE id = ?
        `, [actor.name, data.request_id]);
      } else {
        await run(`
          UPDATE password_reset_requests
          SET status = 'RESOLVED', resolved_at = DATETIME('now'), resolved_by = ?
          WHERE email = ? AND organization_id = ? AND status = 'PENDING'
        `, [actor.name, targetUser.email, orgId]);
      }
    });

    await AuditService.log({
      organization_id: orgId,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action: 'ADMIN_PASSWORD_RESET_COMPLETED',
      resource: 'USER_ACCOUNT',
      resource_id: targetUser.id,
      details: { target_email: targetUser.email, target_name: targetUser.full_name }
    });

    return {
      success: true,
      message: `Password for ${targetUser.full_name} (${targetUser.email}) has been successfully updated. The employee can now log in immediately with the new password.`,
      email: targetUser.email,
      temporary_password: data.new_password
    };
  }
}
