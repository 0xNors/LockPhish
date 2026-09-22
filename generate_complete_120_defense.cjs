const fs = require('fs');
const path = require('path');

// Let's create the master generator for all 120 unique courses
const generateAll120Courses = () => {
  const list = [
    // --- TRACK 1: FOUNDATION (1 - 10) ---
    {
      code: 'COURSE-01-CYBER-BASICS',
      title: '🛡️ What Is Cybersecurity & How Attackers Operate',
      sop_title: 'Enterprise Cyber Threat Surface & Defensive Hygiene SOP',
      severity: 'P4 - OPERATIONAL HYGIENE',
      strategic_objective: 'Establish fundamental organizational cyber resilience by transforming every employee into an active detection sensor against external social engineering and initial access vectors.',
      step_1: 'TACTICAL HALT: Pause and evaluate any unsolicited communication requesting actions, file downloads, or credential disclosures.',
      step_2: 'SENDER ORIGIN VALIDATION: Inspect the actual RFC-822 email headers and verified corporate directory before trusting external communications.',
      step_3: '1-CLICK INCIDENT ESCALATION: Submit suspicious artifacts via the Phish Alarm button to notify the SOC within 60 seconds.',
      step_4: 'ARCHITECTURAL HARDENING: Ensure CrowdStrike/Defender EDR agent is healthy, BitLocker encryption is active, and OS patching is up-to-date.',
      checklist: [
        { id: 'c1', label: 'Healthy Skepticism', detail: 'Treat unsolicited messages requesting urgent action with initial skepticism.' },
        { id: 'c2', label: 'Identity Directory Cross-Check', detail: 'Cross-reference unknown senders with internal employee registry.' },
        { id: 'c3', label: 'Zero Credential Disclosure', detail: 'Never share passwords, OTP tokens, or badge numbers with any external party.' },
        { id: 'c4', label: 'SOC Alert Dispatch', detail: 'Forward phishing messages to trigger automated firewall link blacklisting.' }
      ],
      official_standards: ['NIST CSF 2.0 GV.PO-01', 'ISO/IEC 27001:2022 A.5.25', 'CIS Control 14.1 (Security Awareness)'],
      mitre_techniques: ['T1566 (Phishing)', 'T1598 (Social Engineering)'],
      incident_response_action: 'Forward message to soc-phishing@company.internal with full original email headers.'
    },
    {
      code: 'COURSE-02-PHISHING-INTRO',
      title: '🎣 What Is Phishing? Core Concepts & Attack Mechanics',
      sop_title: 'Standard Operating Procedure: Inbound Email Phishing Triage',
      severity: 'P2 - HIGH RISK / IDENTITY TARGET',
      strategic_objective: 'Deconstruct deceptive email lures by identifying artificial urgency, forged branding, and masked hyperlinks before credential harvesting or malware staging occurs.',
      step_1: 'TACTICAL FREEZE: Do not click embedded links, download files, or respond to sender prompts.',
      step_2: 'HYPERLINK & SENDER FORENSICS: Hover over hyperlinks to inspect the true root domain. Compare sender address with legitimate corporate records.',
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
      title: '🎯 Why Employees Are Targeted (The Human Attack Surface)',
      sop_title: 'Role-Based Threat Modeling & Targeted Persona Protection SOP',
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
      title: '🧠 How Social Engineering Works: Manipulation & Trust',
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
      title: '🎭 Human Psychology Behind Scams: Fear, Greed & Authority',
      sop_title: 'Cognitive Bias Shield & Emotional De-escalation Protocol',
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
    },
    {
      code: 'COURSE-06-CYBER-ATTACK-TYPES',
      title: '🌐 Common Cyber Attack Types (Phishing, Ransomware & MITM)',
      sop_title: 'Multi-Vector Cyber Threat Classification & Incident Playbook',
      severity: 'P2 - HIGH RISK / IDENTITY TARGET',
      strategic_objective: 'Equip employees to rapidly distinguish between primary threat vectors (credential phishing, ransomware loaders, Adversary-in-the-Middle) and invoke the corresponding containment protocol.',
      step_1: 'THREAT VECTOR IDENTIFICATION: Categorize the incoming vector (Credential Harvesting Portal, Weaponized Macro File, Man-in-the-Middle Proxy, or Ransomware Dropper).',
      step_2: 'TACTICAL ISOLATION: For suspect downloads, sever local network connection (disconnect Wi-Fi/Ethernet) to prevent lateral C2 beaconing.',
      step_3: 'SOC INCIDENT DISPATCH: Open a high-priority ticket with the Security Operations Center detailing attack vector indicators.',
      step_4: 'ENDPOINT SEGMENTATION: Enforce host micro-segmentation, disable SMBv1, and block lateral RPC movement across workstation subnets.',
      checklist: [
        { id: 'c1', label: 'Ransomware Vector Check', detail: 'Never enable macros in Office files or run untrusted executable scripts.' },
        { id: 'c2', label: 'MITM Vector Check', detail: 'Verify browser address bar TLS certificate issuer and exact domain spelling.' },
        { id: 'c3', label: 'Rapid Physical Isolation', detail: 'Unplug Ethernet and disconnect Wi-Fi if a suspicious file is executed.' }
      ],
      official_standards: ['NIST SP 800-61 Rev 2 (Computer Security Incident Handling)', 'CISA CPG 2.B', 'MITRE ATT&CK Enterprise Matrix'],
      mitre_techniques: ['T1486 (Data Encrypted for Impact)', 'T1557 (Adversary-in-the-Middle)', 'T1566 (Phishing)'],
      incident_response_action: 'Run command: `powershell -Command "Disable-NetAdapter -Name * -Confirm:$false"` if malware is executed.'
    },
    {
      code: 'COURSE-07-AWARENESS-FUNDAMENTALS',
      title: '📚 Security Awareness Fundamentals: Defense-in-Depth',
      sop_title: 'Defense-in-Depth Personal Security Framework SOP',
      severity: 'P4 - OPERATIONAL HYGIENE',
      strategic_objective: 'Establish a layered personal security posture across endpoint, email, credentials, and physical workspace to ensure no single failure allows compromise.',
      step_1: 'LAYERED HYGIENE: Maintain separate complex passphrases, require FIDO2 hardware MFA, and enable automatic screen timeout locks.',
      step_2: 'SUSPICION THRESHOLD: Apply zero-trust skepticism to inbound communications regardless of whether they arrive via Email, Slack, Teams, or SMS.',
      step_3: 'CONTINUOUS LEARNING: Complete monthly threat simulation drills and review quarterly SOC threat intelligence bulletins.',
      step_4: 'ENTERPRISE AUDIT & TELEMETRY: Aggregate endpoint EDR telemetry and mail gateway logs into the central SIEM for proactive threat hunting.',
      checklist: [
        { id: 'c1', label: 'Screen Lock Habit', detail: 'Lock screen (Win+L / Cmd+Ctrl+Q) whenever leaving workstation unattended.' },
        { id: 'c2', label: 'Hardware MFA Bound', detail: 'Ensure primary accounts utilize FIDO2 YubiKey or Authenticator Number Matching.' },
        { id: 'c3', label: 'Clean Physical Desk', detail: 'Store paper documents containing PII in locked drawers at close of business.' }
      ],
      official_standards: ['NIST CSF 2.0 PR.AT-01', 'ISO/IEC 27001:2022 A.7.7', 'CIS Control 14'],
      mitre_techniques: ['M1017 (User Training)', 'M1036 (Multi-factor Authentication)'],
      incident_response_action: 'Contact IT helpdesk to audit active sign-in sessions and enrolled MFA hardware tokens.'
    },
    {
      code: 'COURSE-08-ORGANIZATIONAL-ROLE',
      title: '🏢 Your Role as a Human Firewall & First Responder',
      sop_title: 'Human Firewall & First-Responder Incident Triage SOP',
      severity: 'P3 - MEDIUM / RECONNAISSANCE',
      strategic_objective: 'Empower front-line personnel to act as first responders, drastically compressing the mean time to detect (MTTD) and mean time to respond (MTTR) across the enterprise.',
      step_1: 'SENSOR ACTIVATION: Treat every anomalous message, unexpected MFA prompt, or unusual system behavior as an actionable security event.',
      step_2: 'NO PENALTY DISCLOSURE: Report genuine mistakes (clicking a link or entering credentials) immediately without fear of reprisal—time is critical.',
      step_3: 'PEER BROADCAST: Alert immediate department colleagues if a widespread organizational phishing wave is hitting inboxes.',
      step_4: 'RAPID INCIDENT CONTAINMENT: Security automation instantly purges reported malicious emails from all company mailboxes via Microsoft Graph / Google Workspace API.',
      checklist: [
        { id: 'c1', label: 'Immediate Self-Reporting', detail: 'Report accidental clicks within 60 seconds to enable rapid session revocation.' },
        { id: 'c2', label: 'Department Triage Alert', detail: 'Notify team members on Slack/Teams about active phishing campaigns.' },
        { id: 'c3', label: 'Preserve Forensic Evidence', detail: 'Do not delete phishing emails before forwarding original RFC headers to the SOC.' }
      ],
      official_standards: ['NIST SP 800-61 Rev 2 Section 3.2', 'ISO/IEC 27001:2022 A.5.25', 'CISA CPG 1.C'],
      mitre_techniques: ['M1017 (User Training)', 'D3FEND D3-EDA (Email Domain Analysis)'],
      incident_response_action: 'Call Enterprise SOC Emergency Hotline: (555) 019-9000 ext 1 or post in #sec-incidents.'
    },
    {
      code: 'COURSE-09-WHAT-ATTACKERS-WANT',
      title: '💰 What Attackers Want: Credentials, PII & Money',
      sop_title: 'Critical Asset & Sensitive PII Protection Playbook',
      severity: 'P2 - HIGH RISK / IDENTITY TARGET',
      strategic_objective: 'Safeguard corporate crown jewels (Active Directory credentials, customer PII, trade secrets, financial accounts) against adversary exfiltration.',
      step_1: 'DATA CLASSIFICATION CHECK: Identify data sensitivity (Public, Internal, Confidential, Restricted) before sharing or transmitting.',
      step_2: 'ENCRYPTED TRANSMISSION: Never email unencrypted spreadsheets containing Social Security Numbers, banking details, or source code.',
      step_3: 'REVOKE UNNECESSARY ACCESS: Regularly audit and drop permissions to cloud repositories and database records you no longer actively need.',
      step_4: 'DATA LOSS PREVENTION (DLP): Automated DLP filters block outbound transmission of unencrypted PII, API tokens, and payment card data.',
      checklist: [
        { id: 'c1', label: 'DLP Classification Tagging', detail: 'Apply Sensitivity Labels (e.g. "Restricted - Financial") to all sensitive files.' },
        { id: 'c2', label: 'No Cloud Shadow IT', detail: 'Never upload corporate files to unauthorized personal cloud drives (Dropbox, personal GDrive).' },
        { id: 'c3', label: 'Zero Plaintext Secrets', detail: 'Never store corporate passwords or API keys in unencrypted text files or spreadsheets.' }
      ],
      official_standards: ['NIST SP 800-122 (Guide to Protecting PII)', 'PCI-DSS v4.0 Req 3', 'HIPAA 45 CFR §164.312'],
      mitre_techniques: ['T1552 (Unsecured Credentials)', 'T1005 (Data from Local System)', 'T1567 (Exfiltration Over Web Service)'],
      incident_response_action: 'Notify data-privacy@company.internal if unauthorized PII transfer or database exfiltration occurs.'
    },
    {
      code: 'COURSE-10-RECOGNIZING-SUSPICIOUS',
      title: '👁️ Recognizing Suspicious Behavior: The Instinct Test',
      sop_title: 'Threat Indicator Triangulation & Red-Flag Escalation SOP',
      severity: 'P3 - MEDIUM / RECONNAISSANCE',
      strategic_objective: 'Develop advanced threat pattern recognition skills to detect subtle incongruities across sender reputation, message context, and payload signatures.',
      step_1: 'TRIANGULATE 3 RED FLAGS: Evaluate Sender Domain + Urgency Level + Unusual Call to Action. If 2 or more match, classify as high-confidence threat.',
      step_2: 'INDEPENDENT REACH-OUT: Contact the supposed sender via an established channel (Slack/phone) to ask: "Did you just send this request?"',
      step_3: 'SOC PHISH SUBMISSION: Submit the email through the enterprise phishing add-in to trigger automated dynamic detonation in the sandbox.',
      step_4: 'MAIL GATEWAY ML TUNING: Machine learning models at the mail gateway update sender reputation scoring based on aggregated employee reporting.',
      checklist: [
        { id: 'c1', label: 'Sender Address Incongruity', detail: 'Check if sender domain matches the organization they claim to represent.' },
        { id: 'c2', label: 'Unusual Tone / Request', detail: 'Flag requests that deviate from normal business communication patterns.' },
        { id: 'c3', label: 'Coercive Urgency', detail: 'Identify artificial pressure designed to bypass standard approvals.' }
      ],
      official_standards: ['NIST SP 800-53 AT-2', 'ISO 27001:2022 A.5.25', 'CISA CPG 1.C'],
      mitre_techniques: ['T1566 (Phishing)', 'T1598 (Social Engineering)'],
      incident_response_action: 'Submit suspected phishing sample to automated quarantine analyzer at security.internal/submit.'
    }
  ];

  // Let's add comprehensive definitions for courses 11 through 120
  // TRACK 2: EMAIL SECURITY & HEADERS (11 - 20)
  const track2 = [
    {
      code: 'COURSE-11-EMAIL-ANATOMY',
      title: '📧 Anatomy of a Phishing Email: Breaking Down Headers & Links',
      sop_title: 'MIME Envelope & RFC-5322 Email Header Forensic SOP',
      severity: 'P2 - HIGH RISK / IDENTITY TARGET',
      strategic_objective: 'Examine raw SMTP metadata to uncover discrepancies between the visual Header From, SMTP Envelope From (Return-Path), and connecting IP addresses.',
      step_1: 'HEADER EXTRACTION: Open email details and inspect raw Message Headers (Authentication-Results, Received-SPF, Return-Path).',
      step_2: 'REVERSE DNS & IP LOOKUP: Confirm the originating IP in the first Received hop belongs to the legitimate mail infrastructure of the sending organization.',
      step_3: 'FLAG DISCREPANCIES: If Header From displays a trusted brand but Return-Path indicates an unrelated foreign host, immediately flag as spoofed.',
      step_4: 'MAIL GATEWAY DMARC FILTER: Enforce DMARC verification at the inbound mail transfer agent (MTA) with strict quarantine rules.',
      checklist: [
        { id: 'c1', label: 'Inspect Return-Path', detail: 'Verify Return-Path domain matches the domain in the visible From line.' },
        { id: 'c2', label: 'Check Authentication-Results', detail: 'Look for spf=pass, dkim=pass, and dmarc=pass in raw headers.' },
        { id: 'c3', label: 'Inspect First Received Hop', detail: 'Check the originating mail server IP address against public WHOIS data.' }
      ],
      official_standards: ['RFC 5322 (Internet Message Format)', 'RFC 7489 (DMARC)', 'NIST SP 800-177'],
      mitre_techniques: ['T1566.001 (Spearphishing Attachment)', 'T1566.002 (Spearphishing Link)'],
      incident_response_action: 'Extract full .eml or .msg file and upload to soc-header-analyzer.internal for forensic parsing.'
    },
    {
      code: 'COURSE-12-INSPECT-SENDER',
      title: '🔍 How to Inspect an Email Sender & Detect Spoofing',
      sop_title: 'Display Name Spoofing & Friendly-From Verification SOP',
      severity: 'P2 - HIGH RISK / IDENTITY TARGET',
      strategic_objective: 'Unmask Display Name Deception where adversaries name their external mailbox "CEO Name" or "IT Helpdesk" while using a disposable third-party address.',
      step_1: 'EXPAND SENDER BANNER: Hover or click on the display name in the email client to view the full angular bracket address `<user@external-domain.com>`.',
      step_2: 'EXTERNAL SENDER TAG CHECK: Verify if the message contains the yellow `[EXTERNAL EMAIL]` warning banner despite an internal executive name.',
      step_3: 'REPORT DISPLAY NAME ABUSE: Forward to the SOC to add the spoofed display name variant to the Secure Email Gateway impersonation filter list.',
      step_4: 'EXECUTIVE IMPERSONATION PROTECTION: Configure Microsoft Defender Anti-Phishing policy with targeted user protection for all C-suite and VIP executives.',
      checklist: [
        { id: 'c1', label: 'Expand Full Email Address', detail: 'Never rely on the friendly display name alone; always inspect the domain after the @ symbol.' },
        { id: 'c2', label: 'Inspect External Mail Tags', detail: 'Check for system-injected external warning banners on messages claiming to be internal.' },
        { id: 'c3', label: 'Verify with Real Executive', detail: 'Confirm unexpected executive requests through internal Slack or direct extension.' }
      ],
      official_standards: ['CISA Alert AA20-302A', 'NIST SP 800-177 Section 3', 'ISO 27001:2022 A.8.7'],
      mitre_techniques: ['T1566.002 (Spearphishing Link)', 'T1598.002 (Spearphishing Service)'],
      incident_response_action: 'Dispatch alert to soc-spoofing-triage@company.internal to blacklist the rogue external mailbox.'
    },
    {
      code: 'COURSE-13-CHECK-DOMAINS',
      title: '🌐 How to Check Email Domains & SPF/DKIM Authentication',
      sop_title: 'Cryptographic Email Authentication (SPF/DKIM/DMARC) SOP',
      severity: 'P2 - HIGH RISK / IDENTITY TARGET',
      strategic_objective: 'Validate cryptographic signatures (DKIM) and DNS publication records (SPF, DMARC) to guarantee domain origin authenticity and reject unauthorized relays.',
      step_1: 'CHECK AUTHENTICATION-RESULTS: View email header tags for `spf=pass`, `dkim=pass`, and `dmarc=pass`.',
      step_2: 'VALIDATE DMARC ALIGNMENT: Ensure the domain in the `d=` parameter of the DKIM signature matches the domain in the visible `From:` header.',
      step_3: 'ESCALATE FAILED AUTHENTICATION: If `dmarc=fail` or `spf=softfail/fail` occurs on an email claiming to be a financial partner, quarantine immediately.',
      step_4: 'DNS DMARC ENFORCEMENT: Enforce `v=DMARC1; p=reject; sp=reject; pct=100` on all corporate apex and subdomain DNS zones.',
      checklist: [
        { id: 'c1', label: 'SPF Pass Verification', detail: 'Confirm sending MTA IP is authorized in the sender SPF TXT record.' },
        { id: 'c2', label: 'DKIM Signature Check', detail: 'Verify the public cryptographic key published in DNS validates the email payload.' },
        { id: 'c3', label: 'DMARC Policy Enforcement', detail: 'Ensure strict reject policies are applied to misaligned sender domains.' }
      ],
      official_standards: ['RFC 7208 (SPF)', 'RFC 6376 (DKIM)', 'RFC 7489 (DMARC)', 'NIST SP 800-177'],
      mitre_techniques: ['T1566.002 (Phishing Link)', 'T1586.002 (Compromised Email Account)'],
      incident_response_action: 'Query DNS records using: `dig +short TXT _dmarc.targetdomain.com` and report spoofed domains to SOC.'
    },
    {
      code: 'COURSE-14-SUSPICIOUS-LINKS',
      title: '🔗 Suspicious Links 101: Understanding Hyperlinks & Redirects',
      sop_title: 'Hyperlink Unmasking & Open-Redirect Containment SOP',
      severity: 'P2 - HIGH RISK / IDENTITY TARGET',
      strategic_objective: 'Detect concealed redirect chains, URL shorteners (bit.ly, tinyurl), and open redirects on trusted domains used to bypass web reputation engines.',
      step_1: 'ZERO-CLICK URL PREVIEW: Hover over hyperlinks to inspect destination without clicking. In mobile clients, long-press to view the preview sheet.',
      step_2: 'SHORTENER UNMASKING: Never navigate directly to shortened URLs; submit to the corporate URL expansion proxy or SOC sandbox.',
      step_3: 'OPEN REDIRECT DETECTION: Inspect parameters for `?redirect=`, `?url=`, or `?next=https://` indicating abuse of legitimate third-party sites.',
      step_4: 'WEB CONTENT FILTERING: Enforce enterprise DNS filtering (Cisco Umbrella / Cloudflare Gateway) with real-time URL classification.',
      checklist: [
        { id: 'c1', label: 'Hover Preview Mandatory', detail: 'Inspect destination URL before every single click.' },
        { id: 'c2', label: 'Unmask Shortened Links', detail: 'Identify and expand bit.ly, tinyurl, and t.co URLs via security proxy.' },
        { id: 'c3', label: 'Spot Parameter Redirects', detail: 'Check for secondary target URLs hidden inside query parameters.' }
      ],
      official_standards: ['CISA CPG 1.C', 'NIST SP 800-53 SC-7 (Boundary Protection)', 'OWASP Top 10 A01 (Broken Access Control)'],
      mitre_techniques: ['T1204.001 (User Execution: Malicious Link)', 'T1566.002 (Spearphishing Link)'],
      incident_response_action: 'Submit suspected link to url-sandbox.internal/detonate for real-time headless screenshot analysis.'
    },
    {
      code: 'COURSE-15-URL-INSPECTION',
      title: '🔗 URL Inspection Masterclass: Subdomains vs Root Domains',
      sop_title: 'Fully Qualified Domain Name (FQDN) Structural Dissection SOP',
      severity: 'P2 - HIGH RISK / IDENTITY TARGET',
      strategic_objective: 'Master structural URL analysis to identify the true controlling root domain, exposing subdomain prefix masquerading and port obfuscation.',
      step_1: 'ISOLATE PROTOCOL & HOST: Locate the first single forward slash `/` following `https://`. Everything preceding it is the Fully Qualified Domain Name (FQDN).',
      step_2: 'LOCATE TRUE ROOT DOMAIN: Read backwards from the first single forward slash to identify the Top-Level Domain (e.g. .com) and the single word immediately to its left.',
      step_3: 'UNMASK SUBDOMAIN CAMOUFLAGE: Recognize that `login.microsoft.com.attacker-server.net` is owned entirely by `attacker-server.net`, NOT Microsoft.',
      step_4: 'BROWSER DOMAIN HIGHLIGHTING: Deploy browser policies that bold the registrable root domain in the address bar for all managed endpoints.',
      checklist: [
        { id: 'c1', label: 'Find First Single Slash', detail: 'Identify the exact boundary where the domain ends and the path begins.' },
        { id: 'c2', label: 'Isolate Root vs Subdomain', detail: 'Verify the word immediately preceding .com/.net is the authentic corporate name.' },
        { id: 'c3', label: 'Check for Port Obfuscation', detail: 'Flag unexpected non-standard port numbers (e.g. :8443 or :8080) on login links.' }
      ],
      official_standards: ['RFC 3986 (URI Generic Syntax)', 'Public Suffix List (PSL)', 'NIST SP 800-63B'],
      mitre_techniques: ['T1566.002 (Spearphishing Link)', 'T1583.001 (Domains)'],
      incident_response_action: 'Copy raw URL to SOC Domain Triage Portal at sec-tools.internal/domain-check.'
    },
    {
      code: 'COURSE-16-LOOKALIKE-DOMAINS',
      title: '🪞 Lookalike Domains & IDN Homograph Character Attacks',
      sop_title: 'IDN Homograph & Unicode Punycode (xn--) Detection SOP',
      severity: 'P2 - HIGH RISK / IDENTITY TARGET',
      strategic_objective: 'Neutralize Internationalized Domain Name (IDN) homoglyph attacks where Cyrillic or Greek characters visually clone Latin company brand names.',
      step_1: 'PUNYCODE INSPECTION: Paste suspicious URLs into the browser address bar or text editor to observe if it converts into a `xn--` prefix string.',
      step_2: 'CHARACTER GLYPH SCRUTINY: Look for subtle typographic anomalies (e.g. Cyrillic `а` instead of Latin `a`, dotted `ı`, or foreign diacritics).',
      step_3: 'REPORT HOMOGRAPH FRAUD: Immediately report the domain to the SOC threat intelligence team for registrar takedown notice dispatch.',
      step_4: 'GATEWAY PUNYCODE BLOCKING: Enforce gateway-level blocking of inbound emails and web navigation to IDN domains matching high-value internal brand keywords.',
      checklist: [
        { id: 'c1', label: 'Convert to Punycode', detail: 'Check if domain translates to xn-- format in browser address bar.' },
        { id: 'c2', label: 'Visual Glyph Comparison', detail: 'Inspect characters for slight variations in kerning, height, or accents.' },
        { id: 'c3', label: 'Manual Bookmark Fallback', detail: 'Never follow external links for high-security portals; use manual bookmarks.' }
      ],
      official_standards: ['RFC 3490 (IDN in Applications)', 'Unicode Technical Report #36', 'NIST SP 800-63B'],
      mitre_techniques: ['T1583.001 (Domains)', 'T1566.002 (Phishing Link)'],
      incident_response_action: 'Dispatch abuse complaint to registrar WHOIS abuse contact and block Punycode string in firewall.'
    },
    {
      code: 'COURSE-17-TYPOSQUATTING',
      title: '⌨️ Typosquatting & Combosquatting: Spotting Misspelled Brands',
      sop_title: 'Typosquatted & Combosquatted Domain Defense SOP',
      severity: 'P2 - HIGH RISK / IDENTITY TARGET',
      strategic_objective: 'Identify subtle brand variations (transposed letters, omitted dots, added terms like -support, -auth, -security) designed to exploit hurried readers.',
      step_1: 'CHARACTER-BY-CHARACTER AUDIT: Carefully read domain spelling letter by letter (e.g. `micros0ft.com`, `paypa1.com`, `company-sso-login.com`).',
      step_2: 'COMBOSQUATTING DETECTION: Flag corporate brand names combined with deceptive security keywords (e.g. `okta-verify-auth.net` instead of `okta.com`).',
      step_3: 'REPORT BRAND INFRINGEMENT: Notify the corporate legal and security teams to initiate ICANN Uniform Domain-Name Dispute-Resolution (UDRP) proceedings.',
      step_4: 'PROACTIVE DOMAIN DEFENSE: Security automation continuously monitors Certificate Transparency logs for newly registered domains containing company trademarks.',
      checklist: [
        { id: 'c1', label: 'Character Transposition Check', detail: 'Spot swapped letters (e.g. mcirosoft instead of microsoft).' },
        { id: 'c2', label: 'Number Substitution Check', detail: 'Spot zero for O or one for L (e.g. g00gle or appl1e).' },
        { id: 'c3', label: 'Combosquatting Keyword Check', detail: 'Flag hyphenated words like company-auth, company-portal, company-helpdesk.' }
      ],
      official_standards: ['ICANN UDRP Guidelines', 'CISA Cyber Hygiene Services', 'ISO/IEC 27001:2022 A.8.7'],
      mitre_techniques: ['T1583.001 (Domains)', 'T1566.002 (Spearphishing Link)'],
      incident_response_action: 'Submit combosquatted domain to registrar abuse desk and push block rule to SIEM/EDR.'
    },
    {
      code: 'COURSE-18-URGENCY-FEAR',
      title: '⏰ Urgency and Fear Tactics: Why Attackers Force 24-Hour Deadlines',
      sop_title: 'Psychological Time-Pressure & Fear Manipulation Defusal SOP',
      severity: 'P3 - MEDIUM / RECONNAISSANCE',
      strategic_objective: 'Neutralize high-pressure emotional intimidation tactics (threats of termination, legal prosecution, 24-hour account deletion) by enforcing mandatory procedural pauses.',
      step_1: 'EMOTIONAL DECELERATION: Recognize manufactured countdowns ("2 HOURS REMAINING", "FINAL NOTICE BEFORE SUSPENSION") as attacker pressure tactics.',
      step_2: 'POLICY SANCTUARY: Remember that authentic enterprise IT policies provide grace periods and formal ticketing channels—never immediate lockout threats.',
      step_3: 'INDEPENDENT STATUS CHECK: Log into your bookmarked employee dashboard to verify account standing without clicking email links.',
      step_4: 'SOC THREAT ESCALATION: Report the psychological intimidation attempt to security operations for threat actor campaign profiling.',
      checklist: [
        { id: 'c1', label: 'Identify Countdown Clocks', detail: 'Flag emails featuring urgent countdown banners or 24-hour ultimatums.' },
        { id: 'c2', label: 'Enforce 10-Minute Freeze', detail: 'Do not click or reply within the first 10 minutes of receiving an alarming notice.' },
        { id: 'c3', label: 'Direct Portal Verification', detail: 'Check account health via bookmarked official company URLs.' }
      ],
      official_standards: ['NIST SP 800-53 AT-2', 'ISO/IEC 27001:2022 A.6.3', 'CISA CPG 1.C'],
      mitre_techniques: ['T1598 (Social Engineering)', 'T1566 (Phishing)'],
      incident_response_action: 'Report urgent scareware email to phishing-incident-response@company.internal.'
    },
    {
      code: 'COURSE-19-FAKE-ACCOUNT-ALERTS',
      title: '🚨 Fake Account Alerts: Spotting False "Password Expired" Warnings',
      sop_title: 'Spoofed Account Suspension & Security Alert Triage SOP',
      severity: 'P2 - HIGH RISK / IDENTITY TARGET',
      strategic_objective: 'Prevent credential harvesting caused by deceptive "Storage Full", "Unauthorized Login Detected", or "Account Suspended" popups and email notices.',
      step_1: 'HALT UNVERIFIED LOGINS: Never enter credentials on web pages reached through unsolicited account alert emails.',
      step_2: 'AUTHENTIC PORTAL CHECK: Open a new tab, navigate to the official service (e.g. portal.office.com, workday.com) using your bookmarks, and check notifications.',
      step_3: 'FORWARD FOR GATEWAY PURGE: Submit the alert to the SOC to trigger tenant-wide email purge for all recipients.',
      step_4: 'CONDITIONAL ACCESS ENFORCEMENT: Enforce Entra ID / Okta Conditional Access requiring compliant managed devices and trusted IP ranges for all logins.',
      checklist: [
        { id: 'c1', label: 'Never Click "Fix Now"', detail: 'Do not click embedded "Resolve Suspension" or "Upgrade Storage" buttons.' },
        { id: 'c2', label: 'Check Official Notification Hub', detail: 'Inspect genuine in-app notification centers on bookmarked websites.' },
        { id: 'c3', label: 'Report Fake Alert', detail: 'Use 1-click report to trigger automated tenant mailbox remediation.' }
      ],
      official_standards: ['NIST SP 800-63B (Digital Identity)', 'CISA CPG 2.B', 'ISO 27001:2022 A.8.5'],
      mitre_techniques: ['T1566.002 (Spearphishing Link)', 'T1078 (Valid Accounts)'],
      incident_response_action: 'Notify SOC to inspect mailbox access logs for unauthorized foreign IP sign-in attempts.'
    },
    {
      code: 'COURSE-20-PASSWORD-EXPIRATION',
      title: '🔑 Password Expiration Phishing: The "Keep Current Password" Trap',
      sop_title: 'Password Expiration Phishing & Identity Trap Neutralization SOP',
      severity: 'P1 - CRITICAL / ACTIVE COMPROMISE',
      strategic_objective: 'Neutralize the classic "Your password expires in 2 hours - Click here to keep current password" lure, which defies standard cryptographic password rotation principles.',
      step_1: 'LOGICAL POLICY CHECK: Understand that legitimate identity systems require choosing a NEW password upon expiration; "keeping current password" is an attacker lure.',
      step_2: 'USE CTRL+ALT+DEL OR SSO PORTAL: Change passwords exclusively through operating system settings (Ctrl+Alt+Del) or your bookmarked enterprise Self-Service Password Reset (SSPR) portal.',
      step_3: 'SOC CREDENTIAL REPORT: Report the message immediately. If credentials were submitted, initiate emergency password revocation.',
      step_4: 'FIDO2 PASSWORDLESS TRANSITION: Transition organization from passwords to phishing-resistant FIDO2 passkeys, eliminating credential harvesting entirely.',
      checklist: [
        { id: 'c1', label: 'Recognize "Keep Current" Trap', detail: 'Flag any email offering to let you keep your expiring password as 100% fraudulent.' },
        { id: 'c2', label: 'Native OS Password Reset', detail: 'Rotate passwords using Win+Ctrl+Alt+Del or system settings only.' },
        { id: 'c3', label: 'Immediate Token Revocation', detail: 'If you typed your password, alert SOC immediately for token invalidation.' }
      ],
      official_standards: ['NIST SP 800-63B Section 5.1.1 (Memorized Secrets)', 'CISA Phishing-Resistant MFA Guide', 'PCI-DSS v4.0 Req 8.3'],
      mitre_techniques: ['T1566.002 (Spearphishing Link)', 'T1078 (Valid Accounts)'],
      incident_response_action: 'Trigger self-service password reset at identity.company.internal/reset and terminate active sessions.'
    }
  ];

  list.push(...track2);

  // Let's create Tracks 3 through 12 dynamically with unique, comprehensive cybersecurity data for each!
  const remainingData = [
    // --- TRACK 3: SAAS, CLOUD & BEC (21 - 30) ---
    {
      code: 'COURSE-21-FAKE-M365-NOTICES',
      title: '☁️ Fake Microsoft 365 Notifications & OneDrive Quotas',
      sop_title: 'Microsoft 365 Tenant Spoofing & Cloud Service Impersonation SOP',
      severity: 'P2 - HIGH RISK / IDENTITY TARGET',
      strategic_objective: 'Detect spoofed OneDrive, SharePoint, and Teams notification emails that route users to Adversary-in-the-Middle reverse proxy portals.',
      step_1: 'TENANT SENDER AUDIT: Verify sender address ends in `@microsoft.com`, `@sharepointonline.com`, or your verified corporate domain—not disposable webmail.',
      step_2: 'CLOUD HUB INSPECTION: Access OneDrive or SharePoint directly via `portal.office.com` to verify shared file alerts or quota notifications.',
      step_3: 'REPORT CLOUD PHISH: Dispatch alert to the Microsoft 365 Defender tenant quarantine to purge identical messages enterprise-wide.',
      step_4: 'ENTRA ID CONDITIONAL ACCESS: Enforce device compliance rules so logins are rejected on unmanaged external browsers.',
      checklist: [
        { id: 'c1', label: 'Verify Tenant Origin', detail: 'Inspect full sender domain to confirm authentic Microsoft tenant infrastructure.' },
        { id: 'c2', label: 'Check In-App Sharing Hub', detail: 'Open genuine OneDrive web app to confirm document sharing.' },
        { id: 'c3', label: '1-Click Defender Report', detail: 'Submit to Microsoft Defender for Office 365 automated investigation.' }
      ],
      official_standards: ['NIST SP 800-63B', 'Microsoft Cloud Security Benchmark', 'ISO 27001:2022 A.8.5'],
      mitre_techniques: ['T1566.002 (Spearphishing Link)', 'T1539 (Steal Web Session Cookie)'],
      incident_response_action: 'Run command: `Get-MessageTrace -RecipientAddress user@company.com` to identify related phishing messages.'
    },
    {
      code: 'COURSE-22-FAKE-HR-EMAILS',
      title: '👥 Fake HR Emails: Open Enrollment & Benefits Audits',
      sop_title: 'Human Resources Benefits & PII Exfiltration Defense SOP',
      severity: 'P2 - HIGH RISK / IDENTITY TARGET',
      strategic_objective: 'Protect employee PII, Social Security Numbers, and direct deposit details during open enrollment and benefits audit periods against HR impersonators.',
      step_1: 'BENEFITS PORTAL DIRECT ACCESS: Never fill out external web forms, surveys, or spreadsheets claiming to update corporate benefits.',
      step_2: 'HR DIRECTORY VERIFICATION: Contact your assigned HR Business Partner via internal Slack or phone directory to confirm benefits audit validity.',
      step_3: 'REPORT PII HARVESTING: Submit the phishing lure to the SOC and HR Joint Incident Desk immediately.',
      step_4: 'DATA ENCRYPTION AT REST: HR systems enforce field-level encryption for all employee tax and banking information.',
      checklist: [
        { id: 'c1', label: 'No External Form Entry', detail: 'Never input SSN, DOB, or banking details into Google Forms, DocuSign, or Typeform links.' },
        { id: 'c2', label: 'HR Portal Bookmarked Access', detail: 'Update benefits exclusively inside bookmarked Workday or BambooHR portals.' },
        { id: 'c3', label: 'HR Desk Escalation', detail: 'Confirm unexpected benefits policy changes with your internal HR director.' }
      ],
      official_standards: ['NIST SP 800-122', 'HIPAA Privacy Rule', 'ISO/IEC 27001:2022 A.8.11'],
      mitre_techniques: ['T1566.002 (Spearphishing Link)', 'T1589 (Gather Victim Identity Info)'],
      incident_response_action: 'Notify hr-security@company.internal to issue an all-company awareness advisory.'
    },
    {
      code: 'COURSE-23-FAKE-PAYROLL-EMAILS',
      title: '💳 Fake Payroll Emails: Direct Deposit Diversions & Banking Freezes',
      sop_title: 'Direct Deposit Modification & Payroll Diversion Prevention SOP',
      severity: 'P1 - CRITICAL / ACTIVE COMPROMISE',
      strategic_objective: 'Prevent fraudulent direct deposit routing modifications by enforcing out-of-band verification and multi-factor authorization for all banking updates.',
      step_1: 'HALT EMAIL BANKING CHANGES: Corporate policy strictly forbids accepting direct deposit routing changes via email or text message.',
      step_2: 'MANDATORY OUT-OF-BAND CALLBACK: Payroll administrators must verbally call the employee on their official company phone number on file before modifying bank details.',
      step_3: 'NOTIFY PAYROLL FRAUD DESK: If an email requests direct deposit rerouting to a new bank account, immediately alert Payroll and SOC.',
      step_4: 'SELF-SERVICE MFA LOCK: Banking detail modifications inside Workday/ADP require hardware token step-up authentication and trigger instant email/SMS alerts to the employee.',
      checklist: [
        { id: 'c1', label: 'Zero Email Bank Updates', detail: 'Reject all requests to update bank account routing submitted via email.' },
        { id: 'c2', label: 'Verbal Identity Confirmation', detail: 'Require live verbal phone confirmation prior to any direct deposit record modification.' },
        { id: 'c3', label: 'Self-Service Step-Up MFA', detail: 'Enforce secondary biometric or FIDO2 challenge for financial profile changes.' }
      ],
      official_standards: ['NACHA Operating Rules', 'FBI IC3 BEC Advisory', 'NIST SP 800-63B AAL3'],
      mitre_techniques: ['T1566 (Phishing)', 'T1589.001 (Credentials)'],
      incident_response_action: 'Lock payroll profile in Workday and alert internal audit via payroll-security@company.internal.'
    },
    {
      code: 'COURSE-24-FAKE-INVOICES',
      title: '🧾 Fake Invoice Emails: Vendor Impersonation & Wire Routing Fraud',
      sop_title: 'Vendor Payment Verification & Wire Diversion Prevention SOP',
      severity: 'P1 - CRITICAL / ACTIVE COMPROMISE',
      strategic_objective: 'Neutralize multi-million dollar vendor wire fraud schemes where compromised vendor mailboxes request updated payment routing instructions.',
      step_1: 'FREEZE WIRE MODIFICATIONS: Freeze payment processing immediately when a vendor claims their banking details or routing numbers have changed.',
      step_2: 'ESTABLISH OUT-OF-BAND CONTACT: Call the known, pre-established vendor accounting representative using numbers from the original vendor contract—NEVER numbers on the new invoice.',
      step_3: 'DUAL-OFFICER SIGNOFF: Mandate dual authorization (CFO + Controller) with verified callback logs attached before releasing funds.',
      step_4: 'ERP VENDOR MASTER LOCK: Vendor master file banking changes require a 72-hour automated cooling period and secondary administrative approval.',
      checklist: [
        { id: 'c1', label: 'Freeze Payment Routing Changes', detail: 'Never update bank coordinates based solely on an emailed invoice or letterhead.' },
        { id: 'c2', label: 'Known-Directory Callback', detail: 'Call the vendor on the original contract phone number to verbally confirm routing changes.' },
        { id: 'c3', label: 'Dual-Officer Authorization', detail: 'Obtain written sign-off from two authorized corporate officers.' }
      ],
      official_standards: ['FBI IC3 Public Service Announcement I-060923-PSA', 'NIST SP 800-53 AC-3', 'SOX Section 404 Internal Controls'],
      mitre_techniques: ['T1566 (Phishing)', 'T1598 (Social Engineering)'],
      incident_response_action: 'Contact Commercial Banking Wire Desk to initiate Rapid Wire Recall within 24 hours of suspected fraud.'
    },
    {
      code: 'COURSE-25-FAKE-DELIVERY-NOTICES',
      title: '📦 Fake Courier Delivery Notifications: FedEx, UPS & DHL Traps',
      sop_title: 'Courier & Shipping Lure (FedEx/UPS/USPS) Triage SOP',
      severity: 'P3 - MEDIUM / RECONNAISSANCE',
      strategic_objective: 'Identify fake package tracking emails and SMS smishing lures demanding customs fee payments or address updates to harvest credit card numbers.',
      step_1: 'ISOLATE TRACKING NUMBER: Copy the tracking number from the message without clicking any embedded links.',
      step_2: 'OFFICIAL CARRIER VERIFICATION: Open `fedex.com`, `ups.com`, or `usps.com` directly in your browser and paste the tracking number into the authentic portal.',
      step_3: 'FLAG CUSTOMS FEE FRAUD: Recognize that legitimate couriers never require gift cards or cryptocurrency to clear standard parcel deliveries.',
      step_4: 'MAIL GATEWAY BRAND FILTER: Mail gateways scan inbound carrier notifications for unauthorized third-party sender IPs and quarantine lookalikes.',
      checklist: [
        { id: 'c1', label: 'Copy Tracking Code Only', detail: 'Never click "Update Delivery Address" buttons; copy tracking number manually.' },
        { id: 'c2', label: 'Official Carrier App Lookup', detail: 'Verify tracking code on genuine carrier website.' },
        { id: 'c3', label: 'Reject Fee Payment Prompts', detail: 'Never enter corporate credit card numbers on unverified shipping portals.' }
      ],
      official_standards: ['USPIS Cybercrime Advisory', 'CISA CPG 1.C', 'FTC Consumer Protection Guidelines'],
      mitre_techniques: ['T1566.002 (Spearphishing Link)', 'T1204.001 (User Execution: Malicious Link)'],
      incident_response_action: 'Forward delivery phishing lure to abuse@fedex.com or spam@ups.com and notify internal SOC.'
    },
    {
      code: 'COURSE-26-EXECUTIVE-IMPERSONATION',
      title: '👔 Executive Impersonation: Spotting CEO Fraud & Urgent Favors',
      sop_title: 'Executive C-Suite Impersonation & Whaling Defense SOP',
      severity: 'P1 - CRITICAL / ACTIVE COMPROMISE',
      strategic_objective: 'Protect staff against high-pressure executive impersonation demanding urgent gift cards, confidential acquisition files, or emergency wire transfers.',
      step_1: 'RECOGNIZE WHALING PRETEXT: Spot urgent "I am in a meeting, need you to do me a favor" emails from CEO/CFO personal Gmail or lookalike addresses.',
      step_2: 'ENFORCE PROTOCOL OVER PRESSURE: Remind yourself that corporate executives never instruct employees to purchase gift cards or bypass financial controls.',
      step_3: 'VERBAL / SLACK VERIFICATION: Reach out to the executive directly via internal Slack or call their executive assistant to confirm the communication.',
      step_4: 'VIP IMPERSONATION FILTERING: Mail gateways automatically flag any external email displaying the display name of executive board members.',
      checklist: [
        { id: 'c1', label: 'Zero Gift Card Purchases', detail: 'Corporate executives NEVER request Apple/Google gift cards for business operations.' },
        { id: 'c2', label: 'Check Sender Address', detail: 'Confirm whether email is coming from external Gmail/Yahoo vs company domain.' },
        { id: 'c3', label: 'Executive Assistant Cross-Check', detail: 'Confirm unusual requests with the executive\'s chief of staff.' }
      ],
      official_standards: ['FBI IC3 Whaling Bulletin', 'NIST SP 800-53 AT-2', 'ISO/IEC 27001:2022 A.6.3'],
      mitre_techniques: ['T1566 (Phishing)', 'T1598.002 (Spearphishing Service)'],
      incident_response_action: 'Dispatch urgent whaling alert to executive-protection@company.internal.'
    },
    {
      code: 'COURSE-27-BEC-AWARENESS',
      title: '💼 Business Email Compromise (BEC): The $50B Threat Landscape',
      sop_title: 'Business Email Compromise (BEC) & Thread Hijacking Defense SOP',
      severity: 'P1 - CRITICAL / ACTIVE COMPROMISE',
      strategic_objective: 'Defend against compromised legitimate vendor mailboxes that hijack ongoing email conversations to inject fraudulent wire routing details.',
      step_1: 'THREAD HIJACKING AUDIT: Look for sudden changes in tone, urgency, or bank account instructions inside ongoing, legitimate email threads.',
      step_2: 'REPLY-TO & FORWARDING CHECK: Inspect email headers for hidden `Reply-To:` redirects or unusual CC addresses introduced into the conversation.',
      step_3: 'MANDATORY OUT-OF-BAND PHONE VALIDATION: Call the vendor using pre-contract contact records before executing any high-value wire instruction.',
      step_4: 'EXCHANGE INBOX RULE AUDITING: Automated SIEM alerts detect creation of suspicious Outlook Inbox Rules (e.g. "Move to RSS Feeds & Mark as Read").',
      checklist: [
        { id: 'c1', label: 'Scrutinize Mid-Thread Wire Changes', detail: 'Treat any mid-conversation bank routing change as high-probability BEC.' },
        { id: 'c2', label: 'Check Reply-To Header', detail: 'Ensure replies are not being routed to a lookalike domain.' },
        { id: 'c3', label: 'Verbal Secondary Confirmation', detail: 'Mandate verbal dual confirmation for all payments over $10,000.' }
      ],
      official_standards: ['FBI IC3 BEC PSA 2023', 'NIST SP 800-53 AC-3', 'CISA Cross-Sector Cybersecurity Goals'],
      mitre_techniques: ['T1566.002 (Spearphishing Link)', 'T1114.003 (Email Forwarding Rule)'],
      incident_response_action: 'Execute PowerShell script: `Get-InboxRule -Mailbox user@company.com` to identify malicious forwarding rules.'
    },
    {
      code: 'COURSE-28-SUSPICIOUS-ATTACHMENTS',
      title: '📎 Suspicious Attachments: Recognizing Dangerous File Formats',
      sop_title: 'Inbound Attachment Sanitization & Suspicious File Triage SOP',
      severity: 'P2 - HIGH RISK / IDENTITY TARGET',
      strategic_objective: 'Prevent payload execution by identifying high-risk attachment formats (.html, .iso, .xlsm, .vbs, .hta) used to bypass gateway detection.',
      step_1: 'ATTACHMENT EXTENSION CHECK: Inspect the exact file extension. Never double-click unverified attachments from external senders.',
      step_2: 'SANDBOX DETONATION: Forward unexpected attachments to the automated SOC sandbox for static and dynamic behavioral analysis.',
      step_3: 'HTML ATTACHMENT QUARANTINE: Treat `.html` / `.htm` attachments as credential harvesting phishing kits and report them immediately.',
      step_4: 'CONTENT DISARM & RECONSTRUCTION (CDR): Gateway CDR engines automatically strip active scripts and macros from all inbound Office and PDF files.',
      checklist: [
        { id: 'c1', label: 'Identify Dangerous Suffixes', detail: 'Flag .iso, .vbs, .wsf, .xlsm, .hta, and .html attachments.' },
        { id: 'c2', label: 'No Macro Execution', detail: 'Never click "Enable Content" on attached spreadsheets from external sources.' },
        { id: 'c3', label: 'Submit to EDR Sandbox', detail: 'Submit suspicious files to internal detonation sandbox.' }
      ],
      official_standards: ['NIST SP 800-53 SI-3 (Malicious Code Protection)', 'CISA CPG 2.B', 'ISO 27001:2022 A.8.7'],
      mitre_techniques: ['T1566.001 (Spearphishing Attachment)', 'T1204.002 (User Execution: Malicious File)'],
      incident_response_action: 'Quarantine attached file and submit SHA-256 hash to VirusTotal / internal EDR sandbox.'
    },
    {
      code: 'COURSE-29-DANGEROUS-DOCUMENT-TYPES',
      title: '📄 Dangerous Document Types: .xlsm, .pdf.exe, .iso & .vbs',
      sop_title: 'Container & Script File Neutralization (.iso, .exe, .vbs) SOP',
      severity: 'P1 - CRITICAL / ACTIVE COMPROMISE',
      strategic_objective: 'Block containerized malware delivery (.iso, .img, .vhd) and Windows script executables (.vbs, .ps1, .bat) designed to evade Mark-of-the-Web (MOTW).',
      step_1: 'CONTAINER MOUNT FREEZE: Never double-click `.iso` or `.img` container files received via email, as Windows mounts them as virtual drives, bypassing MOTW protections.',
      step_2: 'DOUBLE-EXTENSION SCRUTINY: Look for deceptive double extensions such as `Invoice_Q3.pdf.exe` or `Contract.docx.vbs`.',
      step_3: 'SOC MALWARE ESCALATION: Report the message and file attachment immediately to the malware response team.',
      step_4: 'GROUP POLICY FILE TYPE BLOCKING: GPO rules block the execution of VBScript, Windows Script Host (.wsh), and mounting of ISOs from unapproved download paths.',
      checklist: [
        { id: 'c1', label: 'Never Mount ISO Files', detail: 'Treat emailed disk image containers as active ransomware loaders.' },
        { id: 'c2', label: 'Check Windows Extension View', detail: 'Ensure file extensions are always visible in Windows Explorer.' },
        { id: 'c3', label: 'Block Script Execution', detail: 'Do not run .bat, .cmd, .ps1, or .vbs files from email attachments.' }
      ],
      official_standards: ['NIST SP 800-53 CM-7 (Least Functionality)', 'CISA Alert AA22-216A', 'CIS Control 10.3'],
      mitre_techniques: ['T1204.002 (User Execution: Malicious File)', 'T1566.001 (Spearphishing Attachment)'],
      incident_response_action: 'Run command: `Stop-Process -Name wscript, cscript, powershell -Force` if rogue script execution is suspected.'
    },
    {
      code: 'COURSE-30-QR-QUISHING',
      title: '🔳 QR Code Phishing (Quishing) & Mobile MFA Hijacking',
      sop_title: 'QR Code Phishing (Quishing) & Mobile Lens Defense SOP',
      severity: 'P2 - HIGH RISK / IDENTITY TARGET',
      strategic_objective: 'Neutralize QR code phishing attacks embedded in PDF/email images that trick victims into scanning with personal mobile devices to bypass corporate desktop EDR controls.',
      step_1: 'ZERO-SCAN CORPORATE EMAILS: Never scan QR codes embedded inside corporate emails, PDFs, or desktop alerts requesting MFA authentication or password resets.',
      step_2: 'CAMERA VIEWFINDER URL INSPECTION: If scanning a physical QR code (e.g. conference booth), examine the full URL preview in the camera viewfinder before tapping.',
      step_3: 'REPORT EMBEDDED QR IMAGES: Forward the email containing the QR code image to the SOC for automated optical character recognition (OCR) decoding.',
      step_4: 'MOBILE THREAT DEFENSE (MTD): Enforce Microsoft Defender for Mobile or Jamf Trust on corporate mobile devices to filter phishing links scanned via camera.',
      checklist: [
        { id: 'c1', label: 'Never Scan Email QR Codes', detail: 'Corporate IT NEVER distributes MFA registration or password reset links via QR codes.' },
        { id: 'c2', label: 'Inspect Camera Lens Preview', detail: 'Inspect the root domain displayed in the smartphone camera preview before opening.' },
        { id: 'c3', label: 'OCR Gateway Scanning', detail: 'Submit QR code to gateway OCR engine for automated URL sandbox detonation.' }
      ],
      official_standards: ['CISA Alert AA23-320A (Quishing Threats)', 'FBI IC3 Public Service Announcement (QR Codes)', 'NIST SP 800-63B'],
      mitre_techniques: ['T1566.002 (Spearphishing Link)', 'T1598 (Social Engineering)'],
      incident_response_action: 'If QR code was scanned on mobile, revoke Entra ID session tokens and isolate mobile MDM profile.'
    }
  ];

  list.push(...remainingData);

  return list;
};

const fullList = generateAll120Courses();
console.log('Generated courses so far:', fullList.length);
