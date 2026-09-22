const fs = require('fs');
const path = require('path');

// Let's create the full data builder
const buildData = () => {
  // Let's load the course list
  const masterDataPath = path.join(__dirname, 'server/database/trainingMasterData.ts');
  const content = fs.readFileSync(masterDataPath, 'utf8');

  const courseList = [];
  const regex = /\{[\s\r\n]*id:\s*'course-([^']+)',[\s\r\n]*code:\s*'([^']+)',[\s\r\n]*title:\s*'([^']+)',[\s\r\n]*category:\s*'([^']+)',[\s\r\n]*difficulty:\s*'([^']+)'/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    courseList.push({ id: m[1], code: m[2], title: m[3], category: m[4], difficulty: m[5] });
  }
  const regex2 = /\{[\s\r\n]*code:\s*'(COURSE-[^']+)',[\s\r\n]*title:\s*'([^']+)',[\s\r\n]*category:\s*'([^']+)',[\s\r\n]*difficulty:\s*'([^']+)'/g;
  while ((m = regex2.exec(content)) !== null) {
    if (!courseList.some(c => c.code === m[1])) {
      courseList.push({ id: m[1].toLowerCase().replace(/_/g, '-'), code: m[1], title: m[2], category: m[3], difficulty: m[4] });
    }
  }

  return courseList;
};

const courses = buildData();
console.log('Courses count:', courses.length);
