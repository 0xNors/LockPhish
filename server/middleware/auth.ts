import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { get, run } from '../database/db.js';
import { v4 as uuidv4 } from 'uuid';

export const JWT_SECRET = process.env.JWT_SECRET || 'lockphish_sec_prod_key_77a94d8e90bf12';

export interface AuthUser {
  id: string;
  organization_id: string | null;
  email: string;
  full_name: string;
  role: 'SUPER_ADMIN' | 'ORG_ADMIN' | 'CAMPAIGN_MANAGER' | 'TRAINER' | 'EMPLOYEE';
  employee_id?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export function generateToken(user: AuthUser, expiresIn = '8h'): string {
  return jwt.sign(
    {
      id: user.id,
      organization_id: user.organization_id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      employee_id: user.employee_id
    },
    JWT_SECRET,
    { expiresIn: expiresIn as any }
  );
}

export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.lockphish_token) {
      token = req.cookies.lockphish_token;
    }

    if (!token) {
      res.status(401).json({ error: 'Authentication required. No token provided.', code: 'UNAUTHORIZED' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;

    // Verify user is still active in database
    const userInDb = await get<any>(
      'SELECT id, organization_id, email, full_name, role, status FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!userInDb || userInDb.status !== 'ACTIVE') {
      res.status(401).json({ error: 'User account is inactive or revoked.', code: 'ACCOUNT_INACTIVE' });
      return;
    }

    // Auto-link or find employee ID
    let employee = await get<any>(
      'SELECT id FROM employees WHERE user_id = ? OR (organization_id = ? AND email = ?)',
      [userInDb.id, userInDb.organization_id, userInDb.email]
    );

    // If user is ORG_ADMIN or EMPLOYEE and doesn't have an employee record yet, auto-create one
    if (!employee && userInDb.organization_id) {
      const parts = (userInDb.full_name || 'Admin User').split(' ');
      const firstName = parts[0] || 'Admin';
      const lastName = parts.slice(1).join(' ') || 'User';
      const newEmpId = uuidv4();

      await run(`
        INSERT INTO employees (id, organization_id, user_id, email, first_name, last_name, job_title, status, current_risk_score, current_risk_level, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'Administrator', 'ACTIVE', 100.0, 'LOW', DATETIME('now'), DATETIME('now'))
      `, [newEmpId, userInDb.organization_id, userInDb.id, userInDb.email, firstName, lastName]);

      employee = { id: newEmpId };
    }

    req.user = {
      id: userInDb.id,
      organization_id: userInDb.organization_id,
      email: userInDb.email,
      full_name: userInDb.full_name,
      role: userInDb.role,
      employee_id: employee ? employee.id : undefined
    };

    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Session has expired. Please log in again.', code: 'TOKEN_EXPIRED' });
      return;
    }
    res.status(401).json({ error: 'Invalid authentication token.', code: 'INVALID_TOKEN' });
  }
}

export function requireRole(allowedRoles: Array<'SUPER_ADMIN' | 'ORG_ADMIN' | 'CAMPAIGN_MANAGER' | 'TRAINER' | 'EMPLOYEE'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.', code: 'UNAUTHORIZED' });
      return;
    }

    if (req.user.role === 'SUPER_ADMIN') {
      next();
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`,
        code: 'FORBIDDEN'
      });
      return;
    }

    next();
  };
}

export function enforceTenantIsolation(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required.', code: 'UNAUTHORIZED' });
    return;
  }

  if (req.user.role === 'SUPER_ADMIN') {
    next();
    return;
  }

  const requestedOrgId = req.params.orgId || req.query.orgId || (req.body && req.body.organization_id);

  if (requestedOrgId && requestedOrgId !== req.user.organization_id) {
    res.status(403).json({
      error: 'Cross-tenant access strictly forbidden. Security boundary violation recorded.',
      code: 'TENANT_ISOLATION_VIOLATION'
    });
    return;
  }

  next();
}
