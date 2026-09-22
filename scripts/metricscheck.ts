import { get } from '../server/database/db.js';
import { AnalyticsService } from '../server/services/analyticsService.js';
async function main() {
  const org = await get<any>('SELECT id FROM organizations LIMIT 1');
  const ov: any = await AnalyticsService.getOrganizationOverview(org.id);
  console.log('employees:', ov.employees.total, '| training completion_rate:', ov.training.completion_rate + '%', '| simulations total:', ov.simulations.total, '| reporting_rate:', ov.simulations.reporting_rate + '%');
  process.exit(0);
}
main();
