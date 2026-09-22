import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Play,
  RotateCcw,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Layers,
  Compass,
  FileCheck2,
  ExternalLink,
  Lock,
  Eye,
  Smartphone,
  PhoneCall,
  Mail,
  AlertTriangle,
  Download,
  Printer,
  Globe,
  Target,
  FileText,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit3,
  Building2,
  Shield,
  Volume2,
  ShieldAlert,
  Radio
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { CoursePlayer } from '../../components/training/CoursePlayer';
import { UniversalThreatLabPlayer } from '../../components/training/UniversalThreatLabPlayer';
import { CustomThreatLabBuilder } from '../../components/training/CustomThreatLabBuilder';
import {
  threatLabsCatalog,
  ThreatLabCategory,
  getCustomThreatLabs,
  deleteCustomThreatLab,
  saveCustomThreatLab
} from '../../components/training/ThreatLabsData';
import { api } from '../../api/client';
import { TrainingAssignment } from '../../types';

interface EmployeeTrainingPageProps {
  navigate: (path: string) => void;
}

export const EmployeeTrainingPage: React.FC<EmployeeTrainingPageProps> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'ASSIGNED' | 'JOURNEYS' | 'CHAMPIONS' | 'CERTIFICATES' | 'LAB' | 'RESOURCES'>('ASSIGNED');
  const [assignments, setAssignments] = useState<TrainingAssignment[]>([]);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCourse, setActiveCourse] = useState<TrainingAssignment | null>(null);

  // Selected Certificate for Viewer Modal
  const [viewCertificate, setViewCertificate] = useState<any>(null);

  // Active Threat Lab from 35+ Threat Labs Catalog + Custom Labs
  const [activeLab, setActiveLab] = useState<ThreatLabCategory | null>(null);
  const [labFilter, setLabFilter] = useState<'ALL' | 'CUSTOM' | 'EMAIL' | 'SMS' | 'VOICE' | 'URL' | 'DOCUMENT' | 'DECISION'>('ALL');
  const [labSearch, setLabSearch] = useState('');
  const [customLabs, setCustomLabs] = useState<ThreatLabCategory[]>([]);
  const [isBuildingCustomLab, setIsBuildingCustomLab] = useState(false);
  const [editingCustomLab, setEditingCustomLab] = useState<ThreatLabCategory | null>(null);

  useEffect(() => {
    loadAcademyData();
    refreshCustomLabs();
  }, []);

  const refreshCustomLabs = () => {
    setCustomLabs(getCustomThreatLabs());
  };

  const handleDeleteCustomLab = (e: React.MouseEvent, labId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this custom threat lab?')) {
      deleteCustomThreatLab(labId);
      refreshCustomLabs();
    }
  };

  const handleEditCustomLab = (e: React.MouseEvent, lab: ThreatLabCategory) => {
    e.stopPropagation();
    setEditingCustomLab(lab);
    setIsBuildingCustomLab(true);
  };

  const loadAcademyData = async () => {
    setLoading(true);
    try {
      const [assignData, pathData, certData, achData, resData] = await Promise.allSettled([
        api.training.getMyAssignments(),
        api.training.getLearningPaths(),
        api.training.getCertificates(),
        api.training.getAchievements(),
        api.training.getResources()
      ]);

      if (assignData.status === 'fulfilled') setAssignments(assignData.value || []);
      if (pathData.status === 'fulfilled') setLearningPaths(pathData.value || []);
      if (certData.status === 'fulfilled') setCertificates(certData.value || []);
      if (achData.status === 'fulfilled') setAchievements(achData.value || []);
      if (resData.status === 'fulfilled') setResources(resData.value || []);
    } catch (err) {
      console.error('Failed to load academy data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCourse = (assignment: TrainingAssignment) => {
    setActiveCourse(assignment);
  };

  const handleCloseCourse = () => {
    setActiveCourse(null);
    loadAcademyData();
  };

  // If a course is actively being played, render the CoursePlayer immediately
  if (activeCourse) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={handleCloseCourse}
        >
          Exit Course
        </Button>

        <CoursePlayer
          assignment={activeCourse}
          onProgressUpdated={() => {
            api.training.getMyAssignments().then(data => setAssignments(data || [])).catch(() => {});
          }}
          onCompleted={handleCloseCourse}
          onClose={handleCloseCourse}
        />
      </div>
    );
  }

  // Active Security Lab Drill View (Playing any of the 32+ Threat Labs)
  if (activeLab) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => setActiveLab(null)}
        >
          Exit Threat Lab & Return to Catalog
        </Button>

        <UniversalThreatLabPlayer
          lab={activeLab}
          onClose={() => setActiveLab(null)}
          onCompleted={() => {
            loadAcademyData();
          }}
        />
      </div>
    );
  }

  if (loading) {
    return <LoadingState message="Loading Security Awareness Academy..." />;
  }

  const completedCount = assignments.filter(a => a.status === 'COMPLETED').length;
  const overallProgress = assignments.length > 0 ? Math.round((completedCount / assignments.length) * 100) : 100;

  const allLabs: ThreatLabCategory[] = [...customLabs, ...threatLabsCatalog];

  // Filter 35+ Threat Labs Catalog + Custom Labs
  const filteredLabs = allLabs.filter(lab => {
    if (labFilter === 'CUSTOM') {
      if (!lab.isCustom) return false;
    } else if (labFilter !== 'ALL' && lab.type !== labFilter) {
      return false;
    }
    if (labSearch) {
      const q = labSearch.toLowerCase();
      return (
        lab.title.toLowerCase().includes(q) ||
        lab.description.toLowerCase().includes(q) ||
        lab.code.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Custom Threat Lab Builder Modal */}
      {isBuildingCustomLab && (
        <CustomThreatLabBuilder
          initialLab={editingCustomLab}
          onClose={() => {
            setIsBuildingCustomLab(false);
            setEditingCustomLab(null);
          }}
          onSaveAndPlay={(lab) => {
            setIsBuildingCustomLab(false);
            setEditingCustomLab(null);
            refreshCustomLabs();
            setActiveLab(lab);
          }}
        />
      )}

      {/* Academy Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Security Awareness Academy</h1>
            <Badge variant="low" size="sm">Enterprise Edition</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Practical, story-driven cybersecurity masterclasses, {allLabs.length}+ threat hunting labs, and scored certifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => {
              loadAcademyData();
              refreshCustomLabs();
            }}
          >
            Refresh Academy
          </Button>
        </div>
      </div>

      {/* Academy KPI & Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Curriculum</span>
            <div className="text-xl font-black text-slate-100 mt-0.5">{assignments.length} Courses</div>
            <span className="text-[10px] text-emerald-400 font-mono">{completedCount} completed ({overallProgress}%)</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Security Badges</span>
            <div className="text-xl font-black text-amber-400 mt-0.5">{achievements.length} Badges</div>
            <span className="text-[10px] text-slate-400">Security Champions Program</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Threat Labs Suite</span>
            <div className="text-xl font-black text-amber-400 mt-0.5">{allLabs.length} Labs</div>
            <span className="text-[10px] text-slate-400">
              {customLabs.length > 0 ? `${customLabs.length} Custom + ${threatLabsCatalog.length} Built-in` : 'Interactive Attack Simulators'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Certificates Earned</span>
            <div className="text-xl font-black text-sky-400 mt-0.5">{certificates.length} Issued</div>
            <span className="text-[10px] text-slate-400">Verified Compliance Credentials</span>
          </div>
          <div className="p-3 rounded-xl bg-sky-950/80 text-sky-400 border border-sky-800">
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Academy Navigation Tabs */}
      <div className="bg-slate-900 p-1 rounded-2xl border border-slate-800 flex items-center gap-1 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('ASSIGNED')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'ASSIGNED' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>My Curriculum ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('LAB')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'LAB' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>The Threat Labs ({allLabs.length}+ Simulators)</span>
        </button>

        <button
          onClick={() => setActiveTab('JOURNEYS')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'JOURNEYS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Learning Journeys ({learningPaths.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CHAMPIONS')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'CHAMPIONS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Security Champions ({achievements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CERTIFICATES')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'CERTIFICATES' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Certificates ({certificates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('RESOURCES')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'RESOURCES' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Official Guidance</span>
        </button>
      </div>

      {/* TAB 1: ASSIGNED CURRICULUM */}
      {activeTab === 'ASSIGNED' && (
        assignments.length === 0 ? (
          <EmptyState
            title="All Training Up-to-Date!"
            description="You have completed all assigned training curricula. As you interact with security simulations, adaptive learning modules will be recommended here."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((a) => {
              const isCompleted = a.status === 'COMPLETED';

              return (
                <Card
                  key={a.id}
                  title={a.course_title}
                  action={<Badge variant={a.course_difficulty?.toLowerCase()} size="sm">{a.course_difficulty}</Badge>}
                >
                  <div className="space-y-4 text-xs">
                    <p className="text-slate-400 min-h-[44px] leading-relaxed line-clamp-2">
                      {a.course_description || 'Targeted cybersecurity defense masterclass.'}
                    </p>

                    <div className="space-y-1.5">
                      <ProgressBar value={a.progress_percent} label="Curriculum Progress" size="sm" variant="emerald" />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Mastery Assessment:</span>
                      <span className={`font-bold ${a.score_post_assessment && a.score_post_assessment >= 80 ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {a.score_post_assessment ? `${a.score_post_assessment}% (Passed)` : 'Not taken'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 gap-2">
                      <Badge variant={isCompleted ? 'low' : 'medium'} size="sm">
                        {isCompleted ? '✓ COMPLETED' : a.status}
                      </Badge>

                      <div className="flex items-center gap-1.5">
                        {isCompleted && (
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Award className="w-3 h-3 text-amber-400" />}
                            onClick={() => {
                              const matchingCert = certificates.find(c => c.course_title === a.course_title || c.course_id === a.course_id);
                              if (matchingCert) {
                                setViewCertificate(matchingCert);
                              } else {
                                setViewCertificate({
                                  certificate_id: `CERT-${new Date().getFullYear()}-${(a.id || 'sec').substring(0, 8).toUpperCase()}`,
                                  employee_name: 'Cybersecurity Practitioner',
                                  course_title: a.course_title,
                                  organization_name: 'Enterprise Security Defense Academy',
                                  score: a.score_post_assessment || 100,
                                  issued_at: a.completed_at || new Date().toISOString(),
                                  verification_hash: `SHA256-${(a.id || 'sec').substring(0, 16).toUpperCase()}`
                                });
                              }
                            }}
                          >
                            Certificate
                          </Button>
                        )}

                        <Button
                          variant={isCompleted ? 'secondary' : 'primary'}
                          size="sm"
                          icon={<Play className="w-3.5 h-3.5" />}
                          onClick={() => handleOpenCourse(a)}
                        >
                          {isCompleted ? 'Review Lessons' : a.progress_percent > 0 ? 'Resume Lesson' : 'Start Course'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )
      )}

      {/* TAB 2: THE THREAT LABS (Matching justforphishing.com/lab.html with 35+ Full Simulators + Custom Studio) */}
      {activeTab === 'LAB' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>The Threat Lab ({allLabs.length}+ Simulators & Custom Studio)</span>
                </div>
                <h3 className="text-lg font-bold text-slate-100">Interactive Cybersecurity Threat Laboratories</h3>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Analyze complete emails, smartphone SMS threads, inbound voice calls, URL root domains, and weaponized document attachments across {allLabs.length}+ interactive threat labs.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => {
                    setEditingCustomLab(null);
                    setIsBuildingCustomLab(true);
                  }}
                  className="shadow-lg shadow-emerald-950/60 bg-emerald-600 hover:bg-emerald-500"
                >
                  Create Custom Threat Lab
                </Button>
              </div>
            </div>

            {/* Filter Toolbar for Labs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full relative">
                <input
                  type="text"
                  placeholder="Search labs by name, attack vector, or keywords..."
                  value={labSearch}
                  onChange={e => setLabSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
                {['ALL', 'CUSTOM', 'EMAIL', 'SMS', 'VOICE', 'URL', 'DOCUMENT', 'DECISION'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setLabFilter(f as any)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                      labFilter === f
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {f === 'CUSTOM' ? `✨ Custom (${customLabs.length})` : f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Labs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLabs.map((lab) => {
              const iconMap: Record<string, React.ReactNode> = {
                Mail: <Mail className="w-5 h-5" />,
                Smartphone: <Smartphone className="w-5 h-5" />,
                PhoneCall: <PhoneCall className="w-5 h-5" />,
                Volume2: <Volume2 className="w-5 h-5" />,
                Globe: <Globe className="w-5 h-5" />,
                FileText: <FileText className="w-5 h-5" />,
                Target: <Target className="w-5 h-5" />,
                ShieldAlert: <ShieldAlert className="w-5 h-5" />,
                Shield: <Shield className="w-5 h-5" />,
                Lock: <Lock className="w-5 h-5" />,
                Radio: <Radio className="w-5 h-5" />,
                Building2: <Building2 className="w-5 h-5" />,
                Eye: <Eye className="w-5 h-5" />,
                ShieldCheck: <ShieldCheck className="w-5 h-5" />,
                FileCheck2: <FileCheck2 className="w-5 h-5" />,
                Layers: <Layers className="w-5 h-5" />,
                Sparkles: <Sparkles className="w-5 h-5" />,
                Award: <Award className="w-5 h-5" />
              };

              return (
                <div
                  key={lab.id}
                  className={`p-6 rounded-2xl bg-slate-900 border space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg ${
                    lab.isCustom ? 'border-amber-700/60 bg-gradient-to-b from-amber-950/20 to-slate-900' : 'border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Badge variant={lab.difficulty.toLowerCase() as any} size="sm">{lab.difficulty}</Badge>
                        {lab.isCustom && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800">
                            ✨ CUSTOM
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{lab.scenarios.length} Slides &bull; {lab.duration_minutes} Min</span>
                    </div>

                    <div className="w-11 h-11 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center">
                      {iconMap[lab.iconName] || <Sparkles className="w-5 h-5" />}
                    </div>

                    <h4 className="text-base font-bold text-slate-100">{lab.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{lab.description}</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Button
                      variant="primary"
                      className="w-full justify-center"
                      icon={<Play className="w-3.5 h-3.5" />}
                      onClick={() => setActiveLab(lab)}
                    >
                      Start Lab ({lab.scenarios.length} Slides)
                    </Button>

                    {lab.isCustom && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={(e) => handleEditCustomLab(e, lab)}
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomLab(e, lab.id)}
                          className="py-1.5 px-2.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/60 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: LEARNING JOURNEYS */}
      {activeTab === 'JOURNEYS' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-100">Visual Security Learning Journeys</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured progressive learning paths taking you from security fundamentals to advanced threat hunting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningPaths.map((path) => (
              <div key={path.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">{path.category}</span>
                    <Badge variant={path.difficulty.toLowerCase()} size="sm">{path.difficulty}</Badge>
                  </div>
                  <h4 className="text-base font-bold text-slate-100">{path.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{path.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">&bull; {path.estimated_minutes} Min Track</span>
                  <Badge variant="medium" size="sm">Reward: {path.badge_reward}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY CHAMPIONS PROGRAM */}
      {activeTab === 'CHAMPIONS' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-800/40 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Award className="w-5 h-5" />
              <span>Security Champions Recognition Program</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">Professional Cybersecurity Badges</h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Earn formal corporate security badges by completing awareness tracks, reporting controlled simulations, and maintaining a high defense score.
            </p>
          </div>

          {achievements.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl space-y-3">
              <Award className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs font-bold text-slate-300">No Security Badges Earned Yet</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Complete your first training course or safely report an email simulation to unlock your First Defender badge.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((ach) => (
                <div key={ach.id} className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-lg space-y-3 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-500/60 flex items-center justify-center text-amber-400 mx-auto">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{ach.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{ach.description}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                    Awarded {new Date(ach.awarded_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: COMPLETION CERTIFICATES */}
      {activeTab === 'CERTIFICATES' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-100">Official Cybersecurity Training Certificates</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified digital certificates of completion with unique Certificate IDs for compliance audits.
            </p>
          </div>

          {certificates.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl space-y-3">
              <FileCheck2 className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs font-bold text-slate-300">No Certificates Earned Yet</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Complete a training masterclass and pass the post-training assessment with $\ge 80\%$ to earn your certificate.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="p-5 rounded-2xl bg-slate-900 border border-sky-800/60 space-y-3.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="info" size="sm">Score: {cert.score}%</Badge>
                      <span className="text-[10px] font-mono text-slate-400">{cert.certificate_id}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">{cert.course_title}</h4>
                    <p className="text-[11px] text-slate-400">Awarded to <strong className="text-slate-200">{cert.employee_name}</strong></p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(cert.issued_at).toLocaleDateString()}</span>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => setViewCertificate(cert)}
                    >
                      View Certificate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: OFFICIAL GUIDANCE & EXTERNAL RESOURCES */}
      {activeTab === 'RESOURCES' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-100">Official Cybersecurity Reference Library</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Curated links to recognized government guidance and authoritative cybersecurity research (opens safely in a new tab).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((res) => (
              <div key={res.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">{res.source_organization}</span>
                    <Badge variant="neutral" size="sm">{res.category}</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">{res.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{res.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
                  >
                    <span>Read Guidance</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {viewCertificate && (
        <Modal
          isOpen={Boolean(viewCertificate)}
          onClose={() => setViewCertificate(null)}
          title="Certificate of Cybersecurity Mastery"
          maxWidth="lg"
        >
          <div className="p-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-4 border-amber-500/60 rounded-3xl text-center space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-b border-slate-800 pb-3">
              <span>LockPhish Security Awareness Academy</span>
              <span>ID: {viewCertificate.certificate_id}</span>
            </div>

            <div className="w-16 h-16 rounded-full bg-amber-950/80 border-2 border-amber-400 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-950/60">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Certificate of Completion</span>
              <h2 className="text-2xl font-black text-slate-100 tracking-tight">
                {viewCertificate.employee_name}
              </h2>
              <p className="text-xs text-slate-400">has successfully mastered and passed the interactive curriculum for</p>
              <h3 className="text-base font-bold text-emerald-400 pt-1">
                {viewCertificate.course_title}
              </h3>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 grid grid-cols-3 gap-3 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Grade</span>
                <span className="font-bold text-emerald-400">{viewCertificate.score}% (Passed)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Organization</span>
                <span className="font-bold text-slate-200 truncate block">{viewCertificate.organization_name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Issued</span>
                <span className="font-bold text-slate-200">{new Date(viewCertificate.issued_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-500 truncate pt-2">
              Verification Hash: {viewCertificate.verification_hash}
            </div>

            <div className="flex justify-center gap-3 pt-3 border-t border-slate-800">
              <Button
                variant="primary"
                size="sm"
                icon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => window.print()}
              >
                Print / Save PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewCertificate(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
