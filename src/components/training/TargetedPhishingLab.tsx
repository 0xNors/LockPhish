import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Award,
  Building2,
  DollarSign,
  Lock,
  UserCheck
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface TargetedLabScenario {
  id: number;
  industry: string;
  isSpearPhish: boolean;
  targetRole: string;
  senderProfile: string;
  pretext: string;
  messageBody: string;
  redFlags: string[];
  explanation: string;
}

export const targetedLabScenarios: TargetedLabScenario[] = [
  {
    id: 1,
    industry: 'Corporate Finance & Treasury',
    isSpearPhish: true,
    targetRole: 'Senior Financial Controller',
    senderProfile: 'David Harrison <ceo-office@company-executive-direct.com>',
    pretext: 'Confidential M&A Escrow Wire Transfer ($480k)',
    messageBody: 'I am in confidential board negotiations for the European acquisition. I need you to release the $480,000 earnest money deposit wire to escrow before 3 PM. Due to regulatory secrecy, do not discuss this with the team.',
    redFlags: [
      'Demand for absolute secrecy bypassing standard accounting approvals',
      'Sender uses lookalike executive domain (@company-executive-direct.com)',
      'Artificial deadline pressure'
    ],
    explanation: 'Classic Executive Whaling / Business Email Compromise (BEC). Over 40% of corporate financial cyber losses occur through secret acquisition pretexts.'
  },
  {
    id: 2,
    industry: 'Healthcare & Patient Care',
    isSpearPhish: true,
    targetRole: 'Clinical Nurse Manager',
    senderProfile: 'State Health Department <compliance@state-health-audit-portal.org>',
    pretext: 'Mandatory Patient Electronic Health Record (EHR) Audit',
    messageBody: 'State health compliance inspectors are reviewing your hospital ward. Please upload the unencrypted patient discharge log for November to our auditor portal immediately to avoid Medicare certification suspension.',
    redFlags: [
      'Demanding unencrypted transmission of Protected Health Information (PHI)',
      'Threat of regulatory certification suspension',
      'External non-governmental domain (.org)'
    ],
    explanation: 'HIPAA and patient privacy laws prohibit unencrypted transmission of health records. Regulatory inquiries follow formal legal compliance channels.'
  },
  {
    id: 3,
    industry: 'Software Engineering & DevOps',
    isSpearPhish: true,
    targetRole: 'Senior Cloud DevOps Architect',
    senderProfile: 'GitHub Enterprise Security <alerts@github-enterprise-security-patch.net>',
    pretext: 'Critical Secret Key Leak in Private Repository',
    messageBody: 'Our automated bot detected an exposed AWS Production Root Secret Key in your private branch. Click to authenticate with your GitHub credentials and revoke the compromised token.',
    redFlags: [
      'Domain uses "github-enterprise-security-patch.net" instead of github.com',
      'Targeting developers with elevated root cloud infrastructure access'
    ],
    explanation: 'Spear phishers target software engineers with fake secret leak alerts to capture GitHub credentials and inject malicious code into production pipelines.'
  },
  {
    id: 4,
    industry: 'Internal Team Collaboration',
    isSpearPhish: false,
    targetRole: 'All Engineering Staff',
    senderProfile: 'Release Management <releases@yourcompany.com>',
    pretext: 'Scheduled Sprint 44 Production Release Notice',
    messageBody: 'Sprint 44 production deployment is scheduled for tonight at 11 PM EST. The deployment dashboard is available on the internal company intranet at https://intranet.yourcompany.com/deployments/sprint44.',
    redFlags: [],
    explanation: 'This is a LEGITIMATE internal operational announcement from verified corporate mail servers pointing to the internal intranet.'
  },
  {
    id: 5,
    industry: 'Legal & Compliance',
    isSpearPhish: true,
    targetRole: 'Associate General Counsel',
    senderProfile: 'Clerk of the Court <subpoena@us-district-court-docket-service.org>',
    pretext: 'Federal Court Subpoena & Evidence Preservation Order',
    messageBody: 'You are served with an emergency subpoena in Case #25-CV-9912. Failure to download and decrypt the evidentiary filing within 2 hours constitutes federal contempt of court.',
    redFlags: [
      'Domain ends in .org instead of official federal .uscourts.gov',
      'Threat of immediate arrest and contempt of court to induce panic'
    ],
    explanation: 'Federal court electronic filings (PACER) utilize verified .gov domains. Scammers weaponize legal intimidation to force malware downloads.'
  },
  {
    id: 6,
    industry: 'Human Resources & Recruiting',
    isSpearPhish: true,
    targetRole: 'Lead Technical Recruiter',
    senderProfile: 'Candidate Michael Chang <mchang.engineer.portfolio@gmail.com>',
    pretext: 'Senior Full-Stack Developer Resume & Coding Portfolio (.vbs archive)',
    messageBody: 'Attached is my CV and an interactive coding portfolio script showing my past microservices architecture. Please unzip and run the diagnostic demo.',
    redFlags: [
      'Resume distributed as a script container (.vbs)',
      'Unsolicited applicant asking the recruiter to execute code'
    ],
    explanation: 'Threat actors target HR recruiters with malicious executable portfolios disguised as resumes to establish initial corporate foothold.'
  },
  {
    id: 7,
    industry: 'Authentic Internal IT Announcement',
    isSpearPhish: false,
    targetRole: 'Corporate Staff',
    senderProfile: 'IT Service Desk <servicedesk@yourcompany.com>',
    pretext: 'Scheduled Wi-Fi Access Point Maintenance',
    messageBody: 'Please note that building 4 Wi-Fi will undergo firmware updates on Saturday from 2 AM to 4 AM. No user action is required.',
    redFlags: [],
    explanation: 'This is a LEGITIMATE informational IT maintenance announcement with verified sender headers and no action requests.'
  },
  {
    id: 8,
    industry: 'Supply Chain & Procurement',
    isSpearPhish: true,
    targetRole: 'Strategic Sourcing Manager',
    senderProfile: 'Global Freight Broker <rates@air-freight-procurement-sync.net>',
    pretext: 'Updated Q4 Air Cargo Contract Tariffs & Banking Coordinates',
    messageBody: 'Attached are the updated shipping rates for your international lanes. Please note our Chase bank account is being replaced by Wells Fargo for all future invoice remittances.',
    redFlags: [
      'Unsolicited banking coordinate changes embedded in rate sheets',
      'Unverified vendor domain'
    ],
    explanation: 'Vendor banking redirection scams trick procurement managers into updating payment details without verified callbacks.'
  },
  {
    id: 9,
    industry: 'Executive Office & C-Suite',
    isSpearPhish: true,
    targetRole: 'Executive Assistant to the CEO',
    senderProfile: 'Board of Directors <board-advisory@executive-governance-hub.com>',
    pretext: 'Emergency Board Deck Review & Financial Projection Access',
    messageBody: 'The board is meeting off-site. The CEO requested an immediate password bypass to review the confidential Q4 acquisition numbers. Enter credentials to unlock the encrypted presentation.',
    redFlags: [
      'Attempting to extract executive board presentation passwords',
      'Bypassing formal document repository controls'
    ],
    explanation: 'Adversaries target executive assistants because they hold administrative credentials and schedule access for senior leadership.'
  },
  {
    id: 10,
    industry: 'Authentic Corporate Expense Policy',
    isSpearPhish: false,
    targetRole: 'All Employees',
    senderProfile: 'Finance Policy Team <finance-policy@yourcompany.com>',
    pretext: 'Annual Mileage Reimbursement Rate Update for 2026',
    messageBody: 'The IRS has updated the standard business mileage reimbursement rate for 2026. The updated policy document is available on the internal portal at https://intranet.yourcompany.com/finance/mileage.',
    redFlags: [],
    explanation: 'This is a LEGITIMATE internal corporate policy update with authentic headers and verified internal links.'
  }
];

interface TargetedPhishingLabProps {
  onClose?: () => void;
}

export const TargetedPhishingLab: React.FC<TargetedPhishingLabProps> = ({ onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);

  const scenario = targetedLabScenarios[currentIdx];
  const totalScenarios = targetedLabScenarios.length;
  const isAnswered = answers[scenario.id] !== undefined;
  const userAnswer = answers[scenario.id];
  const isCorrect = isAnswered && userAnswer === scenario.isSpearPhish;

  const handleDecision = (userSelectedSpearPhish: boolean) => {
    setAnswers(prev => ({ ...prev, [scenario.id]: userSelectedSpearPhish }));
  };

  const handleNext = () => {
    if (currentIdx < totalScenarios - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      let correct = 0;
      targetedLabScenarios.forEach(s => {
        if (answers[s.id] === s.isSpearPhish) correct++;
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
    setScore(null);
  };

  return (
    <div className="max-w-3xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-sans text-slate-100 min-h-[720px]">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-950 text-purple-400 border border-purple-800">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-100">Targeted Spear Phishing & BEC Lab</h2>
            <p className="text-xs text-slate-400">Analyze high-context attacks tailored to specific job roles and industries</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-purple-400 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800">
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
        /* Completion Screen */
        <div className="p-10 text-center space-y-6 my-auto">
          <div className="w-20 h-20 rounded-full bg-purple-950/90 border-2 border-purple-400 flex items-center justify-center text-purple-400 mx-auto shadow-2xl">
            <Award className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-100">Targeted Phishing Lab Complete!</h3>
            <p className="text-xs text-slate-400 mt-1">Here is your spear phishing detection score:</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 max-w-xs mx-auto grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
              <span className="text-2xl font-black text-purple-400">{Math.round((score.correct / score.total) * 100)}%</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
              <span className="text-2xl font-black text-slate-100">{score.correct} / {score.total}</span>
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
        /* Active Spear Phishing Slide */
        <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
          {/* Scenario Case Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-400">Industry: {scenario.industry}</span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-xs text-slate-300">Target: <strong>{scenario.targetRole}</strong></span>
              </div>
              <Badge variant="neutral" size="sm">Spear Scenario #{scenario.id}</Badge>
            </div>

            {/* Simulated Email Context & Headers */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <div>From: <span className="text-slate-200">{scenario.senderProfile}</span></div>
              <div>Subject: <span className="text-slate-100 font-bold">{scenario.pretext}</span></div>
            </div>

            {/* Message Body */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Message Content:</span>
              <p>{scenario.messageBody}</p>
            </div>
          </div>

          {/* Action Bar: Spear Phish vs Legitimate */}
          {!isAnswered ? (
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl text-center space-y-4">
              <h4 className="text-sm font-bold text-slate-100">Is this communication legitimate or a targeted spear-phishing attack?</h4>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleDecision(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border-2 border-rose-600 font-bold text-xs transition-all active:scale-95 shadow-lg shadow-rose-950/40"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>🚫 Spear Phishing / BEC</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision(false)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-2 border-emerald-600 font-bold text-xs transition-all active:scale-95 shadow-lg shadow-emerald-950/40"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>✅ Legitimate Business</span>
                </button>
              </div>
            </div>
          ) : (
            /* Educational Instant Feedback */
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
                      ? `Correct! This is ${scenario.isSpearPhish ? 'Targeted Spear Phishing / BEC' : 'Legitimate Business'}.`
                      : `Incorrect. This is actually ${scenario.isSpearPhish ? 'Targeted Spear Phishing / BEC' : 'Legitimate Business'}.`}
                  </h4>
                </div>
                <Badge variant={scenario.isSpearPhish ? 'critical' : 'low'} size="sm">
                  {scenario.isSpearPhish ? 'SPEAR PHISHING ATTACK' : 'SAFE BUSINESS'}
                </Badge>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans">{scenario.explanation}</p>

              {scenario.redFlags.length > 0 && (
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1 font-sans">
                  <strong className="text-amber-400 block mb-1 text-[11px] uppercase">Concealed Red Flags in this Target Pretext:</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                    {scenario.redFlags.map((rf, i) => (
                      <li key={i}>{rf}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
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
