import { all, get, run } from '../database/db.js';
import { AnalyticsService } from './analyticsService.js';

export class ComplianceService {
  /**
   * Evaluate and return real compliance status for all frameworks
   */
  static async getComplianceStatus(orgId: string) {
    const overview = await AnalyticsService.getOrganizationOverview(orgId);
    const frameworks = await all<any>('SELECT * FROM compliance_frameworks WHERE organization_id = ?', [orgId]);

    const trainingRate = overview.training.completion_rate; // 0 - 100
    const coverageRate = overview.employees.total > 0 && overview.simulations.total > 0 ? 100 : 0;
    const reportingRate = overview.simulations.reporting_rate;

    const evaluated = frameworks.map(f => {
      // Real evidence calculation
      let evidenceScore = Math.round((trainingRate * 0.5 + coverageRate * 0.3 + reportingRate * 0.2) * 10) / 10;
      let status: 'COMPLIANT' | 'PARTIAL' | 'NEEDS_ATTENTION' = 'PARTIAL';

      if (evidenceScore >= 80) status = 'COMPLIANT';
      else if (evidenceScore >= 50) status = 'PARTIAL';
      else status = 'NEEDS_ATTENTION';

      return {
        ...f,
        evidence_score: evidenceScore,
        status,
        metrics: {
          training_completion_rate: trainingRate,
          simulation_coverage: coverageRate,
          reporting_efficacy: reportingRate
        }
      };
    });

    return evaluated;
  }
}
