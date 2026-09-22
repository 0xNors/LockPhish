import json
import os

courses = [
    # -------------------------------------------------------------
    # TRACK 1: SECURITY FOUNDATIONS (01 - 10)
    # -------------------------------------------------------------
    {
        "code": "COURSE-01-CYBER-BASICS",
        "title": "🛡️ What Is Cybersecurity & How Attackers Operate",
        "sop_title": "Enterprise Cyber Threat Surface & Defensive Hygiene SOP",
        "severity": "P4 - OPERATIONAL HYGIENE",
        "strategic_objective": "Establish fundamental organizational cyber resilience by transforming every employee into an active detection sensor against external social engineering and initial access vectors.",
        "step_1": "TACTICAL HALT: Pause and evaluate any unsolicited communication requesting actions, file downloads, or credential disclosures.",
        "step_2": "SENDER ORIGIN VALIDATION: Inspect the actual RFC-822 email headers and verified corporate directory before trusting external communications.",
        "step_3": "1-CLICK INCIDENT ESCALATION: Submit suspicious artifacts via the Phish Alarm button to notify the SOC within 60 seconds.",
        "step_4": "ARCHITECTURAL HARDENING: Ensure CrowdStrike/Defender EDR agent is healthy, BitLocker encryption is active, and OS patching is up-to-date.",
        "checklist": [
            {"id": "c1", "label": "Healthy Skepticism", "detail": "Treat unsolicited messages requesting urgent action with initial skepticism."},
            {"id": "c2", "label": "Identity Directory Cross-Check", "detail": "Cross-reference unknown senders with internal employee registry."},
            {"id": "c3", "label": "Zero Credential Disclosure", "detail": "Never share passwords, OTP tokens, or badge numbers with any external party."},
            {"id": "c4", "label": "SOC Alert Dispatch", "detail": "Forward phishing messages to trigger automated firewall link blacklisting."}
        ],
        "official_standards": ["NIST CSF 2.0 GV.PO-01", "ISO/IEC 27001:2022 A.5.25", "CIS Control 14.1 (Security Awareness)"],
        "mitre_techniques": ["T1566 (Phishing)", "T1598 (Social Engineering)"],
        "incident_response_action": "Forward message to soc-phishing@company.internal with full original email headers."
    },
    {
        "code": "COURSE-02-PHISHING-INTRO",
        "title": "🎣 What Is Phishing? Core Concepts & Attack Mechanics",
        "sop_title": "Standard Operating Procedure: Inbound Email Phishing Triage",
        "severity": "P2 - HIGH RISK / IDENTITY TARGET",
        "strategic_objective": "Deconstruct deceptive email lures by identifying artificial urgency, forged branding, and masked hyperlinks before credential harvesting or malware staging occurs.",
        "step_1": "TACTICAL FREEZE: Do not click embedded links, download files, or respond to sender prompts.",
        "step_2": "HYPERLINK & SENDER FORENSICS: Hover over hyperlinks to inspect the true root domain. Compare sender address with legitimate corporate records.",
        "step_3": "DISPATCH SOC ALERT: Forward as an RFC-822 attachment or click 'Report Phishing' in Outlook/Gmail to trigger gateway-wide link neutralization.",
        "step_4": "TECHNICAL DEFENSE: Inbound Secure Email Gateway (SEG) URL rewriting, SPF/DKIM verification, and browser isolation sandboxing.",
        "checklist": [
            {"id": "c1", "label": "Hyperlink Destination Preview", "detail": "Hover over all links to confirm true domain matches official company endpoints."},
            {"id": "c2", "label": "Generic Greeting Alert", "detail": "Flag messages using 'Dear Customer' or 'Dear Employee' without your specific name."},
            {"id": "c3", "label": "Urgency Pressure Check", "detail": "Treat 24-hour expiration ultimatums as high-confidence malicious indicators."},
            {"id": "c4", "label": "1-Click Report Dispatched", "detail": "Submit to SOC to enable automated URL block across the corporate firewall."}
        ],
        "official_standards": ["NIST SP 800-177 (Email Trust)", "CISA CPG 1.C", "ISO/IEC 27001:2022 A.8.7"],
        "mitre_techniques": ["T1566.002 (Spearphishing Link)", "T1204.001 (User Execution - Malicious Link)"],
        "incident_response_action": "Forward message to soc-phishing-queue@company.internal and isolate browser tab."
    },
    {
        "code": "COURSE-03-TARGET-EMPLOYEE",
        "title": "🎯 Why Employees Are Targeted (The Human Attack Surface)",
        "sop_title": "Role-Based Threat Modeling & Targeted Persona Protection SOP",
        "severity": "P3 - MEDIUM / RECONNAISSANCE",
        "strategic_objective": "Harden high-visibility employee roles (HR, Finance, Executive Admins) against bespoke spearphishing attacks derived from open-source intelligence.",
        "step_1": "ROLE-AWARENESS AUDIT: Recognize when your job role (e.g. Accounts Payable, HR Manager) makes you a primary target for targeted deception.",
        "step_2": "CROSS-CHECK UNEXPECTED INSTRUCTIONS: Validate any request touching wire accounts, payroll records, or sensitive contracts through independent verified internal channels.",
        "step_3": "NOTIFY DEPARTMENT LEADERSHIP: Alert your security manager if you receive hyper-personalized phishing targeting specific corporate projects.",
        "step_4": "ENTERPRISE ACCESS RESTRICTION: Apply Least Privilege Access (RBAC) and strict Conditional Access policies to high-value administrative accounts.",
        "checklist": [
            {"id": "c1", "label": "Public Profile OpSec Check", "detail": "Audit LinkedIn/social profiles for sensitive internal software or hierarchy details."},
            {"id": "c2", "label": "Out-of-Band Cross Check", "detail": "Always verify unusual executive instructions via direct phone or internal Slack."},
            {"id": "c3", "label": "Targeted Incident Log", "detail": "Log any spearphishing attempt with the security operations center."}
        ],
        "official_standards": ["NIST SP 800-53 (AC-6 Least Privilege)", "ISO 27001:2022 A.6.1", "CIS Control 6.1"],
        "mitre_techniques": ["T1589 (Gather Victim Identity Info)", "T1598 (Social Engineering)"],
        "incident_response_action": "Report spearphishing campaigns to threat-intel@company.internal for adversary infrastructure takedown."
    },
    {
        "code": "COURSE-04-SOCIAL-ENGINEERING",
        "title": "🧠 How Social Engineering Works: Manipulation & Trust",
        "sop_title": "Social Engineering Psychological Interruption & Defusal SOP",
        "severity": "P2 - HIGH RISK / IDENTITY TARGET",
        "strategic_objective": "Disrupt manipulative psychological tactics (authority, scarcity, urgency, flattery) by enforcing standard verification procedures over emotional reactions.",
        "step_1": "EMOTIONAL TRIAGE: If a request triggers acute panic, excitement, or fear of reprimand, immediately halt all compliance.",
        "step_2": "SEPARATION OF AUTHORITY: Disregard perceived rank or authority when standard security protocols (dual sign-off, ticketing) are bypassed.",
        "step_3": "EXECUTE MANDATORY CALLBACK: Contact the requesting party using verified internal extension directory data—never use numbers provided in the message.",
        "step_4": "PROCEDURAL POLICY BACKSTOP: Corporate policy strictly immunizes employees who enforce verification against disciplinary action from angry requesters.",
        "checklist": [
            {"id": "c1", "label": "Identify Emotional Triggers", "detail": "Recognize when pressure tactics are being applied to override your judgment."},
            {"id": "c2", "label": "Adhere to Policy Over Emotion", "detail": "No executive rank justifies bypassing established security authorization flows."},
            {"id": "c3", "label": "Internal Directory Validation", "detail": "Verify identities using trusted internal company directories only."}
        ],
        "official_standards": ["NIST SP 800-53 (AT-2 Security Awareness)", "ISO/IEC 27001:2022 A.6.3", "CISA Cross-Sector CPGs"],
        "mitre_techniques": ["T1598 (Phishing for Information)", "T1204 (User Execution)"],
        "incident_response_action": "Report coercion attempts to hr-security-joint-desk@company.internal."
    },
    {
        "code": "COURSE-05-HUMAN-PSYCHOLOGY",
        "title": "🎭 Human Psychology Behind Scams: Fear, Greed & Authority",
        "sop_title": "Cognitive Bias Shield & Emotional De-escalation Protocol",
        "severity": "P3 - MEDIUM / RECONNAISSANCE",
        "strategic_objective": "Train personnel to detect systemic cognitive exploits (authority bias, urgency heuristic, FOMO, sunk cost) and systematically neutralize attacker framing.",
        "step_1": "COGNITIVE FREEZE: Recognize the psychological trigger (fear of termination, executive flattery, time-limited reward).",
        "step_2": "OBJECTIVE FACT CHECK: Separate the emotional tone from the objective factual request. Ask: 'Would a legitimate process demand this specific shortcut?'",
        "step_3": "COLLEAGUE SECOND OPINION: Consult a peer or team lead before executing any high-stakes, emotion-driven request.",
        "step_4": "SYSTEMIC GOVERNANCE: Implement automated dual-approval gates in financial and identity workflows to eliminate single-person psychological failure points.",
        "checklist": [
            {"id": "c1", "label": "Detect Fear & Intimidation", "detail": "Spot threats of legal action, account termination, or executive reprimand."},
            {"id": "c2", "label": "Detect Greed & Rewards", "detail": "Spot gift card giveaways, surprise bonuses, and unearned cash rewards."},
            {"id": "c3", "label": "Mandatory 10-Minute Cooldown", "detail": "Take a 10-minute pause before acting on urgent financial/credential prompts."}
        ],
        "official_standards": ["NIST SP 800-53 (AT-3 Security Training)", "ISO 27001:2022 A.6.3"],
        "mitre_techniques": ["T1598 (Social Engineering)", "T1566 (Phishing)"],
        "incident_response_action": "Escalate psychological coercion vectors to security-awareness-team@company.internal."
    },
    {
        "code": "COURSE-06-CYBER-ATTACK-TYPES",
        "title": "🌐 Common Cyber Attack Types (Phishing, Ransomware & MITM)",
        "sop_title": "Multi-Vector Cyber Threat Classification & Incident Playbook",
        "severity": "P2 - HIGH RISK / IDENTITY TARGET",
        "strategic_objective": "Equip employees to rapidly distinguish between primary threat vectors (credential phishing, ransomware loaders, Adversary-in-the-Middle) and invoke the corresponding containment protocol.",
        "step_1": "THREAT VECTOR IDENTIFICATION: Categorize the incoming vector (Credential Harvesting Portal, Weaponized Macro File, Man-in-the-Middle Proxy, or Ransomware Dropper).",
        "step_2": "TACTICAL ISOLATION: For suspect downloads, sever local network connection (disconnect Wi-Fi/Ethernet) to prevent lateral C2 beaconing.",
        "step_3": "SOC INCIDENT DISPATCH: Open a high-priority ticket with the Security Operations Center detailing attack vector indicators.",
        "step_4": "ENDPOINT SEGMENTATION: Enforce host micro-segmentation, disable SMBv1, and block lateral RPC movement across workstation subnets.",
        "checklist": [
            {"id": "c1", "label": "Ransomware Vector Check", "detail": "Never enable macros in Office files or run untrusted executable scripts."},
            {"id": "c2", "label": "MITM Vector Check", "detail": "Verify browser address bar TLS certificate issuer and exact domain spelling."},
            {"id": "c3", "label": "Rapid Physical Isolation", "detail": "Unplug Ethernet and disconnect Wi-Fi if a suspicious file is executed."}
        ],
        "official_standards": ["NIST SP 800-61 Rev 2 (Computer Security Incident Handling)", "CISA CPG 2.B", "MITRE ATT&CK Enterprise Matrix"],
        "mitre_techniques": ["T1486 (Data Encrypted for Impact)", "T1557 (Adversary-in-the-Middle)", "T1566 (Phishing)"],
        "incident_response_action": "Run command: powershell -Command \"Disable-NetAdapter -Name * -Confirm:$false\" if malware is executed."
    },
    {
        "code": "COURSE-07-AWARENESS-FUNDAMENTALS",
        "title": "📚 Security Awareness Fundamentals: Defense-in-Depth",
        "sop_title": "Defense-in-Depth Personal Security Framework SOP",
        "severity": "P4 - OPERATIONAL HYGIENE",
        "strategic_objective": "Establish a layered personal security posture across endpoint, email, credentials, and physical workspace to ensure no single failure allows compromise.",
        "step_1": "LAYERED HYGIENE: Maintain separate complex passphrases, require FIDO2 hardware MFA, and enable automatic screen timeout locks.",
        "step_2": "SUSPICION THRESHOLD: Apply zero-trust skepticism to inbound communications regardless of whether they arrive via Email, Slack, Teams, or SMS.",
        "step_3": "CONTINUOUS LEARNING: Complete monthly threat simulation drills and review quarterly SOC threat intelligence bulletins.",
        "step_4": "ENTERPRISE AUDIT & TELEMETRY: Aggregate endpoint EDR telemetry and mail gateway logs into the central SIEM for proactive threat hunting.",
        "checklist": [
            {"id": "c1", "label": "Screen Lock Habit", "detail": "Lock screen (Win+L / Cmd+Ctrl+Q) whenever leaving workstation unattended."},
            {"id": "c2", "label": "Hardware MFA Bound", "detail": "Ensure primary accounts utilize FIDO2 YubiKey or Authenticator Number Matching."},
            {"id": "c3", "label": "Clean Physical Desk", "detail": "Store paper documents containing PII in locked drawers at close of business."}
        ],
        "official_standards": ["NIST CSF 2.0 PR.AT-01", "ISO/IEC 27001:2022 A.7.7", "CIS Control 14"],
        "mitre_techniques": ["M1017 (User Training)", "M1036 (Multi-factor Authentication)"],
        "incident_response_action": "Contact IT helpdesk to audit active sign-in sessions and enrolled MFA hardware tokens."
    },
    {
        "code": "COURSE-08-ORGANIZATIONAL-ROLE",
        "title": "🏢 Your Role as a Human Firewall & First Responder",
        "sop_title": "Human Firewall & First-Responder Incident Triage SOP",
        "severity": "P3 - MEDIUM / RECONNAISSANCE",
        "strategic_objective": "Empower front-line personnel to act as first responders, drastically compressing the mean time to detect (MTTD) and mean time to respond (MTTR) across the enterprise.",
        "step_1": "SENSOR ACTIVATION: Treat every anomalous message, unexpected MFA prompt, or unusual system behavior as an actionable security event.",
        "step_2": "NO PENALTY DISCLOSURE: Report genuine mistakes (clicking a link or entering credentials) immediately without fear of reprisal—time is critical.",
        "step_3": "PEER BROADCAST: Alert immediate department colleagues if a widespread organizational phishing wave is hitting inboxes.",
        "step_4": "RAPID INCIDENT CONTAINMENT: Security automation instantly purges reported malicious emails from all company mailboxes via Microsoft Graph / Google Workspace API.",
        "checklist": [
            {"id": "c1", "label": "Immediate Self-Reporting", "detail": "Report accidental clicks within 60 seconds to enable rapid session revocation."},
            {"id": "c2", "label": "Department Triage Alert", "detail": "Notify team members on Slack/Teams about active phishing campaigns."},
            {"id": "c3", "label": "Preserve Forensic Evidence", "detail": "Do not delete phishing emails before forwarding original RFC headers to the SOC."}
        ],
        "official_standards": ["NIST SP 800-61 Rev 2 Section 3.2", "ISO/IEC 27001:2022 A.5.25", "CISA CPG 1.C"],
        "mitre_techniques": ["M1017 (User Training)", "D3FEND D3-EDA (Email Domain Analysis)"],
        "incident_response_action": "Call Enterprise SOC Emergency Hotline: (555) 019-9000 ext 1 or post in #sec-incidents."
    },
    {
        "code": "COURSE-09-WHAT-ATTACKERS-WANT",
        "title": "💰 What Attackers Want: Credentials, PII & Money",
        "sop_title": "Critical Asset & Sensitive PII Protection Playbook",
        "severity": "P2 - HIGH RISK / IDENTITY TARGET",
        "strategic_objective": "Safeguard corporate crown jewels (Active Directory credentials, customer PII, trade secrets, financial accounts) against adversary exfiltration.",
        "step_1": "DATA CLASSIFICATION CHECK: Identify data sensitivity (Public, Internal, Confidential, Restricted) before sharing or transmitting.",
        "step_2": "ENCRYPTED TRANSMISSION: Never email unencrypted spreadsheets containing Social Security Numbers, banking details, or source code.",
        "step_3": "REVOKE UNNECESSARY ACCESS: Regularly audit and drop permissions to cloud repositories and database records you no longer actively need.",
        "step_4": "DATA LOSS PREVENTION (DLP): Automated DLP filters block outbound transmission of unencrypted PII, API tokens, and payment card data.",
        "checklist": [
            {"id": "c1", "label": "DLP Classification Tagging", "detail": "Apply Sensitivity Labels (e.g. 'Restricted - Financial') to all sensitive files."},
            {"id": "c2", "label": "No Cloud Shadow IT", "detail": "Never upload corporate files to unauthorized personal cloud drives (Dropbox, personal GDrive)."},
            {"id": "c3", "label": "Zero Plaintext Secrets", "detail": "Never store corporate passwords or API keys in unencrypted text files or spreadsheets."}
        ],
        "official_standards": ["NIST SP 800-122 (Guide to Protecting PII)", "PCI-DSS v4.0 Req 3", "HIPAA 45 CFR §164.312"],
        "mitre_techniques": ["T1552 (Unsecured Credentials)", "T1005 (Data from Local System)", "T1567 (Exfiltration Over Web Service)"],
        "incident_response_action": "Notify data-privacy@company.internal if unauthorized PII transfer or database exfiltration occurs."
    },
    {
        "code": "COURSE-10-RECOGNIZING-SUSPICIOUS",
        "title": "👁️ Recognizing Suspicious Behavior: The Instinct Test",
        "sop_title": "Threat Indicator Triangulation & Red-Flag Escalation SOP",
        "severity": "P3 - MEDIUM / RECONNAISSANCE",
        "strategic_objective": "Develop advanced threat pattern recognition skills to detect subtle incongruities across sender reputation, message context, and payload signatures.",
        "step_1": "TRIANGULATE 3 RED FLAGS: Evaluate Sender Domain + Urgency Level + Unusual Call to Action. If 2 or more match, classify as high-confidence threat.",
        "step_2": "INDEPENDENT REACH-OUT: Contact the supposed sender via an established channel (Slack/phone) to ask: 'Did you just send this request?'",
        "step_3": "SOC PHISH SUBMISSION: Submit the email through the enterprise phishing add-in to trigger automated dynamic detonation in the sandbox.",
        "step_4": "MAIL GATEWAY ML TUNING: Machine learning models at the mail gateway update sender reputation scoring based on aggregated employee reporting.",
        "checklist": [
            {"id": "c1", "label": "Sender Address Incongruity", "detail": "Check if sender domain matches the organization they claim to represent."},
            {"id": "c2", "label": "Unusual Tone / Request", "detail": "Flag requests that deviate from normal business communication patterns."},
            {"id": "c3", "label": "Coercive Urgency", "detail": "Identify artificial pressure designed to bypass standard approvals."}
        ],
        "official_standards": ["NIST SP 800-53 AT-2", "ISO 27001:2022 A.5.25", "CISA CPG 1.C"],
        "mitre_techniques": ["T1566 (Phishing)", "T1598 (Social Engineering)"],
        "incident_response_action": "Submit suspected phishing sample to automated quarantine analyzer at security.internal/submit."
    }
]

print(f"Loaded {len(courses)} base courses in script.")
