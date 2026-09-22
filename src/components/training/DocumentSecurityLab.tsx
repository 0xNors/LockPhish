import React, { useState } from 'react';
import {
  FileText,
  FileCheck2,
  Paperclip,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Award,
  Lock,
  Download,
  AlertCircle
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface DocLabScenario {
  id: number;
  category: string;
  isWeaponized: boolean;
  fileName: string;
  fileSize: string;
  fileType: string;
  apparentSender: string;
  context: string;
  redFlags: string[];
  explanation: string;
}

export const docLabScenarios: DocLabScenario[] = [
  {
    id: 1,
    category: 'Weaponized Macro Spreadsheet',
    isWeaponized: true,
    fileName: 'Q3_Executive_Bonus_Matrix.xlsm',
    fileSize: '184 KB',
    fileType: 'Excel Macro-Enabled Worksheet (.xlsm)',
    apparentSender: 'compensation@company-executive-benefits.com',
    context: 'Unsolicited spreadsheet claiming to contain executive salary and bonus allocation schedules for your department. The document displays blurred text and prompts you to click "Enable Macros" to decrypt the calculations.',
    redFlags: [
      'Macro-enabled spreadsheet format (.xlsm)',
      'Curiosity bait regarding peer executive compensation',
      'Instruction to enable macros to "decrypt" content'
    ],
    explanation: 'Legitimate business spreadsheets do not require Visual Basic macros to display numbers. Enabling macros executes background scripts that download ransomware or infostealers.'
  },
  {
    id: 2,
    category: 'Authentic PDF Travel Guide',
    isWeaponized: false,
    fileName: '2026_Corporate_Travel_Policy.pdf',
    fileSize: '1.2 MB',
    fileType: 'Adobe Acrobat PDF Document (.pdf)',
    apparentSender: 'travel-desk@yourcompany.com',
    context: 'Standard corporate travel policy guidelines distributed annually by the internal travel coordinator with no active scripts or login requests.',
    redFlags: [],
    explanation: 'This is a SAFE standard PDF document containing only static text and vector formatting.'
  },
  {
    id: 3,
    category: 'Double Extension Disguised Executable',
    isWeaponized: true,
    fileName: 'Q3_Financial_Summary.pdf.exe',
    fileSize: '842 KB',
    fileType: 'Windows Executable Application (.exe)',
    apparentSender: 'audit@global-treasury-advisors.net',
    context: 'The file has a PDF icon on Windows, but the true file extension is ".exe". It claims to be an urgent financial variance analysis.',
    redFlags: [
      'Double extension (.pdf.exe) designed to exploit Windows default hidden extension settings',
      'The file is an executable program binary, not a document'
    ],
    explanation: 'Double extensions trick users into executing malicious software programs disguised with document icons.'
  },
  {
    id: 4,
    category: 'Authentic Vendor Receipt',
    isWeaponized: false,
    fileName: 'AWS_Monthly_Invoice_Oct2025.pdf',
    fileSize: '320 KB',
    fileType: 'Adobe Acrobat PDF Document (.pdf)',
    apparentSender: 'no-reply-aws@amazon.com',
    context: 'Standard monthly cloud billing statement with verified digital signatures from Amazon Web Services.',
    redFlags: [],
    explanation: 'This is an AUTHENTIC PDF invoice with verified digital signatures and no macro payloads.'
  },
  {
    id: 5,
    category: 'Encrypted Zip Archive / Password Protected',
    isWeaponized: true,
    fileName: 'Confidential_Audit_Evidence_Pass_1234.zip',
    fileSize: '4.8 MB',
    fileType: 'Compressed ZIP Archive (.zip)',
    apparentSender: 'auditor@pwc-compliance-review.org',
    context: 'The sender provides a password in the email body ("Password: 1234") and asks you to unzip the files on your workstation.',
    redFlags: [
      'Password-protected ZIP archive used specifically to prevent email gateway antivirus engines from inspecting the payload',
      'Contains an obfuscated JavaScript dropper inside'
    ],
    explanation: 'Attackers use password-protected ZIP archives to encrypt malware in transit so email spam filters cannot scan the contents.'
  },
  {
    id: 6,
    category: 'Disk Image ISO Malware Container',
    isWeaponized: true,
    fileName: 'Purchase_Order_PO9941.iso',
    fileSize: '1.8 MB',
    fileType: 'Optical Disk Image (.iso)',
    apparentSender: 'orders@vendor-procurement-sync.net',
    context: 'Email claims a purchase order is enclosed inside an ISO disk image container.',
    redFlags: [
      'Purchase orders are never distributed as ISO CD/DVD disk images',
      'Double-clicking an ISO mounts a virtual drive that bypasses Windows Mark-of-the-Web (MOTW) security checks'
    ],
    explanation: 'ISO containers are used by threat actors to evade endpoint download warnings and deliver loader malware.'
  },
  {
    id: 7,
    category: 'Authentic Word Document',
    isWeaponized: false,
    fileName: 'Department_Q4_Goals.docx',
    fileSize: '45 KB',
    fileType: 'Microsoft Word Document (.docx)',
    apparentSender: 'manager@yourcompany.com',
    context: 'Standard modern OpenXML Word document (.docx) with no macro code sent by your team manager.',
    redFlags: [],
    explanation: 'Standard .docx files cannot contain executable macros (unlike legacy .doc or .docm formats).'
  },
  {
    id: 8,
    category: 'HTML Application / SVG Phishing Carrier',
    isWeaponized: true,
    fileName: 'DocuSign_Contract_Review.html',
    fileSize: '28 KB',
    fileType: 'HTML Document (.html)',
    apparentSender: 'dse@docusign-contracts-online.net',
    context: 'The attachment is an .html file. When opened, it displays an offline Microsoft login page in your browser asking for passwords.',
    redFlags: [
      'HTML attachment designed to execute credential harvesting scripts locally inside your browser',
      'Offline phishing form evading network URL reputation scanners'
    ],
    explanation: 'HTML attachments contain embedded JavaScript that displays phishing login forms locally in the browser without loading an external webpage.'
  },
  {
    id: 9,
    category: 'Authentic CSV Spreadsheet',
    isWeaponized: false,
    fileName: 'customer_roster_export.csv',
    fileSize: '12 KB',
    fileType: 'Plain Text Comma-Separated Values (.csv)',
    apparentSender: 'crm-support@yourcompany.com',
    context: 'Plain text CSV data export generated by internal CRM database.',
    redFlags: [],
    explanation: 'Plain text CSV files contain raw data and cannot execute binary malware or embedded macros.'
  },
  {
    id: 10,
    category: 'VBScript / Powershell Script Dropper',
    isWeaponized: true,
    fileName: 'IT_Network_Diagnostic_Tool.vbs',
    fileSize: '4 KB',
    fileType: 'Visual Basic VBScript File (.vbs)',
    apparentSender: 'helpdesk@it-network-diagnostic.org',
    context: 'Email asks you to double-click this VBScript to test your internet speed and network latency.',
    redFlags: [
      'Executable script file (.vbs)',
      'Unsolicited utility sent via email',
      'Executes raw Windows scripting host commands'
    ],
    explanation: 'VBScripts execute directly inside Windows Script Host with full user privileges, allowing immediate infostealer execution.'
  }
];

interface DocumentSecurityLabProps {
  onClose?: () => void;
}

export const DocumentSecurityLab: React.FC<DocumentSecurityLabProps> = ({ onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);

  const scenario = docLabScenarios[currentIdx];
  const totalScenarios = docLabScenarios.length;
  const isAnswered = answers[scenario.id] !== undefined;
  const userAnswer = answers[scenario.id];
  const isCorrect = isAnswered && userAnswer === scenario.isWeaponized;

  const handleDecision = (userSelectedWeaponized: boolean) => {
    setAnswers(prev => ({ ...prev, [scenario.id]: userSelectedWeaponized }));
  };

  const handleNext = () => {
    if (currentIdx < totalScenarios - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      let correct = 0;
      docLabScenarios.forEach(s => {
        if (answers[s.id] === s.isWeaponized) correct++;
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
          <div className="p-2 rounded-xl bg-rose-950 text-rose-400 border border-rose-800">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-100">Document & Attachment Security Lab</h2>
            <p className="text-xs text-slate-400">Detect weaponized macros, double extensions, and malicious archives</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-rose-400 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800">
            File {currentIdx + 1} of {totalScenarios}
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
          <div className="w-20 h-20 rounded-full bg-rose-950/90 border-2 border-rose-400 flex items-center justify-center text-rose-400 mx-auto shadow-2xl">
            <Award className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-100">Attachment Security Lab Complete!</h3>
            <p className="text-xs text-slate-400 mt-1">Here is your file safety inspection score:</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 max-w-xs mx-auto grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
              <span className="text-2xl font-black text-rose-400">{Math.round((score.correct / score.total) * 100)}%</span>
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
        /* Active File Inspection Slide */
        <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
          {/* File Card Container */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-rose-400">Category: {scenario.category}</span>
              <Badge variant="neutral" size="sm">File Scenario #{scenario.id}</Badge>
            </div>

            {/* Visual Attachment Card */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3.5 truncate">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-200 shrink-0">
                  <Paperclip className="w-6 h-6 text-slate-400" />
                </div>
                <div className="truncate font-mono">
                  <h4 className="text-sm font-bold text-slate-100 truncate">{scenario.fileName}</h4>
                  <span className="text-[11px] text-slate-400 block">{scenario.fileType} &bull; {scenario.fileSize}</span>
                </div>
              </div>
            </div>

            {/* Context Narrative */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Delivery Context & Pretext:</span>
              <p className="text-slate-200 leading-relaxed font-sans">{scenario.context}</p>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                Sender: <span className="text-slate-300">{scenario.apparentSender}</span>
              </div>
            </div>
          </div>

          {/* Action Bar: Weaponized vs Safe */}
          {!isAnswered ? (
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl text-center space-y-4">
              <h4 className="text-sm font-bold text-slate-100">Is this attachment safe or weaponized / malicious?</h4>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleDecision(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border-2 border-rose-600 font-bold text-xs transition-all active:scale-95 shadow-lg shadow-rose-950/40"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>🚫 Weaponized / Malicious File</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision(false)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-2 border-emerald-600 font-bold text-xs transition-all active:scale-95 shadow-lg shadow-emerald-950/40"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>✅ Safe Document</span>
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
                      ? `Correct! This file is ${scenario.isWeaponized ? 'Weaponized / Malicious' : 'Safe'}.`
                      : `Incorrect. This file is actually ${scenario.isWeaponized ? 'Weaponized / Malicious' : 'Safe'}.`}
                  </h4>
                </div>
                <Badge variant={scenario.isWeaponized ? 'critical' : 'low'} size="sm">
                  {scenario.isWeaponized ? 'MALICIOUS ATTACHMENT' : 'SAFE FILE'}
                </Badge>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans">{scenario.explanation}</p>

              {scenario.redFlags.length > 0 && (
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1 font-sans">
                  <strong className="text-amber-400 block mb-1 text-[11px] uppercase">Concealed Red Flags in this File:</strong>
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
              {currentIdx < totalScenarios - 1 ? 'Next File' : 'View Final Score'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
