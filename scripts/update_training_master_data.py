# scripts/update_training_master_data.py
import re

with open('server/database/trainingMasterData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import at top
if "import { getDefenseSop, allDefenseSops } from './defenseData.js';" not in content:
    content = "import { getDefenseSop, allDefenseSops } from './defenseData.js';\n" + content

# 2. Update TrainingModuleItem interface
old_interface = """  defense_sop?: {
    step_1: string;
    step_2: string;
    step_3: string;
    prevention_checklist: string[];
  };"""

new_interface = """  defense_sop?: {
    sop_title?: string;
    severity?: string;
    strategic_objective?: string;
    step_1: string;
    step_2: string;
    step_3: string;
    step_4?: string;
    checklist?: Array<{ id: string; label: string; detail: string }>;
    official_standards?: string[];
    mitre_techniques?: string[];
    incident_response_action?: string;
    prevention_checklist: string[];
  };"""

content = content.replace(old_interface, new_interface)

# 3. Update createRichModule defenseSop parameter type
content = content.replace(
    "defenseSop: { step_1: string; step_2: string; step_3: string; prevention_checklist: string[] },",
    "defenseSop: any,"
)

# 4. Update remainingTopics loop
old_remaining_loop = """// Build remaining courses and assessments
for (const t of remainingTopics) {
  courseDefs.push({
    id: `course-${t.code.toLowerCase().replace(/_/g, '-')}`,
    code: t.code,
    title: t.title,
    category: t.category,
    difficulty: t.difficulty,
    duration: t.duration,
    description: t.description,
    headline: `${t.title} Threat Analysis`,
    loss: 'Enterprise Risk Mitigation',
    content: `${t.description} Understanding and applying these defensive principles protects corporate and personal assets.`,
    urlDisplay: 'https://security-verify.company.com',
    urlActual: 'https://security-verify.company.com.external-auth-gate.org',
    rootDomain: 'external-auth-gate.org',
    spoofedDomain: 'security-verify.company.com',
    sop1: 'STOP: Pause and assess unexpected communications before reacting.',
    sop2: 'VERIFY: Validate sender addresses, root domains, and out-of-band contact channels.',
    sop3: 'ACT: Report suspicious messages to IT Security within 60 seconds.',
    quizQ: t.quizQ,
    quizOpts: t.quizOpts,
    quizAns: t.quizAns,
    quizExp: t.quizExp
  });
}"""

new_remaining_loop = """// Build remaining courses and assessments with rich 120-topic defense SOPs
for (const t of remainingTopics) {
  const def = getDefenseSop(t.code, t.title, t.category);
  courseDefs.push({
    id: `course-${t.code.toLowerCase().replace(/_/g, '-')}`,
    code: t.code,
    title: t.title,
    category: t.category,
    difficulty: t.difficulty,
    duration: t.duration,
    description: t.description,
    headline: `${t.title.replace(/^[^\w]+/, '').trim()} Threat Analysis`,
    loss: 'Enterprise Risk Mitigation',
    content: `${t.description} Understanding and applying these defensive principles protects corporate and personal assets.`,
    urlDisplay: 'https://security-verify.company.com',
    urlActual: 'https://security-verify.company.com.external-auth-gate.org',
    rootDomain: 'external-auth-gate.org',
    spoofedDomain: 'security-verify.company.com',
    sop1: def.step_1,
    sop2: def.step_2,
    sop3: def.step_3,
    quizQ: t.quizQ,
    quizOpts: t.quizOpts,
    quizAns: t.quizAns,
    quizExp: t.quizExp
  });
}"""

content = content.replace(old_remaining_loop, new_remaining_loop)

# 5. Enhance buildDifferentiatedCourseModules to populate rich defense objects
old_build_fn = "export const buildDifferentiatedCourseModules = (c: (typeof courseDefs)[0]): TrainingModuleItem[] => {"
new_build_fn = """export const buildDifferentiatedCourseModules = (c: (typeof courseDefs)[0]): TrainingModuleItem[] => {
  const def = getDefenseSop(c.code, c.title, c.category);
  const richDefense = {
    sop_title: def.sop_title,
    severity: def.severity,
    strategic_objective: def.strategic_objective,
    step_1: def.step_1,
    step_2: def.step_2,
    step_3: def.step_3,
    step_4: def.step_4,
    checklist: def.checklist,
    official_standards: def.official_standards,
    mitre_techniques: def.mitre_techniques,
    incident_response_action: def.incident_response_action,
    prevention_checklist: def.checklist.map(item => `${item.label}: ${item.detail}`)
  };"""

content = content.replace(old_build_fn, new_build_fn)

with open('server/database/trainingMasterData.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated server/database/trainingMasterData.ts successfully!")
