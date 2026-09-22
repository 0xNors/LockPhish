import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Award,
  HelpCircle,
  ShieldCheck,
  Globe,
  AlertTriangle,
  FileText,
  ExternalLink,
  Lock,
  Sparkles,
  Play,
  Layers,
  ChevronRight,
  Eye,
  Bookmark,
  CheckCircle,
  XCircle,
  HelpCircle as QuestionIcon,
  Smartphone,
  PhoneCall,
  Mail,
  QrCode,
  FileSpreadsheet,
  Terminal,
  Paperclip,
  Radio,
  Clock,
  ShieldAlert,
  Send,
  Building2,
  DollarSign,
  Briefcase,
  Zap,
  Info,
  Check
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Modal } from '../common/Modal';
import { AssessmentRunner } from './AssessmentRunner';
import { ModuleSimulationsEngine } from './ModuleSimulationsEngine';
import { ModuleDeconstructionEngine } from './ModuleDeconstructionEngine';
import { ModuleDefenseEngine } from './ModuleDefenseEngine';
import { api } from '../../api/client';

interface CoursePlayerProps {
  assignment: any;
  onProgressUpdated?: () => void;
  onCompleted?: () => void;
  onClose?: () => void;
}

// Generate deep, 50+ line instructor masterclass lecture tailored specifically to the module topic
const getEnrichedMasterclassContent = (module: any, course: any, stepIndex: number) => {
  const title = module?.title || course?.course_title || course?.title || 'Cybersecurity Defense';
  const category = (course?.course_category || course?.category || 'SOCIAL_ENGINEERING').toUpperCase();
  const difficulty = (course?.course_difficulty || course?.difficulty || 'INTERMEDIATE').toUpperCase();
  const rawContent = module?.content || '';

  // Return custom content if already long and structured
  if (rawContent && rawContent.split('\n').length >= 35) {
    return rawContent;
  }

  // 1. EMAIL SECURITY & PHISHING ANATOMY
  if (category.includes('EMAIL') || title.toLowerCase().includes('phish') || title.toLowerCase().includes('email')) {
    return `### 1. Conceptual Foundation & Offensive Mechanics
Phishing is the primary initial access vector responsible for over 91% of modern corporate cybersecurity breaches. Threat actors do not break cryptographic algorithms or breach fortified corporate firewalls; they manipulate human trust, cognitive shortcuts, and operational workplace habits to induce unauthorized credential disclosure or malicious payload execution.

In modern enterprise environments, email remains the central nervous system for inter-departmental communication, vendor invoicing, and identity management. Because employees process dozens of emails daily under time constraints, adversaries construct deceptive pretexts designed to bypass rational skepticism.

### 2. The 5-Stage Adversary Phishing Lifecycle
Modern spear-phishing campaigns follow a disciplined multi-stage operational lifecycle:
• **Stage 1: OSINT Reconnaissance**: Attackers scrape LinkedIn, corporate websites, and public SEC filings to map organizational hierarchies, vendor relationships, and technology stacks (e.g. Microsoft 365, Okta, Workday).
• **Stage 2: Lookalike Infrastructure Weaponization**: Adversaries register typosquatted root domains (e.g. login-microsoftonline-auth.net) and provision valid SSL/TLS certificates to create the visual illusion of legitimacy.
• **Stage 3: Deceptive Lure Delivery**: The email is dispatched using SPF/DKIM spoofing, display-name deception, or compromised third-party vendor mailboxes to evade spam filtering.
• **Stage 4: Reverse-Proxy / Credential Harvesting**: The victim is routed to an Adversary-in-the-Middle (AitM) portal that proxies authentication in real time, capturing passwords and session tokens.
• **Stage 5: Post-Compromise Lateral Movement**: Stolen session tokens are utilized to access SharePoint, OneDrive, and corporate mailboxes to launch secondary internal attacks.

### 3. Psychological Manipulation Levers
Phishing emails rarely rely on technical exploitation alone; they weaponize established psychological heuristics:
• **Authority Compliance**: Impersonating executive leadership (CEO, CFO, Legal Counsel) to suppress questioning.
• **Time-Pressure & Urgency**: Imposing artificial 15-minute deadlines ("Action Required to Avoid Account Lockout").
• **Consequence Anxiety**: Threatening disciplinary action, missed payroll batches, or regulatory non-compliance.
• **Curiosity & Greed**: Luring staff with leaked executive bonus matrices, restructuring plans, or gift cards.

### 4. Forensic Indicators & Concealed Red Flags
To identify advanced phishing attacks, inspect these critical technical artifacts:
1. **Display Name vs Envelope Return-Path**: The display name may state "Corporate IT Security", but inspecting the Return-Path header reveals an unauthorized external server (e.g. bounce@relay-unverified.net).
2. **Subdomain Prefix Deception**: Attackers place trusted brand names into subdomain prefixes (e.g. login.microsoft.com.security-check.org). The true controlling host is ALWAYS the root domain before the final slash.
3. **Punycode & Homoglyph Substitution**: Threat actors substitute Cyrillic or Greek characters that look identical to Latin letters (e.g. googIe.com with an uppercase i instead of an l).
4. **HTTPS Fallacy**: Over 83% of phishing websites use HTTPS. A padlock icon in the browser only encrypts the connection to the attacker's server; it does NOT verify legitimacy.

### 5. Legitimate vs Phishing Comparison Matrix
• **Legitimate Corporate Communication**: Addressed to you by your full name, refers to existing open tickets, uses internal verified domains, never demands passwords over email.
• **Phishing Attack Lure**: Generic greetings ("Dear Employee"), artificial 24-hour deadlines, links pointing to lookalike external hostnames, requests for credential verification or macro enablement.

### 6. Standard Operating Defense Procedure (SOP)
When encountering any unexpected communication containing links or attachments:
1. **PAUSE & ISOLATE**: Do not click links, open attachments, or reply to the sender.
2. **OUT-OF-BAND VERIFICATION**: Open a fresh browser window and navigate directly to your official bookmarked corporate portal, or contact the sender via verified internal phone numbers.
3. **60-SECOND SOC REPORTING**: Use the LockPhish "Report Phishing" button immediately. Rapid reporting protects the entire organization.`;
  }

  // 2. SMS SMISHING & MOBILE SECURITY
  if (category.includes('SMS') || title.toLowerCase().includes('smish') || title.toLowerCase().includes('text')) {
    return `### 1. Conceptual Foundation & Mobile Attack Surface
Smishing (SMS Phishing) is a specialized social engineering attack vector where adversaries deliver deceptive short messages directly to an employee's mobile device. Because mobile devices lack desktop hover-to-inspect link mechanisms and employees perceive SMS as a more intimate, urgent communications channel, smishing yields significantly higher click rates.

Attackers exploit mobile interface limitations: truncated URLs, smaller screen sizes, and the absence of full email headers.

### 2. Common Smishing Attack Vectors
• **Commercial Banking Fraud Alerts**: Fake SMS claiming an unauthorized wire transfer ($4,850.00 to Coinbase) has been initiated, urging the victim to cancel via an unverified link.
• **Package & Courier Redelivery Lures**: Messages impersonating USPS, FedEx, or DHL alleging an undelivered parcel due to missing street address information.
• **IT Security MFA / Password Reset Lures**: Texts claiming your corporate single sign-on password will expire today unless re-authenticated via a mobile portal.
• **Conversational Attacker Bots**: Adversaries reply to victim text responses in real time, claiming to be fraud specialists demanding 6-digit confirmation codes.

### 3. Telephony Spoofing & Shortcode Exploitation
Adversaries use commercial VoIP gateways and SIP trunking providers to forge arbitrary alphanumeric sender IDs (e.g. "CHASE-ALERT" or "IT-HELPDESK"). Receiving a message with a legitimate-looking caller ID does NOT authenticate the sender.

### 4. Psychological Pressure Tactics in Smishing
• **Immediacy**: Mobile notifications trigger reflexive checking within 3 minutes of arrival.
• **Panic Triggering**: Threatening financial loss or package return to force hasty link clicks.
• **Bypassing Desktop Defenses**: Mobile messages bypass corporate gateway firewalls and desktop endpoint detection.

### 5. Defense Protocol for Mobile Communications
1. **Never Click Mobile Links in Unsolicited Alerts**: Never tap embedded links in unexpected SMS messages regarding banking, deliveries, or account security.
2. **Verify via Physical Card / Official Portal**: Call the official customer service number printed on the back of your physical corporate payment card or visit the official app directly.
3. **Shield 6-Digit MFA Codes**: Legitimate organizations will NEVER ask you to reply with an SMS verification code to cancel a transaction.
4. **Report Smishing**: Forward suspicious messages to 7726 (SPAM) and notify your corporate Security Operations Center.`;
  }

  // 3. VOICE VISHING & DEEPFAKES
  if (category.includes('VOICE') || title.toLowerCase().includes('vish') || title.toLowerCase().includes('call') || title.toLowerCase().includes('deepfake')) {
    return `### 1. Conceptual Foundation & Voice Social Engineering
Vishing (Voice Phishing) is the practice of leveraging telephone communications to deceive personnel into disclosing credentials, authorizing unauthorized wire transfers, or granting remote access. Voice attacks are exceptionally potent because real-time conversational pressure prevents victims from carefully analyzing red flags.

With the emergence of generative AI acoustic models, adversaries can clone executive voices using as little as 3 seconds of publicly available audio from webinars, quarterly earnings calls, or YouTube videos.

### 2. Primary Vishing Attack Scenarios
• **IT Helpdesk Remote Assistance**: Caller impersonates senior network engineering claiming your workstation is generating malicious traffic or requires an emergency VPN configuration update.
• **Executive Wire Transfer Demands**: Adversary uses an AI-cloned CEO/CFO voice demanding an urgent confidential wire transfer for an unannounced acquisition.
• **Vendor Banking Modification**: Caller claims to be from an established vendor's accounts payable department requesting an update to their ACH direct deposit routing number.
• **ServiceNow Ticket Exploitation**: Attackers reference real employee names and internal project code words scraped from social media to build rapid false trust.

### 3. Caller ID Spoofing & STIR/SHAKEN Limitations
Caller ID is trivial to forge using VoIP trunking tools. The FCC STIR/SHAKEN framework provides caller attestation scores:
• **Level A (Full Attestation)**: The carrier verified the caller has the legal right to use the number.
• **Level B (Partial Attestation)**: The carrier verified the caller identity but not the specific telephone number.
• **Level C (Gateway / Unverified)**: The call originated from an untrusted international VoIP gateway with zero identity validation. Over 95% of vishing attacks originate with Level C attestation.

### 4. Psychological Manipulation in Live Phone Calls
• **Social Urgency & Aggression**: Attackers create artificial tension, threatening that delays will cost millions or disrupt executive travel.
• **Helpfulness Exploitation**: Attackers exploit the human desire to be cooperative with colleagues and authority figures.
• **Isolation**: Demanding that the request be kept strictly confidential to prevent the employee from consulting supervisors.

### 5. Standard Operating Defense Procedure for Inbound Calls
1. **Enforce Dual-Control Signoff**: Never modify vendor banking information or release wires without verbal dual-control authorization via a verified secondary channel.
2. **Hang Up & Call Back Directory Numbers**: If a caller claims to be from internal IT or executive leadership, politely hang up and dial the official extension listed in the corporate employee directory.
3. **Never Disclose MFA Codes Over the Phone**: Corporate IT policy strictly prohibits employees from speaking or typing MFA verification codes to phone callers.
4. **Deploy Dynamic Code Words**: Use pre-agreed internal challenge-response phrases for sensitive transactions.`;
  }

  // 4. WEAPONIZED ATTACHMENTS & MACROS
  if (category.includes('ATTACHMENT') || title.toLowerCase().includes('macro') || title.toLowerCase().includes('excel') || title.toLowerCase().includes('xlsm')) {
    return `### 1. Conceptual Foundation & Malicious Document Architecture
Weaponized document attachments remain a favored infection vector for ransomware syndicates and state-sponsored advanced persistent threats (APTs). Adversaries embed malicious code into familiar Microsoft Office formats (.xlsm, .docm, .pptm) or disguise executables using double extensions (e.g. Invoice_Q3.pdf.exe).

Attackers exploit Microsoft Office VBA (Visual Basic for Applications) macros to execute PowerShell downloaders that pull second-stage malware directly into machine memory.

### 2. The Protected View Security Barrier
Microsoft Office enforces Protected View on files originating from external email attachments or internet downloads. In Protected View, active content and VBA macros are sandboxed and disabled by default.

To bypass this barrier, adversaries design persuasive visual lures inside the document:
• Fake blurring of sensitive salary data with a banner stating: "Document protected. Click 'Enable Content' to decrypt executive bonus calculations."
• Fake Microsoft Office update graphics prompting: "Created in a newer version of Office. Enable macros to render compatibility view."

### 3. Dangerous File Extensions to Inspect
• **Macro-Enabled Documents**: .xlsm, .docm, .dotm, .xltm
• **Executable & Script Payloads**: .exe, .bat, .ps1, .vbs, .hta, .scr
• **Disk Images & Containers**: .iso, .img, .vhd (used to bypass email gateway antivirus inspection)
• **Compressed Archives**: .zip, .rar, .7z, .tar.gz (often password-protected to prevent automated gateway sandboxing)

### 4. Evaluating Attachment Legitimacy
Ask these 4 critical questions before opening any attachment:
1. **Was this specific file expected**: Did you request this document from this sender prior to receipt?
2. **Is the workflow normal**: Does your organization normally distribute compensation matrices or invoices via email attachments rather than secure intranet portals?
3. **Does the file demand unusual permissions**: Does the document immediately ask you to enable macros, run scripts, or bypass security warnings?
4. **What is the true file extension**: Ensure Windows Explorer has "File name extensions" enabled to reveal deceptive double extensions like report.pdf.exe.

### 5. Standard Operating Procedure for Attachments
1. **NEVER CLICK "ENABLE CONTENT" on Unexpected Files**: Clicking "Enable Content" or "Enable Macros" grants arbitrary code execution rights to the document.
2. **Upload to Sandbox / Verify with Sender**: If in doubt, notify IT Security or verify the document through a verified out-of-band communication channel.
3. **1-Click SOC Report**: Use the LockPhish "Report Phishing" button to allow SOC analysts to safely analyze the attachment in an isolated sandbox.`;
  }

  // 5. ACCOUNT SECURITY, MFA & OAUTH
  if (category.includes('ACCOUNT') || title.toLowerCase().includes('mfa') || title.toLowerCase().includes('oauth') || title.toLowerCase().includes('password')) {
    return `### 1. Conceptual Foundation & Modern Identity Security
Identity is the new enterprise security perimeter. In cloud-first environments (Microsoft 365, Google Workspace, AWS, Salesforce), compromising employee user credentials provides direct access to corporate data stores without needing to penetrate on-premises network boundaries.

While Multi-Factor Authentication (MFA) is essential, adversaries have developed sophisticated techniques to bypass legacy MFA implementations.

### 2. Modern Identity Attack Vectors
• **Adversary-in-the-Middle (AitM) Reverse Proxies**: Platforms like EvilProxy and Modlishka sit between the employee and the genuine login portal. The proxy relays credentials and MFA prompts in real time, intercepting the resulting authenticated session cookie (ESTSAuth).
• **MFA Push Notification Fatigue**: Attackers who obtain passwords trigger dozens of mobile MFA push notifications at 2:00 AM, then contact the victim via SMS or phone pretending to be IT support to coax a single "Approve" tap.
• **Illicit OAuth Application Consent Grants**: Attackers trick employees into granting permissions to a third-party cloud app. The malicious app requests broad API scopes (Mail.ReadWrite, Files.ReadWrite.All, offline_access) allowing permanent data exfiltration even after password resets.
• **Credential Stuffing & Password Spraying**: Automated bots test millions of compromised username/password combinations leaked from third-party breaches against corporate single sign-on gateways.

### 3. The Power of Phishing-Resistant FIDO2 Authentication
Standard SMS OTPs and basic mobile push prompts are vulnerable to AitM proxy harvesting. Phishing-resistant authentication protocols (FIDO2 / WebAuthn hardware security keys, Windows Hello for Business) bind cryptographic credentials directly to the genuine browser URL, rendering lookalike proxy harvesting impossible.

### 4. Inspecting Application Consent Permissions
When prompted to authorize a cloud application, evaluate the requested permission scopes:
• **High-Risk Scopes**: Mail.ReadWrite (read and send emails as you), Files.ReadWrite.All (modify all OneDrive documents), Directory.AccessAsUser.All, offline_access.
• **Unverified Publishers**: Only grant consent to verified corporate applications vetted by IT Enterprise Architecture.

### 5. Identity Defense Rules of Engagement
1. **Never Approve Unexpected MFA Push Notifications**: If you receive a push notification when you are not actively logging in, tap "DENY" and notify IT Security immediately.
2. **Adopt Enterprise Password Managers**: Password managers automatically match credentials strictly to the true root domain. They will never autofill passwords on lookalike phishing domains.
3. **Audit Connected Cloud Applications**: Regularly review and revoke third-party app permissions in your Microsoft 365 and Google Workspace account settings.
4. **Report Credential Disclosure Immediately**: If you suspect you entered credentials on an unauthorized portal, report within 60 seconds so SOC analysts can revoke active session tokens.`;
  }

  // 6. GENERAL SOCIAL ENGINEERING & COMPLIANCE
  return `### 1. Conceptual Foundation & Behavioral Security Governance
Cybersecurity awareness is not a static test; it is an active operational discipline. Over 85% of successful data breaches involve human interaction. Understanding social engineering vectors, regulatory compliance mandates, and incident escalation protocols safeguards organizational intellectual property and employee privacy.

Security frameworks (SOC 2 Type II, ISO/IEC 27001:2022, NIST SP 800-53 Rev. 5, HIPAA, PCI DSS v4.0) mandate continuous, measurable behavioral training rather than annual check-the-box videos.

### 2. The 6 Universal Psychological Manipulation Levers
Social engineers exploit predictable human cognitive patterns:
• **1. Authority**: "Your CFO requested this urgent transfer immediately."
• **2. Urgency**: "Authenticate your session within 15 minutes to avoid lockout."
• **3. Fear**: "Your account is subject to immediate disciplinary suspension."
• **4. Curiosity**: "Confidential Q3 Executive Compensation & Bonus Matrix (.xlsm)."
• **5. Greed / Reward**: "Claim your unallocated corporate wellness bonus reward."
• **6. Social Proof**: "All team members in your department have already verified."

### 3. The Anatomy of Modern Pretexting
Pretexting involves constructing an elaborate fabricated scenario to manipulate a victim into releasing information or performing an action. Adversaries research target organizations on public social channels to weave authentic department names, software tools, and project terminology into their attack narratives.

### 4. Legitimate vs Social Engineering Comparison
• **Legitimate Corporate Workflows**: Adhere to documented change control procedures, allow independent out-of-band verification, never demand password or OTP disclosure.
• **Social Engineering Pretexts**: Demand immediate exceptions to policy, require strict secrecy, and penalize verification delays.

### 5. Standard Operating Incident Reporting Protocol (SOP)
When encountering any suspicious email, SMS, phone call, or document:
1. **STOP & THINK**: Do not react reflexively to artificial urgency or perceived executive pressure.
2. **INDEPENDENT VERIFICATION**: Verify unusual requests through pre-established, trusted out-of-band directory channels.
3. **ONE-CLICK SOC REPORTING**: Report the incident within 60 seconds to enable rapid enterprise containment.`;
};

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  assignment,
  onProgressUpdated,
  onCompleted,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAssessment, setShowAssessment] = useState(false);
  const [activeStoryTab, setActiveStoryTab] = useState<'LECTURE' | 'SIMULATOR_DEMO' | 'DECONSTRUCTION' | 'SOP' | 'NOTES'>('LECTURE');

  // Interactive Decision Question state
  const [selectedDecision, setSelectedDecision] = useState<number | null>(null);
  const [decisionSubmitted, setDecisionSubmitted] = useState(false);

  // Clickable element inspector state
  const [inspectedElement, setInspectedElement] = useState<'SENDER' | 'SUBDOMAIN' | 'HEADERS' | 'ATTACHMENT' | null>(null);

  // Student Personal Notes
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [newNoteText, setNewNoteText] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`lockphish_notes_${assignment.id || assignment.course_id}`);
      if (stored) setSavedNotes(JSON.parse(stored));
    } catch {}
  }, [assignment]);

  // Parse and normalize modules
  const rawModules = assignment?.modules;
  let modules: any[] = [];
  if (Array.isArray(rawModules)) {
    modules = rawModules;
  } else if (typeof rawModules === 'string') {
    try {
      modules = JSON.parse(rawModules);
    } catch {
      modules = [];
    }
  }

  if (modules.length === 0) {
    modules = [
      {
        title: 'Core Threat Analysis & Attack Mechanics',
        content: assignment?.course_description || 'Understanding the primary social engineering attack vector and defense protocols.'
      }
    ];
  }

  const totalSteps = modules.length;
  const currentModule = modules[Math.min(currentStep, totalSteps - 1)] || modules[0];
  const progress = Math.round(((currentStep + (showAssessment ? 1 : 0)) / Math.max(1, totalSteps + (assignment.assessment_id ? 1 : 0))) * 100);

  const isPreviewMode = !assignment?.id || String(assignment.id).startsWith('preview-');

  const handleSaveNote = () => {
    if (!newNoteText.trim()) return;
    const updated = [...savedNotes, newNoteText.trim()];
    setSavedNotes(updated);
    setNewNoteText('');
    try {
      localStorage.setItem(`lockphish_notes_${assignment.id || assignment.course_id}`, JSON.stringify(updated));
    } catch {}
  };

  const handleNextStep = async () => {
    if (currentStep < totalSteps - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setActiveStoryTab('LECTURE');
      setSelectedDecision(null);
      setDecisionSubmitted(false);
      setInspectedElement(null);

      const newPercent = Math.round(((next) / Math.max(1, totalSteps + (assignment.assessment_id ? 1 : 0))) * 100);
      if (!isPreviewMode && assignment.id) {
        try {
          await api.training.updateProgress(assignment.id, newPercent);
          if (onProgressUpdated) onProgressUpdated();
        } catch (err) {
          console.error('Failed to update training progress:', err);
        }
      }
    } else {
      setShowAssessment(true);
      if (!isPreviewMode && assignment.id) {
        if (!assignment.assessment_id) {
          try {
            await api.training.updateProgress(assignment.id, 100);
            if (onProgressUpdated) onProgressUpdated();
            if (onCompleted) onCompleted();
          } catch (err) {}
        } else {
          try {
            await api.training.updateProgress(assignment.id, 90);
            if (onProgressUpdated) onProgressUpdated();
          } catch (err) {}
        }
      }
    }
  };

  const handlePrevStep = () => {
    if (showAssessment) {
      setShowAssessment(false);
      setActiveStoryTab('SOP');
    } else if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      setActiveStoryTab('LECTURE');
      setSelectedDecision(null);
      setDecisionSubmitted(false);
      setInspectedElement(null);
    }
  };

  const handleJumpToStep = (stepIdx: number) => {
    setShowAssessment(false);
    setCurrentStep(stepIdx);
    setActiveStoryTab('LECTURE');
    setSelectedDecision(null);
    setDecisionSubmitted(false);
    setInspectedElement(null);
  };

  const caseStudy = currentModule?.case_study || {
    headline: 'Real-World Multi-Million Dollar Corporate Phishing Compromise',
    incident_date: 'August 2026',
    financial_loss: '$380,000 USD Escrow Loss',
    summary: 'Adversaries registered a lookalike domain differing by one subtle character from an executive assistant\'s address, requesting an urgent wire routing modification for an active commercial acquisition.',
    vector_used: 'Lookalike Typosquatted Domain + Urgency Pretext',
    why_it_worked: 'The recipient assumed the request was authentic due to the familiar sender name and the active corporate project context without confirming out-of-band.',
    takeaway: 'Always verify unexpected account or credential changes through a secondary, pre-verified communications channel.'
  };

  const sop = currentModule?.defense_sop || {
    step_1: 'STOP & PAUSE: Never click embedded links or disclose credentials under artificial urgency.',
    step_2: 'INSPECT ROOT DOMAIN & OUT-OF-BAND VERIFY: Inspect the actual root domain and verify via official corporate directory numbers.',
    step_3: '1-CLICK SOC REPORT: Immediately report the threat to your Security Operations Center within 60 seconds.'
  };

  const exercise = currentModule?.interactive_exercise;

  // Shared step-tab renderer: used by BOTH the upper and the bottom navigation
  // bars so they always show the identical tab list (N modules + assessment)
  // with identical active state, and clicking either bar stays in sync.
  const renderStepTabs = () => (
    <>
      {modules.map((m: any, idx: number) => {
        const isCurrent = !showAssessment && currentStep === idx;
        const isPassed = !showAssessment ? currentStep > idx : true;

        return (
          <button
            key={idx}
            type="button"
            onClick={() => handleJumpToStep(idx)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
              isCurrent
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400'
                : isPassed
                ? 'bg-slate-900 text-emerald-300 border border-emerald-800/60 hover:bg-slate-800'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
              isCurrent ? 'bg-white text-emerald-800' : isPassed ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
            }`}>
              {isPassed ? '✓' : idx + 1}
            </span>
            <span>{m.title?.length > 26 ? `${m.title.substring(0, 26)}...` : (m.title || `Lesson ${idx + 1}`)}</span>
          </button>
        );
      })}

      {assignment.assessment_id && (
        <button
          type="button"
          onClick={() => setShowAssessment(true)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ml-2 ${
            showAssessment
              ? 'bg-emerald-600 text-white shadow-lg ring-1 ring-emerald-400'
              : 'bg-slate-900 text-amber-400 border border-amber-800/60 hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Scored Final Assessment</span>
        </button>
      )}
    </>
  );

  return (
    <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[720px] font-sans text-slate-100">
      {/* Top Academy Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              LockPhish Masterclass Academy &bull; {assignment.course_category || assignment.category || 'Security Awareness'}
            </span>
            <Badge variant={assignment.course_difficulty?.toLowerCase() || assignment.difficulty?.toLowerCase() || 'low'} size="sm">
              {assignment.course_difficulty || assignment.difficulty || 'Interactive Masterclass'}
            </Badge>
            <span className="text-[9px] font-mono text-slate-500 border border-slate-800 rounded-full px-2 py-0.5">build {__BUILD_ID__}</span>
          </div>
          <h2 className="text-xl font-black text-slate-100 mt-1">{assignment.course_title || assignment.title || 'Security Masterclass'}</h2>
        </div>

        <div className="w-52 space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-slate-400 font-sans font-bold">Curriculum Mastery:</span>
            <span className="text-emerald-400 font-bold">{progress}%</span>
          </div>
          <ProgressBar value={progress} size="sm" variant="emerald" />
        </div>
      </div>

      {/* Interactive Step Navigation Bar (UPPER) */}
      <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
        {renderStepTabs()}
      </div>

      {/* Module Content Body */}
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {showAssessment ? (
          assignment.assessment_id ? (
            <AssessmentRunner
              assessment={{
                id: assignment.assessment_id,
                title: assignment.assessment_title || 'Mastery Assessment',
                passing_score: assignment.passing_score || 80,
                questions: assignment.assessment_questions || []
              }}
              assignmentId={isPreviewMode ? undefined : assignment.id}
              attemptType="POST_TRAINING"
              onCompleted={(res) => {
                if (!isPreviewMode && assignment.id && res?.passed) {
                  api.training.updateProgress(assignment.id, 100).catch(() => {});
                }
                if (onProgressUpdated) onProgressUpdated();
                if (onCompleted) onCompleted();
              }}
              onClose={() => {
                if (onProgressUpdated) onProgressUpdated();
                if (onClose) onClose();
              }}
            />
          ) : (
            <div className="text-center p-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-xl font-black text-slate-100">Course Curriculum 100% Completed!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You have finished all interactive lessons for this training masterclass.
              </p>
              <Button
                variant="primary"
                onClick={async () => {
                  if (!isPreviewMode && assignment.id) {
                    try {
                      await api.training.updateProgress(assignment.id, 100);
                    } catch {}
                  }
                  if (onProgressUpdated) onProgressUpdated();
                  if (onCompleted) onCompleted();
                  if (onClose) onClose();
                }}
              >
                Done & Return to Training Center
              </Button>
            </div>
          )
        ) : (
          /* DEEP MASTERCLASS TEACHING SUITE */
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-1.5 border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  Masterclass Module {currentStep + 1} of {totalSteps}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Step {currentStep + 1}/{totalSteps} &bull; {assignment.duration_minutes || 10} Mins Comprehensive Deep-Dive
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-100 tracking-tight">{currentModule?.title || 'Security Lesson'}</h3>
            </div>

            {/* Mirrored Step Navigation Bar (BOTTOM) — identical tab list & active state as the UPPER bar; clicking either bar keeps both in sync */}
            <div className="bg-slate-950/70 px-3 py-2.5 border border-slate-800 rounded-2xl flex items-center gap-2 overflow-x-auto text-xs">
              {renderStepTabs()}
            </div>

            {/* Lesson Content Views — unnumbered per-module view switcher (NOT step navigation) */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5 whitespace-nowrap">
                Inside This Lesson:
              </span>
              <button
                type="button"
                onClick={() => setActiveStoryTab('LECTURE')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  activeStoryTab === 'LECTURE'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Instructor Masterclass & Real Story</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStoryTab('SIMULATOR_DEMO')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  activeStoryTab === 'SIMULATOR_DEMO'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Interactive Threat Demo Simulator</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStoryTab('DECONSTRUCTION')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  activeStoryTab === 'DECONSTRUCTION'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Element Inspector & Real Guidance Links</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStoryTab('SOP')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  activeStoryTab === 'SOP'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Defense SOP & Runbook</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStoryTab('NOTES')}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  activeStoryTab === 'NOTES'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Personal Notes ({savedNotes.length})</span>
              </button>
            </div>

            {/* ============================================================ */}
            {/* TAB 1: INSTRUCTOR MASTERCLASS LECTURE & REAL-WORLD STORY      */}
            {/* ============================================================ */}
            {activeStoryTab === 'LECTURE' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Visual Architecture Threat Flow Graphic */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-800 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-400" /> Visual Attack Chain & Defense Mechanics
                    </span>
                    <Badge variant={assignment.course_difficulty?.toLowerCase() || 'medium'} size="sm">
                      {assignment.course_difficulty || 'TIER DEFENSE'}
                    </Badge>
                  </div>

                  {/* Visual 4-Stage Flow Diagram */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center font-sans text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-rose-900/60 space-y-1 shadow">
                      <div className="w-7 h-7 rounded-xl bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center mx-auto text-xs font-bold font-mono">1</div>
                      <span className="font-bold text-rose-300 block text-[11px]">Adversary Pretext</span>
                      <span className="text-[10px] text-slate-400 block leading-tight">Crafts urgency lure & spoofs trusted identity</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-900/60 space-y-1 shadow">
                      <div className="w-7 h-7 rounded-xl bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center mx-auto text-xs font-bold font-mono">2</div>
                      <span className="font-bold text-amber-300 block text-[11px]">Deceptive Gateway</span>
                      <span className="text-[10px] text-slate-400 block leading-tight">Deploys fake SSO / AitM session harvester</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-sky-900/60 space-y-1 shadow">
                      <div className="w-7 h-7 rounded-xl bg-sky-950 text-sky-400 border border-sky-800 flex items-center justify-center mx-auto text-xs font-bold font-mono">3</div>
                      <span className="font-bold text-sky-300 block text-[11px]">Employee Action</span>
                      <span className="text-[10px] text-slate-400 block leading-tight">Pauses & verifies root domain out-of-band</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-900/60 space-y-1 shadow">
                      <div className="w-7 h-7 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center mx-auto text-xs font-bold font-mono">4</div>
                      <span className="font-bold text-emerald-300 block text-[11px]">Zero-Trust Defense</span>
                      <span className="text-[10px] text-slate-400 block leading-tight">1-Click SOC Report & Threat Neutralized</span>
                    </div>
                  </div>
                </div>

                {/* Masterclass Teacher Narrative */}
                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 text-slate-200 leading-relaxed font-sans shadow-xl">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
                    <BookOpen className="w-4 h-4" />
                    <span>Instructor Masterclass Lecture (50+ Lines Comprehensive Deep-Dive):</span>
                  </div>

                  <div className="whitespace-pre-line text-sm text-slate-200 leading-relaxed font-sans space-y-3">
                    {getEnrichedMasterclassContent(currentModule, assignment, currentStep)}
                  </div>

                  {/* Real Incident Case Study Box */}
                  <div className="p-5 rounded-2xl bg-slate-900 border-2 border-slate-800 space-y-3 mt-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <span className="font-bold text-slate-100 flex items-center gap-2 text-xs">
                        <Eye className="w-4 h-4 text-amber-400" />
                        <span>Real Breach Case Study: {caseStudy.headline}</span>
                      </span>
                      <span className="text-rose-400 font-mono font-bold text-xs">{caseStudy.financial_loss}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{caseStudy.summary}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-1">
                      <div>Attack Vector: <strong className="text-amber-400">{caseStudy.vector_used}</strong></div>
                      <div>Vulnerability: <strong className="text-rose-400">{caseStudy.why_it_worked}</strong></div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/50 text-xs text-emerald-300 font-sans flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Key Defensive Rule:</strong> {caseStudy.takeaway}</span>
                    </div>
                  </div>
                </div>

                {/* Practical Scenario Decision Question */}
                {exercise && (
                  <div className="p-6 rounded-3xl bg-slate-950 border-2 border-emerald-500/40 space-y-4 shadow-xl">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Practical Security Decision Check: How would you respond?</span>
                    </div>

                    <p className="text-sm font-bold text-slate-100">{exercise.prompt}</p>

                    <div className="space-y-2.5">
                      {exercise.options.map((opt: string, i: number) => {
                        const isSelected = selectedDecision === i;
                        const isCorrect = i === exercise.safe_choice_index;

                        let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                        if (decisionSubmitted) {
                          if (isCorrect) btnStyle = 'bg-emerald-950 border-2 border-emerald-500 text-emerald-200 font-bold shadow-lg';
                          else if (isSelected) btnStyle = 'bg-rose-950 border-2 border-rose-500 text-rose-200';
                        } else if (isSelected) {
                          btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200';
                        }

                        return (
                          <button
                            key={i}
                            disabled={decisionSubmitted}
                            onClick={() => {
                              setSelectedDecision(i);
                              setDecisionSubmitted(true);
                            }}
                            className={`w-full text-left p-3.5 rounded-2xl border text-xs font-medium transition-all flex items-start gap-3 ${btnStyle}`}
                          >
                            <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5 font-bold">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <div className="flex-1">
                              <span>{opt}</span>
                              {decisionSubmitted && isSelected && (
                                <p className="text-[11px] mt-2 pt-2 border-t border-slate-800 font-sans leading-relaxed">
                                  {exercise.explanations[i]}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 2: LIVE INTERACTIVE THREAT DEMO MINI-SIMULATOR           */}
            {/* ============================================================ */}
            {activeStoryTab === 'SIMULATOR_DEMO' && (
              <ModuleSimulationsEngine
                module={currentModule}
                course={assignment}
                stepIndex={currentStep}
              />
            )}

            {/* ============================================================ */}
            {/* TAB 3: ELEMENT INSPECTOR & REAL VERIFIED EXTERNAL GUIDANCE   */}
            {/* ============================================================ */}
            {activeStoryTab === 'DECONSTRUCTION' && (
              <ModuleDeconstructionEngine
                module={currentModule}
                course={assignment}
                stepIndex={currentStep}
              />
            )}

            {/* ============================================================ */}
            {/* TAB 4: DEFENSE SOP & RUNBOOK                                  */}
            {/* ============================================================ */}
            {activeStoryTab === 'SOP' && (
              <ModuleDefenseEngine
                module={currentModule}
                course={assignment}
                stepIndex={currentStep}
              />
            )}

            {/* ============================================================ */}
            {/* TAB 5: STUDENT PERSONAL NOTES                                */}
            {/* ============================================================ */}
            {activeStoryTab === 'NOTES' && (
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-xs space-y-4 font-sans animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Bookmark className="w-4 h-4" />
                    <span>My Personal Security Notes</span>
                  </div>
                  <span className="text-slate-500 font-mono">{savedNotes.length} Notes Saved</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    placeholder="Write a key takeaway or rule to remember (e.g. Always check the root domain)..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                  <Button variant="primary" size="sm" onClick={handleSaveNote}>
                    Save Note
                  </Button>
                </div>

                <div className="space-y-2 pt-2">
                  {savedNotes.length === 0 ? (
                    <p className="text-slate-500 py-4 text-center">No notes saved yet. Add key lessons above.</p>
                  ) : (
                    savedNotes.map((note, i) => (
                      <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-slate-200">
                        <span>&ldquo;{note}&rdquo;</span>
                        <span className="text-[10px] text-slate-500 font-mono">Note #{i + 1}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Bottom Navigation Stepper Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                disabled={currentStep === 0}
                onClick={handlePrevStep}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Previous
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleNextStep}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {currentStep < totalSteps - 1 ? (
                  <span>Next Lesson ({currentStep + 2}/{totalSteps})</span>
                ) : assignment.assessment_id ? (
                  <span>Take Final Assessment</span>
                ) : (
                  <span>Complete Course</span>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
