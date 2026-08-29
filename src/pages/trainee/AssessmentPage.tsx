import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { assessmentService } from '../../services/assessmentService';
import { certificateService } from '../../services/certificateService';
import { soundUtility } from '../../utils/soundUtility';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';
import { Assessment, AssessmentResult, Certificate, Course } from '../../types';
import { CertificateModal } from '../../components/common/CertificateModal';
import { 
  CheckCircle2, XCircle, Clock, AlertTriangle, Award, 
  HelpCircle, ArrowLeft, ArrowRight, Flag, RotateCcw, Check,
  Search, Filter, BookOpen, Calendar, Percent, Layers, ShieldCheck,
  ChevronRight, Sparkles, CheckCircle, ExternalLink, Play
} from 'lucide-react';

interface AssessmentPageProps {
  assessmentId?: string;
  onNavigate: (view: string, payload?: any) => void;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({ assessmentId: initialAssessmentId, onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { confirmAction } = useModal();
  const userId = user?._id || 'u-trainee-1';

  // If initialAssessmentId is given and not 'directory', select it; otherwise directory view
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(() => {
    if (initialAssessmentId && initialAssessmentId !== 'directory') {
      return initialAssessmentId;
    }
    return null;
  });

  const [allAssessments, setAllAssessments] = useState<Assessment[]>(() => storageService.getAssessments());
  const [courses, setCourses] = useState<Course[]>(() => storageService.getCourses());
  const [userResults, setUserResults] = useState<AssessmentResult[]>(() => 
    storageService.getResults().filter(r => r.traineeId === userId)
  );
  const [userCertificates, setUserCertificates] = useState<Certificate[]>(() => 
    storageService.getCertificates().filter(c => c.traineeId === userId)
  );

  // Directory filters
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Completed' | 'Upcoming' | 'Expired'>('All');

  // Exam engine state
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [generatedCert, setGeneratedCert] = useState<Certificate | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);

  // Load active assessment when selectedAssessmentId changes
  useEffect(() => {
    if (selectedAssessmentId) {
      const ass = storageService.getAssessments().find(a => a._id === selectedAssessmentId);
      if (ass) {
        setActiveAssessment(ass);
        setTimeLeft(ass.durationMinutes * 60);

        const existingResult = storageService.getResults().find(
          r => r.traineeId === userId && r.assessmentId === ass._id
        );
        if (existingResult) {
          setResult(existingResult);
          setIsSubmitted(true);
          const cert = storageService.getCertificates().find(
            c => c.traineeId === userId && c.courseId === ass.courseId
          );
          if (cert) setGeneratedCert(cert);
        } else {
          setResult(null);
          setIsSubmitted(false);
          setIsTestStarted(false);
        }
      }
    } else {
      setActiveAssessment(null);
      setIsTestStarted(false);
      setIsSubmitted(false);
      setResult(null);
    }
  }, [selectedAssessmentId, userId]);

  // Live timer
  useEffect(() => {
    if (!isTestStarted || isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestStarted, isSubmitted, timeLeft]);

  // Subjects extracted from all assessments
  const subjectsList = ['All', ...Array.from(new Set(allAssessments.map(a => a.subject || 'General')))];

  const getAssessmentStatus = (ass: Assessment): 'Completed' | 'Active' | 'Upcoming' | 'Expired' => {
    const hasResult = userResults.some(r => r.assessmentId === ass._id);
    if (hasResult) return 'Completed';

    if (ass.deadline) {
      const deadlineDate = new Date(ass.deadline);
      if (deadlineDate.getTime() < Date.now()) return 'Expired';
    }

    if (ass.status === 'draft') return 'Upcoming';
    return 'Active';
  };

  const filteredAssessments = allAssessments.filter(ass => {
    const status = getAssessmentStatus(ass);
    const matchesStatus = statusFilter === 'All' || status === statusFilter;
    const matchesSubject = subjectFilter === 'All' || (ass.subject || 'General') === subjectFilter;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesStatus && matchesSubject;

    const matchesSearch =
      ass.title.toLowerCase().includes(q) ||
      (ass.subject && ass.subject.toLowerCase().includes(q)) ||
      (ass.courseTitle && ass.courseTitle.toLowerCase().includes(q)) ||
      (ass.moduleTitle && ass.moduleTitle.toLowerCase().includes(q));

    return matchesSearch && matchesStatus && matchesSubject;
  });

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIdx]: optIdx
    });
    soundUtility.playClick();
  };

  const handleToggleFlag = (qIdx: number) => {
    setFlaggedQuestions({
      ...flaggedQuestions,
      [qIdx]: !flaggedQuestions[qIdx]
    });
  };

  const handleSubmitTest = (force = false) => {
    if (!activeAssessment || !user) return;
    const questions = activeAssessment.questions || [];
    const answeredCount = Object.keys(selectedAnswers).length;
    const unansweredCount = questions.length - answeredCount;

    const doSubmit = () => {
      const res = assessmentService.submitAssessment(
        userId,
        user.name,
        activeAssessment._id,
        selectedAnswers
      );
      setResult(res);
      setIsSubmitted(true);
      setUserResults(storageService.getResults().filter(r => r.traineeId === userId));

      if (res.passed) {
        soundUtility.playSuccess();
        showToast(`Congratulations! You passed with ${res.percentage}% score!`, 'success');
        const cert = certificateService.generateCertificate(
          userId,
          user.name,
          activeAssessment.courseId,
          activeAssessment.courseTitle,
          res.percentage,
          activeAssessment.trainerName
        );
        setGeneratedCert(cert);
        setUserCertificates(storageService.getCertificates().filter(c => c.traineeId === userId));
      } else {
        soundUtility.playError();
        showToast(`Assessment completed. Score: ${res.percentage}%. Minimum pass mark is ${activeAssessment.passingPercentage || activeAssessment.passingScore}%.`, 'warning');
      }
    };

    if (force) {
      doSubmit();
    } else {
      confirmAction({
        title: 'Submit MCQ Assessment?',
        message: unansweredCount > 0
          ? `You have ${unansweredCount} unanswered questions remaining. Confirm submission for automated competency grading?`
          : 'Are you ready to submit your assessment and compute your verified competency score?',
        confirmText: 'Submit Final Answers',
        onConfirm: doSubmit
      });
    }
  };

  const handleRetake = () => {
    if (!activeAssessment) return;
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setCurrentQuestionIdx(0);
    setTimeLeft(activeAssessment.durationMinutes * 60);
    setIsSubmitted(false);
    setIsTestStarted(true);
    soundUtility.playClick();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ----------------------------------------------------
  // VIEW 1: SUBJECT-WISE MCQ ASSESSMENTS DIRECTORY
  // ----------------------------------------------------
  if (!selectedAssessmentId || !activeAssessment) {
    return (
      <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Standardized Competency Testing
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Subject-Wise MCQ Assessments
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Take timed multiple-choice assessments across government and technical disciplines to evaluate your competencies and unlock verifiable certificates.
            </p>
          </div>
        </div>

        {/* Stats Overview Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
            <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">AVAILABLE EXAMS</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">{allAssessments.length}</div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Subject-wise evaluations</div>
          </div>

          <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
            <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">COMPLETED EXAMS</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{userResults.length}</div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Passed / Attempted tests</div>
          </div>

          <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
            <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">AVG COMPETENCY SCORE</div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono">
              {userResults.length > 0 
                ? `${Math.round(userResults.reduce((acc, r) => acc + r.percentage, 0) / userResults.length)}%` 
                : 'N/A'}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Across all completed suites</div>
          </div>

          <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
            <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">EARNED CERTIFICATES</div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">{userCertificates.length}</div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Official credentials unlocked</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assessment name, subject domain, or associated course..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Subject Filter */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              {subjectsList.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active / Available</option>
              <option value="Completed">Completed</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Assessments Grid */}
        {filteredAssessments.length === 0 ? (
          <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-2xs">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Assessments Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No MCQ tests match your current subject or status filters.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSubjectFilter('All'); setStatusFilter('All'); }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold hover:bg-slate-200 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredAssessments.map((ass) => {
              const status = getAssessmentStatus(ass);
              const pastResult = userResults.find(r => r.assessmentId === ass._id);
              const questionsCount = ass.questions?.length || 10;
              const totalMarks = ass.totalMarks || (ass.questions ? ass.questions.reduce((acc, q) => acc + (q.marks || 1), 0) : 20);
              const passThreshold = ass.passingPercentage || ass.passingScore || 70;
              const deadlineDate = ass.deadline ? new Date(ass.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Open';

              return (
                <div
                  key={ass._id}
                  className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Subject & Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono uppercase font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 px-2.5 py-0.5 rounded-full">
                        {ass.subject || 'General Domain'}
                      </span>

                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                        status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : status === 'Active'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                          : status === 'Expired'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                          : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30'
                      }`}>
                        {status}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {ass.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3 line-clamp-2">
                      {ass.description || 'Comprehensive multiple-choice competency assessment.'}
                    </p>

                    {/* Course Link Box */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 mb-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-semibold truncate">
                        <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{ass.courseTitle}</span>
                      </div>
                      {ass.moduleTitle && (
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                          <Layers className="w-3 h-3 text-purple-500 shrink-0" />
                          <span className="truncate">{ass.moduleTitle}</span>
                        </div>
                      )}
                    </div>

                    {/* Parameter Grid */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-400 mb-4 bg-slate-50/50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                      <div className="flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span><strong>{questionsCount}</strong> MCQs</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span><strong>{totalMarks}</strong> Total Marks</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span><strong>{ass.durationMinutes}</strong> Mins Limit</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Percent className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Pass: <strong>{passThreshold}%</strong></span>
                      </div>
                      <div className="col-span-2 flex items-center gap-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-purple-500" />
                        <span>Deadline: <strong>{deadlineDate}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    {pastResult ? (
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] font-mono font-bold ${pastResult.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          Scored: {pastResult.percentage}% ({pastResult.passed ? 'PASSED' : 'FAILED'})
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        Not Yet Attempted
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      {pastResult ? (
                        <button
                          onClick={() => setSelectedAssessmentId(ass._id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          VIEW REVIEW
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedAssessmentId(ass._id);
                            soundUtility.playClick();
                          }}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>TAKE EXAM</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 2: INSTRUCTIONS BEFORE STARTING TEST
  // ----------------------------------------------------
  const questions = activeAssessment.questions || [];
  const currentQ = questions[currentQuestionIdx];
  const totalAssessmentMarks = activeAssessment.totalMarks || questions.reduce((acc, q) => acc + (q.marks || 1), 0);
  const passPercent = activeAssessment.passingPercentage || activeAssessment.passingScore || 70;

  if (!isTestStarted && !isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => setSelectedAssessmentId(null)}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO SUBJECT ASSESSMENTS DIRECTORY</span>
        </button>

        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm transition-colors">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center mx-auto mb-3 shadow-2xs">
              <Award className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
              {activeAssessment.subject || 'Standard Assessment'}
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{activeAssessment.title}</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Course: {activeAssessment.courseTitle}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 bg-slate-50 dark:bg-[#0B0F19] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 text-center text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-500 block mb-1 font-mono">Total Questions</span>
              <strong className="text-base text-slate-900 dark:text-white font-mono">{questions.length} MCQs</strong>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block mb-1 font-mono">Time Limit</span>
              <strong className="text-base text-slate-900 dark:text-white font-mono">{activeAssessment.durationMinutes} Minutes</strong>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block mb-1 font-mono">Passing Threshold</span>
              <strong className="text-base text-emerald-700 dark:text-emerald-400 font-mono">{passPercent}% Score</strong>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 mb-8 border-t border-b border-slate-100 dark:border-slate-800 py-4">
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">Examination Instructions & Guidelines:</h4>
            <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
              <li>Each question has exactly one correct answer. Points are awarded based on calibrated mark weights.</li>
              <li>A live countdown timer will initiate once you click <strong>Begin Assessment</strong>. The test auto-submits when the timer reaches 00:00.</li>
              <li>Use the Question Palette to jump between questions or flag items for later review.</li>
              <li>Scoring <strong>{passPercent}% or above</strong> automatically issues your verifiable digital capacity certificate.</li>
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedAssessmentId(null)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel & Return
            </button>
            <button
              onClick={() => {
                setIsTestStarted(true);
                soundUtility.playClick();
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors cursor-pointer"
            >
              BEGIN ASSESSMENT NOW
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 3: RESULTS SCREEN & REVIEW BREAKDOWN
  // ----------------------------------------------------
  if (isSubmitted && result) {
    const isPassed = result.passed;

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Back Nav */}
        <button
          onClick={() => setSelectedAssessmentId(null)}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO SUBJECT ASSESSMENTS DIRECTORY</span>
        </button>

        {/* Results Banner */}
        <div
          className={`rounded-3xl p-6 sm:p-8 border shadow-sm text-center ${
            isPassed
              ? 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
              : 'bg-rose-50/90 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-100'
          }`}
        >
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md ${
              isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {isPassed ? <CheckCircle2 className="w-9 h-9" /> : <XCircle className="w-9 h-9" />}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider mb-2 bg-white/60 dark:bg-slate-900/60">
            {isPassed ? 'COMPETENCY ASSESSMENT PASSED' : 'MINIMUM PASS THRESHOLD NOT REACHED'}
          </div>

          <h2 className="text-2xl sm:text-4xl font-black font-mono">{result.percentage}% Final Score</h2>
          <p className="text-xs sm:text-sm mt-1 opacity-80">
            You scored {result.score} out of {result.totalMarks} total marks ({result.totalQuestions || questions.length} questions evaluated). Minimum pass score: {passPercent}%.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {isPassed && generatedCert && (
              <button
                onClick={() => setShowCertModal(true)}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>VIEW & PRINT OFFICIAL CERTIFICATE</span>
              </button>
            )}

            <button
              onClick={handleRetake}
              className="px-4 py-3 bg-white dark:bg-[#151B28] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RETAKE ASSESSMENT</span>
            </button>

            <button
              onClick={() => setSelectedAssessmentId(null)}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-mono font-bold text-xs rounded-xl cursor-pointer"
            >
              ALL ASSESSMENTS
            </button>
          </div>
        </div>

        {/* Detailed Question Review Breakdown */}
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Answer Key & Explanations Review</span>
          </h3>

          <div className="space-y-6">
            {questions.map((q, idx) => {
              const selectedIdx = result.answers?.[idx] !== undefined ? result.answers[idx] : -1;
              const isCorrect = selectedIdx === q.correctAnswer;

              return (
                <div
                  key={idx}
                  className={`p-4 sm:p-5 rounded-2xl border ${
                    isCorrect 
                      ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/20' 
                      : 'border-rose-200 dark:border-rose-800/60 bg-rose-50/20 dark:bg-rose-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Question {idx + 1}: {q.question}
                    </h4>
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        isCorrect 
                          ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300' 
                          : 'bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {isCorrect ? `+${q.marks || 2} Marks` : '0 Marks'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs mb-3">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedIdx === optIdx;
                      const isActualCorrect = q.correctAnswer === optIdx;

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between ${
                            isActualCorrect
                              ? 'bg-emerald-100/70 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 font-bold'
                              : isSelected
                              ? 'bg-rose-100/70 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-200 font-medium'
                              : 'bg-white dark:bg-[#0B0F19] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="font-bold font-mono">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            {opt}
                          </span>
                          {isActualCorrect && (
                            <span className="text-[10px] uppercase font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Correct Key
                            </span>
                          )}
                          {isSelected && !isActualCorrect && (
                            <span className="text-[10px] uppercase font-mono font-bold text-rose-700 dark:text-rose-400">
                              Your Selection
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="bg-slate-100/80 dark:bg-[#0B0F19] p-3 rounded-xl text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                      <strong className="text-slate-800 dark:text-slate-200 font-semibold">Technical Justification: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Modal Trigger */}
        {showCertModal && generatedCert && (
          <CertificateModal
            certificate={generatedCert}
            onClose={() => setShowCertModal(false)}
            onNavigate={onNavigate}
          />
        )}

      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 4: ACTIVE TIMED MCQ TEST INTERFACE
  // ----------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Test Live Timer & Header */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            Live Timed Examination
          </span>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">{activeAssessment.title}</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Timer Pill */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono font-bold text-sm border shadow-2xs ${
              timeLeft < 180
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 animate-pulse'
                : 'bg-slate-900 dark:bg-[#0B0F19] border-slate-800 text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => handleSubmitTest()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            FINISH & SUBMIT
          </button>
        </div>
      </div>

      {/* Main Question & Navigation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Question Pane (3 cols) */}
        <div className="lg:col-span-3 bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors">
          
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Question {currentQuestionIdx + 1} of {questions.length} • ({currentQ?.marks || 2} Marks)
            </span>

            <button
              onClick={() => handleToggleFlag(currentQuestionIdx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                flaggedQuestions[currentQuestionIdx]
                  ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{flaggedQuestions[currentQuestionIdx] ? 'Flagged' : 'Flag for Review'}</span>
            </button>
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-6 leading-relaxed">
            {currentQ?.question}
          </h3>

          {/* MCQ Options */}
          <div className="space-y-3 mb-8">
            {(currentQ?.options || []).map((optionText, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;

              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 shadow-2xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#0B0F19]'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs font-mono shrink-0 transition-colors ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className={`text-xs sm:text-sm ${isSelected ? 'font-bold text-blue-950 dark:text-blue-200' : 'text-slate-700 dark:text-slate-300'}`}>
                    {optionText}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>PREVIOUS</span>
            </button>

            {currentQuestionIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>NEXT QUESTION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => handleSubmitTest()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>SUBMIT EXAM</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Question Palette Sidebar (1 col) */}
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4 transition-colors">
          <h4 className="font-bold text-slate-900 dark:text-white text-xs font-mono uppercase tracking-wider">Question Matrix</h4>
          
          <div className="grid grid-cols-4 gap-2">
            {questions.map((_, idx) => {
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isFlagged = flaggedQuestions[idx];
              const isCurrent = idx === currentQuestionIdx;

              let btnClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700';
              if (isCurrent) btnClass = 'ring-2 ring-blue-600 font-bold';
              if (isAnswered) btnClass += ' bg-blue-600 text-white border-blue-600 dark:bg-blue-600 dark:text-white';
              if (isFlagged) btnClass += ' bg-amber-500 text-white border-amber-500 dark:bg-amber-500 dark:text-white';

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`h-9 rounded-xl border text-xs font-mono font-semibold flex items-center justify-center transition-all cursor-pointer ${btnClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-blue-600" />
              <span>Answered ({Object.keys(selectedAnswers).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-amber-500" />
              <span>Flagged ({Object.keys(flaggedQuestions).filter((k) => flaggedQuestions[Number(k)]).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
              <span>Unanswered ({questions.length - Object.keys(selectedAnswers).length})</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
