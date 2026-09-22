const fs = require('fs');
const path = require('path');

// Let's create a comprehensive array of all 120 courses
const generateComprehensiveData = () => {
  // Let's read all course definitions from server/database/trainingMasterData.ts to ensure 100% exact matching
  const masterDataPath = path.join(__dirname, 'server/database/trainingMasterData.ts');
  const content = fs.readFileSync(masterDataPath, 'utf8');

  // Let's parse all courses
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

  console.log(`Found ${courseList.length} courses to generate defense SOPs for.`);
  return courseList;
};

const courses = generateComprehensiveData();
