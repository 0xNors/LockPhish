import { v4 as uuidv4 } from 'uuid';

// Helper to build voice payload state machine
const createVoiceConfig = (persona: string, opening: string, claimPrompt: string, pressurePrompt: string, callerId: string) => ({
  voice_persona: persona,
  voice_opening: opening,
  states: {
    INTRODUCTION: {
      prompt: opening,
      transitions: {
        AFFIRMATIVE: 'IDENTITY_CLAIM',
        QUESTION: 'EMPLOYEE_QUESTION',
        HESITATION: 'PRESSURE'
      }
    },
    IDENTITY_CLAIM: {
      prompt: claimPrompt,
      transitions: {
        DISCLOSE_SECRET: 'UNSAFE_DECISION',
        ASK_TICKET_OR_CALLBACK: 'VERIFICATION',
        REFUSE_CODE: 'SAFE_EXIT',
        HESITATION: 'PRESSURE'
      }
    },
    PRESSURE: {
      prompt: pressurePrompt,
      transitions: {
        DISCLOSE_SECRET: 'UNSAFE_DECISION',
        REFUSE_CODE: 'SAFE_EXIT',
        ASK_TICKET_OR_CALLBACK: 'VERIFICATION'
      }
    },
    VERIFICATION: {
      prompt: "I understand company policy! You can check internal ticket SEC-9481, but since the system gateway is syncing now, reading the code immediately is the only way to prevent account lockout.",
      transitions: {
        DISCLOSE_SECRET: 'UNSAFE_DECISION',
        STILL_REFUSE: 'SAFE_EXIT'
      }
    },
    SAFE_EXIT: {
      prompt: "Understood. Refusing to share codes over the phone is the correct security policy. Thank you for protecting corporate assets.",
      is_terminal: true,
      outcome: 'SAFE'
    },
    UNSAFE_DECISION: {
      prompt: "Thank you, I have entered that code into the server override console. Goodbye.",
      is_terminal: true,
      outcome: 'UNSAFE'
    }
  }
});

// Helper for standard indicators
const createIndicators = (type1: string, title1: string, desc1: string, type2: string, title2: string, desc2: string) => [
  { type: type1, title: title1, description: desc1 },
  { type: type2, title: title2, description: desc2 }
];

// Helper to build email HTML container
const buildEmailHtml = (headerBg: string, headerTitle: string, contentHtml: string, buttonText: string, footerText: string) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; color: #1e293b; line-height: 1.6;">
  <div style="background-color: ${headerBg}; padding: 18px 24px; color: #ffffff;">
    <h2 style="margin: 0; font-size: 18px; font-weight: bold;">${headerTitle}</h2>
  </div>
  <div style="padding: 24px; background: #ffffff;">
    ${contentHtml}
    <div style="text-align: center; margin: 24px 0;">
      <a href="{{simulation_link}}" style="background-color: ${headerBg}; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">${buttonText}</a>
    </div>
    <p style="font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px;">${footerText}</p>
  </div>
</div>
`;

// ==========================================
// 1. VOICE (VISHING) SCENARIOS (22 Total)
// ==========================================
export const voiceScenarios = [
  {
    id: 'scen-voice-it-01',
    code: 'VOICE_IT_VPN_MFA_VERIFICATION',
    name: 'IT Helpdesk: Emergency VPN Gateway Migration & MFA Verification',
    channel: 'VOICE',
    category: 'IT_SUPPORT',
    difficulty: 'HIGH',
    description: 'Controlled AI voice simulation where an agent impersonating senior IT engineering calls the employee regarding an emergency VPN server migration.',
    sender_profile: JSON.stringify({ name: 'Corporate IT Infrastructure Desk', phone: '+1 (415) 555-0192', caller_id: 'IT-HELPDESK-PRIORITY' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Alex Taylor, Senior Network Engineer at Corporate Infrastructure',
      "Hello {{first_name}}, this is Alex from corporate IT infrastructure. We're performing an emergency VPN router switchover for {{department}}. Can you confirm your workstation is currently active?",
      "Great. I see your corporate email as {{email}}. I just triggered an MFA authorization prompt to your phone. Can you read that 6-digit confirmation code out to me to whitelist your workstation?",
      "Look {{first_name}}, if we don't apply this sync in the next 2 minutes, your network access will be revoked by the firewall and you'll have to visit IT physically. I just need that quick 6-digit code.",
      'IT-HELPDESK-PRIORITY'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'MFA_OVER_PHONE', 'Request for MFA Code over Voice Call', 'Legitimate IT support will NEVER ask you to speak a push notification OTP or MFA code.',
      'PRESSURE_TACTIC', 'Threat of Immediate Workstation Lockout', 'Fabricates extreme urgency to circumvent rational verification.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-ceo-wire',
    code: 'VOICE_CEO_DEEPFAKE_WIRE',
    name: 'Deepfake AI Voice: Executive CEO Urgent M&A Wire Request ($480k)',
    channel: 'VOICE',
    category: 'EXECUTIVE_IMPERSONATION',
    difficulty: 'CRITICAL',
    description: 'High-stakes simulation using AI-cloned executive voice claiming to be the CEO in an airport transit lounge demanding an urgent acquisition deposit.',
    sender_profile: JSON.stringify({ name: 'Chief Executive Office', phone: '+1 (212) 555-0184', caller_id: 'CEO-PRIVATE-CELL' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'David Harrison, Chief Executive Officer',
      "Hi {{first_name}}, this is David. I'm boarding a flight to London for Project Apex. Did you see my email regarding the urgent $480,000 escrow deposit?",
      "I need you to authorize the wire release immediately. The escrow agent requires the authorization code sent to your phone. Can you read those 6 digits to me right now?",
      "Listen {{first_name}}, if this wire isn't confirmed before my flight takes off in 5 minutes, our acquisition will fall through and the board will hold us accountable. Give me the code now.",
      'CEO-PRIVATE-CELL'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'EXECUTIVE_AUTHORITY', 'AI Deepfake CEO Impersonation', 'Attackers clone voices of C-suite executives to pressure employees into bypassing standard dual-approval wire controls.',
      'CONFIDENTIAL_PRESSURE', 'Demand for Secrecy & Immediate Action', 'Insisting on skipping secondary verification due to emergency travel is a classic BEC pretext.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-cisco-vpn',
    code: 'VOICE_CISCO_VPN_PATCH',
    name: 'Network Operations: Cisco AnyConnect Urgent SSL-VPN Patching',
    channel: 'VOICE',
    category: 'IT_SUPPORT',
    difficulty: 'HIGH',
    description: 'Simulates a network engineer calling to push a critical zero-day certificate patch to the employee AnyConnect client.',
    sender_profile: JSON.stringify({ name: 'Global Network Operations Center (NOC)', phone: '+1 (800) 555-0144', caller_id: 'CISCO-NOC-HOTLINE' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Ryan Miller, Principal Network Security Architect',
      "Hello {{first_name}}, Ryan from Cisco NOC team. We've detected an active zero-day vulnerability against {{company}} VPN gateways. Are you connected via AnyConnect right now?",
      "We are pushing a cryptographic certificate to your profile. I just generated an OTP code to {{email}}. Please recite that code to establish the secure tunnel.",
      "If we don't bind this certificate within 90 seconds, your connection will be quarantined by the IDS sensor. I need the digits on your screen.",
      'CISCO-NOC-HOTLINE'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'TECH_JARGON', 'Technical Jargon & Fear Mongering', 'Attackers use plausible acronyms (NOC, IDS, zero-day) to intimidate non-technical users.',
      'OUT_OF_BAND_REQ', 'Inbound Call Request for Token', 'Never disclose OTP or token values to unverified incoming callers.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-payroll-direct',
    code: 'VOICE_PAYROLL_DIRECT_DEPOSIT',
    name: 'Corporate Payroll: Direct Deposit Routing Number Validation',
    channel: 'VOICE',
    category: 'PAYROLL',
    difficulty: 'MEDIUM',
    description: 'Simulates a payroll administrator calling to fix an alleged ACH routing error before tonight payroll batch is locked.',
    sender_profile: JSON.stringify({ name: 'Corporate Payroll & Disbursement', phone: '+1 (888) 555-0163', caller_id: 'PAYROLL-DISPATCH' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Karen Mitchell, Lead Payroll Specialist',
      "Hi {{first_name}}, this is Karen from corporate payroll. We had a glitch during the ACH transmission for {{department}}, and your direct deposit account was flagged.",
      "To make sure your paycheck is deposited tomorrow morning, I just sent a verification PIN to {{email}}. Can you confirm that number with me?",
      "If I cannot verify this before the 5 PM bank cutoff in 10 minutes, your payroll will be delayed by two weeks. Please check your phone for the code.",
      'PAYROLL-DISPATCH'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'FINANCIAL_PANIC', 'Threat of Delayed Paycheck', 'Targeting employee personal salary creates emotional urgency to override caution.',
      'SENSITIVE_DATA_CALL', 'Verbal Transmission of Authentication PIN', 'Payroll changes must only occur within verified self-service portals.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-aws-iam',
    code: 'VOICE_AWS_ROOT_IAM_LEAK',
    name: 'Cloud Security: AWS Root IAM Access Key Leak Remediation',
    channel: 'VOICE',
    category: 'IT_SUPPORT',
    difficulty: 'HIGH',
    description: 'Controlled voice scenario where an attacker impersonates AWS Security Operations regarding an exposed secret access key on GitHub.',
    sender_profile: JSON.stringify({ name: 'AWS Cloud Security Incident Response', phone: '+1 (206) 555-0177', caller_id: 'AWS-SECURITY-ESCALATION' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Marcus Brody, AWS Senior Security Analyst',
      "Hello {{first_name}}, Marcus from AWS Security Incident Response. We detected your corporate AWS IAM secret key published in a public repository.",
      "We've initiated an automated credential revocation. A 6-digit MFA confirmation was just pushed to {{email}}. Can you read that code to revoke the compromised access?",
      "Hackers are spinning up high-cost GPU instances on your account right now! Every second of delay costs {{company}} thousands of dollars. Give me the code.",
      'AWS-SECURITY-ESCALATION'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'THIRD_PARTY_IMPERSONATION', 'Impersonating Cloud Provider (AWS)', 'Cloud service providers do not initiate phone calls demanding your one-time passwords.',
      'CATASTROPHIC_URGENCY', 'Fabricating Financial Catastrophe', 'Attackers claim thousands of dollars in cloud bills are accumulating to force rash action.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-okta-push',
    code: 'VOICE_OKTA_PUSH_BOMBING',
    name: 'Identity Access: Okta Single Sign-On Number Matching Verification',
    channel: 'VOICE',
    category: 'MFA',
    difficulty: 'CRITICAL',
    description: 'Simulates an adversary calling immediately after sending an Okta Verify push notification, telling the user to accept the two-digit number match.',
    sender_profile: JSON.stringify({ name: 'Identity & Access Management (IAM)', phone: '+1 (415) 555-0118', caller_id: 'OKTA-SUPPORT-DESK' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Jordan Lee, IAM Identity Engineer',
      "Hi {{first_name}}, Jordan from IAM. We are upgrading your Okta Verify tenant to FIDO2 compliance. Did a 2-digit number pop up on your smartphone?",
      "To complete the binding, what is the 2-digit number shown in your Okta Verify app? Read it to me so I can pair the hardware token.",
      "If you dismiss the notification, your SSO session for Slack, Jira, and Email will be permanently terminated today. Please read the matching digits.",
      'OKTA-SUPPORT-DESK'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'MFA_PUSH_BOMBING', 'Coordinated Voice + Push Notification', 'Adversaries trigger Okta push prompts and call the victim simultaneously to force approval.',
      'NUMBER_MATCH_BYPASS', 'Request for Okta Number Match', 'The two-digit number matching prompt is specifically designed to stop telephone social engineering.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-zoom-zeroday',
    code: 'VOICE_ZOOM_ZERO_DAY_HOTFIX',
    name: 'Unified Comms: Zoom Enterprise Client Remote Code Execution Patch',
    channel: 'VOICE',
    category: 'IT_SUPPORT',
    difficulty: 'MEDIUM',
    description: 'Impersonates desktop engineering demanding an override code to push a critical Zoom video conference vulnerability patch.',
    sender_profile: JSON.stringify({ name: 'Corporate Desktop Engineering', phone: '+1 (800) 555-0199', caller_id: 'ZOOM-ENTERPRISE-SUPPORT' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Bradley Cooper, Desktop Systems Lead',
      "Hello {{first_name}}, Bradley from Desktop Support. US-CERT just published an urgent CVSS 9.8 vulnerability in Zoom client. Are you currently in a meeting?",
      "I am deploying the emergency patch to your machine right now. I just need the authorization PIN sent to your phone to confirm your workstation ID.",
      "If this patch is not applied right away, malicious code can be injected through your webcam stream! Read me the code to enable encryption.",
      'ZOOM-ENTERPRISE-SUPPORT'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'FEAR_TACTIC', 'Fear of Webcam Surveillance', 'Preying on fears of camera hijacking is an effective psychological trigger.',
      'UNAUTHORIZED_PATCH', 'Verbal Patch Authorization', 'Legitimate enterprise software updates are deployed centrally via MDM (Intune/Jamf) without verbal OTPs.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-soc-malware',
    code: 'VOICE_SOC_MALWARE_CONTAINMENT',
    name: 'Security Operations (SOC): Active Workstation Ransomware Isolation',
    channel: 'VOICE',
    category: 'IT_SUPPORT',
    difficulty: 'HIGH',
    description: 'Controlled scenario where an agent impersonates the SOC Manager claiming employee laptop is infected with BlackCat ransomware.',
    sender_profile: JSON.stringify({ name: 'Cyber Incident Response Center (CIRC)', phone: '+1 (888) 555-0131', caller_id: 'SOC-EMERGENCY-DISPATCH' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Captain Elena Ramos, Incident Commander at CIRC',
      "Emergency notice {{first_name}}, this is Elena from the SOC. Our EDR telemetry detected BlackCat ransomware encryption originating from your IP address!",
      "We must isolate your machine immediately to protect the server SAN. Read me the 6-digit BitLocker recovery override code on your screen now.",
      "Your laptop is encrypting shared network drives as we speak! If you don't provide the code in 30 seconds, we will cut power to your entire floor.",
      'SOC-EMERGENCY-DISPATCH'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'INCIDENT_IMPERSONATION', 'SOC Incident Commander Impersonation', 'Attackers pretend to be cybersecurity responders to exploit the victim desire to be helpful.',
      'RECOVERY_KEY_THEFT', 'Request for BitLocker / Decryption Key', 'BitLocker and recovery keys should never be spoken over unverified telephone lines.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-vendor-bank',
    code: 'VOICE_VENDOR_BANKING_SWAP',
    name: 'Procurement: Strategic Vendor Bank Account Routing Update',
    channel: 'VOICE',
    category: 'VENDOR',
    difficulty: 'HIGH',
    description: 'Adversary impersonates the Chief Accounting Officer of an approved key vendor requesting updated ACH wire coordinates.',
    sender_profile: JSON.stringify({ name: 'Apex Global Logistics Treasury', phone: '+1 (312) 555-0155', caller_id: 'APEX-TREASURY-DIRECT' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Richard Vance, VP of Finance at Apex Global',
      "Good afternoon {{first_name}}, Richard Vance from Apex Logistics. I'm following up on our Q3 invoice of $124,000 for {{company}}.",
      "Our main account at Chase is under audit, so we updated our disbursement coordinates to Wells Fargo. Can you confirm our vendor update PIN?",
      "We have two freight containers held at port until this wire clears! I need this authorized verbally before the ship docks tonight.",
      'APEX-TREASURY-DIRECT'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'SUPPLY_CHAIN_PRETEXT', 'Vendor Bank Account Redirection', 'Over 40% of major business email compromises involve altered vendor bank accounts.',
      'OUT_OF_BAND_CALLBACK', 'Mandatory Secondary Callback SOP', 'Finance policies require calling the vendor verified landline number on file before modifying banking details.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-hr-401k',
    code: 'VOICE_HR_401K_ENROLLMENT',
    name: 'Human Capital: Annual 401(k) Matching Contribution PIN Validation',
    channel: 'VOICE',
    category: 'PAYROLL',
    difficulty: 'LOW',
    description: 'Impersonates an HR benefits coordinator claiming the employee company 6% 401(k) match will be lost unless confirmed over phone.',
    sender_profile: JSON.stringify({ name: 'Total Rewards & Benefits Team', phone: '+1 (800) 555-0182', caller_id: 'HR-BENEFITS-LINE' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Samantha Reed, Benefits Administrator',
      "Hello {{first_name}}, Samantha from HR Benefits. I'm reviewing open enrollment for {{department}} and see you haven't locked in your 6% employer 401(k) match.",
      "The carrier portal requires an identity token. I just sent a 6-digit confirmation to {{email}}. Can you read that code to secure your retirement matching?",
      "Today is the strict annual enrollment deadline set by the IRS. If you don't confirm this code right now, you forfeit thousands in matching funds for 2026.",
      'HR-BENEFITS-LINE'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'LOSS_AVERSION', 'Exploitation of Loss Aversion', 'Framing the situation as losing earned retirement funds triggers rapid emotional compliance.',
      'BENEFITS_SPOOF', 'HR Identity Theft via Phone', 'Benefits elections must only occur through verified Workday/ADP portals.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-teams-encrypt',
    code: 'VOICE_TEAMS_ENCRYPTION_SYNC',
    name: 'Microsoft 365 Admin: Teams End-to-End Encryption Token Sync',
    channel: 'VOICE',
    category: 'IT_SUPPORT',
    difficulty: 'MEDIUM',
    description: 'Simulates an IT administrator claiming employee Teams chat history is unencrypted and requires a sync code.',
    sender_profile: JSON.stringify({ name: 'M365 Collaboration Admin', phone: '+1 (425) 555-0112', caller_id: 'M365-COLLAB-ADMIN' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Jason Thorne, M365 Collaboration Architect',
      "Hi {{first_name}}, Jason from Microsoft 365 administration. We are enabling end-to-end encryption across all executive chats in {{department}}.",
      "To sync your mobile and desktop encryption keys, what is the 6-digit Microsoft Authenticator code displayed on your screen?",
      "Without this key synchronization, you will be disconnected from all active Teams channels within the hour. Please provide the key.",
      'M365-COLLAB-ADMIN'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'COLLABORATION_SPOOF', 'Teams Encryption Pretext', 'Attackers leverage modern enterprise tools (Teams, Slack) to craft plausible IT stories.',
      'AUTHENTICATOR_HARVEST', 'Direct Solicitation of Authenticator Codes', 'Never provide Microsoft Authenticator codes over the phone.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-fedex-customs',
    code: 'VOICE_FEDEX_CUSTOMS_PIN',
    name: 'Global Logistics: Air Freight Server Hardware Customs Clearance Code',
    channel: 'VOICE',
    category: 'DELIVERY',
    difficulty: 'MEDIUM',
    description: 'Courier agent calls claiming high-priority server hardware for engineering is stuck at airport customs awaiting a clearance OTP.',
    sender_profile: JSON.stringify({ name: 'FedEx Express International Freight', phone: '+1 (800) 555-0171', caller_id: 'FEDEX-FREIGHT-DISPATCH' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Officer Thomas Bell, Air Freight Customs Broker',
      "Good day {{first_name}}, Thomas from FedEx International Freight. We have 4 server chassis from Taiwan consigned to {{company}} at JFK customs.",
      "US Customs requires a commercial clearance code sent to the consignee email at {{email}}. Could you read that 6-digit release number?",
      "The customs holding clock expires in 20 minutes! After that, the freight is returned to sender and {{company}} will incur $8,000 in demurrage fees.",
      'FEDEX-FREIGHT-DISPATCH'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'LOGISTICS_PRETEXT', 'Urgent Customs Clearance Pretext', 'Leveraging hardware shipments creates confusion between logistics and IT staff.',
      'DEMURRAGE_THREAT', 'Financial Penalty Threats', 'Threatening thousands in shipping penalties forces hasty secret disclosure.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-bank-fraud',
    code: 'VOICE_COMMERCIAL_BANK_FRAUD',
    name: 'Commercial Bank: Outbound $85,000 ACH Fraud Dispute Verification',
    channel: 'VOICE',
    category: 'FINANCE',
    difficulty: 'HIGH',
    description: 'Fake commercial fraud department calling stating an unauthorized wire to an offshore crypto exchange is pending.',
    sender_profile: JSON.stringify({ name: 'JPMorgan Chase Commercial Fraud Unit', phone: '+1 (877) 555-0199', caller_id: 'CHASE-FRAUD-OPERATIONS' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Victoria Chase, Senior Fraud Operations Specialist',
      "Urgent security alert for {{first_name}}, this is Victoria from Chase Commercial Fraud. We detected a pending $85,000 wire to Binance HK on your business account.",
      "To block and cancel this fraudulent transaction immediately, I sent a one-time dispute authorization code to {{email}}. Read it to me now.",
      "If you do not read the dispute code before our batch closes in 60 seconds, the $85,000 will be permanently wired offshore with zero recourse!",
      'CHASE-FRAUD-OPERATIONS'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'REVERSE_PSYCHOLOGY', 'Reverse Psychology Fraud Scam', 'Attackers claim they are trying to "cancel" a fraud, while actually using your OTP to execute it.',
      'CALL_BACK_PROTOCOL', 'Official Bank Card Callback', 'Always hang up and call the number printed directly on your corporate commercial credit card.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-salesforce-sso',
    code: 'VOICE_SALESFORCE_SSO_MIGRATE',
    name: 'Enterprise CRM: Salesforce OAuth SSO Session Migration',
    channel: 'VOICE',
    category: 'IT_SUPPORT',
    difficulty: 'MEDIUM',
    description: 'Adversary calls sales/marketing staff claiming Salesforce Lightning migration requires verbal confirmation of MFA session token.',
    sender_profile: JSON.stringify({ name: 'Enterprise CRM Operations', phone: '+1 (800) 555-0138', caller_id: 'SALESFORCE-ADMIN-SYNC' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Nathan Cross, Senior Salesforce Administrator',
      "Hello {{first_name}}, Nathan from CRM operations. We're migrating {{department}} pipeline data to Salesforce Lightning tonight.",
      "I need to sync your lead assignments. A 6-digit verification code was just sent to {{email}}. Can you confirm that number for me?",
      "If you don't sync this right now, your open opportunities and quarterly commission tracking will be unlinked from your user account.",
      'SALESFORCE-ADMIN-SYNC'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'CRM_SPOOFING', 'Salesforce Pipeline Threat', 'Targeting sales representatives through their pipeline and commission triggers urgency.',
      'OAUTH_TOKEN_THEFT', 'SSO Session Hijacking', 'Attackers use verbal OTPs to authorize OAuth tokens granting full CRM customer database access.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-legal-subpoena',
    code: 'VOICE_LEGAL_SUBPOENA_COMPLIANCE',
    name: 'Corporate Legal Counsel: DOJ Regulatory Inquiry Document Decryption',
    channel: 'VOICE',
    category: 'DATA_PROTECTION',
    difficulty: 'HIGH',
    description: 'Impersonates outside legal counsel claiming an emergency federal regulatory subpoena requires instant access to departmental files.',
    sender_profile: JSON.stringify({ name: 'Skadden Legal Advisory Counsel', phone: '+1 (202) 555-0149', caller_id: 'LEGAL-COUNSEL-URGENT' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Attorney Arthur Sterling, Senior Partner at Outside Counsel',
      "Good day {{first_name}}, Attorney Arthur Sterling. I represent {{company}} in a confidential DOJ compliance matter regarding {{department}}.",
      "The presiding federal judge has issued an order requiring immediate evidence preservation. I need the decryption passphrase sent to your corporate email.",
      "Failure to provide this code immediately constitutes federal contempt of court and will result in sanctions against {{company}} leadership!",
      'LEGAL-COUNSEL-URGENT'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'LEGAL_INTIMIDATION', 'Threat of Judicial Sanctions', 'Using legal and federal authority to intimidate employees into bypassing security safeguards.',
      'CHAIN_OF_CUSTODY', 'Legal Document Verification Protocol', 'Legal discovery requests always follow formal internal legal department channels, never unsolicited phone calls.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-datacenter-rack',
    code: 'VOICE_DATACENTER_RACK_ACCESS',
    name: 'Facilities & Security: After-Hours Data Center Server Cage Emergency PIN',
    channel: 'VOICE',
    category: 'IT_SUPPORT',
    difficulty: 'CRITICAL',
    description: 'Adversary posing as an on-site Equinix technician claiming a cooling failure requires the employee cage door PIN.',
    sender_profile: JSON.stringify({ name: 'Equinix Data Center Operations', phone: '+1 (408) 555-0166', caller_id: 'EQUINIX-NOC-DISPATCH' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Derrick Vance, Equinix Shift Operations Supervisor',
      "Emergency alert {{first_name}}, Derrick from Equinix DC-4. Rack 12 in the {{company}} server cage has suffered an HVAC cooling failure and is overheating at 104°F!",
      "I am standing right outside your cage with emergency portable chillers. Read me the 6-digit access PIN sent to your phone so I can unlock the rack.",
      "Your production database servers are 60 seconds away from thermal shutdown and hardware destruction! Give me the cage PIN right now.",
      'EQUINIX-NOC-DISPATCH'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'PHYSICAL_SECURITY_THREAT', 'Physical Data Center Compromise', 'Physical data center access codes grant adversaries direct hardware access to corporate servers.',
      'HARDWARE_EMERGENCY', 'Fabricated Thermal Overheating Panic', 'Fabricating physical disaster scenarios creates extreme urgency to bypass authorization.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-healthcare-hipaa',
    code: 'VOICE_HEALTHCARE_HIPAA_AUDIT',
    name: 'Employee Benefits: HIPAA Healthcare Enrollment Social Security Verification',
    channel: 'VOICE',
    category: 'HR',
    difficulty: 'MEDIUM',
    description: 'Impersonates UnitedHealthcare claiming employee medical insurance coverage will be cancelled due to missing dependent Social Security validation.',
    sender_profile: JSON.stringify({ name: 'UnitedHealth Enterprise Group Services', phone: '+1 (800) 555-0158', caller_id: 'UHC-BENEFITS-VERIFY' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Rachel Green, Senior Compliance Auditor at UnitedHealth',
      "Hello {{first_name}}, Rachel from UnitedHealthcare. We're performing the mandatory annual HIPAA compliance audit for {{company}} staff.",
      "We have a discrepancy in your medical benefits file for {{department}}. I just dispatched a 6-digit identity confirmation to {{email}}. Can you confirm it?",
      "If we cannot validate this before 5 PM today, your family medical and dental insurance policy will be suspended starting midnight.",
      'UHC-BENEFITS-VERIFY'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'HEALTHCARE_LEVERAGE', 'Threat of Medical Insurance Suspension', 'Leveraging employee personal healthcare coverage to induce immediate compliance.',
      'PII_HARVESTING', 'Targeting Sensitive Personal Data via Phone', 'Insurance carriers will never call unprompted demanding one-time authentication passcodes.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-github-ssh',
    code: 'VOICE_GITHUB_SSH_ROTATION',
    name: 'DevOps Infrastructure: GitHub Enterprise Code Signing Key Rotation',
    channel: 'VOICE',
    category: 'IT_SUPPORT',
    difficulty: 'HIGH',
    description: 'Simulates a lead DevOps engineer calling software developers claiming their GitHub SSH deploy key was revoked.',
    sender_profile: JSON.stringify({ name: 'DevSecOps Platform Engineering', phone: '+1 (415) 555-0187', caller_id: 'GITHUB-ENTERPRISE-ADMIN' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Liam O\'Connor, Lead DevOps Infrastructure Engineer',
      "Hey {{first_name}}, Liam from Platform Engineering. We are rotating all production deployment keys on GitHub Enterprise for {{company}}.",
      "To re-authorize your Git CLI pushing access, I just sent a 6-digit 2FA token to {{email}}. Can you read that out so I can whitelist your public key?",
      "The deployment pipeline for our upcoming sprint release is blocked waiting for your key! If you don't provide the code, the whole release is delayed.",
      'GITHUB-ENTERPRISE-ADMIN'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'DEVELOPER_TARGETING', 'Targeting Software Engineers & DevOps', 'Developers with elevated repository access are high-value targets for source code theft.',
      'SUPPLY_CHAIN_INJECTION', 'Code Signing Key Theft', 'Sharing 2FA codes allows adversaries to push backdoored code directly into production.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-expense-audit',
    code: 'VOICE_EXPENSE_AUDIT_VERIFY',
    name: 'Internal Audit: Corporate Amex Expense Reconciliation Verification',
    channel: 'VOICE',
    category: 'FINANCE',
    difficulty: 'LOW',
    description: 'Fake internal auditor calling regarding suspicious corporate credit card charges claiming card cancellation is imminent.',
    sender_profile: JSON.stringify({ name: 'Internal Financial Audit Committee', phone: '+1 (888) 555-0195', caller_id: 'INTERNAL-AUDIT-HOTLINE' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Gregory House, Senior Internal Financial Auditor',
      "Hello {{first_name}}, Gregory from Corporate Financial Audit. We noticed multiple unapproved charges on your corporate American Express card for {{department}}.",
      "To avoid suspending your card access before your upcoming business travel, please read the 6-digit confirmation code I just dispatched to {{email}}.",
      "If you refuse to cooperate with internal audit on this call, policy requires immediate cancellation of your corporate card and disciplinary reporting.",
      'INTERNAL-AUDIT-HOTLINE'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'AUDIT_INTIMIDATION', 'Internal Audit Disciplinary Threat', 'Fabricating disciplinary action to bypass rational verification procedures.',
      'CARD_SECURITY', 'Corporate Card OTP Protection', 'Financial institutions and internal audit do not require verbal OTP codes to reconcile charges.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-crowdstrike-agent',
    code: 'VOICE_CROWDSTRIKE_AGENT_FIX',
    name: 'Endpoint Protection: CrowdStrike Falcon Sensor Kernel Update Override',
    channel: 'VOICE',
    category: 'IT_SUPPORT',
    difficulty: 'CRITICAL',
    description: 'Caller claims employee Windows laptop has a faulty CrowdStrike driver causing BSOD unless a bypass maintenance PIN is supplied.',
    sender_profile: JSON.stringify({ name: 'Endpoint Protection Engineering', phone: '+1 (800) 555-0128', caller_id: 'CROWDSTRIKE-HOTFIX-LINE' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Dr. Simon Vance, Lead Endpoint Systems Architect',
      "Urgent technical alert {{first_name}}, Simon from Endpoint Security. A corrupted CrowdStrike channel file is causing blue-screen crashes across {{company}} workstations.",
      "We are injecting an emergency kernel patch to protect your machine. What is the 6-digit administrative override code displayed on your screen?",
      "If we don't apply this hotfix in 45 seconds, your laptop will crash into an unbootable blue-screen state and you will lose all unsaved files.",
      'CROWDSTRIKE-HOTFIX-LINE'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'NEWS_JACKING', 'News-Jacking Real Cybersecurity Incidents', 'Attackers capitalize on real-world IT outages (like CrowdStrike) to craft hyper-convincing lures.',
      'KERNEL_ACCESS', 'Administrative Maintenance Code Solicitation', 'Administrative override codes provide adversaries full root/SYSTEM control over your workstation.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-exec-assistant',
    code: 'VOICE_EXECUTIVE_PERSONAL_ASSIST',
    name: 'Executive Office: CEO Emergency Travel Booking Itinerary & Passcode',
    channel: 'VOICE',
    category: 'EXECUTIVE_IMPERSONATION',
    difficulty: 'MEDIUM',
    description: 'Impersonates the executive assistant to the CEO claiming an urgent board deck password is required while the CEO is in transit.',
    sender_profile: JSON.stringify({ name: 'Executive Assistant to the CEO', phone: '+1 (212) 555-0164', caller_id: 'CEO-EXECUTIVE-SUITE' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Claire Underwood, Chief of Staff to the CEO',
      "Hi {{first_name}}, this is Claire from the CEO's office. The CEO is stepping into an emergency board meeting for {{company}} right now.",
      "He needs the confidential password to unlock the {{department}} Q3 presentation folder. A temporary key was just sent to {{email}}. Can you read it to me?",
      "The CEO is literally waiting at the podium for these numbers! If you delay this board presentation, you will have to explain it directly to executive leadership.",
      'CEO-EXECUTIVE-SUITE'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'EXECUTIVE_ASSISTANT_PRETEXT', 'Chief of Staff / Assistant Impersonation', 'Adversaries often impersonate assistants who carry executive authority without raising direct suspicion.',
      'BOARD_ROOM_PRESSURE', 'Boardroom Emergency Pressure', 'Creating an artificial boardroom emergency to bypass standard password security policies.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-voice-mergers-alpha',
    code: 'VOICE_MERGERS_PROJECT_ALPHA',
    name: 'Investment Banking: M&A Project Alpha Secure Data Room One-Time Passcode',
    channel: 'VOICE',
    category: 'EXECUTIVE_IMPERSONATION',
    difficulty: 'CRITICAL',
    description: 'Controlled scenario where outside investment bankers demand access credentials to the confidential virtual data room for Project Alpha.',
    sender_profile: JSON.stringify({ name: 'Morgan Stanley M&A Advisory Team', phone: '+1 (212) 555-0191', caller_id: 'MORGAN-STANLEY-MA' }),
    payload_config: JSON.stringify(createVoiceConfig(
      'Harrison Forde, Managing Director at Morgan Stanley M&A',
      "Good evening {{first_name}}, Harrison Forde from Morgan Stanley. We are leading the multi-billion dollar acquisition for {{company}} under Project Alpha.",
      "The virtual data room access token has expired for {{department}} files. Please read the 6-digit Intralinks authorization code sent to {{email}}.",
      "Our legal counsel has 3 minutes to submit final bidding documents before the NASDAQ regulatory deadline! Provide the passcode immediately.",
      'MORGAN-STANLEY-MA'
    )),
    learning_indicators: JSON.stringify(createIndicators(
      'MA_PRETEXT', 'High-Stakes M&A Pretext', 'Investment banking and acquisition lures involve massive financial stakes designed to bypass normal skepticism.',
      'DATA_ROOM_SECURITY', 'Virtual Data Room Token Theft', 'Virtual data room credentials grant access to non-public material information (MNPI) subject to SEC regulations.'
    )),
    decision_tree: JSON.stringify({ states: ['INTRODUCTION', 'IDENTITY_CLAIM', 'PRESSURE', 'VERIFICATION', 'SAFE_EXIT', 'UNSAFE_DECISION'], safe_action: 'CALL_TERMINATED_SAFELY', unsafe_actions: ['CALL_SECRET_DISCLOSED'] })
  }
];

// ==========================================
// 2. EMAIL PHISHING SCENARIOS (22 Total)
// ==========================================
export const emailScenarios = [
  {
    id: 'scen-email-qr-mfa',
    code: 'EMAIL_QR_MFA_AUTHENTICATION',
    name: 'QR Code (Quishing): Microsoft 365 Mobile Authenticator Sync',
    channel: 'EMAIL',
    category: 'MFA',
    difficulty: 'HIGH',
    description: 'Simulates a modern QR code phishing attack (Quishing) directing employees to scan a deceptive QR code with their mobile phone camera.',
    sender_profile: JSON.stringify({ name: 'Microsoft 365 Identity Security', email: 'security-sync@microsoft-identity-auth-portal.com', reply_to: 'support@mfa-qr-sync.net', return_path: 'mailer@mfa-qr-sync.net', spoofed_domain: 'microsoft-identity-auth-portal.com', spf_pass: false, dkim_pass: false, title: 'Identity Protection Team' }),
    payload_config: JSON.stringify({
      subject: 'Action Required: Scan your dedicated QR Code to synchronize Microsoft Authenticator',
      body_html: buildEmailHtml('#0078d4', 'Microsoft 365 Security Alert', `<p>Hello <strong>{{first_name}}</strong>,</p><p>In accordance with updated zero-trust compliance for <strong>{{company}}</strong>, your multi-factor authentication (MFA) token for <strong>{{email}}</strong> requires renewal.</p><div style="background: #f8fafc; border: 1px dashed #cbd5e1; padding: 20px; text-align: center; margin: 18px 0; border-radius: 8px;"><p style="font-size: 12px; font-weight: bold; color: #475569; margin-bottom: 10px;">Scan with your mobile camera to authenticate:</p><svg width="120" height="120" viewBox="0 0 100 100" fill="#0f172a" style="display: inline-block; background: white; padding: 8px; border: 2px solid #0078d4; border-radius: 6px;"><rect x="5" y="5" width="30" height="30" fill="none" stroke="#0f172a" stroke-width="6"/><rect x="13" y="13" width="14" height="14" fill="#0f172a"/><rect x="65" y="5" width="30" height="30" fill="none" stroke="#0f172a" stroke-width="6"/><rect x="73" y="13" width="14" height="14" fill="#0f172a"/><rect x="5" y="65" width="30" height="30" fill="none" stroke="#0f172a" stroke-width="6"/><rect x="13" y="73" width="14" height="14" fill="#0f172a"/><rect x="45" y="15" width="10" height="20" fill="#0f172a"/><rect x="45" y="45" width="20" height="10" fill="#0f172a"/><rect x="65" y="65" width="15" height="15" fill="#0f172a"/></svg></div>`, 'Or click here to open MFA portal manually', 'Security Notice: QR code expires in 4 hours. Automated dispatch from Department: {{department}}.'),
      body_text: "Action Required: Scan your dedicated QR Code to synchronize Microsoft Authenticator. Click link or scan with phone.",
      fake_landing_type: 'MICROSOFT_SSO',
      landing_url: 'https://login.microsoftonline.security-auth-check.org/qr/auth'
    }),
    learning_indicators: JSON.stringify(createIndicators('QUISHING_QR', 'QR Code Attack Vector (Quishing)', 'Attackers embed QR codes in emails to bypass traditional text-based email security filters and force users onto unmanaged mobile devices.', 'DOMAIN_SPOOF', 'Spoofed Microsoft Domain', 'Sender address uses "microsoft-identity-auth-portal.com" rather than verified enterprise tenant.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_HEADERS', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-macro-invoice',
    code: 'EMAIL_MACRO_EXCEL_INVOICE',
    name: 'Weaponized Attachment: Q3 Executive Compensation & Bonus Matrix (.xlsm)',
    channel: 'EMAIL',
    category: 'FINANCE',
    difficulty: 'HIGH',
    description: 'Simulates a malicious macro-enabled Excel attachment designed to exploit human curiosity regarding confidential executive compensation.',
    sender_profile: JSON.stringify({ name: 'Corporate Compensation Committee', email: 'comp-review-internal@corporate-benefits-advisory.com', reply_to: 'payroll-audit@fastmail.fm', return_path: 'bounce@corporate-benefits-advisory.com', spoofed_domain: 'corporate-benefits-advisory.com', spf_pass: false, dkim_pass: false, title: 'Human Capital & Compensation' }),
    payload_config: JSON.stringify({
      subject: 'CONFIDENTIAL: Q3 Executive Compensation & Variable Bonus Allocation Matrix',
      body_html: buildEmailHtml('#064e3b', 'Executive Compensation Committee', `<p>Dear {{first_name}},</p><p>Please find attached the approved <strong>Q3 Executive Performance Bonus Matrix</strong> for <strong>{{company}}</strong>.</p><p>This spreadsheet contains confidential remuneration schedules for {{department}} leadership. Please enable all macros to decrypt the embedded calculation formulas.</p><div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px 16px; margin: 16px 0;"><strong>📎 Q3_Executive_Bonus_Matrix.xlsm</strong><div style="font-size: 11px; color: #64748b;">Excel Macro-Enabled Spreadsheet &bull; 184 KB</div></div>`, 'Download Spreadsheet (.xlsm)', 'Strictly Confidential &bull; For internal circulation only.'),
      body_text: "Attached is the Q3 Executive Compensation Matrix. Review attachment and enable macros.",
      attachment_name: 'Q3_Executive_Bonus_Matrix.xlsm',
      fake_landing_type: 'CUSTOM_PORTAL',
      landing_url: 'https://secure-docs-vault.portal-corporate-security.com/download/bonus.xlsm'
    }),
    learning_indicators: JSON.stringify(createIndicators('MACRO_ATTACHMENT', 'Macro-Enabled File Extension (.xlsm)', 'Legitimate business documents rarely require macro execution. Enabling macros can allow arbitrary malicious script execution.', 'CURIOSITY_BAIT', 'Salary & Compensation Pretext', 'Attackers exploit curiosity regarding peer executive compensation to lower defenses.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_HEADERS', 'ATTACHMENT_OPENED', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['ATTACHMENT_OPENED'] })
  },
  {
    id: 'scen-email-docusign-01',
    code: 'EMAIL_DOCUSIGN_SIGNATURE_REQUEST',
    name: 'DocuSign Electronic Signature: M&A Non-Disclosure Agreement',
    channel: 'EMAIL',
    category: 'EXECUTIVE_IMPERSONATION',
    difficulty: 'MEDIUM',
    description: 'Simulates a branded DocuSign notification requesting the employee sign a confidential acquisition contract.',
    sender_profile: JSON.stringify({ name: 'DocuSign Signature Service', email: 'dse@docusign-corporate-verify-gateway.com', reply_to: 'legal-advisory@fastmail.fm', return_path: 'bounce@docusign-corporate-verify-gateway.com', spoofed_domain: 'docusign-corporate-verify-gateway.com', spf_pass: false, dkim_pass: false, title: 'Electronic Signing Service' }),
    payload_config: JSON.stringify({
      subject: 'Please DocuSign: 2026 Strategic Acquisition Non-Disclosure Agreement #NDA-99218',
      body_html: buildEmailHtml('#263238', 'DocuSign Signature Gateway', `<p style="font-size: 15px;"><strong>Legal Counsel</strong> sent you a document to review and sign.</p><div style="background: #f8fafc; border-left: 4px solid #f59e0b; padding: 14px; margin: 18px 0; font-size: 13px;"><strong>Document:</strong> Strategic Acquisition NDA for {{company}}<br/><strong>Requested of:</strong> {{first_name}} {{last_name}} ({{department}})</div>`, 'REVIEW AND SIGN DOCUMENT', 'This message was intended for {{email}}. If not intended signer, report to IT Security immediately.'),
      body_text: "Legal Counsel sent you a document to review and sign via DocuSign. Click button to sign NDA.",
      fake_landing_type: 'MICROSOFT_SSO',
      landing_url: 'https://docusign.security-review-auth.org/sign/v4'
    }),
    learning_indicators: JSON.stringify(createIndicators('DOMAIN_SPOOF', 'Spoofed DocuSign Domain', 'Sender address uses "docusign-corporate-verify-gateway.com" instead of verified @docusign.net.', 'UNEXPECTED_NDA', 'Unsolicited Legal Document', 'Received an unexpected contract without prior internal context from executive staff.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_HEADERS', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-payroll-01',
    code: 'EMAIL_PAYROLL_DIRECT_DEPOSIT',
    name: 'Payroll Direct Deposit Verification Alert',
    channel: 'EMAIL',
    category: 'PAYROLL',
    difficulty: 'MEDIUM',
    description: 'Simulates a realistic corporate payroll notification claiming direct deposit information must be confirmed before the next pay cycle.',
    sender_profile: JSON.stringify({ name: 'Corporate Payroll Services', email: 'payroll-alerts@mycompany-hr-portal.com', reply_to: 'support@payroll-sync-verify.net', return_path: 'bounce@payroll-sync-verify.net', spoofed_domain: 'mycompany-hr-portal.com', spf_pass: false, dkim_pass: false, title: 'Payroll Administration' }),
    payload_config: JSON.stringify({
      subject: 'URGENT: Action Required - Confirm Direct Deposit Details for Upcoming Pay Cycle',
      body_html: buildEmailHtml('#0f172a', 'Automated Payroll Security Gateway', `<p>Dear <strong>{{first_name}} {{last_name}}</strong>,</p><p>During our routine quarterly compliance audit, our automated payroll system detected an unverified banking routing number linked to your direct deposit account for <strong>{{company}}</strong>.</p><div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px; margin: 16px 0; font-size: 13px;"><strong>Notice:</strong> If this discrepancy is not validated within <strong>24 hours</strong>, your upcoming paycheck for pay period ending <strong>{{date}}</strong> will be held in escrow.</div>`, 'Verify Direct Deposit Details', 'Reference ID: PAY-SEC-9921 &bull; Automated Payroll Dispatcher &bull; Department of Human Capital'),
      body_text: "URGENT: Action Required - Confirm Direct Deposit Details. Visit our portal immediately to verify direct deposit before paycheck is held.",
      fake_landing_type: 'PAYROLL_PORTAL',
      landing_url: 'https://verify-payroll.portal-corporate-security.com/auth/login'
    }),
    learning_indicators: JSON.stringify(createIndicators('DOMAIN_SPOOF', 'Lookalike Domain', 'Sender address uses "mycompany-hr-portal.com" rather than official company domain.', 'ARTIFICIAL_URGENCY', 'Extreme Urgency Tactic', 'Claims paycheck will be held in escrow within 24 hours to cause panic.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_HEADERS', 'INSPECT_LINK', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-it-02',
    code: 'EMAIL_IT_M365_PASSWORD_EXPIRY',
    name: 'Microsoft 365 Password Expiration Notice',
    channel: 'EMAIL',
    category: 'IT_SUPPORT',
    difficulty: 'LOW',
    description: 'Simulates a standard IT notification stating the corporate single sign-on (SSO) password will expire today.',
    sender_profile: JSON.stringify({ name: 'Global IT Support Desk', email: 'helpdesk@it-support-microsoft-online.com', reply_to: 'no-reply@security-auth-check.org', return_path: 'mailer@security-auth-check.org', spoofed_domain: 'it-support-microsoft-online.com', spf_pass: false, dkim_pass: false, title: 'IT Helpdesk' }),
    payload_config: JSON.stringify({
      subject: 'Action Required: Your Microsoft 365 SSO password expires in 6 hours',
      body_html: buildEmailHtml('#0078d4', 'Microsoft 365 Password Rotation', `<p>Hello <strong>{{first_name}}</strong>,</p><p>Your corporate password for <strong>{{email}}</strong> is scheduled to expire today in accordance with <strong>{{company}}</strong> IT security rotation policy.</p><p>To retain access to your Outlook inbox, Teams chats, and OneDrive documents without interruption, please keep your current password or choose a new one now.</p>`, 'Keep Current Password / Extend Access', 'This is a system-generated alert sent to {{department}} staff. Please do not reply directly.'),
      body_text: "Action Required: Your password expires today. Visit link to keep current password.",
      fake_landing_type: 'MICROSOFT_SSO',
      landing_url: 'https://login.microsoftonline.security-auth-check.org/oauth2/authorize'
    }),
    learning_indicators: JSON.stringify(createIndicators('MISLEADING_OFFER', 'Illogical IT Promise', '"Keep current password" is an oxymoron for legitimate password rotation policies.', 'DOMAIN_SPOOF', 'Unofficial Domain', 'Sender is "it-support-microsoft-online.com" instead of your actual enterprise tenant.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_HEADERS', 'INSPECT_LINK', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-google-oauth',
    code: 'EMAIL_GOOGLE_WORKSPACE_OAUTH',
    name: 'Google Workspace: 3rd-Party AI Analytics App Permissions Request',
    channel: 'EMAIL',
    category: 'ACCOUNT_SECURITY',
    difficulty: 'HIGH',
    description: 'Simulates a deceptive Google OAuth authorization consent email granting full Drive, Gmail, and Contacts access to a malicious 3rd-party app.',
    sender_profile: JSON.stringify({ name: 'Google Cloud Platform Accounts', email: 'no-reply@google-auth-workspace-apps.net', spoofed_domain: 'google-auth-workspace-apps.net', spf_pass: false, dkim_pass: false }),
    payload_config: JSON.stringify({
      subject: 'Security Alert: "AI Productivity Suite" requested access to your {{company}} Google Account',
      body_html: buildEmailHtml('#1a73e8', 'Google Workspace Security Review', `<p>Hi {{first_name}},</p><p>A newly authorized enterprise tool <strong>"AI Productivity Pro"</strong> has requested access to read, compose, and delete emails for <strong>{{email}}</strong>.</p><p>If you authorized this application for {{department}}, please verify your workspace OAuth token.</p>`, 'Review App Permissions & Authorize', 'Google Workspace Security &bull; Account Protection Team'),
      body_text: "Security Alert: AI Productivity Suite requested full account permissions. Click link to review.",
      fake_landing_type: 'GOOGLE_SSO',
      landing_url: 'https://accounts.google.com-oauth2-consent.net/auth'
    }),
    learning_indicators: JSON.stringify(createIndicators('ILLICIT_CONSENT', 'Illicit OAuth Consent Grant', 'Attackers trick users into granting broad API permissions rather than stealing raw passwords.', 'EXCESSIVE_PERMISSIONS', 'Dangerous Read/Delete Email Scope', 'Third-party tools rarely require full mailbox delete access.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_LINK', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-sharepoint-docs',
    code: 'EMAIL_SHARED_SHAREPOINT_FINANCIALS',
    name: 'Microsoft SharePoint: Confidential Executive Financial Forecast',
    channel: 'EMAIL',
    category: 'CLOUD_SECURITY',
    difficulty: 'MEDIUM',
    description: 'Lookalike Microsoft SharePoint notification claiming the CEO has shared an encrypted spreadsheet with financial projections.',
    sender_profile: JSON.stringify({ name: 'SharePoint Online Notifications', email: 'no-reply@sharepoint-corp-docs-online.com', spoofed_domain: 'sharepoint-corp-docs-online.com', spf_pass: false, dkim_pass: false }),
    payload_config: JSON.stringify({
      subject: 'Executive Office shared "2026_Q4_Financial_Projections_CONFIDENTIAL.xlsx" with you',
      body_html: buildEmailHtml('#0369a1', 'Microsoft SharePoint Online', `<p><strong>Executive Leadership</strong> shared a confidential OneDrive spreadsheet with you.</p><div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 14px; border-radius: 6px; margin: 16px 0;"><strong>📊 2026_Q4_Financial_Projections_CONFIDENTIAL.xlsx</strong><div style="font-size: 11px; color: #0369a1;">Restricted Access &bull; Executive Board circulation only</div></div>`, 'Open in Excel Online', 'This link is restricted to {{email}}. Single Sign-On required.'),
      body_text: "Executive Office shared a confidential OneDrive spreadsheet. Click link to open in Excel Online.",
      fake_landing_type: 'MICROSOFT_SSO',
      landing_url: 'https://sharepoint-docs-verify.net/view/excel'
    }),
    learning_indicators: JSON.stringify(createIndicators('CLOUD_SHARING_SPOOF', 'Spoofed SharePoint Cloud Share', 'Phishers mimic familiar SharePoint/OneDrive notification emails to harvest Microsoft 365 credentials.', 'UNSOLICITED_EXECUTIVE_SHARE', 'Unsolicited Board-Level File Share', 'Receiving high-level financial models out of the blue should trigger suspicion.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_LINK', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-aws-suspension',
    code: 'EMAIL_AWS_BILLING_SUSPENSION',
    name: 'AWS Cloud Infrastructure: Service Suspension Warning for Production VPC',
    channel: 'EMAIL',
    category: 'IT_SUPPORT',
    difficulty: 'HIGH',
    description: 'Adversary sends an urgent AWS billing alert claiming credit card failure will cause immediate shutdown of all EC2 instances.',
    sender_profile: JSON.stringify({ name: 'Amazon Web Services Billing', email: 'billing-dispute@aws-corporate-billing-portal.com', spoofed_domain: 'aws-corporate-billing-portal.com', spf_pass: false, dkim_pass: false }),
    payload_config: JSON.stringify({
      subject: 'CRITICAL: AWS Account #8491-0921 Past Due - Production Instance Termination in 12 Hours',
      body_html: buildEmailHtml('#232f3e', 'Amazon Web Services Billing Department', `<p>Dear AWS Customer,</p><p>We were unable to process the automatic monthly charge of <strong>$14,820.50</strong> for your primary EC2/RDS production cluster at <strong>{{company}}</strong>.</p><div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 14px; margin: 16px 0;"><strong>Notice:</strong> To avoid complete service termination and permanent data destruction, update your corporate payment card immediately.</div>`, 'Update Billing & Prevent Shutdown', 'Amazon Web Services, Inc. &bull; 410 Terry Ave N, Seattle, WA 98109'),
      body_text: "CRITICAL: AWS Account past due. Update payment card immediately to prevent server termination.",
      fake_landing_type: 'CUSTOM_PORTAL',
      landing_url: 'https://aws-billing-update-portal.org/auth/login'
    }),
    learning_indicators: JSON.stringify(createIndicators('INFRASTRUCTURE_PANIC', 'Threat of Production Outage', 'Engineers and IT managers react instinctively to protect critical cloud workloads.', 'PAYMENT_HARVESTING', 'Credit Card & Root Account Harvesting', 'The phishing page collects corporate credit card details and root AWS passwords.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_HEADERS', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-slack-device',
    code: 'EMAIL_SLACK_UNRECOGNIZED_DEVICE',
    name: 'Slack Enterprise: New Sign-In from Linux Terminal in Frankfurt',
    channel: 'EMAIL',
    category: 'ACCOUNT_SECURITY',
    difficulty: 'MEDIUM',
    description: 'Spoofed Slack security alert claiming unauthorized foreign login, directing the victim to verify credentials.',
    sender_profile: JSON.stringify({ name: 'Slack Security Alerts', email: 'security@slack-enterprise-audit-auth.com', spoofed_domain: 'slack-enterprise-audit-auth.com', spf_pass: false, dkim_pass: false }),
    payload_config: JSON.stringify({
      subject: 'New sign-in to {{company}} Slack from Linux (Frankfurt, Germany)',
      body_html: buildEmailHtml('#4a154b', 'Slack Enterprise Grid Security', `<p>Hi {{first_name}},</p><p>Your {{company}} Slack account was just accessed from a new device:</p><div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 6px; margin: 16px 0; font-family: monospace; font-size: 12px;">Device: Linux x86_64 / Chrome Headless<br/>Location: Frankfurt am Main, Germany<br/>IP Address: 194.26.29.112</div><p>If this was not you, lock your account and reset your session tokens immediately.</p>`, 'This Was NOT Me - Secure Account', 'Slack Technologies, LLC &bull; 500 Howard Street, San Francisco, CA'),
      body_text: "New sign-in to Slack from Germany. If not you, click link to secure account.",
      fake_landing_type: 'MICROSOFT_SSO',
      landing_url: 'https://slack.security-account-protect.net/lock'
    }),
    learning_indicators: JSON.stringify(createIndicators('SECURITY_ALERT_BAIT', 'Fake Security Breach Notification', 'Using fake security alerts causes users to lower their guard because they believe they are responding to an active attack.', 'DOMAIN_ANOMALY', 'Deceptive Security Domain', 'Sender domain is "slack-enterprise-audit-auth.com" rather than @slack.com.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_HEADERS', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-adobe-license',
    code: 'EMAIL_ADOBE_CREATIVE_INVOICE',
    name: 'Adobe Creative Cloud: Past-Due Enterprise License Renewal Invoice',
    channel: 'EMAIL',
    category: 'FINANCE',
    difficulty: 'LOW',
    description: 'Impersonates Adobe invoicing claiming design software licenses for Marketing will be deactivated in 24 hours.',
    sender_profile: JSON.stringify({ name: 'Adobe Enterprise Billing Team', email: 'billing@adobe-creative-cloud-invoicing.com', spoofed_domain: 'adobe-creative-cloud-invoicing.com', spf_pass: false, dkim_pass: false }),
    payload_config: JSON.stringify({
      subject: 'Invoice #AD-99120 Past Due: Adobe All Apps Enterprise Plan for {{department}}',
      body_html: buildEmailHtml('#eb1000', 'Adobe Creative Cloud Enterprise', `<p>Dear {{first_name}},</p><p>Your team annual subscription for <strong>Adobe Creative Cloud Enterprise</strong> has a past-due balance of <strong>$3,420.00</strong>.</p><p>Please review your attached statement and remit payment to prevent service disruption for {{company}} designers.</p>`, 'View Invoice & Pay Online', 'Adobe Systems Software Ireland Limited &bull; 4-6 Riverwalk, Dublin 24'),
      body_text: "Invoice #AD-99120 Past Due. Click link to view invoice and settle balance.",
      fake_landing_type: 'CUSTOM_PORTAL',
      landing_url: 'https://adobe-billing-portal.org/invoice/pay'
    }),
    learning_indicators: JSON.stringify(createIndicators('INVOICE_FRAUD', 'SaaS Renewal Invoice Fraud', 'SaaS subscription invoices are common routine business emails prone to unverified clicks.', 'EXTERNAL_PAYMENT_URL', 'Non-Adobe Payment Gateway', 'Payment button routes to an unauthorized third-party phishing host.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_LINK', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-concur-travel',
    code: 'EMAIL_CONCUR_TRAVEL_REIMBURSE',
    name: 'SAP Concur: Approved International Business Travel Reimbursement Voucher',
    channel: 'EMAIL',
    category: 'FINANCE',
    difficulty: 'MEDIUM',
    description: 'Simulates an SAP Concur corporate expense report approval claiming an unexpected $2,150 travel reimbursement is ready.',
    sender_profile: JSON.stringify({ name: 'SAP Concur Expense Processing', email: 'expense-notifications@concur-corporate-travel.net', spoofed_domain: 'concur-corporate-travel.net', spf_pass: false, dkim_pass: false }),
    payload_config: JSON.stringify({
      subject: 'Expense Report Approved: #EXP-2026-994 ($2,150.00 Reimbursement Approved)',
      body_html: buildEmailHtml('#008fd3', 'SAP Concur Expense Management', `<p>Hello {{first_name}},</p><p>Your recent travel and entertainment expense report has been approved by management for direct reimbursement:</p><div style="background: #f0fdf4; border: 1px solid #86efac; padding: 14px; border-radius: 6px; margin: 16px 0;"><strong>Approved Amount: $2,150.00 USD</strong><div style="font-size: 11px; color: #166534;">Disbursement Method: Automated ACH Transfer</div></div><p>Click below to verify your direct deposit destination account.</p>`, 'Confirm Bank Account for Deposit', 'SAP Concur Global Expense Platform &bull; Automated Dispatch'),
      body_text: "Expense Report Approved: $2,150.00. Click link to confirm bank account for direct deposit.",
      fake_landing_type: 'PAYROLL_PORTAL',
      landing_url: 'https://concur-expenses-verify.org/login'
    }),
    learning_indicators: JSON.stringify(createIndicators('FINANCIAL_REWARD', 'Unsolicited Financial Windfall', 'Unexpected expense reimbursements lure employees into quickly clicking without verifying legitimacy.', 'BANK_CREDENTIAL_THEFT', 'Harvesting Banking Credentials', 'The landing page collects banking and SSO credentials.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_LINK', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-zoom-recording',
    code: 'EMAIL_ZOOM_MEETING_RECORDING',
    name: 'Zoom Enterprise: Cloud Recording & Transcript of Executive Strategy Call',
    channel: 'EMAIL',
    category: 'SOCIAL_ENGINEERING',
    difficulty: 'MEDIUM',
    description: 'Adversary sends a fake Zoom recording notification for a meeting labeled "Q4 Executive Restructuring & Redundancy Plan".',
    sender_profile: JSON.stringify({ name: 'Zoom Cloud Recording Hub', email: 'no-reply@zoom-cloud-meetings-record.com', spoofed_domain: 'zoom-cloud-meetings-record.com', spf_pass: false, dkim_pass: false }),
    payload_config: JSON.stringify({
      subject: 'Cloud Recording Available: "Confidential Q4 Executive Restructuring Plan & Headcount Review"',
      body_html: buildEmailHtml('#2d8cff', 'Zoom Video Communications', `<p>Hi {{first_name}},</p><p>The cloud recording for the executive meeting <strong>"Q4 Executive Restructuring Plan"</strong> is now available for viewing.</p><div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 6px; margin: 16px 0;"><strong>📹 Duration: 42 mins (Passcode: Zoom2026!)</strong><div style="font-size: 11px; color: #64748b;">Attendees: Executive Leadership Team, HR Director</div></div>`, 'View Cloud Recording & Transcript', 'Zoom Video Communications, Inc. &bull; 55 Almaden Blvd, San Jose, CA'),
      body_text: "Cloud recording available: Q4 Restructuring Plan. Click link to view recording.",
      fake_landing_type: 'MICROSOFT_SSO',
      landing_url: 'https://zoom-recording-review-auth.com/watch'
    }),
    learning_indicators: JSON.stringify(createIndicators('FEAR_AND_CURIOSITY', 'Layoff & Restructuring Bait', 'Employees are terrified of sudden layoffs; bait mentioning restructuring triggers intense panic clicking.', 'FAKE_SSO_GATE', 'Fake SSO Login Gate for Video', 'Zoom cloud links that require re-entering corporate Microsoft passwords on non-standard domains are phishing.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_LINK', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-okta-fastpass',
    code: 'EMAIL_OKTA_FASTPASS_RENEW',
    name: 'Okta Identity Engine: Device Trust Certificate Expiration & Renewal',
    channel: 'EMAIL',
    category: 'MFA',
    difficulty: 'HIGH',
    description: 'Simulates an Okta FastPass device certificate revocation notification threatening loss of workstation SSO privileges.',
    sender_profile: JSON.stringify({ name: 'Okta Identity Security Engine', email: 'security@okta-enterprise-identity-auth.org', spoofed_domain: 'okta-enterprise-identity-auth.org', spf_pass: false, dkim_pass: false }),
    payload_config: JSON.stringify({
      subject: 'Action Required: Your Okta FastPass Device Certificate expires today for {{email}}',
      body_html: buildEmailHtml('#00297a', 'Okta Identity Cloud', `<p>Hello {{first_name}},</p><p>The trusted device certificate for your workstation in <strong>{{department}}</strong> has expired under zero-trust policy.</p><p>To maintain passwordless FastPass authentication without visiting IT in person, re-verify your device enrollment now.</p>`, 'Renew Okta Device Certificate', 'Okta, Inc. &bull; 100 First Street, Suite 600, San Francisco, CA'),
      body_text: "Action Required: Okta FastPass certificate expired. Click link to re-verify device.",
      fake_landing_type: 'MICROSOFT_SSO',
      landing_url: 'https://okta-auth-verify-device.org/renew'
    }),
    learning_indicators: JSON.stringify(createIndicators('CERTIFICATE_SPOOF', 'Device Certificate Expiry Pretext', 'Users trust security infrastructure brands (Okta, Duo) blindly when certificate warnings appear.', 'LOOKALIKE_URL', 'Phishing Domain with Subdomain Prefix', 'URL uses "okta-auth-verify-device.org" instead of your enterprise okta.com subdomain.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_HEADERS', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-github-pat',
    code: 'EMAIL_GITHUB_PAT_REVOCATION',
    name: 'GitHub Enterprise: Security Alert - Personal Access Token Compromised',
    channel: 'EMAIL',
    category: 'IT_SUPPORT',
    difficulty: 'HIGH',
    description: 'Adversary sends developers a fake GitHub security notice stating their Personal Access Token was leaked.',
    sender_profile: JSON.stringify({ name: 'GitHub Enterprise Security', email: 'no-reply@github-enterprise-security-alerts.com', spoofed_domain: 'github-enterprise-security-alerts.com', spf_pass: false, dkim_pass: false }),
    payload_config: JSON.stringify({
      subject: '[Security Alert] Personal Access Token with repo scope exposed on public paste site',
      body_html: buildEmailHtml('#24292e', 'GitHub Enterprise Security', `<p>Hi {{first_name}},</p><p>Our automated secret scanning engine detected your GitHub Personal Access Token (PAT) for <strong>{{company}}</strong> repositories posted publicly.</p><p>We have temporarily frozen your repository push permissions. Please sign in to regenerate your developer credentials.</p>`, 'Regenerate Compromised Token', 'GitHub, Inc. &bull; 88 Colin P Kelly Jr St, San Francisco, CA 94107'),
      body_text: "Security Alert: Personal Access Token exposed publicly. Click link to regenerate token.",
      fake_landing_type: 'CUSTOM_PORTAL',
      landing_url: 'https://github-auth-token-restore.net/login'
    }),
    learning_indicators: JSON.stringify(createIndicators('SECRET_SCANNING_PRETEXT', 'Fake Secret Leak Alert', 'Developers immediately rush to fix leaked tokens, bypassing normal link inspection.', 'CREDENTIAL_HARVESTER', 'Developer Credential Harvester', 'Harvests GitHub 2FA tokens and developer passwords.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_LINK', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-servicenow-p1',
    code: 'EMAIL_SERVICENOW_URGENT_TICKET',
    name: 'ServiceNow IT Service Portal: Priority 1 Outage Assigned to You',
    channel: 'EMAIL',
    category: 'IT_SUPPORT',
    difficulty: 'MEDIUM',
    description: 'Fake ServiceNow ticket notification assigning an urgent Sev-1 production outage to the employee.',
    sender_profile: JSON.stringify({ name: 'ServiceNow IT Service Portal', email: 'servicedesk@servicenow-corporate-ticket-hub.com', spoofed_domain: 'servicenow-corporate-ticket-hub.com', spf_pass: false, dkim_pass: false }),
    payload_config: JSON.stringify({
      subject: '[SEV-1 INCIDENT #INC-98214] Critical Outage: Core Production Gateway Assigned to {{first_name}} {{last_name}}',
      body_html: buildEmailHtml('#81b5a1', 'ServiceNow Enterprise IT Management', `<p>A Priority-1 Critical Incident has been automatically assigned to your queue:</p><div style="background: #fff1f2; border: 1px solid #fecdd3; padding: 14px; border-radius: 6px; margin: 16px 0;"><strong>Incident: #INC-98214 (SLA: 15 Mins)</strong><br/>Description: Core Payment Gateway Database Unresponsive<br/>Department: {{department}}</div><p>Click below to acknowledge the SLA ticket before managerial escalation.</p>`, 'Acknowledge Incident in ServiceNow', 'ServiceNow Enterprise Ticketing &bull; Automated Notification Engine'),
      body_text: "SEV-1 Incident #INC-98214 assigned to you. Click link to acknowledge SLA.",
      fake_landing_type: 'MICROSOFT_SSO',
      landing_url: 'https://servicenow-corp-portal-auth.org/incident/98214'
    }),
    learning_indicators: JSON.stringify(createIndicators('SLA_ESCALATION', 'SLA Clock Pressure', 'Threatening managerial escalation if the ticket is not acknowledged within 15 minutes.', 'PORTAL_IMPERSONATION', 'ServiceNow Login Harvesting', 'Reroutes the employee to a fraudulent SSO authentication page.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_LINK', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-workday-w2',
    code: 'EMAIL_WORKDAY_W2_TAX_FORM',
    name: 'Workday HR: Mandatory 2026 Electronic W-2 / 1099 Tax Form Review',
    channel: 'EMAIL',
    category: 'PAYROLL',
    difficulty: 'LOW',
    description: 'Impersonates Workday HR claiming the employee must verify personal Social Security Number on their tax form.',
    sender_profile: JSON.stringify({ name: 'Workday Enterprise HR Portal', email: 'hr-notifications@workday-payroll-benefits-online.com', spoofed_domain: 'workday-payroll-benefits-online.com', spf_pass: false, dkim_pass: false }),
    payload_config: JSON.stringify({
      subject: 'Action Required: Your 2026 Electronic W-2 Wage & Tax Statement is ready for review',
      body_html: buildEmailHtml('#e28122', 'Workday Enterprise HCM', `<p>Hello {{first_name}},</p><p>Your annual Wage & Tax Statement (Form W-2 / 1099) for <strong>{{company}}</strong> has been compiled by payroll.</p><p>IRS regulations require you to log in, confirm your filing status for {{department}}, and consent to electronic delivery.</p>`, 'View Tax Statement in Workday', 'Workday, Inc. &bull; 6110 Stoneridge Mall Road, Pleasanton, CA 94588'),
      body_text: "Your 2026 W-2 Tax Statement is ready. Click link to review in Workday.",
      fake_landing_type: 'PAYROLL_PORTAL',
      landing_url: 'https://workday-tax-review-auth.com/w2'
    }),
    learning_indicators: JSON.stringify(createIndicators('SEASONAL_TAX_SCAM', 'Seasonal Tax & W-2 Pretext', 'Tax season is heavily targeted by phishers to steal SSNs and divert tax refunds.', 'FAKE_WORKDAY_URL', 'Lookalike Workday Domain', 'Domain uses "workday-payroll-benefits-online.com" instead of verified corporate tenant.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_HEADERS', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-linkedin-inmail',
    code: 'EMAIL_LINKEDIN_RECRUITER_INMAIL',
    name: 'LinkedIn Talent: Confidential Executive Leadership Opportunity ($320k)',
    channel: 'EMAIL',
    category: 'SOCIAL_ENGINEERING',
    difficulty: 'MEDIUM',
    description: 'Spearphishing email impersonating an executive headhunter offering a lucrative VP role to harvest LinkedIn credentials.',
    sender_profile: JSON.stringify({ name: 'Korn Ferry Executive Search', email: 'recruiter@korn-ferry-executive-search.net', spoofed_domain: 'korn-ferry-executive-search.net', spf_pass: false, dkim_pass: false }),
    payload_config: JSON.stringify({
      subject: 'Confidential Leadership Inquiry for {{first_name}} {{last_name}} - Chief Operating Officer Candidate ($320k + Equity)',
      body_html: buildEmailHtml('#0077b5', 'LinkedIn Executive InMail', `<p>Dear {{first_name}},</p><p>Our executive search committee was impressed by your leadership profile in <strong>{{department}}</strong> at {{company}}.</p><p>We are managing a confidential search for a pre-IPO enterprise offering a total compensation package of <strong>$320,000 + equity</strong>. Please review the attached leadership dossier.</p>`, 'View Executive Role Dossier', 'LinkedIn Corporation &bull; 1000 W Maude Ave, Sunnyvale, CA 94085'),
      body_text: "Confidential executive role offer: $320k + Equity. Click link to view dossier.",
      fake_landing_type: 'CUSTOM_PORTAL',
      landing_url: 'https://linkedin-talent-inmail-review.org/job/view'
    }),
    learning_indicators: JSON.stringify(createIndicators('EGO_BAIT', 'Flattery & Executive Ego Bait', 'Appealing to personal ambition and massive salary numbers lowers critical defenses.', 'CREDENTIAL_HARVESTER', 'LinkedIn Login Phishing', 'Harvests social media credentials to conduct secondary spear phishing against coworkers.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_LINK', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-box-audit',
    code: 'EMAIL_BOX_ENTERPRISE_FILE_DROP',
    name: 'Box Cloud Storage: External Audit & Compliance Documents Shared',
    channel: 'EMAIL',
    category: 'CLOUD_SECURITY',
    difficulty: 'MEDIUM',
    description: 'Simulates a Box enterprise file transfer containing confidential compliance audit records.',
    sender_profile: JSON.stringify({ name: 'Box Secure File Transfer', email: 'no-reply@box-secure-enterprise-storage.com', spoofed_domain: 'box-secure-enterprise-storage.com', spf_pass: false, dkim_pass: false }),
    payload_config: JSON.stringify({
      subject: 'PwC External Audit Committee shared "2026_SOC2_Compliance_Audit_Package.zip" with you',
      body_html: buildEmailHtml('#0061d5', 'Box Enterprise Storage', `<p>PricewaterhouseCoopers (PwC) Audit Services has shared a secure Box folder with {{email}}.</p><div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 6px; margin: 16px 0;"><strong>📁 2026_SOC2_Compliance_Audit_Package.zip (28.4 MB)</strong><div style="font-size: 11px; color: #64748b;">Password protected &bull; Download link active for 48 hours</div></div>`, 'Open Secure Box Folder', 'Box, Inc. &bull; 900 Jefferson Ave, Redwood City, CA 94063'),
      body_text: "PwC shared compliance audit package via Box. Click link to download.",
      fake_landing_type: 'MICROSOFT_SSO',
      landing_url: 'https://box-cloud-verify-auth.org/folder/download'
    }),
    learning_indicators: JSON.stringify(createIndicators('AUDIT_PRETEXT', 'External Auditor Pretext', 'Leverages names of Big-4 accounting firms (PwC, Deloitte) to fabricate authority.', 'MALICIOUS_ARCHIVE', 'Encrypted Zip Archive Lure', 'Encrypted zip files are often used to deliver evasive infostealers.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_LINK', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-double-ext',
    code: 'EMAIL_DOUBLE_EXTENSION_PDF_EXE',
    name: 'Double Extension Attachment: Q3_Financial_Summary.pdf.exe',
    channel: 'EMAIL',
    category: 'FINANCE',
    difficulty: 'CRITICAL',
    description: 'Simulates a classic executable attachment disguised as a PDF document using double extensions (.pdf.exe).',
    sender_profile: JSON.stringify({ name: 'Corporate Financial Review', email: 'audit-reports@global-treasury-advisors.net', spoofed_domain: 'global-treasury-advisors.net', spf_pass: false, dkim_pass: false }),
    payload_config: JSON.stringify({
      subject: 'URGENT: Q3 Departmental Budget vs Actual Variance Report',
      body_html: buildEmailHtml('#334155', 'Financial Variance Review', `<p>Dear {{first_name}},</p><p>Please review the attached quarterly variance analysis for <strong>{{department}}</strong>.</p><p>Discrepancies exceeding 10% must be reviewed prior to our board audit reconciliation meeting.</p><div style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; margin: 16px 0;"><strong>📎 Q3_Financial_Summary.pdf.exe</strong><div style="font-size: 11px; color: #dc2626; font-weight: bold;">Application File &bull; 842 KB</div></div>`, 'Download and Execute Report', 'Corporate Financial Control &bull; Confidential Document'),
      body_text: "Attached is the Q3 Financial Summary. Please review attachment.",
      attachment_name: 'Q3_Financial_Summary.pdf.exe',
      fake_landing_type: 'CUSTOM_PORTAL',
      landing_url: 'https://secure-download-vault.net/report.exe'
    }),
    learning_indicators: JSON.stringify(createIndicators('DOUBLE_EXTENSION', 'Double Extension Attack (.pdf.exe)', 'Windows often hides known file extensions, making .pdf.exe appear as a harmless PDF icon.', 'EXECUTABLE_DELIVERY', 'Executable File Delivery via Email', 'Legitimate financial reports are never distributed as Windows .exe executable binaries.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_HEADERS', 'ATTACHMENT_OPENED', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['ATTACHMENT_OPENED'] })
  },
  {
    id: 'scen-email-salesforce-lock',
    code: 'EMAIL_SALESFORCE_SESSION_TIMEOUT',
    name: 'Salesforce CRM: Security Session Inactivity Lockout Alert',
    channel: 'EMAIL',
    category: 'IT_SUPPORT',
    difficulty: 'MEDIUM',
    description: 'Adversary sends an alert claiming the employee Salesforce CRM account is locked due to repeated invalid IP logins.',
    sender_profile: JSON.stringify({ name: 'Salesforce Trust Security', email: 'security@salesforce-identity-trust-auth.com', spoofed_domain: 'salesforce-identity-trust-auth.com', spf_pass: false, dkim_pass: false }),
    payload_config: JSON.stringify({
      subject: 'Your Salesforce account for {{company}} has been temporarily locked',
      body_html: buildEmailHtml('#00a1e0', 'Salesforce Trust & Security', `<p>Hi {{first_name}},</p><p>Your Salesforce CRM user session for <strong>{{email}}</strong> was locked following 5 consecutive failed API queries originating from an unapproved IP range.</p><p>To unlock your access and restore CRM data access, re-authenticate your enterprise credentials.</p>`, 'Unlock Salesforce Session', 'Salesforce, Inc. &bull; Salesforce Tower, 415 Mission Street, San Francisco, CA'),
      body_text: "Your Salesforce account has been locked. Click link to unlock session.",
      fake_landing_type: 'MICROSOFT_SSO',
      landing_url: 'https://login.salesforce-security-verify.net/unlock'
    }),
    learning_indicators: JSON.stringify(createIndicators('ACCOUNT_LOCKOUT_PANIC', 'Account Lockout Panic Pretext', 'Employees panic when losing access to their primary working tool and quickly enter credentials.', 'DOMAIN_SPOOF', 'Spoofed Salesforce Domain', 'Domain uses "salesforce-identity-trust-auth.com" instead of verified salesforce.com.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_LINK', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-apple-mdm',
    code: 'EMAIL_APPLE_BUSINESS_ENROLL',
    name: 'Apple Business Manager: Mandatory Corporate Device Management Profile',
    channel: 'EMAIL',
    category: 'IT_SUPPORT',
    difficulty: 'MEDIUM',
    description: 'Claims employee MacBook / iPhone must install an updated MDM profile to maintain access to corporate Wi-Fi.',
    sender_profile: JSON.stringify({ name: 'Apple Business Manager Dispatch', email: 'enrollment@apple-business-mdm-profile.org', spoofed_domain: 'apple-business-mdm-profile.org', spf_pass: false, dkim_pass: false }),
    payload_config: JSON.stringify({
      subject: 'Action Required: Install updated Apple MDM Security Profile on your corporate device',
      body_html: buildEmailHtml('#333333', 'Apple Business Manager', `<p>Hello {{first_name}},</p><p>Corporate IT has pushed an updated Mobile Device Management (MDM) security configuration for <strong>{{company}}</strong> Apple devices.</p><p>Click below on your Mac or iPhone to download and install the configuration profile.</p>`, 'Download & Install MDM Profile (.mobileconfig)', 'Apple Business Manager &bull; One Apple Park Way, Cupertino, CA 95014'),
      body_text: "Install updated Apple MDM Profile. Click link to download profile.",
      fake_landing_type: 'CUSTOM_PORTAL',
      landing_url: 'https://apple-mdm-enrollment-portal.org/download/profile.mobileconfig'
    }),
    learning_indicators: JSON.stringify(createIndicators('MALICIOUS_MDM', 'Malicious MDM Profile Injection', 'Installing rogue .mobileconfig profiles gives attackers complete remote management control over Apple devices.', 'UNAUTHORIZED_DISTRIBUTION', 'Unsolicited Profile Email', 'Enterprise MDM profiles are deployed automatically, never via unverified email links.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_LINK', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  },
  {
    id: 'scen-email-fedex-freight',
    code: 'EMAIL_FEDEX_FREIGHT_CUSTOMS',
    name: 'FedEx Freight: International Cargo Customs Invoice & Clearance Receipt',
    channel: 'EMAIL',
    category: 'DELIVERY',
    difficulty: 'LOW',
    description: 'Impersonates FedEx Freight claiming an international shipment is held pending customs clearance payment.',
    sender_profile: JSON.stringify({ name: 'FedEx International Freight Team', email: 'clearance@fedex-express-customs-invoicing.net', spoofed_domain: 'fedex-express-customs-invoicing.net', spf_pass: false, dkim_pass: false }),
    payload_config: JSON.stringify({
      subject: 'Delivery Exception: Shipment #FDX-8849-01 Held at Port of Entry (Duty Unpaid)',
      body_html: buildEmailHtml('#4d148c', 'FedEx Express Freight Services', `<p>Dear {{first_name}},</p><p>An air freight parcel addressed to <strong>{{first_name}} {{last_name}}</strong> ({{department}}) is held at JFK International Airport.</p><p>Customs duty of <strong>$48.50</strong> must be settled within 24 hours to avoid shipment return.</p>`, 'Pay Customs Clearance Online', 'Federal Express Corporation &bull; Memphis, TN 38120'),
      body_text: "Delivery Exception: Shipment #FDX-8849-01 Held at Customs. Pay duty fee online.",
      fake_landing_type: 'CUSTOM_PORTAL',
      landing_url: 'https://fedex-customs-clearance-auth.net/pay'
    }),
    learning_indicators: JSON.stringify(createIndicators('COURIER_FEE_TRAP', 'Courier Customs Fee Trap', 'Very common consumer and business phish asking for small card payments to steal credit cards.', 'LOOKALIKE_DOMAIN', 'Deceptive FedEx Lookalike Domain', 'Domain uses "fedex-express-customs-invoicing.net" instead of fedex.com.')),
    decision_tree: JSON.stringify({ actions: ['OPEN', 'INSPECT_LINK', 'CLICK_LINK', 'SUBMIT_CREDENTIALS', 'REPORT_PHISH'], safe_action: 'REPORT_PHISH', unsafe_actions: ['CLICK_LINK', 'SUBMIT_CREDENTIALS'] })
  }
];

// ==========================================
// 3. SMS (SMISHING) SCENARIOS (22 Total)
// ==========================================
export const smsScenarios = [
  {
    id: 'scen-sms-bank-01',
    code: 'SMS_BANK_FRAUD_ALERT',
    name: 'Commercial Banking: Urgent $4,850.00 Wire Fraud Cancellation Alert',
    channel: 'SMS',
    category: 'FINANCE',
    difficulty: 'MEDIUM',
    description: 'Simulates an urgent SMS alert claiming an unauthorized $4,850.00 wire transfer was initiated from the company commercial account.',
    sender_profile: JSON.stringify({ name: 'Commercial Bank Security', phone: '+1 (888) 492-7104', sender_id: 'CORP-BANK-SEC' }),
    payload_config: JSON.stringify({
      smish_text: '[SECURITY ALERT] A wire transfer of $4,850.00 to Global Trade FX was initiated on your commercial account ending in *4091. If you did NOT authorize this, cancel immediately at: {{simulation_link}} or reply STOP.',
      landing_url: 'https://security-dispute-auth.bank-commercial-corp.net/verify'
    }),
    learning_indicators: JSON.stringify(createIndicators('UNVERIFIED_PHONE', 'Suspicious Toll-Free SMS', 'Received financial alerts from an unrecognized 1-888 number.', 'PANIC_LINK', 'Panic-Inducing Phishing Link', 'Link points to "bank-commercial-corp.net" rather than authentic banking portal.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPLY_SMS', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK', 'REPLY_SMS'] })
  },
  {
    id: 'scen-sms-fedex-01',
    code: 'SMS_FEDEX_PARCEL_CUSTOMS',
    name: 'FedEx Delivery: Incomplete Address / $1.85 Customs Fee Required',
    channel: 'SMS',
    category: 'DELIVERY',
    difficulty: 'LOW',
    description: 'Classic parcel delivery smish claiming package #US-8849 cannot be delivered without address verification and fee payment.',
    sender_profile: JSON.stringify({ name: 'FedEx Express Courier', phone: '+1 (800) 463-3339', sender_id: 'FEDEX-ALERT' }),
    payload_config: JSON.stringify({
      smish_text: 'FedEx: Package #US-88491 is held at the local distribution depot due to an incomplete street number. Update address & pay $1.85 fee: {{simulation_link}}',
      landing_url: 'https://track-fedex-parcel-portal.net/fee'
    }),
    learning_indicators: JSON.stringify(createIndicators('SHORTENED_URL', 'Deceptive Tracking Link', 'Delivery couriers will not send unofficial domain links over SMS asking for credit card details.', 'CREDIT_CARD_TRAP', 'Small Micro-Transaction Phishing Trap', 'Attackers ask for tiny $1.85 fees to capture full credit card numbers and CVVs.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-m365-alert',
    code: 'SMS_M365_SECURITY_CHALLENGE',
    name: 'Microsoft 365: Suspicious Sign-In Detected from Moscow, Russia',
    channel: 'SMS',
    category: 'MFA',
    difficulty: 'HIGH',
    description: 'Fake Microsoft alert claiming foreign sign-in from Moscow, instructing employee to click link to secure account.',
    sender_profile: JSON.stringify({ name: 'Microsoft Account Security', phone: '+1 (800) 642-7676', sender_id: 'MSFT-SECURITY' }),
    payload_config: JSON.stringify({
      smish_text: '[Microsoft Security] Unrecognized sign-in attempt from Moscow, Russia (IP: 185.220.101.5) for {{email}}. If not you, block user session immediately: {{simulation_link}}',
      landing_url: 'https://login.microsoftonline.security-protect-check.org/block'
    }),
    learning_indicators: JSON.stringify(createIndicators('FOREIGN_SIGNIN_BAIT', 'Geographic Location Shock Tactic', 'Using hostile foreign locations (Moscow, Beijing) creates immediate panic.', 'FAKE_BLOCK_BUTTON', 'Malicious Account Protection Trap', 'The block account link leads to a reverse proxy capturing MFA cookies.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-payroll-sync',
    code: 'SMS_PAYROLL_DIRECT_DEPOSIT',
    name: 'Corporate Payroll: Direct Deposit Bank Routing Error Detected',
    channel: 'SMS',
    category: 'PAYROLL',
    difficulty: 'MEDIUM',
    description: 'SMS notification claiming direct deposit bank routing failed for next payroll.',
    sender_profile: JSON.stringify({ name: 'Corporate Payroll Gateway', phone: '+1 (877) 555-0142', sender_id: 'PAYROLL-SEC' }),
    payload_config: JSON.stringify({
      smish_text: 'Payroll Alert: Direct deposit account verification failed for {{first_name}} {{last_name}}. Update your banking information before 6 PM to receive tomorrow payroll: {{simulation_link}}',
      landing_url: 'https://verify-payroll-routing.net/login'
    }),
    learning_indicators: JSON.stringify(createIndicators('SALARY_THREAT', 'Threat of Unpaid Salary', 'Payroll smishing creates high emotional tension.', 'PORTAL_BYPASS', 'Unverified SMS Link for Banking', 'Bank details should only ever be modified by manually navigating to the bookmarked HR portal.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-usps-held',
    code: 'SMS_USPS_ADDRESS_INCOMPLETE',
    name: 'USPS Tracking: Package Held at Sorting Facility (Incomplete Street)',
    channel: 'SMS',
    category: 'DELIVERY',
    difficulty: 'LOW',
    description: 'Impersonates US Postal Service claiming package cannot be delivered.',
    sender_profile: JSON.stringify({ name: 'U.S. Postal Service Notifications', phone: '+1 (800) 275-8777', sender_id: 'USPS-TRACK' }),
    payload_config: JSON.stringify({
      smish_text: 'USPS: Your package #9400100021 cannot be delivered due to missing house number. Please confirm your street address within 12 hours: {{simulation_link}}',
      landing_url: 'https://usps-redelivery-address-update.com/track'
    }),
    learning_indicators: JSON.stringify(createIndicators('USPS_SMISHING', 'Widespread USPS Smishing Campaign', 'One of the most heavily reported smishing vectors in North America.', 'PHISHING_FORM', 'Address & Credit Card Harvester', 'Harvests personal address and payment details.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-amazon-otp',
    code: 'SMS_AMAZON_OTP_LOGIN',
    name: 'Amazon Business: One-Time Verification Code 849-201 for Corporate Account',
    channel: 'SMS',
    category: 'ACCOUNT_SECURITY',
    difficulty: 'HIGH',
    description: 'Fake Amazon OTP message claiming someone is logging in with the employee credentials.',
    sender_profile: JSON.stringify({ name: 'Amazon Security Verification', phone: '+1 (888) 280-4331', sender_id: 'AMAZON-AUTH' }),
    payload_config: JSON.stringify({
      smish_text: 'Amazon: 849201 is your OTP verification code for password reset. If you did NOT request this, cancel the unauthorized session immediately: {{simulation_link}}',
      landing_url: 'https://amazon-security-cancel-otp.org/auth'
    }),
    learning_indicators: JSON.stringify(createIndicators('FAKE_OTP_ALERT', 'Reverse OTP Cancellation Lure', 'Luring users to click a link claiming to "cancel" an OTP request.', 'REVERSE_PROXY', 'MFA Token Interception', 'Captures real OTPs during active account takeover attempts.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-chase-fraud',
    code: 'SMS_CHASE_COMMERCIAL_CARD',
    name: 'Chase Commercial: Credit Card ending in *4092 Flagged for Fraud',
    channel: 'SMS',
    category: 'FINANCE',
    difficulty: 'MEDIUM',
    description: 'Simulates a Chase fraud alert claiming commercial card was charged $1,250 at BestBuy.com.',
    sender_profile: JSON.stringify({ name: 'Chase Commercial Fraud Alert', phone: '+1 (800) 935-9935', sender_id: 'CHASE-FRAUD' }),
    payload_config: JSON.stringify({
      smish_text: 'Chase Fraud Alert: Was an online charge of $1,250.00 at BestBuy.com authorized on card *4092? Reply YES or NO. If unauthorized, dispute now: {{simulation_link}}',
      landing_url: 'https://chase-commercial-fraud-dispute.net/verify'
    }),
    learning_indicators: JSON.stringify(createIndicators('BANK_SMISHING', 'Card Fraud Dispute Smish', 'Financial institutions will not include third-party links to enter credentials.', 'OUT_OF_BAND_CALL', 'Call Number on Back of Card', 'Always call the authentic number on your corporate card.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPLY_SMS', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK', 'REPLY_SMS'] })
  },
  {
    id: 'scen-sms-duo-mfa',
    code: 'SMS_DUO_MOBILE_PUSH_SYNC',
    name: 'Duo Security: Duo Mobile MFA Token Expired - Re-register Authenticator',
    channel: 'SMS',
    category: 'MFA',
    difficulty: 'HIGH',
    description: 'Adversary sends a Duo Security token expiration notice claiming mobile push will stop working.',
    sender_profile: JSON.stringify({ name: 'Duo Security Authentication', phone: '+1 (888) 555-0153', sender_id: 'DUO-SECURITY' }),
    payload_config: JSON.stringify({
      smish_text: 'Duo Security: Your mobile push device token for {{company}} has expired. Re-authenticate your smartphone to prevent VPN lockout: {{simulation_link}}',
      landing_url: 'https://duo-mobile-auth-sync.org/enroll'
    }),
    learning_indicators: JSON.stringify(createIndicators('MFA_INFRA_SPOOF', 'Duo Security Brand Spoofing', 'Targeting 2FA tools creates a false sense of administrative legitimacy.', 'CREDENTIAL_STEALER', 'Workstation Password Stealer', 'Harvests corporate active directory credentials.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-uber-dispute',
    code: 'SMS_UBER_BUSINESS_RECEIPT',
    name: 'Uber for Business: $142.50 Ride Charged in London. Dispute if unauthorized',
    channel: 'SMS',
    category: 'FINANCE',
    difficulty: 'LOW',
    description: 'Fake Uber ride receipt for an international trip claiming corporate card was charged.',
    sender_profile: JSON.stringify({ name: 'Uber for Business Notifications', phone: '+1 (800) 555-0167', sender_id: 'UBER-RIDE' }),
    payload_config: JSON.stringify({
      smish_text: 'Uber: Your corporate ride in London, UK ($142.50) has completed. If you did NOT take this trip, dispute transaction immediately: {{simulation_link}}',
      landing_url: 'https://uber-business-dispute-receipts.net/dispute'
    }),
    learning_indicators: JSON.stringify(createIndicators('TRANSACTION_DISPUTE_BAIT', 'Fake Merchant Charge Alert', 'Pretending to have charged an employee account triggers an immediate urge to dispute.', 'UNOFFICIAL_DOMAIN', 'Deceptive Uber Domain', 'Domain is "uber-business-dispute-receipts.net" instead of uber.com.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-irs-rebate',
    code: 'SMS_IRS_TAX_REFUND_AUDIT',
    name: 'IRS Electronic Filing: Unclaimed $1,420 Corporate Tax Rebate',
    channel: 'SMS',
    category: 'FINANCE',
    difficulty: 'LOW',
    description: 'Impersonates IRS claiming an unclaimed employee tax rebate will expire.',
    sender_profile: JSON.stringify({ name: 'IRS Taxpayer Advocacy Service', phone: '+1 (800) 829-1040', sender_id: 'IRS-TAX-GOV' }),
    payload_config: JSON.stringify({
      smish_text: 'IRS Alert: You have an unclaimed corporate tax rebate of $1,420.50 pending direct deposit. Submit your routing number before midnight: {{simulation_link}}',
      landing_url: 'https://irs-electronic-tax-refund.org/direct-deposit'
    }),
    learning_indicators: JSON.stringify(createIndicators('GOVERNMENT_IMPERSONATION', 'IRS Government Smishing', 'The IRS NEVER contacts taxpayers via SMS text message to issue refunds.', 'SSN_THEFT', 'Identity Theft Form', 'Asks for SSN, Date of Birth, and Bank Routing numbers.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-paypal-restrict',
    code: 'SMS_PAYPAL_BUSINESS_RESTRICT',
    name: 'PayPal Commercial: Merchant Payment Processing Restricted',
    channel: 'SMS',
    category: 'FINANCE',
    difficulty: 'MEDIUM',
    description: 'Fake PayPal alert claiming merchant account has been restricted due to KYC compliance.',
    sender_profile: JSON.stringify({ name: 'PayPal Commercial Security', phone: '+1 (888) 221-1161', sender_id: 'PAYPAL-SEC' }),
    payload_config: JSON.stringify({
      smish_text: 'PayPal: Your merchant account processing has been temporarily restricted due to unverified KYC identity data. Restore account access: {{simulation_link}}',
      landing_url: 'https://paypal-merchant-identity-restore.net/auth'
    }),
    learning_indicators: JSON.stringify(createIndicators('ACCOUNT_SUSPENSION_PRETEXT', 'Merchant Account Restriction', 'Commercial teams panic when payment gateways are blocked.', 'PHISHING_LOGIN', 'Credential & Bank Account Harvester', 'Captures PayPal master credentials.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-delta-rebook',
    code: 'SMS_DELTA_FLIGHT_CANCEL',
    name: 'Delta Air Lines: Corporate Flight DL-482 Cancelled. Tap to Rebook',
    channel: 'SMS',
    category: 'SOCIAL_ENGINEERING',
    difficulty: 'LOW',
    description: 'Adversary sends an SMS claiming employee upcoming business flight has been cancelled.',
    sender_profile: JSON.stringify({ name: 'Delta Air Lines Flight Notifications', phone: '+1 (800) 221-1212', sender_id: 'DELTA-FLIGHT' }),
    payload_config: JSON.stringify({
      smish_text: 'Delta Alert: Flight DL-482 has been CANCELLED due to weather. Tap link to rebook alternative business seat immediately without fee: {{simulation_link}}',
      landing_url: 'https://delta-flight-rebooking-portal.org/rebook'
    }),
    learning_indicators: JSON.stringify(createIndicators('TRAVEL_PANIC', 'Flight Cancellation Shock', 'Business travelers rely heavily on mobile SMS for airline gate updates.', 'LOGIN_CREDENTIAL_THEFT', 'Corporate Travel Login Phishing', 'Harvests corporate booking credentials.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-wellsfargo-wire',
    code: 'SMS_WELLS_FARGO_WIRE_HOLD',
    name: 'Wells Fargo Commercial: Outbound $12,500 Wire Held for Verification',
    channel: 'SMS',
    category: 'FINANCE',
    difficulty: 'HIGH',
    description: 'Impersonates Wells Fargo treasury claiming an outbound wire is frozen.',
    sender_profile: JSON.stringify({ name: 'Wells Fargo Treasury Management', phone: '+1 (800) 869-3557', sender_id: 'WELLS-FARGO' }),
    payload_config: JSON.stringify({
      smish_text: 'Wells Fargo: Outbound wire of $12,500.00 to Apex Hardware is on HOLD pending secondary dual-authorization. Review and approve transaction: {{simulation_link}}',
      landing_url: 'https://wellsfargo-treasury-wire-auth.com/verify'
    }),
    learning_indicators: JSON.stringify(createIndicators('TREASURY_PRETEXT', 'Commercial Treasury Smishing', 'Targeting accounting and treasury personnel with legitimate-looking wire hold notices.', 'PHISHING_GATE', 'Banking Token Harvesting', 'Captures corporate bank login and RSA SecurID codes.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-verizon-overdue',
    code: 'SMS_VERIZON_BUSINESS_BILL',
    name: 'Verizon Business: Account Suspension Warning - Balance Due $89.10',
    channel: 'SMS',
    category: 'IT_SUPPORT',
    difficulty: 'LOW',
    description: 'Fake mobile carrier notice claiming corporate cellular lines will be disconnected tonight.',
    sender_profile: JSON.stringify({ name: 'Verizon Wireless Business Care', phone: '+1 (800) 922-0204', sender_id: 'VZW-BILLING' }),
    payload_config: JSON.stringify({
      smish_text: 'Verizon: Corporate line for {{first_name}} {{last_name}} has an overdue balance of $89.10. Pay before midnight to avoid line disconnection: {{simulation_link}}',
      landing_url: 'https://vzw-business-bill-pay-auth.net/pay'
    }),
    learning_indicators: JSON.stringify(createIndicators('TELECOM_SPOOF', 'Cellular Line Disconnection Threat', 'Employees fear losing cellular service during business hours.', 'CARD_THEFT', 'Credit Card Fraud Portal', 'Captures personal and corporate payment cards.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-google-verify',
    code: 'SMS_GOOGLE_RECOVERY_CODE',
    name: 'Google Security: Account Recovery Code 391-042 Requested',
    channel: 'SMS',
    category: 'ACCOUNT_SECURITY',
    difficulty: 'HIGH',
    description: 'Simulates a Google account recovery SMS prompt aiming to scare the user into clicking a deceptive link.',
    sender_profile: JSON.stringify({ name: 'Google Account Security', phone: '+1 (800) 555-0193', sender_id: 'GOOGLE-VERIFY' }),
    payload_config: JSON.stringify({
      smish_text: 'G-391042 is your Google verification code. Someone in Dallas, TX requested a password reset for {{email}}. If this was not you, secure your account: {{simulation_link}}',
      landing_url: 'https://accounts-google-verify-protect.com/secure'
    }),
    learning_indicators: JSON.stringify(createIndicators('RECOVERY_SMISH', 'Google Account Recovery Lure', 'Exploiting real Google verification code format to create urgency.', 'LOOKALIKE_GOOGLE', 'Spoofed Google Login', 'Harvests Google Workspace credentials.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-applepay-hold',
    code: 'SMS_APPLE_PAY_SUSPENSION',
    name: 'Apple Wallet: Apple Pay on Corporate iPhone Temporarily Suspended',
    channel: 'SMS',
    category: 'ACCOUNT_SECURITY',
    difficulty: 'MEDIUM',
    description: 'Adversary sends an SMS claiming Apple Pay on the corporate device has been deactivated.',
    sender_profile: JSON.stringify({ name: 'Apple Wallet Services', phone: '+1 (800) 275-2273', sender_id: 'APPLE-WALLET' }),
    payload_config: JSON.stringify({
      smish_text: 'Apple Security: Apple Pay on your corporate device has been temporarily suspended due to security policy. Tap link to re-verify Apple ID: {{simulation_link}}',
      landing_url: 'https://appleid-wallet-verify-auth.org/applepay'
    }),
    learning_indicators: JSON.stringify(createIndicators('APPLE_ID_PHISH', 'Apple ID & Wallet Harvesting', 'Harvests Apple ID credentials and two-factor authentication codes.', 'DEVICE_TARGETING', 'Mobile Device Threat', 'Targets iPhone and iPad business users.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-citi-payee',
    code: 'SMS_CITI_COMMERCIAL_ALERT',
    name: 'Citi Commercial: New Commercial Payee Added to Bank Account',
    channel: 'SMS',
    category: 'FINANCE',
    difficulty: 'HIGH',
    description: 'Fake commercial banking alert stating a new payee "Global FX Ltd" was added.',
    sender_profile: JSON.stringify({ name: 'Citi Commercial Bank Alert', phone: '+1 (800) 374-9700', sender_id: 'CITI-ALERT' }),
    payload_config: JSON.stringify({
      smish_text: 'Citi Alert: A new international payee (Global FX Ltd - Germany) was added to your commercial portal. If unauthorized, call or cancel now: {{simulation_link}}',
      landing_url: 'https://citi-commercial-security-portal.net/cancel'
    }),
    learning_indicators: JSON.stringify(createIndicators('PAYEE_ADDITION_PRETEXT', 'Unauthorized Payee Panic', 'Users rush to cancel unauthorized payees before unauthorized transfers occur.', 'BANK_HARVEST', 'Commercial Banking Phishing', 'Steals commercial credentials and corporate account numbers.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-zoom-room',
    code: 'SMS_ZOOM_SMS_INVITE',
    name: 'Zoom Meetings: Executive Waiting Room Invitation from CEO',
    channel: 'SMS',
    category: 'SOCIAL_ENGINEERING',
    difficulty: 'LOW',
    description: 'SMS notification claiming the CEO is waiting in an urgent Zoom meeting room for the employee.',
    sender_profile: JSON.stringify({ name: 'Zoom Meeting Coordinator', phone: '+1 (888) 555-0188', sender_id: 'ZOOM-INVITE' }),
    payload_config: JSON.stringify({
      smish_text: 'Zoom: Executive Leadership is waiting for {{first_name}} in "Urgent Strategy Room #8491". Tap to join video bridge now: {{simulation_link}}',
      landing_url: 'https://zoom-us-join-meeting-auth.org/j/8491'
    }),
    learning_indicators: JSON.stringify(createIndicators('WAITING_ROOM_PRESSURE', 'CEO Waiting in Meeting Room Panic', 'Believing executive leadership is waiting for you in an active meeting bypasses caution.', 'MALICIOUS_ZOOM_LINK', 'Deceptive Zoom Domain', 'Landing page downloads a malicious meeting updater or steals passwords.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-expensify-flag',
    code: 'SMS_EXPENSIFY_RECEIPT_FLAG',
    name: 'Expensify: Corporate Amex Expense Flagged for Missing Tax Receipt',
    channel: 'SMS',
    category: 'FINANCE',
    difficulty: 'MEDIUM',
    description: 'Adversary sends an SMS claiming an expense report for $340 was rejected.',
    sender_profile: JSON.stringify({ name: 'Expensify Corporate Auditing', phone: '+1 (800) 555-0136', sender_id: 'EXPENSIFY-APP' }),
    payload_config: JSON.stringify({
      smish_text: 'Expensify: Your expense report #EX-8821 ($340.00) was FLAGGED for missing tax receipts. Upload receipt before 5 PM to receive reimbursement: {{simulation_link}}',
      landing_url: 'https://expensify-receipts-portal.org/login'
    }),
    learning_indicators: JSON.stringify(createIndicators('EXPENSE_REJECTION_PRETEXT', 'Expense Report Audit Trigger', 'Staff members are keen to resolve rejected expense reports.', 'SSO_LOGIN_THEFT', 'Corporate SSO Harvester', 'Steals corporate Microsoft/Google login credentials.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-cvs-rx',
    code: 'SMS_HEALTHCARE_RX_DELIVERY',
    name: 'CVS Caremark: Specialty Prescription Delivery Delayed - Confirm Copay',
    channel: 'SMS',
    category: 'HR',
    difficulty: 'LOW',
    description: 'SMS notification claiming an essential prescription delivery is delayed awaiting insurance copay.',
    sender_profile: JSON.stringify({ name: 'CVS Caremark Specialty Pharmacy', phone: '+1 (800) 552-8159', sender_id: 'CVS-CAREMARK' }),
    payload_config: JSON.stringify({
      smish_text: 'CVS Caremark: Prescription delivery #RX-4891 is delayed. Please confirm your copay of $5.20 and delivery address to dispatch medication: {{simulation_link}}',
      landing_url: 'https://cvs-prescription-copay-verify.net/rx'
    }),
    learning_indicators: JSON.stringify(createIndicators('HEALTHCARE_LEVERAGE', 'Prescription Medication Lure', 'Targeting personal health and medication delivery causes immediate anxiety.', 'CREDIT_CARD_TRAP', 'Payment Card Harvesting', 'Steals personal credit cards and HIPAA medical insurance IDs.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  },
  {
    id: 'scen-sms-ceo-favor',
    code: 'SMS_CEO_URGENT_FAVOR',
    name: 'CEO Mobile: "Are you at your desk? I need a confidential favor right now."',
    channel: 'SMS',
    category: 'EXECUTIVE_IMPERSONATION',
    difficulty: 'HIGH',
    description: 'Classic CEO text message requesting employee buy Apple gift cards or wire funds for a confidential client gift.',
    sender_profile: JSON.stringify({ name: 'David Harrison (CEO Private)', phone: '+1 (212) 555-0174', sender_id: 'CEO-DIRECT' }),
    payload_config: JSON.stringify({
      smish_text: 'Hi {{first_name}}, this is David (CEO). I am in an all-day confidential board meeting with no reception. Are you at your desk? I need an urgent favor regarding {{department}}.',
      landing_url: 'https://executive-urgent-request.org/chat'
    }),
    learning_indicators: JSON.stringify(createIndicators('CEO_GIFT_CARD_SCAM', 'CEO Private Text Scam', 'Adversaries harvest executive cell phone numbers from public breaches to text subordinates.', 'OUT_OF_PROCESS_REQUEST', 'Bypassing Formal Channels via SMS', 'CEOs will not text subordinates demanding secret gift cards or wire transfers.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'REPLY_SMS', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['REPLY_SMS'] })
  },
  {
    id: 'scen-sms-airbnb-dispute',
    code: 'SMS_AIRBNB_BUSINESS_BOOKING',
    name: 'Airbnb Work: Reservation Confirmed $2,450. Tap to Review or Dispute',
    channel: 'SMS',
    category: 'FINANCE',
    difficulty: 'MEDIUM',
    description: 'Fake Airbnb booking notification for a $2,450 villa in Miami claiming corporate card was charged.',
    sender_profile: JSON.stringify({ name: 'Airbnb for Work Notifications', phone: '+1 (855) 424-7262', sender_id: 'AIRBNB-CORP' }),
    payload_config: JSON.stringify({
      smish_text: 'Airbnb: Corporate booking #HM-8849 ($2,450.00 - Miami Luxury Villa) has been charged to your company card. If this was not authorized by you, dispute now: {{simulation_link}}',
      landing_url: 'https://airbnb-business-dispute-portal.org/manage'
    }),
    learning_indicators: JSON.stringify(createIndicators('LARGE_UNAUTHORIZED_CHARGE', 'Shocking Charge Notification', 'Seeing a $2,450 charge on a corporate card triggers immediate panic to click and dispute.', 'PHISHING_LOGIN', 'Airbnb SSO Credential Harvester', 'Steals corporate passwords and session tokens.')),
    decision_tree: JSON.stringify({ actions: ['INSPECT_SMS', 'CLICK_LINK', 'REPORT_SMISH'], safe_action: 'REPORT_SMISH', unsafe_actions: ['CLICK_LINK'] })
  }
];

// ==========================================
// 4. MULTI-STAGE SCENARIOS (5 Total)
// ==========================================
export const multiStageScenarios = [
  {
    id: 'scen-multi-fin-01',
    code: 'MULTI_STAGE_VENDOR_FRAUD',
    name: 'Multi-Stage Coordinated Vendor Wire Fraud',
    channel: 'MULTI_STAGE',
    category: 'VENDOR',
    difficulty: 'CRITICAL',
    description: 'Coordinated 3-stage simulation where an employee receives an invoice email, followed by an SMS authorization request, and a voice confirmation follow-up.',
    sender_profile: JSON.stringify({ name: 'Global Cloud Infrastructure Services', email: 'billing-dispute@cloud-services-vendor-hub.com', phone: '+1 (800) 772-9182', spoofed_domain: 'cloud-services-vendor-hub.com' }),
    payload_config: JSON.stringify({
      stage_count: 3,
      stages: [
        { stage_number: 1, channel: 'EMAIL', subject: 'Past Due Notice: Annual Enterprise Cloud Infrastructure Renewal #INV-88392', body_html: '<p>Attached is the overdue invoice for {{company}}. Review before service suspension.</p>', action_required: 'INSPECT_AND_REPORT' },
        { stage_number: 2, channel: 'SMS', smish_text: 'Urgent: Cloud Services billing ticket #88392 regarding past due invoice requires confirmation. Check email or verify at {{simulation_link}}', action_required: 'REPORT_SMISH' },
        { stage_number: 3, channel: 'VOICE', voice_opening: 'Hi {{first_name}}, this is billing recovery following up on our email and SMS regarding the overdue cloud service invoice for {{company}}.', action_required: 'VERIFY_OR_TERMINATE' }
      ]
    }),
    learning_indicators: JSON.stringify(createIndicators('MULTI_CHANNEL_PRESSURE', 'Multi-Channel Coordinated Attack', 'Attackers reinforce legitimacy across Email, SMS, and Voice simultaneously.', 'SPOOFED_VENDOR', 'Unregistered Vendor Entity', 'Vendor domain was not in approved procurement registry.')),
    decision_tree: JSON.stringify({ stages: [1, 2, 3], safe_action: 'REPORTED_PHISH', unsafe_actions: ['LINK_CLICKED', 'CREDENTIAL_SUBMISSION_ATTEMPTED', 'CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-multi-m365-takeover',
    code: 'MULTI_STAGE_M365_TAKEOVER',
    name: 'Multi-Stage: Microsoft 365 Account Takeover & Voice Override',
    channel: 'MULTI_STAGE',
    category: 'MFA',
    difficulty: 'CRITICAL',
    description: 'Coordinated 3-stage attack: SMS warning triggers an Email MFA renewal, followed by an immediate voice call from "IT Security" to guide the user through the login.',
    sender_profile: JSON.stringify({ name: 'Microsoft Enterprise Identity Services', email: 'security@microsoft-identity-auth-portal.com', phone: '+1 (425) 555-0199', spoofed_domain: 'microsoft-identity-auth-portal.com' }),
    payload_config: JSON.stringify({
      stage_count: 3,
      stages: [
        { stage_number: 1, channel: 'SMS', smish_text: '[Microsoft 365] Security Alert: Suspicious sign-in detected on {{email}}. Check your email for identity confirmation steps.', action_required: 'REPORT_SMISH' },
        { stage_number: 2, channel: 'EMAIL', subject: 'Action Required: Renew your Microsoft 365 Identity Token', body_html: '<p>A security alert was dispatched to your mobile. Log in to renew your token.</p>', action_required: 'INSPECT_AND_REPORT' },
        { stage_number: 3, channel: 'VOICE', voice_opening: 'Hello {{first_name}}, this is Microsoft Cloud Operations following up on the SMS and email security alert sent to your account.', action_required: 'VERIFY_OR_TERMINATE' }
      ]
    }),
    learning_indicators: JSON.stringify(createIndicators('MULTI_STAGE_PIPELINE', 'Coordinated Multi-Vector Pipeline', 'SMS primes the victim for the email, and the phone call prevents analytical hesitation.', 'CROSS_CHANNEL_VERIFY', 'Cross-Channel Verification Mandatory', 'Always use verified internal channels to verify multi-channel alerts.')),
    decision_tree: JSON.stringify({ stages: [1, 2, 3], safe_action: 'REPORTED_PHISH', unsafe_actions: ['LINK_CLICKED', 'CREDENTIAL_SUBMISSION_ATTEMPTED', 'CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-multi-ceo-whaling',
    code: 'MULTI_STAGE_CEO_WHALING',
    name: 'Multi-Stage: Executive Whaling & Urgent Wire Fraud ($650k)',
    channel: 'MULTI_STAGE',
    category: 'EXECUTIVE_IMPERSONATION',
    difficulty: 'CRITICAL',
    description: 'Multi-vector simulation: Spearphishing email from the CEO, followed by an SMS text confirming urgency, and a deepfake voice call.',
    sender_profile: JSON.stringify({ name: 'David Harrison (Chief Executive Officer)', email: 'ceo-office@company-executive-direct.com', phone: '+1 (212) 555-0184', spoofed_domain: 'company-executive-direct.com' }),
    payload_config: JSON.stringify({
      stage_count: 3,
      stages: [
        { stage_number: 1, channel: 'EMAIL', subject: 'CONFIDENTIAL: Project Titan - Urgent Escrow Wire Instruction ($650,000)', body_html: '<p>{{first_name}}, I am in secret M&A negotiations. Prepare $650,000 escrow wire immediately.</p>', action_required: 'INSPECT_AND_REPORT' },
        { stage_number: 2, channel: 'SMS', smish_text: 'David here. Just emailed you regarding Project Titan escrow wire. Please expedite before 3 PM.', action_required: 'REPORT_SMISH' },
        { stage_number: 3, channel: 'VOICE', voice_opening: 'Hi {{first_name}}, David calling from my cell phone between meetings. Did you initiate the Project Titan wire?', action_required: 'VERIFY_OR_TERMINATE' }
      ]
    }),
    learning_indicators: JSON.stringify(createIndicators('WHALING_ESCROW', 'Multi-Channel Whaling Campaign', 'Attackers combine email authority with SMS and voice to overcome financial controls.', 'DUAL_CONTROL_MANDATE', 'Dual Control Wire Verification', 'Never execute high-value wires based solely on multi-channel electronic requests without verified directory callbacks.')),
    decision_tree: JSON.stringify({ stages: [1, 2, 3], safe_action: 'REPORTED_PHISH', unsafe_actions: ['LINK_CLICKED', 'CREDENTIAL_SUBMISSION_ATTEMPTED', 'CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-multi-payroll-hijack',
    code: 'MULTI_STAGE_PAYROLL_HIJACK',
    name: 'Multi-Stage: Corporate Payroll & Benefits Diversion',
    channel: 'MULTI_STAGE',
    category: 'PAYROLL',
    difficulty: 'HIGH',
    description: 'Coordinated attack targeting employee salary: Email notice of banking discrepancy, SMS urgent deadline reminder, and a voice call from fake payroll.',
    sender_profile: JSON.stringify({ name: 'Corporate Payroll Operations', email: 'payroll@corporate-benefits-advisory.com', phone: '+1 (888) 555-0163', spoofed_domain: 'corporate-benefits-advisory.com' }),
    payload_config: JSON.stringify({
      stage_count: 3,
      stages: [
        { stage_number: 1, channel: 'EMAIL', subject: 'URGENT: Direct Deposit Routing Discrepancy for {{first_name}} {{last_name}}', body_html: '<p>Direct deposit routing failed for your profile. Update banking credentials before pay period close.</p>', action_required: 'INSPECT_AND_REPORT' },
        { stage_number: 2, channel: 'SMS', smish_text: 'Payroll Alert: Your direct deposit update has not been completed. Salary will be held in 2 hours unless verified.', action_required: 'REPORT_SMISH' },
        { stage_number: 3, channel: 'VOICE', voice_opening: 'Hello {{first_name}}, this is Karen from payroll calling to assist with your direct deposit update.', action_required: 'VERIFY_OR_TERMINATE' }
      ]
    }),
    learning_indicators: JSON.stringify(createIndicators('PAYROLL_PIPELINE', 'Multi-Channel Payroll Scams', 'Attackers coordinate across channels to prevent the employee from contacting HR independently.', 'SELF_SERVICE_RULE', 'Self-Service Portal Security', 'Always log in directly to your bookmarked HR portal.')),
    decision_tree: JSON.stringify({ stages: [1, 2, 3], safe_action: 'REPORTED_PHISH', unsafe_actions: ['LINK_CLICKED', 'CREDENTIAL_SUBMISSION_ATTEMPTED', 'CALL_SECRET_DISCLOSED'] })
  },
  {
    id: 'scen-multi-cloud-breach',
    code: 'MULTI_STAGE_CLOUD_BREACH',
    name: 'Multi-Stage: AWS Cloud Infrastructure Root Compromise',
    channel: 'MULTI_STAGE',
    category: 'IT_SUPPORT',
    difficulty: 'CRITICAL',
    description: 'High-severity simulation: CloudWatch alert email, followed by an urgent root SMS, and an incoming voice call from the SOC Lead.',
    sender_profile: JSON.stringify({ name: 'AWS CloudWatch Incident Operations', email: 'alerts@aws-cloudwatch-incident-response.com', phone: '+1 (206) 555-0177', spoofed_domain: 'aws-cloudwatch-incident-response.com' }),
    payload_config: JSON.stringify({
      stage_count: 3,
      stages: [
        { stage_number: 1, channel: 'EMAIL', subject: '[CRITICAL ALARM] CloudWatch: Unauthorized IAM Access Key creation in us-east-1', body_html: '<p>CloudWatch detected unauthorized IAM administrator creation. Acknowledge incident in console.</p>', action_required: 'INSPECT_AND_REPORT' },
        { stage_number: 2, channel: 'SMS', smish_text: '[AWS Alert] P1 Cloud Incident: Unauthorized EC2 instances launched. Check email alert immediately.', action_required: 'REPORT_SMISH' },
        { stage_number: 3, channel: 'VOICE', voice_opening: 'Emergency call {{first_name}}, Marcus from Cloud Incident Response regarding the active IAM breach.', action_required: 'VERIFY_OR_TERMINATE' }
      ]
    }),
    learning_indicators: JSON.stringify(createIndicators('CLOUD_BREACH_PANIC', 'Cloud Incident Response Pretext', 'Creating fear of massive unauthorized cloud compute bills to compel instant compliance.', 'IAM_CREDS_PROTECTION', 'Root & IAM Access Key Defense', 'Never provide access keys, tokens, or OTP codes over the phone.')),
    decision_tree: JSON.stringify({ stages: [1, 2, 3], safe_action: 'REPORTED_PHISH', unsafe_actions: ['LINK_CLICKED', 'CREDENTIAL_SUBMISSION_ATTEMPTED', 'CALL_SECRET_DISCLOSED'] })
  }
];

// Combine all scenarios into a single export array (71 Total Scenarios!)
export const allScenarios = [
  ...voiceScenarios,
  ...emailScenarios,
  ...smsScenarios,
  ...multiStageScenarios
];
