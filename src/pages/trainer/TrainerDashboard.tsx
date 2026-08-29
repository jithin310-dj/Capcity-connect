import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/analyticsService';
import { storageService } from '../../services/storageService';
import { courseService } from '../../services/courseService';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';
import { StatsCard } from '../../components/common/StatsCard';
import { Course } from '../../types';
import { 
  BookOpen, Users, Star, Award, PlusCircle, BarChart3, 
  FileQuestion, FolderGit2, CheckCircle2, Clock, Trash2, Edit3, ArrowRight 
} from 'lucide-react';

interface TrainerDashboardProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { confirmAction } = useModal();
  const trainerId = user?._id || 'u-trainer-1';

  const analytics = analyticsService.getTrainerAnalytics(trainerId);
  const [courses, setCourses] = useState<Course[]>(
    storageService.getCourses().filter((c) => c.trainerId === trainerId)
  );
  const assessments = storageService.getAssessments().filter((a) => a.trainerId === trainerId);
  const materials = storageService.getMaterials().filter((m) => m.trainerId === trainerId);
  const feedbacks = storageService.getFeedbacks().filter((f) => f.trainerId === trainerId);

  const handleTogglePublish = (course: Course) => {
    const newStatus = course.status === 'published' ? 'draft' : 'published';
    courseService.updateCourse(course._id, { status: newStatus });
    setCourses(storageService.getCourses().filter((c) => c.trainerId === trainerId));
    showToast(`Course status updated to ${newStatus.toUpperCase()}`, 'success');
  };

  const handleDeleteCourse = (course: Course) => {
    confirmAction({
      title: 'Delete Course?',
      message: `Are you sure you want to permanently delete "${course.title}"? This cannot be undone.`,
      isDestructive: true,
      confirmText: 'Delete Course',
      onConfirm: () => {
        if (!user) return;
        courseService.deleteCourse(user._id, user.name, 'trainer', course._id);
        setCourses(storageService.getCourses().filter((c) => c.trainerId === trainerId));
        showToast('Course deleted successfully', 'info');
      }
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-5 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <FolderGit2 className="w-3.5 h-3.5 shrink-0" />
            <span>Trainer Creator Studio • CAPACITY CONNECT</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Welcome, {user?.name || 'Dr. Ananya Rao'}!
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1.5 leading-relaxed">
            You are managing {courses.length} active curricula with {analytics.activeLearners} enrolled professionals. Your faculty satisfaction rating is {analytics.avgRating} / 5.0 ★.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('trainer-create-course')}
            className="min-h-[44px] px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>Create New Course</span>
          </button>
          <button
            onClick={() => onNavigate('trainer-questionnaires')}
            className="min-h-[44px] px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 backdrop-blur-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileQuestion className="w-4 h-4 shrink-0" />
            <span>Add MCQ Assessment</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Active Courses"
          value={analytics.totalCourses}
          subtitle="Authored programs"
          icon={BookOpen}
          color="emerald"
        />
        <StatsCard
          title="Enrolled Learners"
          value={analytics.activeLearners}
          subtitle="Officers & trainees"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Completion Rate"
          value={`${analytics.completionRate}%`}
          subtitle="Passed final assessments"
          icon={Award}
          color="purple"
        />
        <StatsCard
          title="Faculty Rating"
          value={`${analytics.avgRating}★`}
          subtitle={`Across ${analytics.feedbacksCount} verified reviews`}
          icon={Star}
          color="amber"
        />
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div
          onClick={() => onNavigate('trainer-library')}
          className="bg-white dark:bg-[#151B28] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center gap-4 group"
        >
          <div className="w-13 h-13 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FolderGit2 className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Centralized Trainer Library</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{materials.length} Uploaded lecture slides, PDFs & videos</p>
          </div>
        </div>

        <div
          onClick={() => onNavigate('trainer-learners')}
          className="bg-white dark:bg-[#151B28] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center gap-4 group"
        >
          <div className="w-13 h-13 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Users className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Learner Participation & Scores</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Track individual officer progress and assessment grades</p>
          </div>
        </div>

        <div
          onClick={() => onNavigate('trainer-feedback')}
          className="bg-white dark:bg-[#151B28] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center gap-4 group"
        >
          <div className="w-13 h-13 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Star className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Student Feedback & Reviews</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{feedbacks.length} Written reviews from completed cohorts</p>
          </div>
        </div>
      </div>

      {/* Courses Management Table / Grid */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Authored Curriculum Programs</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage modules, status, and associated MCQ evaluations.</p>
          </div>

          <button
            onClick={() => onNavigate('trainer-create-course')}
            className="min-h-[44px] px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 w-full sm:w-fit cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Course</span>
          </button>
        </div>

        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#0B0F19]/50"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0 w-full lg:w-auto">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full sm:w-16 h-28 sm:h-16 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-800 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      course.status === 'published'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300'
                    }`}>
                      {course.status}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">• {course.category} • {course.difficulty}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">{course.title}</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center flex-wrap gap-1.5 font-medium">
                    <span>{course.modules?.length || 0} Modules</span>
                    <span className="text-slate-400 dark:text-slate-600">•</span>
                    <span>{course.enrolledUsers} Learners Enrolled</span>
                    <span className="text-slate-400 dark:text-slate-600">•</span>
                    <span className="text-amber-500 font-bold">Rating: {course.rating}★</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
                <button
                  onClick={() => onNavigate('course-learning', { courseId: course._id })}
                  className="min-h-[44px] sm:min-h-[38px] px-3 py-2 bg-white dark:bg-[#151B28] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Preview Player
                </button>

                <button
                  onClick={() => onNavigate('trainer-create-course', { editCourseId: course._id })}
                  className="min-h-[44px] sm:min-h-[38px] px-3 py-2 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleTogglePublish(course)}
                  className={`min-h-[44px] sm:min-h-[38px] px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                    course.status === 'published'
                      ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-100'
                      : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100'
                  }`}
                >
                  {course.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>

                <button
                  onClick={() => handleDeleteCourse(course)}
                  className="min-h-[44px] min-w-[44px] p-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                  title="Delete Course"
                  aria-label="Delete Course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
