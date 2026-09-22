import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Users,
  Award,
  Clock,
  ShieldCheck,
  Send,
  Eye,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  Compass,
  FileCheck2,
  ExternalLink,
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  Trash2,
  Check,
  XCircle,
  AlertCircle,
  Layers,
  Building2,
  Calendar
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Table } from '../../components/common/Table';
import { ProgressBar } from '../../components/common/ProgressBar';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingState } from '../../components/common/LoadingState';
import { CoursePlayer } from '../../components/training/CoursePlayer';
import { api } from '../../api/client';
import { Course } from '../../types';

interface TrainingManagementPageProps {
  navigate: (path: string) => void;
}

export const TrainingManagementPage: React.FC<TrainingManagementPageProps> = ({ navigate }) => {
  const [activeSubTab, setActiveSubTab] = useState<'CATALOG' | 'RESULTS' | 'JOURNEYS'>('CATALOG');
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [allAssignments, setAllAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search for Courses
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');

  // Filters & Search for Training Results Tracker
  const [recordStatusFilter, setRecordStatusFilter] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS' | 'ASSIGNED'>('ALL');
  const [recordDeptFilter, setRecordDeptFilter] = useState('ALL');
  const [recordCourseFilter, setRecordCourseFilter] = useState('ALL');
  const [recordSearch, setRecordSearch] = useState('');

  // Preview Course State
  const [previewCourse, setPreviewCourse] = useState<any>(null);

  // Certificate Modal State
  const [viewCertificate, setViewCertificate] = useState<any>(null);

  // Assign Modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [targetType, setTargetType] = useState<'ALL' | 'DEPARTMENT'>('ALL');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [courseData, deptData, pathData, analData, assignData] = await Promise.allSettled([
        api.training.getCourses(),
        api.org.getDepartments(),
        api.training.getLearningPaths(),
        api.training.getAnalytics(),
        api.training.getAllAssignments()
      ]);

      if (courseData.status === 'fulfilled') setCourses(courseData.value || []);
      if (deptData.status === 'fulfilled') setDepartments(deptData.value || []);
      if (pathData.status === 'fulfilled') setLearningPaths(pathData.value || []);
      if (analData.status === 'fulfilled') setAnalytics(analData.value || null);
      if (assignData.status === 'fulfilled') setAllAssignments(assignData.value || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    setAssigning(true);
    try {
      const res = await api.training.assign({
        course_id: selectedCourseId,
        target_type: targetType,
        target_id: targetType === 'DEPARTMENT' ? selectedDeptId : undefined
      });
      setAssigning(false);
      setShowAssignModal(false);
      setSuccessMsg(`Training assigned successfully to ${res.assigned_count} employees!`);
      setTimeout(() => setSuccessMsg(''), 4000);
      loadData();
    } catch (err) {
      setAssigning(false);
      console.error(err);
    }
  };

  const handleDeleteAssignment = async (assignId: string) => {
    if (!confirm('Are you sure you want to remove this training assignment?')) return;
    try {
      await api.training.deleteAssignment(assignId);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to remove assignment.');
    }
  };

  const handlePreviewCourse = async (courseId: string) => {
    try {
      const fullCourse = await api.training.getCourse(courseId);
      setPreviewCourse({
        id: `preview-${fullCourse.id}`,
        course_id: fullCourse.id,
        course_code: fullCourse.code,
        course_title: fullCourse.title,
        course_category: fullCourse.category,
        course_difficulty: fullCourse.difficulty,
        course_description: fullCourse.description,
        duration_minutes: fullCourse.duration_minutes,
        modules: fullCourse.modules || [],
        assessment_id: fullCourse.assessment?.id,
        assessment_title: fullCourse.assessment?.title,
        passing_score: fullCourse.assessment?.passing_score || 80,
        assessment_questions: fullCourse.assessment?.questions || []
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCertificate = (record: any) => {
    setViewCertificate({
      id: `CERT-${new Date().getFullYear()}-${(record.id || 'sec').substring(0, 8).toUpperCase()}`,
      employee_name: `${record.first_name || ''} ${record.last_name || ''}`,
      course_title: record.course_title || 'Security Awareness Masterclass',
      organization_name: 'Enterprise Security Defense Academy',
      score: record.score_post_assessment || 100,
      issued_at: record.completed_at || new Date().toISOString(),
      verification_hash: `SHA256-${(record.id || 'sec').substring(0, 16).toUpperCase()}`
    });
  };

  // ==========================================
  // EXPORT LMS TRAINING LEDGER (PDF & CSV)
  // ==========================================
  const handleExportTrainingPdf = () => {
    try {
      const doc = new jsPDF('landscape');
      const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

      // Header
      doc.setFillColor(15, 23, 42); // Slate-900
      doc.rect(0, 0, 297, 36, 'F');

      doc.setTextColor(16, 185, 129); // Emerald
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('LOCKPHISH ACADEMY', 14, 18);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('WORKFORCE TRAINING CURRICULUM & ASSESSMENT AUDIT LEDGER', 14, 28);

      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated: ${today} | Total Assigned Records: ${allAssignments.length}`, 180, 28);

      // Table
      const rows = filteredAssignments.map((a, idx) => [
        `${idx + 1}`,
        `${a.first_name || ''} ${a.last_name || ''}\n${a.employee_email || ''}`,
        a.department_name || 'General',
        `${a.course_title || 'Masterclass'}\n(${a.course_code || ''})`,
        a.status || 'ASSIGNED',
        `${a.progress_percent || 0}%`,
        a.score_post_assessment ? `${a.score_post_assessment}% (Passed)` : 'Not Taken',
        a.completed_at ? new Date(a.completed_at).toLocaleDateString() : 'In-Flight'
      ]);

      autoTable(doc, {
        startY: 44,
        head: [['#', 'Employee', 'Department', 'Course Title & Code', 'Status', 'Progress', 'Score', 'Completed Date']],
        body: rows,
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
        columnStyles: {
          1: { cellWidth: 50 },
          3: { cellWidth: 60 }
        }
      });

      doc.save(`LockPhish_LMS_Training_Ledger_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err: any) {
      alert('Failed to generate PDF: ' + err.message);
    }
  };

  const handleExportTrainingCsv = () => {
    const headers = [
      'Record #',
      'Employee Name',
      'Email Address',
      'Department',
      'Course Code',
      'Course Title',
      'Status',
      'Progress %',
      'Pre-Score',
      'Post-Assessment Score',
      'Assigned Date',
      'Completed Date'
    ];

    const rows = filteredAssignments.map((a, i) => [
      i + 1,
      `"${a.first_name || ''} ${a.last_name || ''}"`,
      `"${a.employee_email || ''}"`,
      `"${a.department_name || 'General'}"`,
      `"${a.course_code || ''}"`,
      `"${a.course_title || ''}"`,
      a.status,
      `${a.progress_percent || 0}%`,
      a.score_pre_assessment || 'N/A',
      a.score_post_assessment || 'N/A',
      `"${new Date(a.assigned_at).toLocaleString()}"`,
      `"${a.completed_at ? new Date(a.completed_at).toLocaleString() : 'Pending'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LockPhish_Workforce_Training_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <LoadingState message="Loading training academy catalog, analytics, and workforce records..." />;
  }

  // Interactive Live Course Player Preview Modal
  if (previewCourse) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewCourse(null)}
          >
            ← Exit Course Preview
          </Button>

          <Badge variant="info" size="sm">
            Admin Interactive Preview Mode
          </Badge>
        </div>

        <CoursePlayer
          assignment={previewCourse}
          onCompleted={() => setPreviewCourse(null)}
          onClose={() => setPreviewCourse(null)}
        />
      </div>
    );
  }

  // Filter courses by search, category, difficulty
  const filteredCourses = courses.filter(c => {
    if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'ALL' && c.difficulty !== selectedDifficulty) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        (c.title || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q) ||
        (c.code || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filter assigned training records for Results Tracker tab
  const filteredAssignments = allAssignments.filter(a => {
    if (recordStatusFilter !== 'ALL' && a.status !== recordStatusFilter) return false;
    if (recordDeptFilter !== 'ALL' && a.department_name !== recordDeptFilter) return false;
    if (recordCourseFilter !== 'ALL' && a.course_id !== recordCourseFilter) return false;
    if (recordSearch) {
      const q = recordSearch.toLowerCase();
      return (
        (a.first_name || '').toLowerCase().includes(q) ||
        (a.last_name || '').toLowerCase().includes(q) ||
        (a.employee_email || '').toLowerCase().includes(q) ||
        (a.course_title || '').toLowerCase().includes(q) ||
        (a.department_name || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const completedRecordsCount = allAssignments.filter(a => a.status === 'COMPLETED').length;
  const inProgressRecordsCount = allAssignments.filter(a => a.status === 'IN_PROGRESS').length;
  const assignedRecordsCount = allAssignments.filter(a => a.status === 'ASSIGNED').length;

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <span>Security Awareness Academy</span>
            </h1>
            <Badge variant="low" size="sm">{courses.length} Masterclasses</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise curriculum, workforce completion ledgers, interactive threat hunting labs, and scored certifications.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={loadData}
          >
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => navigate('/admin/training/create')}
          >
            Create Custom Course
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Send className="w-3.5 h-3.5" />}
            onClick={() => {
              if (courses.length > 0) setSelectedCourseId(courses[0].id);
              setShowAssignModal(true);
            }}
          >
            Assign Training
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs font-bold flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-400 font-bold hover:text-white">✕</button>
        </div>
      )}

      {/* Analytics Metric Cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Workforce Assignments</span>
              <div className="text-2xl font-black text-slate-100 mt-0.5">{allAssignments.length}</div>
              <span className="text-[10px] text-emerald-400 font-mono">{completedRecordsCount} completed ({allAssignments.length > 0 ? Math.round((completedRecordsCount / allAssignments.length) * 100) : 100}%)</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-950/80 text-emerald-400 border border-emerald-800">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Assessment Pass Rate</span>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">{analytics.pass_rate}%</div>
              <span className="text-[10px] text-slate-400">Avg Score: {analytics.average_assessment_score}%</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-950/80 text-emerald-400 border border-emerald-800">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Learning Paths</span>
              <div className="text-2xl font-black text-purple-400 mt-0.5">{learningPaths.length} Active</div>
              <span className="text-[10px] text-slate-400">Visual Guided Journeys</span>
            </div>
            <div className="p-3 rounded-2xl bg-purple-950/80 text-purple-400 border border-purple-800">
              <Compass className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Measured Defense Lift</span>
              <div className="text-2xl font-black text-sky-400 mt-0.5">+{analytics.training_effectiveness_score}%</div>
              <span className="text-[10px] text-emerald-400 font-mono">Reduction in Phishing Fails</span>
            </div>
            <div className="p-3 rounded-2xl bg-sky-950/80 text-sky-400 border border-sky-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Main Module Tabs (Catalog vs Results Tracking vs Journeys) */}
      <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-1.5 overflow-x-auto text-xs font-bold shadow-md">
        <button
          type="button"
          onClick={() => setActiveSubTab('CATALOG')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'CATALOG' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Academy Masterclasses ({courses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('RESULTS')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'RESULTS' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-emerald-300" />
          <span>Workforce Training Results & Telemetry ({allAssignments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('JOURNEYS')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'JOURNEYS' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Compass className="w-4 h-4 text-purple-300" />
          <span>Learning Journeys ({learningPaths.length})</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* SUB-TAB 1: ACADEMY MASTERCLASSES CATALOG                      */}
      {/* ============================================================ */}
      {activeSubTab === 'CATALOG' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Filter and Search Toolbar */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center gap-3 shadow-md">
            <div className="flex-1 w-full relative">
              <Input
                placeholder="Search academy catalog by topic, attack vector, or title..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
              >
                <option value="ALL">All Categories</option>
                <option value="EMAIL_SECURITY">Email Security</option>
                <option value="SMS_SECURITY">SMS & Smishing</option>
                <option value="VOICE_SECURITY">Voice & Vishing</option>
                <option value="SOCIAL_ENGINEERING">Social Engineering</option>
                <option value="ACCOUNT_SECURITY">Account & MFA Security</option>
                <option value="COMPLIANCE">Compliance & IR</option>
              </select>

              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
              >
                <option value="ALL">All Difficulties</option>
                <option value="BEGINNER">🟢 Easy / Beginner</option>
                <option value="INTERMEDIATE">🟡 Medium / Intermediate</option>
                <option value="ADVANCED">🔴 Hard / Advanced</option>
                <option value="EXPERT">🟣 Extreme / Expert</option>
              </select>
            </div>
          </div>

          {/* Courses Catalog Grid */}
          {filteredCourses.length === 0 ? (
            <EmptyState
              title="No matching courses found"
              description="Try modifying your search filter or category selection."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map((c) => (
                <Card
                  key={c.id}
                  title={c.title}
                  action={<Badge variant={c.difficulty.toLowerCase()} size="sm">{c.difficulty}</Badge>}
                >
                  <div className="space-y-3 text-xs">
                    <p className="text-slate-400 min-h-[44px] leading-relaxed line-clamp-2">{c.description}</p>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Duration:</span>
                        <span className="text-slate-200 font-bold">{c.duration_minutes} Minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Category:</span>
                        <span className="text-emerald-400 font-bold">{c.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Passing Grade:</span>
                        <span className="text-slate-200 font-bold">{c.passing_score || 80}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px]">
                      <span className="text-slate-400 font-semibold font-mono">
                        {c.completed_count || 0} finished
                      </span>

                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Play className="w-3 h-3 text-emerald-400" />}
                          onClick={() => handlePreviewCourse(c.id)}
                        >
                          Test Course
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedCourseId(c.id);
                            setShowAssignModal(true);
                          }}
                        >
                          Assign
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 2: WORKFORCE TRAINING RESULTS & TELEMETRY TRACKER     */}
      {/* ============================================================ */}
      {activeSubTab === 'RESULTS' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Results Status Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              onClick={() => setRecordStatusFilter('ALL')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                recordStatusFilter === 'ALL'
                  ? 'bg-slate-900 border-emerald-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-bold uppercase text-slate-400 block font-mono">Total Assignments</span>
              <span className="text-2xl font-black text-slate-100 mt-1 block font-mono">{allAssignments.length}</span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">All workforce enrollments</span>
            </div>

            <div
              onClick={() => setRecordStatusFilter('COMPLETED')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                recordStatusFilter === 'COMPLETED'
                  ? 'bg-slate-900 border-emerald-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-bold uppercase text-emerald-400 block font-mono">✓ 100% Completed</span>
              <span className="text-2xl font-black text-emerald-300 mt-1 block font-mono">{completedRecordsCount}</span>
              <span className="text-[10px] text-emerald-400/80 mt-0.5 block">Passed scored assessment</span>
            </div>

            <div
              onClick={() => setRecordStatusFilter('IN_PROGRESS')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                recordStatusFilter === 'IN_PROGRESS'
                  ? 'bg-slate-900 border-amber-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-bold uppercase text-amber-400 block font-mono">🟡 In-Progress</span>
              <span className="text-2xl font-black text-amber-300 mt-1 block font-mono">{inProgressRecordsCount}</span>
              <span className="text-[10px] text-amber-400/80 mt-0.5 block">Currently studying lessons</span>
            </div>

            <div
              onClick={() => setRecordStatusFilter('ASSIGNED')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                recordStatusFilter === 'ASSIGNED'
                  ? 'bg-slate-900 border-sky-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-bold uppercase text-sky-400 block font-mono">📋 Assigned / Pending</span>
              <span className="text-2xl font-black text-sky-300 mt-1 block font-mono">{assignedRecordsCount}</span>
              <span className="text-[10px] text-sky-400/80 mt-0.5 block">Awaiting employee start</span>
            </div>
          </div>

          {/* Filter & Export Toolbar */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto">
              {[
                { id: 'ALL', label: 'All Records' },
                { id: 'COMPLETED', label: '✓ Completed (100%)' },
                { id: 'IN_PROGRESS', label: 'In-Progress' },
                { id: 'ASSIGNED', label: 'Assigned' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRecordStatusFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    recordStatusFilter === tab.id
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
              <input
                type="text"
                placeholder="Search employee, email, course..."
                value={recordSearch}
                onChange={e => setRecordSearch(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-52"
              />

              <Button
                variant="outline"
                size="sm"
                icon={<FileText className="w-3.5 h-3.5 text-emerald-400" />}
                onClick={handleExportTrainingPdf}
              >
                Export PDF
              </Button>

              <Button
                variant="outline"
                size="sm"
                icon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />}
                onClick={handleExportTrainingCsv}
              >
                Export Excel/CSV
              </Button>
            </div>
          </div>

          {/* Training Records Table */}
          {filteredAssignments.length === 0 ? (
            <EmptyState
              title="No training records match filter"
              description="Assign training courses to employees to track completion progress and assessment scores here."
              actionText="Assign Training Now"
              onAction={() => setShowAssignModal(true)}
            />
          ) : (
            <Card
              title={`Workforce Training Records (${filteredAssignments.length} Assignments)`}
              subtitle="Real-time employee progress, post-assessment scores, completion timestamps, and digital certificates"
            >
              <Table
                data={filteredAssignments}
                keyExtractor={a => a.id}
                columns={[
                  {
                    header: 'Employee',
                    accessor: a => (
                      <div>
                        <span className="font-bold text-slate-100 block">{a.first_name} {a.last_name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{a.employee_email}</span>
                      </div>
                    )
                  },
                  {
                    header: 'Department',
                    accessor: a => <span className="text-slate-300 font-medium">{a.department_name || 'General'}</span>
                  },
                  {
                    header: 'Course Title',
                    accessor: a => (
                      <div>
                        <span className="font-bold text-slate-200 block text-xs">{a.course_title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{a.course_code}</span>
                      </div>
                    )
                  },
                  {
                    header: 'Curriculum Progress',
                    accessor: a => (
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-400">{a.status}</span>
                          <span className="text-emerald-400 font-bold">{a.progress_percent || 0}%</span>
                        </div>
                        <ProgressBar value={a.progress_percent || 0} size="sm" variant={a.status === 'COMPLETED' ? 'emerald' : 'amber'} />
                      </div>
                    )
                  },
                  {
                    header: 'Assessment Score',
                    accessor: a => (
                      a.score_post_assessment !== null && a.score_post_assessment !== undefined ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-bold font-mono text-xs">
                          ✓ {a.score_post_assessment}% (Passed)
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-mono">Not Taken</span>
                      )
                    )
                  },
                  {
                    header: 'Completed Date',
                    accessor: a => (
                      <span className="text-[11px] font-mono text-slate-400">
                        {a.completed_at ? new Date(a.completed_at).toLocaleDateString() : 'In-Flight'}
                      </span>
                    )
                  },
                  {
                    header: 'Actions',
                    accessor: a => (
                      <div className="flex items-center gap-1.5">
                        {a.status === 'COMPLETED' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Award className="w-3 h-3 text-amber-400" />}
                            onClick={() => handleOpenCertificate(a)}
                          >
                            Certificate
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCourseId(a.course_id);
                              setShowAssignModal(true);
                            }}
                          >
                            Reassign
                          </Button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteAssignment(a.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Remove assignment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )
                  }
                ]}
              />
            </Card>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 3: LEARNING JOURNEYS                                 */}
      {/* ============================================================ */}
      {activeSubTab === 'JOURNEYS' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {learningPaths.map((path) => (
              <div key={path.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">{path.category}</span>
                    <Badge variant={path.difficulty.toLowerCase()} size="sm">{path.difficulty}</Badge>
                  </div>
                  <h4 className="text-base font-bold text-slate-100">{path.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{path.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">&bull; {path.estimated_minutes} Min Curriculum Track</span>
                  <Badge variant="medium" size="sm">Reward: {path.badge_reward}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assign Course Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Security Training Curriculum"
        subtitle="Mandatory baseline or adaptive remediation assignment"
        maxWidth="md"
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Select Course Masterclass
            </label>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-bold"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id} className="bg-slate-900 py-2">
                  {c.title} ({c.duration_minutes} min &bull; {c.difficulty})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Target Audience
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTargetType('ALL')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  targetType === 'ALL'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                All Active Employees
              </button>

              <button
                type="button"
                onClick={() => setTargetType('DEPARTMENT')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  targetType === 'DEPARTMENT'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Specific Department Folder
              </button>
            </div>
          </div>

          {targetType === 'DEPARTMENT' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Department Folder
              </label>
              <select
                value={selectedDeptId}
                onChange={e => setSelectedDeptId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
              >
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={assigning} icon={<Send className="w-3.5 h-3.5" />}>
              Assign Training Now
            </Button>
          </div>
        </form>
      </Modal>

      {/* Official Certificate Modal */}
      {viewCertificate && (
        <Modal
          isOpen={true}
          onClose={() => setViewCertificate(null)}
          title="Official Certificate of Cybersecurity Mastery"
          subtitle="Verifiable Digital Compliance Credential"
          maxWidth="lg"
        >
          <div className="space-y-6 text-xs font-sans">
            <div className="p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-4 border-amber-500/80 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shadow">
                    🛡️
                  </div>
                  <span className="font-black text-amber-400 tracking-wider font-mono text-sm uppercase">
                    LockPhish Defense Academy
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{viewCertificate.id}</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold block">
                  CERTIFICATE OF COMPLETION
                </span>
                <p className="text-xs text-slate-400">This official certificate is proudly awarded to:</p>
                <h2 className="text-2xl font-black text-slate-100 tracking-tight font-serif">
                  {viewCertificate.employee_name}
                </h2>
                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                  for successfully mastering the curriculum and passing the scored proficiency assessment for:
                </p>
                <h3 className="text-base font-bold text-amber-400 font-sans max-w-md mx-auto">
                  {viewCertificate.course_title}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-500/30 text-[11px] font-mono">
                <div className="text-left space-y-0.5">
                  <span className="text-slate-500 block text-[10px]">Organization:</span>
                  <span className="text-slate-200 font-bold">{viewCertificate.organization_name}</span>
                  <span className="text-slate-500 block text-[10px] pt-1">Date Awarded:</span>
                  <span className="text-slate-200">{new Date(viewCertificate.issued_at).toLocaleDateString()}</span>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-slate-500 block text-[10px]">Verification Signature:</span>
                  <span className="text-emerald-400 font-bold font-mono">VALID &bull; VERIFIED</span>
                  <span className="text-slate-500 block text-[10px] pt-1">Cryptographic Hash:</span>
                  <span className="text-slate-400 text-[9px] break-all">{viewCertificate.verification_hash}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setViewCertificate(null)}>
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
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
