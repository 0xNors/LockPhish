import React, { useState } from 'react';
import {
  Inbox,
  Mail,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Globe,
  Lock,
  Eye,
  Info,
  Clock,
  Paperclip,
  Check,
  X,
  Sparkles,
  Award
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface EmailLabScenario {
  id: number;
  category: string;
  isPhishing: boolean;
  from: string;
  replyTo?: string;
  to: string;
  date: string;
  subject: string;
  spfDkim: 'PASS' | 'FAIL' | 'UNVERIFIED';
  bodyHtml: string;
  simulatedUrl: string;
  rootDomain: string;
  redFlags: string[];
  explanation: string;
}

export const emailLabScenarios: EmailLabScenario[] = [
  // Scenario 1: HR Payroll Phishing
  {
    id: 1,
    category: 'HR & Payroll',
    isPhishing: true,
    from: 'HR Department <hr@yourcompany-portal-auth.com>',
    replyTo: 'payroll-audit@fastmail.fm',
    to: 'employees@yourcompany.com',
    date: 'Mon, 11 Nov 2025 09:15:33 -0500',
    subject: '[All Staff] Payroll System Upgrade - Action Required',
    spfDkim: 'FAIL',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1e40af; padding: 16px 20px; color: white;">
          <h2 style="margin: 0; font-size: 16px;">HR Your Company &mdash; Human Resources</h2>
        </div>
        <div style="padding: 24px; background: white; color: #1e293b;">
          <span style="display: inline-block; padding: 4px 10px; background: #eff6ff; color: #1d4ed8; font-weight: bold; font-size: 11px; border-radius: 4px; margin-bottom: 14px;">[All Staff] Action Required by: Friday, Nov 15</span>
          <p>Dear Team,</p>
          <p>Our payroll system is being upgraded this week. To ensure your direct deposits continue without interruption, please verify your banking information by Friday, November 15.</p>
          <p><strong>What you need to do:</strong></p>
          <ol style="padding-left: 20px; line-height: 1.8;">
            <li>Log into the HR Portal at <a href="#verify" style="color: #2563eb; font-weight: bold; text-decoration: underline;">hrportal.yourcompany.com.auth-relay.net/payroll</a></li>
            <li>Confirm your bank account and routing number</li>
            <li>Click "Submit Confirmation"</li>
          </ol>
          <p style="font-size: 11px; color: #94a3b8; margin-top: 20px; border-top: 1px solid #f1f5f9; padding-top: 12px;">This is an automated operational notification sent to all enterprise personnel.</p>
        </div>
      </div>
    `,
    simulatedUrl: 'https://hrportal.yourcompany.com.auth-relay.net/payroll',
    rootDomain: 'auth-relay.net',
    redFlags: [
      'Sender domain uses "yourcompany-portal-auth.com" instead of your real company domain',
      'Reply-To points to an external freemail address (payroll-audit@fastmail.fm)',
      'The destination URL has "auth-relay.net" as the true root domain',
      'Artificial deadline pressure (Friday cutoff) threatening paycheck delays'
    ],
    explanation: 'This is a classic payroll diversion phishing attack. While the display text mimics an internal HR portal, the true destination is controlled by the attacker on "auth-relay.net".'
  },

  // Scenario 2: IT Microsoft 365 Password Expiration
  {
    id: 2,
    category: 'IT Support',
    isPhishing: true,
    from: 'Global IT Support Desk <helpdesk@it-support-microsoft-online.com>',
    replyTo: 'no-reply@security-auth-check.org',
    to: 'user@yourcompany.com',
    date: 'Tue, 12 Nov 2025 11:42:10 -0500',
    subject: 'Action Required: Your Microsoft 365 password expires in 6 hours',
    spfDkim: 'FAIL',
    bodyHtml: `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 580px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0078d4; padding: 18px 24px; color: white;">
          <h2 style="margin: 0; font-size: 18px;">Microsoft 365 Security Notice</h2>
        </div>
        <div style="padding: 24px; background: white; color: #1e293b;">
          <p>Hello Team Member,</p>
          <p>Your corporate password for Microsoft 365 is scheduled to expire today in accordance with company password rotation policies.</p>
          <p>To keep your current password and avoid losing access to Outlook and Teams, verify your credentials now:</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="#keep" style="background-color: #0078d4; color: white; padding: 12px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; display: inline-block;">Keep Current Password / Extend Access</a>
          </div>
          <p style="font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px;">Automated system dispatch &bull; IT Infrastructure Services</p>
        </div>
      </div>
    `,
    simulatedUrl: 'https://login.microsoftonline.security-auth-check.org/oauth2',
    rootDomain: 'security-auth-check.org',
    redFlags: [
      '"Keep current password" is an oxymoron that violates standard password rotation policies',
      'Sender domain is "it-support-microsoft-online.com" rather than the authentic enterprise tenant',
      'Hovering reveals the destination root domain is "security-auth-check.org"',
      'SPF authentication header fails'
    ],
    explanation: 'Attackers frequently promise that you can "keep your current password" as an appealing shortcut to harvest Single Sign-On credentials.'
  },

  // Scenario 3: Weaponized Macro Excel Invoice
  {
    id: 3,
    category: 'Finance & Invoices',
    isPhishing: true,
    from: 'Apex Supplies Accounting <billing@apex-supplies-vendor-invoicing.net>',
    replyTo: 'accounts@apex-supplies-vendor-invoicing.net',
    to: 'accounts-payable@yourcompany.com',
    date: 'Wed, 13 Nov 2025 14:02:18 -0500',
    subject: 'OVERDUE: Invoice #INV-88391 Statement & Payment Reminder (.xlsm attached)',
    spfDkim: 'UNVERIFIED',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #064e3b; padding: 16px 20px; color: white;">
          <h2 style="margin: 0; font-size: 16px;">Apex Industrial Supplies &mdash; Billing Department</h2>
        </div>
        <div style="padding: 24px; background: white; color: #1e293b;">
          <p>Dear Accounts Payable,</p>
          <p>Please find attached the past-due invoice statement <strong>#INV-88391</strong> for $14,250.00.</p>
          <div style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 14px; border-radius: 6px; margin: 16px 0; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <strong>📎 Invoice_INV88391_Statement.xlsm</strong>
              <div style="font-size: 11px; color: #64748b;">Excel Macro-Enabled Spreadsheet &bull; 194 KB</div>
            </div>
            <a href="#macro" style="background: #059669; color: white; padding: 8px 16px; border-radius: 4px; font-size: 12px; font-weight: bold; text-decoration: none;">Download File</a>
          </div>
          <p style="font-size: 12px; color: #dc2626;">Notice: Please ensure you click "Enable Editing" and "Enable Macros" to decrypt the billing formulas.</p>
        </div>
      </div>
    `,
    simulatedUrl: 'https://secure-vault-download.apex-supplies-vendor-invoicing.net/invoice.xlsm',
    rootDomain: 'apex-supplies-vendor-invoicing.net',
    redFlags: [
      'Attachment uses dangerous macro-enabled extension (.xlsm)',
      'Explicit instructions to click "Enable Macros" to view content',
      'Unrecognized vendor domain sending urgent past-due notices'
    ],
    explanation: 'Legitimate business invoices are distributed as standard PDF files. Requiring macros to "decrypt" content is a hallmark of malware droppers.'
  },

  // Scenario 4: Legitimate Internal All-Hands Meeting
  {
    id: 4,
    category: 'Internal Communications',
    isPhishing: false,
    from: 'Executive Communications <internal-communications@yourcompany.com>',
    replyTo: 'internal-communications@yourcompany.com',
    to: 'all-staff@yourcompany.com',
    date: 'Thu, 14 Nov 2025 08:30:00 -0500',
    subject: 'All-Hands Meeting Tomorrow at 10:00 AM EST (Agenda & Live Stream)',
    spfDkim: 'PASS',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 18px 24px; color: white;">
          <h2 style="margin: 0; font-size: 16px;">Corporate Executive Office</h2>
        </div>
        <div style="padding: 24px; background: white; color: #1e293b;">
          <p>Hi everyone,</p>
          <p>Join us tomorrow at 10:00 AM EST for our monthly company all-hands meeting. Leadership will share quarterly performance milestones and product roadmap updates.</p>
          <p><strong>Meeting Details:</strong></p>
          <ul style="padding-left: 20px; line-height: 1.8;">
            <li>Date: Friday, November 15</li>
            <li>Time: 10:00 AM &ndash; 11:00 AM EST</li>
            <li>Stream Link: <a href="#teams" style="color: #2563eb; text-decoration: underline;">https://teams.microsoft.com/l/meetup-join/yourcompany</a></li>
          </ul>
          <p style="font-size: 12px; color: #64748b;">No action is required if you have already accepted the calendar invitation.</p>
        </div>
      </div>
    `,
    simulatedUrl: 'https://teams.microsoft.com/l/meetup-join/yourcompany',
    rootDomain: 'microsoft.com',
    redFlags: [],
    explanation: 'This is a LEGITIMATE email. The sender is verified from the authentic company domain, SPF/DKIM headers pass, the link points directly to the authentic Microsoft Teams domain, and there is no credential solicitation or pressure.'
  },

  // Scenario 5: DocuSign Strategic Acquisition NDA
  {
    id: 5,
    category: 'Legal & DocuSign',
    isPhishing: true,
    from: 'DocuSign Signature Service <dse@docusign-corporate-verify-gateway.com>',
    replyTo: 'legal-advisory@fastmail.fm',
    to: 'user@yourcompany.com',
    date: 'Thu, 14 Nov 2025 15:10:45 -0500',
    subject: 'Please DocuSign: 2026 Strategic Acquisition Non-Disclosure Agreement #NDA-99218',
    spfDkim: 'FAIL',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #263238; padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0; font-size: 20px; font-weight: bold;">DocuSign</h2>
        </div>
        <div style="padding: 28px; background: white; color: #1e293b;">
          <p style="font-size: 15px;"><strong>Legal Counsel</strong> sent you a document to review and sign.</p>
          <div style="background: #f8fafc; border-left: 4px solid #f59e0b; padding: 14px; margin: 18px 0; font-size: 13px;">
            <strong>Document:</strong> Strategic Partnership & Non-Disclosure Agreement<br/>
            <strong>Requested of:</strong> Corporate Team Member
          </div>
          <div style="text-align: center; margin: 28px 0;">
            <a href="#docusign" style="background-color: #ffc820; color: #263238; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 15px; display: inline-block;">REVIEW DOCUMENT</a>
          </div>
          <p style="font-size: 12px; color: #64748b;">This message was intended for your account. If not intended signer, report to IT Security.</p>
        </div>
      </div>
    `,
    simulatedUrl: 'https://docusign.security-review-auth.org/sign/v4',
    rootDomain: 'security-review-auth.org',
    redFlags: [
      'Sender domain is "docusign-corporate-verify-gateway.com" instead of verified "@docusign.net"',
      'Reply-To redirects to an external freemail mailbox',
      'The destination link root domain is "security-review-auth.org"',
      'Unsolicited M&A contract without prior internal notification'
    ],
    explanation: 'Attackers clone DocuSign branding to trick users into clicking buttons that load Microsoft SSO harvesting reverse proxies.'
  },

  // Scenario 6: Legitimate GitHub Notification
  {
    id: 6,
    category: 'Developer & DevOps',
    isPhishing: false,
    from: 'GitHub <notifications@github.com>',
    replyTo: 'noreply@github.com',
    to: 'developer@yourcompany.com',
    date: 'Fri, 15 Nov 2025 09:00:12 -0500',
    subject: '[GitHub] Weekly digest for yourcompany/core-infrastructure',
    spfDkim: 'PASS',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #24292e; padding: 16px 20px; color: white;">
          <h2 style="margin: 0; font-size: 16px;">GitHub Enterprise</h2>
        </div>
        <div style="padding: 24px; background: white; color: #1e293b;">
          <p>Here is your weekly summary for <strong>yourcompany/core-infrastructure</strong>:</p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 6px; margin: 16px 0; font-size: 13px;">
            &bull; 14 Pull Requests merged<br/>
            &bull; 3 Issues closed<br/>
            &bull; 0 Open Dependabot security alerts
          </div>
          <p><a href="#github" style="color: #0969da; text-decoration: underline;">View repository on GitHub</a></p>
        </div>
      </div>
    `,
    simulatedUrl: 'https://github.com/yourcompany/core-infrastructure',
    rootDomain: 'github.com',
    redFlags: [],
    explanation: 'This is a LEGITIMATE email. It originates from verified "@github.com" mail servers with passing SPF/DKIM authentication and points directly to the authentic github.com repository.'
  },

  // Scenario 7: Courier Fee Smishing / Phishing
  {
    id: 7,
    category: 'Logistics & Delivery',
    isPhishing: true,
    from: 'FedEx Express Freight <clearance@fedex-express-customs-invoicing.net>',
    replyTo: 'customs-help@fastmail.fm',
    to: 'user@yourcompany.com',
    date: 'Fri, 15 Nov 2025 11:20:00 -0500',
    subject: 'Delivery Exception: Shipment #FDX-8849-01 Held at Port of Entry (Duty Unpaid)',
    spfDkim: 'FAIL',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4d148c; padding: 18px 24px; color: white;">
          <h2 style="margin: 0; font-size: 18px;">FedEx Express Freight Services</h2>
        </div>
        <div style="padding: 24px; background: white; color: #1e293b;">
          <p>Dear Customer,</p>
          <p>An international cargo package addressed to your organization is held at JFK International Airport.</p>
          <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px; margin: 16px 0; font-size: 13px;">
            <strong>Customs Fee:</strong> $1.85 USD<br/>
            <strong>Tracking ID:</strong> #FDX-8849-01
          </div>
          <div style="text-align: center; margin: 24px 0;">
            <a href="#fedex" style="background-color: #ff6200; color: white; padding: 12px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; display: inline-block;">Pay $1.85 Customs Duty Online</a>
          </div>
          <p style="font-size: 11px; color: #94a3b8;">Package will be returned to sender if fee is not cleared in 24 hours.</p>
        </div>
      </div>
    `,
    simulatedUrl: 'https://fedex-customs-clearance-auth.net/pay',
    rootDomain: 'fedex-customs-clearance-auth.net',
    redFlags: [
      'Sender uses lookalike domain "fedex-express-customs-invoicing.net" instead of fedex.com',
      'Micro-fee trap ($1.85) designed to harvest credit card numbers and CVVs',
      'Urgency deadline threatening parcel return'
    ],
    explanation: 'Delivery fee scams trick victims into entering credit card numbers on fake courier portals under the guise of paying a tiny redelivery or customs fee.'
  },

  // Scenario 8: Malicious Google OAuth App Permissions
  {
    id: 8,
    category: 'Cloud Identity & OAuth',
    isPhishing: true,
    from: 'Google Workspace Accounts <no-reply@google-auth-workspace-apps.net>',
    replyTo: 'no-reply@google-auth-workspace-apps.net',
    to: 'user@yourcompany.com',
    date: 'Mon, 18 Nov 2025 08:45:10 -0500',
    subject: 'Security Alert: "AI Productivity Suite" requested access to your Google Workspace Account',
    spfDkim: 'FAIL',
    bodyHtml: `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 580px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1a73e8; padding: 18px 24px; color: white;">
          <h2 style="margin: 0; font-size: 18px;">Google Workspace Security Review</h2>
        </div>
        <div style="padding: 24px; background: white; color: #1e293b;">
          <p>Hi Team Member,</p>
          <p>An enterprise application <strong>"AI Productivity Pro"</strong> has requested access to read, compose, and delete emails for your corporate Google account.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="#oauth" style="background-color: #1a73e8; color: white; padding: 12px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; display: inline-block;">Review & Authorize Permissions</a>
          </div>
          <p style="font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px;">Google Workspace Security &bull; Account Protection Team</p>
        </div>
      </div>
    `,
    simulatedUrl: 'https://accounts.google.com-oauth2-consent.net/auth',
    rootDomain: 'google.com-oauth2-consent.net',
    redFlags: [
      'Illicit OAuth consent grant seeking excessive email delete/read permissions',
      'The domain is "google.com-oauth2-consent.net" (combosquatting)',
      'Unverified external application'
    ],
    explanation: 'Illicit consent grants trick users into authorizing third-party OAuth apps that steal mailbox contents without needing password credentials.'
  },

  // Scenario 9: Authentic Company Intranet Benefits Reminder
  {
    id: 9,
    category: 'Internal Benefits',
    isPhishing: false,
    from: 'Benefits Department <benefits@yourcompany.com>',
    replyTo: 'benefits@yourcompany.com',
    to: 'staff@yourcompany.com',
    date: 'Mon, 18 Nov 2025 10:15:00 -0500',
    subject: 'Reminder: 2026 Digital Health Insurance Cards Available on Intranet',
    spfDkim: 'PASS',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #059669; padding: 16px 20px; color: white;">
          <h2 style="margin: 0; font-size: 16px;">Corporate Benefits & Wellness</h2>
        </div>
        <div style="padding: 24px; background: white; color: #1e293b;">
          <p>Hi Team,</p>
          <p>Your updated 2026 digital medical and dental insurance cards are now accessible for download on the corporate intranet portal.</p>
          <p>To view your cards, log into <a href="#intranet" style="color: #059669; font-weight: bold; text-decoration: underline;">https://intranet.yourcompany.com/benefits</a>.</p>
          <p style="font-size: 12px; color: #64748b;">Reach out to the benefits team if you have any questions regarding your coverage.</p>
        </div>
      </div>
    `,
    simulatedUrl: 'https://intranet.yourcompany.com/benefits',
    rootDomain: 'yourcompany.com',
    redFlags: [],
    explanation: 'This is a LEGITIMATE email. The sender is verified from the authentic company domain, headers pass, and the link points to the authentic internal company intranet.'
  },

  // Scenario 10: QR Code Quishing Microsoft MFA
  {
    id: 10,
    category: 'QR Quishing',
    isPhishing: true,
    from: 'Microsoft 365 Security <security-sync@microsoft-identity-auth-portal.com>',
    replyTo: 'support@mfa-qr-sync.net',
    to: 'user@yourcompany.com',
    date: 'Tue, 19 Nov 2025 13:30:20 -0500',
    subject: 'Action Required: Scan your dedicated QR Code to synchronize Microsoft Authenticator',
    spfDkim: 'FAIL',
    bodyHtml: `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 580px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0078d4; padding: 18px 24px; color: white;">
          <h2 style="margin: 0; font-size: 18px;">Microsoft 365 Identity Security</h2>
        </div>
        <div style="padding: 24px; background: white; color: #1e293b;">
          <p>In accordance with updated zero-trust compliance, your multi-factor authentication (MFA) token requires renewal.</p>
          <div style="background: #f8fafc; border: 1px dashed #cbd5e1; padding: 20px; text-align: center; margin: 18px 0; border-radius: 8px;">
            <p style="font-size: 12px; font-weight: bold; color: #475569; margin-bottom: 12px;">Scan with your mobile camera to authenticate:</p>
            <div style="display: inline-block; padding: 10px; background: white; border: 2px solid #0078d4; border-radius: 6px;">
              <svg width="120" height="120" viewBox="0 0 100 100" fill="#0f172a">
                <rect x="5" y="5" width="30" height="30" fill="none" stroke="#0f172a" stroke-width="6"/>
                <rect x="13" y="13" width="14" height="14" fill="#0f172a"/>
                <rect x="65" y="5" width="30" height="30" fill="none" stroke="#0f172a" stroke-width="6"/>
                <rect x="73" y="13" width="14" height="14" fill="#0f172a"/>
                <rect x="5" y="65" width="30" height="30" fill="none" stroke="#0f172a" stroke-width="6"/>
                <rect x="13" y="73" width="14" height="14" fill="#0f172a"/>
                <rect x="45" y="15" width="10" height="20" fill="#0f172a"/>
                <rect x="45" y="45" width="20" height="10" fill="#0f172a"/>
                <rect x="65" y="65" width="15" height="15" fill="#0f172a"/>
              </svg>
            </div>
            <p style="font-size: 11px; color: #64748b; margin-top: 10px;">Or click <a href="#qr" style="color: #0078d4; font-weight: bold;">here to open MFA portal manually</a></p>
          </div>
          <p style="font-size: 11px; color: #94a3b8;">Security Notice: QR code expires in 4 hours.</p>
        </div>
      </div>
    `,
    simulatedUrl: 'https://login.microsoftonline.security-mfa-sync.net/qr',
    rootDomain: 'security-mfa-sync.net',
    redFlags: [
      'QR code in email designed to shift the user to an unmonitored personal mobile phone',
      'Sender uses lookalike domain "microsoft-identity-auth-portal.com"',
      'URL root domain is "security-mfa-sync.net"'
    ],
    explanation: 'Quishing attacks embed phishing URLs inside QR graphics to bypass email spam filters and shift victims to mobile devices.'
  }
];

interface EmailPhishingLabProps {
  onClose?: () => void;
}

export const EmailPhishingLab: React.FC<EmailPhishingLabProps> = ({ onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({}); // scenarioId -> true for phishing, false for legit
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);

  const scenario = emailLabScenarios[currentIdx];
  const totalScenarios = emailLabScenarios.length;
  const isAnswered = answers[scenario.id] !== undefined;
  const userAnswer = answers[scenario.id];
  const isCorrect = isAnswered && userAnswer === scenario.isPhishing;

  const handleDecision = (userSelectedPhishing: boolean) => {
    setAnswers(prev => ({ ...prev, [scenario.id]: userSelectedPhishing }));
    setShowFeedback(prev => ({ ...prev, [scenario.id]: true }));
  };

  const handleNext = () => {
    if (currentIdx < totalScenarios - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      // Calculate final score
      let correct = 0;
      emailLabScenarios.forEach(s => {
        if (answers[s.id] === s.isPhishing) correct++;
      });
      setScore({ correct, total: totalScenarios });
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setAnswers({});
    setShowFeedback({});
    setScore(null);
  };

  return (
    <div className="max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-sans text-slate-100 min-h-[720px]">
      {/* Top Header Bar */}
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-100">Email Phishing Threat Lab</h2>
            <p className="text-xs text-slate-400">Analyze real-world email headers, senders, links, and attachments</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-400 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800">
            Scenario {currentIdx + 1} of {totalScenarios}
          </span>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Exit Lab
            </Button>
          )}
        </div>
      </div>

      {score ? (
        /* FINAL SCORE & LAB COMPLETION SCREEN */
        <div className="p-10 text-center space-y-6 my-auto">
          <div className="w-20 h-20 rounded-full bg-emerald-950/90 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-2xl">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-100">Email Threat Lab Complete!</h3>
            <p className="text-xs text-slate-400">Here is your threat detection accuracy breakdown:</p>
          </div>

          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 max-w-md mx-auto grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
              <span className="text-2xl font-black text-emerald-400">{Math.round((score.correct / score.total) * 100)}%</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
              <span className="text-2xl font-black text-slate-100">{score.correct} / {score.total} Correct</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <Button variant="outline" icon={<RotateCcw className="w-4 h-4" />} onClick={handleRestart}>
              Restart Lab
            </Button>
            {onClose && (
              <Button variant="primary" onClick={onClose}>
                Return to Academy
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* ACTIVE SCENARIO LAB SLIDE */
        <div className="flex-1 flex flex-col justify-between p-6 space-y-6">
          {/* Email Container Window (Matching justforphishing.com/email-lab.html) */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            {/* Category Blue Header Bar */}
            <div className="bg-[#1d4ed8] px-5 py-2.5 text-white font-bold text-xs flex items-center justify-between">
              <span>{scenario.category}</span>
              <span className="font-mono text-[11px] opacity-80">Scenario #{scenario.id}</span>
            </div>

            {/* Email Metadata Headers Table */}
            <div className="p-4 bg-slate-950/90 border-b border-slate-800 text-xs font-mono space-y-1.5">
              <div className="flex items-start">
                <span className="w-20 text-slate-500 shrink-0 font-bold">From:</span>
                <span className="text-slate-200 truncate">{scenario.from}</span>
              </div>
              {scenario.replyTo && (
                <div className="flex items-start">
                  <span className="w-20 text-slate-500 shrink-0 font-bold">Reply-To:</span>
                  <span className="text-amber-400 truncate">{scenario.replyTo}</span>
                </div>
              )}
              <div className="flex items-start">
                <span className="w-20 text-slate-500 shrink-0 font-bold">To:</span>
                <span className="text-slate-300 truncate">{scenario.to}</span>
              </div>
              <div className="flex items-start">
                <span className="w-20 text-slate-500 shrink-0 font-bold">Date:</span>
                <span className="text-slate-400">{scenario.date}</span>
              </div>
              <div className="flex items-start">
                <span className="w-20 text-slate-500 shrink-0 font-bold">Subject:</span>
                <span className="text-slate-100 font-bold truncate">{scenario.subject}</span>
              </div>
            </div>

            {/* Rendered HTML Email Body */}
            <div className="p-6 bg-white overflow-x-auto text-slate-900">
              <div dangerouslySetInnerHTML={{ __html: scenario.bodyHtml }} />
            </div>
          </div>

          {/* Interactive Decision Action Bar (Matching justforphishing.com) */}
          {!isAnswered ? (
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl text-center space-y-4">
              <h4 className="text-sm font-bold text-slate-100">Is this email legitimate or phishing?</h4>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleDecision(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border-2 border-rose-600 font-bold text-xs transition-all active:scale-95 shadow-lg shadow-rose-950/40"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>🚫 Phishing</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision(false)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-2 border-emerald-600 font-bold text-xs transition-all active:scale-95 shadow-lg shadow-emerald-950/40"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>✅ Legitimate</span>
                </button>
              </div>
            </div>
          ) : (
            /* Educational Instant Feedback & Red Flags */
            <div className={`p-5 rounded-2xl border space-y-3.5 animate-fadeIn ${
              isCorrect ? 'bg-emerald-950/50 border-emerald-600' : 'bg-rose-950/50 border-rose-600'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <h4 className={`text-sm font-bold ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {isCorrect
                      ? `Correct! This email is ${scenario.isPhishing ? 'Phishing' : 'Legitimate'}.`
                      : `Incorrect. This email is actually ${scenario.isPhishing ? 'Phishing' : 'Legitimate'}.`}
                  </h4>
                </div>
                <Badge variant={scenario.isPhishing ? 'critical' : 'low'} size="sm">
                  {scenario.isPhishing ? 'PHISHING ATTACK' : 'AUTHENTIC EMAIL'}
                </Badge>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans">{scenario.explanation}</p>

              {scenario.redFlags.length > 0 && (
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1 font-sans">
                  <strong className="text-amber-400 block mb-1 text-[11px] uppercase">Concealed Red Flags in this Scenario:</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                    {scenario.redFlags.map((rf, i) => (
                      <li key={i}>{rf}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIdx === 0}
              onClick={handlePrev}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            <Button
              variant="primary"
              size="sm"
              disabled={!isAnswered}
              onClick={handleNext}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {currentIdx < totalScenarios - 1 ? 'Next Scenario' : 'View Final Score'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
