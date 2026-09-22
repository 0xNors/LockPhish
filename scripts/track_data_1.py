# scripts/track_data_1.py
# Tracks 1 to 4: Courses 01 to 40

def load_track_1(add):
    # --- TRACK 1: SECURITY FOUNDATIONS (01 - 10) ---
    add("COURSE-01-CYBER-BASICS", "🛡️ What Is Cybersecurity & How Attackers Operate", "Enterprise Cyber Threat Surface & Defensive Hygiene SOP", "P4 - OPERATIONAL HYGIENE",
        "Establish fundamental organizational cyber resilience by transforming every employee into an active detection sensor against external social engineering and initial access vectors.",
        "TACTICAL HALT: Pause and evaluate any unsolicited communication requesting actions, file downloads, or credential disclosures.",
        "SENDER ORIGIN VALIDATION: Inspect the actual RFC-822 email headers and verified corporate directory before trusting external communications.",
        "1-CLICK INCIDENT ESCALATION: Submit suspicious artifacts via the Phish Alarm button to notify the SOC within 60 seconds.",
        "ARCHITECTURAL HARDENING: Ensure CrowdStrike/Defender EDR agent is healthy, BitLocker encryption is active, and OS patching is up-to-date.",
        [
            {"id": "c1", "label": "Healthy Skepticism", "detail": "Treat unsolicited messages requesting urgent action with initial skepticism."},
            {"id": "c2", "label": "Identity Directory Cross-Check", "detail": "Cross-reference unknown senders with internal employee registry."},
            {"id": "c3", "label": "Zero Credential Disclosure", "detail": "Never share passwords, OTP tokens, or badge numbers with any external party."},
            {"id": "c4", "label": "SOC Alert Dispatch", "detail": "Forward phishing messages to trigger automated firewall link blacklisting."}
        ],
        ["NIST CSF 2.0 GV.PO-01", "ISO/IEC 27001:2022 A.5.25", "CIS Control 14.1 (Security Awareness)"],
        ["T1566 (Phishing)", "T1598 (Social Engineering)"],
        "Forward message to soc-phishing@company.internal with full original email headers."
    )

    add("COURSE-02-PHISHING-INTRO", "🎣 What Is Phishing? Core Concepts & Attack Mechanics", "Standard Operating Procedure: Inbound Email Phishing Triage", "P2 - HIGH RISK / IDENTITY TARGET",
        "Deconstruct deceptive email lures by identifying artificial urgency, forged branding, and masked hyperlinks before credential harvesting or malware staging occurs.",
        "TACTICAL FREEZE: Do not click embedded links, download files, or respond to sender prompts.",
        "HYPERLINK & SENDER FORENSICS: Hover over hyperlinks to inspect the true root domain. Compare sender address with legitimate corporate records.",
        "DISPATCH SOC ALERT: Forward as an RFC-822 attachment or click 'Report Phishing' in Outlook/Gmail to trigger gateway-wide link neutralization.",
        "TECHNICAL DEFENSE: Inbound Secure Email Gateway (SEG) URL rewriting, SPF/DKIM verification, and browser isolation sandboxing.",
        [
            {"id": "c1", "label": "Hyperlink Destination Preview", "detail": "Hover over all links to confirm true domain matches official company endpoints."},
            {"id": "c2", "label": "Generic Greeting Alert", "detail": "Flag messages using 'Dear Customer' or 'Dear Employee' without your specific name."},
            {"id": "c3", "label": "Urgency Pressure Check", "detail": "Treat 24-hour expiration ultimatums as high-confidence malicious indicators."},
            {"id": "c4", "label": "1-Click Report Dispatched", "detail": "Submit to SOC to enable automated URL block across the corporate firewall."}
        ],
        ["NIST SP 800-177 (Email Trust)", "CISA CPG 1.C", "ISO/IEC 27001:2022 A.8.7"],
        ["T1566.002 (Spearphishing Link)", "T1204.001 (User Execution - Malicious Link)"],
        "Forward message to soc-phishing-queue@company.internal and isolate browser tab."
    )

    add("COURSE-03-TARGET-EMPLOYEE", "🎯 Why Employees Are Targeted (The Human Attack Surface)", "Role-Based Threat Modeling & Targeted Persona Protection SOP", "P3 - MEDIUM / RECONNAISSANCE",
        "Harden high-visibility employee roles (HR, Finance, Executive Admins) against bespoke spearphishing attacks derived from open-source intelligence.",
        "ROLE-AWARENESS AUDIT: Recognize when your job role (e.g. Accounts Payable, HR Manager) makes you a primary target for targeted deception.",
        "CROSS-CHECK UNEXPECTED INSTRUCTIONS: Validate any request touching wire accounts, payroll records, or sensitive contracts through independent verified internal channels.",
        "NOTIFY DEPARTMENT LEADERSHIP: Alert your security manager if you receive hyper-personalized phishing targeting specific corporate projects.",
        "ENTERPRISE ACCESS RESTRICTION: Apply Least Privilege Access (RBAC) and strict Conditional Access policies to high-value administrative accounts.",
        [
            {"id": "c1", "label": "Public Profile OpSec Check", "detail": "Audit LinkedIn/social profiles for sensitive internal software or hierarchy details."},
            {"id": "c2", "label": "Out-of-Band Cross Check", "detail": "Always verify unusual executive instructions via direct phone or internal Slack."},
            {"id": "c3", "label": "Targeted Incident Log", "detail": "Log any spearphishing attempt with the security operations center."}
        ],
        ["NIST SP 800-53 (AC-6 Least Privilege)", "ISO 27001:2022 A.6.1", "CIS Control 6.1"],
        ["T1589 (Gather Victim Identity Info)", "T1598 (Social Engineering)"],
        "Report spearphishing campaigns to threat-intel@company.internal for adversary infrastructure takedown."
    )

    add("COURSE-04-SOCIAL-ENGINEERING", "🧠 How Social Engineering Works: Manipulation & Trust", "Social Engineering Psychological Interruption & Defusal SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Disrupt manipulative psychological tactics (authority, scarcity, urgency, flattery) by enforcing standard verification procedures over emotional reactions.",
        "EMOTIONAL TRIAGE: If a request triggers acute panic, excitement, or fear of reprimand, immediately halt all compliance.",
        "SEPARATION OF AUTHORITY: Disregard perceived rank or authority when standard security protocols (dual sign-off, ticketing) are bypassed.",
        "EXECUTE MANDATORY CALLBACK: Contact the requesting party using verified internal extension directory data—never use numbers provided in the message.",
        "PROCEDURAL POLICY BACKSTOP: Corporate policy strictly immunizes employees who enforce verification against disciplinary action from angry requesters.",
        [
            {"id": "c1", "label": "Identify Emotional Triggers", "detail": "Recognize when pressure tactics are being applied to override your judgment."},
            {"id": "c2", "label": "Adhere to Policy Over Emotion", "detail": "No executive rank justifies bypassing established security authorization flows."},
            {"id": "c3", "label": "Internal Directory Validation", "detail": "Verify identities using trusted internal company directories only."}
        ],
        ["NIST SP 800-53 (AT-2 Security Awareness)", "ISO/IEC 27001:2022 A.6.3", "CISA Cross-Sector CPGs"],
        ["T1598 (Phishing for Information)", "T1204 (User Execution)"],
        "Report coercion attempts to hr-security-joint-desk@company.internal."
    )

    add("COURSE-05-HUMAN-PSYCHOLOGY", "🎭 Human Psychology Behind Scams: Fear, Greed & Authority", "Cognitive Bias Shield & Emotional De-escalation Protocol", "P3 - MEDIUM / RECONNAISSANCE",
        "Train personnel to detect systemic cognitive exploits (authority bias, urgency heuristic, FOMO, sunk cost) and systematically neutralize attacker framing.",
        "COGNITIVE FREEZE: Recognize the psychological trigger (fear of termination, executive flattery, time-limited reward).",
        "OBJECTIVE FACT CHECK: Separate the emotional tone from the objective factual request. Ask: 'Would a legitimate process demand this specific shortcut?'",
        "COLLEAGUE SECOND OPINION: Consult a peer or team lead before executing any high-stakes, emotion-driven request.",
        "SYSTEMIC GOVERNANCE: Implement automated dual-approval gates in financial and identity workflows to eliminate single-person psychological failure points.",
        [
            {"id": "c1", "label": "Detect Fear & Intimidation", "detail": "Spot threats of legal action, account termination, or executive reprimand."},
            {"id": "c2", "label": "Detect Greed & Rewards", "detail": "Spot gift card giveaways, surprise bonuses, and unearned cash rewards."},
            {"id": "c3", "label": "Mandatory 10-Minute Cooldown", "detail": "Take a 10-minute pause before acting on urgent financial/credential prompts."}
        ],
        ["NIST SP 800-53 (AT-3 Security Training)", "ISO 27001:2022 A.6.3"],
        ["T1598 (Social Engineering)", "T1566 (Phishing)"],
        "Escalate psychological coercion vectors to security-awareness-team@company.internal."
    )

    add("COURSE-06-CYBER-ATTACK-TYPES", "🌐 Common Cyber Attack Types (Phishing, Ransomware & MITM)", "Multi-Vector Cyber Threat Classification & Incident Playbook", "P2 - HIGH RISK / IDENTITY TARGET",
        "Equip employees to rapidly distinguish between primary threat vectors (credential phishing, ransomware loaders, Adversary-in-the-Middle) and invoke the corresponding containment protocol.",
        "THREAT VECTOR IDENTIFICATION: Categorize the incoming vector (Credential Harvesting Portal, Weaponized Macro File, Man-in-the-Middle Proxy, or Ransomware Dropper).",
        "TACTICAL ISOLATION: For suspect downloads, sever local network connection (disconnect Wi-Fi/Ethernet) to prevent lateral C2 beaconing.",
        "SOC INCIDENT DISPATCH: Open a high-priority ticket with the Security Operations Center detailing attack vector indicators.",
        "ENDPOINT SEGMENTATION: Enforce host micro-segmentation, disable SMBv1, and block lateral RPC movement across workstation subnets.",
        [
            {"id": "c1", "label": "Ransomware Vector Check", "detail": "Never enable macros in Office files or run untrusted executable scripts."},
            {"id": "c2", "label": "MITM Vector Check", "detail": "Verify browser address bar TLS certificate issuer and exact domain spelling."},
            {"id": "c3", "label": "Rapid Physical Isolation", "detail": "Unplug Ethernet and disconnect Wi-Fi if a suspicious file is executed."}
        ],
        ["NIST SP 800-61 Rev 2 (Computer Security Incident Handling)", "CISA CPG 2.B", "MITRE ATT&CK Enterprise Matrix"],
        ["T1486 (Data Encrypted for Impact)", "T1557 (Adversary-in-the-Middle)", "T1566 (Phishing)"],
        "Run command: powershell -Command \"Disable-NetAdapter -Name * -Confirm:$false\" if malware is executed."
    )

    add("COURSE-07-AWARENESS-FUNDAMENTALS", "📚 Security Awareness Fundamentals: Defense-in-Depth", "Defense-in-Depth Personal Security Framework SOP", "P4 - OPERATIONAL HYGIENE",
        "Establish a layered personal security posture across endpoint, email, credentials, and physical workspace to ensure no single failure allows compromise.",
        "LAYERED HYGIENE: Maintain separate complex passphrases, require FIDO2 hardware MFA, and enable automatic screen timeout locks.",
        "SUSPICION THRESHOLD: Apply zero-trust skepticism to inbound communications regardless of whether they arrive via Email, Slack, Teams, or SMS.",
        "CONTINUOUS LEARNING: Complete monthly threat simulation drills and review quarterly SOC threat intelligence bulletins.",
        "ENTERPRISE AUDIT & TELEMETRY: Aggregate endpoint EDR telemetry and mail gateway logs into the central SIEM for proactive threat hunting.",
        [
            {"id": "c1", "label": "Screen Lock Habit", "detail": "Lock screen (Win+L / Cmd+Ctrl+Q) whenever leaving workstation unattended."},
            {"id": "c2", "label": "Hardware MFA Bound", "detail": "Ensure primary accounts utilize FIDO2 YubiKey or Authenticator Number Matching."},
            {"id": "c3", "label": "Clean Physical Desk", "detail": "Store paper documents containing PII in locked drawers at close of business."}
        ],
        ["NIST CSF 2.0 PR.AT-01", "ISO/IEC 27001:2022 A.7.7", "CIS Control 14"],
        ["M1017 (User Training)", "M1036 (Multi-factor Authentication)"],
        "Contact IT helpdesk to audit active sign-in sessions and enrolled MFA hardware tokens."
    )

    add("COURSE-08-ORGANIZATIONAL-ROLE", "🏢 Your Role as a Human Firewall & First Responder", "Human Firewall & First-Responder Incident Triage SOP", "P3 - MEDIUM / RECONNAISSANCE",
        "Empower front-line personnel to act as first responders, drastically compressing the mean time to detect (MTTD) and mean time to respond (MTTR) across the enterprise.",
        "SENSOR ACTIVATION: Treat every anomalous message, unexpected MFA prompt, or unusual system behavior as an actionable security event.",
        "NO PENALTY DISCLOSURE: Report genuine mistakes (clicking a link or entering credentials) immediately without fear of reprisal—time is critical.",
        "PEER BROADCAST: Alert immediate department colleagues if a widespread organizational phishing wave is hitting inboxes.",
        "RAPID INCIDENT CONTAINMENT: Security automation instantly purges reported malicious emails from all company mailboxes via Microsoft Graph / Google Workspace API.",
        [
            {"id": "c1", "label": "Immediate Self-Reporting", "detail": "Report accidental clicks within 60 seconds to enable rapid session revocation."},
            {"id": "c2", "label": "Department Triage Alert", "detail": "Notify team members on Slack/Teams about active phishing campaigns."},
            {"id": "c3", "label": "Preserve Forensic Evidence", "detail": "Do not delete phishing emails before forwarding original RFC headers to the SOC."}
        ],
        ["NIST SP 800-61 Rev 2 Section 3.2", "ISO/IEC 27001:2022 A.5.25", "CISA CPG 1.C"],
        ["M1017 (User Training)", "D3FEND D3-EDA (Email Domain Analysis)"],
        "Call Enterprise SOC Emergency Hotline: (555) 019-9000 ext 1 or post in #sec-incidents."
    )

    add("COURSE-09-WHAT-ATTACKERS-WANT", "💰 What Attackers Want: Credentials, PII & Money", "Critical Asset & Sensitive PII Protection Playbook", "P2 - HIGH RISK / IDENTITY TARGET",
        "Safeguard corporate crown jewels (Active Directory credentials, customer PII, trade secrets, financial accounts) against adversary exfiltration.",
        "DATA CLASSIFICATION CHECK: Identify data sensitivity (Public, Internal, Confidential, Restricted) before sharing or transmitting.",
        "ENCRYPTED TRANSMISSION: Never email unencrypted spreadsheets containing Social Security Numbers, banking details, or source code.",
        "REVOKE UNNECESSARY ACCESS: Regularly audit and drop permissions to cloud repositories and database records you no longer actively need.",
        "DATA LOSS PREVENTION (DLP): Automated DLP filters block outbound transmission of unencrypted PII, API tokens, and payment card data.",
        [
            {"id": "c1", "label": "DLP Classification Tagging", "detail": "Apply Sensitivity Labels (e.g. 'Restricted - Financial') to all sensitive files."},
            {"id": "c2", "label": "No Cloud Shadow IT", "detail": "Never upload corporate files to unauthorized personal cloud drives (Dropbox, personal GDrive)."},
            {"id": "c3", "label": "Zero Plaintext Secrets", "detail": "Never store corporate passwords or API keys in unencrypted text files or spreadsheets."}
        ],
        ["NIST SP 800-122 (Guide to Protecting PII)", "PCI-DSS v4.0 Req 3", "HIPAA 45 CFR §164.312"],
        ["T1552 (Unsecured Credentials)", "T1005 (Data from Local System)", "T1567 (Exfiltration Over Web Service)"],
        "Notify data-privacy@company.internal if unauthorized PII transfer or database exfiltration occurs."
    )

    add("COURSE-10-RECOGNIZING-SUSPICIOUS", "👁️ Recognizing Suspicious Behavior: The Instinct Test", "Threat Indicator Triangulation & Red-Flag Escalation SOP", "P3 - MEDIUM / RECONNAISSANCE",
        "Develop advanced threat pattern recognition skills to detect subtle incongruities across sender reputation, message context, and payload signatures.",
        "TRIANGULATE 3 RED FLAGS: Evaluate Sender Domain + Urgency Level + Unusual Call to Action. If 2 or more match, classify as high-confidence threat.",
        "INDEPENDENT REACH-OUT: Contact the supposed sender via an established channel (Slack/phone) to ask: 'Did you just send this request?'",
        "SOC PHISH SUBMISSION: Submit the email through the enterprise phishing add-in to trigger automated dynamic detonation in the sandbox.",
        "MAIL GATEWAY ML TUNING: Machine learning models at the mail gateway update sender reputation scoring based on aggregated employee reporting.",
        [
            {"id": "c1", "label": "Sender Address Incongruity", "detail": "Check if sender domain matches the organization they claim to represent."},
            {"id": "c2", "label": "Unusual Tone / Request", "detail": "Flag requests that deviate from normal business communication patterns."},
            {"id": "c3", "label": "Coercive Urgency", "detail": "Identify artificial pressure designed to bypass standard approvals."}
        ],
        ["NIST SP 800-53 AT-2", "ISO 27001:2022 A.5.25", "CISA CPG 1.C"],
        ["T1566 (Phishing)", "T1598 (Social Engineering)"],
        "Submit suspected phishing sample to automated quarantine analyzer at security.internal/submit."
    )

    # --- TRACK 2: EMAIL SECURITY & HEADERS (11 - 20) ---
    add("COURSE-11-EMAIL-ANATOMY", "📧 Anatomy of a Phishing Email: Breaking Down Headers & Links", "MIME Envelope & RFC-5322 Email Header Forensic SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Examine raw SMTP metadata to uncover discrepancies between the visual Header From, SMTP Envelope From (Return-Path), and connecting IP addresses.",
        "HEADER EXTRACTION: Open email details and inspect raw Message Headers (Authentication-Results, Received-SPF, Return-Path).",
        "REVERSE DNS & IP LOOKUP: Confirm the originating IP in the first Received hop belongs to the legitimate mail infrastructure of the sending organization.",
        "FLAG DISCREPANCIES: If Header From displays a trusted brand but Return-Path indicates an unrelated foreign host, immediately flag as spoofed.",
        "MAIL GATEWAY DMARC FILTER: Enforce DMARC verification at the inbound mail transfer agent (MTA) with strict quarantine rules.",
        [
            {"id": "c1", "label": "Inspect Return-Path", "detail": "Verify Return-Path domain matches the domain in the visible From line."},
            {"id": "c2", "label": "Check Authentication-Results", "detail": "Look for spf=pass, dkim=pass, and dmarc=pass in raw headers."},
            {"id": "c3", "label": "Inspect First Received Hop", "detail": "Check the originating mail server IP address against public WHOIS data."}
        ],
        ["RFC 5322 (Internet Message Format)", "RFC 7489 (DMARC)", "NIST SP 800-177"],
        ["T1566.001 (Spearphishing Attachment)", "T1566.002 (Spearphishing Link)"],
        "Extract full .eml or .msg file and upload to soc-header-analyzer.internal for forensic parsing."
    )

    add("COURSE-12-INSPECT-SENDER", "🔍 How to Inspect an Email Sender & Detect Spoofing", "Display Name Spoofing & Friendly-From Verification SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Unmask Display Name Deception where adversaries name their external mailbox 'CEO Name' or 'IT Helpdesk' while using a disposable third-party address.",
        "EXPAND SENDER BANNER: Hover or click on the display name in the email client to view the full angular bracket address `<user@external-domain.com>`.",
        "EXTERNAL SENDER TAG CHECK: Verify if the message contains the yellow `[EXTERNAL EMAIL]` warning banner despite an internal executive name.",
        "REPORT DISPLAY NAME ABUSE: Forward to the SOC to add the spoofed display name variant to the Secure Email Gateway impersonation filter list.",
        "EXECUTIVE IMPERSONATION PROTECTION: Configure Microsoft Defender Anti-Phishing policy with targeted user protection for all C-suite and VIP executives.",
        [
            {"id": "c1", "label": "Expand Full Email Address", "detail": "Never rely on the friendly display name alone; always inspect the domain after the @ symbol."},
            {"id": "c2", "label": "Inspect External Mail Tags", "detail": "Check for system-injected external warning banners on messages claiming to be internal."},
            {"id": "c3", "label": "Verify with Real Executive", "detail": "Confirm unexpected executive requests through internal Slack or direct extension."}
        ],
        ["CISA Alert AA20-302A", "NIST SP 800-177 Section 3", "ISO 27001:2022 A.8.7"],
        ["T1566.002 (Spearphishing Link)", "T1598.002 (Spearphishing Service)"],
        "Dispatch alert to soc-spoofing-triage@company.internal to blacklist the rogue external mailbox."
    )

    add("COURSE-13-CHECK-DOMAINS", "🌐 How to Check Email Domains & SPF/DKIM Authentication", "Cryptographic Email Authentication (SPF/DKIM/DMARC) SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Validate cryptographic signatures (DKIM) and DNS publication records (SPF, DMARC) to guarantee domain origin authenticity and reject unauthorized relays.",
        "CHECK AUTHENTICATION-RESULTS: View email header tags for `spf=pass`, `dkim=pass`, and `dmarc=pass`.",
        "VALIDATE DMARC ALIGNMENT: Ensure the domain in the `d=` parameter of the DKIM signature matches the domain in the visible `From:` header.",
        "ESCALATE FAILED AUTHENTICATION: If `dmarc=fail` or `spf=softfail/fail` occurs on an email claiming to be a financial partner, quarantine immediately.",
        "DNS DMARC ENFORCEMENT: Enforce `v=DMARC1; p=reject; sp=reject; pct=100` on all corporate apex and subdomain DNS zones.",
        [
            {"id": "c1", "label": "SPF Pass Verification", "detail": "Confirm sending MTA IP is authorized in the sender SPF TXT record."},
            {"id": "c2", "label": "DKIM Signature Check", "detail": "Verify the public cryptographic key published in DNS validates the email payload."},
            {"id": "c3", "label": "DMARC Policy Enforcement", "detail": "Ensure strict reject policies are applied to misaligned sender domains."}
        ],
        ["RFC 7208 (SPF)", "RFC 6376 (DKIM)", "RFC 7489 (DMARC)", "NIST SP 800-177"],
        ["T1566.002 (Phishing Link)", "T1586.002 (Compromised Email Account)"],
        "Query DNS records using: `dig +short TXT _dmarc.targetdomain.com` and report spoofed domains to SOC."
    )

    add("COURSE-14-SUSPICIOUS-LINKS", "🔗 Suspicious Links 101: Understanding Hyperlinks & Redirects", "Hyperlink Unmasking & Open-Redirect Containment SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Detect concealed redirect chains, URL shorteners (bit.ly, tinyurl), and open redirects on trusted domains used to bypass web reputation engines.",
        "ZERO-CLICK URL PREVIEW: Hover over hyperlinks to inspect destination without clicking. In mobile clients, long-press to view the preview sheet.",
        "SHORTENER UNMASKING: Never navigate directly to shortened URLs; submit to the corporate URL expansion proxy or SOC sandbox.",
        "OPEN REDIRECT DETECTION: Inspect parameters for `?redirect=`, `?url=`, or `?next=https://` indicating abuse of legitimate third-party sites.",
        "WEB CONTENT FILTERING: Enforce enterprise DNS filtering (Cisco Umbrella / Cloudflare Gateway) with real-time URL classification.",
        [
            {"id": "c1", "label": "Hover Preview Mandatory", "detail": "Inspect destination URL before every single click."},
            {"id": "c2", "label": "Unmask Shortened Links", "detail": "Identify and expand bit.ly, tinyurl, and t.co URLs via security proxy."},
            {"id": "c3", "label": "Spot Parameter Redirects", "detail": "Check for secondary target URLs hidden inside query parameters."}
        ],
        ["CISA CPG 1.C", "NIST SP 800-53 SC-7 (Boundary Protection)", "OWASP Top 10 A01 (Broken Access Control)"],
        ["T1204.001 (User Execution: Malicious Link)", "T1566.002 (Spearphishing Link)"],
        "Submit suspected link to url-sandbox.internal/detonate for real-time headless screenshot analysis."
    )

    add("COURSE-15-URL-INSPECTION", "🔗 URL Inspection Masterclass: Subdomains vs Root Domains", "Fully Qualified Domain Name (FQDN) Structural Dissection SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Master structural URL analysis to identify the true controlling root domain, exposing subdomain prefix masquerading and port obfuscation.",
        "ISOLATE PROTOCOL & HOST: Locate the first single forward slash `/` following `https://`. Everything preceding it is the Fully Qualified Domain Name (FQDN).",
        "LOCATE TRUE ROOT DOMAIN: Read backwards from the first single forward slash to identify the Top-Level Domain (e.g. .com) and the single word immediately to its left.",
        "UNMASK SUBDOMAIN CAMOUFLAGE: Recognize that `login.microsoft.com.attacker-server.net` is owned entirely by `attacker-server.net`, NOT Microsoft.",
        "BROWSER DOMAIN HIGHLIGHTING: Deploy browser policies that bold the registrable root domain in the address bar for all managed endpoints.",
        [
            {"id": "c1", "label": "Find First Single Slash", "detail": "Identify the exact boundary where the domain ends and the path begins."},
            {"id": "c2", "label": "Isolate Root vs Subdomain", "detail": "Verify the word immediately preceding .com/.net is the authentic corporate name."},
            {"id": "c3", "label": "Check for Port Obfuscation", "detail": "Flag unexpected non-standard port numbers (e.g. :8443 or :8080) on login links."}
        ],
        ["RFC 3986 (URI Generic Syntax)", "Public Suffix List (PSL)", "NIST SP 800-63B"],
        ["T1566.002 (Spearphishing Link)", "T1583.001 (Domains)"],
        "Copy raw URL to SOC Domain Triage Portal at sec-tools.internal/domain-check."
    )

    add("COURSE-16-LOOKALIKE-DOMAINS", "🪞 Lookalike Domains & IDN Homograph Character Attacks", "IDN Homograph & Unicode Punycode (xn--) Detection SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Neutralize Internationalized Domain Name (IDN) homoglyph attacks where Cyrillic or Greek characters visually clone Latin company brand names.",
        "PUNYCODE INSPECTION: Paste suspicious URLs into the browser address bar or text editor to observe if it converts into a `xn--` prefix string.",
        "CHARACTER GLYPH SCRUTINY: Look for subtle typographic anomalies (e.g. Cyrillic `а` instead of Latin `a`, dotted `ı`, or foreign diacritics).",
        "REPORT HOMOGRAPH FRAUD: Immediately report the domain to the SOC threat intelligence team for registrar takedown notice dispatch.",
        "GATEWAY PUNYCODE BLOCKING: Enforce gateway-level blocking of inbound emails and web navigation to IDN domains matching high-value internal brand keywords.",
        [
            {"id": "c1", "label": "Convert to Punycode", "detail": "Check if domain translates to xn-- format in browser address bar."},
            {"id": "c2", "label": "Visual Glyph Comparison", "detail": "Inspect characters for slight variations in kerning, height, or accents."},
            {"id": "c3", "label": "Manual Bookmark Fallback", "detail": "Never follow external links for high-security portals; use manual bookmarks."}
        ],
        ["RFC 3490 (IDN in Applications)", "Unicode Technical Report #36", "NIST SP 800-63B"],
        ["T1583.001 (Domains)", "T1566.002 (Phishing Link)"],
        "Dispatch abuse complaint to registrar WHOIS abuse contact and block Punycode string in firewall."
    )

    add("COURSE-17-TYPOSQUATTING", "⌨️ Typosquatting & Combosquatting: Spotting Misspelled Brands", "Typosquatted & Combosquatted Domain Defense SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Identify subtle brand variations (transposed letters, omitted dots, added terms like -support, -auth, -security) designed to exploit hurried readers.",
        "CHARACTER-BY-CHARACTER AUDIT: Carefully read domain spelling letter by letter (e.g. `micros0ft.com`, `paypa1.com`, `company-sso-login.com`).",
        "COMBOSQUATTING DETECTION: Flag corporate brand names combined with deceptive security keywords (e.g. `okta-verify-auth.net` instead of `okta.com`).",
        "REPORT BRAND INFRINGEMENT: Notify the corporate legal and security teams to initiate ICANN Uniform Domain-Name Dispute-Resolution (UDRP) proceedings.",
        "PROACTIVE DOMAIN DEFENSE: Security automation continuously monitors Certificate Transparency logs for newly registered domains containing company trademarks.",
        [
            {"id": "c1", "label": "Character Transposition Check", "detail": "Spot swapped letters (e.g. mcirosoft instead of microsoft)."},
            {"id": "c2", "label": "Number Substitution Check", "detail": "Spot zero for O or one for L (e.g. g00gle or appl1e)."},
            {"id": "c3", "label": "Combosquatting Keyword Check", "detail": "Flag hyphenated words like company-auth, company-portal, company-helpdesk."}
        ],
        ["ICANN UDRP Guidelines", "CISA Cyber Hygiene Services", "ISO/IEC 27001:2022 A.8.7"],
        ["T1583.001 (Domains)", "T1566.002 (Spearphishing Link)"],
        "Submit combosquatted domain to registrar abuse desk and push block rule to SIEM/EDR."
    )

    add("COURSE-18-URGENCY-FEAR", "⏰ Urgency and Fear Tactics: Why Attackers Force 24-Hour Deadlines", "Psychological Time-Pressure & Fear Manipulation Defusal SOP", "P3 - MEDIUM / RECONNAISSANCE",
        "Neutralize high-pressure emotional intimidation tactics (threats of termination, legal prosecution, 24-hour account deletion) by enforcing mandatory procedural pauses.",
        "EMOTIONAL DECELERATION: Recognize manufactured countdowns ('2 HOURS REMAINING', 'FINAL NOTICE BEFORE SUSPENSION') as attacker pressure tactics.",
        "POLICY SANCTUARY: Remind yourself that authentic enterprise IT policies provide grace periods and formal ticketing channels—never immediate lockout threats.",
        "INDEPENDENT STATUS CHECK: Log into your bookmarked employee dashboard to verify account standing without clicking email links.",
        "SOC THREAT ESCALATION: Report the psychological intimidation attempt to security operations for threat actor campaign profiling.",
        [
            {"id": "c1", "label": "Identify Countdown Clocks", "detail": "Flag emails featuring urgent countdown banners or 24-hour ultimatums."},
            {"id": "c2", "label": "Enforce 10-Minute Freeze", "detail": "Do not click or reply within the first 10 minutes of receiving an alarming notice."},
            {"id": "c3", "label": "Direct Portal Verification", "detail": "Check account health via bookmarked official company URLs."}
        ],
        ["NIST SP 800-53 AT-2", "ISO/IEC 27001:2022 A.6.3", "CISA CPG 1.C"],
        ["T1598 (Social Engineering)", "T1566 (Phishing)"],
        "Report urgent scareware email to phishing-incident-response@company.internal."
    )

    add("COURSE-19-FAKE-ACCOUNT-ALERTS", "🚨 Fake Account Alerts: Spotting False 'Password Expired' Warnings", "Spoofed Account Suspension & Security Alert Triage SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Prevent credential harvesting caused by deceptive 'Storage Full', 'Unauthorized Login Detected', or 'Account Suspended' popups and email notices.",
        "HALT UNVERIFIED LOGINS: Never enter credentials on web pages reached through unsolicited account alert emails.",
        "AUTHENTIC PORTAL CHECK: Open a new tab, navigate to the official service (e.g. portal.office.com, workday.com) using your bookmarks, and check notifications.",
        "FORWARD FOR GATEWAY PURGE: Submit the alert to the SOC to trigger tenant-wide email purge for all recipients.",
        "CONDITIONAL ACCESS ENFORCEMENT: Enforce Entra ID / Okta Conditional Access requiring compliant managed devices and trusted IP ranges for all logins.",
        [
            {"id": "c1", "label": "Never Click 'Fix Now'", "detail": "Do not click embedded 'Resolve Suspension' or 'Upgrade Storage' buttons."},
            {"id": "c2", "label": "Check Official Notification Hub", "detail": "Inspect genuine in-app notification centers on bookmarked websites."},
            {"id": "c3", "label": "Report Fake Alert", "detail": "Use 1-click report to trigger automated tenant mailbox remediation."}
        ],
        ["NIST SP 800-63B (Digital Identity)", "CISA CPG 2.B", "ISO 27001:2022 A.8.5"],
        ["T1566.002 (Spearphishing Link)", "T1078 (Valid Accounts)"],
        "Notify SOC to inspect mailbox access logs for unauthorized foreign IP sign-in attempts."
    )

    add("COURSE-20-PASSWORD-EXPIRATION", "🔑 Password Expiration Phishing: The 'Keep Current Password' Trap", "Password Expiration Phishing & Identity Trap Neutralization SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Neutralize the classic 'Your password expires in 2 hours - Click here to keep current password' lure, which defies standard cryptographic password rotation principles.",
        "LOGICAL POLICY CHECK: Understand that legitimate identity systems require choosing a NEW password upon expiration; 'keeping current password' is an attacker lure.",
        "USE CTRL+ALT+DEL OR SSO PORTAL: Change passwords exclusively through operating system settings (Ctrl+Alt+Del) or your bookmarked enterprise Self-Service Password Reset (SSPR) portal.",
        "SOC CREDENTIAL REPORT: Report the message immediately. If credentials were submitted, initiate emergency password revocation.",
        "FIDO2 PASSWORDLESS TRANSITION: Transition organization from passwords to phishing-resistant FIDO2 passkeys, eliminating credential harvesting entirely.",
        [
            {"id": "c1", "label": "Recognize 'Keep Current' Trap", "detail": "Flag any email offering to let you keep your expiring password as 100% fraudulent."},
            {"id": "c2", "label": "Native OS Password Reset", "detail": "Rotate passwords using Win+Ctrl+Alt+Del or system settings only."},
            {"id": "c3", "label": "Immediate Token Revocation", "detail": "If you typed your password, alert SOC immediately for token invalidation."}
        ],
        ["NIST SP 800-63B Section 5.1.1 (Memorized Secrets)", "CISA Phishing-Resistant MFA Guide", "PCI-DSS v4.0 Req 8.3"],
        ["T1566.002 (Spearphishing Link)", "T1078 (Valid Accounts)"],
        "Trigger self-service password reset at identity.company.internal/reset and terminate active sessions."
    )

    # --- TRACK 3: SAAS, CLOUD & BEC (21 - 30) ---
    add("COURSE-21-FAKE-M365-NOTICES", "☁️ Fake Microsoft 365 Notifications & OneDrive Quotas", "Microsoft 365 Tenant Spoofing & Cloud Service Impersonation SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Detect spoofed OneDrive, SharePoint, and Teams notification emails that route users to Adversary-in-the-Middle reverse proxy portals.",
        "TENANT SENDER AUDIT: Verify sender address ends in `@microsoft.com`, `@sharepointonline.com`, or your verified corporate domain—not disposable webmail.",
        "CLOUD HUB INSPECTION: Access OneDrive or SharePoint directly via `portal.office.com` to verify shared file alerts or quota notifications.",
        "REPORT CLOUD PHISH: Dispatch alert to the Microsoft 365 Defender tenant quarantine to purge identical messages enterprise-wide.",
        "ENTRA ID CONDITIONAL ACCESS: Enforce device compliance rules so logins are rejected on unmanaged external browsers.",
        [
            {"id": "c1", "label": "Verify Tenant Origin", "detail": "Inspect full sender domain to confirm authentic Microsoft tenant infrastructure."},
            {"id": "c2", "label": "Check In-App Sharing Hub", "detail": "Open genuine OneDrive web app to confirm document sharing."},
            {"id": "c3", "label": "1-Click Defender Report", "detail": "Submit to Microsoft Defender for Office 365 automated investigation."}
        ],
        ["NIST SP 800-63B", "Microsoft Cloud Security Benchmark", "ISO 27001:2022 A.8.5"],
        ["T1566.002 (Spearphishing Link)", "T1539 (Steal Web Session Cookie)"],
        "Run command: `Get-MessageTrace -RecipientAddress user@company.com` to identify related phishing messages."
    )

    add("COURSE-22-FAKE-HR-EMAILS", "👥 Fake HR Emails: Open Enrollment & Benefits Audits", "Human Resources Benefits & PII Exfiltration Defense SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Protect employee PII, Social Security Numbers, and direct deposit details during open enrollment and benefits audit periods against HR impersonators.",
        "BENEFITS PORTAL DIRECT ACCESS: Never fill out external web forms, surveys, or spreadsheets claiming to update corporate benefits.",
        "HR DIRECTORY VERIFICATION: Contact your assigned HR Business Partner via internal Slack or phone directory to confirm benefits audit validity.",
        "REPORT PII HARVESTING: Submit the phishing lure to the SOC and HR Joint Incident Desk immediately.",
        "DATA ENCRYPTION AT REST: HR systems enforce field-level encryption for all employee tax and banking information.",
        [
            {"id": "c1", "label": "No External Form Entry", "detail": "Never input SSN, DOB, or banking details into Google Forms, DocuSign, or Typeform links."},
            {"id": "c2", "label": "HR Portal Bookmarked Access", "detail": "Update benefits exclusively inside bookmarked Workday or BambooHR portals."},
            {"id": "c3", "label": "HR Desk Escalation", "detail": "Confirm unexpected benefits policy changes with your internal HR director."}
        ],
        ["NIST SP 800-122", "HIPAA Privacy Rule", "ISO/IEC 27001:2022 A.8.11"],
        ["T1566.002 (Spearphishing Link)", "T1589 (Gather Victim Identity Info)"],
        "Notify hr-security@company.internal to issue an all-company awareness advisory."
    )

    add("COURSE-23-FAKE-PAYROLL-EMAILS", "💳 Fake Payroll Emails: Direct Deposit Diversions & Banking Freezes", "Direct Deposit Modification & Payroll Diversion Prevention SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Prevent fraudulent direct deposit routing modifications by enforcing out-of-band verification and multi-factor authorization for all banking updates.",
        "HALT EMAIL BANKING CHANGES: Corporate policy strictly forbids accepting direct deposit routing changes via email or text message.",
        "MANDATORY OUT-OF-BAND CALLBACK: Payroll administrators must verbally call the employee on their official company phone number on file before modifying bank details.",
        "NOTIFY PAYROLL FRAUD DESK: If an email requests direct deposit rerouting to a new bank account, immediately alert Payroll and SOC.",
        "SELF-SERVICE MFA LOCK: Banking detail modifications inside Workday/ADP require hardware token step-up authentication and trigger instant email/SMS alerts to the employee.",
        [
            {"id": "c1", "label": "Zero Email Bank Updates", "detail": "Reject all requests to update bank account routing submitted via email."},
            {"id": "c2", "label": "Verbal Identity Confirmation", "detail": "Require live verbal phone confirmation prior to any direct deposit record modification."},
            {"id": "c3", "label": "Self-Service Step-Up MFA", "detail": "Enforce secondary biometric or FIDO2 challenge for financial profile changes."}
        ],
        ["NACHA Operating Rules", "FBI IC3 BEC Advisory", "NIST SP 800-63B AAL3"],
        ["T1566 (Phishing)", "T1589.001 (Credentials)"],
        "Lock payroll profile in Workday and alert internal audit via payroll-security@company.internal."
    )

    add("COURSE-24-FAKE-INVOICES", "🧾 Fake Invoice Emails: Vendor Impersonation & Wire Routing Fraud", "Vendor Payment Verification & Wire Diversion Prevention SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Neutralize multi-million dollar vendor wire fraud schemes where compromised vendor mailboxes request updated payment routing instructions.",
        "FREEZE WIRE MODIFICATIONS: Freeze payment processing immediately when a vendor claims their banking details or routing numbers have changed.",
        "ESTABLISH OUT-OF-BAND CONTACT: Call the known, pre-established vendor accounting representative using numbers from the original vendor contract—NEVER numbers on the new invoice.",
        "DUAL-OFFICER SIGNOFF: Mandate dual authorization (CFO + Controller) with verified callback logs attached before releasing funds.",
        "ERP VENDOR MASTER LOCK: Vendor master file banking changes require a 72-hour automated cooling period and secondary administrative approval.",
        [
            {"id": "c1", "label": "Freeze Payment Routing Changes", "detail": "Never update bank coordinates based solely on an emailed invoice or letterhead."},
            {"id": "c2", "label": "Known-Directory Callback", "detail": "Call the vendor on the original contract phone number to verbally confirm routing changes."},
            {"id": "c3", "label": "Dual-Officer Authorization", "detail": "Obtain written sign-off from two authorized corporate officers."}
        ],
        ["FBI IC3 PSA I-060923-PSA", "NIST SP 800-53 AC-3", "SOX Section 404 Internal Controls"],
        ["T1566 (Phishing)", "T1598 (Social Engineering)"],
        "Contact Commercial Banking Wire Desk to initiate Rapid Wire Recall within 24 hours of suspected fraud."
    )

    add("COURSE-25-FAKE-DELIVERY-NOTICES", "📦 Fake Courier Delivery Notifications: FedEx, UPS & DHL Traps", "Courier & Shipping Lure (FedEx/UPS/USPS) Triage SOP", "P3 - MEDIUM / RECONNAISSANCE",
        "Identify fake package tracking emails and SMS smishing lures demanding customs fee payments or address updates to harvest credit card numbers.",
        "ISOLATE TRACKING NUMBER: Copy the tracking number from the message without clicking any embedded links.",
        "OFFICIAL CARRIER VERIFICATION: Open `fedex.com`, `ups.com`, or `usps.com` directly in your browser and paste the tracking number into the authentic portal.",
        "FLAG CUSTOMS FEE FRAUD: Recognize that legitimate couriers never require gift cards or cryptocurrency to clear standard parcel deliveries.",
        "MAIL GATEWAY BRAND FILTER: Mail gateways scan inbound carrier notifications for unauthorized third-party sender IPs and quarantine lookalikes.",
        [
            {"id": "c1", "label": "Copy Tracking Code Only", "detail": "Never click 'Update Delivery Address' buttons; copy tracking number manually."},
            {"id": "c2", "label": "Official Carrier App Lookup", "detail": "Verify tracking code on genuine carrier website."},
            {"id": "c3", "label": "Reject Fee Payment Prompts", "detail": "Never enter corporate credit card numbers on unverified shipping portals."}
        ],
        ["USPIS Cybercrime Advisory", "CISA CPG 1.C", "FTC Consumer Protection Guidelines"],
        ["T1566.002 (Spearphishing Link)", "T1204.001 (User Execution: Malicious Link)"],
        "Forward delivery phishing lure to abuse@fedex.com or spam@ups.com and notify internal SOC."
    )

    add("COURSE-26-EXECUTIVE-IMPERSONATION", "👔 Executive Impersonation: Spotting CEO Fraud & Urgent Favors", "Executive C-Suite Impersonation & Whaling Defense SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Protect staff against high-pressure executive impersonation demanding urgent gift cards, confidential acquisition files, or emergency wire transfers.",
        "RECOGNIZE WHALING PRETEXT: Spot urgent 'I am in a meeting, need you to do me a favor' emails from CEO/CFO personal Gmail or lookalike addresses.",
        "ENFORCE PROTOCOL OVER PRESSURE: Remind yourself that corporate executives never instruct employees to purchase gift cards or bypass financial controls.",
        "VERBAL / SLACK VERIFICATION: Reach out to the executive directly via internal Slack or call their executive assistant to confirm the communication.",
        "VIP IMPERSONATION FILTERING: Mail gateways automatically flag any external email displaying the display name of executive board members.",
        [
            {"id": "c1", "label": "Zero Gift Card Purchases", "detail": "Corporate executives NEVER request Apple/Google gift cards for business operations."},
            {"id": "c2", "label": "Check Sender Address", "detail": "Confirm whether email is coming from external Gmail/Yahoo vs company domain."},
            {"id": "c3", "label": "Executive Assistant Cross-Check", "detail": "Confirm unusual requests with the executive's chief of staff."}
        ],
        ["FBI IC3 Whaling Bulletin", "NIST SP 800-53 AT-2", "ISO/IEC 27001:2022 A.6.3"],
        ["T1566 (Phishing)", "T1598.002 (Spearphishing Service)"],
        "Dispatch urgent whaling alert to executive-protection@company.internal."
    )

    add("COURSE-27-BEC-AWARENESS", "💼 Business Email Compromise (BEC): The $50B Threat Landscape", "Business Email Compromise (BEC) & Thread Hijacking Defense SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Defend against compromised legitimate vendor mailboxes that hijack ongoing email conversations to inject fraudulent wire routing details.",
        "THREAD HIJACKING AUDIT: Look for sudden changes in tone, urgency, or bank account instructions inside ongoing, legitimate email threads.",
        "REPLY-TO & FORWARDING CHECK: Inspect email headers for hidden `Reply-To:` redirects or unusual CC addresses introduced into the conversation.",
        "MANDATORY OUT-OF-BAND PHONE VALIDATION: Call the vendor using pre-contract contact records before executing any high-value wire instruction.",
        "EXCHANGE INBOX RULE AUDITING: Automated SIEM alerts detect creation of suspicious Outlook Inbox Rules (e.g. 'Move to RSS Feeds & Mark as Read').",
        [
            {"id": "c1", "label": "Scrutinize Mid-Thread Wire Changes", "detail": "Treat any mid-conversation bank routing change as high-probability BEC."},
            {"id": "c2", "label": "Check Reply-To Header", "detail": "Ensure replies are not being routed to a lookalike domain."},
            {"id": "c3", "label": "Verbal Secondary Confirmation", "detail": "Mandate verbal dual confirmation for all payments over $10,000."}
        ],
        ["FBI IC3 BEC PSA 2023", "NIST SP 800-53 AC-3", "CISA Cross-Sector Cybersecurity Goals"],
        ["T1566.002 (Spearphishing Link)", "T1114.003 (Email Forwarding Rule)"],
        "Execute PowerShell script: `Get-InboxRule -Mailbox user@company.com` to identify malicious forwarding rules."
    )

    add("COURSE-28-SUSPICIOUS-ATTACHMENTS", "📎 Suspicious Attachments: Recognizing Dangerous File Formats", "Inbound Attachment Sanitization & Suspicious File Triage SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Prevent payload execution by identifying high-risk attachment formats (.html, .iso, .xlsm, .vbs, .hta) used to bypass gateway detection.",
        "ATTACHMENT EXTENSION CHECK: Inspect the exact file extension. Never double-click unverified attachments from external senders.",
        "SANDBOX DETONATION: Forward unexpected attachments to the automated SOC sandbox for static and dynamic behavioral analysis.",
        "HTML ATTACHMENT QUARANTINE: Treat `.html` / `.htm` attachments as credential harvesting phishing kits and report them immediately.",
        "CONTENT DISARM & RECONSTRUCTION (CDR): Gateway CDR engines automatically strip active scripts and macros from all inbound Office and PDF files.",
        [
            {"id": "c1", "label": "Identify Dangerous Suffixes", "detail": "Flag .iso, .vbs, .wsf, .xlsm, .hta, and .html attachments."},
            {"id": "c2", "label": "No Macro Execution", "detail": "Never click 'Enable Content' on attached spreadsheets from external sources."},
            {"id": "c3", "label": "Submit to EDR Sandbox", "detail": "Submit suspicious files to internal detonation sandbox."}
        ],
        ["NIST SP 800-53 SI-3 (Malicious Code Protection)", "CISA CPG 2.B", "ISO 27001:2022 A.8.7"],
        ["T1566.001 (Spearphishing Attachment)", "T1204.002 (User Execution: Malicious File)"],
        "Quarantine attached file and submit SHA-256 hash to VirusTotal / internal EDR sandbox."
    )

    add("COURSE-29-DANGEROUS-DOCUMENT-TYPES", "📄 Dangerous Document Types: .xlsm, .pdf.exe, .iso & .vbs", "Container & Script File Neutralization (.iso, .exe, .vbs) SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Block containerized malware delivery (.iso, .img, .vhd) and Windows script executables (.vbs, .ps1, .bat) designed to evade Mark-of-the-Web (MOTW).",
        "CONTAINER MOUNT FREEZE: Never double-click `.iso` or `.img` container files received via email, as Windows mounts them as virtual drives, bypassing MOTW protections.",
        "DOUBLE-EXTENSION SCRUTINY: Look for deceptive double extensions such as `Invoice_Q3.pdf.exe` or `Contract.docx.vbs`.",
        "SOC MALWARE ESCALATION: Report the message and file attachment immediately to the malware response team.",
        "GROUP POLICY FILE TYPE BLOCKING: GPO rules block the execution of VBScript, Windows Script Host (.wsh), and mounting of ISOs from unapproved download paths.",
        [
            {"id": "c1", "label": "Never Mount ISO Files", "detail": "Treat emailed disk image containers as active ransomware loaders."},
            {"id": "c2", "label": "Check Windows Extension View", "detail": "Ensure file extensions are always visible in Windows Explorer."},
            {"id": "c3", "label": "Block Script Execution", "detail": "Do not run .bat, .cmd, .ps1, or .vbs files from email attachments."}
        ],
        ["NIST SP 800-53 CM-7 (Least Functionality)", "CISA Alert AA22-216A", "CIS Control 10.3"],
        ["T1204.002 (User Execution: Malicious File)", "T1566.001 (Spearphishing Attachment)"],
        "Run command: `Stop-Process -Name wscript, cscript, powershell -Force` if rogue script execution is suspected."
    )

    add("COURSE-30-QR-QUISHING", "🔳 QR Code Phishing (Quishing) & Mobile MFA Hijacking", "QR Code Phishing (Quishing) & Mobile Lens Defense SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Neutralize QR code phishing attacks embedded in PDF/email images that trick victims into scanning with personal mobile devices to bypass corporate desktop EDR controls.",
        "ZERO-SCAN CORPORATE EMAILS: Never scan QR codes embedded inside corporate emails, PDFs, or desktop alerts requesting MFA authentication or password resets.",
        "CAMERA VIEWFINDER URL INSPECTION: If scanning a physical QR code (e.g. conference booth), examine the full URL preview in the camera viewfinder before tapping.",
        "REPORT EMBEDDED QR IMAGES: Forward the email containing the QR code image to the SOC for automated optical character recognition (OCR) decoding.",
        "MOBILE THREAT DEFENSE (MTD): Enforce Microsoft Defender for Mobile or Jamf Trust on corporate mobile devices to filter phishing links scanned via camera.",
        [
            {"id": "c1", "label": "Never Scan Email QR Codes", "detail": "Corporate IT NEVER distributes MFA registration or password reset links via QR codes."},
            {"id": "c2", "label": "Inspect Camera Lens Preview", "detail": "Inspect the root domain displayed in the smartphone camera preview before opening."},
            {"id": "c3", "label": "OCR Gateway Scanning", "detail": "Submit QR code to gateway OCR engine for automated URL sandbox detonation."}
        ],
        ["CISA Alert AA23-320A (Quishing Threats)", "FBI IC3 PSA (QR Codes)", "NIST SP 800-63B"],
        ["T1566.002 (Spearphishing Link)", "T1598 (Social Engineering)"],
        "If QR code was scanned on mobile, revoke Entra ID session tokens and isolate mobile MDM profile."
    )

    # --- TRACK 4: ATTACHMENT, MACRO & DOCUMENT SECURITY (31 - 40) ---
    add("COURSE-31-MALICIOUS-DOCS", "📑 How Malicious Documents Work: VBA Macros & Obfuscation", "Weaponized Office Document & VBA Macro Analysis SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Deconstruct malicious VBA macros and obfuscated PowerShell launch vectors hidden within Word and Excel documents.",
        "REJECT EMBEDDED MACROS: Immediately close documents that display instructions claiming 'This document is protected. Click Enable Content to view.'",
        "ISOLATE FILE PROCESSES: Use Task Manager / Process Explorer to verify that opening a document does not spawn background `cmd.exe`, `powershell.exe`, or `mshta.exe`.",
        "SOC MALWARE FORWARDING: Submit the weaponized file to the SOC for static VBA string extraction via `olevba` and hybrid analysis.",
        "ATTACK SURFACE REDUCTION (ASR): Enforce Windows Defender ASR rule 'Block Office applications from creating child processes' (GUID: D4F940AB-401B-4EFC-AADC-AD5F3C50688A).",
        [
            {"id": "c1", "label": "Refuse Enable Editing", "detail": "Never click Enable Content on documents received via unsolicited emails."},
            {"id": "c2", "label": "Monitor Child Processes", "detail": "Ensure Word or Excel does not spawn background command-line interpreters."},
            {"id": "c3", "label": "Submit to Olevba Sandbox", "detail": "Extract VBA streams safely using automated security sandboxes."}
        ],
        ["NIST SP 800-53 SI-3", "Microsoft ASR Rules Guidance", "CIS Control 10.5"],
        ["T1204.002 (User Execution)", "T1059.005 (Visual Basic)"],
        "Run command: `Get-Process -Name powershell, cmd | Where-Object {$_.Parent.Name -eq 'WINWORD'}` to hunt rogue macro spawns."
    )

    add("COURSE-32-OFFICE-ATTACHMENTS", "📊 Suspicious Office Attachments: The 'Enable Content' Trap", "Microsoft Office Protected View & Sandbox Barrier SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Maintain the Protected View security barrier in Microsoft Office, treating yellow warning prompts as essential perimeter shields.",
        "RESPECT PROTECTED VIEW: Maintain yellow 'Protected View' banner active when previewing attachments from the Internet.",
        "IDENTIFY FAKE TEMPLATES: Recognize fake blurry document graphics designed to coerce users into disabling Protected View.",
        "CONVERT TO PDF IN CLOUD: Open suspicious documents inside cloud web viewers (Word Online / Excel Online) where macro execution is completely neutralized.",
        "BLOCK INTERNET MACROS: Windows GPO enforces default blocking of VBA macros in files originating from the internet zone with Mark-of-the-Web.",
        [
            {"id": "c1", "label": "Leave Protected View On", "detail": "Never dismiss the yellow Protected View bar for external files."},
            {"id": "c2", "label": "Spot Blurry Lures", "detail": "Blurry previews claiming 'Compatibility Mode Error' are standard malware delivery templates."},
            {"id": "c3", "label": "Use Cloud Web Apps", "detail": "Open attachments in browser web apps to neutralize binary code execution."}
        ],
        ["CISA Cyber Hygiene Alert", "NIST SP 800-128 (Configuration Management)", "ISO 27001:2022 A.8.19"],
        ["T1204.002 (User Execution: Malicious File)", "T1566.001 (Spearphishing Attachment)"],
        "If 'Enable Content' was accidentally clicked, immediately isolate workstation and call SOC."
    )

    add("COURSE-33-MACRO-AWARENESS", "⚙️ Macro Awareness: Why Legitimate Documents Never Require VBA", "Enterprise Macro Execution Policy & ASR Hardening SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Eliminate reliance on unvetted VBA macros across business workflows, enforcing signed cryptographic certificates for internal automation scripts.",
        "CODE-SIGNING VERIFICATION: Only execute macros that are digitally signed with verified internal corporate Code-Signing Certificates.",
        "REPLACE VBA WITH MODERN AUTOMATION: Migrate legacy VBA spreadsheets to Microsoft Power Automate, Python scripts, or secure REST APIs.",
        "AUDIT MACRO USE: File a security ticket if an external business partner requests you to enable macros for contract or invoice processing.",
        "TRUSTED LOCATIONS ONLY: Office trust center configurations restrict macro execution strictly to certified intranet file shares.",
        [
            {"id": "c1", "label": "Reject Unsigned Macros", "detail": "Block macros lacking trusted internal cryptographic signatures."},
            {"id": "c2", "label": "Modernize Automations", "detail": "Transition repetitive spreadsheet workflows to Power Automate cloud flows."},
            {"id": "c3", "label": "Report Vendor VBA Prompts", "detail": "Instruct vendors to provide clean CSV or standard XLSX documents without macros."}
        ],
        ["NIST SP 800-53 CM-7", "CISA CPG 2.B", "ISO 27001:2022 A.8.7"],
        ["T1059.005 (Visual Basic)", "T1204.002 (User Execution)"],
        "Execute Group Policy check: `gpresult /r` to confirm 'Block macros from running in Office files from the Internet' is enforced."
    )

    add("COURSE-34-UNEXPECTED-PDFS", "📕 Unexpected PDF Files: Embedded Links & Form Harvesting", "PDF AcroForm JavaScript & Embedded URI Sanitization SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Neutralize weaponized PDF exploits containing embedded JavaScript, launch actions, and phishing hyperlinks routing to fake login gateways.",
        "PDF LINK HOVER INSPECTION: Hover over embedded buttons ('View Secure Document', 'Sign Contract') to inspect true destination URLs.",
        "DISABLE PDF JAVASCRIPT: Ensure Acrobat Reader Protected Mode is enabled and Acrobat JavaScript is disabled in Trust Manager.",
        "REPORT EMBEDDED FORM HARVESTERS: Flag PDFs that present embedded input fields requesting passwords or encryption keys.",
        "SECURE PDF CONVERSION: Inbound email gateways convert attached PDFs to static sanitized raster images before inbox delivery.",
        [
            {"id": "c1", "label": "Hover on Embedded PDF Links", "detail": "Inspect true hyperlink destination before clicking any PDF button."},
            {"id": "c2", "label": "Disable Acrobat JavaScript", "detail": "Keep Adobe Acrobat Protected Mode and AppContainer isolation active."},
            {"id": "c3", "label": "Flag Password Form Prompts", "detail": "Never enter SSO passwords into PDF text boxes."}
        ],
        ["Adobe Security Best Practices", "NIST SP 800-53 SI-3", "ISO 27001:2022 A.8.7"],
        ["T1566.001 (Spearphishing Attachment)", "T1204.002 (User Execution)"],
        "Run command: `pdfid.py sample.pdf` in SOC sandbox to detect `/JavaScript` and `/Launch` streams."
    )

    add("COURSE-35-DANGEROUS-EXTENSIONS", "🏷️ Dangerous File Extensions: Double Extensions & Hidden Suffixes", "Right-to-Left Override (RLO) & Double Extension Triage SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Expose Right-to-Left Override Unicode tricks (U+202E) and double-extension masquerading (.docx.exe, .pdf.scr) used to camouflage executable binaries.",
        "ENABLE WINDOWS FILE EXTENSIONS: Confirm 'Hide extensions for known file types' is unchecked in Windows File Explorer options.",
        "INSPECT UNICODE RLO CHARACTERS: Look for files with unusual character ordering (e.g. `report_fdp.exe` appearing as `report_exe.pdf`).",
        "FLAG EXECUTABLE SUFFIXES: Treat .exe, .scr, .bat, .cmd, .hta, .msi, .vbs, .jar, and .wsf as active executables regardless of their file icon.",
        "APPLICATION CONTROL WHITELOCK: AppLocker and Windows Defender Application Control (WDAC) block unsigned executable binaries in user directories.",
        [
            {"id": "c1", "label": "Always Show Extensions", "detail": "Ensure file extensions are permanently visible in File Explorer."},
            {"id": "c2", "label": "Detect RLO Glyph Spoofing", "detail": "Identify Unicode U+202E characters reversing file extensions."},
            {"id": "c3", "label": "Never Trust File Icons", "detail": "Attackers easily embed PDF or Word icons into executable .exe files."}
        ],
        ["NIST SP 800-53 CM-7", "CISA CPG 1.C", "CIS Control 10.3"],
        ["T1036.002 (Right-to-Left Override)", "T1204.002 (User Execution)"],
        "Run PowerShell: `Get-ChildItem -File | Where-Object {$_.Name -match '\\u202E'}` to hunt RLO obfuscated files."
    )

    add("COURSE-36-SAFE-DOWNLOADS", "⬇️ Safe File Download Practices: Hashes, Sandboxes & Scans", "Cryptographic Hash Verification & Sandbox Detonation SOP", "P3 - MEDIUM / RECONNAISSANCE",
        "Verify cryptographic checksums (SHA-256) and execute pre-run sandbox scans before deploying software binaries or third-party tools.",
        "SHA-256 HASH VERIFICATION: Compare downloaded installer hashes against official vendor published checksums using `Get-FileHash`.",
        "AUTHENTICODE DIGITAL SIGNATURE AUDIT: Right-click properties -> Digital Signatures to verify the executable is signed by the verified software vendor.",
        "SUBMIT TO HYBRID SANDBOX: Upload unknown installers to the internal SOC sandbox prior to workstation execution.",
        "ENTERPRISE SOFTWARE PORTAL: Staff must install applications exclusively through Company Portal or managed software repositories.",
        [
            {"id": "c1", "label": "Compute SHA-256 Hash", "detail": "Run Get-FileHash to match cryptographic hash with official release notes."},
            {"id": "c2", "label": "Check Authenticode Certificate", "detail": "Ensure the digital signature is valid and issued to the genuine publisher."},
            {"id": "c3", "label": "Use Company Portal", "detail": "Avoid downloading random web installers; use internal managed app store."}
        ],
        ["NIST SP 800-161 (Supply Chain Risk)", "ISO 27001:2022 A.8.19", "CIS Control 2.5"],
        ["T1204.002 (User Execution: Malicious File)", "T1588.002 (Tool)"],
        "Run PowerShell command: `Get-FileHash -Algorithm SHA256 .\\installer.exe` and cross-reference with vendor registry."
    )

    add("COURSE-37-FAKE-SHARED-DOCS", "📂 Fake Shared Documents: Google Drive, Box & Dropbox Phishing", "Cloud Drive Collaboration & File Sharing Phish Triage SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Neutralize phishing lures exploiting legitimate cloud storage services (Google Drive, Dropbox, Box) to host malicious redirect documents.",
        "INSPECT SHARING INVITATION ORIGIN: Check whether the file sharing invitation originates from an authentic collaborator or an unknown external tenant.",
        "AUDIT ONE-PAGER REDIRECTS: Recognize that 1-page PDF documents on Google Drive containing 'Click here to access proposal' are phishing lures.",
        "REVOKE UNAPPROVED CLOUD TOKENS: Regularly inspect third-party apps granted access to your corporate cloud storage account.",
        "CLOUD ACCESS SECURITY BROKER (CASB): Enforce CASB policies (Microsoft Defender for Cloud Apps) restricting sharing with untrusted external domains.",
        [
            {"id": "c1", "label": "Inspect File Sharer Identity", "detail": "Verify the email address of the user who shared the document."},
            {"id": "c2", "label": "Spot One-Pager Redirect Traps", "detail": "Never follow links inside cloud-hosted placeholder PDF files."},
            {"id": "c3", "label": "Audit Connected Cloud Apps", "detail": "Review and revoke unknown third-party OAuth access in Google/M365 settings."}
        ],
        ["Cloud Security Alliance (CSA) CCM", "NIST SP 800-53 AC-3", "ISO 27001:2022 A.8.12"],
        ["T1566.002 (Spearphishing Link)", "T1539 (Steal Web Session Cookie)"],
        "Review connected OAuth apps at `myapps.microsoft.com` or Google Account Security permissions."
    )

    add("COURSE-38-CLOUD-STORAGE-PHISH", "☁️ Cloud Storage Phishing: Recognizing Evilginx & SSO Traps", "Reverse Proxy SaaS Interception & Cloud Storage Guard SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Detect Adversary-in-the-Middle reverse proxy phishing kits (Evilginx) that intercept session tokens while displaying authentic SaaS login pages.",
        "URL ADDRESS BAR SCRUTINY: Inspect browser address bar to confirm you are on `login.microsoftonline.com` or `accounts.google.com`—not a reverse proxy relay.",
        "ENFORCE FIDO2 HARDWARE AUTHENTICATION: Use hardware security keys (YubiKey) which cryptographically refuse to authenticate against proxy domains.",
        "REPORT SESSION THEFT SUSPICION: If login prompts repeat continuously or MFA prompts appear without action, report immediately.",
        "CONTINUOUS ACCESS EVALUATION (CAE): Enforce CAE in Entra ID to instantly revoke access tokens upon IP or location change.",
        [
            {"id": "c1", "label": "Examine Exact Root Domain", "detail": "Verify address bar shows login.microsoftonline.com without extra domain suffixes."},
            {"id": "c2", "label": "Use Hardware FIDO2 Keys", "detail": "FIDO2 WebAuthn keys cryptographically prevent token theft on proxy sites."},
            {"id": "c3", "label": "Immediate Token Revocation", "detail": "If entered credentials on a proxy, invalidate all active sessions immediately."}
        ],
        ["NIST SP 800-63B (AAL3)", "CISA Phishing-Resistant MFA Fact Sheet", "ISO 27001:2022 A.8.5"],
        ["T1539 (Steal Web Session Cookie)", "T1557 (Adversary-in-the-Middle)"],
        "Run PowerShell: `Revoke-AzureADUserAllRefreshToken -ObjectId <User-UUID>` to invalidate all active cloud session tokens."
    )

    add("COURSE-39-COLLAB-INVITES", "💬 Fake Collaboration Invitations: Slack, Teams & Zoom Traps", "Collaboration Platform (Slack/Teams/Zoom) Webhook & Invite SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Harden collaboration platforms against external guest account abuse, rogue webhook triggers, and fake meeting invite attachments.",
        "VERIFY GUEST TENANT SWITCHES: Scrutinize cross-tenant invites requesting you to switch to an external Teams organization or Slack workspace.",
        "NO CREDENTIAL PROMPTS IN CHAT: Never provide corporate passwords or MFA tokens in response to direct messages from 'Slackbot' or 'IT Support Bot'.",
        "INSPECT WEB CONFERENCING URLS: Confirm meeting links route to `company.zoom.us` or `teams.microsoft.com` without deceptive subdomains.",
        "CROSS-TENANT ACCESS POLICY: Entra ID restricts inbound cross-tenant collaboration strictly to explicitly federated corporate partner organizations.",
        [
            {"id": "c1", "label": "Scrutinize External Tenant Invites", "detail": "Do not join unknown external Slack or Teams workspaces without approval."},
            {"id": "c2", "label": "Ignore Chat Bot Password Demands", "detail": "Legitimate chat bots never request passwords or MFA codes."},
            {"id": "c3", "label": "Verify Meeting Link Roots", "detail": "Ensure Zoom/Teams links use official company domain endpoints."}
        ],
        ["NIST SP 800-53 AC-3", "Microsoft Teams Security Guide", "ISO 27001:2022 A.8.12"],
        ["T1566.002 (Spearphishing Link)", "T1078.004 (Cloud Accounts)"],
        "Audit external guest access inside Slack Admin Console or Entra ID External Collaboration settings."
    )

    add("COURSE-40-SAFE-DOC-VERIFICATION", "🛡️ Safe Document Verification: Protocol for Validating Unknown Files", "4-Point Document Validation Framework & Mark-of-the-Web SOP", "P3 - MEDIUM / RECONNAISSANCE",
        "Implement the 4-Point Document Validation Framework (Origin, Hash, MOTW, Sandboxing) to guarantee zero malicious payloads execute on endpoints.",
        "STEP 1 - ORIGIN TRIAGE: Validate that the document sender is authentic and was expected to send this specific attachment.",
        "STEP 2 - MOTW ATTRIBUTE CHECK: Check file properties for the 'Zone.Identifier' Mark-of-the-Web security tag indicating external origin.",
        "STEP 3 - STATIC SANDBOX INSPECTION: Upload file to the enterprise sandbox for structural dissection (embedded streams, macros, OLE objects).",
        "STEP 4 - EDR TELEMETRY MONITORING: Endpoint Detection and Response continuously monitors process execution trees and memory space.",
        [
            {"id": "c1", "label": "Sender Authenticity Confirmed", "detail": "Confirm sender identity and expected business context."},
            {"id": "c2", "label": "Check Zone.Identifier Tag", "detail": "Inspect whether file carries Internet zone security flags."},
            {"id": "c3", "label": "Sandbox Detonation Clear", "detail": "Obtain clean verdict from enterprise hybrid sandbox before local use."}
        ],
        ["NIST SP 800-53 SI-3", "CISA CPG 2.B", "ISO/IEC 27001:2022 A.8.7"],
        ["T1204.002 (User Execution: Malicious File)", "T1566.001 (Spearphishing Attachment)"],
        "Execute PowerShell check: `Get-Item .\\document.docx -Stream Zone.Identifier` to view Mark-of-the-Web metadata."
    )
