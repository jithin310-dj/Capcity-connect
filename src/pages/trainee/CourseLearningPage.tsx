import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { enrollmentService } from '../../services/enrollmentService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Course, CourseModule, Enrollment, Assessment, Certificate } from '../../types';
import { FeedbackModal } from './FeedbackModal';
import { CertificateModal } from '../../components/common/CertificateModal';
import { 
  Play, CheckCircle2, Circle, FileText, Presentation, 
  Download, ArrowLeft, ArrowRight, BookOpen, Clock, 
  Award, Star, HelpCircle, AlertCircle, MessageSquare, ShieldCheck 
} from 'lucide-react';

interface CourseLearningPageProps {
  courseId: string;
  onNavigate: (view: string, payload?: any) => void;
}

export const CourseLearningPage: React.FC<CourseLearningPageProps> = ({ courseId, onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const userId = user?._id || 'u-trainee-1';
  const userName = user?.name || 'Trainee Officer';

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    const c = storageService.getCourses().find((item) => item._id === courseId);
    setCourse(c || null);

    let enr = storageService.getEnrollments().find((e) => e.traineeId === userId && e.courseId === courseId);
    if (!enr && c && user) {
      // Auto-enroll if opened directly
      enr = enrollmentService.enroll(userId, userName, courseId);
    }
    setEnrollment(enr || null);

    const ass = storageService.getAssessments().find((a) => a.courseId === courseId);
    setAssessment(ass || null);

    const cert = storageService.getCertificates().find((cr) => cr.traineeId === userId && cr.courseId === courseId);
    setCertificate(cert || null);
  }, [courseId, userId, userName, user]);

  if (!course) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Course not found.</p>
        <button
          onClick={() => onNavigate('courses-explore')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const modules = course.modules || [];
  const currentModule: CourseModule | undefined = modules[activeModuleIndex];
  const completedModuleIds = new Set(enrollment?.completedModules || []);
  const isAllModulesCompleted = modules.length > 0 && modules.every((m) => completedModuleIds.has(m.id || m._id || ''));

  const handleMarkModuleComplete = (modId: string) => {
    if (!enrollment) return;
    const updated = enrollmentService.markModuleComplete(userId, userName, courseId, modId);
    if (updated) {
      setEnrollment({ ...updated });
      showToast('Module marked as completed! Progress updated.', 'success');
    }
  };

  const handleNextModule = () => {
    if (currentModule) {
      const modId = currentModule.id || currentModule._id || `mod-${activeModuleIndex}`;
      handleMarkModuleComplete(modId);
    }
    if (activeModuleIndex < modules.length - 1) {
      setActiveModuleIndex(activeModuleIndex + 1);
    }
  };

  const handlePrevModule = () => {
    if (activeModuleIndex > 0) {
      setActiveModuleIndex(activeModuleIndex - 1);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('courses-explore')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {course.category}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1 truncate max-w-xl">
              {course.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Feedback Trigger */}
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Rate Course</span>
          </button>

          {/* Assessment Trigger */}
          {assessment && (
            <button
              onClick={() => onNavigate('trainee-assessments', { assessmentId: assessment._id })}
              className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all ${
                isAllModulesCompleted
                  ? 'bg-purple-600 hover:bg-purple-700 text-white animate-pulse'
                  : 'bg-slate-200 text-slate-700 hover:bg-purple-600 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{isAllModulesCompleted ? 'Take Certification Exam' : 'Course Assessment'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Player on left, Curriculum Syllabus on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Module Content View */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Content Screen Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            {currentModule ? (
              <div>
                {/* Visual Player Header */}
                <div className="relative bg-slate-950 aspect-video w-full flex items-center justify-center text-white overflow-hidden group">
                  {currentModule.type === 'video' ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950">
                      <div className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center cursor-pointer shadow-lg transition-transform group-hover:scale-110">
                        <Play className="w-7 h-7 ml-1" />
                      </div>
                      <p className="text-sm font-bold text-slate-200 mt-4">{currentModule.title}</p>
                      <p className="text-xs text-slate-400 mt-1">High-Definition Lecture Video • {currentModule.durationMinutes || 30} mins</p>
                      
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-400 bg-slate-900/80 px-4 py-2 rounded-xl backdrop-blur-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Stream ready • 1080p 60fps</span>
                        </div>
                        <span className="font-mono">00:00 / {currentModule.durationMinutes || 30}:00</span>
                      </div>
                    </div>
                  ) : currentModule.type === 'presentation' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900 text-center">
                      <Presentation className="w-16 h-16 text-indigo-400 mb-3" />
                      <h3 className="text-lg font-bold text-white mb-1">{currentModule.title}</h3>
                      <p className="text-xs text-slate-400 max-w-md">Interactive Slide Deck Viewer • Click below to preview full slides</p>
                      <button
                        onClick={() => showToast('Slide presentation viewer opened in full screen view', 'info')}
                        className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
                      >
                        Open Slide Deck Viewer
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900 text-center">
                      <FileText className="w-16 h-16 text-amber-400 mb-3" />
                      <h3 className="text-lg font-bold text-white mb-1">{currentModule.title}</h3>
                      <p className="text-xs text-slate-400 max-w-md">Comprehensive Curriculum Document & Guide Notes</p>
                      <button
                        onClick={() => showToast('Document downloaded for offline study', 'success')}
                        className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Reading Material</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Module Body Content */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Module {activeModuleIndex + 1} of {modules.length}
                      </span>
                      <h2 className="text-xl font-black text-slate-900 mt-0.5">{currentModule.title}</h2>
                    </div>

                    <button
                      onClick={() => {
                        const modId = currentModule.id || currentModule._id || `mod-${activeModuleIndex}`;
                        handleMarkModuleComplete(modId);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        completedModuleIds.has(currentModule.id || currentModule._id || '')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{completedModuleIds.has(currentModule.id || currentModule._id || '') ? 'Completed' : 'Mark Complete'}</span>
                    </button>
                  </div>

                  <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
                    <p>{currentModule.textContent || currentModule.description || currentModule.content || 'This instructional module covers foundational principles, case architectures, and execution frameworks tailored for public governance excellence.'}</p>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-4">
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Key Competency Takeaways</h4>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                        <li>Mastered core architectural principles of {currentModule.title}.</li>
                        <li>Acquired actionable best practices for real-world public service execution.</li>
                        <li>Validated comprehension against institutional benchmark standards.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Previous / Next Module Bar */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
                    <button
                      onClick={handlePrevModule}
                      disabled={activeModuleIndex === 0}
                      className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous Module</span>
                    </button>

                    {activeModuleIndex < modules.length - 1 ? (
                      <button
                        onClick={handleNextModule}
                        className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-2"
                      >
                        <span>Next Module</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      assessment && (
                        <button
                          onClick={() => onNavigate('trainee-assessments', { assessmentId: assessment._id })}
                          className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs flex items-center gap-2"
                        >
                          <Award className="w-4 h-4" />
                          <span>Begin Certification Assessment</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                No active module selected.
              </div>
            )}
          </div>

          {/* Lead Trainer Info Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-4">
              <img
                src={course.trainerAvatar}
                alt={course.trainerName}
                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-xs"
              />
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Course Faculty Lead</span>
                <h4 className="font-extrabold text-slate-900 text-sm">{course.trainerName}</h4>
                <p className="text-xs text-slate-500">{course.subject} Specialist</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('trainee-messages', { targetUserId: course.trainerId })}
              className="px-4 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask Trainer a Question</span>
            </button>
          </div>

        </div>

        {/* Right Col: Course Syllabus Navigator */}
        <div className="space-y-6">
          
          {/* Progress Tracker Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">Course Completion</h3>
              <span className="text-sm font-black text-blue-600">{enrollment?.progress || 0}%</span>
            </div>

            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${enrollment?.progress || 0}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{completedModuleIds.size} of {modules.length} Completed</span>
              {isAllModulesCompleted && (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All Done
                </span>
              )}
            </div>
          </div>

          {/* Syllabus Modules List */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Course Curriculum</h3>

            <div className="space-y-2.5">
              {modules.map((mod, idx) => {
                const modId = mod.id || mod._id || `mod-${idx}`;
                const isCompleted = completedModuleIds.has(modId);
                const isActive = activeModuleIndex === idx;

                return (
                  <div
                    key={modId}
                    onClick={() => setActiveModuleIndex(idx)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : isActive ? (
                          <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                          </div>
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h5 className={`text-xs font-bold truncate ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>
                          {idx + 1}. {mod.title}
                        </h5>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="capitalize">{mod.type}</span>
                          <span>•</span>
                          <span>{mod.durationMinutes || 30} mins</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {mod.type === 'video' ? (
                        <Play className="w-3.5 h-3.5 text-slate-400" />
                      ) : mod.type === 'presentation' ? (
                        <Presentation className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Earned Certificate Card */}
          {certificate && (
            <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 rounded-3xl p-6 text-white shadow-md space-y-3">
              <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                Verified Credential Issued
              </div>
              <h4 className="font-extrabold text-white text-base">Certificate of Completion</h4>
              <p className="text-xs text-amber-100 leading-relaxed font-mono">
                Credential ID: {certificate.certificateId}
              </p>
              <button
                onClick={() => setShowCertificateModal(true)}
                className="w-full py-2.5 bg-white text-amber-950 hover:bg-amber-50 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-600" />
                <span>View & Print Certificate</span>
              </button>
            </div>
          )}

          {/* Assessment Info Card */}
          {assessment && (
            <div className="bg-gradient-to-br from-purple-900 to-indigo-950 rounded-3xl p-6 text-white shadow-md space-y-3">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4 text-purple-400" />
                Certification Gate
              </div>
              <h4 className="font-extrabold text-white text-base">{assessment.title}</h4>
              <p className="text-xs text-purple-200 leading-relaxed">
                Passing score requirement: <strong>{assessment.passingScore || assessment.passingPercentage || 70}%</strong>. Complete all curriculum modules to unlock your credential exam.
              </p>

              <button
                onClick={() => onNavigate('trainee-assessments', { assessmentId: assessment._id })}
                className="w-full py-2.5 bg-white text-purple-950 hover:bg-purple-50 font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Launch Assessment Simulator
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Course Evaluation Modal */}
      {showFeedbackModal && (
        <FeedbackModal
          courseId={course._id}
          courseTitle={course.title}
          trainerId={course.trainerId}
          trainerName={course.trainerName}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}

      {/* Certificate Modal */}
      {showCertificateModal && certificate && (
        <CertificateModal
          certificate={certificate}
          onClose={() => setShowCertificateModal(false)}
          onNavigate={onNavigate}
        />
      )}

    </div>
  );
};
