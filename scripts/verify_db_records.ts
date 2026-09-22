// scripts/verify_db_records.ts
import { get, all } from '../server/database/db.js';

async function check() {
  const c89 = await get<any>('SELECT * FROM training_courses WHERE code = ?', ['COURSE-89-OUT-OF-BAND-IDENTITY-VERIFY']);
  console.log('--- COURSE 89 (Out-of-Band Identity Challenge) ---');
  console.log('Title:', c89.title);
  const modules89 = typeof c89.modules === 'string' ? JSON.parse(c89.modules) : c89.modules;
  console.log('Modules count:', modules89.length);
  console.log('Module 0 Title:', modules89[0].title);
  console.log('Module 0 Defense SOP:', JSON.stringify(modules89[0].defense_sop, null, 2));

  const c30 = await get<any>('SELECT * FROM training_courses WHERE code = ?', ['COURSE-30-QR-QUISHING']);
  console.log('\n--- COURSE 30 (QR Quishing) ---');
  console.log('Title:', c30.title);
  const modules30 = typeof c30.modules === 'string' ? JSON.parse(c30.modules) : c30.modules;
  console.log('Module 0 Defense SOP:', JSON.stringify(modules30[0].defense_sop, null, 2));

  const c76 = await get<any>('SELECT * FROM training_courses WHERE code = ?', ['COURSE-76-AITM-SESSION-HIJACK']);
  console.log('\n--- COURSE 76 (Adversary-in-the-Middle) ---');
  console.log('Title:', c76.title);
  const modules76 = typeof c76.modules === 'string' ? JSON.parse(c76.modules) : c76.modules;
  console.log('Module 0 Defense SOP:', JSON.stringify(modules76[0].defense_sop, null, 2));
}

check().then(() => {
  console.log('\nVerification completed successfully!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
