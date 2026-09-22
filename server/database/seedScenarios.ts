import { v4 as uuidv4 } from 'uuid';
import { run, get, all, exec } from './db.js';
import { allScenarios } from './scenarioData.js';
import { academyCourses, academyAssessments, learningPaths, externalResources } from './trainingMasterData.js';

export const baselineScenarios = allScenarios;
export const baselineCourses = academyCourses;
export const baselineAssessments = academyAssessments;

export async function seedMasterData() {
  // 1. Scenarios (Upsert all 73 system threat simulation templates)
  for (const s of baselineScenarios) {
    const existing = await get('SELECT id FROM scenarios WHERE id = ? OR code = ?', [s.id, s.code]);
    if (!existing) {
      await run(`
        INSERT INTO scenarios (id, code, name, channel, category, difficulty, description, sender_profile, payload_config, learning_indicators, decision_tree, is_system_template)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      `, [s.id, s.code, s.name, s.channel, s.category, s.difficulty, s.description, s.sender_profile, s.payload_config, s.learning_indicators, s.decision_tree]);
    } else {
      await run(`
        UPDATE scenarios
        SET name = ?, channel = ?, category = ?, difficulty = ?, description = ?, sender_profile = ?, payload_config = ?, learning_indicators = ?, decision_tree = ?, is_system_template = 1
        WHERE id = ? OR code = ?
      `, [s.name, s.channel, s.category, s.difficulty, s.description, s.sender_profile, s.payload_config, s.learning_indicators, s.decision_tree, s.id, s.code]);
    }
  }

  // 2. Training Courses (Upsert all 74 structured academy courses)
  for (const c of baselineCourses) {
    const existing = await get('SELECT id FROM training_courses WHERE id = ? OR code = ?', [c.id, c.code]);
    const modulesJson = typeof c.modules === 'string' ? c.modules : JSON.stringify(c.modules);
    if (!existing) {
      await run(`
        INSERT INTO training_courses (id, code, title, category, difficulty, duration_minutes, description, modules, is_system)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
      `, [c.id, c.code, c.title, c.category, c.difficulty, c.duration_minutes, c.description, modulesJson]);
    } else {
      await run(`
        UPDATE training_courses
        SET title = ?, category = ?, difficulty = ?, duration_minutes = ?, description = ?, modules = ?
        WHERE id = ? OR code = ?
      `, [c.title, c.category, c.difficulty, c.duration_minutes, c.description, modulesJson, c.id, c.code]);
    }
  }

  // 3. Assessments (Upsert all 74 scored mastery assessments)
  for (const a of baselineAssessments) {
    const course = await get<{ id: string }>('SELECT id FROM training_courses WHERE code = ?', [a.course_code]);
    if (course) {
      const existing = await get('SELECT id FROM assessments WHERE id = ? OR course_id = ?', [a.id, course.id]);
      const questionsJson = typeof a.questions === 'string' ? a.questions : JSON.stringify(a.questions);
      if (!existing) {
        await run(`
          INSERT INTO assessments (id, course_id, title, passing_score, questions)
          VALUES (?, ?, ?, ?, ?)
        `, [a.id, course.id, a.title, a.passing_score, questionsJson]);
      } else {
        await run(`UPDATE assessments SET course_id = ?, questions = ?, title = ? WHERE id = ? OR course_id = ?`, [course.id, questionsJson, a.title, a.id, course.id]);
      }

      await run('UPDATE training_courses SET assessment_id = ? WHERE id = ?', [a.id, course.id]);
    }
  }

  // 4. Learning Paths (Upsert 7 Visual Guided Journeys)
  for (const p of learningPaths) {
    const existing = await get('SELECT id FROM learning_paths WHERE id = ? OR code = ?', [p.id, p.code]);
    if (!existing) {
      await run(`
        INSERT INTO learning_paths (id, code, title, description, category, difficulty, estimated_minutes, badge_reward, is_system)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
      `, [p.id, p.code, p.title, p.description, p.category, p.difficulty, p.estimated_minutes, p.badge_reward]);
    } else {
      await run(`
        UPDATE learning_paths
        SET title = ?, description = ?, category = ?, difficulty = ?, estimated_minutes = ?, badge_reward = ?
        WHERE id = ? OR code = ?
      `, [p.title, p.description, p.category, p.difficulty, p.estimated_minutes, p.badge_reward, p.id, p.code]);
    }

    // Seed learning path module links
    await run('DELETE FROM learning_path_modules WHERE path_id = ?', [p.id]);
    let order = 1;
    for (const cCode of p.course_codes) {
      const course = await get<any>('SELECT id FROM training_courses WHERE code = ?', [cCode]);
      if (course) {
        await run(`
          INSERT INTO learning_path_modules (id, path_id, course_id, step_order)
          VALUES (?, ?, ?, ?)
        `, [uuidv4(), p.id, course.id, order++]);
      }
    }
  }

  // 5. Curated External Resources (CISA, NIST, FTC, FBI IC3)
  for (const r of externalResources) {
    const existing = await get('SELECT id FROM training_external_resources WHERE id = ?', [r.id]);
    if (!existing) {
      await run(`
        INSERT INTO training_external_resources (id, title, source_organization, category, url, description, is_verified)
        VALUES (?, ?, ?, ?, ?, ?, 1)
      `, [r.id, r.title, r.source_organization, r.category, r.url, r.description]);
    }
  }
}
