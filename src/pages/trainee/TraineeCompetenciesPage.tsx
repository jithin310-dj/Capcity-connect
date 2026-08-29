import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/analyticsService';
import { storageService } from '../../services/storageService';
import { Compass, Sparkles, Award, BookOpen, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TraineeCompetenciesPageProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const TraineeCompetenciesPage: React.FC<TraineeCompetenciesPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const userId = user?._id || 'u-trainee-1';

  const analytics = analyticsService.getTraineeAnalytics(userId);
  const enrollments = storageService.getEnrollments().filter((e) => e.traineeId === userId);
  const results = storageService.getResults().filter((r) => r.traineeId === userId);

  const competencyBreakdown = [
    {
      name: 'Technical & Engineering Skills',
      score: analytics.competencyPillars[0]?.score || 85,
      level: 'Proficient',
      skills: ['Python 3.12', 'Machine Learning', 'API Development', 'Data Structures'],
      coursesCompleted: 2,
      recommendation: 'Next step: Advanced Deep Learning & Generative AI Architecture.'
    },
    {
      name: 'Communication & Collaboration',
      score: analytics.competencyPillars[1]?.score || 80,
      level: 'Advanced',
      skills: ['Stakeholder Management', 'Technical Documentation', 'Executive Presentations'],
      coursesCompleted: 1,
      recommendation: 'Next step: Cross-Departmental Leadership & Crisis Communications.'
    },
    {
      name: 'Leadership & Project Governance',
      score: analytics.competencyPillars[2]?.score || 78,
      level: 'Proficient',
      skills: ['Agile Project Delivery', 'Risk Management', 'Resource Allocation'],
      coursesCompleted: 1,
      recommendation: 'Next step: Public Sector Digital Transformation Strategy.'
    },
    {
      name: 'Domain & Sectoral Knowledge',
      score: analytics.competencyPillars[3]?.score || 90,
      level: 'Expert',
      skills: ['Data Governance Frameworks', 'DPDP Compliance', 'Interoperability Standards'],
      coursesCompleted: 2,
      recommendation: 'Benchmark leader across public sector capacity framework.'
    },
    {
      name: 'Digital Literacy & Modern Tools',
      score: analytics.competencyPillars[4]?.score || 88,
      level: 'Advanced',
      skills: ['Cloud Native Tools', 'DevOps Fundamentals', 'Cyber Hygiene'],
      coursesCompleted: 1,
      recommendation: 'Explore hands-on cloud labs in the Trainer Library.'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-indigo-600" />
            <span>My Institutional Competency Matrix</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dynamic multidimensional evaluation tracking your skills against national capacity benchmarks.
          </p>
        </div>

        <button
          onClick={() => onNavigate('trainee-trainer-matching')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Find Matching Trainers for Gap Areas</span>
        </button>
      </div>

      {/* Overall Score Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2 border border-indigo-400/30">
            Validated Competency Profile
          </span>
          <h2 className="text-xl sm:text-2xl font-black">Overall Institutional Competency: {analytics.overallCompetencyScore}%</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Your capability index is computed dynamically from {enrollments.length} enrolled tracks, {results.length} verified assessments, and peer reviews.
          </p>
        </div>

        <div className="w-32 h-32 rounded-3xl bg-white/10 border-2 border-indigo-400/40 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center shrink-0 shadow-inner">
          <span className="text-3xl font-black text-white">{analytics.overallCompetencyScore}%</span>
          <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider mt-0.5">Proficient</span>
        </div>
      </div>

      {/* 5 Pillars Breakdown Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">5 Core Competency Dimensions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competencyBreakdown.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-100">
                    {item.score}% Score
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">{item.level}</span>
                </div>

                <h4 className="font-bold text-slate-900 text-base mb-2">{item.name}</h4>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${item.score}%` }} />
                </div>

                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Acquired Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                <p className="line-clamp-2 italic">💡 {item.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
