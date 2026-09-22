const fs = require('fs');
const path = require('path');

// Master Defense Registry Builder for all 120 Courses
const generateAllDefenseProfiles = () => {
  const profiles = {};

  const add = (code, title, sop_title, severity, objective, s1, s2, s3, s4, checklist, standards, mitre, action) => {
    profiles[code] = {
      code,
      title,
      sop_title,
      severity,
      strategic_objective: objective,
      step_1: s1,
      step_2: s2,
      step_3: s3,
      step_4: s4,
      checklist,
      official_standards: standards,
      mitre_techniques: mitre,
      incident_response_action: action
    };
  };

  // -------------------------------------------------------------------------
  // TRACK 1: SECURITY FOUNDATIONS (01 - 10)
  // -------------------------------------------------------------------------
  add(
    'COURSE-01-CYBER-BASICS',
    '🛡️ What Is Cybersecurity & How Attackers Operate',
    'Enterprise Cyber Threat Surface & Defensive Hygiene SOP',
    'P4 - OPERATIONAL HYGIENE',
    'Establish foundational organizational cyber resilience by transforming every employee into an active detection sensor against external social engineering and initial access vectors.',
    'TACTICAL HALT: Pause and evaluate any unsolicited communication requesting actions, file downloads, or credential disclosures.',
    'SENDER ORIGIN VALIDATION: Inspect the actual RFC-822 email headers and verified corporate directory before trusting external communications.',
    '1-CLICK INCIDENT ESCALATION: Submit suspicious artifacts via the Phish Alarm button to notify the SOC within 60 seconds.',
    'ARCHITECTURAL HARDENING: Ensure CrowdStrike/Defender EDR agent is healthy, BitLocker encryption is active, and OS patching is up-to-date.',
    [
      { id: 'c1', label: 'Healthy Skepticism', detail: 'Treat unsolicited messages requesting urgent action with initial skepticism.' },
      { id: 'c2', label: 'Identity Directory Cross-Check', detail: 'Cross-reference unknown senders with internal employee registry.' },
      { id: 'c3', label: 'Zero Credential Disclosure', detail: 'Never share passwords, OTP tokens, or badge numbers with any external party.' },
      { id: 'c4', label: 'SOC Alert Dispatch', detail: 'Forward phishing messages to trigger automated firewall link blacklisting.' }
    ],
    ['NIST CSF 2.0 GV.PO-01', 'ISO/IEC 27001:2022 A.5.25', 'CIS Control 14.1 (Security Awareness)'],
    ['T1566 (Phishing)', 'T1598 (Social Engineering)'],
    'Forward message to soc-phishing@company.internal with full original email headers.'
  );

  add(
    'COURSE-02-PHISHING-INTRO',
    '🎣 What Is Phishing? Core Concepts & Attack Mechanics',
    'Standard Operating Procedure: Inbound Email Phishing Triage',
    'P2 - HIGH RISK / IDENTITY TARGET',
    'Deconstruct deceptive email lures by identifying artificial urgency, forged branding, and masked hyperlinks before credential harvesting or malware staging occurs.',
    'TACTICAL FREEZE: Do not click embedded links, download files, or respond to sender prompts.',
    'HYPERLINK & SENDER FORENSICS: Hover over hyperlinks to inspect the true root domain. Compare sender address with legitimate corporate records.',
    'DISPATCH SOC ALERT: Forward as an RFC-822 attachment or click "Report Phishing" in Outlook/Gmail to trigger gateway-wide link neutralization.',
    'TECHNICAL DEFENSE: Inbound Secure Email Gateway (SEG) URL rewriting, SPF/DKIM verification, and browser isolation sandboxing.',
    [
      { id: 'c1', label: 'Hyperlink Destination Preview', detail: 'Hover over all links to confirm true domain matches official company endpoints.' },
      { id: 'c2', label: 'Generic Greeting Alert', detail: 'Flag messages using "Dear Customer" or "Dear Employee" without your specific name.' },
      { id: 'c3', label: 'Urgency Pressure Check', detail: 'Treat 24-hour expiration ultimatums as high-confidence malicious indicators.' },
      { id: 'c4', label: '1-Click Report Dispatched', detail: 'Submit to SOC to enable automated URL block across the corporate firewall.' }
    ],
    ['NIST SP 800-177 (Email Trust)', 'CISA CPG 1.C', 'ISO/IEC 27001:2022 A.8.7'],
    ['T1566.002 (Spearphishing Link)', 'T1204.001 (User Execution - Malicious Link)'],
    'Forward message to soc-phishing-queue@company.internal and isolate browser tab.'
  );

  add(
    'COURSE-03-TARGET-EMPLOYEE',
    '🎯 Why Employees Are Targeted (The Human Attack Surface)',
    'Role-Based Threat Modeling & Targeted Persona Protection SOP',
    'P3 - MEDIUM / RECONNAISSANCE',
    'Harden high-visibility employee roles (HR, Finance, Executive Admins) against bespoke spearphishing attacks derived from open-source intelligence.',
    'ROLE-AWARENESS AUDIT: Recognize when your job role (e.g. Accounts Payable, HR Manager) makes you a primary target for targeted deception.',
    'CROSS-CHECK UNEXPECTED INSTRUCTIONS: Validate any request touching wire accounts, payroll records, or sensitive contracts through independent verified internal channels.',
    'NOTIFY DEPARTMENT LEADERSHIP: Alert your security manager if you receive hyper-personalized phishing targeting specific corporate projects.',
    'ENTERPRISE ACCESS RESTRICTION: Apply Least Privilege Access (RBAC) and strict Conditional Access policies to high-value administrative accounts.',
    [
      { id: 'c1', label: 'Public Profile OpSec Check', detail: 'Audit LinkedIn/social profiles for sensitive internal software or hierarchy details.' },
      { id: 'c2', label: 'Out-of-Band Cross Check', detail: 'Always verify unusual executive instructions via direct phone or internal Slack.' },
      { id: 'c3', label: 'Targeted Incident Log', detail: 'Log any spearphishing attempt with the security operations center.' }
    ],
    ['NIST SP 800-53 (AC-6 Least Privilege)', 'ISO 27001:2022 A.6.1', 'CIS Control 6.1'],
    ['T1589 (Gather Victim Identity Info)', 'T1598 (Social Engineering)'],
    'Report spearphishing campaigns to threat-intel@company.internal for adversary infrastructure takedown.'
  );

  add(
    'COURSE-04-SOCIAL-ENGINEERING',
    '🧠 How Social Engineering Works: Manipulation & Trust',
    'Social Engineering Psychological Interruption & Defusal SOP',
    'P2 - HIGH RISK / IDENTITY TARGET',
    'Disrupt manipulative psychological tactics (authority, scarcity, urgency, flattery) by enforcing standard verification procedures over emotional reactions.',
    'EMOTIONAL TRIAGE: If a request triggers acute panic, excitement, or fear of reprimand, immediately halt all compliance.',
    'SEPARATION OF AUTHORITY: Disregard perceived rank or authority when standard security protocols (dual sign-off, ticketing) are bypassed.',
    'EXECUTE MANDATORY CALLBACK: Contact the requesting party using verified internal extension directory data—never use numbers provided in the message.',
    'PROCEDURAL POLICY BACKSTOP: Corporate policy strictly immunizes employees who enforce verification against disciplinary action from angry requesters.',
    [
      { id: 'c1', label: 'Identify Emotional Triggers', detail: 'Recognize when pressure tactics are being applied to override your judgment.' },
      { id: 'c2', label: 'Adhere to Policy Over Emotion', detail: 'No executive rank justifies bypassing established security authorization flows.' },
      { id: 'c3', label: 'Internal Directory Validation', detail: 'Verify identities using trusted internal company directories only.' }
    ],
    ['NIST SP 800-53 (AT-2 Security Awareness)', 'ISO/IEC 27001:2022 A.6.3', 'CISA Cross-Sector CPGs'],
    ['T1598 (Phishing for Information)', 'T1204 (User Execution)'],
    'Report coercion attempts to hr-security-joint-desk@company.internal.'
  );

  add(
    'COURSE-05-HUMAN-PSYCHOLOGY',
    '🎭 Human Psychology Behind Scams: Fear, Greed & Authority',
    'Cognitive Bias Shield & Emotional De-escalation Protocol',
    'P3 - MEDIUM / RECONNAISSANCE',
    'Train personnel to detect systemic cognitive exploits (authority bias, urgency heuristic, FOMO, sunk cost) and systematically neutralize attacker framing.',
    'COGNITIVE FREEZE: Recognize the psychological trigger (fear of termination, executive flattery, time-limited reward).',
    'OBJECTIVE FACT CHECK: Separate the emotional tone from the objective factual request. Ask: "Would a legitimate process demand this specific shortcut?"',
    'COLLEAGUE SECOND OPINION: Consult a peer or team lead before executing any high-stakes, emotion-driven request.',
    'SYSTEMIC GOVERNANCE: Implement automated dual-approval gates in financial and identity workflows to eliminate single-person psychological failure points.',
    [
      { id: 'c1', label: 'Detect Fear & Intimidation', detail: 'Spot threats of legal action, account termination, or executive reprimand.' },
      { id: 'c2', label: 'Detect Greed & Rewards', detail: 'Spot gift card giveaways, surprise bonuses, and unearned cash rewards.' },
      { id: 'c3', label: 'Mandatory 10-Minute Cooldown', detail: 'Take a 10-minute pause before acting on urgent financial/credential prompts.' }
    ],
    ['NIST SP 800-53 (AT-3 Security Training)', 'ISO 27001:2022 A.6.3'],
    ['T1598 (Social Engineering)', 'T1566 (Phishing)'],
    'Escalate psychological coercion vectors to security-awareness-team@company.internal.'
  );

  add(
    'COURSE-06-CYBER-ATTACK-TYPES',
    '🌐 Common Cyber Attack Types (Phishing, Ransomware & MITM)',
    'Multi-Vector Cyber Threat Classification & Incident Playbook',
    'P2 - HIGH RISK / IDENTITY TARGET',
    'Equip employees to rapidly distinguish between primary threat vectors (credential phishing, ransomware loaders, Adversary-in-the-Middle) and invoke the corresponding containment protocol.',
    'THREAT VECTOR IDENTIFICATION: Categorize the incoming vector (Credential Harvesting Portal, Weaponized Macro File, Man-in-the-Middle Proxy, or Ransomware Dropper).',
    'TACTICAL ISOLATION: For suspect downloads, sever local network connection (disconnect Wi-Fi/Ethernet) to prevent lateral C2 beaconing.',
    'SOC INCIDENT DISPATCH: Open a high-priority ticket with the Security Operations Center detailing attack vector indicators.',
    'ENDPOINT SEGMENTATION: Enforce host micro-segmentation, disable SMBv1, and block lateral RPC movement across workstation subnets.',
    [
      { id: 'c1', label: 'Ransomware Vector Check', detail: 'Never enable macros in Office files or run untrusted executable scripts.' },
      { id: 'c2', label: 'MITM Vector Check', detail: 'Verify browser address bar TLS certificate issuer and exact domain spelling.' },
      { id: 'c3', label: 'Rapid Physical Isolation', detail: 'Unplug Ethernet and disconnect Wi-Fi if a suspicious file is executed.' }
    ],
    ['NIST SP 800-61 Rev 2 (Computer Security Incident Handling)', 'CISA CPG 2.B', 'MITRE ATT&CK Enterprise Matrix'],
    ['T1486 (Data Encrypted for Impact)', 'T1557 (Adversary-in-the-Middle)', 'T1566 (Phishing)'],
    'Run command: powershell -Command "Disable-NetAdapter -Name * -Confirm:$false" if malware is executed.'
  );

  add(
    'COURSE-07-AWARENESS-FUNDAMENTALS',
    '📚 Security Awareness Fundamentals: Defense-in-Depth',
    'Defense-in-Depth Personal Security Framework SOP',
    'P4 - OPERATIONAL HYGIENE',
    'Establish a layered personal security posture across endpoint, email, credentials, and physical workspace to ensure no single failure allows compromise.',
    'LAYERED HYGIENE: Maintain separate complex passphrases, require FIDO2 hardware MFA, and enable automatic screen timeout locks.',
    'SUSPICION THRESHOLD: Apply zero-trust skepticism to inbound communications regardless of whether they arrive via Email, Slack, Teams, or SMS.',
    'CONTINUOUS LEARNING: Complete monthly threat simulation drills and review quarterly SOC threat intelligence bulletins.',
    'ENTERPRISE AUDIT & TELEMETRY: Aggregate endpoint EDR telemetry and mail gateway logs into the central SIEM for proactive threat hunting.',
    [
      { id: 'c1', label: 'Screen Lock Habit', detail: 'Lock screen (Win+L / Cmd+Ctrl+Q) whenever leaving workstation unattended.' },
      { id: 'c2', label: 'Hardware MFA Bound', detail: 'Ensure primary accounts utilize FIDO2 YubiKey or Authenticator Number Matching.' },
      { id: 'c3', label: 'Clean Physical Desk', detail: 'Store paper documents containing PII in locked drawers at close of business.' }
    ],
    ['NIST CSF 2.0 PR.AT-01', 'ISO/IEC 27001:2022 A.7.7', 'CIS Control 14'],
    ['M1017 (User Training)', 'M1036 (Multi-factor Authentication)'],
    'Contact IT helpdesk to audit active sign-in sessions and enrolled MFA hardware tokens.'
  );

  add(
    'COURSE-08-ORGANIZATIONAL-ROLE',
    '🏢 Your Role as a Human Firewall & First Responder',
    'Human Firewall & First-Responder Incident Triage SOP',
    'P3 - MEDIUM / RECONNAISSANCE',
    'Empower front-line personnel to act as first responders, drastically compressing the mean time to detect (MTTD) and mean time to respond (MTTR) across the enterprise.',
    'SENSOR ACTIVATION: Treat every anomalous message, unexpected MFA prompt, or unusual system behavior as an actionable security event.',
    'NO PENALTY DISCLOSURE: Report genuine mistakes (clicking a link or entering credentials) immediately without fear of reprisal—time is critical.',
    'PEER BROADCAST: Alert immediate department colleagues if a widespread organizational phishing wave is hitting inboxes.',
    'RAPID INCIDENT CONTAINMENT: Security automation instantly purges reported malicious emails from all company mailboxes via Microsoft Graph / Google Workspace API.',
    [
      { id: 'c1', label: 'Immediate Self-Reporting', detail: 'Report accidental clicks within 60 seconds to enable rapid session revocation.' },
      { id: 'c2', label: 'Department Triage Alert', detail: 'Notify team members on Slack/Teams about active phishing campaigns.' },
      { id: 'c3', label: 'Preserve Forensic Evidence', detail: 'Do not delete phishing emails before forwarding original RFC headers to the SOC.' }
    ],
    ['NIST SP 800-61 Rev 2 Section 3.2', 'ISO/IEC 27001:2022 A.5.25', 'CISA CPG 1.C'],
    ['M1017 (User Training)', 'D3FEND D3-EDA (Email Domain Analysis)'],
    'Call Enterprise SOC Emergency Hotline: (555) 019-9000 ext 1 or post in #sec-incidents.'
  );

  add(
    'COURSE-09-WHAT-ATTACKERS-WANT',
    '💰 What Attackers Want: Credentials, PII & Money',
    'Critical Asset & Sensitive PII Protection Playbook',
    'P2 - HIGH RISK / IDENTITY TARGET',
    'Safeguard corporate crown jewels (Active Directory credentials, customer PII, trade secrets, financial accounts) against adversary exfiltration.',
    'DATA CLASSIFICATION CHECK: Identify data sensitivity (Public, Internal, Confidential, Restricted) before sharing or transmitting.',
    'ENCRYPTED TRANSMISSION: Never email unencrypted spreadsheets containing Social Security Numbers, banking details, or source code.',
    'REVOKE UNNECESSARY ACCESS: Regularly audit and drop permissions to cloud repositories and database records you no longer actively need.',
    'DATA LOSS PREVENTION (DLP): Automated DLP filters block outbound transmission of unencrypted PII, API tokens, and payment card data.',
    [
      { id: 'c1', label: 'DLP Classification Tagging', detail: 'Apply Sensitivity Labels (e.g. "Restricted - Financial") to all sensitive files.' },
      { id: 'c2', label: 'No Cloud Shadow IT', detail: 'Never upload corporate files to unauthorized personal cloud drives (Dropbox, personal GDrive).' },
      { id: 'c3', label: 'Zero Plaintext Secrets', detail: 'Never store corporate passwords or API keys in unencrypted text files or spreadsheets.' }
    ],
    ['NIST SP 800-122 (Guide to Protecting PII)', 'PCI-DSS v4.0 Req 3', 'HIPAA 45 CFR §164.312'],
    ['T1552 (Unsecured Credentials)', 'T1005 (Data from Local System)', 'T1567 (Exfiltration Over Web Service)'],
    'Notify data-privacy@company.internal if unauthorized PII transfer or database exfiltration occurs.'
  );

  add(
    'COURSE-10-RECOGNIZING-SUSPICIOUS',
    '👁️ Recognizing Suspicious Behavior: The Instinct Test',
    'Threat Indicator Triangulation & Red-Flag Escalation SOP',
    'P3 - MEDIUM / RECONNAISSANCE',
    'Develop advanced threat pattern recognition skills to detect subtle incongruities across sender reputation, message context, and payload signatures.',
    'TRIANGULATE 3 RED FLAGS: Evaluate Sender Domain + Urgency Level + Unusual Call to Action. If 2 or more match, classify as high-confidence threat.',
    'INDEPENDENT REACH-OUT: Contact the supposed sender via an established channel (Slack/phone) to ask: "Did you just send this request?"',
    'SOC PHISH SUBMISSION: Submit the email through the enterprise phishing add-in to trigger automated dynamic detonation in the sandbox.',
    'MAIL GATEWAY ML TUNING: Machine learning models at the mail gateway update sender reputation scoring based on aggregated employee reporting.',
    [
      { id: 'c1', label: 'Sender Address Incongruity', detail: 'Check if sender domain matches the organization they claim to represent.' },
      { id: 'c2', label: 'Unusual Tone / Request', detail: 'Flag requests that deviate from normal business communication patterns.' },
      { id: 'c3', label: 'Coercive Urgency', detail: 'Identify artificial pressure designed to bypass standard approvals.' }
    ],
    ['NIST SP 800-53 AT-2', 'ISO 27001:2022 A.5.25', 'CISA CPG 1.C'],
    ['T1566 (Phishing)', 'T1598 (Social Engineering)'],
    'Submit suspected phishing sample to automated quarantine analyzer at security.internal/submit.'
  );

  console.log('Track 1 defined. Total profiles:', Object.keys(profiles).length);
  return profiles;
};

console.log('Module test ok.');
