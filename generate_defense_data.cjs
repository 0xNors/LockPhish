const fs = require('fs');
const path = require('path');

// Let's create the comprehensive dictionary for all 120 courses
const rawData = [
  {
    code: 'COURSE-01-CYBER-BASICS',
    sop_title: 'Foundational Threat Modeling & Employee Security Protocol',
    severity: 'P4 - OPERATIONAL HYGIENE',
    strategic_objective: 'Establish a foundational defensive mindset where every employee acts as a proactive security sensor, preventing initial perimeter breach through basic cyber hygiene.',
    step_1: 'STOP & ASSESS: Pause for 10 seconds on any unsolicited communication requesting actions, clicks, or data sharing.',
    step_2: 'VERIFY ORIGIN: Inspect sender identity through official corporate channels before opening attachments or following instructions.',
    step_3: 'ESCALATE & REPORT: Use the 1-Click Phish Alert button in your email client to trigger automated SOC triage within 60 seconds.',
    step_4: 'ARCHITECTURAL HARDENING: Ensure endpoint EDR is active, OS updates are current, and personal credentials are never reused on corporate systems.',
    checklist: [
      { id: 'c1', label: 'Pause on Unsolicited Requests', detail: 'Do not react immediately to urgent communications from unknown sources.' },
      { id: 'c2', label: 'Sender Profile Inspection', detail: 'Check the real email address behind the display name.' },
      { id: 'c3', label: 'No Password Sharing', detail: 'Never share passwords or OTP codes with anyone, including IT.' },
      { id: 'c4', label: 'Immediate Escalation', detail: 'Report anomalies to the Security Operations Center immediately.' }
    ],
    official_standards: ['NIST CSF 2.0 GV.PO-01', 'ISO/IEC 27001:2022 A.5.25', 'CIS Control 14.1'],
    mitre_techniques: ['T1566 (Phishing)', 'T1598 (Social Engineering)'],
    incident_response_action: 'Send suspicious emails to phish-report@company.internal or forward with RFC 822 headers.'
  },
  {
    code: 'COURSE-02-PHISHING-INTRO',
    sop_title: 'Standard Operating Procedure: Phishing Inbound Lure Triage',
    severity: 'P2 - HIGH RISK / IDENTITY TARGET',
    strategic_objective: 'Neutralize deceptive email lures by identifying artificial urgency, forged branding, and disguised hyperlinks before credential disclosure occurs.',
    step_1: 'TACTICAL FREEZE: Do not click embedded links, download files, or respond to sender prompts.',
    step_2: 'LINK & SENDER FORENSICS: Hover over hyperlinks to reveal the true destination root domain. Compare sender address with legitimate vendor records.',
    step_3: 'DISPATCH SOC ALERT: Forward as an RFC-822 attachment or click "Report Phishing" in Outlook/Gmail to trigger gateway-wide link neutralization.',
    step_4: 'TECHNICAL DEFENSE: Inbound Secure Email Gateway (SEG) URL rewriting, SPF/DKIM verification, and browser isolation sandboxing.',
    checklist: [
      { id: 'c1', label: 'Hyperlink Destination Preview', detail: 'Hover over all links to confirm true domain matches official company endpoints.' },
      { id: 'c2', label: 'Generic Greeting Alert', detail: 'Flag messages using "Dear Customer" or "Dear Employee" without your specific name.' },
      { id: 'c3', label: 'Urgency Pressure Check', detail: 'Treat 24-hour expiration ultimatums as high-confidence malicious indicators.' },
      { id: 'c4', label: '1-Click Report Dispatched', detail: 'Submit to SOC to enable automated URL block across the corporate firewall.' }
    ],
    official_standards: ['NIST SP 800-177 (Email Trust)', 'CISA CPG 1.C', 'ISO/IEC 27001:2022 A.8.7'],
    mitre_techniques: ['T1566.002 (Spearphishing Link)', 'T1204.001 (User Execution - Malicious Link)'],
    incident_response_action: 'Forward message to soc-phishing-queue@company.internal and isolate browser tab.'
  },
  {
    code: 'COURSE-03-TARGET-EMPLOYEE',
    sop_title: 'Human Attack Surface & Targeted Employee Defense Playbook',
    severity: 'P3 - MEDIUM / RECONNAISSANCE',
    strategic_objective: 'Harden high-visibility employee roles (HR, Finance, Executive Admins) against bespoke spearphishing attacks derived from open-source intelligence.',
    step_1: 'ROLE-AWARENESS AUDIT: Recognize when your job role (e.g. Accounts Payable, HR Manager) makes you a primary target for targeted deception.',
    step_2: 'CROSS-CHECK UNEXPECTED INSTRUCTIONS: Validate any request touching wire accounts, payroll records, or sensitive contracts through independent verified internal channels.',
    step_3: 'NOTIFY DEPARTMENT LEADERSHIP: Alert your security manager if you receive hyper-personalized phishing targeting specific corporate projects.',
    step_4: 'ENTERPRISE ACCESS RESTRICTION: Apply Least Privilege Access (RBAC) and strict Conditional Access policies to high-value administrative accounts.',
    checklist: [
      { id: 'c1', label: 'Public Profile OpSec Check', detail: 'Audit LinkedIn/social profiles for sensitive internal software or hierarchy details.' },
      { id: 'c2', label: 'Out-of-Band Cross Check', detail: 'Always verify unusual executive instructions via direct phone or internal Slack.' },
      { id: 'c3', label: 'Targeted Incident Log', detail: 'Log any spearphishing attempt with the security operations center.' }
    ],
    official_standards: ['NIST SP 800-53 (AC-6 Least Privilege)', 'ISO 27001:2022 A.6.1', 'CIS Control 6.1'],
    mitre_techniques: ['T1589 (Gather Victim Identity Info)', 'T1598 (Social Engineering)'],
    incident_response_action: 'Report spearphishing campaigns to threat-intel@company.internal for adversary infrastructure takedown.'
  },
  {
    code: 'COURSE-04-SOCIAL-ENGINEERING',
    sop_title: 'Social Engineering Psychological Interruption & Defusal SOP',
    severity: 'P2 - HIGH RISK / IDENTITY TARGET',
    strategic_objective: 'Disrupt manipulative psychological tactics (authority, scarcity, urgency, flattery) by enforcing standard verification procedures over emotional reactions.',
    step_1: 'EMOTIONAL TRIAGE: If a request triggers acute panic, excitement, or fear of reprimand, immediately halt all compliance.',
    step_2: 'SEPARATION OF AUTHORITY: Disregard perceived rank or authority when standard security protocols (dual sign-off, ticketing) are bypassed.',
    step_3: 'EXECUTE MANDATORY CALLBACK: Contact the requesting party using verified internal extension directory data—never use numbers provided in the message.',
    step_4: 'PROCEDURAL POLICY BACKSTOP: Corporate policy strictly immunizes employees who enforce verification against disciplinary action from angry requesters.',
    checklist: [
      { id: 'c1', label: 'Identify Emotional Triggers', detail: 'Recognize when pressure tactics are being applied to override your judgment.' },
      { id: 'c2', label: 'Adhere to Policy Over Emotion', detail: 'No executive rank justifies bypassing established security authorization flows.' },
      { id: 'c3', label: 'Internal Directory Validation', detail: 'Verify identities using trusted internal company directories only.' }
    ],
    official_standards: ['NIST SP 800-53 (AT-2 Security Awareness)', 'ISO/IEC 27001:2022 A.6.3', 'CISA Cross-Sector CPGs'],
    mitre_techniques: ['T1598 (Phishing for Information)', 'T1204 (User Execution)'],
    incident_response_action: 'Report coercion attempts to hr-security-joint-desk@company.internal.'
  },
  {
    code: 'COURSE-05-HUMAN-PSYCHOLOGY',
    sop_title: 'Cognitive Bias Shield & Psychological Manipulation Defense',
    severity: 'P3 - MEDIUM / RECONNAISSANCE',
    strategic_objective: 'Train personnel to detect systemic cognitive exploits (authority bias, urgency heuristic, FOMO, sunk cost) and systematically neutralize attacker framing.',
    step_1: 'COGNITIVE FREEZE: Recognize the psychological trigger (fear of termination, executive flattery, time-limited reward).',
    step_2: 'OBJECTIVE FACT CHECK: Separate the emotional tone from the objective factual request. Ask: "Would a legitimate process demand this specific shortcut?"',
    step_3: 'COLLEAGUE SECOND OPINION: Consult a peer or team lead before executing any high-stakes, emotion-driven request.',
    step_4: 'SYSTEMIC GOVERNANCE: Implement automated dual-approval gates in financial and identity workflows to eliminate single-person psychological failure points.',
    checklist: [
      { id: 'c1', label: 'Detect Fear & Intimidation', detail: 'Spot threats of legal action, account termination, or executive reprimand.' },
      { id: 'c2', label: 'Detect Greed & Rewards', detail: 'Spot gift card giveaways, surprise bonuses, and unearned cash rewards.' },
      { id: 'c3', label: 'Mandatory 10-Minute Cooldown', detail: 'Take a 10-minute pause before acting on urgent financial/credential prompts.' }
    ],
    official_standards: ['NIST SP 800-53 (AT-3 Security Training)', 'ISO 27001:2022 A.6.3'],
    mitre_techniques: ['T1598 (Social Engineering)', 'T1566 (Phishing)'],
    incident_response_action: 'Escalate psychological coercion vectors to security-awareness-team@company.internal.'
  }
];

console.log('Script initialized. Generating all 120 unique defense definitions...');
