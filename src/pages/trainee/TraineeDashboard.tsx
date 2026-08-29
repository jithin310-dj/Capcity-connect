import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/analyticsService';
import { storageService } from '../../services/storageService';
import { StatsCard } from '../../components/common/StatsCard';
import { CourseCard } from '../../components/common/CourseCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import { 
  BookOpen, CheckCircle, Award, CheckSquare, Sparkles, 
  ArrowRight, Compass, Calendar, Clock, AlertTriangle, UserCheck 
} from 'lucide-react';

interface TraineeDashboardProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const TraineeDashboard: React.FC<TraineeDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const userId = user?._id || 'u-trainee-1';

  const analytics = analyticsService.getTraineeAnalytics(userId);
  const enrollments = storageService.getEnrollments().filter((e) => e.traineeId === userId);
  const courses = storageService.getCourses();
  const assessments = storageService.getAssessments().filter((a) => a.status === 'published');
  const results = storageService.getResults().filter((r) => r.traineeId === userId);
  const activityLogs = storageService.getActivityLogs().filter((l) => l.userId === userId).slice(0, 5);

  const attemptedAssessmentIds = new Set(results.map((r) => r.assessmentId));
  const enrolledCourseIds = enrollments.map((e) => e.courseId);

  // Active in-progress course
  const activeEnrollment = enrollments.find((e) => e.status === 'in-progress') || enrollments[0];
  const activeCourse = activeEnrollment ? courses.find((c) => c._id === activeEnrollment.courseId) : null;

  // Upcoming pending assessments
  const pendingAssessments = assessments.filter(
    (a) => enrolledCourseIds.includes(a.courseId) && !attemptedAssessmentIds.has(a._id)
  );

  // Recommended courses not yet enrolled
  const recommendedCourses = courses
    .filter((c) => !enrolledCourseIds.includes(c._id))
    .slice(0, 3);

  return (
    <div className="space-y-8">
      
      {/* Good Morning / Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            Trainee Portal • Smart India Hackathon
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Rahul Varma'}!
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed">
            You are progressing steadily through your organizational competency tracks. You have completed {analytics.completedCount} of {analytics.enrolledCount} enrolled courses.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            {activeCourse && (
              <button
                onClick={() => onNavigate('course-learning', { courseId: activeCourse._id })}
                className="px-5 py-2.5 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <span>Continue Learning: {activeCourse.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onNavigate('courses-explore')}
              className="px-4 py-2.5 bg-blue-700/60 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl border border-blue-400/30 transition-colors"
            >
              Browse Course Catalog
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Enrolled Courses"
          value={analytics.enrolledCount}
          subtitle="Active curriculum tracks"
          icon={BookOpen}
          color="blue"
        />
        <StatsCard
          title="Completed Tracks"
          value={analytics.completedCount}
          subtitle="Modules finished"
          icon={CheckCircle}
          color="emerald"
        />
        <StatsCard
          title="Pending Assessments"
          value={analytics.pendingAssessmentsCount}
          subtitle="Awaiting final evaluation"
          icon={CheckSquare}
          color="amber"
        />
        <StatsCard
          title="Certificates Earned"
          value={analytics.certificatesCount}
          subtitle="Verified digital credentials"
          icon={Award}
          color="purple"
        />
      </div>

      {/* Main Grid: Active Course + Competency Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: In-Progress Learning + Pending Assessments */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Course Card */}
          {activeCourse && activeEnrollment && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-bold text-slate-900">Current In-Progress Course</h2>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  {activeEnrollment.progress}% Finished
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <img
                  src={activeCourse.thumbnail}
                  alt={activeCourse.title}
                  className="w-full sm:w-44 h-28 rounded-2xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {activeCourse.category}
                    </span>
                    <span className="text-xs text-slate-500">• {activeCourse.trainerName}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{activeCourse.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4">{activeCourse.description}</p>
                  
                  <div className="mb-4">
                    <ProgressBar value={activeEnrollment.progress} color="blue" />
                  </div>

                  <button
                    onClick={() => onNavigate('course-learning', { courseId: activeCourse._id })}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
                  >
                    <span>Resume Module Player</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pending Assessments Alert Box */}
          {pendingAssessments.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-4 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm">Pending MCQ Competency Assessments</h3>
              </div>
              <div className="space-y-3">
                {pendingAssessments.map((assessment) => (
                  <div
                    key={assessment._id}
                    className="bg-white p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{assessment.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Course: {assessment.courseTitle} • {assessment.questions.length} Questions • {assessment.durationMinutes} Mins • Pass Mark: {assessment.passingPercentage}%
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate('trainee-assessment-take', { assessmentId: assessment._id })}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-2xs"
                    >
                      Start Assessment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Courses For You */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Recommended Based on Your Competency Profile</span>
              </h2>
              <button
                onClick={() => onNavigate('courses-explore')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                View all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendedCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onSelect={(id) => onNavigate('course-detail', { courseId: id })}
                  onEnroll={(id) => onNavigate('course-detail', { courseId: id })}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Competency Pillars & Activity Feed */}
        <div className="space-y-6">
          
          {/* Competency Overview Box */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Competency Matrix</h3>
              </div>
              <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                {analytics.overallCompetencyScore}% Level
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Calculated across verified assessment results, course completions, and domain assessments.
            </p>

            <div className="space-y-3.5">
              {analytics.competencyPillars.map((pillar, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{pillar.category}</span>
                    <span className="font-bold text-slate-900">{pillar.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${pillar.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('trainee-competencies')}
              className="w-full mt-5 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Full Competency Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {activityLogs.length === 0 ? (
                <p className="text-xs text-slate-400">No recent activity logged.</p>
              ) : (
                activityLogs.map((log) => (
                  <div key={log._id} className="text-xs flex items-start gap-2.5 pb-2.5 border-b border-slate-100 last:border-none">
                    <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{log.action}: {log.details}</p>
                      <p className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
