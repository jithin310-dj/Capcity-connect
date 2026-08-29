import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';
import { storageService } from '../../services/storageService';
import { UserRole } from '../../types';
import { Shield, User, GraduationCap, RotateCcw, BookOpen, Info } from 'lucide-react';

interface DemoBannerProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onNavigate }) => {
  const { user, role, switchDemoRole } = useAuth();
  const { showToast } = useToast();
  const { confirmAction } = useModal();
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (!showGuide) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowGuide(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGuide]);

  const handleReset = () => {
    confirmAction({
      title: 'Reset All Demo Data?',
      message: 'This will reset all courses, enrollments, assessments, certificates, logs, and users back to the pristine default seed dataset.',
      isDestructive: true,
      confirmText: 'Reset Demo Data',
      onConfirm: () => {
        storageService.resetAllDemoData();
        switchDemoRole('trainee');
        onNavigate('trainee-dashboard');
        showToast('All demo data has been reset to original seed state!', 'success');
      }
    });
  };

  const handleRoleSwitch = (targetRole: UserRole, targetView: string) => {
    switchDemoRole(targetRole);
    onNavigate(targetView);
  };

  return (
    <>
      <div className="bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-xs px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2.5 font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-mono text-[10px] font-bold border border-blue-200 dark:border-blue-500/30">
            <Shield className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>SIH 2026 PROTOTYPE</span>
          </span>
          <span className="hidden sm:inline text-slate-600 dark:text-slate-400 text-[11px]">
            Problem 26075: <strong className="text-slate-900 dark:text-white font-semibold">CAPACITY CONNECT</strong> (Team Byteforce)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider hidden md:inline font-bold">// ROLE:</span>
          
          <button
            onClick={() => handleRoleSwitch('trainee', 'trainee-dashboard')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 transition-all shadow-2xs ${
              role === 'trainee'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#151B28] text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
            title="Switch to Trainee Persona"
          >
            <User className="w-3 h-3" />
            <span>TRAINEE</span>
          </button>

          <button
            onClick={() => handleRoleSwitch('trainer', 'trainer-dashboard')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 transition-all shadow-2xs ${
              role === 'trainer'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#151B28] text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
            title="Switch to Trainer Persona"
          >
            <GraduationCap className="w-3 h-3" />
            <span>TRAINER</span>
          </button>

          <button
            onClick={() => handleRoleSwitch('admin', 'admin-dashboard')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 transition-all shadow-2xs ${
              role === 'admin'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#151B28] text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
            title="Switch to Admin Persona"
          >
            <Shield className="w-3 h-3" />
            <span>ADMIN</span>
          </button>

          <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-800 mx-1 hidden sm:block"></div>

          <button
            onClick={() => setShowGuide(true)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#151B28] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-mono text-[11px] font-semibold flex items-center gap-1 border border-slate-200 dark:border-slate-800 transition-all shadow-2xs"
          >
            <BookOpen className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            <span className="hidden sm:inline">GUIDE</span>
          </button>

          <button
            onClick={handleReset}
            className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 font-mono text-[11px] font-bold flex items-center gap-1 border border-rose-200 dark:border-rose-500/30 transition-all shadow-2xs"
            title="Reset All LocalStorage Data to Pristine State"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </div>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#151B28] text-slate-700 dark:text-slate-300 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">SIH 2026 End-to-End Evaluation Guide</h3>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">PROBLEM 26075: CAPACITY CONNECT</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 text-sm font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close guide"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl p-3 text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong className="font-semibold text-blue-900 dark:text-blue-300">Core Innovation:</strong> Capacity Connect incorporates a transparent multi-variable <strong>Competency Mapping Engine</strong> (Skills 40%, Experience 20%, Qualifications 20%, Subject 15%, Rating 5%), <strong>Centralized Trainer Library</strong>, and <strong>Automated Digital Certification & Public Verification</strong>.
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 bg-slate-50 dark:bg-[#0B0F19]">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>1. Trainee Journey (Rahul Varma)</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 text-xs">
                  <li>Explore Courses & filter by difficulty, subject, or trainer.</li>
                  <li>Click <span className="font-semibold text-slate-900 dark:text-white">Enroll Now</span> on any course.</li>
                  <li>Open the course player to view video lectures, presentations, and PDFs.</li>
                  <li>Complete modules & start the <strong>Competency Assessment</strong> with live timer.</li>
                  <li>Submit to see real-time score calculation, pass/fail status, and explanations.</li>
                  <li>Click <strong>Generate Certificate</strong> to obtain a certified ID with public verification.</li>
                  <li>Visit <strong>Trainer Matching</strong> to find suitable mentors for specific organizational needs.</li>
                </ol>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 bg-slate-50 dark:bg-[#0B0F19]">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>2. Trainer Journey (Dr. Ananya Rao)</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 text-xs">
                  <li>View real-time course analytics, learner progress, and student satisfaction ratings.</li>
                  <li>Click <strong>Create Course</strong> to add structured modules and learning objectives.</li>
                  <li>Use <strong>Questionnaire Builder</strong> to create MCQ assessments with answer keys.</li>
                  <li>Upload slides, recorded lectures, and PDFs to the <strong>Trainer Library</strong>.</li>
                  <li>Explore the <strong>Competency Matching</strong> view to check trainer profile score compatibility.</li>
                </ol>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 bg-slate-50 dark:bg-[#0B0F19]">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>3. Admin Command Center (Rajeshwar Sharma)</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 text-xs">
                  <li>Review pending registrations and click <strong>Approve</strong>.</li>
                  <li>Manage user roles with confirmation dialogs.</li>
                  <li>Monitor course enrollments, assessment pass rates, and certificates.</li>
                  <li>Publish live announcements visible on homepage and dashboards.</li>
                  <li>Export analytics data to downloadable <strong>CSV format</strong>.</li>
                </ol>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowGuide(false)}
                className="px-4 py-2 text-xs font-mono font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-500 shadow-xs transition-colors"
              >
                CLOSE_GUIDE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
