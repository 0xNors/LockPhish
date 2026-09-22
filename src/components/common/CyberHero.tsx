import React from 'react';
import { Radar } from 'lucide-react';

interface CyberHeroProps {
  title: string;
  subtitle: string;
  chips?: Array<{ label: string; value: string; tone?: 'emerald' | 'amber' | 'sky' }>;
}

/** Command-center hero banner used on the main dashboards. */
export const CyberHero: React.FC<CyberHeroProps> = ({ title, subtitle, chips = [] }) => (
  <div className="cyber-card relative overflow-hidden rounded-2xl border border-emerald-900/40 bg-gradient-to-r from-[#062019] via-[#04070d] to-[#04070d] p-6 shadow-xl shadow-black/50">
    <div
      className="absolute inset-0 opacity-20 pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(rgba(16,185,129,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.4) 1px, transparent 1px)',
        backgroundSize: '28px 28px'
      }}
    />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />
    <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
          <Radar className="w-4 h-4 animate-pulse" /> Security Command Center
        </div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight mt-1">{title}</h1>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((c, i) => (
            <div key={i} className="px-3 py-2 rounded-xl bg-slate-950/80 border border-emerald-900/40 text-center min-w-[92px]">
              <span className="block text-[9px] font-mono uppercase tracking-widest text-slate-500">{c.label}</span>
              <span className={`block text-sm font-black font-mono ${c.tone === 'amber' ? 'text-amber-400' : c.tone === 'sky' ? 'text-sky-400' : 'text-emerald-400'}`}>{c.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
