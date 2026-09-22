import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  ShieldAlert,
  Send,
  Info,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Ban,
  PhoneCall,
  Lock,
  Radio,
  Clock,
  Shield,
  Bell,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  User,
  CheckSquare,
  Square,
  Sparkles,
  Search,
  Camera,
  Mic,
  MoreVertical,
  Globe,
  Tag,
  MessageSquare,
  Wifi,
  Battery,
  Layers,
  FileText,
  DollarSign,
  Truck
} from 'lucide-react';
import { Simulation } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { api } from '../../api/client';

interface SmsClientSimulatorProps {
  simulation: Simulation;
  onEventRecorded?: (eventResult: any) => void;
  onClose?: () => void;
}

// Background Realistic SMS Conversations (Like a Real Smartphone Inbox)
const realisticBackgroundThreads = [
  {
    id: 'bg-1',
    name: 'Uber',
    shortcode: '46-788',
    lastMessage: 'Your Uber driver is arriving in a Silver Toyota Camry. Reply STOP to unsubscribe.',
    time: 'Yesterday',
    unread: false
  },
  {
    id: 'bg-2',
    name: 'Google Verify',
    shortcode: '22000',
    lastMessage: 'G-748921 is your Google verification code. Never share this code with anyone.',
    time: '2 days ago',
    unread: false
  },
  {
    id: 'bg-3',
    name: 'DoorDash',
    shortcode: '334-11',
    lastMessage: 'Your order from Chipotle Mexican Grill has been delivered! Enjoy your meal.',
    time: '3 days ago',
    unread: false
  },
  {
    id: 'bg-4',
    name: 'Dr. Office Reminder',
    shortcode: '+1 (800) 555-0199',
    lastMessage: 'Reminder: Annual Health Checkup tomorrow at 10:30 AM. Reply C to confirm or R to reschedule.',
    time: 'Monday',
    unread: false
  }
];

export const SmsClientSimulator: React.FC<SmsClientSimulatorProps> = ({
  simulation,
  onEventRecorded,
  onClose
}) => {
  const sender = simulation.sender_profile || {};
  const payload = simulation.payload_config || {};
  const indicators = simulation.learning_indicators || [];

  // Mobile App Navigation: 'LOCK_SCREEN' | 'INBOX_LIST' | 'CONVERSATION'
  const [screenView, setScreenView] = useState<'LOCK_SCREEN' | 'INBOX_LIST' | 'CONVERSATION'>('LOCK_SCREEN');

  const [messages, setMessages] = useState<Array<{ sender: 'SENDER' | 'USER'; text: string; time: string; isPrior?: boolean }>>([
    {
      sender: 'SENDER',
      text: 'CHASE ALERT: Your card ending in 8192 was charged $14.50 at STARBUCKS. Reply STOP to cancel alerts.',
      time: 'Yesterday 3:15 PM',
      isPrior: true
    },
    {
      sender: 'SENDER',
      text: payload.smish_text || 'CHASE ALERT: Did you authorize a wire of $4,850.00 to COINBASE? If not, cancel immediately at https://chase-security-auth.net/dispute or reply NO.',
      time: 'Today 9:41 AM'
    }
  ]);

  const [replyInput, setReplyInput] = useState('');
  const [isAttackerTyping, setIsAttackerTyping] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [showSenderInfo, setShowSenderInfo] = useState(false);

  // Simulated Mobile Browser Landing Portal
  const [showLandingPortal, setShowLandingPortal] = useState(false);
  const [mobileUsername, setMobileUsername] = useState('');
  const [mobilePassword, setMobilePassword] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [interceptedSecretWarning, setInterceptedSecretWarning] = useState(false);

  // Mission Tasks Checklist State
  const [taskUnlocked, setTaskUnlocked] = useState(false);
  const [taskInspectedSender, setTaskInspectedSender] = useState(false);
  const [taskInspectedLink, setTaskInspectedLink] = useState(false);
  const [taskReported, setTaskReported] = useState(false);
  const [showTaskHud, setShowTaskHud] = useState(true);

  const smishLink = payload.landing_url || 'https://chase-security-auth.net/dispute';

  // Detect Mobile Portal Type based on scenario content
  const detectedMobilePortalType = (() => {
    if (payload.fake_landing_type) return payload.fake_landing_type;
    const text = `${payload.smish_text || ''} ${payload.landing_url || ''} ${simulation.scenario_name || ''}`.toLowerCase();
    if (text.includes('workday') || text.includes('payroll') || text.includes('direct deposit') || text.includes('hr')) return 'WORKDAY';
    if (text.includes('usps') || text.includes('delivery') || text.includes('package') || text.includes('fedex') || text.includes('dhl')) return 'DELIVERY';
    if (text.includes('docusign') || text.includes('sign') || text.includes('contract')) return 'DOCUSIGN';
    if (text.includes('microsoft') || text.includes('m365') || text.includes('azure') || text.includes('office')) return 'MICROSOFT_SSO';
    return 'CHASE_BANKING';
  })();

  const handleUnlockPhone = () => {
    setScreenView('CONVERSATION');
    setTaskUnlocked(true);
  };

  const handleSendMessage = async (customText?: string) => {
    const userText = (customText || replyInput).trim();
    if (!userText) return;

    const newMessages = [
      ...messages,
      { sender: 'USER' as const, text: userText, time: 'Just now' }
    ];
    setMessages(newMessages);
    setReplyInput('');

    // Check for sensitive secret disclosure
    const isSensitive = /\b\d{4,8}\b/.test(userText) || userText.toLowerCase().includes('password') || userText.toLowerCase().includes('pin') || userText.toLowerCase().includes('otp');

    try {
      const res = await api.simulations.recordEvent(simulation.id, {
        event_type: isSensitive ? 'CREDENTIAL_SUBMISSION_ATTEMPTED' : 'SMS_REPLIED',
        raw_payload: { text: isSensitive ? '[REDACTED_BY_SECURITY_POLICY]' : userText }
      });
      if (onEventRecorded) onEventRecorded(res);

      if (isSensitive) {
        setInterceptedSecretWarning(true);
        setTimeout(() => {
          setFeedbackData({
            outcome: 'UNSAFE_SECRET_DISCLOSED',
            message: 'You replied with a confidential verification PIN or password over an unverified SMS thread. LockPhish intercepted and redacted the code in volatile memory.',
            training_recommended: res.training_recommended
          });
          setShowFeedbackModal(true);
        }, 2200);
        return;
      }

      // Show realistic typing bubbles before attacker bot replies
      setIsAttackerTyping(true);

      setTimeout(() => {
        setIsAttackerTyping(false);
        const lower = userText.toLowerCase();
        let botReply = 'To cancel this unauthorized transaction immediately, our automated fraud gateway has generated an authorization OTP. Please reply with the 6 digits to authorize immediate cancellation.';
        if (lower.includes('stop') || lower.includes('unsubscribe') || lower.includes('no')) {
          botReply = 'Service Alert: Security freeze active. To confirm dispute without incurring charges, tap https://chase-security-auth.net/dispute or reply with your 6-digit confirmation code.';
        } else if (lower.includes('who') || lower.includes('what') || lower.includes('why')) {
          botReply = 'This is the Commercial Banking Fraud Detection Operations. We detected an unauthorized transaction. Please reply with your 6-digit security OTP to verify account ownership.';
        }

        setMessages(prev => [
          ...prev,
          {
            sender: 'SENDER',
            text: botReply,
            time: 'Just now'
          }
        ]);
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsAttackerTyping(false);
    }
  };

  const handleLinkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setTaskInspectedLink(true);
    try {
      const res = await api.simulations.recordEvent(simulation.id, {
        event_type: 'LINK_CLICKED'
      });
      if (onEventRecorded) onEventRecorded(res);
    } catch (err) {}
    setShowLandingPortal(true);
  };

  const handleMobileLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSubmitting(true);
    try {
      const res = await api.simulations.recordEvent(simulation.id, {
        event_type: 'CREDENTIAL_SUBMISSION_ATTEMPTED',
        raw_payload: {
          username: mobileUsername,
          password: mobilePassword ? '[REDACTED_BY_SECURITY_POLICY]' : '',
          otp: mobileOtp ? '[REDACTED_NUMERIC_SECRET]' : ''
        }
      });
      setLoginSubmitting(false);
      setShowLandingPortal(false);
      setFeedbackData({
        outcome: 'UNSAFE_CREDENTIAL_SUBMITTED',
        message: 'You entered credentials on a mobile smishing phishing portal. LockPhish intercepted and sanitized the password in memory.',
        training_recommended: res.training_recommended
      });
      setShowFeedbackModal(true);
      if (onEventRecorded) onEventRecorded(res);
    } catch (err) {
      setLoginSubmitting(false);
    }
  };

  const handleReportSmish = async () => {
    setTaskReported(true);
    try {
      const res = await api.simulations.recordEvent(simulation.id, {
        event_type: 'REPORTED_SMISH'
      });
      setShowReportModal(false);
      setFeedbackData({
        outcome: 'SAFE_REPORTED',
        message: 'Outstanding vigilance! You identified the SMS smishing attempt and reported it safely to corporate security (+15 pts).',
        training_recommended: []
      });
      setShowFeedbackModal(true);
      if (onEventRecorded) onEventRecorded(res);
    } catch (err) {
      console.error(err);
    }
  };

  const completedTasksCount = [taskUnlocked, taskInspectedSender, taskInspectedLink, taskReported].filter(Boolean).length;

  return (
    <div className="max-w-md mx-auto bg-slate-950 border-4 border-slate-800 rounded-[44px] shadow-2xl overflow-hidden flex flex-col h-[760px] relative font-sans text-slate-100 ring-1 ring-slate-700/50">
      {/* 🎯 MISSION TASKS FLOATING HUD CHECKLIST */}
      {showTaskHud && (
        <div className="absolute top-16 right-4 z-50 bg-[#0f172a] text-slate-100 border border-emerald-500/70 rounded-2xl p-3.5 shadow-2xl w-72 font-sans animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-slate-100">SMS Smishing Mission</span>
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

          <div className="space-y-1.5 pt-2 text-xs">
            <div className={`flex items-start gap-2 p-1.5 rounded-lg border transition-all ${taskUnlocked ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
              {taskUnlocked ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> : <Square className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />}
              <div>
                <strong className="block text-[11px]">Task 1: Unlock & Inspect Message</strong>
                <span className="text-[10px] text-slate-400">Tap notification banner to open conversation.</span>
              </div>
            </div>

            <div className={`flex items-start gap-2 p-1.5 rounded-lg border transition-all ${taskInspectedSender ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
              {taskInspectedSender ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> : <Square className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />}
              <div>
                <strong className="block text-[11px]">Task 2: Check Sender & Carrier Info (i)</strong>
                <span className="text-[10px] text-slate-400">Tap the (i) info icon to inspect caller ID spoofing.</span>
              </div>
            </div>

            <div className={`flex items-start gap-2 p-1.5 rounded-lg border transition-all ${taskInspectedLink ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
              {taskInspectedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> : <Square className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />}
              <div>
                <strong className="block text-[11px]">Task 3: Inspect True Root Domain in Link Card</strong>
                <span className="text-[10px] text-slate-400">Verify destination hostname before authentication.</span>
              </div>
            </div>

            <div className={`flex items-start gap-2 p-1.5 rounded-lg border transition-all ${taskReported ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
              {taskReported ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> : <Square className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />}
              <div>
                <strong className="block text-[11px]">Task 4: Click &ldquo;Report Smish&rdquo; (+15 pts)</strong>
                <span className="text-[10px] text-slate-400">Flag the smish to SOC to conclude safely.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOP SMARTPHONE CHROME: DYNAMIC ISLAND + STATUS BAR */}
      <div className="bg-slate-900 px-6 py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <span className="text-xs font-mono text-slate-300 font-bold">9:41</span>
        
        {/* Dynamic Island Capsule */}
        <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto flex items-center justify-center border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-slate-700 mr-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold">5G</span>
          <Battery className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* VIEW 1: SMARTPHONE LOCK SCREEN */}
      {screenView === 'LOCK_SCREEN' && (
        <div
          onClick={handleUnlockPhone}
          className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-[#0f172a] via-slate-950 to-[#020617] cursor-pointer select-none"
        >
          {/* Top Clock & Date */}
          <div className="text-center pt-8 space-y-1">
            <Lock className="w-5 h-5 text-slate-400 mx-auto mb-2 animate-bounce" />
            <h2 className="text-5xl font-black text-slate-100 font-mono tracking-tight">9:41</h2>
            <p className="text-xs text-slate-400 font-medium">Tuesday, August 22</p>
          </div>

          {/* Incoming Push Notification Toast Banner */}
          <div className="bg-slate-900/95 border-2 border-emerald-500/80 rounded-3xl p-4 shadow-2xl space-y-2 animate-fadeIn ring-1 ring-emerald-500/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  💬
                </div>
                <span className="text-xs font-bold text-slate-100">MESSAGES &bull; {sender.name || 'CHASE-ALERT'}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">Just now</span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {payload.smish_text || 'CHASE ALERT: Did you authorize a wire of $4,850.00 to COINBASE? If not, cancel immediately at https://chase-security-auth.net/dispute or reply NO.'}
            </p>
          </div>

          {/* Swipe Up Home Bar Indicator */}
          <div className="text-center pb-4 space-y-2">
            <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto" />
            <span className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1 animate-pulse">
              <span>Tap Notification to Open Messages Thread</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      )}

      {/* VIEW 2: SMARTPHONE MESSAGES INBOX LIST */}
      {screenView === 'INBOX_LIST' && (
        <div className="flex-1 flex flex-col justify-between bg-slate-950 min-h-0">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-100">Messages</h3>
            <button
              onClick={() => setScreenView('LOCK_SCREEN')}
              className="text-xs text-sky-400 font-bold"
            >
              Lock Screen
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-900">
            {/* Target Phishing Message Row */}
            <div
              onClick={() => setScreenView('CONVERSATION')}
              className="p-4 bg-slate-900/60 hover:bg-slate-900 cursor-pointer flex items-center gap-3 border-l-4 border-l-emerald-500"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {sender.name?.charAt(0) || 'C'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-xs text-slate-100 truncate">{sender.name || 'CHASE-ALERT'}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">9:41 AM</span>
                </div>
                <p className="text-xs text-slate-300 truncate font-sans">
                  {payload.smish_text || 'CHASE ALERT: Did you authorize a wire of $4,850.00 to COINBASE?...'}
                </p>
              </div>
            </div>

            {/* Background Legitimate Messages */}
            {realisticBackgroundThreads.map(t => (
              <div
                key={t.id}
                className="p-4 hover:bg-slate-900/40 cursor-pointer flex items-center gap-3 opacity-70"
              >
                <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-medium text-xs text-slate-300">{t.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{t.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{t.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: ACTIVE SMS THREAD CONVERSATION */}
      {screenView === 'CONVERSATION' && (
        <div className="flex-1 flex flex-col justify-between bg-slate-950 min-h-0">
          {/* iOS / Android Messages Header Bar */}
          <div className="px-4 py-3 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScreenView('INBOX_LIST')}
                className="text-sky-400 text-xs font-bold flex items-center gap-0.5 hover:text-sky-300"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Messages</span>
              </button>

              <div className="flex items-center gap-2 ml-1">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs">
                  {sender.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{sender.name || 'CHASE-ALERT'}</h4>
                  <p className="text-[10px] font-mono text-slate-400">{sender.phone || '+1 (800) 555-0182'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setShowSenderInfo(true);
                  setTaskInspectedSender(true);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
                title="Sender forensic details"
              >
                <Info className="w-4 h-4 text-sky-400" />
              </button>

              <button
                onClick={() => setShowReportModal(true)}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-[11px] flex items-center gap-1 transition-colors"
                title="Report as smishing"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report</span>
              </button>
            </div>
          </div>

          {/* Intercepted Secret Warning Banner */}
          {interceptedSecretWarning && (
            <div className="p-2.5 bg-rose-950/90 border-b border-rose-500 text-rose-300 text-xs font-bold flex items-center gap-2 animate-fadeIn shrink-0">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Sensitive Verification PIN Intercepted by Safety Shield!</span>
            </div>
          )}

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950">
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'USER';
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm font-sans ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-br-none font-medium'
                        : 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-none'
                    }`}
                  >
                    {!isUser && (
                      <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center justify-between font-mono">
                        <span>{sender.name || 'CHASE-ALERT'}</span>
                      </div>
                    )}
                    <p>{msg.text}</p>

                    {/* Rich Interactive Link Preview Card */}
                    {!isUser && !msg.isPrior && (
                      <div className="mt-3 pt-2.5 border-t border-slate-700/80 space-y-2">
                        <div
                          onClick={handleLinkClick}
                          className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 space-y-1.5 cursor-pointer hover:border-emerald-500 transition-all group"
                        >
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                            <Globe className="w-3 h-3 text-sky-400" />
                            <span className="text-amber-400 font-bold truncate">
                              {smishLink.replace('https://', '').split('/')[0]}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-slate-100 group-hover:text-emerald-400 block truncate">
                            {detectedMobilePortalType === 'WORKDAY'
                              ? 'Workday Direct Deposit & Payroll Verification'
                              : detectedMobilePortalType === 'DELIVERY'
                              ? 'Package Redelivery & Tracking Dispute'
                              : detectedMobilePortalType === 'DOCUSIGN'
                              ? 'DocuSign Mobile Envelope Signing Room'
                              : detectedMobilePortalType === 'MICROSOFT_SSO'
                              ? 'Microsoft 365 Single Sign-On Gateway'
                              : 'Online Banking Fraud Dispute & Cancellation'}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Secure Mobile Authentication Portal
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={handleLinkClick}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-600 text-emerald-300 text-[11px] font-bold transition-all shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tap to Open Destination Portal</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">{msg.time}</span>
                </div>
              );
            })}

            {/* Attacker Typing Animation */}
            {isAttackerTyping && (
              <div className="flex items-start">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Reply Action Pills */}
          <div className="px-3 py-1.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono shrink-0">Quick Replies:</span>
            {['NO', 'STOP', 'Who is this?', 'Cancel Transfer', '849-102'].map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(q)}
                className={`px-2.5 py-1 rounded-full border text-[10px] font-medium whitespace-nowrap transition-colors ${
                  q === '849-102'
                    ? 'bg-rose-950/40 border-rose-800 text-rose-300 hover:bg-rose-900/60'
                    : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-white'
                }`}
              >
                &ldquo;{q}&rdquo;
              </button>
            ))}
          </div>

          {/* Messages Input Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={replyInput}
              onChange={e => setReplyInput(e.target.value)}
              placeholder="Text Message (e.g. NO, STOP, Cancel)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <Button type="submit" variant="primary" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
              Send
            </Button>
          </form>
        </div>
      )}

      {/* DYNAMIC REALISTIC MOBILE BROWSER MODALS (CHASE / WORKDAY / DELIVERY / DOCUSIGN / M365) */}
      <Modal
        isOpen={showLandingPortal}
        onClose={() => setShowLandingPortal(false)}
        title="Mobile Web Browser"
        subtitle={`Target Host: ${smishLink}`}
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs font-sans">
          {/* Mobile Address Bar */}
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700 flex items-center gap-2 font-mono text-[11px] text-slate-300 shadow-inner">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-amber-400 font-bold truncate">{smishLink}</span>
          </div>

          {/* DYNAMIC AUTHENTIC MOBILE PORTALS */}
          {detectedMobilePortalType === 'WORKDAY' ? (
            /* WORKDAY MOBILE HR & PAYROLL */
            <form onSubmit={handleMobileLoginSubmit} className="space-y-4 bg-white p-5 rounded-2xl text-slate-900 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="font-black text-sm text-[#e26712]">workday<span className="text-[#0051a8]">.</span></div>
                <Badge variant="low" size="sm">SSL Secured</Badge>
              </div>

              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                <strong>Payroll Notice:</strong> Direct deposit routing changes require secondary mobile authentication.
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Workday Corporate ID / Email</label>
                <input
                  type="text"
                  required
                  value={mobileUsername}
                  onChange={e => setMobileUsername(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#0051a8]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Account Password</label>
                <input
                  type="password"
                  required
                  value={mobilePassword}
                  onChange={e => setMobilePassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#0051a8]"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                type="submit"
                loading={loginSubmitting}
                className="w-full justify-center bg-[#0051a8] hover:bg-[#003d7e] text-white font-bold"
              >
                Verify Workday Identity
              </Button>
            </form>
          ) : detectedMobilePortalType === 'DELIVERY' ? (
            /* COURIER / DELIVERY REDELIVERY PORTAL */
            <form onSubmit={handleMobileLoginSubmit} className="space-y-4 bg-white p-5 rounded-2xl text-slate-900 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-1.5 font-bold text-sm text-slate-800">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Express Courier Redelivery</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Tracking #US-98214</span>
              </div>

              <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-blue-900">
                Package on hold due to incomplete address. Confirm recipient identity.
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Full Name on Package</label>
                <input
                  type="text"
                  required
                  value={mobileUsername}
                  onChange={e => setMobileUsername(e.target.value)}
                  placeholder="Full Legal Name"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Postal Redelivery Passcode / Card PIN</label>
                <input
                  type="password"
                  required
                  value={mobilePassword}
                  onChange={e => setMobilePassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                type="submit"
                loading={loginSubmitting}
                className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Schedule Immediate Redelivery
              </Button>
            </form>
          ) : (
            /* DEFAULT COMMERCIAL BANKING DISPUTE PORTAL */
            <form onSubmit={handleMobileLoginSubmit} className="space-y-4 bg-white p-5 rounded-2xl text-slate-900 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-1.5 font-bold text-sm text-slate-800">
                  <div className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center text-xs">🏦</div>
                  <span>Bank Fraud Dispute Operations</span>
                </div>
                <Badge variant="low" size="sm">SSL Secured</Badge>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Online Banking Username</label>
                <input
                  type="text"
                  required
                  value={mobileUsername}
                  onChange={e => setMobileUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Account Password / PIN</label>
                <input
                  type="password"
                  required
                  value={mobilePassword}
                  onChange={e => setMobilePassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                type="submit"
                loading={loginSubmitting}
                className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Cancel Wire & Restore Account
              </Button>
            </form>
          )}
        </div>
      </Modal>

      {/* SENDER INFO FORENSIC BREAKDOWN MODAL */}
      <Modal
        isOpen={showSenderInfo}
        onClose={() => setShowSenderInfo(false)}
        title="SMS Telephony Forensic Breakdown"
        maxWidth="sm"
      >
        <div className="space-y-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Caller ID / Name:</span>
              <span className="text-slate-200 font-bold">{sender.name || 'CHASE-ALERT'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Shortcode / Phone:</span>
              <span className="text-slate-200">{sender.phone || '+1 (800) 555-0182'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Carrier Verification:</span>
              <span className="text-rose-400 font-bold">UNVERIFIED (Spoofed Header)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Root Link Domain:</span>
              <span className="text-amber-400 font-bold">
                {smishLink.replace('https://', '').split('/')[0]}
              </span>
            </div>
          </div>
          <p className="text-slate-400 font-sans text-xs leading-relaxed">
            SMS alphanumeric sender IDs can be spoofed by bulk VoIP gateways. Always contact the financial institution using the verified phone number printed on the back of your physical card.
          </p>
        </div>
      </Modal>

      {/* REPORT SMISH MODAL */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Report Mobile Smishing Alert"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs font-sans">
          <p className="text-slate-300 leading-relaxed">
            Confirm reporting this SMS message as an unauthorized smishing attack to your corporate Security Operations Center.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setShowReportModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleReportSmish} icon={<ShieldAlert className="w-3.5 h-3.5" />}>
              Submit Smishing Report (+15 pts)
            </Button>
          </div>
        </div>
      </Modal>

      {/* FEEDBACK DEBRIEF MODAL */}
      <Modal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        title="Mobile SMS Security Debrief"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs font-sans text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
            feedbackData?.outcome === 'SAFE_REPORTED'
              ? 'bg-emerald-950 border-2 border-emerald-500 text-emerald-400'
              : 'bg-rose-950 border-2 border-rose-500 text-rose-400'
          }`}>
            {feedbackData?.outcome === 'SAFE_REPORTED' ? (
              <ShieldCheck className="w-7 h-7" />
            ) : (
              <AlertCircle className="w-7 h-7" />
            )}
          </div>

          <h3 className="text-base font-bold text-slate-100">
            {feedbackData?.outcome === 'SAFE_REPORTED' ? 'Smishing Lure Defused (+15 pts)' : 'SMS Security Vulnerability'}
          </h3>

          <p className="text-slate-300 leading-relaxed">
            {feedbackData?.message}
          </p>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-2">
            <span className="font-bold text-amber-400 text-[11px] uppercase tracking-wider block">
              Concealed Indicators in this SMS:
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
              {indicators.map((ind: any, i: number) => (
                <li key={i}><strong>{ind.title}:</strong> {ind.description}</li>
              ))}
              {indicators.length === 0 && (
                <li>Message contained unverified shortcode link pointing to lookalike root domain.</li>
              )}
            </ul>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-800">
            <Button variant="primary" size="sm" onClick={() => { setShowFeedbackModal(false); if (onClose) onClose(); }}>
              Conclude Exercise
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
