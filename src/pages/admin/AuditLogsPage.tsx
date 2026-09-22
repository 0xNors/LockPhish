import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Shield,
  Download,
  Calendar,
  Lock
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingState } from '../../components/common/LoadingState';
import { api } from '../../api/client';
import { AuditLog } from '../../types';
import { exportAuditCSV, exportAuditExcel, exportAuditWord, exportAuditPDF } from '../../utils/auditExport';
import { RELEASE_TAG } from '../../release';

interface AuditLogsPageProps {
  navigate: (path: string) => void;
}

export const AuditLogsPage: React.FC<AuditLogsPageProps> = ({ navigate }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [serverRelease, setServerRelease] = useState('');
  const [healthChecked, setHealthChecked] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => { setServerRelease(d.release || ''); setHealthChecked(true); })
      .catch(() => setHealthChecked(true));
  }, []);

  const staleBackend = healthChecked && serverRelease !== RELEASE_TAG;

  useEffect(() => {
    loadLogs();
  }, [actionFilter]);

  const loadLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.audit.getLogs({
        action: actionFilter || undefined,
        search: search || undefined,
        limit: 50
      });
      setLogs(data.logs || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Could not load audit logs. Your session may have expired or your role may lack permission — try logging in again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadLogs();
  };

  const handleExport = async (fmt: 'CSV' | 'XLS' | 'DOC' | 'PDF') => {
    try {
      const data = await api.audit.getLogs({ limit: 1000 });
      const logs = data.logs || [];
      if (!logs.length) return;
      if (fmt === 'CSV') exportAuditCSV(logs);
      if (fmt === 'XLS') exportAuditExcel(logs);
      if (fmt === 'DOC') exportAuditWord(logs);
      if (fmt === 'PDF') exportAuditPDF(logs);
    } catch (err: any) {
      setError(err?.message || 'Export failed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Security Audit Logs</h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable system audit records of all administrative actions, campaign state changes, and security operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5">
            {total} immutable record{total === 1 ? '' : 's'}
          </span>
          <Button
            variant="secondary"
            size="sm"
            icon={<History className="w-3.5 h-3.5" />}
            onClick={loadLogs}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={() => handleExport('CSV')}
          >
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={() => handleExport('XLS')}
          >
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={() => handleExport('DOC')}
          >
            Word
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={() => handleExport('PDF')}
          >
            PDF
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <Input
            placeholder="Search by actor name, action, or resource..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
          <Button type="submit" variant="secondary" size="md">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Actions</option>
            <option value="LOGIN_SUCCESS">Login Success</option>
            <option value="LOGIN_FAILED">Login Failed</option>
            <option value="ORGANIZATION_REGISTERED">Organization Registered</option>
            <option value="EMPLOYEE_CREATED">Employee Created</option>
            <option value="CAMPAIGN_CREATED">Campaign Created</option>
            <option value="CAMPAIGN_LAUNCHED">Campaign Launched</option>
            <option value="CAMPAIGN_PAUSED">Campaign Paused</option>
            <option value="EMERGENCY_STOP_TRIGGERED">Emergency Stop Triggered</option>
            <option value="TRAINING_ASSIGNED">Training Assigned</option>
            <option value="TRAINING_PROGRESS_UPDATED">Training Progress</option>
            <option value="TRAINING_COMPLETED">Training Completed</option>
            <option value="ASSESSMENT_PASSED">Assessment Passed</option>
            <option value="ASSESSMENT_FAILED">Assessment Failed</option>
            <option value="CERTIFICATE_ISSUED">Certificate Issued</option>
            <option value="THREAT_REPORTED">Threat Reported</option>
            <option value="SYSTEM_STARTED">System Started</option>
            <option value="MIGRATIONS_COMPLETED">Migrations Completed</option>
            <option value="SCHEDULER_STARTED">Scheduler Started</option>
            <option value="AUDIT_LEDGER_INITIALIZED">Audit Ledger Initialized</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      {loading ? (
        <LoadingState message="Loading immutable audit logs..." />
      ) : error ? (
        <div className="p-5 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-200 text-xs space-y-2">
          <div className="font-bold flex items-center gap-2"><Shield className="w-4 h-4" /> Audit feed unavailable</div>
          <p className="leading-relaxed opacity-90">{error}</p>
          <Button variant="primary" size="sm" onClick={loadLogs}>Retry</Button>
        </div>
      ) : logs.length === 0 ? (
        <div className="space-y-3">
          {staleBackend && (
            <div className="p-4 rounded-xl bg-rose-950/60 border-2 border-rose-700 text-rose-200 text-xs leading-relaxed font-bold">
              ⚠ BACKEND PROCESS OUTDATED — THIS IS WHY NO LOGS APPEAR. The website files were updated but the old server program is still running and was never restarted, so audit logging is inactive. Fix: fully stop the old server (close its terminal / task-manager process, or run <code className="font-mono">pkill node</code>), then run <code className="font-mono">npm start</code> again. With this release that restart happens automatically (the start script frees the port), and on boot the platform writes the initial audit entries for your organization.
            </div>
          )}
          <EmptyState title="No audit logs matched" description="Administrative events will appear automatically as actions are taken." />
          <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-800/60 text-sky-200 text-xs leading-relaxed">
            <strong className="block mb-1">Fresh deployment?</strong>
            If this server was just updated, fully stop the old backend process (close its terminal / task-manager process or run <code className="font-mono">pkill node</code>), then start it again with <code className="font-mono">npm start</code>. On boot the platform initializes the immutable audit ledger for your organization and every login, training step, campaign and export will then appear here.
          </div>
        </div>
      ) : (
        <Table
          data={logs}
          keyExtractor={l => l.id}
          columns={[
            {
              header: 'Timestamp',
              accessor: l => (
                <span className="text-[11px] font-mono text-slate-400">
                  {new Date(l.created_at + 'Z').toLocaleString()}
                </span>
              )
            },
            {
              header: 'Actor',
              accessor: l => (
                <div>
                  <span className="font-bold text-slate-200 block">{l.actor_name}</span>
                  <span className="text-[10px] text-slate-500">{l.actor_role}</span>
                </div>
              )
            },
            {
              header: 'Action',
              accessor: l => (
                <span className={`font-mono font-bold text-xs ${
                  l.action.includes('STOP') || l.action.includes('FAILED') ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {l.action}
                </span>
              )
            },
            {
              header: 'Resource',
              accessor: l => <span className="text-slate-300 font-mono text-xs">{l.resource}</span>
            },
            {
              header: 'Source IP',
              accessor: l => <span className="text-slate-400 font-mono text-[11px]">{l.ip_address || '—'}</span>
            },
            {
              header: 'Details',
              accessor: l => (
                <span className="text-[11px] font-mono text-slate-400 truncate max-w-xs block">
                  {JSON.stringify(l.details)}
                </span>
              )
            }
          ]}
        />
      )}
    </div>
  );
};
