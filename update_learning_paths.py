with open('server/database/trainingMasterData.ts', 'r') as f:
    text = f.read()

new_learning_paths = """export const learningPaths: LearningPathData[] = [
  {
    id: 'path-01-foundations',
    code: 'PATH-01-FOUNDATIONS',
    title: '🛡️ Path 1: Security Foundations (Modules 01–10)',
    description: 'Master core cybersecurity concepts, human decision-making, threat landscape, and reporting protocols.',
    category: 'SOCIAL_ENGINEERING',
    difficulty: 'BEGINNER',
    estimated_minutes: 45,
    badge_reward: 'FOUNDATION_MASTER_CERT',
    course_codes: [
      'COURSE-01-CYBER-BASICS',
      'COURSE-02-PHISHING-INTRO',
      'COURSE-03-TARGET-EMPLOYEE',
      'COURSE-04-SOCIAL-ENGINEERING',
      'COURSE-05-HUMAN-PSYCHOLOGY',
      'COURSE-06-CYBER-ATTACK-TYPES',
      'COURSE-07-AWARENESS-FUNDAMENTALS',
      'COURSE-08-ORGANIZATIONAL-ROLE',
      'COURSE-09-WHAT-ATTACKERS-WANT',
      'COURSE-10-RECOGNIZING-SUSPICIOUS'
    ]
  },
  {
    id: 'path-02-email-security',
    code: 'PATH-02-EMAIL-SECURITY',
    title: '📧 Path 2: Email Security & RFC Header Analysis (Modules 11–20)',
    description: 'Anatomy of email threats, display name spoofing, Reply-To manipulation, and SPF/DKIM/DMARC headers.',
    category: 'EMAIL_SECURITY',
    difficulty: 'BEGINNER',
    estimated_minutes: 45,
    badge_reward: 'EMAIL_DEFENDER_CERT',
    course_codes: [
      'COURSE-11-ANATOMY-PHISHING-EMAIL',
      'COURSE-12-ANALYZE-SENDER-ADDRESS',
      'COURSE-13-CHECK-DOMAINS',
      'COURSE-14-SUSPICIOUS-LINKS',
      'COURSE-15-EXTERNAL-SENDER-BANNERS',
      'COURSE-16-LOOKALIKE-DOMAINS',
      'COURSE-17-TYPOSQUATTING',
      'COURSE-18-URGENCY-FEAR',
      'COURSE-19-FAKE-ACCOUNT-ALERTS',
      'COURSE-20-PASSWORD-EXPIRATION'
    ]
  },
  {
    id: 'path-03-url-security',
    code: 'PATH-03-URL-SECURITY',
    title: '🌐 Path 3: URL & Web Security (Modules 21–30)',
    description: 'Dissect deceptive hyperlinks, subdomain prefixing, typosquatting, IDN homoglyphs, and HTTPS limitations.',
    category: 'EMAIL_SECURITY',
    difficulty: 'INTERMEDIATE',
    estimated_minutes: 45,
    badge_reward: 'URL_ANALYST_CERT',
    course_codes: [
      'COURSE-21-FAKE-M365-NOTICES',
      'COURSE-22-FAKE-HR-EMAILS',
      'COURSE-23-FAKE-PAYROLL-EMAILS',
      'COURSE-24-FAKE-INVOICES',
      'COURSE-25-FAKE-DELIVERY-NOTICES',
      'COURSE-26-EXECUTIVE-IMPERSONATION',
      'COURSE-27-BEC-AWARENESS',
      'COURSE-28-SUSPICIOUS-ATTACHMENTS',
      'COURSE-29-DANGEROUS-DOCUMENT-TYPES',
      'COURSE-30-ATTACHMENT-MACROS'
    ]
  },
  {
    id: 'path-04-account-security',
    code: 'PATH-04-ACCOUNT-SECURITY',
    title: '🔑 Path 4: Credential & Account Security (Modules 31–40)',
    description: 'Fake login gateways, password entropy, credential stuffing, and MFA push fatigue bombardment.',
    category: 'ACCOUNT_SECURITY',
    difficulty: 'INTERMEDIATE',
    estimated_minutes: 45,
    badge_reward: 'IDENTITY_GUARDIAN_CERT',
    course_codes: [
      'COURSE-31-MALICIOUS-DOCS',
      'COURSE-32-OFFICE-ATTACHMENTS',
      'COURSE-33-MACRO-AWARENESS',
      'COURSE-34-VBA-RISKS',
      'COURSE-35-OBFUSCATION',
      'COURSE-36-DOUBLE-EXTENSIONS',
      'COURSE-37-ISO-ARCHIVES',
      'COURSE-38-PDF-PHISHING',
      'COURSE-39-CLOUD-STORAGE-LINKS',
      'COURSE-40-SAFE-DOCUMENT-HANDLING'
    ]
  },
  {
    id: 'path-05-attachments',
    code: 'PATH-05-ATTACHMENTS',
    title: '📎 Path 5: Attachment & Document Security (Modules 41–50)',
    description: 'Dangerous file types, Microsoft Excel Protected View macros (.xlsm), double extensions, and archives.',
    category: 'EMAIL_SECURITY',
    difficulty: 'INTERMEDIATE',
    estimated_minutes: 45,
    badge_reward: 'DOCUMENT_DEFENDER_CERT',
    course_codes: [
      'COURSE-41-WHAT-IS-SMISHING',
      'COURSE-42-SMS-PHISHING-TACTICS',
      'COURSE-43-FAKE-DELIVERY-SMS',
      'COURSE-44-FAKE-BANK-SMS',
      'COURSE-45-FAKE-GOVERNMENT-SMS',
      'COURSE-46-MFA-TOKEN-SMS',
      'COURSE-47-MOBILE-LINKS',
      'COURSE-48-MOBILE-URGENCY',
      'COURSE-49-SHORTCODES-SPOOFING',
      'COURSE-50-REPORTING-SMISHING'
    ]
  },
  {
    id: 'path-06-bec-fraud',
    code: 'PATH-06-BEC-FRAUD',
    title: '💼 Path 6: Business Email Compromise & Financial Fraud (Modules 51–60)',
    description: 'Executive impersonation, vendor payment redirection, W-9 modification, and dual-control sign-off.',
    category: 'SOCIAL_ENGINEERING',
    difficulty: 'ADVANCED',
    estimated_minutes: 45,
    badge_reward: 'BEC_SPECIALIST_CERT',
    course_codes: [
      'COURSE-51-WHAT-IS-VISHING',
      'COURSE-52-VOICE-PHISHING-TACTICS',
      'COURSE-53-FAKE-IT-SUPPORT-CALLS',
      'COURSE-54-FAKE-BANK-CALLS',
      'COURSE-55-EXECUTIVE-IMPERSONATION-VOICE',
      'COURSE-56-CALLER-ID-SPOOFING',
      'COURSE-57-URGENCY-IN-PHONE-CALLS',
      'COURSE-58-VOICE-VERIFICATION-SOP',
      'COURSE-59-OUT-OF-BAND-CALLBACKS',
      'COURSE-60-DEEPFAKE-AI-VOICE'
    ]
  },
  {
    id: 'path-07-psychology',
    code: 'PATH-07-PSYCHOLOGY',
    title: '🧠 Path 7: Social Engineering Psychology (Modules 61–70)',
    description: 'The 6 psychological manipulation levers: Authority, Urgency, Fear, Curiosity, Greed, and Social Proof.',
    category: 'SOCIAL_ENGINEERING',
    difficulty: 'ADVANCED',
    estimated_minutes: 45,
    badge_reward: 'HUMAN_RISK_DEFENDER_CERT',
    course_codes: [
      'COURSE-61-WHAT-IS-QUISHING',
      'COURSE-62-QR-CODE-PHISHING-TACTICS',
      'COURSE-63-QR-CODES-IN-EMAILS',
      'COURSE-64-QR-CODES-IN-DOCUMENTS',
      'COURSE-65-PHYSICAL-QR-TAMPERING',
      'COURSE-66-DESTINATION-URLS-QR',
      'COURSE-67-MFA-QR-ENROLLMENT-SCAMS',
      'COURSE-68-PARKING-PAYMENT-QR-FRAUD',
      'COURSE-69-SAFE-QR-SCANNING-SOP',
      'COURSE-70-MULTI-STAGE-ATTACKS'
    ]
  },
  {
    id: 'path-08-mobile-security',
    code: 'PATH-08-MOBILE-SECURITY',
    title: '📱 Path 8: Mobile & Messaging Security (Modules 71–80)',
    description: 'SMS smishing, courier parcel alerts, fake banking alerts, QR quishing, and collaboration apps.',
    category: 'SMS_SECURITY',
    difficulty: 'INTERMEDIATE',
    estimated_minutes: 45,
    badge_reward: 'MOBILE_SHIELD_CERT',
    course_codes: [
      'COURSE-71-SOCIAL-ENGINEERING-PSYCH',
      'COURSE-72-PHYSICAL-SECURITY-TAILGATING',
      'COURSE-73-REMOVABLE-MEDIA-USB',
      'COURSE-74-PUBLIC-WIFI-VPN',
      'COURSE-75-AI-PROMPT-INJECTION',
      'COURSE-76-AITM-SESSION-HIJACK',
      'COURSE-77-SUPPLY-CHAIN-POISON',
      'COURSE-78-HARDWARE-IMPLANTS',
      'COURSE-79-ZERO-TRUST-ARCH',
      'COURSE-80-CRISIS-INCIDENT-TRIAGE'
    ]
  },
  {
    id: 'path-09-voice-identity',
    code: 'PATH-09-VOICE-IDENTITY',
    title: '📞 Path 9: Voice, Deepfakes & Identity Attacks (Modules 81–90)',
    description: 'Telephone vishing, caller ID spoofing, STIR/SHAKEN Level C carrier analysis, and AI voice cloning.',
    category: 'VOICE_SECURITY',
    difficulty: 'ADVANCED',
    estimated_minutes: 45,
    badge_reward: 'VOICE_GUARDIAN_CERT',
    course_codes: [
      'COURSE-81-VISHING-FUNDAMENTALS',
      'COURSE-82-FAKED-IT-HELPDESK-CALLS',
      'COURSE-83-FAKED-BANKING-CALLS',
      'COURSE-84-EXECUTIVE-VOICE-IMPERSONATION',
      'COURSE-85-CALLER-ID-STIR-SHAKEN',
      'COURSE-86-AI-VOICE-CLONING-AWARENESS',
      'COURSE-87-REALTIME-DEEPFAKE-VIDEO',
      'COURSE-88-VIDEO-LIPSYNC-ARTIFACTS',
      'COURSE-89-OUT-OF-BAND-IDENTITY-VERIFY',
      'COURSE-90-VOICE-VISHING-CRUCIBLE'
    ]
  },
  {
    id: 'path-10-cloud-attacks',
    code: 'PATH-10-CLOUD-ATTACKS',
    title: '☁️ Path 10: Cloud & Modern Account Attacks (Modules 91–100)',
    description: 'Fake cloud notifications, OAuth illicit consent grants, EvilProxy AitM, and session cookie theft.',
    category: 'ACCOUNT_SECURITY',
    difficulty: 'EXPERT',
    estimated_minutes: 45,
    badge_reward: 'CLOUD_SECURITY_SPECIALIST_CERT',
    course_codes: [
      'COURSE-91-CLOUD-SECURITY-FUNDAMENTALS',
      'COURSE-92-FAKED-CLOUD-NOTIFICATIONS',
      'COURSE-93-SHARED-DOCUMENT-PHISHING',
      'COURSE-94-OAUTH-AUTHORIZATION-FLOWS',
      'COURSE-95-MALICIOUS-OAUTH-CONSENT',
      'COURSE-96-FAKED-SAAS-SSO-PORTALS',
      'COURSE-97-SESSION-TOKEN-THEFT-ESTS',
      'COURSE-98-CLOUD-MAILBOX-FORWARDING',
      'COURSE-99-ENTRA-ID-AUDIT-FORENSICS',
      'COURSE-100-CLOUD-TAKEOVER-CRUCIBLE'
    ]
  },
  {
    id: 'path-11-ai-phishing',
    code: 'PATH-11-AI-PHISHING',
    title: '🤖 Path 11: AI-Era Phishing & Synthetic Threats (Modules 101–110)',
    description: 'Generative AI spearphishing, grammar analysis, indirect prompt injection into copilots, and multi-modal attacks.',
    category: 'SOCIAL_ENGINEERING',
    difficulty: 'EXPERT',
    estimated_minutes: 45,
    badge_reward: 'AI_DEFENSE_MASTER_CERT',
    course_codes: [
      'COURSE-101-AI-ASSISTED-PHISHING',
      'COURSE-102-AI-WRITTEN-EMAILS',
      'COURSE-103-AUTOMATED-OSINT-PROFILING',
      'COURSE-104-SYNTHETIC-PERSONAS-BOTS',
      'COURSE-105-ACOUSTIC-SPECTRAL-ANALYSIS',
      'COURSE-106-SYNTHETIC-IDENTITY-LINKEDIN',
      'COURSE-107-ADAPTIVE-CONVERSATIONAL-BOTS',
      'COURSE-108-DEEPFAKE-VIDEO-ARTIFACTS',
      'COURSE-109-INDIRECT-PROMPT-INJECTION',
      'COURSE-110-MULTI-MODAL-AI-CRUCIBLE'
    ]
  },
  {
    id: 'path-12-advanced-response',
    code: 'PATH-12-ADVANCED-RESPONSE',
    title: '🚨 Path 12: Security Response & Advanced Behavior (Modules 111–120)',
    description: '60-second incident reporting, USB Rubber Duckies, tailgating defense, and the Final Defense Crucible.',
    category: 'COMPLIANCE',
    difficulty: 'EXPERT',
    estimated_minutes: 50,
    badge_reward: 'SECURITY_CHAMPION_ELITE_CERT',
    course_codes: [
      'COURSE-111-60-SECOND-INCIDENT-REPORT',
      'COURSE-112-POST-CLICK-ISOLATION',
      'COURSE-113-POST-ATTACHMENT-FORENSICS',
      'COURSE-114-POST-CREDENTIAL-DISCLOSURE',
      'COURSE-115-UNEXPECTED-MFA-RESPONSE',
      'COURSE-116-INDEPENDENT-CHALLENGE',
      'COURSE-117-PHYSICAL-TAILGATING-SECURITY',
      'COURSE-118-USB-RUBBER-DUCKY-DEFENSE',
      'COURSE-119-CLEAN-DESK-PII-PROTECTION',
      'COURSE-120-FINAL-MULTI-STAGE-CRUCIBLE'
    ]
  }
];"""

start_pos = text.find('export const learningPaths: LearningPathData[] = [')
end_pos = text.find('export const externalResources = [')

if start_pos != -1 and end_pos != -1:
    final_text = text[:start_pos] + new_learning_paths + "\n\n" + text[end_pos:]
    with open('server/database/trainingMasterData.ts', 'w') as f:
        f.write(final_text)
    print("Updated learning paths successfully to 12 complete paths!")
else:
    print("Markers not found", start_pos, end_pos)
