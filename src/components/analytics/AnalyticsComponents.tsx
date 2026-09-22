import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

interface RiskScoreCardProps {
  score: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;
  title?: string;
  subtitle?: string;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({
  score,
  riskLevel,
  title = 'Human Risk Score',
  subtitle = 'Calculated from simulation events & training compliance'
}) => {
  const normRisk = (typeof riskLevel === 'string' ? riskLevel.toUpperCase() : 'LOW') as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  const riskColors = {
    LOW: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40',
    MEDIUM: 'text-amber-400 border-amber-500/50 bg-amber-950/40',
    HIGH: 'text-orange-400 border-orange-500/50 bg-orange-950/40',
    CRITICAL: 'text-rose-400 border-rose-500/50 bg-rose-950/40 animate-pulse'
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>

      <div className="my-6 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-slate-100 tracking-tight">{score}</span>
          <span className="text-sm font-bold text-slate-500">/ 100</span>
        </div>

        <div className={`px-4 py-2 rounded-xl border font-black text-xs tracking-wider uppercase ${riskColors[normRisk] || riskColors.LOW}`}>
          {normRisk} RISK
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-slate-400">
          <span>Security Health</span>
          <span className="text-slate-200 font-bold">{score >= 85 ? 'Optimal' : score >= 65 ? 'Moderate' : 'Action Needed'}</span>
        </div>
        <ProgressBar
          value={score}
          showPercentage={false}
          size="md"
          variant={score >= 85 ? 'emerald' : score >= 65 ? 'amber' : 'rose'}
        />
      </div>
    </div>
  );
};

interface RiskTrendChartProps {
  data: Array<{ date: string; security_score: number; sample_size?: number }>;
}

export const RiskTrendChart: React.FC<RiskTrendChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-xl">
        <p className="text-xs text-slate-500">No trend snapshots recorded yet.</p>
      </div>
    );
  }

  const scores = data.map(d => d.security_score);
  const min = Math.min(...scores, 0);
  const max = 100;
  const width = 600;
  const height = 180;
  const padding = 20;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((d.security_score - min) / Math.max(1, max - min)) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#1e293b" strokeDasharray="3 3" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#1e293b" strokeDasharray="3 3" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#1e293b" />

        {/* Trend Polyline */}
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = padding + (i / Math.max(1, data.length - 1)) * (width - 2 * padding);
          const y = height - padding - ((d.security_score - min) / Math.max(1, max - min)) * (height - 2 * padding);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="#060a14" stroke="#10b981" strokeWidth="2.5" />
            </g>
          );
        })}
      </svg>

      <div className="flex justify-between px-2 text-[10px] font-mono text-slate-500 mt-1">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
};

interface DepartmentHeatmapProps {
  departments: Array<{
    id: string;
    name: string;
    employee_count: number;
    avg_security_score: number;
    risk_level: string;
    failure_rate: number;
    reporting_rate: number;
  }>;
}

export const DepartmentRiskHeatmap: React.FC<DepartmentHeatmapProps> = ({ departments }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {departments.map((d) => (
        <div key={d.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-100 truncate">{d.name}</h4>
              <p className="text-[11px] text-slate-500">{d.employee_count} active staff</p>
            </div>
            <Badge variant={d.risk_level.toLowerCase()} size="sm">
              {d.risk_level}
            </Badge>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs font-semibold text-slate-400">Score</span>
            <span className="text-lg font-black text-slate-200">{d.avg_security_score}/100</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
            <div>
              <span className="text-slate-500 block">Failure Rate</span>
              <span className="font-bold text-rose-400">{d.failure_rate}%</span>
            </div>
            <div>
              <span className="text-slate-500 block">Reporting Rate</span>
              <span className="font-bold text-emerald-400">{d.reporting_rate}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface ChannelComparisonProps {
  channels: Record<string, { total: number; completed: number; reported: number; compromised: number; reporting_rate: number; compromise_rate: number }>;
}

export const ChannelComparisonChart: React.FC<ChannelComparisonProps> = ({ channels }) => {
  const channelList = [
    { key: 'EMAIL', name: 'Email Phishing' },
    { key: 'SMS', name: 'SMS Smishing' },
    { key: 'VOICE', name: 'Controlled Voice (Vishing)' },
    { key: 'MULTI_STAGE', name: 'Multi-Stage Coordinated' }
  ];

  return (
    <div className="space-y-4">
      {channelList.map((ch) => {
        const stats = channels[ch.key] || { total: 0, reporting_rate: 0, compromise_rate: 0 };
        return (
          <div key={ch.key} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">{ch.name}</span>
              <span className="text-slate-500 font-mono">{stats.total} dispatched</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Reported</span>
                  <span className="text-emerald-400 font-bold">{stats.reporting_rate}%</span>
                </div>
                <ProgressBar value={stats.reporting_rate} showPercentage={false} size="sm" variant="emerald" />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Compromised</span>
                  <span className="text-rose-400 font-bold">{stats.compromise_rate}%</span>
                </div>
                <ProgressBar value={stats.compromise_rate} showPercentage={false} size="sm" variant="rose" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
