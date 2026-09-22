import { all } from '../server/database/db.js';
async function main() {
  const rows = await all<any>("SELECT code, title, modules FROM training_courses WHERE code IN ('COURSE-79-ZERO-TRUST-ARCH','COURSE-01-CYBER-BASICS','COURSE-101-AI-ASSISTED-PHISHING')");
  for (const r of rows) {
    const mods = typeof r.modules === 'string' ? JSON.parse(r.modules) : r.modules;
    console.log('====', r.code, '|', r.title);
    console.log('module count:', mods.length);
    mods.forEach((m: any, i: number) => console.log('  ', i + 1, m.title));
  }
  process.exit(0);
}
main();
