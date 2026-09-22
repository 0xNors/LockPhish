import { all } from '../server/database/db.js';
async function main() {
  const rows = await all<any>("SELECT DISTINCT email FROM users ORDER BY email LIMIT 60");
  console.log(rows.map(r => r.email).join('\n'));
  process.exit(0);
}
main();
