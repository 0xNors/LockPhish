import { v4 as uuidv4 } from 'uuid';
import { run, all, get } from '../database/db.js';

export interface AuditLogEntry {
  organization_id?: string | null;
  actor_id?: string | null;
  actor_name: string;
  actor_role: string;
  action: string;
  resource: string;
  resource_id?: string | null;
  ip_address?: string;
  user_agent?: string;
  details?: Record<string, any>;
}

export class AuditService {
  static async log(entry: AuditLogEntry): Promise<void> {
    try {
      const id = uuidv4();
      // Sanitize details to guarantee no secrets ever persist
      const safeDetails = entry.details ? this.sanitizeDetails(entry.details) : {};

      await run(`
        INSERT INTO audit_logs (id, organization_id, actor_id, actor_name, actor_role, action, resource, resource_id, ip_address, user_agent, details, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
      `, [
        id,
        entry.organization_id || null,
        entry.actor_id || null,
        entry.actor_name,
        entry.actor_role,
        entry.action,
        entry.resource,
        entry.resource_id || null,
        entry.ip_address || '127.0.0.1',
        entry.user_agent || 'LockPhish Core Engine',
        JSON.stringify(safeDetails)
      ]);
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
  }

  static async getLogs(params: {
    organization_id?: string | null;
    limit?: number;
    offset?: number;
    action?: string;
    resource?: string;
    search?: string;
  }) {
    const { organization_id, limit = 50, offset = 0, action, resource, search } = params;

    let query = 'SELECT * FROM audit_logs WHERE 1=1';
    const queryParams: any[] = [];

    if (organization_id) {
      query += ' AND (organization_id = ? OR organization_id IS NULL)';
      queryParams.push(organization_id);
    }

    if (action) {
      query += ' AND action = ?';
      queryParams.push(action);
    }

    if (resource) {
      query += ' AND resource = ?';
      queryParams.push(resource);
    }

    if (search) {
      query += ' AND (actor_name LIKE ? OR action LIKE ? OR resource LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    const logs = await all(query, queryParams);

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count').split('ORDER BY')[0];
    const totalRow = await get<{ count: number }>(countQuery, queryParams.slice(0, -2));

    return {
      logs: logs.map(l => ({
        ...l,
        details: l.details ? JSON.parse(l.details) : {}
      })),
      total: totalRow ? totalRow.count : logs.length,
      limit,
      offset
    };
  }

  private static sanitizeDetails(details: Record<string, any>): Record<string, any> {
    const sensitiveKeys = ['password', 'secret', 'token', 'otp', 'pin', 'cvv', 'card', 'key', 'auth'];
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(details)) {
      const lower = key.toLowerCase();
      if (sensitiveKeys.some(s => lower.includes(s))) {
        sanitized[key] = '[REDACTED_BY_SECURITY_POLICY]';
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = this.sanitizeDetails(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}
