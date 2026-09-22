import { get } from '../server/database/db.js';
import { TrainingService } from '../server/services/trainingService.js';
async function main() {
  const row = await get<any>("SELECT id, code FROM training_courses WHERE code = 'COURSE-79-ZERO-TRUST-ARCH'");
  const course = await TrainingService.getCourseById(row.id);
  console.log('getCourseById => code:', course.code, '| modules:', course.modules.length, course.modules.map((m: any) => m.title.split(':')[0]));
  process.exit(0);
}
main();
