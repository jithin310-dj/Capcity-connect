import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { analyticsService } from '../../services/analyticsService';
import { storageService } from '../../services/storageService';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip 
} from 'recharts';
import { 
  Compass, Award, BookOpen, ArrowRight, ShieldCheck, 
  CheckCircle2, Target, TrendingUp, AlertCircle, Users, ExternalLink, Zap
} from 'lucide-react';

interface TraineeCompetenciesPageProps {
  onNavigate: (view: string, payload?: any) => void;
}

interface TargetRoleProfile {
  id: string;
  title: string;
  description: string;
  category: string;
  benchmarks: {
    technical: number;
    communication: number;
    leadership: number;
    domain: number;
    digital: number;
    problemSolving: number;
  };
  recommendedSkills: string[];
}

const TARGET_ROLE_PROFILES: TargetRoleProfile[] = [
  {
    id: 'ai-architect',
    title: 'Senior AI & Machine Learning Specialist',
    description: 'Leads institutional AI adoption, LLM architectures, predictive modeling pipelines, and deep neural solutions.',
    category: 'Data Science & AI',
    benchmarks: {
      technical: 92,
      communication: 80,
      leadership: 75,
      domain: 85,
      digital: 90,
      problemSolving: 95
    },
    recommendedSkills: ['Python 3.12', 'PyTorch', 'Generative AI Architecture', 'MLOps & Deployment', 'Vector Databases']
  },
  {
    id: 'digital-transform-lead',
    title: 'Digital Transformation & Capacity Lead',
    description: 'Orchestrates large-scale digital modernization, e-Governance systems, and cross-cadre capacity building.',
    category: 'Public Administration',
    benchmarks: {
      technical: 72,
      communication: 92,
      leadership: 94,
      domain: 95,
      digital: 88,
      problemSolving: 88
    },
    recommendedSkills: ['Digital Governance Frameworks', 'DPDP Act Compliance', 'Change Management', 'Agile Governance', 'Stakeholder Alignment']
  },
  {
    id: 'cyber-defence-officer',
    title: 'Cybersecurity & Critical Infrastructure Officer',
    description: 'Guards national digital assets, enforces zero-trust architecture, incident response, and ISO 27001 posture.',
    category: 'Cybersecurity',
    benchmarks: {
      technical: 90,
      communication: 78,
      leadership: 80,
      domain: 90,
      digital: 96,
      problemSolving: 92
    },
    recommendedSkills: ['Zero Trust Security', 'Threat Hunting', 'Incident Response Plan', 'ISO 27001 Audit', 'Cryptographic Standards']
  },
  {
    id: 'cloud-devops-lead',
    title: 'Cloud Native & DevOps Enterprise Architect',
    description: 'Designs resilient multi-cloud infrastructures, CI/CD automation, Kubernetes clusters, and microservices.',
    category: 'Cloud Computing',
    benchmarks: {
      technical: 95,
      communication: 82,
      leadership: 78,
      domain: 82,
      digital: 94,
      problemSolving: 90
    },
    recommendedSkills: ['Kubernetes Orchestration', 'Terraform & IaC', 'Cloud Security Posture', 'Prometheus & Grafana', 'Microservices Mesh']
  },
  {
    id: 'program-director',
    title: 'Strategic Public Sector Project Director',
    description: 'Manages national mission programs, strategic budget allocation, multi-agency alignment, and public impact KPIs.',
    category: 'Leadership & Management',
    benchmarks: {
      technical: 65,
      communication: 95,
      leadership: 96,
      domain: 92,
      digital: 80,
      problemSolving: 90
    },
    recommendedSkills: ['National Mission Delivery', 'Risk Mitigation & Audits', 'Inter-Agency Coordination', 'Executive Reporting', 'Capacity Scaling']
  }
];

export const TraineeCompetenciesPage: React.FC<TraineeCompetenciesPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const userId = user?._id || 'u-trainee-1';

  const analytics = analyticsService.getTraineeAnalytics(userId);
  const enrollments = storageService.getEnrollments().filter((e) => e.traineeId === userId);
  const results = storageService.getResults().filter((r) => r.traineeId === userId);

  const [selectedRoleId, setSelectedRoleId] = useState<string>(TARGET_ROLE_PROFILES[0].id);

  const activeTargetRole = TARGET_ROLE_PROFILES.find((r) => r.id === selectedRoleId) || TARGET_ROLE_PROFILES[0];

  // Current trainee competency scores
  const technicalScore = analytics.competencyPillars[0]?.score || 76;
  const communicationScore = analytics.competencyPillars[1]?.score || 75;
  const leadershipScore = analytics.competencyPillars[2]?.score || 85;
  const domainScore = analytics.competencyPillars[3]?.score || 93;
  const digitalScore = analytics.competencyPillars[4]?.score || 88;
  const problemSolvingScore = 84; // Derived Analytical Problem Solving Pillar

  // Formatted data specifically for Recharts Spider/Radar Chart
  const radarChartData = [
    {
      subject: 'Technical & Eng.',
      current: technicalScore,
      target: activeTargetRole.benchmarks.technical,
      fullMark: 100,
      gap: technicalScore - activeTargetRole.benchmarks.technical
    },
    {
      subject: 'Communication',
      current: communicationScore,
      target: activeTargetRole.benchmarks.communication,
      fullMark: 100,
      gap: communicationScore - activeTargetRole.benchmarks.communication
    },
    {
      subject: 'Leadership',
      current: leadershipScore,
      target: activeTargetRole.benchmarks.leadership,
      fullMark: 100,
      gap: leadershipScore - activeTargetRole.benchmarks.leadership
    },
    {
      subject: 'Domain & Sector',
      current: domainScore,
      target: activeTargetRole.benchmarks.domain,
      fullMark: 100,
      gap: domainScore - activeTargetRole.benchmarks.domain
    },
    {
      subject: 'Digital Tools',
      current: digitalScore,
      target: activeTargetRole.benchmarks.digital,
      fullMark: 100,
      gap: digitalScore - activeTargetRole.benchmarks.digital
    },
    {
      subject: 'Problem Solving',
      current: problemSolvingScore,
      target: activeTargetRole.benchmarks.problemSolving,
      fullMark: 100,
      gap: problemSolvingScore - activeTargetRole.benchmarks.problemSolving
    }
  ];

  // Calculate overall alignment readiness index
  const averageCurrent = Math.round(
    (technicalScore + communicationScore + leadershipScore + domainScore + digitalScore + problemSolvingScore) / 6
  );
  const averageTarget = Math.round(
    (activeTargetRole.benchmarks.technical +
      activeTargetRole.benchmarks.communication +
      activeTargetRole.benchmarks.leadership +
      activeTargetRole.benchmarks.domain +
      activeTargetRole.benchmarks.digital +
      activeTargetRole.benchmarks.problemSolving) / 6
  );
  const readinessIndex = Math.min(100, Math.round((averageCurrent / averageTarget) * 100));

  const competencyBreakdown = [
    {
      name: 'Technical & Engineering Skills',
      score: technicalScore,
      targetScore: activeTargetRole.benchmarks.technical,
      level: technicalScore >= 85 ? 'Expert' : technicalScore >= 70 ? 'Proficient' : 'Developing',
      skills: ['Python 3.12', 'Machine Learning', 'API Development', 'Data Structures'],
      recommendation: 'Next step: Advanced Deep Learning & Generative AI Architecture.',
      searchQuery: 'Python, Machine Learning, Deep Learning'
    },
    {
      name: 'Communication & Collaboration',
      score: communicationScore,
      targetScore: activeTargetRole.benchmarks.communication,
      level: communicationScore >= 85 ? 'Expert' : communicationScore >= 70 ? 'Proficient' : 'Developing',
      skills: ['Stakeholder Management', 'Technical Documentation', 'Executive Presentations'],
      recommendation: 'Next step: Cross-Departmental Leadership & Crisis Communications.',
      searchQuery: 'Executive Communication, Stakeholder Management'
    },
    {
      name: 'Leadership & Project Governance',
      score: leadershipScore,
      targetScore: activeTargetRole.benchmarks.leadership,
      level: leadershipScore >= 85 ? 'Expert' : leadershipScore >= 70 ? 'Proficient' : 'Developing',
      skills: ['Agile Project Delivery', 'Risk Management', 'Resource Allocation'],
      recommendation: 'Next step: Public Sector Digital Transformation Strategy.',
      searchQuery: 'Agile Leadership, Project Governance, Risk Management'
    },
    {
      name: 'Domain & Sectoral Knowledge',
      score: domainScore,
      targetScore: activeTargetRole.benchmarks.domain,
      level: domainScore >= 85 ? 'Expert' : domainScore >= 70 ? 'Proficient' : 'Developing',
      skills: ['Data Governance Frameworks', 'DPDP Compliance', 'Interoperability Standards'],
      recommendation: 'Benchmark leader across public sector capacity framework.',
      searchQuery: 'DPDP Compliance, Data Governance, Public Administration'
    },
    {
      name: 'Digital Literacy & Modern Tools',
      score: digitalScore,
      targetScore: activeTargetRole.benchmarks.digital,
      level: digitalScore >= 85 ? 'Expert' : digitalScore >= 70 ? 'Proficient' : 'Developing',
      skills: ['Cloud Native Tools', 'DevOps Fundamentals', 'Cyber Hygiene'],
      recommendation: 'Explore hands-on cloud labs in the Trainer Library.',
      searchQuery: 'Cloud Computing, DevOps, Cyber Hygiene'
    }
  ];

  // Custom Radar Tooltip
  const CustomRadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const gap = data.current - data.target;
      return (
        <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white p-3.5 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-md text-xs min-w-[200px]">
          <p className="font-bold text-sm text-indigo-300 mb-1.5">{data.subject}</p>
          <div className="space-y-1 font-mono">
            <div className="flex justify-between items-center text-cyan-300">
              <span>Current Capability:</span>
              <span className="font-bold">{data.current}%</span>
            </div>
            <div className="flex justify-between items-center text-amber-300">
              <span>Target Role Required:</span>
              <span className="font-bold">{data.target}%</span>
            </div>
            <div className="pt-1.5 mt-1.5 border-t border-slate-800 flex justify-between items-center font-bold">
              <span>Competency Delta:</span>
              <span className={gap >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {gap >= 0 ? `+${gap}% (Exceeds)` : `${gap}% (Gap)`}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Target className="w-3.5 h-3.5 shrink-0" />
            <span>Multi-Axis Competency Mapping • SIH 2026</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>My Institutional Competency Matrix</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Interactive multi-axial radar benchmarking your acquired skill set against national role requirements and capacity frameworks.
          </p>
        </div>

        <button
          onClick={() => onNavigate('trainee-trainer-matching')}
          className="min-h-[44px] px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
        >
          <Target className="w-4 h-4 shrink-0" />
          <span>Find Matching Trainers for Gap Areas</span>
        </button>
      </div>

      {/* Overall Score Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-900 dark:from-indigo-950 dark:via-slate-950 dark:to-blue-950 rounded-3xl p-5 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-800/40">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2 border border-indigo-400/30">
            Validated Competency Profile
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">Overall Capability Index: {analytics.overallCompetencyScore}%</h2>
          <p className="text-xs sm:text-sm text-slate-200 dark:text-slate-300 mt-2 leading-relaxed">
            Your capability index is computed dynamically from {enrollments.length} enrolled tracks, {results.length} verified assessments, and continuous evaluation milestones.
          </p>
        </div>

        <div className="w-32 h-32 rounded-3xl bg-white/10 dark:bg-white/5 border-2 border-indigo-400/40 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center shrink-0 shadow-inner">
          <span className="text-3xl font-black text-white">{analytics.overallCompetencyScore}%</span>
          <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider mt-0.5">Proficient</span>
        </div>
      </div>

      {/* Spider Chart (Radar Chart) Section with Target Job Role Selector */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors">
        
        {/* Top Controls: Role Selection & Readiness Indicator */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Target Role Competency Spider Chart
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a benchmark institutional job profile to visualize capability matches, skill surpluses, and target delta gaps.
            </p>
          </div>

          {/* Job Role Dropdown Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              Benchmark Role:
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="min-h-[44px] px-3.5 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
            >
              {TARGET_ROLE_PROFILES.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title} ({role.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Spider Chart + Gap Analytics Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Recharts Spider / Radar Chart (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[340px] sm:min-h-[400px] w-full bg-slate-50/50 dark:bg-[#0B0F19]/40 rounded-3xl p-4 border border-slate-100 dark:border-slate-800/80">
            <div className="w-full h-[320px] sm:h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData}>
                  <PolarGrid stroke={isDark ? '#334155' : '#CBD5E1'} strokeDasharray="3 3" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: isDark ? '#94A3B8' : '#475569', fontSize: 11, fontWeight: 600 }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: isDark ? '#64748B' : '#94A3B8', fontSize: 9 }}
                  />
                  <Tooltip content={<CustomRadarTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                    formatter={(value) => (
                      <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                        {value === 'current' ? 'My Current Skill Set' : `Target Requirements (${activeTargetRole.title})`}
                      </span>
                    )}
                  />
                  <Radar
                    name="current"
                    dataKey="current"
                    stroke="#06B6D4"
                    fill="#06B6D4"
                    fillOpacity={isDark ? 0.35 : 0.28}
                    strokeWidth={2.5}
                  />
                  <Radar
                    name="target"
                    dataKey="target"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={isDark ? 0.25 : 0.18}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-1 text-center">
              Hover over vertex points on the spider chart to inspect detailed capability delta percentages.
            </span>
          </div>

          {/* Right Column: Role Benchmark & Gap Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Role Header Card */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/40">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  Target Profile
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-200/70 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200">
                  {activeTargetRole.category}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                {activeTargetRole.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {activeTargetRole.description}
              </p>
            </div>

            {/* Role Readiness Match Index */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Role Readiness Match
                </span>
                <span className={`text-sm font-black font-mono ${
                  readinessIndex >= 90 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : readinessIndex >= 75 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {readinessIndex}% Readiness
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    readinessIndex >= 90 
                      ? 'bg-emerald-500' 
                      : readinessIndex >= 75 
                      ? 'bg-indigo-600' 
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${readinessIndex}%` }}
                />
              </div>

              {/* Dimension Gaps Quick List */}
              <div className="space-y-1.5 text-xs font-mono">
                {radarChartData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                    <span className="text-slate-600 dark:text-slate-400 text-[11px] truncate max-w-[140px]">
                      {d.subject}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 dark:text-slate-500 text-[11px]">
                        {d.current}% / {d.target}%
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        d.gap >= 0 
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' 
                          : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                      }`}>
                        {d.gap >= 0 ? `+${d.gap}%` : `${d.gap}%`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Action to close gap with Trainer Matching */}
            <button
              onClick={() => onNavigate('trainee-trainer-matching', { initialQuery: activeTargetRole.recommendedSkills.slice(0, 3).join(', ') })}
              className="w-full min-h-[44px] py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 shrink-0" />
              <span>Bridge Skill Gaps: Find Targeted Trainers</span>
            </button>

          </div>

        </div>

      </div>

      {/* 5 Pillars Breakdown Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Detailed Pillar Evaluation & Acquired Badges
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            5 Validated Institutional Dimensions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {competencyBreakdown.map((item, idx) => {
            const gap = item.score - item.targetScore;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-xl border border-indigo-100 dark:border-indigo-800/40">
                      {item.score}% Score
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{item.level}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        gap >= 0 
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' 
                          : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                      }`}>
                        {gap >= 0 ? `+${gap}% Target` : `${gap}% Target`}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mb-2">{item.name}</h4>

                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full" style={{ width: `${item.score}%` }} />
                  </div>

                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Acquired Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">💡 {item.recommendation}</p>
                  <button
                    onClick={() => onNavigate('trainee-trainer-matching', { initialQuery: item.searchQuery })}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <span>Match Faculty for {item.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
