import React from 'react';
import { User } from '../../types';
import { Star, Briefcase, GraduationCap, MessageSquare, ArrowRight } from 'lucide-react';

interface TrainerCardProps {
  trainer: User;
  onViewProfile?: (trainerId: string) => void;
  onMessage?: (trainerId: string) => void;
  matchScore?: number;
}

export const TrainerCard: React.FC<TrainerCardProps> = ({ trainer, onViewProfile, onMessage, matchScore }) => {
  return (
    <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group text-slate-700 dark:text-slate-300">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2.5">
            <img
              src={trainer.avatar}
              alt={trainer.name}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-emerald-500/40"
            />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {trainer.name}
              </h3>
              <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 line-clamp-1">{trainer.designation}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{trainer.organization}</p>
            </div>
          </div>

          {matchScore !== undefined ? (
            <div className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 text-center font-mono">
              <span className="text-xs font-bold">{matchScore}%</span>
              <span className="block text-[8px] uppercase tracking-widest text-emerald-600 dark:text-emerald-500 font-bold">MATCH</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-[#0B0F19] text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500 dark:text-amber-400" />
              <span>{trainer.rating?.toFixed(2) || '4.85'}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {trainer.bio && (
          <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {trainer.bio}
          </p>
        )}

        {/* Highlights */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-600 dark:text-slate-400 mb-3 bg-slate-50 dark:bg-[#0B0F19] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 truncate">
            <Briefcase className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">{trainer.yearsOfExperience || 10}+ Yrs Exp</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <GraduationCap className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">{trainer.qualifications?.[0]?.degree || 'Ph.D. / Masters'}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-3">
          {trainer.skills?.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono border border-emerald-200 dark:border-emerald-500/20"
            >
              {skill}
            </span>
          ))}
          {(trainer.skills?.length || 0) > 4 && (
            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-mono">
              +{(trainer.skills?.length || 0) - 4}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        {onMessage && (
          <button
            onClick={() => onMessage(trainer._id)}
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-slate-100 dark:bg-[#0B0F19] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center cursor-pointer"
            title="Message Trainer"
            aria-label="Message Trainer"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        )}
        {onViewProfile && (
          <button
            onClick={() => onViewProfile(trainer._id)}
            className="flex-1 min-h-[44px] sm:min-h-[40px] py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white dark:text-slate-200 hover:text-white border border-slate-800 dark:border-slate-700 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <span>PROFILE_VIEW</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
