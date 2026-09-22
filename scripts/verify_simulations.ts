import { allTopicSimulations, getTopicSimulation } from '../src/components/training/simulationMasterData';
const samples = ['COURSE-01-CYBER-BASICS','COURSE-15-URL-INSPECTION','COURSE-30-QR-QUISHING','COURSE-42-FAKE-BANK-SMS','COURSE-60-DEEPFAKE-AI-VOICE','COURSE-73-REMOVABLE-MEDIA-USB','COURSE-95-MALICIOUS-OAUTH-CONSENT','COURSE-115-UNEXPECTED-MFA-RESPONSE','COURSE-120-FINAL-MULTI-STAGE-CRUCIBLE'];
for (const c of samples) {
  const s = getTopicSimulation(c);
  const key = (s as any).headline || (s as any).sms_message || (s as any).call_script || (s as any).decoded_url || (s as any).psych_lure || (s as any).phys_scenario || (s as any).portal_headline || (s as any).push_text || (s as any).ai_doc || (s as any).filename || s.sim_label;
  console.log(c, '=>', s.sim_type, '|', String(key).slice(0, 70));
}
const types: Record<string, number> = {};
for (const [code, s] of Object.entries(allTopicSimulations)) types[s.sim_type] = (types[s.sim_type] || 0) + 1;
console.log('entries:', Object.keys(allTopicSimulations).length);
console.log('archetype distribution:', JSON.stringify(types));
