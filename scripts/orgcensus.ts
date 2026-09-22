import { all } from '../server/database/db.js';
async function main() {
  const rows = await all<any>(`
    SELECT o.id, o.name, o.domain, u.email as admin_email, u.last_login_at,
      (SELECT COUNT(*) FROM audit_logs a WHERE a.organization_id = o.id) as logs
    FROM organizations o
    JOIN users u ON u.organization_id = o.id AND u.role = 'ORG_ADMIN'
    ORDER BY u.last_login_at DESC LIMIT 8`);
  for (const r of rows) console.log(r.domain, '| admin:', r.admin_email, '| last_login:', r.last_login_at, '| audit rows:', r.logs);
  process.exit(0);
}
main();
