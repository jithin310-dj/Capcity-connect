import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Star, MessageSquare, Award, ThumbsUp, CheckCircle2 } from 'lucide-react';

export const TrainerFeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const trainerId = user?._id || 'u-trainer-1';

  const feedbacks = storageService.getFeedbacks().filter((f) => f.trainerId === trainerId);

  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((acc, f) => acc + f.overallRating, 0) / feedbacks.length).toFixed(1)
      : '4.9';

  const avgCourseQuality =
    feedbacks.length > 0
      ? (feedbacks.reduce((acc, f) => acc + f.courseQuality, 0) / feedbacks.length).toFixed(1)
      : '4.8';

  const avgTrainerQuality =
    feedbacks.length > 0
      ? (feedbacks.reduce((acc, f) => acc + f.trainerQuality, 0) / feedbacks.length).toFixed(1)
      : '5.0';

  const avgMaterialQuality =
    feedbacks.length > 0
      ? (feedbacks.reduce((acc, f) => acc + f.materialQuality, 0) / feedbacks.length).toFixed(1)
      : '4.7';

  const avgAssessmentQuality =
    feedbacks.length > 0
      ? (feedbacks.reduce((acc, f) => acc + f.assessmentQuality, 0) / feedbacks.length).toFixed(1)
      : '4.9';

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 text-xs font-bold uppercase tracking-wider mb-2">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          Quality & Accreditation
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Learner Feedback & Faculty Ratings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Peer-reviewed evaluations submitted by verified officers upon course completion.
        </p>
      </div>

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Big Overall Rating Card */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-amber-100 uppercase tracking-widest block mb-2 font-mono">
              Overall Faculty Rating
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black font-mono">{avgRating}</span>
              <span className="text-xl font-bold text-amber-100">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-white text-white" />
              ))}
            </div>
          </div>
          <p className="text-xs text-amber-100 mt-4">
            Based on {feedbacks.length} certified course feedback submissions.
          </p>
        </div>

        {/* 4 Dimension Pillars */}
        <div className="lg:col-span-2 bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs grid grid-cols-1 sm:grid-cols-2 gap-4 transition-colors">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Course Content
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{avgCourseQuality} ★</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Excellent</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Instruction Clarity
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{avgTrainerQuality} ★</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Outstanding</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Materials & Decks
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{avgMaterialQuality} ★</span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">High Quality</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Assessment Rigor
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{avgAssessmentQuality} ★</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Standardized</span>
            </div>
          </div>
        </div>

      </div>

      {/* Feedback Reviews List */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xs transition-colors">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Trainee Reviews</h3>

        <div className="space-y-4">
          {feedbacks.map((f) => (
            <div
              key={f._id}
              className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B0F19]/50 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={f.traineeAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                    alt={f.traineeName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{f.traineeName}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Course: {f.courseTitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 px-2.5 py-1 rounded-xl">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-black text-amber-800 dark:text-amber-300 font-mono">{f.overallRating}.0</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic bg-white dark:bg-[#151B28] p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                "{f.comments}"
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                <span className="font-mono">Submitted: {new Date(f.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Verified Course Participant
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

