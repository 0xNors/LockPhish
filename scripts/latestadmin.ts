import { get } from '../server/database/db.js';
async function main() {
  const u = await get<any>("SELECT email FROM users WHERE role='ORG_ADMIN' ORDER BY created_at DESC LIMIT 1");
  console.log(u.email);
  process.exit(0);
}
main();
