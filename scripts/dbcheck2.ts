import { all } from '../server/database/db.js';
import { getTopicSimulation } from '../src/components/training/simulationMasterData';
async function main() {
  const rows = await all<any>("SELECT code, title, modules FROM training_courses");
  const counts: Record<number, number> = {};
  for (const r of rows) {
    const mods = typeof r.modules === 'string' ? JSON.parse(r.modules) : r.modules;
    counts[mods.length] = (counts[mods.length] || 0) + 1;
  }
  console.log('course rows:', rows.length, '| module-count distribution:', JSON.stringify(counts));
  // Title-only resolution (simulates entry points without course_code):
  const t1 = getTopicSimulation('', '🏛️ Zero-Trust Architecture & Phishing-Resistant FIDO2 Authentication');
  const t2 = getTopicSimulation(undefined, '📞 Vishing Fundamentals: Phone-Based Social Engineering');
  console.log('title-only 79 =>', t1.sim_type, '|', t1.sim_label);
  console.log('title-only 81 =>', t2.sim_type, '|', t2.sim_label);
  process.exit(0);
}
main();
