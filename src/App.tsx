import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ModalProvider } from './context/ModalContext';
import { DemoBanner } from './components/common/DemoBanner';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ShieldAlert } from 'lucide-react';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { CertificateVerificationPage } from './pages/public/CertificateVerificationPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

// Trainee Pages
import { TraineeDashboard } from './pages/trainee/TraineeDashboard';
import { TraineeProfilePage } from './pages/trainee/TraineeProfilePage';
import { CourseDiscoveryPage } from './pages/trainee/CourseDiscoveryPage';
import { CourseLearningPage } from './pages/trainee/CourseLearningPage';
import { AssessmentPage } from './pages/trainee/AssessmentPage';
import { TraineeCertificatesPage } from './pages/trainee/TraineeCertificatesPage';
import { TraineeCompetenciesPage } from './pages/trainee/TraineeCompetenciesPage';
import { TraineeTrainerMatchingPage } from './pages/trainee/TraineeTrainerMatchingPage';

// Trainer Pages
import { TrainerDashboard } from './pages/trainer/TrainerDashboard';
import { TrainerCreateCoursePage } from './pages/trainer/TrainerCreateCoursePage';
import { TrainerQuestionnaireBuilderPage } from './pages/trainer/TrainerQuestionnaireBuilderPage';
import { TrainerLibraryPage } from './pages/trainer/TrainerLibraryPage';
import { TrainerLearnersPage } from './pages/trainer/TrainerLearnersPage';
import { TrainerFeedbackPage } from './pages/trainer/TrainerFeedbackPage';
import { TrainerProfilePage } from './pages/trainer/TrainerProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminTrainerManagementPage } from './pages/admin/AdminTrainerManagementPage';
import { AdminCourseOversightPage } from './pages/admin/AdminCourseOversightPage';
import { AdminUserManagementPage } from './pages/admin/AdminUserManagementPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';
import { AdminActivityLogsPage } from './pages/admin/AdminActivityLogsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

// Common Pages
import { MessagesPage } from './pages/common/MessagesPage';
import { NotificationsPage } from './pages/common/NotificationsPage';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [navigationPayload, setNavigationPayload] = useState<any>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const mainScrollRef = React.useRef<HTMLDivElement>(null);

  // Scroll to top helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  // Automatically scroll to top whenever view changes
  useEffect(() => {
    scrollToTop();
  }, [currentView]);

  // Global keyboard shortcuts: Esc to close search/overlays, Ctrl+/ or Cmd+K to toggle search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === '/')) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync default view when user switches role or logs in
  useEffect(() => {
    if (user && ['landing', 'login', 'signup'].includes(currentView)) {
      if (user.role === 'trainee') setCurrentView('trainee-dashboard');
      else if (user.role === 'trainer') setCurrentView('trainer-dashboard');
      else if (user.role === 'admin') setCurrentView('admin-dashboard');
    }
  }, [user]);

  const handleNavigate = (view: string, payload?: any) => {
    setCurrentView(view);
    setNavigationPayload(payload || null);
    setIsMobileSidebarOpen(false);
    scrollToTop();
  };

  const isPublicPage = ['landing', 'login', 'signup', 'verify-certificate'].includes(currentView);

  const renderView = () => {
    // 1. Role Security Guards: Check unauthorized direct URL/navigation access
    if (!isPublicPage && !user) {
      return (
        <div className="max-w-md mx-auto py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Authentication Required</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 mb-6">
            Please log in or register an account to access the CAPACITY CONNECT learning portal.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleNavigate('login')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Sign In
            </button>
            <button
              onClick={() => handleNavigate('signup')}
              className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-300"
            >
              Register
            </button>
          </div>
        </div>
      );
    }

    if (currentView.startsWith('admin-') && user?.role !== 'admin') {
      return (
        <div className="max-w-lg mx-auto py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Access Restricted</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 mb-6">
            This module requires <strong>Administrator</strong> privileges. Your active profile is configured as <strong>{user?.role?.toUpperCase()}</strong>.
          </p>
          <button
            onClick={() => handleNavigate(user?.role === 'trainer' ? 'trainer-dashboard' : 'trainee-dashboard')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Return to Authorized Workspace
          </button>
        </div>
      );
    }

    if (
      (currentView === 'trainer-create-course' ||
       currentView === 'trainer-questionnaires' ||
       currentView === 'trainer-learners') &&
      user?.role === 'trainee'
    ) {
      return (
        <div className="max-w-lg mx-auto py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Trainer Access Only</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 mb-6">
            Course authoring, learner oversight, and questionnaire building are reserved for faculty trainers.
          </p>
          <button
            onClick={() => handleNavigate('trainee-dashboard')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Return to Trainee Dashboard
          </button>
        </div>
      );
    }

    switch (currentView) {
      // Public Views
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'signup':
        return <SignupPage onNavigate={handleNavigate} />;
      case 'verify-certificate':
        return (
          <CertificateVerificationPage
            initialCertId={navigationPayload?.initialCertId}
            onNavigate={handleNavigate}
          />
        );

      // Trainee Views
      case 'trainee-dashboard':
        return <TraineeDashboard onNavigate={handleNavigate} />;
      case 'trainee-profile':
      case 'trainee-settings':
        return <TraineeProfilePage />;
      case 'courses-explore':
      case 'trainee-courses':
        return <CourseDiscoveryPage onNavigate={handleNavigate} />;
      case 'course-learning':
      case 'course-detail':
        return (
          <CourseLearningPage
            courseId={navigationPayload?.courseId || 'crs-101'}
            onNavigate={handleNavigate}
          />
        );
      case 'trainee-assessments':
        return (
          <AssessmentPage
            assessmentId={navigationPayload?.assessmentId || 'directory'}
            onNavigate={handleNavigate}
          />
        );
      case 'trainee-assessment-take':
        return (
          <AssessmentPage
            assessmentId={navigationPayload?.assessmentId || 'asm-101'}
            onNavigate={handleNavigate}
          />
        );
      case 'trainee-certificates':
        return <TraineeCertificatesPage onNavigate={handleNavigate} />;
      case 'trainee-competencies':
        return <TraineeCompetenciesPage onNavigate={handleNavigate} />;
      case 'trainee-trainer-matching':
        return (
          <TraineeTrainerMatchingPage
            initialQuery={navigationPayload?.query}
            onNavigate={handleNavigate}
          />
        );

      // Trainer Views
      case 'trainer-dashboard':
        return <TrainerDashboard onNavigate={handleNavigate} />;
      case 'trainer-courses':
        return <CourseDiscoveryPage onNavigate={handleNavigate} />;
      case 'trainer-create-course':
        return (
          <TrainerCreateCoursePage
            editCourseId={navigationPayload?.editCourseId}
            onNavigate={handleNavigate}
          />
        );
      case 'trainer-questionnaires':
        return <TrainerQuestionnaireBuilderPage onNavigate={handleNavigate} />;
      case 'trainer-library':
      case 'library':
      case 'trainer-materials':
      case 'materials':
        return <TrainerLibraryPage onNavigate={handleNavigate} />;
      case 'trainer-learners':
        return <TrainerLearnersPage onNavigate={handleNavigate} />;
      case 'trainer-feedback':
        return <TrainerFeedbackPage />;
      case 'trainer-analytics':
        return <AdminAnalyticsPage />;
      case 'trainer-competency-matching':
        return <TraineeTrainerMatchingPage initialQuery={navigationPayload?.query} onNavigate={handleNavigate} />;
      case 'trainer-profile':
      case 'trainer-settings':
        return <TrainerProfilePage onNavigate={handleNavigate} />;

      // Admin Views
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'admin-trainers':
        return <AdminTrainerManagementPage onNavigate={handleNavigate} />;
      case 'admin-courses':
        return <AdminCourseOversightPage onNavigate={handleNavigate} />;
      case 'admin-users':
      case 'admin-roles':
        return <AdminUserManagementPage />;
      case 'admin-enrollments':
        return <TrainerLearnersPage onNavigate={handleNavigate} />;
      case 'admin-assessments':
        return <AdminCourseOversightPage onNavigate={handleNavigate} />;
      case 'admin-certificates':
        return <TraineeCertificatesPage onNavigate={handleNavigate} />;
      case 'admin-announcements':
        return <AdminAnnouncementsPage />;
      case 'admin-competency-mapping':
        return <TraineeTrainerMatchingPage initialQuery={navigationPayload?.query} onNavigate={handleNavigate} />;
      case 'admin-reports':
      case 'admin-analytics':
        return <AdminAnalyticsPage />;
      case 'admin-logs':
      case 'admin-activity':
        return <AdminActivityLogsPage />;
      case 'admin-settings':
        return <AdminDashboard onNavigate={handleNavigate} />;

      // Common Shared Views
      case 'trainee-messages':
      case 'trainer-messages':
        return (
          <MessagesPage
            targetUserId={navigationPayload?.targetUserId}
            onNavigate={handleNavigate}
          />
        );
      case 'notifications':
      case 'trainee-notifications':
      case 'trainer-notifications':
        return <NotificationsPage onNavigate={handleNavigate} />;

      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-300 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Interactive Demo Switcher Bar */}
      <DemoBanner onNavigate={handleNavigate} />

      {isPublicPage ? (
        /* Full width layout for landing, auth, verification */
        <main className="flex-1 bg-slate-50 dark:bg-[#0B0F19]">
          {renderView()}
        </main>
      ) : (
        /* Portal Layout with Responsive Sidebar and Header */
        <div className="flex-1 flex overflow-hidden bg-slate-50 dark:bg-[#0B0F19]">
          
          {/* Responsive Mobile / Desktop Sidebar */}
          <Sidebar
            currentView={currentView}
            onNavigate={handleNavigate}
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
          />

          {/* Main Content Area */}
          <div ref={mainScrollRef} className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-100/70 dark:bg-[#0B101B] lg:pl-60">
            <Header
              currentView={currentView}
              onNavigate={handleNavigate}
              onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
              onOpenSearch={() => setIsSearchOpen(true)}
            />

            <main className="flex-1 p-3 sm:p-4 lg:p-6 max-w-7xl w-full mx-auto pb-16">
              {renderView()}
            </main>
          </div>
        </div>
      )}

      {/* Global Cmd+K Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ModalProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ModalProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
