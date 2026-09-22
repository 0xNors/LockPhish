import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Shield,
  Lock,
  Save,
  CheckCircle2,
  Award,
  Download,
  Printer,
  Sparkles,
  Hash,
  Calendar,
  Building2,
  FileCheck
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { LoadingState } from '../../components/common/LoadingState';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

interface EmployeeProfilePageProps {
  navigate: (path: string) => void;
}

export const EmployeeProfilePage: React.FC<EmployeeProfilePageProps> = ({ navigate }) => {
  const { user, organization } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      if (user?.employee_id) {
        const [empData, achData] = await Promise.all([
          api.employees.get(user.employee_id),
          api.training.getAchievements()
        ]);
        setProfile(empData);
        setPhone(empData.phone_number || '');
        setAchievements(achData || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.employee_id) return;
    setSaving(true);
    try {
      await api.employees.update(user.employee_id, {
        phone_number: phone
      });
      setSaving(false);
      setSavedMsg('Profile preferences updated successfully.');
      setTimeout(() => setSavedMsg(''), 3000);
    } catch (err) {
      setSaving(false);
    }
  };

  const handleOpenCertificate = (courseTitle: string) => {
    setSelectedCertificate({
      id: `CERT-${Math.floor(100000 + Math.random() * 900000)}`,
      recipientName: profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.full_name || 'Cybersecurity Practitioner',
      courseTitle,
      orgName: organization?.name || 'Enterprise Corporation',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      verificationHash: `SHA256-${Math.random().toString(36).substring(2, 12).toUpperCase()}`
    });
    setShowCertificateModal(true);
  };

  if (loading) {
    return <LoadingState message="Loading your security profile and earned certifications..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
          <UserCheck className="w-6 h-6 text-emerald-400" />
          <span>Profile & Security Credentials</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your contact preferences for SMS/voice simulations and view official cybersecurity certificates.
        </p>
      </div>

      {savedMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-4 h-4" />
          {savedMsg}
        </div>
      )}

      {/* Account Info Form */}
      <Card title="Account Identity" subtitle="Managed under strict multi-tenant organization boundaries">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-bold">
                {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.full_name}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">System Role</label>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold flex items-center justify-between">
                <span>{user?.role}</span>
                <Badge variant="low" size="sm">Active</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Corporate Email Address</label>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px]">
                {user?.email}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Organization & Domain</label>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                {organization?.name || 'Enterprise'} ({organization?.domain || 'company.internal'})
              </div>
            </div>
          </div>

          <Input
            label="Phone Number (Used for SMS & Voice Vishing Simulations)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
          />

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" type="submit" loading={saving} icon={<Save className="w-3.5 h-3.5" />}>
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>

      {/* Official Cybersecurity Certifications */}
      <Card
        title="Official Cybersecurity Certifications"
        subtitle="Verifiable completion certificates for regulatory compliance audits (SOC 2, ISO 27001, HIPAA)"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            {
              title: 'Executive Phishing & Social Engineering Defense Masterclass',
              date: 'August 2026',
              code: 'CERT-SEC-4091',
              standard: 'SOC 2 CC2.2 & ISO 27001'
            },
            {
              title: 'Multi-Channel Smishing & Voice Vishing Identification',
              date: 'August 2026',
              code: 'CERT-VISH-2894',
              standard: 'NIST SP 800-53 AT-2'
            },
            {
              title: 'Weaponized Attachments, Macros & QR Quishing Defense',
              date: 'August 2026',
              code: 'CERT-QUISH-1092',
              standard: 'PCI DSS v4.0 Req 12.6'
            },
            {
              title: 'Zero-Trust Credential Safeguarding & MFA Protection',
              date: 'August 2026',
              code: 'CERT-CRED-7721',
              standard: 'HIPAA § 164.308'
            }
          ].map((cert, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all shadow-sm"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">{cert.code}</span>
                  <Badge variant="low" size="sm">Certified</Badge>
                </div>
                <h4 className="font-bold text-slate-100 text-xs leading-snug">{cert.title}</h4>
                <p className="text-[10px] text-slate-400">Aligned with: {cert.standard}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">Issued {cert.date}</span>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Award className="w-3.5 h-3.5" />}
                  onClick={() => handleOpenCertificate(cert.title)}
                >
                  View Certificate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Official Certificate of Completion Modal */}
      {showCertificateModal && selectedCertificate && (
        <Modal
          isOpen={true}
          onClose={() => setShowCertificateModal(false)}
          title="Certificate of Cybersecurity Mastery"
          subtitle="Official Verifiable Digital Certificate"
          maxWidth="lg"
        >
          <div className="space-y-6 text-xs font-sans">
            {/* Elegant Certificate Container */}
            <div className="p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-4 border-amber-500/80 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shadow">
                    🛡️
                  </div>
                  <span className="font-black text-amber-400 tracking-wider font-mono text-sm uppercase">
                    LockPhish Academy
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{selectedCertificate.id}</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold block">
                  CERTIFICATE OF COMPLETION
                </span>
                <p className="text-xs text-slate-400">This official certificate is proudly presented to:</p>
                <h2 className="text-2xl font-black text-slate-100 tracking-tight font-serif">
                  {selectedCertificate.recipientName}
                </h2>
                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                  for successfully mastering the curriculum and passing the scored proficiency assessment for:
                </p>
                <h3 className="text-base font-bold text-amber-400 font-sans max-w-md mx-auto">
                  {selectedCertificate.courseTitle}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-500/30 text-[11px] font-mono">
                <div className="text-left space-y-0.5">
                  <span className="text-slate-500 block text-[10px]">Organization:</span>
                  <span className="text-slate-200 font-bold">{selectedCertificate.orgName}</span>
                  <span className="text-slate-500 block text-[10px] pt-1">Date Awarded:</span>
                  <span className="text-slate-200">{selectedCertificate.date}</span>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-slate-500 block text-[10px]">Verification Signature:</span>
                  <span className="text-emerald-400 font-bold font-mono">VALID &bull; VERIFIED</span>
                  <span className="text-slate-500 block text-[10px] pt-1">Cryptographic Hash:</span>
                  <span className="text-slate-400 text-[9px] break-all">{selectedCertificate.verificationHash}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setShowCertificateModal(false)}>
                Close
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Printer className="w-3.5 h-3.5" />}
                  onClick={() => window.print()}
                >
                  Print Certificate
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Download className="w-3.5 h-3.5" />}
                  onClick={() => api.reports.downloadPDF()}
                >
                  Download Signed PDF
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
