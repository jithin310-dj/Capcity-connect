import React, { useState, useMemo } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { storageService } from '../../services/storageService';
import { soundUtility } from '../../utils/soundUtility';
import { useToast } from '../../context/ToastContext';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend 
} from 'recharts';
import { 
  BarChart3, TrendingUp, Award, Users, BookOpen, 
  Download, FileSpreadsheet, Search, Filter, Calendar, 
  CheckCircle2, Clock, ShieldCheck, UserCheck, ChevronRight
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const { showToast } = useToast();
  const analytics = analyticsService.getAdminAnalytics();
  const allUsers = storageService.getUsers();
  const allCourses = storageService.getCourses();
  const allEnrollments = storageService.getEnrollments();
  const allResults = storageService.getResults();
  const allCertificates = storageService.getCertificates();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'in-progress' | 'completed'>('All');
  const [dateRangeFilter, setDateRangeFilter] = useState<'All' | '7d' | '30d' | '90d'>('All');

  // Timeframe for engagement chart
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  // Key metrics calculation
  const totalParticipants = allUsers.filter((u) => u.role === 'trainee').length;
  const activeLearners = allEnrollments.filter((e) => e.status === 'in-progress').length;
  const completedLearners = allEnrollments.filter((e) => e.status === 'completed').length;
  const overallCompletionRate = allEnrollments.length > 0
    ? Math.round((completedLearners / allEnrollments.length) * 100)
    : 88;
  const avgScore = allResults.length > 0
    ? Math.round(allResults.reduce((acc, r) => acc + r.percentage, 0) / allResults.length)
    : 85;

  // Chart Data
  const monthlyEnrollmentTrend = [
    { month: 'Jan', enrollments: 420, completions: 340, activeUsers: 680 },
    { month: 'Feb', enrollments: 580, completions: 490, activeUsers: 890 },
    { month: 'Mar', enrollments: 740, completions: 620, activeUsers: 1120 },
    { month: 'Apr', enrollments: 890, completions: 780, activeUsers: 1350 },
    { month: 'May', enrollments: 1050, completions: 920, activeUsers: 1580 },
    { month: 'Jun', enrollments: 1240, completions: 1080, activeUsers: 1840 }
  ];

  const domainCompletionData = [
    { domain: 'Data Science & AI', completionRate: 88, enrolled: 1840, completed: 1626 },
    { domain: 'Cyber Defense', completionRate: 84, enrolled: 1420, completed: 1195 },
    { domain: 'Public Policy', completionRate: 92, enrolled: 2150, completed: 1991 },
    { domain: 'Digital Governance', completionRate: 86, enrolled: 1680, completed: 1581 },
    { domain: 'Cloud Architecture', completionRate: 80, enrolled: 1120, completed: 890 }
  ];

  const scoreDistributionData = [
    { range: '90-100% (Distinction)', count: 420, fill: '#10B981' },
    { range: '80-89% (Proficient)', count: 680, fill: '#3B82F6' },
    { range: '70-79% (Qualified)', count: 340, fill: '#8B5CF6' },
    { range: '<70% (Retake)', count: 95, fill: '#F59E0B' }
  ];

  // Filtered Participation Ledger
  const filteredLedger = useMemo(() => {
    const now = Date.now();
    return allEnrollments.filter((enr) => {
      const trainee = allUsers.find((u) => u._id === enr.traineeId);
      const course = allCourses.find((c) => c._id === enr.courseId);
      const tName = (enr.traineeName || trainee?.name || 'Trainee').toLowerCase();
      const cTitle = (enr.courseTitle || course?.title || 'Course').toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch = !q || tName.includes(q) || cTitle.includes(q) || (enr.traineeId && enr.traineeId.toLowerCase().includes(q));
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

  // Export CSV
  const handleExportCSV = () => {
    soundUtility.playClick();
    const headers = ['Trainee Name', 'Trainee ID', 'Course Title', 'Enrollment Date', 'Progress (%)', 'Completion Status', 'Assessment Score', 'Certificate Status'];
    const rows = filteredLedger.map((enr) => {
      const trainee = allUsers.find((u) => u._id === enr.traineeId);
      const course = allCourses.find((c) => c._id === enr.courseId);
      const cert = allCertificates.find((c) => c.traineeId === enr.traineeId && c.courseId === enr.courseId);
      const res = allResults.find((r) => r.traineeId === enr.traineeId && r.courseId === enr.courseId) ||
                  allResults.find((r) => r.traineeId === enr.traineeId);

      return [
        `"${enr.traineeName || trainee?.name || 'Trainee'}"`,
        `"${enr.traineeId}"`,
        `"${enr.courseTitle || course?.title || 'Course'}"`,
        `"${enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString() : 'N/A'}"`,
        enr.progress,
        `"${enr.status}"`,
        cert ? `${cert.score}%` : res ? `${res.percentage}%` : 'N/A',
        cert ? 'Valid & Issued' : 'Pending'
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `platform_participation_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Platform participation statistics exported as CSV!', 'success');
  };

  const handleExportPDF = () => {
    soundUtility.playClick();
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Macro Capacity Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Platform Participation & Competency Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Aggregated institutional metrics, engagement velocity, and cross-cadre participation ledger.
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
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>PRINT REPORT</span>
          </button>
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Total Participants
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{totalParticipants}</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">Registered officers</span>
        </div>

        <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Active Learners
          </span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">{activeLearners}</div>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-1 block">Ongoing modules</span>
        </div>

        <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Completion Rate
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{overallCompletionRate}%</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">Program completion</span>
        </div>

        <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Avg Assessment Score
          </span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">{avgScore}%</div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-1 block">MCQ Evaluations</span>
        </div>

        <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Certificates Issued
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">{allCertificates.length}</div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1 block">Verifiable credentials</span>
        </div>
      </div>

      {/* Main Analytical Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Engagement & Active Users Trend */}
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Active Users & Course Enrollments Over Time</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monthly enrollment flow vs active platform users.</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEnrollmentTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEnrAdmin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="activeUsers" stroke="#6366F1" fillOpacity={1} fill="url(#colorActive)" name="Active Users" />
                <Area type="monotone" dataKey="enrollments" stroke="#10B981" fillOpacity={1} fill="url(#colorEnrAdmin)" name="Enrollments" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assessment Score Distribution */}
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Assessment Score Distribution</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Score distribution across all standardized evaluations.</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="count" name="Evaluations Count" radius={[6, 6, 0, 0]}>
                  {scoreDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Participation Ledger Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-500" />
              <span>Platform Participation Ledger ({filteredLedger.length} Records)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Filter by course, completion status, or date range to inspect cross-cadre progression.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search participant name, officer ID, or course title..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Course Filter */}
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="All">All Courses</option>
              {allCourses.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed & Certified</option>
            </select>

            {/* Date Range */}
            <select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="All">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Trainee Officer</th>
                  <th className="py-3.5 px-6">Enrolled Course</th>
                  <th className="py-3.5 px-6">Enrollment Date</th>
                  <th className="py-3.5 px-6">Progress</th>
                  <th className="py-3.5 px-6">Completion Status</th>
                  <th className="py-3.5 px-6">Assessment Score</th>
                  <th className="py-3.5 px-6 text-right">Certificate Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 font-mono text-xs">
                      No matching participation records found.
                    </td>
                  </tr>
                ) : (
                  filteredLedger.map((enr) => {
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
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-bold text-xs shrink-0">
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
                          {enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString() : 'N/A'}
                        </td>

                        <td className="py-4 px-6">
                          <div className="w-28">
                            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 mb-1">
                              <span>{enr.progress}%</span>
                              <span>{enr.completedModules?.length || 0} Modules</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${enr.progress >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
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
                            {enr.status === 'completed' ? 'Completed' : 'In Progress'}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          {cert ? (
                            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60 inline-flex items-center gap-1">
                              <Award className="w-3 h-3 text-amber-500" />
                              {cert.score}%
                            </span>
                          ) : result ? (
                            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                              {result.percentage}% ({result.passed ? 'Pass' : 'Retake'})
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono text-[11px]">Not Attempted</span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-right font-mono text-xs">
                          {cert ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Valid & Verified
                            </span>
                          ) : (
                            <span className="text-slate-400">In Progress</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
