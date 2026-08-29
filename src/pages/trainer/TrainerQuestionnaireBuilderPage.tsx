import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storageService } from '../../services/storageService';
import { assessmentService } from '../../services/assessmentService';
import { Assessment, Question } from '../../types';
import { 
  FileQuestion, Plus, Trash2, CheckCircle2, Save, 
  ArrowLeft, Award, HelpCircle, Check 
} from 'lucide-react';

interface TrainerQuestionnaireBuilderPageProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const TrainerQuestionnaireBuilderPage: React.FC<TrainerQuestionnaireBuilderPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const trainerId = user?._id || 'u-trainer-1';

  const myCourses = storageService.getCourses().filter((c) => c.trainerId === trainerId);
  const [selectedCourseId, setSelectedCourseId] = useState(myCourses[0]?._id || '');

  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [passingPercentage, setPassingPercentage] = useState(70);

  const [questions, setQuestions] = useState<Question[]>([
    {
      question: 'Which of the following is a primary supervised machine learning paradigm?',
      options: [
        'K-Means Clustering',
        'Linear Regression',
        'Apriori Association Mining',
        'Principal Component Analysis'
      ],
      correctAnswer: 1,
      explanation: 'Linear Regression predicts a continuous numeric target from labeled training samples (Supervised Learning).',
      marks: 1
    },
    {
      question: 'What metric evaluates classification models with class imbalance accurately?',
      options: [
        'Raw Accuracy',
        'F1-Score and Precision-Recall AUC',
        'Mean Squared Error',
        'Adjusted R-squared'
      ],
      correctAnswer: 1,
      explanation: 'F1-score computes the harmonic mean of precision and recall, balancing false positives and false negatives.',
      marks: 1
    }
  ]);

  useEffect(() => {
    if (selectedCourseId) {
      const course = myCourses.find((c) => c._id === selectedCourseId);
      if (course) {
        setTitle(`${course.title} - Final Competency Certification Assessment`);
        const existingAss = storageService.getAssessments().find((a) => a.courseId === selectedCourseId);
        if (existingAss) {
          setTitle(existingAss.title);
          setDurationMinutes(existingAss.durationMinutes);
          setPassingPercentage(existingAss.passingPercentage);
          setQuestions(existingAss.questions);
        }
      }
    }
  }, [selectedCourseId]);

  const handleAddQuestion = () => {
    const newQ: Question = {
      id: `q-${Date.now()}`,
      question: `Question ${questions.length + 1}: Enter your technical question prompt here...`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: 'Explanation of why this choice is technically accurate.',
      marks: 1
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleUpdateQuestion = (idx: number, updates: Partial<Question>) => {
    const next = [...questions];
    next[idx] = { ...next[idx], ...updates };
    setQuestions(next);
  };

  const handleUpdateOption = (qIdx: number, optIdx: number, val: string) => {
    const next = [...questions];
    const opts = [...next[qIdx].options];
    opts[optIdx] = val;
    next[qIdx].options = opts;
    setQuestions(next);
  };

  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !user) {
      showToast('Please select a course first', 'warning');
      return;
    }

    const course = myCourses.find((c) => c._id === selectedCourseId);
    if (!course) return;

    assessmentService.createAssessment({
      courseId: course._id,
      courseTitle: course.title,
      trainerId: user._id,
      trainerName: user.name,
      title,
      questions,
      durationMinutes: Number(durationMinutes),
      passingPercentage: Number(passingPercentage)
    });

    showToast('MCQ Competency Assessment saved and linked to course successfully!', 'success');
    onNavigate('trainer-dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('trainer-dashboard')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Interactive Questionnaire & Assessment Builder
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Create structured MCQ examination suites for verifiable trainee certification.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveAssessment}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Assessment</span>
        </button>
      </div>

      {/* Meta Configuration Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Assessment Parameters</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-hidden focus:border-emerald-500"
            >
              {myCourses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Assessment Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:bg-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Duration (Minutes)</label>
            <input
              type="number"
              min="5"
              max="180"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Passing Threshold (%)</label>
            <input
              type="number"
              min="40"
              max="100"
              value={passingPercentage}
              onChange={(e) => setPassingPercentage(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Questions Count</label>
            <div className="px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
              {questions.length} Questions Configured
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Questions Suite</h3>
          
          <button
            type="button"
            onClick={handleAddQuestion}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add MCQ Question</span>
          </button>
        </div>

        {questions.map((q, qIdx) => (
          <div
            key={qIdx}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-black text-emerald-700 uppercase bg-emerald-50 px-2.5 py-1 rounded-xl">
                Question {qIdx + 1}
              </span>

              <button
                type="button"
                onClick={() => handleRemoveQuestion(qIdx)}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl"
                title="Remove Question"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Question Prompt *</label>
              <textarea
                rows={2}
                value={q.question}
                onChange={(e) => handleUpdateQuestion(qIdx, { question: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:bg-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Multiple Choice Options (Select radio to designate Correct Answer):
              </label>

              {q.options.map((opt, optIdx) => {
                const isCorrect = q.correctAnswer === optIdx;

                return (
                  <div
                    key={optIdx}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                      isCorrect ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      checked={isCorrect}
                      onChange={() => handleUpdateQuestion(qIdx, { correctAnswer: optIdx })}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />

                    <span className="text-xs font-bold font-mono text-slate-500">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>

                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-emerald-500"
                    />

                    {isCorrect && (
                      <span className="text-[10px] uppercase font-bold text-emerald-700 flex items-center gap-1 shrink-0">
                        <Check className="w-3.5 h-3.5" /> Correct Answer
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Explanation & Justification Note</label>
              <input
                type="text"
                value={q.explanation || ''}
                onChange={(e) => handleUpdateQuestion(qIdx, { explanation: e.target.value })}
                placeholder="Why is this answer correct? Displayed to trainees after test completion."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
