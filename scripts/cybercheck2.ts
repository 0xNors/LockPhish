import { all } from '../server/database/db.js';
async function main() {
  const org = await all<any>("SELECT id, name, domain, created_at FROM organizations WHERE domain = 'cyber.com' OR name = 'cyber' LIMIT 3");
  console.log('org:', JSON.stringify(org));
  for (const o of org) {
    const logs = await all<any>('SELECT action, actor_name, created_at FROM audit_logs WHERE organization_id = ? ORDER BY created_at DESC LIMIT 8', [o.id]);
    console.log(o.domain, '=> logs:', logs.length, JSON.stringify(logs.slice(0, 6).map(l => l.action)));
  }
  const users = await all<any>("SELECT email, role, organization_id FROM users WHERE email LIKE 'sahil%' LIMIT 3");
  console.log('sahil users:', JSON.stringify(users));
  process.exit(0);
}
main();
