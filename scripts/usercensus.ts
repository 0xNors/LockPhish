import { all } from '../server/database/db.js';
async function main() {
  const rows = await all<any>("SELECT DISTINCT substr(email,1,instr(email||'@','@')-1) as local FROM users ORDER BY local");
  console.log(rows.map(r => r.local).join(', '));
  process.exit(0);
}
main();
