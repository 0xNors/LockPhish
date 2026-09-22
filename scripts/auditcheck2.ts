import { all } from '../server/database/db.js';
async function main() {
  const orgs = await all<any>("SELECT id, name, domain, created_at FROM organizations WHERE domain NOT LIKE 'acme-test-%' AND domain NOT LIKE 'tenant-%' ORDER BY created_at DESC LIMIT 5");
  console.log('real orgs:', JSON.stringify(orgs, null, 1));
  for (const o of orgs) {
    const logs = await all<any>('SELECT action, created_at FROM audit_logs WHERE organization_id = ? ORDER BY created_at DESC', [o.id]);
    console.log(o.domain, '=>', logs.length, logs.slice(0, 5).map(l => l.action));
  }
  process.exit(0);
}
main();
