import { all } from '../server/database/db.js';
async function main() {
  const users = await all<any>("SELECT email, role, organization_id, created_at FROM users ORDER BY created_at DESC LIMIT 10");
  console.log(JSON.stringify(users, null, 1));
  process.exit(0);
}
main();
