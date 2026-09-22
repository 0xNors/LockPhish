import { all } from '../server/database/db.js';
async function main() {
  const counts = await all<any>('SELECT organization_id, COUNT(*) as n FROM audit_logs GROUP BY organization_id');
  console.log('audit_logs per org:', JSON.stringify(counts));
  const recent = await all<any>('SELECT action, actor_name, organization_id, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 5');
  console.log('recent:', JSON.stringify(recent, null, 1));
  const orgs = await all<any>('SELECT id, name, domain FROM organizations LIMIT 5');
  console.log('orgs:', JSON.stringify(orgs, null, 1));
  process.exit(0);
}
main();
