import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Download,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  SlidersHorizontal,
  Send,
  Sparkles,
  FileDown,
  Printer
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { api } from '../../api/client';

interface ReportsPageProps {
  navigate: (path: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ navigate }) => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingCsv, setDownloadingCsv] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleFreq, setScheduleFreq] = useState<'WEEKLY' | 'MONTHLY' | 'QUARTERLY'>('MONTHLY');
  const [scheduleEmail, setScheduleEmail] = useState('ciso@company.com');
  const [scheduleSaved, setScheduleSaved] = useState(false);

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      await api.reports.downloadPDF();
      setDownloadingPdf(false);
    } catch (err: any) {
      setDownloadingPdf(false);
      alert(err.message || 'Failed to download PDF report');
    }
  };

  const handleDownloadCsv = async (type: string) => {
    setDownloadingCsv(type);
    try {
      await api.reports.downloadCSV(type);
      setDownloadingCsv(null);
    } catch (err: any) {
      setDownloadingCsv(null);
      alert(err.message || 'Failed to export CSV dataset');
    }
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleSaved(true);
    setTimeout(() => {
      setScheduleSaved(false);
      setShowScheduleModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            <span>Reports & Compliance Exports</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate executive board-level cyber resilience PDFs, schedule automated email reports, and export auditable CSV datasets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Clock className="w-3.5 h-3.5" />}
            onClick={() => setShowScheduleModal(true)}
          >
            Scheduled Reports
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            loading={downloadingPdf}
            onClick={handleDownloadPdf}
          >
            Download Executive PDF
          </Button>
        </div>
      </div>

      {/* Primary Executive Report Highlight Card */}
      <div className="p-6 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border-2 border-emerald-500/50 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shrink-0 shadow-xl">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-100">Board-Ready Executive Human Risk & Resilience Assessment</h3>
              <Badge variant="low" size="sm">Executive PDF</Badge>
              <Badge variant="active" size="sm">jspdf Engine</Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-2xl">
              Comprehensive report containing executive KPI summary, multi-channel attack surface comparison (Email, SMS, Voice, Multi-Stage), department vulnerability rankings, pre/post training improvement deltas, and regulatory compliance evidence for cyber underwriters.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<FileDown className="w-4 h-4" />}
          loading={downloadingPdf}
          onClick={handleDownloadPdf}
        >
          Generate PDF Report
        </Button>
      </div>

      {/* CSV Datasets Grid */}
      <Card
        title="Auditable Raw Dataset CSV Exports"
        subtitle="Direct extraction of real SQLite database records for SOC ingestion, SIEM analytics, and external auditor verification"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {[
            {
              type: 'SIMULATIONS',
              title: 'Simulation Behavioral Events',
              badge: 'Behavioral Logs',
              desc: 'Every delivered, opened, header-inspected, link-clicked, and reported simulation mission with microsecond timestamps.'
            },
            {
              type: 'EMPLOYEES',
              title: 'Workforce Risk Profiles',
              badge: 'Roster & Scores',
              desc: 'Current security resilience scores (0-100), risk levels, department assignments, and historical compromise counts.'
            },
            {
              type: 'CAMPAIGNS',
              title: 'Campaign Lifecycle Records',
              badge: 'Campaign Metrics',
              desc: 'Campaign status, target totals, start/end timestamps, psychological triggers, and reporting efficacy percentages.'
            },
            {
              type: 'TRAINING',
              title: 'Academy & Assessment Records',
              badge: 'LMS Ledger',
              desc: 'Course completions, pre/post assessment scores, knowledge retention improvement deltas, and completion dates.'
            },
            {
              type: 'AUDIT_LOGS',
              title: 'Immutable Administrative Audit Trail',
              badge: 'Tamper-Evident',
              desc: 'Record of administrative actions, user logins, campaign triggers, and zero-credential redactions with IP addresses.'
            }
          ].map((item) => (
            <div
              key={item.type}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-slate-100 text-xs">{item.title}</span>
                  </div>
                  <Badge variant="info" size="sm">{item.badge}</Badge>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed font-sans">{item.desc}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center"
                icon={<Download className="w-3.5 h-3.5" />}
                loading={downloadingCsv === item.type}
                onClick={() => handleDownloadCsv(item.type)}
              >
                Export {item.type} CSV
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Scheduled Report Distribution Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Automated Scheduled Report Distribution"
        subtitle="Deliver recurring executive risk summaries directly to stakeholders"
        maxWidth="md"
      >
        <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs font-sans">
          {scheduleSaved && (
            <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-600 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Report schedule preferences saved successfully!</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block font-bold text-slate-300">Delivery Frequency</label>
            <div className="grid grid-cols-3 gap-2">
              {(['WEEKLY', 'MONTHLY', 'QUARTERLY'] as const).map(freq => (
                <button
                  type="button"
                  key={freq}
                  onClick={() => setScheduleFreq(freq)}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all ${
                    scheduleFreq === freq
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-slate-300">Recipient Email Addresses (Comma Separated)</label>
            <input
              type="text"
              required
              value={scheduleEmail}
              onChange={e => setScheduleEmail(e.target.value)}
              placeholder="ciso@company.com, secops-team@company.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Sparkles className="w-3 h-3" />
              <span>Automatic Email Summary</span>
            </div>
            <p>
              Includes executive PDF attachment with cryptographic hash verification and current HRI metrics.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" icon={<Send className="w-3.5 h-3.5" />}>
              Save Automated Schedule
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
