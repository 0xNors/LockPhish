import { all } from '../server/database/db.js';
async function main() {
  const users = await all<any>("SELECT email, role, organization_id, created_at FROM users WHERE email NOT LIKE 'alice@%' AND email NOT LIKE 'bob@%' AND email NOT LIKE 'admin@acme%' AND email NOT LIKE 'bobbie@%' AND email NOT LIKE 'jonathan%' AND email NOT LIKE 'victoria%' AND email NOT LIKE 'eleanor%' ORDER BY created_at DESC LIMIT 10");
  console.log('human-like users:', JSON.stringify(users, null, 1));
  const total = await all<any>('SELECT COUNT(*) as n FROM users');
  console.log('total users:', total[0].n);
  process.exit(0);
}
main();
