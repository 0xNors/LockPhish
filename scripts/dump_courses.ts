import { academyCourses } from '../server/database/trainingMasterData.js';
const rows = academyCourses.map((c: any) => ({ code: c.code, title: c.title, category: c.category }));
console.log(JSON.stringify(rows));
console.error('TOTAL:', rows.length);
