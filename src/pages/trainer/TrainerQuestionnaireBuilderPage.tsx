import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { storageService } from '../../services/storageService';
import { assessmentService } from '../../services/assessmentService';
import { soundUtility } from '../../utils/soundUtility';
import { Assessment, Question, Course } from '../../types';
import { 
  FileQuestion, Plus, Trash2, CheckCircle2, Save, 
  ArrowLeft, Award, HelpCircle, Check, Calendar, Clock, 
  Percent, Layers, BookOpen, Sparkles, AlertCircle
} from 'lucide-react';

interface TrainerQuestionnaireBuilderPageProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const TrainerQuestionnaireBuilderPage: React.FC<TrainerQuestionnaireBuilderPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const trainerId = user?._id || 'u-trainer-1';

  const myCourses: Course[] = storageService.getCourses().filter((c) => c.trainerId === trainerId || c.trainerId === 'usr-trainer-1' || c.trainerId === 'u-trainer-1');
  const allCourses: Course[] = storageService.getCourses();
  const availableCourses = myCourses.length > 0 ? myCourses : allCourses;

  const [selectedCourseId, setSelectedCourseId] = useState(availableCourses[0]?._id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('Standardized multiple-choice assessment measuring foundational and applied competencies.');
  const [subject, setSubject] = useState('Data Science & AI');
  const [moduleTitle, setModuleTitle] = useState('Final Comprehensive Module');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [passingPercentage, setPassingPercentage] = useState(70);
  const [deadline, setDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q-1',
      question: 'Which of the following is a primary supervised machine learning paradigm?',
      options: [
        'K-Means Clustering',
        'Linear Regression',
        'Apriori Association Mining',
        'Principal Component Analysis'
      ],
      correctAnswer: 1,
      explanation: 'Linear Regression predicts a continuous numeric target from labeled training samples (Supervised Learning).',
      marks: 2
    },
    {
      id: 'q-2',
      question: 'What metric evaluates classification models with class imbalance accurately?',
      options: [
        'Raw Accuracy',
        'F1-Score and Precision-Recall AUC',
        'Mean Squared Error',
        'Adjusted R-squared'
      ],
      correctAnswer: 1,
      explanation: 'F1-score computes the harmonic mean of precision and recall, balancing false positives and false negatives.',
      marks: 2
    },
    {
      id: 'q-3',
      question: 'Under standard cross-validation protocols, what is the purpose of holding out a validation set?',
      options: [
        'To speed up GPU compute clock rates',
        'To tune hyperparameters and prevent test-set data leakage',
        'To compress database indices',
        'To encrypt network sockets'
      ],
      correctAnswer: 1,
      explanation: 'Validation subsets allow tuning hyperparameters like regularization strength without leaking signal from final test evaluation.',
      marks: 2
    }
  ]);

  const [existingAssessmentId, setExistingAssessmentId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCourseId) {
      const course = availableCourses.find((c) => c._id === selectedCourseId);
      if (course) {
        setSubject(course.subject || course.category || 'General');
        const existingAss = storageService.getAssessments().find((a) => a.courseId === selectedCourseId);
        if (existingAss) {
          setExistingAssessmentId(existingAss._id);
          setTitle(existingAss.title || `${course.title} - Assessment`);
          setDescription(existingAss.description || 'Comprehensive evaluation.');
          setSubject(existingAss.subject || course.subject || 'General');
          setModuleTitle(existingAss.moduleTitle || 'Final Competency Module');
          setDurationMinutes(existingAss.durationMinutes || 30);
          setPassingPercentage(existingAss.passingPercentage || existingAss.passingScore || 70);
          if (existingAss.deadline) {
            setDeadline(existingAss.deadline.split('T')[0]);
          }
          if (existingAss.questions && existingAss.questions.length > 0) {
            setQuestions(existingAss.questions.map((q, idx) => ({
              ...q,
              id: q.id || `q-${idx + 1}`,
              question: q.question || '',
              options: Array.isArray(q.options) && q.options.length ? q.options.map(o => o || '') : ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
              explanation: q.explanation || '',
              marks: q.marks || 2
            })));
          }
        } else {
          setExistingAssessmentId(null);
          setTitle(`${course.title} - Final Competency Certification Assessment`);
        }
      }
    }
  }, [selectedCourseId]);

  // Computations
  const totalMarks = questions.reduce((acc, q) => acc + (q.marks || 1), 0);
  const passingMarks = Math.ceil((totalMarks * passingPercentage) / 100);

  const handleAddQuestion = () => {
    const newQ: Question = {
      id: `q-${Date.now()}`,
      question: `Question ${questions.length + 1}: Enter technical prompt...`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: 'Explanation for correct choice.',
      marks: 2
    };
    setQuestions([...questions, newQ]);
    soundUtility.playClick();
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) {
      showToast('Assessment must contain at least 1 question', 'warning');
      return;
    }
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
      showToast('Please select an associated course', 'warning');
      return;
    }

    const course = availableCourses.find((c) => c._id === selectedCourseId);
    if (!course) return;

    if (existingAssessmentId) {
      assessmentService.updateAssessment(existingAssessmentId, {
        title,
        description,
        subject,
        moduleTitle,
        questions,
        durationMinutes: Number(durationMinutes),
        passingPercentage: Number(passingPercentage),
        passingScore: Number(passingPercentage),
        totalMarks,
        passingMarks,
        deadline: new Date(deadline).toISOString()
      });
      showToast('MCQ Assessment updated successfully!', 'success');
    } else {
      assessmentService.createAssessment({
        courseId: course._id,
        courseTitle: course.title,
        trainerId: user._id,
        trainerName: user.name,
        title,
        description,
        subject,
        moduleTitle,
        questions,
        totalMarks,
        passingMarks,
        durationMinutes: Number(durationMinutes),
        passingPercentage: Number(passingPercentage),
        passingScore: Number(passingPercentage),
        deadline: new Date(deadline).toISOString()
      });
      showToast('New MCQ Competency Assessment published to Trainee portal!', 'success');
    }

    soundUtility.playSuccess();
    onNavigate('trainer-dashboard');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('trainer-dashboard')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-bold uppercase mb-1">
              <FileQuestion className="w-3.5 h-3.5" />
              MCQ Assessment Engine
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Assessment & Questionnaire Builder
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Design subject-wise timed examinations with automated scoring, answer justifications, and instant certificate issuance.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveAssessment}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{existingAssessmentId ? 'UPDATE ASSESSMENT' : 'PUBLISH ASSESSMENT'}</span>
        </button>
      </div>

      {/* Meta Configuration Card */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <span>Assessment Syllabus & Exam Parameters</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">Target Associated Course *</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
            >
              {availableCourses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} ({c.subject || c.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">Subject / Domain</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">Module / Topic</label>
            <input
              type="text"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">Assessment Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">Exam Description & Trainee Instructions</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Duration (Minutes)</span>
            </label>
            <input
              type="number"
              min="5"
              max="180"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-amber-500" />
              <span>Passing Score (%)</span>
            </label>
            <input
              type="number"
              min="40"
              max="100"
              value={passingPercentage}
              onChange={(e) => setPassingPercentage(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-500" />
              <span>Submission Deadline</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">Computed Metric</label>
            <div className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>{questions.length} Questions</span>
              <span className="text-emerald-600 dark:text-emerald-400">Pass: {passingMarks}/{totalMarks} Marks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">MCQ Question Suite ({questions.length} Items)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Specify question stems, 4 distractor options, mark weights, and detailed justifications.</p>
          </div>
          
          <button
            type="button"
            onClick={handleAddQuestion}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>ADD MCQ QUESTION</span>
          </button>
        </div>

        {questions.map((q, qIdx) => (
          <div
            key={qIdx}
            className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-emerald-700 dark:text-emerald-300 uppercase bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-xl">
                  Question {qIdx + 1}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Marks:</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={q.marks || 2}
                    onChange={(e) => handleUpdateQuestion(qIdx, { marks: Number(e.target.value) })}
                    className="w-14 px-2 py-0.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveQuestion(qIdx)}
                className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl cursor-pointer transition-colors"
                title="Remove Question"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Question Prompt *</label>
              <textarea
                rows={2}
                value={q.question || ''}
                onChange={(e) => handleUpdateQuestion(qIdx, { question: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                placeholder="Enter technical question prompt..."
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                Multiple Choice Options (Select radio to designate Correct Answer):
              </label>

              {(q.options || []).map((opt, optIdx) => {
                const isCorrect = q.correctAnswer === optIdx;

                return (
                  <div
                    key={optIdx}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                      isCorrect 
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/60' 
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      checked={isCorrect}
                      onChange={() => handleUpdateQuestion(qIdx, { correctAnswer: optIdx })}
                      className="w-4 h-4 text-emerald-600 accent-emerald-600 cursor-pointer"
                    />

                    <span className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>

                    <input
                      type="text"
                      value={opt || ''}
                      onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                    />

                    {isCorrect && (
                      <span className="text-[10px] uppercase font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                        <Check className="w-3.5 h-3.5" /> Correct Key
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Explanation & Justification Note</label>
              <input
                type="text"
                value={q.explanation || ''}
                onChange={(e) => handleUpdateQuestion(qIdx, { explanation: e.target.value })}
                placeholder="Why is this option correct? (Shown to officer after submitting)"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
