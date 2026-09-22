import { all, run } from '../database/db.js';
import { AuditService } from './auditService.js';

export class BackgroundScheduler {
  private static timer: NodeJS.Timeout | null = null;

  static start(intervalMs = 30000) {
    if (this.timer) return;
    console.log('[BackgroundScheduler] Background campaign & risk processing job started.');

    this.timer = setInterval(async () => {
      try {
        await this.processScheduledCampaigns();
      } catch (err) {
        console.error('[BackgroundScheduler] Error during scheduled job cycle:', err);
      }
    }, intervalMs);
  }

  static stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private static async processScheduledCampaigns() {
    // 1. Complete campaigns that have passed their end_time
    const expired = await all<any>(`
      SELECT id, organization_id, name 
      FROM campaigns 
      WHERE status = 'RUNNING' AND end_time IS NOT NULL AND end_time <= DATETIME('now')
    `);

    for (const c of expired) {
      await run(`UPDATE campaigns SET status = 'COMPLETED', updated_at = DATETIME('now') WHERE id = ?`, [c.id]);
      await AuditService.log({
        organization_id: c.organization_id,
        actor_name: 'SYSTEM_SCHEDULER',
        actor_role: 'SYSTEM',
        action: 'CAMPAIGN_AUTO_COMPLETED',
        resource: 'CAMPAIGN',
        resource_id: c.id,
        details: { reason: 'Campaign reached scheduled end time' }
      });
    }
  }
}
