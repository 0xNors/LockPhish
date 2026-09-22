import { get } from '../server/database/db.js';
import { AnalyticsService } from '../server/services/analyticsService.js';
async function main() {
  const org = await get<any>('SELECT id FROM organizations LIMIT 1');
  if (!org) { console.log('no org'); process.exit(0); }
  const ov: any = await AnalyticsService.getOrganizationOverview(org.id);
  console.log('overview keys:', Object.keys(ov));
  console.log('has risk key?', 'risk' in ov, '| employees.avg_security_score =', ov.employees?.avg_security_score);
  process.exit(0);
}
main();
