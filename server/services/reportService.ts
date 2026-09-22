import { all, get } from '../database/db.js';
import { AnalyticsService } from './analyticsService.js';
import { jsPDF } from 'jspdf';
import autoTable, { applyPlugin } from 'jspdf-autotable';

// Apply autotable plugin to jsPDF
applyPlugin(jsPDF);

export class ReportService {
  /**
   * Export Dataset as CSV
   */
  static async generateCSV(orgId: string, type: 'EMPLOYEES' | 'CAMPAIGNS' | 'SIMULATIONS' | 'TRAINING' | 'AUDIT_LOGS') {
    let headers: string[] = [];
    let rows: any[] = [];

    switch (type) {
      case 'EMPLOYEES':
        headers = ['Employee ID', 'First Name', 'Last Name', 'Email', 'Department', 'Job Title', 'Status', 'Security Score', 'Risk Level', 'Simulations Received', 'Simulations Failed', 'Simulations Reported', 'Trainings Completed'];
        const emps = await all<any>(`
          SELECT e.id, e.first_name, e.last_name, e.email, d.name as dept, e.job_title, e.status, e.current_risk_score, e.current_risk_level, e.simulations_received, e.simulations_failed, e.simulations_reported, e.trainings_completed
          FROM employees e
          LEFT JOIN departments d ON d.id = e.department_id
          WHERE e.organization_id = ?
        `, [orgId]);
        rows = emps.map(e => [e.id, e.first_name, e.last_name, e.email, e.dept || 'None', e.job_title, e.status, e.current_risk_score, e.current_risk_level, e.simulations_received, e.simulations_failed, e.simulations_reported, e.trainings_completed]);
        break;

      case 'CAMPAIGNS':
        headers = ['Campaign ID', 'Name', 'Channel', 'Status', 'Target Type', 'Difficulty', 'Start Time', 'End Time', 'Created At'];
        const camps = await all<any>('SELECT id, name, channel, status, target_type, difficulty, start_time, end_time, created_at FROM campaigns WHERE organization_id = ?', [orgId]);
        rows = camps.map(c => [c.id, c.name, c.channel, c.status, c.target_type, c.difficulty, c.start_time || '', c.end_time || '', c.created_at]);
        break;

      case 'SIMULATIONS':
        headers = ['Simulation ID', 'Campaign ID', 'Employee Email', 'Channel', 'Scenario Code', 'Status', 'Opened At', 'Clicked At', 'Reported At', 'Completed At'];
        const sims = await all<any>(`
          SELECT s.id, s.campaign_id, e.email, s.channel, sc.code as scenario_code, s.status, s.opened_at, s.clicked_at, s.reported_at, s.completed_at
          FROM simulations s
          JOIN employees e ON e.id = s.employee_id
          JOIN scenarios sc ON sc.id = s.scenario_id
          WHERE s.organization_id = ?
        `, [orgId]);
        rows = sims.map(s => [s.id, s.campaign_id, s.email, s.channel, s.scenario_code, s.status, s.opened_at || '', s.clicked_at || '', s.reported_at || '', s.completed_at || '']);
        break;

      case 'TRAINING':
        headers = ['Assignment ID', 'Employee Email', 'Course Code', 'Course Title', 'Status', 'Progress %', 'Pre-Score', 'Post-Score', 'Assigned At', 'Completed At'];
        const trains = await all<any>(`
          SELECT ta.id, e.email, tc.code as course_code, tc.title as course_title, ta.status, ta.progress_percent, ta.score_pre_assessment, ta.score_post_assessment, ta.assigned_at, ta.completed_at
          FROM training_assignments ta
          JOIN employees e ON e.id = ta.employee_id
          JOIN training_courses tc ON tc.id = ta.course_id
          WHERE ta.organization_id = ?
        `, [orgId]);
        rows = trains.map(t => [t.id, t.email, t.code, t.title, t.status, t.progress_percent, t.score_pre_assessment || '', t.score_post_assessment || '', t.assigned_at, t.completed_at || '']);
        break;

      case 'AUDIT_LOGS':
        headers = ['Timestamp', 'Actor Name', 'Actor Role', 'Action', 'Resource', 'Resource ID', 'IP Address'];
        const logs = await all<any>('SELECT created_at, actor_name, actor_role, action, resource, resource_id, ip_address FROM audit_logs WHERE organization_id = ? ORDER BY created_at DESC LIMIT 1000', [orgId]);
        rows = logs.map(l => [l.created_at, l.actor_name, l.actor_role, l.action, l.resource, l.resource_id || '', l.ip_address]);
        break;
    }

    const csvLines = [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map(row => row.map((cell: any) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    ];

    return csvLines.join('\n');
  }

  /**
   * Generate Executive Human-Risk Assessment PDF Report
   */
  static async generatePDF(orgId: string): Promise<Buffer> {
    const org = await get<any>('SELECT * FROM organizations WHERE id = ?', [orgId]);
    const overview = await AnalyticsService.getOrganizationOverview(orgId);
    const channels = await AnalyticsService.getChannelAnalytics(orgId);
    const departments = await AnalyticsService.getDepartmentAnalytics(orgId);

    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Header Background
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setTextColor(16, 185, 129); // Brand Emerald
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('LOCKPHISH', 14, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('HUMAN-RISK & SECURITY AWARENESS EXECUTIVE REPORT', 14, 30);

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated: ${today} | Organization: ${org?.name || 'Enterprise'} (${org?.domain || ''})`, 14, 36);

    // Section 1: Executive KPI Cards
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Executive Security Health & Risk KPIs', 14, 52);

    const kpis = [
      { label: 'Security Score', val: `${overview.employees.avg_security_score}/100`, sub: 'Target: >85' },
      { label: 'Total Staff', val: `${overview.employees.total}`, sub: 'Active monitored' },
      { label: 'Reporting Rate', val: `${overview.simulations.reporting_rate}%`, sub: 'Threats reported' },
      { label: 'Training Rate', val: `${overview.training.completion_rate}%`, sub: 'Compliance status' }
    ];

    kpis.forEach((kpi, idx) => {
      const x = 14 + idx * 46;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(x, 58, 42, 24, 2, 2, 'FD');

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.text(kpi.label, x + 4, 65);

      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(kpi.val, x + 4, 73);

      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'normal');
      doc.text(kpi.sub, x + 4, 79);
    });

    // Section 2: Multi-Channel Threat Simulation Breakdown
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Multi-Channel Simulation Performance', 14, 95);

    const channelRows = [
      ['Email Phishing', `${channels.EMAIL.total}`, `${channels.EMAIL.completed}`, `${channels.EMAIL.compromised} (${channels.EMAIL.compromise_rate}%)`, `${channels.EMAIL.reported} (${channels.EMAIL.reporting_rate}%)`],
      ['SMS Smishing', `${channels.SMS.total}`, `${channels.SMS.completed}`, `${channels.SMS.compromised} (${channels.SMS.compromise_rate}%)`, `${channels.SMS.reported} (${channels.SMS.reporting_rate}%)`],
      ['Controlled Voice (Vishing)', `${channels.VOICE.total}`, `${channels.VOICE.completed}`, `${channels.VOICE.compromised} (${channels.VOICE.compromise_rate}%)`, `${channels.VOICE.reported} (${channels.VOICE.reporting_rate}%)`],
      ['Multi-Stage Coordinated', `${channels.MULTI_STAGE.total}`, `${channels.MULTI_STAGE.completed}`, `${channels.MULTI_STAGE.compromised} (${channels.MULTI_STAGE.compromise_rate}%)`, `${channels.MULTI_STAGE.reported} (${channels.MULTI_STAGE.reporting_rate}%)`]
    ];

    (doc as any).autoTable({
      startY: 100,
      head: [['Attack Channel', 'Total Dispatched', 'Interacted', 'Compromised / Failed', 'Safely Reported']],
      body: channelRows,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [30, 41, 59] }
    });

    // Section 3: Department Risk Heatmap Table
    const lastY = (doc as any).lastAutoTable?.finalY || 140;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Department Risk & Vulnerability Matrix', 14, lastY + 12);

    const deptRows = departments.map(d => [
      d.name,
      `${d.employee_count}`,
      `${d.avg_security_score}/100`,
      d.risk_level,
      `${d.failure_rate}%`,
      `${d.reporting_rate}%`,
      `${d.trainings_completed}`
    ]);

    (doc as any).autoTable({
      startY: lastY + 16,
      head: [['Department', 'Staff', 'Security Score', 'Risk Level', 'Failure Rate', 'Reporting Rate', 'Training Done']],
      body: deptRows.length > 0 ? deptRows : [['No department data available', '-', '-', '-', '-', '-', '-']],
      theme: 'grid',
      headStyles: { fillColor: [5, 150, 105], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [30, 41, 59] }
    });

    // Footer
    const finalY = (doc as any).lastAutoTable?.finalY || 200;
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Confidential — Generated by LockPhish Enterprise Human Risk Management Platform. Authorized internal use only.', 14, Math.min(finalY + 15, 285));

    const arrayBuffer = doc.output('arraybuffer');
    return Buffer.from(arrayBuffer);
  }
}
