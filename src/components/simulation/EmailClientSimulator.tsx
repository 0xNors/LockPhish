import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Send,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Search,
  Paperclip,
  ExternalLink,
  ChevronDown,
  Info,
  CornerUpLeft,
  X,
  Lock,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
  Globe,
  Server,
  Star,
  Archive,
  RefreshCw,
  Clock,
  Building2,
  PhoneCall,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  Smartphone,
  Radio,
  Download,
  Shield,
  FileSpreadsheet,
  QrCode,
  Bell,
  CheckSquare,
  Square,
  Tag,
  Check,
  MoreVertical,
  SlidersHorizontal,
  Mail as MailIcon,
  MessageSquare,
  Video,
  Settings as SettingsIcon,
  Grid,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Receipt,
  Users as UsersIcon,
  FolderOpen,
  Edit3,
  RotateCcw,
  Layers
} from 'lucide-react';
import { Simulation } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { ProgressBar } from '../common/ProgressBar';
import { api } from '../../api/client';

interface EmailClientSimulatorProps {
  simulation: Simulation;
  onEventRecorded?: (eventResult: any) => void;
  onClose?: () => void;
}

export const EmailClientSimulator: React.FC<EmailClientSimulatorProps> = ({
  simulation,
  onEventRecorded,
  onClose
}) => {
  // Navigation: 'INBOX' vs 'READING'
  const [viewMode, setViewMode] = useState<'INBOX' | 'READING'>('INBOX');
  const [inboxTab, setInboxTab] = useState<'PRIMARY' | 'PROMOTIONS' | 'SOCIAL' | 'UPDATES'>('PRIMARY');
  const [selectedFolder, setSelectedFolder] = useState<'inbox' | 'starred' | 'snoozed' | 'sent' | 'drafts' | 'purchases' | 'bills' | 'spam' | 'trash'>('inbox');
  const [starredEmails, setStarredEmails] = useState<Record<string, boolean>>({});

  // Simulation Stages: 1: Initial Email, 2: Direct Interaction, 3: Pressure Follow-up, 4: Simulated Landing Portal, 5: Threat Reporting, 6: Training & Debrief
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [showHeadersModal, setShowHeadersModal] = useState(false);
  const [showLandingModal, setShowLandingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [showQrScannerModal, setShowQrScannerModal] = useState(false);
  const [showOAuthModal, setShowOAuthModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState<any>(null);

  // Live Inbound Notification Toast & Arrival Animation
  const [showInboundToast, setShowInboundToast] = useState(false);
  const [hasArrived, setHasArrived] = useState(false);

  // Cross-Channel Multi-Stage Popups
  const [showSmsPushToast, setShowSmsPushToast] = useState(false);
  const [showVoiceCallOverlay, setShowVoiceCallOverlay] = useState(false);
  const [voiceCallAnswered, setVoiceCallAnswered] = useState(false);

  // Link Hover Preview
  const [hoveredUrl, setHoveredUrl] = useState<string | null>(null);

  // Simulated Login Form State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [interceptBanner, setInterceptBanner] = useState(false);

  // Report Phishing Form State
  const [reportReason, setReportReason] = useState<string[]>([]);
  const [reportNotes, setReportNotes] = useState('');
  const [reporting, setReporting] = useState(false);

  // Mission Tasks Checklist State
  const [taskOpened, setTaskOpened] = useState(false);
  const [taskInspectedHeaders, setTaskInspectedHeaders] = useState(false);
  const [taskHoveredLink, setTaskHoveredLink] = useState(false);
  const [taskReported, setTaskReported] = useState(false);
  const [showTaskHud, setShowTaskHud] = useState(true);

  // Pressure Stage Countdown (14:59 mins)
  const [countdown, setCountdown] = useState(899);

  const isMultiStage = simulation.channel === 'MULTI_STAGE';

  useEffect(() => {
    // Arrival delay animation: shows realistic email delivery
    const arrivalTimer = setTimeout(() => {
      setHasArrived(true);
      setShowInboundToast(true);
    }, 1200);

    // Cross-channel triggers for multi-stage
    let smsTimer: any;
    let voiceTimer: any;
    if (isMultiStage) {
      smsTimer = setTimeout(() => setShowSmsPushToast(true), 3500);
      voiceTimer = setTimeout(() => setShowVoiceCallOverlay(true), 6500);
    }

    return () => {
      clearTimeout(arrivalTimer);
      if (smsTimer) clearTimeout(smsTimer);
      if (voiceTimer) clearTimeout(voiceTimer);
    };
  }, [simulation.id, isMultiStage]);

  useEffect(() => {
    if (currentStage === 3) {
      const timer = setInterval(() => {
        setCountdown(c => (c > 0 ? c - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStage]);

  const sender = simulation.sender_profile || {};
  const payload = simulation.payload_config || {};
  const indicators = simulation.learning_indicators || [];

  const landingType = payload.fake_landing_type || 'MICROSOFT_SSO';
  const simulatedLandingUrl = payload.landing_url || 'https://login.microsoftonline.security-auth-check.org/auth/v2';

  const detectedLandingType = (() => {
    if (payload.fake_landing_type) return payload.fake_landing_type;
    const text = `${payload.subject || ''} ${payload.body_html || ''} ${payload.landing_url || ''} ${simulation.scenario_name || ''}`.toLowerCase();
    if (text.includes('workday') || text.includes('payroll') || text.includes('direct deposit') || text.includes('compensation') || text.includes('benefits') || text.includes('hr')) return 'WORKDAY';
    if (text.includes('docusign') || text.includes('adobe sign') || text.includes('document') || text.includes('sign agreement') || text.includes('signature') || text.includes('contract')) return 'DOCUSIGN';
    if (text.includes('chase') || text.includes('bank') || text.includes('wire') || text.includes('invoice') || text.includes('payment') || text.includes('treasury')) return 'BANKING';
    if (text.includes('google') || text.includes('workspace') || text.includes('gmail')) return 'GOOGLE';
    if (text.includes('okta')) return 'OKTA';
    return 'MICROSOFT_SSO';
  })();

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleOpenEmail = async () => {
    setViewMode('READING');
    setTaskOpened(true);
    setShowInboundToast(false);
    try {
      await api.simulations.recordEvent(simulation.id, { event_type: 'OPENED' });
    } catch (err) {}
  };

  const isQrQuishingLure =
    Boolean(
      (payload.body_html && payload.body_html.toLowerCase().includes('qr')) ||
      (payload.subject && payload.subject.toLowerCase().includes('qr')) ||
      (simulation.scenario_name && simulation.scenario_name.toLowerCase().includes('qr')) ||
      (simulation.scenario_name && simulation.scenario_name.toLowerCase().includes('quishing')) ||
      (payload.landing_url && payload.landing_url.toLowerCase().includes('qr'))
    );

  const isOAuthConsentLure =
    Boolean(
      (payload.body_html && payload.body_html.toLowerCase().includes('oauth')) ||
      (payload.body_html && payload.body_html.toLowerCase().includes('permission')) ||
      (simulation.scenario_name && simulation.scenario_name.toLowerCase().includes('oauth')) ||
      (payload.landing_url && payload.landing_url.toLowerCase().includes('oauth'))
    );

  const isAttachmentLure =
    Boolean(payload.attachment_name) ||
    simulatedLandingUrl.includes('.xlsm') ||
    simulatedLandingUrl.includes('.xlsx') ||
    simulatedLandingUrl.includes('.exe') ||
    simulatedLandingUrl.includes('.iso') ||
    simulatedLandingUrl.includes('download') ||
    (payload.body_html && payload.body_html.toLowerCase().includes('.xlsm'));

  const handleLinkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await api.simulations.recordEvent(simulation.id, {
        event_type: 'LINK_CLICKED'
      });
      if (onEventRecorded) onEventRecorded(res);
    } catch (err) {
      console.error(err);
    }

    if (isQrQuishingLure) {
      setShowQrScannerModal(true);
    } else if (isOAuthConsentLure) {
      setShowOAuthModal(true);
    } else if (isAttachmentLure) {
      handleOpenAttachment();
    } else {
      setCurrentStage(4);
      setShowLandingModal(true);
    }
  };

  const handleAcceptOAuth = async () => {
    try {
      const res = await api.simulations.recordEvent(simulation.id, {
        event_type: 'CREDENTIAL_SUBMISSION_ATTEMPTED',
        raw_payload: { action: 'OAUTH_PERMISSIONS_GRANTED', app: 'Corporate_Sync_Hub', permissions: ['Mail.ReadWrite', 'Files.ReadWrite.All', 'offline_access'] }
      });
      setShowOAuthModal(false);
      setFeedbackData({
        outcome: 'UNSAFE_OAUTH_GRANTED',
        message: 'You granted full mailbox and file permissions to an unverified third-party OAuth app. Attackers use illicit consent grants to bypass MFA and access corporate data indefinitely.',
        training_recommended: res.training_recommended
      });
      setShowFeedbackModal(true);
      if (onEventRecorded) onEventRecorded(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInspectHeaders = async () => {
    setTaskInspectedHeaders(true);
    try {
      await api.simulations.recordEvent(simulation.id, {
        event_type: 'HEADER_INSPECTED'
      });
    } catch (err) {}
    setShowHeadersModal(true);
  };

  const handleOpenAttachment = async () => {
    try {
      await api.simulations.recordEvent(simulation.id, {
        event_type: 'ATTACHMENT_OPENED'
      });
    } catch (err) {}
    setShowAttachmentModal(true);
  };

  const handleEnableMacros = async () => {
    try {
      const res = await api.simulations.recordEvent(simulation.id, {
        event_type: 'ATTACHMENT_OPENED',
        raw_payload: { action: 'MACRO_ENABLED', file: payload.attachment_name || 'Bonus_Matrix.xlsm' }
      });
      setShowAttachmentModal(false);
      setFeedbackData({
        outcome: 'UNSAFE_MACRO_ENABLED',
        message: 'You clicked "Enable Content" / "Enable Macros" on an untrusted spreadsheet. Attackers use weaponized VBA macros to execute malware and ransomware on corporate machines.',
        training_recommended: res.training_recommended
      });
      setShowFeedbackModal(true);
      if (onEventRecorded) onEventRecorded(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleHoverLink = () => {
    setHoveredUrl(simulatedLandingUrl);
    setTaskHoveredLink(true);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSubmitting(true);

    try {
      const res = await api.simulations.recordEvent(simulation.id, {
        event_type: 'CREDENTIAL_SUBMISSION_ATTEMPTED',
        raw_payload: {
          username: loginUsername,
          password: loginPassword ? '[REDACTED_BY_SECURITY_POLICY]' : ''
        }
      });

      setInterceptBanner(true);
      setLoginSubmitting(false);

      setTimeout(() => {
        setShowLandingModal(false);
        setInterceptBanner(false);
        setFeedbackData({
          outcome: 'UNSAFE_CREDENTIAL_SUBMITTED',
          message: 'You entered credentials on an unauthorized simulated landing portal. LockPhish intercepted and redacted the password.',
          training_recommended: res.training_recommended
        });
        setCurrentStage(6);
        setShowFeedbackModal(true);
        if (onEventRecorded) onEventRecorded(res);
      }, 2500);
    } catch (err) {
      setLoginSubmitting(false);
      setShowLandingModal(false);
    }
  };

  const handleReportPhish = async () => {
    setReporting(true);
    setTaskReported(true);
    try {
      const res = await api.simulations.recordEvent(simulation.id, {
        event_type: 'REPORTED_PHISH',
        raw_payload: { reasons: reportReason, notes: reportNotes, stage: 5 }
      });
      setReporting(false);
      setShowReportModal(false);
      setFeedbackData({
        outcome: 'SAFE_REPORTED',
        message: 'Outstanding vigilance! You identified the concealed red flags and safely reported this phishing simulation.',
        training_recommended: []
      });
      setCurrentStage(5);
      setShowFeedbackModal(true);
      if (onEventRecorded) onEventRecorded(res);
    } catch (err) {
      setReporting(false);
    }
  };

  const toggleReportReason = (reason: string) => {
    setReportReason(prev =>
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredEmails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Realistic Background Emails matching user screenshot
  const backgroundEmails = [
    {
      id: 'bg-1',
      sender: 'NHS PHARMACY DELIVE.',
      subject: 'FW: NHS PHARMACY DELIVERY N6',
      snippet: '- Hi to:mauterhaaga0223@hotmail.com Aaron, I\'ll swing by the guest room this week and verify prescription details...',
      date: '21 Aug',
      hasAttachment: true,
      category: 'PRIMARY'
    },
    {
      id: 'bg-2',
      sender: 'NHS PHARMACY DELIVE.',
      subject: 'RE: NHS PHARMACY DELIVERY L1',
      snippet: '- Hi Cameron, I plan to swing through the guest room this week and take final measurements for delivery schedule...',
      date: '21 Aug',
      hasAttachment: true,
      category: 'PRIMARY'
    },
    {
      id: 'bg-3',
      sender: 'sahil Shankar',
      subject: 'MBA 2026 | Submit Your Profile for Shortlisting',
      snippet: '- Dear Candidate, Greetings from Jaro Education! Planning to pursue an executive MBA in 2026? Submit profile...',
      date: '19 Aug',
      hasAttachment: false,
      category: 'PRIMARY'
    },
    {
      id: 'bg-4',
      sender: 'sharanyacorizo',
      subject: 'IMPORTANT NOTICE TO SVIT VASAD - Sahil Rakholiya',
      snippet: ': Complete Your registration for Corizo\'s Accredited IIT BOMBAY workshop cohort before the deadline...',
      date: '17 Aug',
      hasAttachment: false,
      category: 'PRIMARY'
    },
    {
      id: 'bg-5',
      sender: 'orders',
      subject: 'Your order#DG260817011719-26DGA011490 on https://degree.spuportal.in is successful.',
      snippet: '- Thanks for your order, ! Order #DG260817011719 has been confirmed...',
      date: '17 Aug',
      hasAttachment: false,
      isStarred: true,
      category: 'PRIMARY'
    },
    {
      id: 'bg-6',
      sender: 'spu_support',
      subject: 'Registration Completed Successfully - Degree Registration',
      snippet: 'Dear SHAHIL RAKHOLIYA, You have Successfully Completed your degree course registration...',
      date: '17 Aug',
      hasAttachment: false,
      isStarred: true,
      category: 'PRIMARY'
    },
    {
      id: 'bg-7',
      sender: 'Pratik from Lyzo AI',
      subject: 'Message from the CEO\'s desk for sahil rakholiya n',
      snippet: '- Hi sahil rakholiya n, Welcome to Lyzo AI! I\'m excited to have you with us as part of our developer early access...',
      date: '12 Aug',
      hasAttachment: false,
      category: 'PRIMARY'
    },
    {
      id: 'bg-8',
      sender: 'Skillogic, me 4',
      subject: 'Cyber Security Team Announcement-PTID-CSPP-AUG-26-523',
      snippet: '- Hi Sahil, Kindly look into this. Kindly find the dataset attached for team review...',
      date: '10 Aug',
      hasAttachment: true,
      isStarred: true,
      chips: ['PDF 19. BC for Lock...', 'PDF 30. BC for Mal...', 'PDF CYBER SECURI...'],
      category: 'PRIMARY'
    },
    {
      id: 'bg-9',
      sender: 'boAt Lifestyle',
      subject: 'Order #10040044 confirmed | Thank you for placing your order!',
      snippet: '- Thank you for your purchase! Order Number: #10040044 is being packed...',
      date: '8 Aug',
      hasAttachment: false,
      isStarred: true,
      category: 'PRIMARY'
    },
    {
      id: 'bg-10',
      sender: 'me, Skillogic 12',
      subject: 'internship form',
      snippet: '- Thanks, I have received it. On Fri, 7 Aug 2026, 2:33 pm Skillogic internship, <internship@skillogic.com> wrote...',
      date: '7 Aug',
      hasAttachment: true,
      isStarred: true,
      chips: ['PNG 1000471460.png', 'PDF Shahil Rakholiy...'],
      category: 'PRIMARY'
    },
    {
      id: 'bg-11',
      sender: 'satyam_durgesh',
      subject: 'Information Notice - All Students Must Enroll : Microsoft Certified Fundamentals',
      snippet: 'Incubated Summer Training & Internship - Please review and enroll...',
      date: '2 Aug',
      hasAttachment: false,
      category: 'PRIMARY'
    }
  ];

  // Tasks progress counter
  const completedTasksCount = [taskOpened, taskInspectedHeaders, taskHoveredLink, taskReported].filter(Boolean).length;

  return (
    <div className="w-full bg-[#f6f8fc] text-[#1f1f1f] rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[780px] font-sans relative border border-[#dadce0]">
      {/* 🎯 MISSION TASKS FLOATING HUD CHECKLIST */}
      {showTaskHud && (
        <div className="absolute top-20 right-6 z-50 bg-[#0f172a] text-slate-100 border border-emerald-500/70 rounded-2xl p-4 shadow-2xl w-80 font-sans animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-100">Cyber Defense Mission</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                {completedTasksCount}/4 Done
              </span>
              <button onClick={() => setShowTaskHud(false)} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2.5 text-xs">
            <div className={`flex items-start gap-2 p-2 rounded-xl border transition-all ${taskOpened ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
              {taskOpened ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />}
              <div>
                <strong className="block text-[11px]">Task 1: Open Target Phishing Email</strong>
                <span className="text-[10px] text-slate-400">Click the newly arrived email in your Primary inbox.</span>
              </div>
            </div>

            <div className={`flex items-start gap-2 p-2 rounded-xl border transition-all ${taskInspectedHeaders ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
              {taskInspectedHeaders ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />}
              <div>
                <strong className="block text-[11px]">Task 2: Inspect SPF/DKIM Email Headers</strong>
                <span className="text-[10px] text-slate-400">Click the sender address or &quot;View Security Details&quot;.</span>
              </div>
            </div>

            <div className={`flex items-start gap-2 p-2 rounded-xl border transition-all ${taskHoveredLink ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
              {taskHoveredLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />}
              <div>
                <strong className="block text-[11px]">Task 3: Hover Link for True Root Domain</strong>
                <span className="text-[10px] text-slate-400">Hover over the action button to inspect the true host URL.</span>
              </div>
            </div>

            <div className={`flex items-start gap-2 p-2 rounded-xl border transition-all ${taskReported ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
              {taskReported ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />}
              <div>
                <strong className="block text-[11px]">Task 4: Click &ldquo;Report Phishing&rdquo;</strong>
                <span className="text-[10px] text-slate-400">Submit threat report to receive +15 points resilience reward.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INBOUND ARRIVAL NOTIFICATION TOAST (Simulated Toast Alert) */}
      {showInboundToast && (
        <div
          onClick={handleOpenEmail}
          className="absolute top-16 right-6 z-40 bg-[#1e293b] text-white border border-[#38bdf8] rounded-2xl p-4 shadow-2xl flex items-start gap-3 max-w-sm cursor-pointer hover:bg-[#0f172a] transition-all animate-bounce"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
            M
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100 block">{sender.name || 'Microsoft Security'}</span>
              <span className="text-[10px] text-sky-400 font-mono">Just now</span>
            </div>
            <p className="text-slate-300 font-semibold mt-0.5 line-clamp-1">
              {payload.subject || 'Action Required: Security Authentication Verification'}
            </p>
            <span className="text-[10px] text-emerald-400 font-bold mt-1 block">Tap to open message &rarr;</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setShowInboundToast(false); }}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Cross-Channel SMS Push Alert for Multi-Stage */}
      {showSmsPushToast && (
        <div className="absolute top-36 right-6 z-40 bg-[#0f172a] text-slate-100 border border-sky-500/80 rounded-2xl p-4 shadow-2xl max-w-sm animate-fadeIn">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" /> Incoming SMS Message
            </span>
            <button onClick={() => setShowSmsPushToast(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-200 mt-2 leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono">
            [ALERT] Action required on invoice #INV-8839. Confirm identity at {simulatedLandingUrl}
          </p>
        </div>
      )}

      {/* Cross-Channel Inbound Voice Call Banner for Multi-Stage */}
      {showVoiceCallOverlay && !voiceCallAnswered && (
        <div className="absolute top-60 right-6 z-40 bg-gradient-to-br from-amber-950 to-slate-900 text-slate-100 border-2 border-amber-500/80 rounded-2xl p-4 shadow-2xl space-y-3 max-w-sm animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <PhoneCall className="w-5 h-5 animate-spin" />
            </div>
            <div className="text-xs">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block font-mono">
                📞 INCOMING VOICE CALL
              </span>
              <span className="font-bold text-slate-100 text-sm block">Billing Recovery Desk</span>
              <span className="text-slate-400 font-mono text-[11px]">+1 (800) 555-0182</span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
            <button
              onClick={() => setShowVoiceCallOverlay(false)}
              className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 font-bold text-xs"
            >
              Decline Call
            </button>
            <button
              onClick={() => setVoiceCallAnswered(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <PhoneCall className="w-3 h-3" /> Answer Call
            </button>
          </div>
        </div>
      )}

      {/* TOP GMAIL HEADER BAR (Pixel-Perfect Google Workspace Header) */}
      <div className="bg-[#f6f8fc] px-4 py-2.5 flex items-center justify-between border-b border-[#e0e3e7] shrink-0">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[#e8ebef] rounded-full transition-colors text-[#5f6368]">
            <span className="block w-4 h-0.5 bg-[#5f6368] mb-1" />
            <span className="block w-4 h-0.5 bg-[#5f6368] mb-1" />
            <span className="block w-4 h-0.5 bg-[#5f6368]" />
          </button>

          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setViewMode('INBOX')}>
            <div className="w-7 h-7 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path fill="#4285F4" d="M1.5 5.5v13a1 1 0 001 1h4v-11l-5-3z"/>
                <path fill="#34A853" d="M22.5 5.5l-5 3v11h4a1 1 0 001-1v-13z"/>
                <path fill="#EA4335" d="M17.5 8.5L12 12.5 6.5 8.5V4.5l5.5 4 5.5-4z"/>
                <path fill="#FBBC05" d="M1.5 5.5L12 13.5l10.5-8L12 2 1.5 5.5z"/>
              </svg>
            </div>
            <span className="text-[#444746] font-medium text-xl tracking-tight">Gmail</span>
          </div>
        </div>

        {/* Center Search Mail Bar */}
        <div className="flex-1 max-w-2xl mx-6">
          <div className="bg-[#eaf1fb] hover:bg-[#e1eaf8] focus-within:bg-white focus-within:shadow-md transition-all rounded-full px-4 py-2 flex items-center gap-3 border border-transparent focus-within:border-[#c2e7ff]">
            <Search className="w-4 h-4 text-[#5f6368]" />
            <input
              type="text"
              placeholder="Search mail"
              className="bg-transparent w-full text-xs text-[#1f1f1f] focus:outline-none placeholder-[#5f6368]"
            />
            <SlidersHorizontal className="w-4 h-4 text-[#5f6368] cursor-pointer" />
          </div>
        </div>

        {/* Right Chrome Controls */}
        <div className="flex items-center gap-2 text-[#5f6368]">
          <button
            onClick={() => setShowTaskHud(!showTaskHud)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              showTaskHud ? 'bg-[#c2e7ff] text-[#001d35]' : 'bg-[#eaf1fb] hover:bg-[#e1eaf8] text-[#444746]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Mission Tasks ({completedTasksCount}/4)</span>
          </button>

          <button
            onClick={() => {
              setCurrentStage(5);
              setShowReportModal(true);
            }}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#fce8e6] hover:bg-[#fad2cf] text-[#c5221f] border border-[#f5c6cb] flex items-center gap-1.5 transition-colors"
            title="Report this simulation as phishing"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Report Phishing</span>
          </button>

          <div className="w-8 h-8 rounded-full bg-[#0b57d0] text-white flex items-center justify-center font-bold text-xs ml-1 shadow-sm">
            {simulation.first_name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>

      {/* MAIN APP BODY: LEFT SIDEBAR + EMAIL CONTENT AREA */}
      <div className="flex-1 flex min-h-0 bg-white">
        {/* LEFT GMAIL SIDEBAR */}
        <div className="w-56 bg-[#f6f8fc] p-3 flex flex-col justify-between shrink-0 border-r border-[#e0e3e7] text-xs">
          <div className="space-y-1">
            {/* Compose Button */}
            <div className="mb-4">
              <button
                type="button"
                className="bg-[#c2e7ff] hover:bg-[#b3d7ef] text-[#001d35] font-semibold px-6 py-3.5 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow transition-all text-xs"
              >
                <Edit3 className="w-4 h-4" />
                <span>Compose</span>
              </button>
            </div>

            {/* Folder Navigation Buttons */}
            <button
              onClick={() => { setSelectedFolder('inbox'); setViewMode('INBOX'); }}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-full font-bold transition-colors ${
                selectedFolder === 'inbox' ? 'bg-[#d3e3fd] text-[#001d35]' : 'text-[#444746] hover:bg-[#e8ebef]'
              }`}
            >
              <span className="flex items-center gap-3">
                <Inbox className="w-4 h-4" />
                <span>Inbox</span>
              </span>
              <span className="text-[11px] font-bold text-[#001d35]">
                {hasArrived ? '205' : '204'}
              </span>
            </button>

            <button
              onClick={() => setSelectedFolder('starred')}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-full font-medium transition-colors ${
                selectedFolder === 'starred' ? 'bg-[#d3e3fd] text-[#001d35]' : 'text-[#444746] hover:bg-[#e8ebef]'
              }`}
            >
              <span className="flex items-center gap-3">
                <Star className="w-4 h-4" />
                <span>Starred</span>
              </span>
            </button>

            <button
              onClick={() => setSelectedFolder('snoozed')}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-full font-medium transition-colors ${
                selectedFolder === 'snoozed' ? 'bg-[#d3e3fd] text-[#001d35]' : 'text-[#444746] hover:bg-[#e8ebef]'
              }`}
            >
              <span className="flex items-center gap-3">
                <Clock className="w-4 h-4" />
                <span>Snoozed</span>
              </span>
            </button>

            <button
              onClick={() => setSelectedFolder('sent')}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-full font-medium transition-colors ${
                selectedFolder === 'sent' ? 'bg-[#d3e3fd] text-[#001d35]' : 'text-[#444746] hover:bg-[#e8ebef]'
              }`}
            >
              <span className="flex items-center gap-3">
                <Send className="w-4 h-4" />
                <span>Sent</span>
              </span>
            </button>

            <button
              onClick={() => setSelectedFolder('drafts')}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-full font-medium transition-colors ${
                selectedFolder === 'drafts' ? 'bg-[#d3e3fd] text-[#001d35]' : 'text-[#444746] hover:bg-[#e8ebef]'
              }`}
            >
              <span className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>Drafts</span>
              </span>
              <span className="text-[11px] text-[#5f6368]">16</span>
            </button>

            <button
              onClick={() => setSelectedFolder('purchases')}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-full font-medium transition-colors ${
                selectedFolder === 'purchases' ? 'bg-[#d3e3fd] text-[#001d35]' : 'text-[#444746] hover:bg-[#e8ebef]'
              }`}
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Purchases</span>
              </span>
              <span className="text-[11px] text-[#5f6368]">96</span>
            </button>

            <button
              onClick={() => setSelectedFolder('bills')}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-full font-medium transition-colors ${
                selectedFolder === 'bills' ? 'bg-[#d3e3fd] text-[#001d35]' : 'text-[#444746] hover:bg-[#e8ebef]'
              }`}
            >
              <span className="flex items-center gap-3">
                <Receipt className="w-4 h-4" />
                <span>Bills</span>
              </span>
              <span className="text-[11px] text-[#5f6368]">4</span>
            </button>
          </div>

          <div className="pt-3 border-t border-[#e0e3e7] text-[11px] text-[#5f6368] space-y-1">
            <span className="block font-bold uppercase text-[9px] tracking-wider">Simulation Sandbox</span>
            <span>LockPhish Threat Client v2.4</span>
          </div>
        </div>

        {/* RIGHT CONTENT AREA: INBOX MAIL LIST OR EMAIL READING VIEW */}
        <div className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto">
          {viewMode === 'INBOX' ? (
            /* 1. ULTRA-REALISTIC GMAIL INBOX LIST VIEW */
            <div className="flex-1 flex flex-col">
              {/* Category Navigation Tabs */}
              <div className="flex items-center border-b border-[#e0e3e7] bg-white text-xs font-semibold px-4">
                <button
                  onClick={() => setInboxTab('PRIMARY')}
                  className={`flex items-center gap-3 py-3 px-6 border-b-2 transition-all ${
                    inboxTab === 'PRIMARY'
                      ? 'border-[#0b57d0] text-[#0b57d0]'
                      : 'border-transparent text-[#444746] hover:bg-[#f6f8fc]'
                  }`}
                >
                  <Inbox className="w-4 h-4" />
                  <span>Primary</span>
                </button>

                <button
                  onClick={() => setInboxTab('PROMOTIONS')}
                  className={`flex items-center gap-3 py-3 px-6 border-b-2 transition-all ${
                    inboxTab === 'PROMOTIONS'
                      ? 'border-[#0b57d0] text-[#0b57d0]'
                      : 'border-transparent text-[#444746] hover:bg-[#f6f8fc]'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  <span>Promotions</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#1e8e3e] text-white text-[10px] font-bold">
                    42 new
                  </span>
                </button>

                <button
                  onClick={() => setInboxTab('SOCIAL')}
                  className={`flex items-center gap-3 py-3 px-6 border-b-2 transition-all ${
                    inboxTab === 'SOCIAL'
                      ? 'border-[#0b57d0] text-[#0b57d0]'
                      : 'border-transparent text-[#444746] hover:bg-[#f6f8fc]'
                  }`}
                >
                  <UsersIcon className="w-4 h-4" />
                  <span>Social</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#1a73e8] text-white text-[10px] font-bold">
                    3 new
                  </span>
                </button>

                <button
                  onClick={() => setInboxTab('UPDATES')}
                  className={`flex items-center gap-3 py-3 px-6 border-b-2 transition-all ${
                    inboxTab === 'UPDATES'
                      ? 'border-[#0b57d0] text-[#0b57d0]'
                      : 'border-transparent text-[#444746] hover:bg-[#f6f8fc]'
                  }`}
                >
                  <Info className="w-4 h-4" />
                  <span>Updates</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#e37400] text-white text-[10px] font-bold">
                    4 new
                  </span>
                </button>
              </div>

              {/* Table Toolbar */}
              <div className="px-4 py-2 bg-white flex items-center justify-between border-b border-[#f1f3f4] text-xs text-[#5f6368]">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded text-[#0b57d0]" />
                  <RotateCcw className="w-3.5 h-3.5 cursor-pointer hover:text-[#1f1f1f]" />
                  <MoreVertical className="w-3.5 h-3.5 cursor-pointer hover:text-[#1f1f1f]" />
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span>1–50 of 350</span>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-[#f1f3f4] rounded"><ChevronLeft className="w-4 h-4" /></button>
                    <button className="p-1 hover:bg-[#f1f3f4] rounded"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              {/* Email List Rows */}
              <div className="divide-y divide-[#f1f3f4] text-xs">
                {/* 🚨 THE TARGET PHISHING EMAIL ROW (With Arrival Highlight Animation) */}
                {hasArrived && (
                  <div
                    onClick={handleOpenEmail}
                    className="flex items-center justify-between px-4 py-3 bg-[#f2f6fc] hover:bg-[#eaf1fb] cursor-pointer transition-all group font-bold border-l-4 border-l-[#0b57d0] shadow-sm animate-fadeIn"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        onClick={e => e.stopPropagation()}
                        className="rounded text-[#0b57d0]"
                      />
                      <button onClick={e => toggleStar('target', e)} className="text-[#5f6368] hover:text-[#f4b400]">
                        <Star className={`w-4 h-4 ${starredEmails['target'] ? 'text-[#f4b400] fill-[#f4b400]' : ''}`} />
                      </button>

                      <div className="w-44 truncate text-[#1f1f1f] shrink-0">
                        <span>{sender.name || 'Microsoft Security Operations'}</span>
                      </div>

                      <div className="flex items-center gap-2 truncate min-w-0 flex-1">
                        <span className="text-[#1f1f1f] font-bold truncate">
                          {payload.subject || 'Action Required: Security Authentication Verification'}
                        </span>
                        <span className="text-[#5f6368] font-normal truncate">
                          &mdash; {payload.body_text ? payload.body_text.substring(0, 70) : 'Please review and verify your identity credentials before session lockout...'}
                        </span>
                      </div>

                      {payload.attachment_name && (
                        <div className="px-2 py-0.5 rounded-full bg-[#e8eaed] text-[#444746] text-[10px] font-mono shrink-0 flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          <span>{payload.attachment_name}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0 pl-4">
                      <span className="font-bold text-[#0b57d0] font-mono text-[11px]">Just now</span>
                    </div>
                  </div>
                )}

                {/* Background Realistic Emails from User's Screenshot */}
                {backgroundEmails.map((email) => {
                  const isStarred = starredEmails[email.id] !== undefined ? starredEmails[email.id] : email.isStarred;

                  return (
                    <div
                      key={email.id}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-[#f6f8fc] hover:shadow-inner cursor-pointer transition-colors text-[#444746]"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <input
                          type="checkbox"
                          onClick={e => e.stopPropagation()}
                          className="rounded text-[#0b57d0]"
                        />
                        <button onClick={e => toggleStar(email.id, e)} className="text-[#5f6368] hover:text-[#f4b400]">
                          <Star className={`w-4 h-4 ${isStarred ? 'text-[#f4b400] fill-[#f4b400]' : ''}`} />
                        </button>

                        <div className="w-44 truncate text-[#1f1f1f] font-medium shrink-0">
                          {email.sender}
                        </div>

                        <div className="flex items-center gap-2 truncate min-w-0 flex-1">
                          <span className="text-[#1f1f1f] font-medium truncate">{email.subject}</span>
                          <span className="text-[#5f6368] truncate">{email.snippet}</span>
                        </div>

                        {email.chips && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            {email.chips.map((chip, cIdx) => (
                              <span key={cIdx} className="px-2 py-0.5 rounded-full bg-[#f1f3f4] text-[#444746] text-[10px] font-mono border border-[#dadce0]">
                                {chip}
                              </span>
                            ))}
                          </div>
                        )}

                        {email.hasAttachment && !email.chips && (
                          <Paperclip className="w-3.5 h-3.5 text-[#5f6368] shrink-0" />
                        )}
                      </div>

                      <div className="text-right shrink-0 pl-4">
                        <span className="text-[#5f6368] text-[11px] font-mono">{email.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* 2. FULL GMAIL READING VIEW FOR THE PHISHING SIMULATION */
            <div className="flex-1 flex flex-col bg-white">
              {/* Reading Top Action Toolbar */}
              <div className="px-4 py-2 bg-white flex items-center justify-between border-b border-[#e0e3e7] text-xs text-[#5f6368]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setViewMode('INBOX')}
                    className="p-1.5 hover:bg-[#e8ebef] rounded-full text-[#1f1f1f] font-bold flex items-center gap-1"
                    title="Back to inbox"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Inbox</span>
                  </button>

                  <div className="h-4 w-px bg-[#dadce0] mx-1" />

                  <button className="p-1.5 hover:bg-[#e8ebef] rounded-full" title="Archive"><Archive className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-[#e8ebef] rounded-full" title="Spam"><AlertTriangle className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-[#e8ebef] rounded-full" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-[#e8ebef] rounded-full" title="Mark as unread"><MailIcon className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-[#e8ebef] rounded-full" title="Add to tasks"><CheckSquare className="w-4 h-4" /></button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentStage(5);
                      setShowReportModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#fce8e6] hover:bg-[#fad2cf] text-[#c5221f] border border-[#f5c6cb] flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Report as Phishing (+15 pts)</span>
                  </button>
                </div>
              </div>

              {/* Urgency Pressure Banner for Stage 3 */}
              {currentStage === 3 && (
                <div className="bg-[#fce8e6] border-b border-[#fad2cf] p-4 flex items-center justify-between text-[#c5221f] text-xs animate-pulse">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <div>
                      <strong className="block font-bold">URGENCY PRESSURE: 15-Minute Expiration Window</strong>
                      <span>Failure to authenticate your session will result in immediate access revocation.</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-[#c5221f] text-white font-mono font-bold text-sm">
                    ⏱️ {formatCountdown(countdown)}
                  </span>
                </div>
              )}

              {/* Email Reading Container */}
              <div className="p-8 flex-1 overflow-y-auto space-y-6">
                {/* Subject Header */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#e0e3e7]">
                  <div>
                    <h2 className="text-xl font-semibold text-[#1f1f1f] leading-tight">
                      {payload.subject || 'Action Required: Security Authentication Verification'}
                    </h2>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#f1f3f4] text-[#444746] text-[11px]">
                      Inbox
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={handleInspectHeaders} className="text-xs text-[#0b57d0] hover:underline font-semibold flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Security Details (SPF/DKIM)</span>
                    </button>
                  </div>
                </div>

                {/* Sender Avatar & Header Information */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0b57d0] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {sender.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[#1f1f1f]">{sender.name || 'Microsoft Security Team'}</span>
                        <button
                          onClick={handleInspectHeaders}
                          className="text-xs text-[#5f6368] font-mono hover:text-[#0b57d0] underline"
                        >
                          &lt;{sender.email || 'security-alerts@auth-microsoft-support.net'}&gt;
                        </button>
                      </div>
                      <p className="text-xs text-[#5f6368] mt-0.5">
                        to <span className="text-[#1f1f1f]">You &lt;{simulation.email || 'employee@company.com'}&gt;</span>
                      </p>
                      {sender.reply_to && (
                        <p className="text-xs text-[#b06000] font-mono mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Reply-To: <span className="underline">{sender.reply_to}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-xs text-[#5f6368] font-mono shrink-0">
                    <span>9:41 AM (Just now)</span>
                  </div>
                </div>

                {/* Rendered HTML Email Body */}
                <div className="p-6 bg-white border border-[#e0e3e7] rounded-xl text-[#1f1f1f] relative">
                  {payload.body_html ? (
                    <div
                      className="email-render-content font-sans leading-relaxed text-sm"
                      dangerouslySetInnerHTML={{ __html: payload.body_html }}
                      onMouseOver={(e) => {
                        const target = e.target as HTMLElement;
                        const anchor = target.closest('a');
                        if (anchor) handleHoverLink();
                      }}
                      onMouseOut={() => setHoveredUrl(null)}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        const anchor = target.closest('a');
                        if (anchor) {
                          e.preventDefault();
                          handleLinkClick(e);
                        }
                      }}
                    />
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm">{payload.body_text || 'Your corporate access session has been temporarily locked following suspicious activity.'}</p>
                      <div className="my-6">
                        <button
                          onClick={handleLinkClick}
                          onMouseEnter={handleHoverLink}
                          onMouseLeave={() => setHoveredUrl(null)}
                          className="inline-block bg-[#0b57d0] hover:bg-[#08429e] text-white font-bold px-6 py-2.5 rounded-lg shadow transition-colors"
                        >
                          Verify Credentials & Restore Access
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Attachment Pill if applicable */}
                  {payload.attachment_name && (
                    <div className="mt-6 pt-4 border-t border-[#e0e3e7]">
                      <span className="text-xs font-bold text-[#444746] block mb-2">1 Attachment:</span>
                      <div
                        onClick={handleOpenAttachment}
                        className="inline-flex items-center gap-3 p-3 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl cursor-pointer hover:bg-[#f1f5f9] transition-all shadow-sm group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#e2e8f0] flex items-center justify-center text-[#475569] shrink-0">
                          <Paperclip className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#0f172a] block group-hover:text-[#0b57d0]">{payload.attachment_name}</span>
                          <span className="text-[10px] text-[#64748b] font-mono">480 KB &bull; Click to Inspect</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Root Domain Live Hover Tooltip */}
                  {hoveredUrl && (
                    <div className="absolute bottom-4 left-4 bg-[#1e293b] text-white px-3.5 py-2 rounded-xl text-xs font-mono shadow-2xl flex items-center gap-2 z-30 border border-slate-700">
                      <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-slate-400">Target Host:</span>
                      <span className="text-amber-300 font-bold">{hoveredUrl}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STAGE 4: SIMULATED LANDING PORTAL (Direct Navigation on Link Click) */}
      <Modal
        isOpen={showLandingModal}
        onClose={() => setShowLandingModal(false)}
        title="Simulated Authentication Gateway"
        subtitle={`Target Host: ${simulatedLandingUrl}`}
        maxWidth="md"
      >
        <div className="space-y-4 text-xs font-sans">
          {/* Security Intercept Banner */}
          {interceptBanner && (
            <div className="p-4 rounded-xl bg-emerald-950 border-2 border-emerald-500 text-emerald-200 space-y-1.5 animate-fadeIn shadow-2xl">
              <div className="flex items-center gap-2 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Zero-Credential Security Boundary Active</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Credentials submitted to unauthorized simulated destination portal. Secret intercepted in volatile memory and redacted to <strong className="font-mono text-emerald-300">[REDACTED_BY_SECURITY_POLICY]</strong>.
              </p>
            </div>
          )}

          {/* DYNAMIC REALISTIC LANDING PORTALS */}
          {detectedLandingType === 'WORKDAY' ? (
            /* 1. WORKDAY ENTERPRISE HR & PAYROLL PORTAL */
            <form onSubmit={handleLoginSubmit} className="space-y-4 bg-white p-6 rounded-2xl text-slate-900 border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="text-[#e26712] font-black text-lg tracking-tight font-sans">
                    workday<span className="text-[#0051a8]">.</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 border-l pl-2 ml-1">Enterprise HR</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" /> SSL Secured
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
                <strong>Direct Deposit Election Notice:</strong> Please sign in with your corporate account to verify your banking routing changes.
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Workday Username / Employee ID</label>
                <input
                  type="text"
                  required
                  value={loginUsername || simulation.email || ''}
                  onChange={e => setLoginUsername(e.target.value)}
                  placeholder="EMP-90214 or corporate email"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#0051a8]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Account Password</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#0051a8]"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                type="submit"
                loading={loginSubmitting}
                className="w-full justify-center bg-[#0051a8] hover:bg-[#003d7e] text-white font-bold"
              >
                Sign In to Workday
              </Button>
            </form>
          ) : detectedLandingType === 'DOCUSIGN' ? (
            /* 2. DOCUSIGN SECURE DOCUMENT SIGNING PORTAL */
            <form onSubmit={handleLoginSubmit} className="space-y-4 bg-white p-6 rounded-2xl text-slate-900 border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="bg-[#ffcc00] px-2 py-0.5 rounded text-black font-black text-sm tracking-tight">
                    DocuSign
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">eSignature Room</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Envelope #ES-88219</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-slate-800 block">Confidential Envelope: Executive_Bonus_Agreement_2026.pdf</span>
                <span className="text-[10px] text-slate-500 block">Sender: Legal & Remuneration Committee</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Corporate Recipient Email</label>
                <input
                  type="email"
                  required
                  value={loginUsername || simulation.email || ''}
                  onChange={e => setLoginUsername(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#ffcc00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Access Password / Signer Passcode</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#ffcc00]"
                />
              </div>

              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full py-2.5 px-4 rounded-lg bg-[#ffcc00] hover:bg-[#e6b800] text-black font-bold text-xs shadow transition-colors"
              >
                {loginSubmitting ? 'Verifying Envelope...' : 'Access & Sign Document'}
              </button>
            </form>
          ) : detectedLandingType === 'BANKING' ? (
            /* 3. COMMERCIAL BANKING WIRE CONFIRMATION GATEWAY */
            <form onSubmit={handleLoginSubmit} className="space-y-4 bg-white p-6 rounded-2xl text-slate-900 border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-[#117aca] text-white flex items-center justify-center font-bold text-xs">
                    🏦
                  </div>
                  <span className="font-bold text-slate-800 text-sm">Commercial Treasury Online</span>
                </div>
                <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  ⚠️ Wire Hold #WH-4921
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction Value:</span>
                  <span className="font-bold text-slate-900">$48,500.00 USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Beneficiary:</span>
                  <span className="font-bold text-slate-900">Apex Global Holdings Escrow</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Corporate User ID</label>
                <input
                  type="text"
                  required
                  value={loginUsername || simulation.email || ''}
                  onChange={e => setLoginUsername(e.target.value)}
                  placeholder="Corporate User ID"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#117aca]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Banking Password / Token Secret</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#117aca]"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                type="submit"
                loading={loginSubmitting}
                className="w-full justify-center bg-[#117aca] hover:bg-[#0e62a3] text-white font-bold"
              >
                Authorize / Cancel Wire Transfer
              </Button>
            </form>
          ) : detectedLandingType === 'GOOGLE' ? (
            /* 4. GOOGLE WORKSPACE SINGLE SIGN-ON */
            <form onSubmit={handleLoginSubmit} className="space-y-4 bg-white p-6 rounded-2xl text-slate-900 border border-slate-200 shadow-xl">
              <div className="text-center pb-2">
                <svg viewBox="0 0 24 24" className="w-8 h-8 mx-auto">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <h3 className="font-bold text-sm text-slate-800 mt-2">Sign in with Google</h3>
                <p className="text-[11px] text-slate-500">to continue to Organization Workspace</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Email or phone</label>
                <input
                  type="email"
                  required
                  value={loginUsername || simulation.email || ''}
                  onChange={e => setLoginUsername(e.target.value)}
                  placeholder="user@organization.com"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#1a73e8]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Enter your password</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#1a73e8]"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                type="submit"
                loading={loginSubmitting}
                className="w-full justify-center bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold"
              >
                Next
              </Button>
            </form>
          ) : (
            /* 5. DEFAULT MICROSOFT 365 / ENTRA ID SINGLE SIGN-ON */
            <form onSubmit={handleLoginSubmit} className="space-y-4 bg-white p-6 rounded-2xl text-slate-900 border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                    <span className="bg-[#f25022] rounded-[1px]" />
                    <span className="bg-[#7fba00] rounded-[1px]" />
                    <span className="bg-[#00a4ef] rounded-[1px]" />
                    <span className="bg-[#ffb900] rounded-[1px]" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm font-sans">Microsoft</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" /> SSL Encrypted
                </span>
              </div>

              <div className="space-y-0.5">
                <h3 className="font-bold text-base text-slate-800">Sign in</h3>
                <p className="text-[11px] text-slate-500">to continue to Microsoft 365 Security & Access Portal</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Corporate Email, phone, or Skype</label>
                <input
                  type="text"
                  required
                  value={loginUsername || simulation.email || ''}
                  onChange={e => setLoginUsername(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#0078d4]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#0078d4]"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#0078d4]" />
                  <span>Keep me signed in</span>
                </label>
                <span className="text-[#0078d4] hover:underline cursor-pointer">Forgot password?</span>
              </div>

              <Button
                variant="primary"
                size="md"
                type="submit"
                loading={loginSubmitting}
                className="w-full justify-center bg-[#0078d4] hover:bg-[#006abc] text-white font-bold"
              >
                Sign In
              </Button>
            </form>
          )}
        </div>
      </Modal>

      {/* STAGE 5: REPORT PHISHING MODAL */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Report Suspicious Email to Security Operations"
        subtitle="Submit red flags and observations to help protect your colleagues"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="space-y-2">
            <span className="font-bold text-slate-200 block">Select Identified Red Flags:</span>
            <div className="space-y-1.5">
              {[
                'Sender email domain does not match organization',
                'Artificial urgency / 24-hour deadline threat',
                'Hovering revealed lookalike / spoofed root domain',
                'Unsolicited attachment (.xlsm / .iso / .exe)',
                'Request for passwords, OTPs, or financial redirection'
              ].map((reason, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={reportReason.includes(reason)}
                    onChange={() => toggleReportReason(reason)}
                    className="rounded text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-slate-300 text-[11px]">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Additional Notes for SOC Triage (Optional)</label>
            <textarea
              rows={2}
              value={reportNotes}
              onChange={e => setReportNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Received unsolicited payroll notification claiming routing change."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setShowReportModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={reporting}
              onClick={handleReportPhish}
              icon={<ShieldCheck className="w-3.5 h-3.5" />}
            >
              Submit Report (+15 pts)
            </Button>
          </div>
        </div>
      </Modal>

      {/* INTERACTIVE SMARTPHONE QR CAMERA VIEWFINDER MODAL */}
      <Modal
        isOpen={showQrScannerModal}
        onClose={() => setShowQrScannerModal(false)}
        title="Smartphone Camera QR Scanner Viewfinder"
        subtitle="Optical QR Code Recognition & Destination Analysis"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs font-sans">
          {/* Smartphone Camera Viewfinder */}
          <div className="relative bg-slate-950 border-2 border-slate-700 rounded-2xl p-6 overflow-hidden text-center space-y-3 shadow-2xl">
            {/* Viewfinder Corner Framing Brackets */}
            <div className="w-48 h-48 border-2 border-emerald-400/80 rounded-2xl mx-auto relative flex items-center justify-center p-3 bg-slate-900/60 shadow-inner">
              <span className="w-4 h-4 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0" />
              <span className="w-4 h-4 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0" />
              <span className="w-4 h-4 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0" />
              <span className="w-4 h-4 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0" />

              {/* Animated Optical Laser Line */}
              <div className="w-full h-0.5 bg-emerald-400 animate-pulse absolute top-1/2 left-0 shadow-lg shadow-emerald-400" />

              <QrCode className="w-28 h-28 text-white" />
            </div>

            {/* Detected URL Preview Card */}
            <div className="p-3 bg-slate-900/95 rounded-xl border border-amber-500/60 text-left space-y-1 font-mono text-[11px] animate-fadeIn">
              <span className="text-amber-400 font-bold block flex items-center gap-1.5 font-sans">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Optical URL Detected from QR Code:
              </span>
              <p className="text-slate-200 break-all">{simulatedLandingUrl}</p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400 font-sans">
                <span>⚠️ Destination bypasses desktop mail filters</span>
                <span className="text-rose-400 font-bold">Unverified External Host</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQrScannerModal(false)}
            >
              Cancel Scan
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                icon={<ShieldCheck className="w-3.5 h-3.5" />}
                onClick={() => {
                  setShowQrScannerModal(false);
                  setCurrentStage(5);
                  setShowReportModal(true);
                }}
              >
                Flag as Quishing Attack (+15 pts)
              </Button>

              <Button
                variant="danger"
                size="sm"
                icon={<ExternalLink className="w-3.5 h-3.5" />}
                onClick={() => {
                  setShowQrScannerModal(false);
                  setCurrentStage(4);
                  setShowLandingModal(true);
                }}
              >
                Open in Mobile Browser
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* OAUTH CONSENT PERMISSIONS GATE MODAL */}
      <Modal
        isOpen={showOAuthModal}
        onClose={() => setShowOAuthModal(false)}
        title="Permissions Requested by Application"
        subtitle="Microsoft 365 / Google Workspace Third-Party App Authorization"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs font-sans bg-white p-6 rounded-2xl text-slate-900 border border-slate-200 shadow-xl">
          <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-base shadow shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800">Corporate Multi-Cloud Sync Hub</h4>
              <p className="text-[11px] text-slate-500 font-mono">Publisher: unverified-external-connector.io</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs text-slate-700 block">
              This application is requesting permission to access your organization account:
            </span>

            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700">
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold shrink-0">⚠️</span>
                <span><strong>Read, compose, and delete all corporate emails</strong> (Mail.ReadWrite)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold shrink-0">⚠️</span>
                <span><strong>Access all OneDrive & SharePoint documents anytime</strong> (Files.ReadWrite.All)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rose-600 font-bold shrink-0">🚨</span>
                <span><strong>Maintain permanent offline access</strong> even after password reset (offline_access)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowOAuthModal(false);
                setCurrentStage(5);
                setShowReportModal(true);
              }}
            >
              Cancel & Report App (+15 pts)
            </Button>

            <button
              type="button"
              onClick={handleAcceptOAuth}
              className="px-5 py-2 rounded-lg bg-[#0078d4] hover:bg-[#006abc] text-white font-bold text-xs shadow transition-colors"
            >
              Accept & Grant Permissions
            </button>
          </div>
        </div>
      </Modal>

      {/* RFC HEADERS & SPF/DKIM MODAL */}
      <Modal
        isOpen={showHeadersModal}
        onClose={() => setShowHeadersModal(false)}
        title="RFC Email Header & Cryptographic Authentication Inspector"
        subtitle="Forensic breakdown of sender routing and SPF/DKIM validation"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Authentication-Results:</span>
              <Badge variant="critical" size="sm">FAILED</Badge>
            </div>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div><strong>From:</strong> {sender.name} &lt;{sender.email}&gt;</div>
              <div><strong>Return-Path:</strong> &lt;bounce@{sender.spoofed_domain || 'unverified-host.net'}&gt;</div>
              <div><strong>SPF:</strong> <span className="text-rose-400 font-bold">FAIL (IP 194.26.29.11 not authorized)</span></div>
              <div><strong>DKIM:</strong> <span className="text-rose-400 font-bold">INVALID (Signature missing or unverified)</span></div>
              <div><strong>DMARC:</strong> <span className="text-rose-400 font-bold">FAIL (Alignment policy violation)</span></div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setShowHeadersModal(false)}>
              Close Inspector
            </Button>
          </div>
        </div>
      </Modal>

      {/* REALISTIC DOCUMENT & MACRO SPREADSHEET VIEWER MODAL */}
      <Modal
        isOpen={showAttachmentModal}
        onClose={() => setShowAttachmentModal(false)}
        title={`Microsoft Excel - ${payload.attachment_name || 'Executive_Bonus_Matrix.xlsm'} [Protected View]`}
        subtitle="Downloaded document preview"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs font-sans">
          {/* Yellow Office Macro Security Bar */}
          <div className="p-3 bg-[#fff8e1] border-2 border-[#ffe082] rounded-xl flex items-center justify-between text-[#5d4037] gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#f57f17] shrink-0" />
              <span className="font-bold text-xs">
                SECURITY WARNING: Certain active content and macros have been disabled.
              </span>
            </div>

            <button
              type="button"
              onClick={handleEnableMacros}
              className="px-4 py-1.5 rounded-lg bg-[#f57f17] hover:bg-[#e65100] text-white font-bold text-xs shadow transition-colors shrink-0"
            >
              Enable Content
            </button>
          </div>

          {/* Blurred Spreadsheet Grid */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-inner text-slate-800 space-y-2">
            <div className="flex items-center justify-between border-b pb-2 text-slate-500 font-mono text-[11px]">
              <span>Sheet1: Confidential_Executive_Remuneration</span>
              <span>100% Zoom</span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px] opacity-75 blur-[0.5px]">
              <div className="grid grid-cols-4 gap-2 font-bold bg-slate-100 p-1.5 rounded">
                <span>Employee Name</span>
                <span>Role / Division</span>
                <span>Base Allocation</span>
                <span>Net Bonus Amount</span>
              </div>
              <div className="grid grid-cols-4 gap-2 p-1.5 border-b border-slate-100">
                <span>David Harrison</span>
                <span>Chief Executive</span>
                <span>$480,000.00</span>
                <span>$125,000.00</span>
              </div>
              <div className="grid grid-cols-4 gap-2 p-1.5 border-b border-slate-100">
                <span>Victoria Sterling</span>
                <span>VP Operations</span>
                <span>$320,000.00</span>
                <span>$85,000.00</span>
              </div>
              <div className="grid grid-cols-4 gap-2 p-1.5 text-slate-400">
                <span>[Macros required to view remaining 48 rows...]</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAttachmentModal(false)}
            >
              Close Document
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={<ShieldAlert className="w-3.5 h-3.5" />}
              onClick={() => {
                setShowAttachmentModal(false);
                setCurrentStage(5);
                setShowReportModal(true);
              }}
            >
              Report Suspicious Attachment (+15 pts)
            </Button>
          </div>
        </div>
      </Modal>

      {/* FEEDBACK & EDUCATIONAL DEBRIEF MODAL */}
      {showFeedbackModal && feedbackData && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowFeedbackModal(false);
            if (onClose) onClose();
          }}
          title={feedbackData.outcome === 'SAFE_REPORTED' || feedbackData.outcome === 'SAFE_VERIFIED' ? '🛡️ Threat Neutralized!' : '⚠️ Phishing Exercise Compromise'}
          subtitle="Real-time behavioral telemetry and security debrief"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs font-sans text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
              feedbackData.outcome === 'SAFE_REPORTED' || feedbackData.outcome === 'SAFE_VERIFIED'
                ? 'bg-emerald-950 border-2 border-emerald-500 text-emerald-400'
                : 'bg-rose-950 border-2 border-rose-500 text-rose-400'
            }`}>
              {feedbackData.outcome === 'SAFE_REPORTED' || feedbackData.outcome === 'SAFE_VERIFIED' ? (
                <ShieldCheck className="w-8 h-8" />
              ) : (
                <AlertTriangle className="w-8 h-8" />
              )}
            </div>

            <h3 className="text-base font-bold text-slate-100">
              {feedbackData.outcome === 'SAFE_REPORTED' || feedbackData.outcome === 'SAFE_VERIFIED'
                ? 'Safe Action Recorded (+15 pts)'
                : 'Credential Submission Intercepted'}
            </h3>

            <p className="text-slate-300 leading-relaxed">
              {feedbackData.message}
            </p>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-2">
              <span className="font-bold text-amber-400 text-[11px] uppercase tracking-wider block">
                Concealed Indicators in this Scenario:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                {indicators.map((ind: any, i: number) => (
                  <li key={i}><strong>{ind.title}:</strong> {ind.description}</li>
                ))}
                {indicators.length === 0 && (
                  <li>Lookalike sender domain was unverified by corporate SPF records.</li>
                )}
              </ul>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setShowFeedbackModal(false);
                  if (onClose) onClose();
                }}
              >
                Conclude Simulation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
