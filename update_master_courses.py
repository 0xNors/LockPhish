import re
import json

# Additional topics 81 to 120
extra_topics = [
  {
    "code": "COURSE-81-VISHING-FUNDAMENTALS",
    "title": "📞 Vishing Fundamentals: Phone-Based Social Engineering",
    "category": "VOICE_SECURITY",
    "difficulty": "BEGINNER",
    "duration": 10,
    "description": "Learn how adversaries leverage telephone communications to deceive personnel into disclosing credentials.",
    "quizQ": "Why is voice vishing often more effective than standard email phishing?",
    "quizOpts": ["Phone calls use higher network bandwidth", "Real-time conversational pressure prevents victims from taking time to analyze red flags", "Telephones cannot be monitored", "All phone numbers are anonymous"],
    "quizAns": 1,
    "quizExp": "Real-time vocal conversation prevents victims from taking time to analyze red flags out-of-band."
  },
  {
    "code": "COURSE-82-FAKED-IT-HELPDESK-CALLS",
    "title": "🛠️ Fake IT Helpdesk Inbound Calling Drills",
    "category": "VOICE_SECURITY",
    "difficulty": "INTERMEDIATE",
    "duration": 12,
    "description": "Spot callers pretending to be internal IT support demanding remote access or passwords.",
    "quizQ": "What should you do if an unannounced caller claims to be IT support asking for your password?",
    "quizOpts": ["Provide it immediately", "Politely decline, hang up, and call the verified IT directory number", "Ask them to email your personal address", "Give them your manager's password"],
    "quizAns": 1,
    "quizExp": "Always hang up and call the official internal IT directory extension."
  },
  {
    "code": "COURSE-83-FAKED-BANKING-CALLS",
    "title": "🏦 Commercial Bank & Wire Recovery Desk Imposter Calls",
    "category": "VOICE_SECURITY",
    "difficulty": "INTERMEDIATE",
    "duration": 12,
    "description": "Identify fraudulent banking calls urging immediate wire authorization or OTP disclosure.",
    "quizQ": "Will legitimate bank fraud agents ever ask you to read back a 6-digit confirmation code?",
    "quizOpts": ["Yes, on every call", "No, OTP codes are strictly private authorization secrets", "Only for large transactions", "Only on Fridays"],
    "quizAns": 1,
    "quizExp": "Confirmation codes are authorization secrets; bank agents will never ask you to speak them."
  },
  {
    "code": "COURSE-84-EXECUTIVE-VOICE-IMPERSONATION",
    "title": "👔 Executive Voice Impersonation & BEC Phone Escalations",
    "category": "VOICE_SECURITY",
    "difficulty": "ADVANCED",
    "duration": 15,
    "description": "Defend against adversaries calling subordinates pretending to be the CEO or Board member.",
    "quizQ": "What mandatory control blocks executive phone wire fraud?",
    "quizOpts": ["Dual-control verbal authorization with Treasury using verified directory lines", "Sending cash in mail", "Paying with cryptocurrency", "Ignoring all accounting policies"],
    "quizAns": 0,
    "quizExp": "Dual-control sign-off and pre-agreed challenge codes eliminate single-point phone fraud."
  },
  {
    "code": "COURSE-85-CALLER-ID-STIR-SHAKEN",
    "title": "📡 Caller ID Spoofing & STIR/SHAKEN Limitations",
    "category": "VOICE_SECURITY",
    "difficulty": "INTERMEDIATE",
    "duration": 10,
    "description": "Understand why caller ID display numbers can be forged by VoIP gateways.",
    "quizQ": "What does a STIR/SHAKEN Level C attestation indicate?",
    "quizOpts": ["The caller identity is unverified and originated from an untrusted VoIP gateway", "The call is 100% verified by FBI", "The caller is in the same room", "The call cannot be recorded"],
    "quizAns": 0,
    "quizExp": "Level C attestation indicates an unverified origin line with high carrier spoof risk."
  },
  {
    "code": "COURSE-86-AI-VOICE-CLONING-AWARENESS",
    "title": "🎙️ Generative AI Voice Cloning & Audio Vocoders",
    "category": "VOICE_SECURITY",
    "difficulty": "ADVANCED",
    "duration": 15,
    "description": "Detect acoustic artifacts and cadence glitches in AI-generated voice pretexts.",
    "quizQ": "How do threat actors create high-fidelity voice clones of executives?",
    "quizOpts": ["Using 3 seconds of audio from public earnings calls or webinars", "By hiring professional voice actors", "Using physical tape recorders", "By intercepting analog radio waves"],
    "quizAns": 0,
    "quizExp": "Deep learning vocoder models require only seconds of clean public audio to synthesize voice."
  },
  {
    "code": "COURSE-87-REALTIME-DEEPFAKE-VIDEO",
    "title": "📹 Real-Time Deepfake Video Conferencing Awareness",
    "category": "VOICE_SECURITY",
    "difficulty": "EXPERT",
    "duration": 20,
    "description": "Spot facial warping, lip-sync anomalies, and lighting artifacts in video conferences.",
    "quizQ": "What test exposes a real-time deepfake video in a Teams/Zoom call?",
    "quizOpts": ["Asking the participant to turn their head sideways or wave their hand in front of their face", "Muting your microphone", "Changing your desktop background", "Restarting your router"],
    "quizAns": 0,
    "quizExp": "Occlusion (waving a hand) breaks real-time face-swap neural rendering in video streams."
  },
  {
    "code": "COURSE-88-VIDEO-LIPSYNC-ARTIFACTS",
    "title": "🎭 Video Impersonation & Generative Media Forensics",
    "category": "VOICE_SECURITY",
    "difficulty": "EXPERT",
    "duration": 15,
    "description": "Deconstruct synthetic video attacks targeting executive board approvals.",
    "quizQ": "Why must large financial transactions require procedural out-of-band signoff?",
    "quizOpts": ["Because visual and auditory channels can both be synthesized by generative AI", "Because computers are slow", "To increase bank fees", "Because video calls are illegal"],
    "quizAns": 0,
    "quizExp": "Procedural verification matrices protect organizations when sensory perception can be spoofed."
  },
  {
    "code": "COURSE-89-OUT-OF-BAND-IDENTITY-VERIFY",
    "title": "🔐 Out-of-Band Challenge & Dynamic Verification Codes",
    "category": "VOICE_SECURITY",
    "difficulty": "INTERMEDIATE",
    "duration": 10,
    "description": "Establish challenge-response code words for high-risk communications.",
    "quizQ": "What is a pre-agreed challenge-response code word?",
    "quizOpts": ["A secret internal phrase agreed upon in advance to authenticate callers", "Your corporate password", "Your email address", "Your employee ID number"],
    "quizAns": 0,
    "quizExp": "Pre-agreed out-of-band codes verify identity without disclosing account credentials."
  },
  {
    "code": "COURSE-90-VOICE-VISHING-CRUCIBLE",
    "title": "⚡ Controlled Voice Vishing Attack Simulation Crucible",
    "category": "VOICE_SECURITY",
    "difficulty": "EXPERT",
    "duration": 20,
    "description": "Live interactive telephonic defense simulation against an aggressive AI adversary.",
    "quizQ": "What is the correct protocol when an aggressive caller demands immediate secret codes?",
    "quizOpts": ["Refuse secret disclosure, record caller details, and report to SOC immediately", "Disclose the codes to stop the call", "Transfer the call to a junior colleague", "Delete your call history"],
    "quizAns": 0,
    "quizExp": "Refusing disclosure and reporting to the SOC neutralizes phone-based social engineering."
  },
  {
    "code": "COURSE-91-CLOUD-SECURITY-FUNDAMENTALS",
    "title": "☁️ Cloud Security Fundamentals & SaaS Identity Perimeters",
    "category": "ACCOUNT_SECURITY",
    "difficulty": "BEGINNER",
    "duration": 10,
    "description": "Understand how cloud identity replaces on-premises physical firewalls.",
    "quizQ": "In cloud environments, what represents the primary security perimeter?",
    "quizOpts": ["User identity and access management (IAM)", "Physical office doors", "Ethernet cables", "Desktop monitors"],
    "quizAns": 0,
    "quizExp": "Identity (credentials, tokens, MFA) is the central perimeter for all modern cloud SaaS."
  },
  {
    "code": "COURSE-92-FAKED-CLOUD-NOTIFICATIONS",
    "title": "📁 Fake Cloud File Sharing Notifications (OneDrive/Drive)",
    "category": "ACCOUNT_SECURITY",
    "difficulty": "INTERMEDIATE",
    "duration": 10,
    "description": "Identify forged file-sharing notifications pointing to lookalike gateways.",
    "quizQ": "Where should you check for shared files before clicking email links?",
    "quizOpts": ["Directly inside your official Microsoft OneDrive / Google Drive web portal", "In external forums", "On personal USB drives", "In your spam folder"],
    "quizAns": 0,
    "quizExp": "Legitimate shared files appear natively in your authenticated cloud drive 'Shared with me' section."
  },
  {
    "code": "COURSE-93-SHARED-DOCUMENT-PHISHING",
    "title": "📄 Shared Document Phishing via Google Docs & Word Online",
    "category": "EMAIL_SECURITY",
    "difficulty": "INTERMEDIATE",
    "duration": 12,
    "description": "Detect phishing links hosted on legitimate cloud documents to bypass filters.",
    "quizQ": "Why do attackers host phishing links inside legitimate Google Docs files?",
    "quizOpts": ["Because email filters trust the google.com root domain", "To make files larger", "To format text in blue", "Because it requires no internet"],
    "quizAns": 0,
    "quizExp": "Hosting lures on legitimate cloud storage leverages high domain reputation to bypass spam filters."
  },
  {
    "code": "COURSE-94-OAUTH-AUTHORIZATION-FLOWS",
    "title": "🔑 OAuth 2.0 & OpenID Connect Authorization Flow Mechanics",
    "category": "ACCOUNT_SECURITY",
    "difficulty": "ADVANCED",
    "duration": 15,
    "description": "Understand how OAuth grants third-party applications access without passwords.",
    "quizQ": "What does granting an OAuth consent permission to a cloud app do?",
    "quizOpts": ["It issues an access token allowing the app to interact with your data via API", "It restarts your computer", "It changes your password", "It downloads an antivirus"],
    "quizAns": 0,
    "quizExp": "OAuth consent grants API tokens allowing the third-party application to access corporate data."
  },
  {
    "code": "COURSE-95-MALICIOUS-OAUTH-CONSENT",
    "title": "⚠️ Malicious OAuth App Consent Grants (Illicit Permissions)",
    "category": "ACCOUNT_SECURITY",
    "difficulty": "ADVANCED",
    "duration": 15,
    "description": "Inspect dangerous permission scopes (Mail.ReadWrite, Files.ReadWrite.All).",
    "quizQ": "Why is an illicit OAuth consent grant dangerous even after password resets?",
    "quizOpts": ["OAuth access tokens persist and function independently of password changes", "It deletes your hard drive", "It requires two monitors", "It changes your username"],
    "quizAns": 0,
    "quizExp": "OAuth refresh tokens continue granting API access until explicitly revoked by an administrator."
  },
  {
    "code": "COURSE-96-FAKED-SAAS-SSO-PORTALS",
    "title": "🏢 Fake SaaS Single Sign-On Gateways (Workday & Salesforce)",
    "category": "ACCOUNT_SECURITY",
    "difficulty": "INTERMEDIATE",
    "duration": 12,
    "description": "Spot cloned enterprise SaaS login pages designed to harvest credentials.",
    "quizQ": "How can you verify that a single sign-on login page is genuine?",
    "quizOpts": ["Check that the root domain matches your corporate IdP (e.g. company.okta.com)", "Check if the page has nice colors", "Check if it has a copyright date", "Type a fake password first"],
    "quizAns": 0,
    "quizExp": "Authentic IdP portals are hosted strictly on authorized corporate domains."
  },
  {
    "code": "COURSE-97-SESSION-TOKEN-THEFT-ESTS",
    "title": "🍪 Session Token Theft & ESTSAuth Cookie Hijacking",
    "category": "ACCOUNT_SECURITY",
    "difficulty": "EXPERT",
    "duration": 20,
    "description": "Understand how AitM proxies steal session cookies to bypass MFA entirely.",
    "quizQ": "What enables an attacker to access Microsoft 365 without knowing your password?",
    "quizOpts": ["Stealing your authenticated ESTSAuth session cookie via an AitM reverse proxy", "Guessing your email address", "Sending an SMS", "Printing a document"],
    "quizAns": 0,
    "quizExp": "Session cookies contain the authenticated session state; injecting them grants full access."
  },
  {
    "code": "COURSE-98-CLOUD-MAILBOX-FORWARDING",
    "title": "📬 Cloud Mailbox Forwarding Rule Hijacking Detection",
    "category": "ACCOUNT_SECURITY",
    "difficulty": "ADVANCED",
    "duration": 15,
    "description": "Detect silent inbox forwarding rules created by attackers to exfiltrate emails.",
    "quizQ": "What is a common post-compromise action taken by cybercriminals in Outlook?",
    "quizOpts": ["Creating hidden forwarding rules to send copies of financial emails to external addresses", "Changing your desktop background", "Deleting your drafts folder", "Increasing font size"],
    "quizAns": 0,
    "quizExp": "Adversaries create auto-forwarding rules to silently monitor financial and executive correspondence."
  },
  {
    "code": "COURSE-99-ENTRA-ID-AUDIT-FORENSICS",
    "title": "🔍 Cloud Investigation & Entra ID Audit Log Forensics",
    "category": "ACCOUNT_SECURITY",
    "difficulty": "EXPERT",
    "duration": 18,
    "description": "Investigate anomalous sign-in logs, Impossible Travel, and rogue device tokens.",
    "quizQ": "What does an 'Impossible Travel' alert in cloud identity audit logs mean?",
    "quizOpts": ["Logins occurred from two distant geographic locations in an impossibly short timeframe", "The user forgot their ticket", "The flight was cancelled", "The user changed timezones"],
    "quizAns": 0,
    "quizExp": "Impossible Travel indicates credentials were used concurrently from disparate geographical IPs."
  },
  {
    "code": "COURSE-100-CLOUD-TAKEOVER-CRUCIBLE",
    "title": "⚡ Cloud Account Takeover Threat Simulation Crucible",
    "category": "ACCOUNT_SECURITY",
    "difficulty": "EXPERT",
    "duration": 20,
    "description": "Defend against an active cloud account takeover across multi-cloud infrastructure.",
    "quizQ": "What is the fastest way to contain a suspected cloud account compromise?",
    "quizOpts": ["Revoke all active session tokens and enforce an immediate password reset via administrator", "Wait for the user to log out", "Send an email to the attacker", "Turn off the office lights"],
    "quizAns": 0,
    "quizExp": "Revoking all active refresh tokens terminates adversary sessions across all cloud endpoints."
  },
  {
    "code": "COURSE-101-AI-ASSISTED-PHISHING",
    "title": "🤖 AI-Assisted Phishing & LLM Spearphishing Mechanics",
    "category": "SOCIAL_ENGINEERING",
    "difficulty": "ADVANCED",
    "duration": 15,
    "description": "Learn how LLMs automate hyper-personalized, grammatically flawless spearphishing.",
    "quizQ": "How has Generative AI fundamentally altered the phishing landscape?",
    "quizOpts": ["It allows attackers to generate flawless, personalized pretexts at massive scale", "It eliminated all phishing attacks", "It only works in foreign languages", "It makes emails turn red"],
    "quizAns": 0,
    "quizExp": "Generative AI removes linguistic errors and automates contextual organizational targeting."
  },
  {
    "code": "COURSE-102-AI-WRITTEN-EMAILS",
    "title": "📝 AI-Written Emails & Grammar Analysis: Why Polished ≠ Safe",
    "category": "EMAIL_SECURITY",
    "difficulty": "INTERMEDIATE",
    "duration": 12,
    "description": "Understand why professional tone and clean grammar no longer prove legitimacy.",
    "quizQ": "Does a professional, well-written email guarantee that the sender is legitimate?",
    "quizOpts": ["No, threat actors use AI writing tools to craft perfectly styled messages", "Yes, criminals cannot write well", "Only if the email is short", "Only if sent in the morning"],
    "quizAns": 0,
    "quizExp": "Flawless grammar is easily generated by AI; legitimacy must be verified via domain and headers."
  },
  {
    "code": "COURSE-103-AUTOMATED-OSINT-PROFILING",
    "title": "🕵️ Automated OSINT Profiling & Hyper-Targeted Pretexts",
    "category": "SOCIAL_ENGINEERING",
    "difficulty": "ADVANCED",
    "duration": 15,
    "description": "Learn how attackers scrape LinkedIn and social media to personalize attacks.",
    "quizQ": "What public information do social engineers frequently weaponize in spearphishing?",
    "quizOpts": ["Job promotions, vendor partnerships, and organizational hierarchy from LinkedIn", "Your shoe size", "Your favorite movie", "Weather forecasts"],
    "quizAns": 0,
    "quizExp": "Public professional profiles provide organizational context used to construct believable lures."
  },
  {
    "code": "COURSE-104-SYNTHETIC-PERSONAS-BOTS",
    "title": "👤 AI Impersonation & Synthetic Attacker Personas",
    "category": "SOCIAL_ENGINEERING",
    "difficulty": "ADVANCED",
    "duration": 15,
    "description": "Recognize synthetic recruiter profiles and AI-generated social media avatars.",
    "quizQ": "How can you spot an AI-generated profile picture (StyleGAN avatar)?",
    "quizOpts": ["Look for asymmetric earrings, background warping, and perfectly centered pupil alignment", "The picture is always black and white", "The picture is always upside down", "The person has green hair"],
    "quizAns": 0,
    "quizExp": "Generative facial models produce background distortion and optical symmetry anomalies."
  },
  {
    "code": "COURSE-105-ACOUSTIC-SPECTRAL-ANALYSIS",
    "title": "🔊 Acoustic Spectral Analysis & AI Audio Clones",
    "category": "VOICE_SECURITY",
    "difficulty": "EXPERT",
    "duration": 18,
    "description": "Detect robotic artifacts and vocoder glitches in synthesized executive voice calls.",
    "quizQ": "What vocal characteristic often exposes an AI voice clone in a phone call?",
    "quizOpts": ["Unnatural pitch consistency, absence of breathing sounds, and synthetic cadence gaps", "Extremely loud shouting", "The voice sounds like a robot from the 1980s", "The phone battery drains"],
    "quizAns": 0,
    "quizExp": "Synthetic voice clones exhibit cadence pauses and lack organic vocal modulation."
  },
  {
    "code": "COURSE-106-SYNTHETIC-IDENTITY-LINKEDIN",
    "title": "💼 Synthetic Identity & Fictitious Recruiter Profiles",
    "category": "SOCIAL_ENGINEERING",
    "difficulty": "INTERMEDIATE",
    "duration": 12,
    "description": "Defend against fictitious recruiting contacts distributing malicious PDFs.",
    "quizQ": "A recruiter on LinkedIn sends an unsolicited '.zip' portfolio file. What should you do?",
    "quizOpts": ["Do not open the file; verify the recruiting agency independently and report suspicious profiles", "Extract and run the executable inside", "Send your corporate password", "Forward to colleagues"],
    "quizAns": 0,
    "quizExp": "Fictitious recruiter accounts distribute weaponized archives to infect corporate workstations."
  },
  {
    "code": "COURSE-107-ADAPTIVE-CONVERSATIONAL-BOTS",
    "title": "💬 Adaptive AI Conversational Attacker Bots",
    "category": "SOCIAL_ENGINEERING",
    "difficulty": "ADVANCED",
    "duration": 15,
    "description": "Identify autonomous LLM bots conducting multi-turn social engineering chats.",
    "quizQ": "How do autonomous attacker bots handle victim questions during phishing chats?",
    "quizOpts": ["They dynamically adapt responses in real time using large language models", "They repeat the same word 100 times", "They crash immediately", "They call your phone"],
    "quizAns": 0,
    "quizExp": "LLM attacker bots interpret victim hesitations and formulate contextual persuasive replies."
  },
  {
    "code": "COURSE-108-DEEPFAKE-VIDEO-ARTIFACTS",
    "title": "🎭 Deepfake Video Artifacts & Glitch Recognition",
    "category": "VOICE_SECURITY",
    "difficulty": "EXPERT",
    "duration": 18,
    "description": "Analyze edge blurring and lighting mismatches in video calls.",
    "quizQ": "What visual anomaly indicates a real-time deepfake in a video stream?",
    "quizOpts": ["Flickering facial boundaries, teeth alignment blur, and unnatural blinking rates", "The video is in slow motion", "The audio is muted", "The person is wearing glasses"],
    "quizAns": 0,
    "quizExp": "Neural face-swapping algorithms struggle with teeth rendering, edge boundaries, and natural blinks."
  },
  {
    "code": "COURSE-109-INDIRECT-PROMPT-INJECTION",
    "title": "🛡️ Indirect AI Prompt Injection into Enterprise Copilots",
    "category": "ACCOUNT_SECURITY",
    "difficulty": "EXPERT",
    "duration": 20,
    "description": "Prevent malicious documents from tricking corporate AI assistants into leaking data.",
    "quizQ": "What is indirect prompt injection in an AI assistant?",
    "quizOpts": ["Adversarial instructions hidden in external documents that hijack the AI assistant's actions", "Typing fast into ChatGPT", "A hardware keyboard fault", "A computer virus from 1995"],
    "quizAns": 0,
    "quizExp": "Hidden text inside documents can override LLM instructions to exfiltrate corporate data."
  },
  {
    "code": "COURSE-110-MULTI-MODAL-AI-CRUCIBLE",
    "title": "⚡ Multi-Modal AI Attack Simulation Crucible",
    "category": "SOCIAL_ENGINEERING",
    "difficulty": "EXPERT",
    "duration": 20,
    "description": "Defend against a multi-modal attack combining AI email, voice clone, and deepfake video.",
    "quizQ": "What is the ultimate defense against multi-modal AI social engineering attacks?",
    "quizOpts": ["Rigorous procedural out-of-band verification and zero-trust policy compliance", "Trusting your instincts alone", "Disabling your computer", "Avoiding all phone calls"],
    "quizAns": 0,
    "quizExp": "Procedural verification matrices protect organizations when all sensory channels can be faked."
  },
  {
    "code": "COURSE-111-60-SECOND-INCIDENT-REPORT",
    "title": "🚨 60-Second Incident Reporting Protocol",
    "category": "COMPLIANCE",
    "difficulty": "BEGINNER",
    "duration": 10,
    "description": "Master rapid threat notification protocols to minimize incident blast radius.",
    "quizQ": "Why is reporting a suspicious email within 60 seconds critical?",
    "quizOpts": ["It allows the SOC to purge the phishing email from all other employee inboxes before clicks occur", "To earn leaderboard points", "To reset the mail server", "Because emails delete themselves in 60 seconds"],
    "quizAns": 0,
    "quizExp": "Rapid reporting triggers automated SOAR playbooks to purge malicious emails across the entire company."
  },
  {
    "code": "COURSE-112-POST-CLICK-ISOLATION",
    "title": "🔌 Post-Click Response & Network Isolation Procedures",
    "category": "COMPLIANCE",
    "difficulty": "INTERMEDIATE",
    "duration": 12,
    "description": "Learn exact actions after clicking a link: disconnect network, do not reboot.",
    "quizQ": "What should you do immediately if you realize you clicked a malicious ransomware link?",
    "quizOpts": ["Disconnect network (unplug ethernet / turn off Wi-Fi) and call IT Security immediately", "Turn off your computer power supply abruptly", "Run a disk defragmenter", "Ignore it and continue working"],
    "quizAns": 0,
    "quizExp": "Network isolation stops malware from spreading laterally while preserving volatile memory for forensics."
  },
  {
    "code": "COURSE-113-POST-ATTACHMENT-FORENSICS",
    "title": "🔬 Post-Attachment Execution Forensics & Process Kill",
    "category": "COMPLIANCE",
    "difficulty": "ADVANCED",
    "duration": 15,
    "description": "Understand memory volatility and endpoint containment following file execution.",
    "quizQ": "Why should you NOT reboot an infected workstation before IT Security arrives?",
    "quizOpts": ["Rebooting destroys critical forensic evidence stored in volatile RAM memory", "Rebooting makes the screen darker", "Computers cannot reboot when infected", "It voids the hardware warranty"],
    "quizAns": 0,
    "quizExp": "Volatile RAM contains encryption keys, process injection traces, and C2 IP addresses needed by forensics."
  },
  {
    "code": "COURSE-114-POST-CREDENTIAL-DISCLOSURE",
    "title": "🔑 Post-Credential Disclosure Token Revocation",
    "category": "COMPLIANCE",
    "difficulty": "INTERMEDIATE",
    "duration": 12,
    "description": "Learn the emergency token revocation workflow after entering passwords on fake portals.",
    "quizQ": "What must accompany a password reset after entering credentials on a phishing page?",
    "quizOpts": ["Revoking all active cloud session tokens and refresh tokens across all devices", "Changing your desktop wallpaper", "Restarting your phone", "Sending an apology email to coworkers"],
    "quizAns": 0,
    "quizExp": "Adversaries with stolen session tokens bypass password resets unless active sessions are explicitly revoked."
  },
  {
    "code": "COURSE-115-UNEXPECTED-MFA-RESPONSE",
    "title": "🛡️ Handling Unexpected MFA Push Requests",
    "category": "ACCOUNT_SECURITY",
    "difficulty": "BEGINNER",
    "duration": 10,
    "description": "Learn why you must always tap DENY and report unsolicited authentication prompts.",
    "quizQ": "If you receive an MFA push approval prompt while sleeping, what should you do?",
    "quizOpts": ["Tap Deny immediately and notify IT Security that your password may be compromised", "Tap Approve to make the phone stop buzzing", "Ignore it and go back to sleep", "Delete the Authenticator app"],
    "quizAns": 0,
    "quizExp": "An unsolicited MFA push means an adversary already knows your password; deny and report immediately."
  },
  {
    "code": "COURSE-116-INDEPENDENT-CHALLENGE",
    "title": "📞 Multi-Channel Independent Verification Runbook",
    "category": "COMPLIANCE",
    "difficulty": "INTERMEDIATE",
    "duration": 12,
    "description": "Master corporate out-of-band verification procedures for high-risk operations.",
    "quizQ": "What is the standard out-of-band verification rule for vendor bank coordinate changes?",
    "quizOpts": ["Call the verified primary contact using telephone numbers established during vendor onboarding", "Reply to the email invoice", "Send a text to the number in the email signature", "Check if the PDF has a company logo"],
    "quizAns": 0,
    "quizExp": "Always use contact details from the verified vendor master record in your ERP, never from the invoice."
  },
  {
    "code": "COURSE-117-PHYSICAL-TAILGATING-SECURITY",
    "title": "🚪 Physical Social Engineering & Tailgating Entry",
    "category": "COMPLIANCE",
    "difficulty": "BEGINNER",
    "duration": 10,
    "description": "Prevent unauthorized visitors from piggybacking through secure corporate doors.",
    "quizQ": "Someone in courier uniform carrying heavy boxes asks you to hold the security door. What should you do?",
    "quizOpts": ["Politely ask them to badge in themselves or escort them directly to reception for badge issuance", "Hold the door open for them", "Give them your badge", "Leave the door propped open with a chair"],
    "quizAns": 0,
    "quizExp": "Polite security compliance requires all personnel and visitors to badge in or check in at reception."
  },
  {
    "code": "COURSE-118-USB-RUBBER-DUCKY-DEFENSE",
    "title": "💾 USB Drops & BadUSB Removable Media Defense",
    "category": "COMPLIANCE",
    "difficulty": "INTERMEDIATE",
    "duration": 12,
    "description": "Understand how keystroke injection hardware attacks compromise air-gapped systems.",
    "quizQ": "You find a USB thumb drive in the company parking lot labeled 'Executive Compensation'. What should you do?",
    "quizOpts": ["Turn it in immediately to IT Security without plugging it into any device", "Plug it into your workstation to see who owns it", "Plug it into your personal laptop", "Take it home"],
    "quizAns": 0,
    "quizExp": "USB drop attacks use BadUSB devices that type malicious commands in seconds; never plug in found drives."
  },
  {
    "code": "COURSE-119-CLEAN-DESK-PII-PROTECTION",
    "title": "📋 Clean Desk, Whiteboard & PII Protection Standards",
    "category": "COMPLIANCE",
    "difficulty": "BEGINNER",
    "duration": 10,
    "description": "Protect sensitive passwords, sticky notes, and whiteboard architecture diagrams.",
    "quizQ": "Is it acceptable to write passwords on sticky notes attached to your monitor?",
    "quizOpts": ["No, credentials must never be written on physical surfaces visible to visitors or cleaners", "Yes, if written in small handwriting", "Yes, if hidden under the keyboard", "Only in private offices"],
    "quizAns": 0,
    "quizExp": "Physical credential exposure is a violation of ISO 27001 and SOC 2 clean desk governance."
  },
  {
    "code": "COURSE-120-FINAL-MULTI-STAGE-CRUCIBLE",
    "title": "🏆 Final Multi-Stage Human Risk Defense Crucible",
    "category": "COMPLIANCE",
    "difficulty": "EXPERT",
    "duration": 30,
    "description": "Comprehensive 120-module capstone defense crucible assessing cross-channel human risk.",
    "quizQ": "What defines a true Security Champion in an enterprise organization?",
    "quizOpts": ["Demonstrating continuous skepticism, adhering to verification SOPs, and reporting threats within 60 seconds", "Memorizing computer dictionary terms", "Never using the internet", "Having a high typing speed"],
    "quizAns": 0,
    "quizExp": "Security Champions combine vigilance, procedural rigor, and rapid incident reporting to protect the enterprise."
  }
]

with open('server/database/trainingMasterData.ts', 'r') as f:
    text = f.read()

# Format extra topics as TypeScript code
ts_entries = []
for t in extra_topics:
    q_exp = t['quizExp'].replace("'", "\\'")
    ts_entries.append(f"""  {{
    code: '{t['code']}',
    title: '{t['title']}',
    category: '{t['category']}',
    difficulty: '{t['difficulty']}',
    duration: {t['duration']},
    description: '{t['description'].replace("'", "\\'")}',
    quizQ: '{t['quizQ'].replace("'", "\\'")}',
    quizOpts: {json.dumps(t['quizOpts'])},
    quizAns: {t['quizAns']},
    quizExp: '{q_exp}'
  }}""")

formatted_extra = ',\n'.join(ts_entries)

# Insert into remainingTopics
target_str = "];\n\n// Differentiated Multi-Slide Module Generator"
if target_str in text:
    new_text = text.replace(target_str, ",\n" + formatted_extra + "\n" + target_str)
    with open('server/database/trainingMasterData.ts', 'w') as f:
        f.write(new_text)
    print("Successfully added 40 new courses to trainingMasterData.ts!")
else:
    print("Target string not found for insertion.")
