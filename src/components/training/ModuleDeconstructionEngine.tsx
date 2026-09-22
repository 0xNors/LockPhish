import React, { useState } from 'react';
import {
  Globe,
  Lock,
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  Paperclip,
  QrCode,
  Layers,
  Terminal,
  Zap,
  Eye,
  CheckCircle2,
  ExternalLink,
  DollarSign,
  Briefcase,
  User,
  Users,
  Radio,
  Clock,
  Sparkles,
  KeyRound,
  Mail,
  Smartphone,
  PhoneCall,
  HardDrive,
  Cpu,
  Server,
  Building2,
  FileCode,
  Wifi,
  Check
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface ModuleDeconstructionEngineProps {
  module: any;
  course: any;
  stepIndex: number;
}

export const ModuleDeconstructionEngine: React.FC<ModuleDeconstructionEngineProps> = ({
  module,
  course,
  stepIndex
}) => {
  const [inspectedElement, setInspectedElement] = useState<string | null>(null);

  // Topic & Vector Classification
  const title = (module?.title || course?.course_title || course?.title || '').toLowerCase();
  const category = (course?.course_category || course?.category || 'SOCIAL_ENGINEERING').toUpperCase();
  const courseCode = (course?.course_code || course?.code || '').toUpperCase();
  const combined = `${title} ${category} ${courseCode}`.toLowerCase();

  const isInitialAccess = combined.includes('cybersecurity') || combined.includes('basics') || combined.includes('operate') || combined.includes('threat landscape') || combined.includes('attack lifecycle') || combined.includes('foundations') || combined.includes('role') || combined.includes('target employee') || combined.includes('what attackers want');
  const isUrlSecurity = combined.includes('url') || combined.includes('link') || combined.includes('domain') || combined.includes('typosquat') || combined.includes('homoglyph') || combined.includes('https') || combined.includes('shortener') || combined.includes('redirect');
  const isEmailHeaders = combined.includes('header') || combined.includes('sender') || combined.includes('display name') || combined.includes('reply-to') || combined.includes('spf') || combined.includes('dkim') || combined.includes('dmarc') || combined.includes('email anatomy') || combined.includes('banner');
  const isAttachmentMacro = combined.includes('attachment') || combined.includes('macro') || combined.includes('excel') || combined.includes('xlsm') || combined.includes('document') || combined.includes('dangerous file') || combined.includes('vba') || combined.includes('extension');
  const isBecFinancial = combined.includes('bec') || combined.includes('wire') || combined.includes('invoice') || combined.includes('payroll') || combined.includes('financial') || combined.includes('executive impersonation') || combined.includes('bank detail') || combined.includes('gift card');
  const isMfaOAuth = combined.includes('mfa') || combined.includes('oauth') || combined.includes('fatigue') || combined.includes('aitm') || combined.includes('proxy') || combined.includes('session') || combined.includes('consent') || combined.includes('token') || combined.includes('credential');
  const isQuishing = combined.includes('qr') || combined.includes('quishing');
  const isSmsSmishing = combined.includes('sms') || combined.includes('smish') || combined.includes('delivery') || combined.includes('courier') || combined.includes('mobile message');
  const isVoiceVishing = combined.includes('voice') || combined.includes('vish') || combined.includes('call') || combined.includes('deepfake') || combined.includes('cloning');
  const isPsychology = combined.includes('psychology') || combined.includes('authority') || combined.includes('urgency') || combined.includes('fear') || combined.includes('curiosity') || combined.includes('greed') || combined.includes('social proof') || combined.includes('reciprocity');
  const isAiEra = combined.includes('ai') || combined.includes('prompt injection') || combined.includes('copilot') || combined.includes('synthetic') || combined.includes('generative');
  const isIncidentResponse = combined.includes('incident') || combined.includes('reporting') || combined.includes('after clicking') || combined.includes('tailgating') || combined.includes('usb') || combined.includes('clean desk') || combined.includes('isolation');

  const decon = module?.link_deconstruction || {
    display_text: 'https://security-verify.company.com',
    actual_url: 'https://security-verify.company.com.external-auth-gate.org/v2',
    root_domain: 'external-auth-gate.org',
    spoofed_domain: 'security-verify.company.com',
    red_flags: ['Lookalike root domain', 'Subdomain prefix masking', 'Mismatched envelope routing'],
    technical_analysis: 'The display text suggests an authorized company server, but the controlling root domain points to an unverified external server.'
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-xs space-y-6 animate-fadeIn font-sans text-slate-100 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="font-bold text-sm text-slate-100">Technical Forensic Deconstruction & Element Inspector</h3>
            <span className="text-[10px] text-slate-400 font-mono">Topic: {course?.course_title || course?.title || 'Security Masterclass'}</span>
          </div>
        </div>
        <Badge variant="medium" size="sm">Interactive Forensic Lab</Badge>
      </div>

      {/* 1. INITIAL ACCESS & ATTACK LIFECYCLE DECONSTRUCTION */}
      {isInitialAccess ? (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              7-Stage Cyber Kill Chain Intrusion Breakdown:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-[11px]">
              <div
                onClick={() => setInspectedElement('RECON')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  inspectedElement === 'RECON' ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] text-slate-500 block">Phase 1</span>
                <strong>OSINT Recon</strong>
              </div>
              <div
                onClick={() => setInspectedElement('WEAPON')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  inspectedElement === 'WEAPON' ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] text-slate-500 block">Phase 2</span>
                <strong>Weaponization</strong>
              </div>
              <div
                onClick={() => setInspectedElement('DELIVERY')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  inspectedElement === 'DELIVERY' ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] text-slate-500 block">Phase 3</span>
                <strong>Lure Delivery</strong>
              </div>
              <div
                onClick={() => setInspectedElement('C2')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  inspectedElement === 'C2' ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] text-slate-500 block">Phase 4</span>
                <strong>Lateral Access</strong>
              </div>
            </div>
          </div>

          {inspectedElement && (
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/80 space-y-1.5 animate-fadeIn">
              <span className="font-bold text-emerald-400 text-xs">🔍 Kill Chain Phase Analysis:</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {inspectedElement === 'RECON' && 'Adversaries harvest employee names, corporate email formats, and vendor relationships from public LinkedIn profiles and SEC filings.'}
                {inspectedElement === 'WEAPON' && 'Attackers configure lookalike domain infrastructure (SPF/DKIM spoofing, AitM reverse proxies, and weaponized Excel macros).'}
                {inspectedElement === 'DELIVERY' && 'The phishing email or SMS smish is dispatched. This is the primary point where employee vigilance can stop the attack.'}
                {inspectedElement === 'C2' && 'Once a session token or credential is stolen, attackers establish command-and-control persistence to move laterally toward financial databases.'}
              </p>
            </div>
          )}

          {/* External Guidance Links for Foundations */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" /> Authoritative Cybersecurity Framework Guidance:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a href="https://www.nist.gov/cyberframework" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 text-slate-300 text-[11px] flex justify-between items-center group">
                <span className="truncate">🏛️ NIST Cybersecurity Framework 2.0 (CSF)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
              </a>
              <a href="https://www.cisa.gov/cross-sector-cybersecurity-performance-goals" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 text-slate-300 text-[11px] flex justify-between items-center group">
                <span className="truncate">🛡️ CISA Cross-Sector Performance Goals (CPGs)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      ) : isEmailHeaders ? (
        /* 2. EMAIL SENDER & RFC HEADERS DECONSTRUCTION */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 font-mono text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">
              Clickable RFC 5322 MIME Header Inspector:
            </span>

            <div onClick={() => setInspectedElement('FROM')} className={`p-2.5 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${inspectedElement === 'FROM' ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
              <span>Header: From: &quot;Victoria Sterling (CEO)&quot; &lt;ceo-office@company-corp.com&gt;</span>
              <Badge variant="info" size="sm">Click</Badge>
            </div>

            <div onClick={() => setInspectedElement('RETURN_PATH')} className={`p-2.5 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${inspectedElement === 'RETURN_PATH' ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
              <span>Envelope: Return-Path: &lt;bounce@attacker-relay-mail.ru&gt;</span>
              <Badge variant="critical" size="sm">Mismatch</Badge>
            </div>

            <div onClick={() => setInspectedElement('AUTH')} className={`p-2.5 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${inspectedElement === 'AUTH' ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
              <span>Authentication-Results: spf=fail (IP 194.26.29.11) dkim=invalid dmarc=reject</span>
              <Badge variant="critical" size="sm">SPF FAIL</Badge>
            </div>
          </div>

          {inspectedElement && (
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/80 space-y-1.5 animate-fadeIn font-sans text-[11px]">
              <span className="font-bold text-emerald-400 text-xs">🔍 Forensic Analysis:</span>
              <p className="text-slate-300">
                {inspectedElement === 'FROM' && 'The display name claims to be the CEO, but display names are unverified free-text fields in mail clients.'}
                {inspectedElement === 'RETURN_PATH' && 'The Return-Path header reveals the actual sending server mailbox. Here it routes to an untrusted external bulletproof host.'}
                {inspectedElement === 'AUTH' && 'SPF failed because the sending IP address is not authorized in the DNS TXT record of the purported sender domain.'}
              </p>
            </div>
          )}

          {/* External Guidance Links for Headers */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 font-sans">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" /> Email Cryptographic Standards Guidance:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a href="https://dmarc.org/overview/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 text-slate-300 text-[11px] flex justify-between items-center group">
                <span className="truncate">📧 DMARC.org: Email Authentication Architecture</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
              </a>
              <a href="https://www.cisa.gov/news-events/cybersecurity-advisories" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 text-slate-300 text-[11px] flex justify-between items-center group">
                <span className="truncate">🛡️ CISA Binding Directive 18-01 on SPF/DKIM</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      ) : isBecFinancial ? (
        /* 3. BEC & FINANCIAL FRAUD DECONSTRUCTION */
        <div className="space-y-4 font-sans">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">
              Side-by-Side W-9 & Wire Routing Dissection:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/60 space-y-1">
                <span className="text-emerald-400 font-bold block text-xs">✓ Verified ERP Record</span>
                <div className="text-[11px] font-mono text-slate-300">
                  <div>Vendor: Apex Consulting LLC</div>
                  <div>Bank: Chase Commercial</div>
                  <div>Routing: <strong>021000021</strong></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/80 space-y-1">
                <span className="text-rose-400 font-bold block text-xs">🚨 Forged Email Invoice</span>
                <div className="text-[11px] font-mono text-slate-300">
                  <div>Vendor: Apex Consu1ting LLC</div>
                  <div>Bank: Offshore Escrow</div>
                  <div>Routing: <strong className="text-rose-400">091000994 (TAMPERED)</strong></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" /> Federal Fraud Prevention Guidance:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a href="https://www.ic3.gov/Media/Y2023/PSA230609" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 text-slate-300 text-[11px] flex justify-between items-center group">
                <span className="truncate">🏛️ FBI IC3: Business Email Compromise Report</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
              </a>
              <a href="https://www.fincen.gov/advisories" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 text-slate-300 text-[11px] flex justify-between items-center group">
                <span className="truncate">💵 FinCEN Advisory on Wire Fraud Redirection</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      ) : isAttachmentMacro ? (
        /* 4. ATTACHMENT & MACRO DECONSTRUCTION */
        <div className="space-y-4 font-sans">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">
              Weaponized Document Payload Dissection:
            </span>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-300">
              <div><strong>File Container:</strong> Bonus_Matrix.xlsm (Office Open XML / OLE2)</div>
              <div><strong>VBA Stream:</strong> <span className="text-rose-400 font-bold">Auto_Open() sub executing powershell.exe -w hidden</span></div>
              <div><strong>Defense Barrier:</strong> <span className="text-emerald-400 font-bold">Microsoft Protected View (Macros Disabled)</span></div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" /> Malicious Document Research Links:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a href="https://learn.microsoft.com/en-us/deployoffice/security/internet-macros-blocked" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 text-slate-300 text-[11px] flex justify-between items-center group">
                <span className="truncate">📑 Microsoft: Default Macro Blocking Policy</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
              </a>
              <a href="https://attack.mitre.org/techniques/T1204/002/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 text-slate-300 text-[11px] flex justify-between items-center group">
                <span className="truncate">🔬 MITRE ATT&CK: Malicious File Execution (T1204)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* 5. DEFAULT TOPIC-SPECIFIC URL & DOMAIN DECONSTRUCTION */
        <div className="space-y-4 font-sans">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Visual URL Root vs Subdomain Dissector:
            </span>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs flex items-center gap-1 overflow-x-auto shadow-inner">
              <span className="text-slate-500">https://</span>
              <span className="text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800 font-bold">
                {decon.spoofed_domain}.
              </span>
              <span className="text-rose-400 font-black bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-700 underline">
                {decon.root_domain}
              </span>
              <span className="text-slate-400">/v2/auth</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
              <span>⚠️ Subdomain masks brand</span>
              <span className="text-rose-400 font-bold">🚨 True host: {decon.root_domain}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" /> Official Cybersecurity Guidance Links:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a href="https://www.cisa.gov/secure-our-world/recognize-and-report-phishing" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 text-slate-300 text-[11px] flex justify-between items-center group">
                <span className="truncate">🛡️ CISA Phishing Recognition Guide</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
              </a>
              <a href="https://attack.mitre.org/techniques/T1566/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 text-slate-300 text-[11px] flex justify-between items-center group">
                <span className="truncate">🔬 MITRE ATT&CK: Phishing Vectors (T1566)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Red Flag Checklist */}
      <div className="p-4 bg-rose-950/40 border border-rose-900/60 rounded-2xl text-rose-200 text-xs space-y-1.5">
        <strong>⚠️ Red Flag Summary Checklist for this Technique:</strong>
        <ul className="list-disc list-inside space-y-0.5 text-rose-300/90 mt-1">
          {decon.red_flags.map((rf: string, i: number) => (
            <li key={i}>{rf}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
