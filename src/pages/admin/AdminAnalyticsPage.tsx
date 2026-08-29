import React from 'react';
import { analyticsService } from '../../services/analyticsService';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { BarChart3, TrendingUp, Award, Users, BookOpen, Compass, Sparkles } from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const analytics = analyticsService.getAdminAnalytics();

  const competencyData = [
    { name: 'Technical & Eng.', score: 84, benchmark: 75 },
    { name: 'Communication', score: 81, benchmark: 70 },
    { name: 'Leadership & Gov.', score: 79, benchmark: 72 },
    { name: 'Domain Knowledge', score: 88, benchmark: 80 },
    { name: 'Digital Tools', score: 86, benchmark: 78 }
  ];

  const categoryDistribution = [
    { name: 'AI & Data Science', value: 38, color: '#3b82f6' },
    { name: 'Leadership & Gov.', value: 24, color: '#10b981' },
    { name: 'Cybersecurity', value: 20, color: '#8b5cf6' },
    { name: 'Cloud Computing', value: 18, color: '#f59e0b' }
  ];

  const monthlyEnrollmentTrend = [
    { month: 'Jan', enrollments: 120, certifications: 85 },
    { month: 'Feb', enrollments: 190, certifications: 140 },
    { month: 'Mar', enrollments: 240, certifications: 180 },
    { month: 'Apr', enrollments: 310, certifications: 245 },
    { month: 'May', enrollments: 420, certifications: 340 },
    { month: 'Jun', enrollments: 510, certifications: 420 }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold uppercase tracking-wider mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          Macro Analytical Intelligence
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          National Capacity & Competency Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Aggregated multidimensional analytics evaluating national digital capacity growth across all participating cadres.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Certified Competency Index
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">84.2%</span>
            <span className="text-xs font-bold text-emerald-600">+6.4% YoY</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Course Completion Velocity
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">88.5%</span>
            <span className="text-xs font-bold text-emerald-600">Top Quartile</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Faculty Satisfaction Avg
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">4.88 ★</span>
            <span className="text-xs font-bold text-slate-500">Across Portal</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Validated Certs
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{analytics.totalCertificatesIssued}</span>
            <span className="text-xs font-bold text-purple-600">Accredited</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Competency Pillar Benchmarking */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">5 Core Competency Pillar Benchmarks</h3>
              <p className="text-xs text-slate-500 mt-0.5">National Average vs Required Baseline Benchmark</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[50, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Actual Index (%)" />
                <Bar dataKey="benchmark" fill="#cbd5e1" radius={[6, 6, 0, 0]} name="Baseline (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend Area Chart */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Monthly Enrollment & Certification Flow</h3>
              <p className="text-xs text-slate-500 mt-0.5">Cadre learning momentum over H1 2026</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEnrollmentTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEnr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCert" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="enrollments" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEnr)" name="Enrollments" />
                <Area type="monotone" dataKey="certifications" stroke="#10b981" fillOpacity={1} fill="url(#colorCert)" name="Certifications" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Domain Category Distribution Pie */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
        <h3 className="font-bold text-slate-900 text-base mb-6">Cadre Domain Distribution</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {categoryDistribution.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="font-bold text-slate-900 text-xs">{cat.name}</span>
                </div>
                <span className="text-xs font-black text-slate-700">{cat.value}% Capacity</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
