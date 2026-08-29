import React, { useState, useEffect } from 'react';
import { competencyService } from '../../services/competencyService';
import { storageService } from '../../services/storageService';
import { CompetencyMatchResult, User } from '../../types';
import { 
  Compass, Target, Search, Filter, Star, Briefcase, 
  GraduationCap, Award, MessageSquare, BookOpen, CheckCircle2, ChevronRight, Zap
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface TraineeTrainerMatchingPageProps {
  initialQuery?: string;
  onNavigate: (view: string, payload?: any) => void;
}

export const TraineeTrainerMatchingPage: React.FC<TraineeTrainerMatchingPageProps> = ({ initialQuery, onNavigate }) => {
  const { showToast } = useToast();

  const [requiredSubject, setRequiredSubject] = useState(initialQuery || 'Machine Learning & Python');
  const [skillsInput, setSkillsInput] = useState(
    initialQuery && initialQuery.includes(',') 
      ? initialQuery 
      : 'Python, Machine Learning, Deep Learning, Data Analysis'
  );
  const [minExperience, setMinExperience] = useState(5);
  const [minQualification, setMinQualification] = useState('Any');

  const [matchResults, setMatchResults] = useState<CompetencyMatchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const runMatchEngine = (subjectVal = requiredSubject, skillsVal = skillsInput, expVal = minExperience, qualVal = minQualification) => {
    const skills = skillsVal
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const results = competencyService.matchTrainers({
      requiredSubject: subjectVal,
      requiredSkills: skills,
      minimumExperienceYears: Number(expVal),
      minimumQualification: qualVal
    });

    setMatchResults(results);
    setHasSearched(true);
  };

  useEffect(() => {
    if (initialQuery) {
      setRequiredSubject(initialQuery);
      if (initialQuery.includes(',')) {
        setSkillsInput(initialQuery);
      }
      runMatchEngine(initialQuery, initialQuery.includes(',') ? initialQuery : skillsInput, minExperience, minQualification);
    } else {
      runMatchEngine();
    }
  }, [initialQuery]);

  const presetScenarios = [
    {
      title: 'AI & Data Science Expert',
      subject: 'Machine Learning & Data Science',
      skills: 'Python, Machine Learning, Deep Learning, NLP, Data Visualization',
      exp: 6,
      qual: 'Ph.D.'
    },
    {
      title: 'Cybersecurity & Defence Trainer',
      subject: 'Cybersecurity & Information Assurance',
      skills: 'Ethical Hacking, Network Security, Incident Response, ISO 27001',
      exp: 8,
      qual: 'M.Tech'
    },
    {
      title: 'Leadership & Public Governance',
      subject: 'Strategic Leadership & Governance',
      skills: 'Public Administration, Agile Leadership, DPDP Compliance, Crisis Management',
      exp: 10,
      qual: 'Any'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 text-xs font-bold uppercase tracking-wider mb-2">
          <Target className="w-3.5 h-3.5 shrink-0" />
          <span>Core SIH 2026 Algorithmic Innovation</span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Compass className="w-7 h-7 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>Competency Mapping & Trainer Discovery Engine</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Transparent multi-criteria matching algorithm evaluating candidate faculty based on validated skills (40%), qualifications (20%), field experience (20%), domain subject intersection (15%), and institutional ratings (5%).
        </p>
      </div>

      {/* Preset Query Scenarios for Judges & Trainees */}
      <div className="bg-slate-900 dark:bg-[#0B0F19] text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest block">
            1-Click Institutional Training Scenarios (SIH Evaluation Presets)
          </span>
          <span className="text-[10px] text-indigo-400 font-mono hidden sm:inline">Instant Multi-Factor Match</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {presetScenarios.map((sc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setRequiredSubject(sc.subject);
                setSkillsInput(sc.skills);
                setMinExperience(sc.exp);
                setMinQualification(sc.qual);
                runMatchEngine(sc.subject, sc.skills, sc.exp, sc.qual);
                showToast(`Loaded scenario: ${sc.title}`, 'info');
              }}
              className="p-3.5 rounded-2xl bg-slate-800/80 dark:bg-[#151B28] hover:bg-indigo-900/60 dark:hover:bg-indigo-950/60 border border-slate-700 dark:border-slate-800 hover:border-indigo-500 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-indigo-300 group-hover:text-white">{sc.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400 truncate">{sc.skills}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Matching Criteria Input Box */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs space-y-4 transition-colors">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Define Institutional Training Requirement</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Required Subject / Domain</label>
            <input
              type="text"
              value={requiredSubject || ''}
              onChange={(e) => setRequiredSubject(e.target.value)}
              placeholder="e.g. Machine Learning"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0F172A] focus:outline-hidden focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Required Skills (Comma separated)</label>
            <input
              type="text"
              value={skillsInput || ''}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Python, NLP, PyTorch"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0F172A] focus:outline-hidden focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Minimum Years Experience</label>
            <input
              type="number"
              min="1"
              max="40"
              value={minExperience ?? 1}
              onChange={(e) => setMinExperience(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0F172A] focus:outline-hidden focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Minimum Qualification</label>
            <select
              value={minQualification || 'Any'}
              onChange={(e) => setMinQualification(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0F172A] focus:outline-hidden focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="Any">Any Level</option>
              <option value="Ph.D.">Doctorate / Ph.D.</option>
              <option value="M.Tech">Postgraduate (M.Tech / MBA / M.S.)</option>
              <option value="B.Tech">Graduate (B.Tech / B.E.)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => runMatchEngine()}
            className="min-h-[44px] px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span>Execute Competency Algorithm</span>
          </button>
        </div>
      </div>

      {/* Results List */}
      {hasSearched && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Matched Trainers Ranked by Suitability Index ({matchResults.length})
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Sorted by Total Score</span>
          </div>

          <div className="space-y-6">
            {matchResults.map((result, idx) => {
              const { trainer, totalScore, breakdown, matchReasons, recommendation } = result;

              const badgeColor = {
                'Highly Suitable': 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60',
                'Suitable': 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700/60',
                'Moderate Match': 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60',
                'Basic Match': 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }[recommendation] || 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';

              return (
                <div
                  key={trainer._id}
                  className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row gap-6 items-start justify-between"
                >
                  {/* Left: Trainer Profile */}
                  <div className="flex-1 min-w-0 w-full lg:w-auto">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={trainer.avatar}
                        alt={trainer.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-xs shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate">{trainer.name}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wide border ${badgeColor}`}>
                            {recommendation}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{trainer.designation} • {trainer.organization}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{trainer.department}</p>
                      </div>
                    </div>

                    {trainer.bio && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{trainer.bio}</p>
                    )}

                    {/* Reasons list */}
                    <div className="bg-slate-50 dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 mb-4">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                        Algorithmic Match Justifications:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {matchReasons.map((reason, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Trainer Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {trainer.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 text-xs font-semibold border border-indigo-100 dark:border-indigo-800/40"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Transparent Multi-Factor Score Breakdown */}
                  <div className="w-full lg:w-72 bg-slate-900 dark:bg-[#0B0F19] text-white rounded-2xl p-5 shrink-0 flex flex-col justify-between border border-slate-800">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Overall Match Score
                          </span>
                          <span className="text-3xl font-black text-emerald-400">{totalScore}%</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-bold text-indigo-300">Rank #{idx + 1}</span>
                          <span className="block text-[10px] text-slate-400">of {matchResults.length} Faculty</span>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-xs text-slate-300 mb-6">
                        <div className="flex justify-between">
                          <span>Skill Match (40%):</span>
                          <strong className="text-white font-mono">{breakdown.skillMatch} / 40</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Qualification (20%):</span>
                          <strong className="text-white font-mono">{breakdown.qualificationMatch} / 20</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Experience (20%):</span>
                          <strong className="text-white font-mono">{breakdown.experienceMatch} / 20</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Subject Fit (15%):</span>
                          <strong className="text-white font-mono">{breakdown.subjectMatch} / 15</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Rating Track (5%):</span>
                          <strong className="text-white font-mono">{breakdown.ratingMatch} / 5</strong>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => onNavigate('trainee-messages', { targetUserId: trainer._id })}
                        className="w-full min-h-[40px] py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span>Direct Message Trainer</span>
                      </button>
                      <button
                        onClick={() => onNavigate('courses-explore', { trainerName: trainer.name })}
                        className="w-full min-h-[40px] py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 shrink-0" />
                        <span>View Authored Courses</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
