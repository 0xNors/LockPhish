import { all } from '../server/database/db.js';
async function main() {
  const rows = await all<any>(`
    SELECT o.id, o.name, o.domain, o.created_at,
      (SELECT COUNT(*) FROM audit_logs a WHERE a.organization_id = o.id) as log_count,
      (SELECT COUNT(*) FROM users u WHERE u.organization_id = o.id AND u.role = 'ORG_ADMIN') as admins
    FROM organizations o
    WHERE (SELECT COUNT(*) FROM users u WHERE u.organization_id = o.id AND u.role = 'ORG_ADMIN') > 0
    ORDER BY o.created_at DESC LIMIT 12`);
  for (const r of rows) console.log(r.domain, '| admins:', r.admins, '| logs:', r.log_count, '| created:', r.created_at);
  process.exit(0);
}
main();
