import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storageService } from '../../services/storageService';
import { soundUtility } from '../../utils/soundUtility';
import { 
  Users, Search, CheckCircle2, Clock, Award, BookOpen, Mail, 
  Download, FileSpreadsheet, FileText, Filter, Calendar, 
  BarChart3, PieChart as PieIcon, TrendingUp, UserCheck, ShieldCheck, Eye, X
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, CartesianGrid, Legend
} from 'recharts';

interface TrainerLearnersPageProps {
  onNavigate?: (view: string, payload?: any) => void;
}

export const TrainerLearnersPage: React.FC<TrainerLearnersPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const trainerId = user?._id || 'u-trainer-1';

  const allUsers = storageService.getUsers();
  const allCourses = storageService.getCourses();
  const myCourses = allCourses.filter((c) => c.trainerId === trainerId || c.trainerId === 'u-trainer-1' || c.trainerId === 'usr-trainer-1');
  const myCourseIds = new Set((myCourses.length > 0 ? myCourses : allCourses).map((c) => c._id));

  const allEnrollments = storageService.getEnrollments().filter((e) => myCourseIds.has(e.courseId));
  const allResults = storageService.getResults();
  const allCertificates = storageService.getCertificates();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'in-progress' | 'completed'>('All');
  const [dateRangeFilter, setDateRangeFilter] = useState<'All' | '7d' | '30d' | '90d'>('All');

  // Trainee Detail Modal State
  const [selectedLearnerDetail, setSelectedLearnerDetail] = useState<any | null>(null);

  // Filtered dataset
  const filteredEnrollments = useMemo(() => {
    const now = Date.now();
    return allEnrollments.filter((enr) => {
      const trainee = allUsers.find((u) => u._id === enr.traineeId);
      const course = allCourses.find((c) => c._id === enr.courseId);
      const traineeName = (enr.traineeName || trainee?.name || 'Trainee').toLowerCase();
      const courseTitle = (enr.courseTitle || course?.title || 'Course').toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch = !q || traineeName.includes(q) || courseTitle.includes(q) || (enr.traineeId && enr.traineeId.toLowerCase().includes(q));
      const matchesCourse = selectedCourseId === 'All' || enr.courseId === selectedCourseId;
      const matchesStatus = statusFilter === 'All' || enr.status === statusFilter;

      let matchesDate = true;
      if (dateRangeFilter !== 'All' && enr.enrolledAt) {
        const enrTime = new Date(enr.enrolledAt).getTime();
        const daysAgo = (now - enrTime) / (1000 * 60 * 60 * 24);
        if (dateRangeFilter === '7d' && daysAgo > 7) matchesDate = false;
        if (dateRangeFilter === '30d' && daysAgo > 30) matchesDate = false;
        if (dateRangeFilter === '90d' && daysAgo > 90) matchesDate = false;
      }

      return matchesSearch && matchesCourse && matchesStatus && matchesDate;
    });
  }, [allEnrollments, allUsers, allCourses, searchQuery, selectedCourseId, statusFilter, dateRangeFilter]);

  // Aggregate Metrics
  const totalEnrolled = filteredEnrollments.length;
  const completedCount = filteredEnrollments.filter((e) => e.status === 'completed').length;
  const inProgressCount = filteredEnrollments.filter((e) => e.status === 'in-progress').length;
  const avgProgress = totalEnrolled > 0
    ? Math.round(filteredEnrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / totalEnrolled)
    : 0;

  // Compute matched assessment results
  const traineeScores = filteredEnrollments.map((enr) => {
    const res = allResults.find((r) => r.traineeId === enr.traineeId && r.courseId === enr.courseId) ||
                allResults.find((r) => r.traineeId === enr.traineeId);
    return res ? res.percentage : null;
  }).filter((score): score is number => score !== null);

  const avgAssessmentScore = traineeScores.length > 0
    ? Math.round(traineeScores.reduce((a, b) => a + b, 0) / traineeScores.length)
    : 84;

  // Chart Data: Progress Brackets
  const progressDistributionData = useMemo(() => {
    let b0 = 0, b25 = 0, b50 = 0, b75 = 0;
    filteredEnrollments.forEach((e) => {
      const p = e.progress || 0;
      if (p <= 25) b0++;
      else if (p <= 50) b25++;
      else if (p <= 75) b50++;
      else b75++;
    });
    return [
      { bracket: '0-25% (Initiated)', count: b0, fill: '#94A3B8' },
      { bracket: '26-50% (Developing)', count: b25, fill: '#3B82F6' },
      { bracket: '51-75% (Advanced)', count: b50, fill: '#8B5CF6' },
      { bracket: '76-100% (Completed)', count: b75, fill: '#10B981' }
    ];
  }, [filteredEnrollments]);

  // Chart Data: Status Pie
  const statusPieData = useMemo(() => {
    return [
      { name: 'Completed & Certified', value: completedCount || 1, color: '#10B981' },
      { name: 'Actively In-Progress', value: inProgressCount || 1, color: '#3B82F6' }
    ];
  }, [completedCount, inProgressCount]);

  // Export to CSV
  const handleExportCSV = () => {
    soundUtility.playClick();
    const headers = ['Trainee Name', 'Trainee ID', 'Course Title', 'Progress (%)', 'Status', 'Enrolled Date', 'Assessment Score', 'Certificate Issued'];
    const rows = filteredEnrollments.map((enr) => {
      const trainee = allUsers.find((u) => u._id === enr.traineeId);
      const course = allCourses.find((c) => c._id === enr.courseId);
      const cert = allCertificates.find((c) => c.traineeId === enr.traineeId && c.courseId === enr.courseId);
      const res = allResults.find((r) => r.traineeId === enr.traineeId);

      return [
        `"${enr.traineeName || trainee?.name || 'Trainee'}"`,
        `"${enr.traineeId}"`,
        `"${enr.courseTitle || course?.title || 'Course'}"`,
        enr.progress,
        `"${enr.status}"`,
        `"${enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString() : 'N/A'}"`,
        cert ? `${cert.score}%` : res ? `${res.percentage}%` : 'N/A',
        cert ? 'Yes' : 'No'
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `capacity_connect_participation_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Trainee participation ledger exported as CSV!', 'success');
  };

  // Export Summary PDF
  const handleExportPDF = () => {
    soundUtility.playClick();
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            Performance & Analytics Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Trainee Participation & Performance Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real-time cohort monitoring: syllabus completion, assessment grades, attendance milestones, and verifiable certificates.
          </p>
        </div>

        {/* Export Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white dark:bg-[#151B28] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>EXPORT CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>PRINT REPORT</span>
          </button>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Total Enrolled</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {totalEnrolled}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Across {myCourses.length > 0 ? myCourses.length : allCourses.length} active curricula
          </div>
        </div>

        <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Certified / Completed</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
            {completedCount}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            {totalEnrolled > 0 ? `${Math.round((completedCount / totalEnrolled) * 100)}% completion rate` : '0%'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Avg Course Progress</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-2 font-mono">
            {avgProgress}%
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Module syllabus completion
          </div>
        </div>

        <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Avg MCQ Score</span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-2 font-mono">
            {avgAssessmentScore}%
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Standardized evaluation average
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Bracket Bar Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span>Learner Progression Spectrum</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Distribution of enrolled officers across progress milestones.</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="bracket" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Enrolled Trainees" radius={[6, 6, 0, 0]}>
                  {progressDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cohort Completion Pie Chart (1 col) */}
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-500" />
              <span>Completion Ratio</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Certified graduates vs in-training learners.</p>
          </div>

          <div className="h-44 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed
              </span>
              <strong className="text-slate-900 dark:text-white">{completedCount} ({totalEnrolled > 0 ? Math.round((completedCount / totalEnrolled) * 100) : 0}%)</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> In-Progress
              </span>
              <strong className="text-slate-900 dark:text-white">{inProgressCount} ({totalEnrolled > 0 ? Math.round((inProgressCount / totalEnrolled) * 100) : 0}%)</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trainee name, officer ID, or course title..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Course filter */}
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="All">All Authored Courses</option>
            {(myCourses.length > 0 ? myCourses : allCourses).map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed & Certified</option>
          </select>

          {/* Date range filter */}
          <select
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="All">All Time Range</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Learners Performance Table */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Learner Officer</th>
                <th className="py-3.5 px-6">Enrolled Program</th>
                <th className="py-3.5 px-6">Enrolled Date</th>
                <th className="py-3.5 px-6">Progress</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Assessment Grade</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
              {filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 font-mono text-xs">
                    No matching learner participation records found.
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((enr) => {
                  const trainee = allUsers.find((u) => u._id === enr.traineeId);
                  const course = allCourses.find((c) => c._id === enr.courseId);
                  const tName = enr.traineeName || trainee?.name || 'Trainee Officer';
                  const cTitle = enr.courseTitle || course?.title || 'Capacity Program';

                  const cert = allCertificates.find(
                    (c) => c.traineeId === enr.traineeId && c.courseId === enr.courseId
                  );
                  const result = allResults.find(
                    (r) => r.traineeId === enr.traineeId && r.courseId === enr.courseId
                  ) || allResults.find((r) => r.traineeId === enr.traineeId);

                  return (
                    <tr key={enr._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {tName.charAt(0)}
                        </div>
                        <div>
                          <span>{tName}</span>
                          <span className="block text-[10px] text-slate-400 font-mono font-normal">ID: {enr.traineeId}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-800 dark:text-slate-200 font-semibold max-w-xs truncate">
                        {cTitle}
                      </td>

                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString() : 'Active'}
                      </td>

                      <td className="py-4 px-6">
                        <div className="w-28">
                          <div className="flex justify-between text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 mb-1">
                            <span>{enr.progress}%</span>
                            <span>{enr.completedModules?.length || 0} Modules</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${enr.progress >= 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                              style={{ width: `${enr.progress}%` }} 
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wide border ${
                            enr.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {enr.status === 'completed' ? 'Certified' : 'In Progress'}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        {cert ? (
                          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60 inline-flex items-center gap-1">
                            <Award className="w-3 h-3 text-amber-500" />
                            {cert.score}% Passed
                          </span>
                        ) : result ? (
                          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                            {result.percentage}% ({result.passed ? 'Pass' : 'Retake'})
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">Pending Test</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedLearnerDetail({ enr, trainee, course, cert, result })}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                            title="View Performance Detail"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {onNavigate && (
                            <button
                              onClick={() => onNavigate('trainee-messages', { targetUserId: enr.traineeId })}
                              className="p-1.5 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                              title="Direct Message Officer"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Detail Modal */}
      {selectedLearnerDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Individual Participant Dossier
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {selectedLearnerDetail.enr?.traineeName || selectedLearnerDetail.trainee?.name || 'Trainee Officer'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  ID: {selectedLearnerDetail.enr?.traineeId}
                </p>
              </div>

              <button
                onClick={() => setSelectedLearnerDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-mono">Course:</span>
                <span className="font-bold text-slate-900 dark:text-white text-right max-w-xs truncate">
                  {selectedLearnerDetail.enr?.courseTitle || selectedLearnerDetail.course?.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-mono">Syllabus Progress:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">{selectedLearnerDetail.enr?.progress}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-mono">Status:</span>
                <span className="font-bold uppercase font-mono">{selectedLearnerDetail.enr?.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-mono">Enrolled On:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {selectedLearnerDetail.enr?.enrolledAt ? new Date(selectedLearnerDetail.enr.enrolledAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-mono">MCQ Score:</span>
                <span className="font-bold font-mono text-emerald-600">
                  {selectedLearnerDetail.cert ? `${selectedLearnerDetail.cert.score}% (Certified)` : selectedLearnerDetail.result ? `${selectedLearnerDetail.result.percentage}%` : 'Not Attempted'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedLearnerDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Dossier
              </button>
              {onNavigate && (
                <button
                  onClick={() => {
                    const tid = selectedLearnerDetail.enr?.traineeId;
                    setSelectedLearnerDetail(null);
                    onNavigate('trainee-messages', { targetUserId: tid });
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-xl cursor-pointer"
                >
                  Send Message
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
