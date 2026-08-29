import React, { useState } from 'react';
import { feedbackService } from '../../services/feedbackService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Star, X, Send } from 'lucide-react';

interface FeedbackModalProps {
  courseId: string;
  courseTitle: string;
  trainerId: string;
  trainerName: string;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  courseId,
  courseTitle,
  trainerId,
  trainerName,
  onClose
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [overallRating, setOverallRating] = useState(5);
  const [courseQuality, setCourseQuality] = useState(5);
  const [trainerQuality, setTrainerQuality] = useState(5);
  const [materialQuality, setMaterialQuality] = useState(5);
  const [assessmentQuality, setAssessmentQuality] = useState(5);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const renderStars = (current: number, setRating: (val: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setRating(star)}
            className="p-1 text-slate-300 hover:text-amber-400 focus:outline-hidden transition-colors"
          >
            <Star
              className={`w-5 h-5 ${
                star <= current ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-bold text-slate-700 ml-2">{current}.0</span>
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    feedbackService.submitFeedback({
      courseId,
      courseTitle,
      trainerId,
      trainerName,
      traineeId: user._id,
      traineeName: user.name,
      traineeAvatar: user.avatar,
      overallRating,
      courseQuality,
      trainerQuality,
      materialQuality,
      assessmentQuality,
      comments: comments || 'Excellent learning track and structured curriculum!'
    });
    setIsSubmitting(false);

    showToast('Feedback submitted successfully! Thank you for your review.', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Course Evaluation
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">Course & Trainer Feedback</h3>
            <p className="text-xs text-slate-500 truncate max-w-xs">{courseTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60">
            <span className="text-xs font-bold text-slate-900">Overall Experience</span>
            {renderStars(overallRating, setOverallRating)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-700 block mb-1.5">Course Content Quality</span>
              {renderStars(courseQuality, setCourseQuality)}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-700 block mb-1.5">Trainer Instruction</span>
              {renderStars(trainerQuality, setTrainerQuality)}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-700 block mb-1.5">Learning Materials</span>
              {renderStars(materialQuality, setMaterialQuality)}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-700 block mb-1.5">Assessment Fairness</span>
              {renderStars(assessmentQuality, setAssessmentQuality)}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Review & Constructive Feedback (Optional)
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="What did you like most? How can this course or trainer improve?"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Review</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
