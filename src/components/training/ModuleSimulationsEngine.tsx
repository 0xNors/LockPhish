import React, { useState } from 'react';
import {
  Mail,
  Smartphone,
  PhoneCall,
  Globe,
  Lock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  QrCode,
  Zap,
  Eye,
  KeyRound,
  Volume2,
  Building2,
  Video,
  Bot,
  User,
  Users,
  Clock,
  Radio,
  HardDrive,
  Wifi,
  Terminal,
  Paperclip
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { getTopicSimulation, TopicSimulationSpec } from './simulationMasterData';

interface ModuleSimulationsEngineProps {
  module: any;
  course: any;
  stepIndex: number;
}

export const ModuleSimulationsEngine: React.FC<ModuleSimulationsEngineProps> = ({
  module,
  course,
  stepIndex
}) => {
  const [hoveredLink, setHoveredLink] = useState(false);
  const [headersOpen, setHeadersOpen] = useState(false);
  const [landingOpen, setLandingOpen] = useState(false);
  const [reported, setReported] = useState(false);
  const [scoreBonus, setScoreBonus] = useState(0);

  // Topic resolution — every course code maps to its own dedicated simulator spec
  const courseCode = course?.course_code || course?.code || module?.course_code || '';
  const courseTitle = course?.course_title || course?.title || 'Cybersecurity Defense';
  const courseCategory = course?.course_category || course?.category || '';
  const spec: TopicSimulationSpec = getTopicSimulation(courseCode, courseTitle, courseCategory);

  const handleReportAction = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setReported(true);
    setScoreBonus(15);
  };

  const reportBtn = (label: string, doneLabel: string) => (
    <Button variant="primary" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />} onClick={handleReportAction}>
      {reported ? doneLabel : label}
    </Button>
  );

  const dangerBtn = (label: string) => (
    <Button variant="danger" size="sm" onClick={() => setLandingOpen(true)}>{label}</Button>
  );

  const renderSim = () => {
    switch (spec.sim_type) {
      /* ------------------------------------------------ EMAIL LURE */
      case 'email':
        return (
          <div className="p-6 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">M</div>
                <div>
                  <span className="font-bold text-slate-100 block">{spec.sender_name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">&lt;{spec.sender_email}&gt;</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setHeadersOpen(!headersOpen)}>
                  {headersOpen ? 'Hide RFC Headers' : '🔍 Inspect SPF/DKIM Headers'}
                </Button>
                {reportBtn('Test "Report Phishing"', '✓ Phish Reported (+15 pts)')}
              </div>
            </div>

            {headersOpen && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 animate-fadeIn">
                <div><strong>From:</strong> &quot;{spec.sender_name}&quot; &lt;{spec.sender_email}&gt;</div>
                <div><strong>Return-Path:</strong> &lt;{spec.return_path}&gt;</div>
                <div><strong>SPF Check:</strong> <span className="text-rose-400 font-bold">FAIL (Sending IP unauthorized)</span></div>
                <div><strong>DKIM Signature:</strong> <span className="text-rose-400 font-bold">INVALID (Mismatched crypto header)</span></div>
              </div>
            )}

            <div className="p-4 bg-white text-slate-900 rounded-2xl space-y-3 shadow-inner relative">
              <div className="font-bold text-sm text-slate-900">{spec.headline}</div>
              <p className="text-xs text-slate-700 leading-relaxed">{spec.body}</p>
              <div className="pt-2">
                <button
                  type="button"
                  onMouseEnter={() => setHoveredLink(true)}
                  onMouseLeave={() => setHoveredLink(false)}
                  onClick={() => setLandingOpen(true)}
                  className="px-5 py-2.5 rounded-lg bg-[#0078d4] hover:bg-[#006abc] text-white font-bold text-xs shadow-md transition-colors"
                >
                  {spec.button_text}
                </button>
              </div>
              {hoveredLink && (
                <div className="absolute bottom-2 left-4 bg-slate-950 text-white px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-700 shadow-2xl flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>True Destination: <strong className="text-amber-400">{spec.hover_url}</strong></span>
                </div>
              )}
            </div>
          </div>
        );

      /* ------------------------------------------------ HEADER FORENSICS */
      case 'headers':
        return (
          <div className="p-6 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-slate-100 text-sm">RFC Email Header Forensics & Spoofed Sender Lab</span>
              <Badge variant="medium" size="sm">Header Analyzer</Badge>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div><strong>Display Name:</strong> <span className="text-slate-100 font-bold font-sans">{spec.display_name}</span></div>
                  <div className="text-slate-400 text-[11px]">Visible From: &lt;{spec.from_email}&gt;</div>
                </div>
                <button
                  type="button"
                  onClick={() => setHeadersOpen(!headersOpen)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-emerald-400 hover:text-emerald-300 font-bold text-[11px]"
                >
                  {headersOpen ? 'Hide Full MIME Headers' : '🔍 Dissect MIME Headers'}
                </button>
              </div>

              {headersOpen && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-300 animate-fadeIn">
                  <div><strong>Return-Path:</strong> &lt;{spec.return_path}&gt;</div>
                  <div><strong>Reply-To:</strong> &lt;{spec.reply_to}&gt;</div>
                  <div><strong>Authentication-Results:</strong> <span className="text-rose-400 font-bold">{spec.auth_results}</span></div>
                  <div><strong>DMARC Alignment:</strong> <span className="text-rose-400 font-bold">FAIL (Envelope mismatch)</span></div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {reportBtn('Report Display Name Spoof', '✓ Forged Header Reported (+15 pts)')}
              <Button variant="outline" size="sm" onClick={() => setLandingOpen(true)}>Inspect Reply-To Trap</Button>
            </div>
          </div>
        );

      /* ------------------------------------------------ URL LABORATORY */
      case 'url':
        return (
          <div className="p-6 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-slate-100 text-sm">Interactive URL Structure & Deception Laboratory</span>
              <Badge variant="high" size="sm">URL Inspection Lab</Badge>
            </div>

            <p className="text-slate-300 leading-relaxed">
              Deconstruct this deceptive hyperlink. Study each URI component to understand how attackers mask destination hosts:
            </p>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Inspect Deceptive Target URL:</span>
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs flex items-center gap-1 overflow-x-auto shadow-inner">
                <span className="text-slate-500">https://</span>
                <span className="text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800 font-bold">{spec.fake_subdomain}</span>
                <span className="text-rose-400 font-black bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-700 underline">{spec.root_domain}</span>
                <span className="text-slate-400">{spec.url_path}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <strong className="text-amber-400 block font-mono">1. Familiar Prefix Mask:</strong>
                  <p className="text-slate-400">{spec.url_note_1}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <strong className="text-rose-400 block font-mono">2. Controlling Root Domain:</strong>
                  <p className="text-slate-400">{spec.url_note_2}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {reportBtn('Flag as Lookalike Host', '✓ Lookalike Domain Flagged (+15 pts)')}
              {dangerBtn('Test Visiting Lookalike Gateway')}
            </div>
          </div>
        );

      /* ------------------------------------------------ ATTACHMENT / PROTECTED VIEW */
      case 'attachment':
        return (
          <div className="p-6 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-purple-400" /> {spec.filename} [Protected View]
              </span>
              <Badge variant="critical" size="sm">VBA Macro Lure</Badge>
            </div>

            <div className="p-3.5 bg-[#fff8e1] border-2 border-[#ffe082] rounded-xl flex items-center justify-between text-[#5d4037] gap-3 shadow-md">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#f57f17] shrink-0" />
                <span className="font-bold text-xs">SECURITY WARNING: Certain active content and macros have been disabled.</span>
              </div>
              <button
                type="button"
                onClick={() => setLandingOpen(true)}
                className="px-4 py-1.5 rounded-lg bg-[#f57f17] hover:bg-[#e65100] text-white font-bold text-xs shadow shrink-0"
              >
                Enable Content
              </button>
            </div>

            <div className="p-4 bg-white text-slate-800 rounded-xl border border-slate-200 font-mono text-[11px] opacity-75 blur-[0.5px] space-y-1">
              <div className="grid grid-cols-3 gap-2 font-bold bg-slate-100 p-1.5 rounded">
                {(spec.table_rows?.[0] || ['Item', 'Detail', 'Value']).map((h, i) => <span key={i}>{h}</span>)}
              </div>
              {(spec.table_rows || []).slice(1).map((row, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 p-1.5 border-b">
                  {row.map((c, j) => <span key={j}>{c}</span>)}
                </div>
              ))}
            </div>

            <p className="text-slate-300 leading-relaxed text-[11px]">{spec.lure_text}</p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {reportBtn('Report Suspicious Attachment', '✓ Weaponized Macro Blocked (+15 pts)')}
              {dangerBtn('Simulate Enable Content Click')}
            </div>
          </div>
        );

      /* ------------------------------------------------ BEC COMPARISON */
      case 'bec':
        return (
          <div className="p-6 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-slate-100 text-sm">Payment Detail Modification & Wire Verification Lab</span>
              <Badge variant="critical" size="sm">BEC Wire Fraud</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/60 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-400 text-xs">✓ Verified Record on File</span>
                  <span className="text-[10px] text-slate-400 font-mono">ERP / Contract</span>
                </div>
                <div className="text-[11px] font-mono text-slate-300 space-y-0.5">
                  {(spec.vendor_original || []).map((l, i) => <div key={i}>{l}</div>)}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-rose-500/80 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-rose-400 text-xs">⚠️ Urgent Incoming "Update" Email</span>
                  <Badge variant="critical" size="sm">Forged Details</Badge>
                </div>
                <div className="text-[11px] font-mono text-slate-300 space-y-0.5">
                  {(spec.vendor_forged || []).map((l, i) => <div key={i}>{l}</div>)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {reportBtn('Enforce Dual-Control Signoff', '✓ Wire Fraud Neutralized (+15 pts)')}
              {dangerBtn('Test Wire Release Intercept')}
            </div>
          </div>
        );

      /* ------------------------------------------------ OAUTH CONSENT */
      case 'oauth':
        return (
          <div className="p-6 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-slate-100 text-sm">OAuth 2.0 Application Consent Permission Gate</span>
              <Badge variant="critical" size="sm">Consent Phishing</Badge>
            </div>

            <div className="p-4 bg-white text-slate-900 rounded-2xl border border-slate-300 space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-xs text-slate-800">App: {spec.app_name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${spec.publisher_note?.includes('Unverified') ? 'text-rose-600 bg-rose-50' : 'text-slate-600 bg-slate-100'}`}>{spec.publisher_note}</span>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-700">
                <span className="font-bold text-slate-900 block">Requested Cloud Permissions:</span>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[10px] space-y-1">
                  {(spec.scopes || []).map((s, i) => (
                    <div key={i}>{s.level === 'crit' ? '🚨' : '⚠️'} <strong>{s.name}:</strong> {s.desc}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {reportBtn('Deny & Flag Application', '✓ Illicit Consent Denied (+15 pts)')}
              {dangerBtn('Simulate Grant Permissions')}
            </div>
          </div>
        );

      /* ------------------------------------------------ MFA FATIGUE */
      case 'mfa':
        return (
          <div className="max-w-md mx-auto p-5 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-sky-400 animate-pulse" />
                <span className="font-bold text-slate-100">Mobile MFA Authenticator</span>
              </div>
              <Badge variant="critical" size="sm">{spec.push_count} Pushes / 3 min</Badge>
            </div>

            <div className="space-y-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 shadow">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono"><span>Microsoft Entra ID</span><span>now</span></div>
                  <p className="text-slate-200 font-bold">{spec.push_text}</p>
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={handleReportAction} className="flex-1 p-1.5 rounded-lg bg-emerald-950 border border-emerald-600 text-emerald-300 font-bold hover:bg-emerald-900">Deny</button>
                    <button type="button" onClick={() => setLandingOpen(true)} className="flex-1 p-1.5 rounded-lg bg-rose-950 border border-rose-700 text-rose-300 hover:bg-rose-900">Approve</button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-amber-300 bg-amber-950/40 border border-amber-800 rounded-xl p-3 leading-relaxed">{spec.mfa_note}</p>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              {reportBtn('Report MFA Fatigue Attack', '✓ Push Bombing Reported (+15 pts)')}
            </div>
          </div>
        );

      /* ------------------------------------------------ QR QUISHING */
      case 'qr':
        return (
          <div className="p-6 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-left">
              <span className="font-bold text-slate-100 text-sm">Smartphone Camera QR Code Optical Scanner Viewfinder</span>
              <Badge variant="high" size="sm">Quishing Lab</Badge>
            </div>

            <div className="w-40 h-40 border-2 border-emerald-400 rounded-2xl mx-auto relative flex items-center justify-center p-3 bg-slate-900 shadow-inner">
              <div className="w-full h-0.5 bg-emerald-400 animate-pulse absolute top-1/2 left-0 shadow-lg shadow-emerald-400" />
              <QrCode className="w-24 h-24 text-white" />
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/60 font-mono text-[11px] text-left space-y-1">
              <span className="text-amber-400 font-bold block">Optical URL Decoded:</span>
              <p className="text-slate-200 break-all">{spec.decoded_url}</p>
            </div>
            <p className="text-[11px] text-slate-400 text-left leading-relaxed">{spec.qr_context}</p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {reportBtn('Report QR Quishing', '✓ Quishing Lure Blocked (+15 pts)')}
              {dangerBtn('Open Decoded Link')}
            </div>
          </div>
        );

      /* ------------------------------------------------ SMS SMISHING */
      case 'sms':
        return (
          <div className="max-w-md mx-auto p-5 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold">💬</div>
                <span className="font-bold text-slate-100">{spec.sms_sender} &bull; {spec.sms_phone}</span>
              </div>
              <Badge variant="high" size="sm">Unverified Sender</Badge>
            </div>

            <div className="space-y-2 bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
              <p className="text-slate-200">{spec.sms_message}</p>
              <div
                onClick={() => setLandingOpen(true)}
                className="p-2.5 bg-slate-950 rounded-xl border border-amber-500/60 cursor-pointer hover:border-emerald-500 transition-colors space-y-1"
              >
                <span className="font-bold text-amber-300 block text-[11px]">🔗 {spec.sms_link}</span>
                <span className="text-[10px] text-slate-400 block">Click to test opening the simulated mobile portal</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {reportBtn('Test "Report as Smishing"', '✓ Smish Reported (+15 pts)')}
              {dangerBtn('Test Link Click')}
            </div>
          </div>
        );

      /* ------------------------------------------------ VOICE VISHING */
      case 'voice':
        return (
          <div className="max-w-md mx-auto p-5 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-amber-400 animate-pulse" />
                <span className="font-bold text-slate-100">{spec.caller_id} &bull; {spec.caller_phone}</span>
              </div>
              <Badge variant="critical" size="sm">Spoofed Caller ID</Badge>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 text-center">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">In-Call Simulation (Active)</span>
              <p className="text-slate-200 italic">{spec.call_script}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Test Your Defensive Response:</span>
              <button
                type="button"
                onClick={handleReportAction}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-emerald-600/70 text-emerald-300 font-bold text-left hover:bg-emerald-950 transition-colors"
              >
                ✓ {spec.safe_response}
              </button>
              <button
                type="button"
                onClick={() => setLandingOpen(true)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-rose-900/60 text-rose-300 text-left hover:bg-rose-950 transition-colors"
              >
                ⚠️ {spec.risky_response}
              </button>
            </div>
          </div>
        );

      /* ------------------------------------------------ DEEPFAKE VIDEO */
      case 'video':
        return (
          <div className="p-6 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-slate-100 text-sm flex items-center gap-2"><Video className="w-4 h-4 text-rose-400" /> Live Video Call Forensics Lab</span>
              <Badge variant="critical" size="sm">Deepfake Analysis</Badge>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <div className="aspect-video rounded-xl bg-slate-950 border border-slate-700 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 border-2 border-slate-500 flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-300" />
                </div>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">● REC — {spec.video_caller}</span>
                <div className="absolute inset-x-0 top-0 h-px bg-rose-500/40 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400">Inspect the feed for generative artifacts before trusting any request made on this call:</p>
            </div>

            <div className="space-y-1.5">
              {(spec.video_artifacts || []).map((a, i) => (
                <div key={i} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                  <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /> {a}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {reportBtn('Report Deepfake Call', '✓ Deepfake Identified (+15 pts)')}
              {dangerBtn('Comply With Video Request')}
            </div>
          </div>
        );

      /* ------------------------------------------------ PSYCHOLOGY CLASSIFIER */
      case 'psychology':
        return (
          <div className="p-6 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-slate-100 text-sm">Psychological Manipulation Lever Classifier Lab</span>
              <Badge variant="high" size="sm">Psychology Lab</Badge>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono block">Incoming Scenario Lure:</span>
              <p className="text-sm font-bold text-slate-100 leading-relaxed">{spec.psych_lure}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
              {['👔 1. Authority Compliance', '⏰ 2. Artificial Urgency', '⚠️ 3. Consequence Fear', '💰 4. Financial Greed', '🔍 5. Curiosity Trap', '🤝 6. Social Proof / Trust'].map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={handleReportAction}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:text-emerald-300 text-left transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>

            {reported && (
              <div className="p-3 bg-slate-900 rounded-xl border border-emerald-500/50 text-[11px] text-emerald-300 leading-relaxed">
                <strong>Instructor Debrief:</strong> {spec.psych_answer}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-800">
              {reportBtn('Classify Psychological Trigger', '✓ Trigger Classified (+15 pts)')}
            </div>
          </div>
        );

      /* ------------------------------------------------ AI / HIDDEN PAYLOAD */
      case 'ai':
        return (
          <div className="p-6 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-slate-100 text-sm flex items-center gap-2"><Bot className="w-4 h-4 text-purple-400" /> Hidden Payload in Trusted Content Lab</span>
              <Badge variant="critical" size="sm">AI Red Team Lab</Badge>
            </div>

            <div className="p-4 bg-white text-slate-900 rounded-2xl border border-slate-300 space-y-2 font-mono text-xs shadow-inner">
              <div className="flex justify-between border-b pb-2 font-bold text-slate-800 flex-wrap gap-1">
                <span>Document: {spec.ai_doc}</span>
                <span className="text-rose-600">Hidden Zero-Font Layer Detected</span>
              </div>
              <p className="text-slate-600 text-[11px]">{spec.ai_visible}</p>
              <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-rose-900 text-[10px]">
                <strong>🚨 Embedded Adversarial Payload:</strong><br/>
                <code>{spec.ai_injection}</code>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {reportBtn('Block Malicious AI Ingestion', '✓ Payload Neutralized (+15 pts)')}
              {dangerBtn('Test Execution')}
            </div>
          </div>
        );

      /* ------------------------------------------------ INCIDENT RUNBOOK */
      case 'ir':
        return (
          <div className="p-6 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-slate-100 text-sm">Emergency Response & Containment Runbook</span>
              <Badge variant="high" size="sm">Incident Triage</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
              {(spec.ir_steps || []).map((s, i) => (
                <div key={i} className={`p-3.5 rounded-2xl bg-slate-900 border space-y-1 ${['border-rose-900/80', 'border-amber-900/80', 'border-sky-900/80', 'border-emerald-900/80'][i % 4]}`}>
                  <span className={`font-bold block text-xs ${['text-rose-400', 'text-amber-400', 'text-sky-400', 'text-emerald-400'][i % 4]}`}>Step {i + 1}</span>
                  <strong className="text-slate-100 block text-xs">{s.title}</strong>
                  <p className="text-[10px] text-slate-400">{s.detail}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              {reportBtn('Execute Containment Runbook', '✓ Runbook Executed (+15 pts)')}
            </div>
          </div>
        );

      /* ------------------------------------------------ FAKE SSO PORTAL */
      case 'portal':
        return (
          <div className="p-6 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-slate-100 text-sm flex items-center gap-2"><Building2 className="w-4 h-4 text-sky-400" /> Simulated SaaS Single Sign-On Gateway</span>
              <Badge variant="critical" size="sm">SSO Lookalike</Badge>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[11px] flex items-center gap-2 overflow-x-auto">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-300 break-all">{spec.portal_url}</span>
            </div>

            <div className="max-w-sm mx-auto p-5 bg-white text-slate-900 rounded-2xl border border-slate-300 space-y-3 shadow-inner">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                <Globe className="w-5 h-5 text-sky-600" /> {spec.portal_brand}
              </div>
              <p className="font-bold text-xs text-slate-800">{spec.portal_headline}</p>
              <p className="text-[11px] text-slate-600">{spec.portal_sub}</p>
              <input type="text" placeholder="Corporate Email" disabled value="employee@company.com" className="w-full p-2 border rounded bg-slate-50 text-slate-600" />
              <input type="password" placeholder="Password" disabled value="••••••••••••" className="w-full p-2 border rounded bg-slate-50 text-slate-600" />
              <button type="button" onClick={() => setLandingOpen(true)} className="w-full p-2.5 rounded-lg bg-[#0078d4] hover:bg-[#006abc] text-white font-bold text-xs shadow">
                {spec.portal_button}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {reportBtn('Report Lookalike Portal', '✓ Fake Portal Reported (+15 pts)')}
            </div>
          </div>
        );

      /* ------------------------------------------------ PHYSICAL SCENARIO */
      case 'physical':
        return (
          <div className="p-6 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-slate-100 text-sm flex items-center gap-2"><HardDrive className="w-4 h-4 text-amber-400" /> Physical & Environmental Security Scenario Lab</span>
              <Badge variant="high" size="sm">Physical Vector</Badge>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono block">Scenario:</span>
              <p className="text-sm font-bold text-slate-100 leading-relaxed">{spec.phys_scenario}</p>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={handleReportAction}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-emerald-600/70 text-emerald-300 font-bold text-left hover:bg-emerald-950 transition-colors"
              >
                ✓ {spec.phys_safe}
              </button>
              <button
                type="button"
                onClick={() => setLandingOpen(true)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-rose-900/60 text-rose-300 text-left hover:bg-rose-950 transition-colors"
              >
                ⚠️ {spec.phys_risky}
              </button>
            </div>
          </div>
        );

      /* ------------------------------------------------ OSINT EXPOSURE */
      case 'osint':
        return (
          <div className="p-6 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-slate-100 text-sm flex items-center gap-2"><Users className="w-4 h-4 text-sky-400" /> OSINT Exposure Scanner Lab</span>
              <Badge variant="high" size="sm">Recon Defense</Badge>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 font-mono block">{spec.profile_name}</span>
              <div className="space-y-1.5">
                {(spec.osint_items || []).map((it, i) => (
                  <div key={i} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-0.5">
                    <div className="text-slate-200 font-bold flex items-start gap-2"><Eye className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /> {it.label}</div>
                    <div className="text-rose-400 pl-5">→ {it.risk}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {reportBtn('Report & Scrub Exposure', '✓ Exposure Scrubbed (+15 pts)')}
            </div>
          </div>
        );

      /* ------------------------------------------------ PERIMETER RANGE */
      case 'perimeter':
      default:
        return (
          <div className="p-6 bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-slate-100 text-sm">{spec.sim_label}</span>
              <Badge variant="medium" size="sm">Attack Vector Range</Badge>
            </div>

            <p className="text-slate-300 leading-relaxed">
              Adversaries probe this topic&apos;s attack surface through the vectors below. Click any card to simulate the attack and test your defense response:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(spec.perimeter_cards || []).map((c, i) => (
                <div
                  key={i}
                  onClick={() => setLandingOpen(true)}
                  className={`p-4 rounded-2xl bg-slate-900 border cursor-pointer space-y-1.5 transition-all shadow-sm group ${['border-slate-800 hover:border-emerald-500', 'border-slate-800 hover:border-sky-500', 'border-slate-800 hover:border-amber-500', 'border-slate-800 hover:border-purple-500'][i % 4]}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 flex items-center gap-1.5">
                      {[<Mail key="m" className="w-4 h-4 text-emerald-400" />, <Smartphone key="s" className="w-4 h-4 text-sky-400" />, <PhoneCall key="p" className="w-4 h-4 text-amber-400" />, <FileSpreadsheet key="f" className="w-4 h-4 text-purple-400" />][i % 4]}
                      {c.title}
                    </span>
                    <Badge variant="high" size="sm">{c.stat}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400">{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              {reportBtn('Test Zero-Trust Defense (+15 pts)', '✓ Perimeter Defended (+15 pts)')}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn font-sans text-xs text-slate-100">
      {/* Simulator Identification Strip */}
      <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-slate-100">
            {spec.sim_label} &bull; Topic: <strong className="text-emerald-400">{courseTitle}</strong>
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-800 whitespace-nowrap">
          {courseCode || 'NO-CODE'} &bull; build {__BUILD_ID__} &bull; Safe Educational Sandbox &bull; Zero Credential Storage
        </span>
      </div>

      {renderSim()}

      {/* Reported Feedback Alert */}
      {reported && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Vigilance Verified! You identified the concealed red flags and safely neutralized the attack (+{scoreBonus} pts awarded).</span>
          </div>
        </div>
      )}

      {/* Simulated Interceptor Portal Modal */}
      {landingOpen && (
        <Modal
          isOpen={true}
          onClose={() => setLandingOpen(false)}
          title="Simulated Threat Interception Shield"
          subtitle="Demonstrating in-memory zero-credential redaction & educational boundary"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="p-3.5 bg-emerald-950 border border-emerald-500 text-emerald-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero-Credential In-Memory Redaction Verified</span>
              </div>
              <p className="text-[11px] text-slate-300">
                In a real attack, this action would hand the adversary your credentials or session. In LockPhish drills, all secrets are intercepted in volatile memory and sanitized to <code className="text-emerald-300 font-mono">[REDACTED_BY_SECURITY_POLICY]</code>.
              </p>
            </div>

            <div className="p-4 bg-white text-slate-900 rounded-xl border border-slate-300 space-y-2">
              <span className="font-bold text-sm text-slate-800">Simulated Single Sign-On Gateway</span>
              <input type="text" placeholder="Corporate Email" disabled value="employee@company.com" className="w-full p-2 border rounded bg-slate-50 text-slate-600" />
              <input type="password" placeholder="Password" disabled value="••••••••••••" className="w-full p-2 border rounded bg-slate-50 text-slate-600" />
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <Button variant="primary" size="sm" onClick={() => setLandingOpen(false)}>
                Close Simulator Interceptor
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
