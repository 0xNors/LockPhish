import { all } from '../server/database/db.js';
async function main() {
  const org = await all<any>("SELECT id, name, domain FROM organizations WHERE domain = 'cyber.com' OR name LIKE '%cyber%' LIMIT 3");
  console.log('org:', JSON.stringify(org));
  if (org.length) {
    const logs = await all<any>('SELECT action, actor_name, created_at FROM audit_logs WHERE organization_id = ? ORDER BY created_at DESC LIMIT 10', [org[0].id]);
    console.log('cyber org logs:', logs.length, JSON.stringify(logs.slice(0,5)));
  }
  const sys = await all<any>("SELECT action, created_at FROM audit_logs WHERE organization_id IS NULL ORDER BY created_at DESC LIMIT 5");
  console.log('system(NULL-org) logs:', JSON.stringify(sys));
  process.exit(0);
}
main();
