import React from 'react';
import {
  Shield,
  ShieldCheck,
  EyeOff,
  History,
  Layers,
  Radar,
  Lock,
  KeyRound,
  Fingerprint
} from 'lucide-react';

interface AuthShellProps {
  children: React.ReactNode;
}

/**
 * Professional cybersecurity operations shell for all unauthenticated pages
 * (login / register / recovery). Split command-center layout with live
 * status telemetry and zero-credential security guarantees.
 */
export const AuthShell: React.FC<AuthShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#04070d] text-slate-100 relative overflow-hidden flex selection:bg-emerald-500 selection:text-white">
      {/* Cyber grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.16] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(16,185,129,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.35) 1px, transparent 1px)',
          backgroundSize: '44px 44px'
        }}
      />
      <div className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[560px] h-[560px] rounded-full bg-sky-600/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent pointer-events-none" />

      {/* Left command panel */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] xl:w-[42%] p-12 relative z-10 border-r border-slate-800/60">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="LockPhish" className="w-12 h-12 rounded-2xl  border border-emerald-400/40   shadow-2xl shadow-emerald-950/70 object-contain" />
            <div>
              <h1 className="text-2xl font-black tracking-tight">
                LOCK<span className="text-emerald-400">PHISH</span>
              </h1>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Human Risk Management &amp; Attack Simulation Platform
              </p>
            </div>
          </div>

          <div className="mt-10 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 font-mono text-[11px] space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Radar className="w-4 h-4 animate-pulse" /> LIVE SECURITY POSTURE
            </div>
            <div className="flex justify-between text-slate-400"><span>Threat Intel Feed</span><span className="text-emerald-400">● CONNECTED</span></div>
            <div className="flex justify-between text-slate-400"><span>Zero-Credential Vault</span><span className="text-emerald-400">● ENFORCED</span></div>
            <div className="flex justify-between text-slate-400"><span>Audit Ledger</span><span className="text-emerald-400">● IMMUTABLE</span></div>
            <div className="flex justify-between text-slate-400"><span>Session Policy</span><span className="text-amber-400">RE-LOGIN AFTER CLOSE</span></div>
          </div>

          <div className="mt-8 space-y-4 text-xs">
            {[
              { icon: <EyeOff className="w-4 h-4 text-emerald-400" />, t: 'Zero-Credential Redaction', d: 'Passwords, OTPs and tokens are intercepted in volatile memory and sanitized — never persisted.' },
              { icon: <Layers className="w-4 h-4 text-sky-400" />, t: 'Multi-Vector Simulation', d: 'Email, SMS, voice, QR and OAuth attack drills across 120 structured masterclasses.' },
              { icon: <History className="w-4 h-4 text-amber-400" />, t: 'Immutable Audit Trail', d: 'Every login, training step and report is recorded for forensic investigation.' },
              { icon: <Fingerprint className="w-4 h-4 text-purple-400" />, t: 'Hardened Sessions', d: 'Ephemeral sessions by default, 15-minute idle auto-lock, brute-force account lockout.' }
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">{f.icon}</div>
                <div>
                  <span className="font-bold text-slate-200 block">{f.t}</span>
                  <span className="text-slate-500 leading-relaxed">{f.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {['SOC 2', 'ISO 27001', 'NIST 800-53', 'HIPAA', 'PCI DSS', 'GDPR'].map(c => (
              <span key={c} className="text-[9px] font-mono font-bold text-slate-400 bg-slate-900 border border-slate-800 rounded-full px-2.5 py-1">{c}</span>
            ))}
          </div>
          <p className="text-[10px] font-mono text-slate-600">
            AUTHORIZED PERSONNEL ONLY · ALL ACCESS ATTEMPTS ARE LOGGED &amp; MONITORED
          </p>
        </div>
      </div>

      {/* Right content pane */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {/* Mobile brand */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <img src="/logo.png" alt="LockPhish" className="w-10 h-10 rounded-xl  border border-emerald-400/40   shadow-xl object-contain" />
          <div>
            <h1 className="text-xl font-black tracking-tight">LOCK<span className="text-emerald-400">PHISH</span></h1>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Human Risk Management Platform</p>
          </div>
        </div>

        {children}

        <div className="mt-8 flex items-center gap-2 text-[10px] font-mono text-slate-600">
          <Lock className="w-3 h-3" /> TLS-ENFORCED · <KeyRound className="w-3 h-3" /> BCRYPT HASHING · <ShieldCheck className="w-3 h-3" /> JWT SHORT-LIVED
        </div>
      </div>
    </div>
  );
};
