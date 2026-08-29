import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { courseService } from '../../services/courseService';
import { useToast } from '../../context/ToastContext';
import { StatsCard } from '../../components/common/StatsCard';
import { 
  Users, BookOpen, Award, Activity, ShieldCheck, 
  CheckCircle2, XCircle, Megaphone, ChevronRight, BarChart3 
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [users, setUsers] = useState(storageService.getUsers());
  const [courses, setCourses] = useState(storageService.getCourses());
  const [logs] = useState(storageService.getActivityLogs().slice(0, 5));

  const analytics = storageService.getPortalAnalytics();

  const pendingTrainers = users.filter(
    (u) => u.role === 'trainer' && (u.status === 'pending' || (u as any).trainerVerificationStatus === 'pending')
  );

  const pendingCourses = courses.filter((c) => c.status === 'draft');

  const handleApproveTrainer = (trainerId: string) => {
    storageService.updateUser(trainerId, { status: 'approved' });
    setUsers(storageService.getUsers());
    showToast('Trainer credentials approved and status updated to verified!', 'success');
  };

  const handleRejectTrainer = (trainerId: string) => {
    storageService.updateUser(trainerId, { status: 'suspended' });
    setUsers(storageService.getUsers());
    showToast('Trainer application rejected.', 'info');
  };

  const handleApproveCourse = (courseId: string) => {
    courseService.updateCourse(courseId, { status: 'published' });
    setCourses(storageService.getCourses());
    showToast('Course curriculum approved and published across portal!', 'success');
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner - High contrast & crisp in both themes */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950/80 dark:to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-800/40">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>National Directorate • Smart India Hackathon 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Institutional Governance & Admin Console
          </h1>
          <p className="text-slate-200 dark:text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Centralized orchestration of institutional users, faculty vetting, course publishing approvals, and real-time competency analytics.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigate('admin-announcements')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <Megaphone className="w-4 h-4" />
            <span>Post System Announcement</span>
          </button>
          <button
            onClick={() => onNavigate('admin-logs')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 backdrop-blur-xs transition-colors flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Registered Users"
          value={analytics.totalUsers}
          subtitle={`${analytics.totalTrainees} Trainees • ${analytics.totalTrainers} Faculty`}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Curricula Catalog"
          value={analytics.totalCourses}
          subtitle={`${analytics.publishedCourses} Published • ${analytics.draftCourses} Drafts`}
          icon={BookOpen}
          color="emerald"
        />
        <StatsCard
          title="Certificates Issued"
          value={analytics.totalCertificatesIssued}
          subtitle="Verifiable accreditations"
          icon={Award}
          color="purple"
        />
        <StatsCard
          title="Course Enrollments"
          value={analytics.totalEnrollments}
          subtitle="Active training records"
          icon={Activity}
          color="amber"
        />
      </div>

      {/* Pending Approvals Section (Trainers & Courses) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Trainers */}
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Pending Faculty Verifications</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                {pendingTrainers.length} Pending
              </span>
            </div>

            {pendingTrainers.length === 0 ? (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-60" />
                <p>All faculty applicants are fully verified!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTrainers.map((t) => (
                  <div
                    key={t._id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">{t.name}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{t.designation} • {t.organization}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleApproveTrainer(t._id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Approve
                      </button>
                      <button
                        onClick={() => handleRejectTrainer(t._id)}
                        className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('admin-trainers')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Manage All Trainers Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pending Courses */}
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Pending Curriculum Approvals</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                {pendingCourses.length} In Review
              </span>
            </div>

            {pendingCourses.length === 0 ? (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-60" />
                <p>No new draft courses awaiting approval.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingCourses.map((c) => (
                  <div
                    key={c._id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">{c.title}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">By {c.trainerName} • {c.category}</p>
                    </div>

                    <button
                      onClick={() => handleApproveCourse(c._id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg shrink-0 flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Approve & Publish
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('admin-courses')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Full Curriculum Oversight Console</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Quick Nav Module Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          onClick={() => onNavigate('admin-users')}
          className="bg-white dark:bg-[#151B28] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center gap-4 group"
        >
          <div className="w-13 h-13 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">User Directory & Roles</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Role management and account status toggles</p>
          </div>
        </div>

        <div
          onClick={() => onNavigate('admin-analytics')}
          className="bg-white dark:bg-[#151B28] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center gap-4 group"
        >
          <div className="w-13 h-13 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">National Capacity Analytics</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Competency pillar distribution and trends</p>
          </div>
        </div>

        <div
          onClick={() => onNavigate('admin-logs')}
          className="bg-white dark:bg-[#151B28] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center gap-4 group"
        >
          <div className="w-13 h-13 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">System Audit Ledger</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Timestamped administrative actions trail</p>
          </div>
        </div>
      </div>

      {/* Recent Audit Activities */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent System Activity Stream</h3>
          </div>

          <button
            onClick={() => onNavigate('admin-logs')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            View Full Audit Trail →
          </button>
        </div>

        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log._id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-mono text-[10px] font-bold rounded uppercase">
                  {log.category}
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{log.action}</span>
                <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">• {log.details}</span>
              </div>
              <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
