import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { assessmentService } from '../../services/assessmentService';
import { certificateService } from '../../services/certificateService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';
import { Assessment, AssessmentResult, Certificate } from '../../types';
import { CertificateModal } from '../../components/common/CertificateModal';
import { 
  CheckCircle2, XCircle, Clock, AlertTriangle, Award, 
  HelpCircle, ArrowLeft, ArrowRight, Flag, RotateCcw, Check 
} from 'lucide-react';

interface AssessmentPageProps {
  assessmentId: string;
  onNavigate: (view: string, payload?: any) => void;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({ assessmentId, onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { confirmAction } = useModal();
  const userId = user?._id || 'u-trainee-1';

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [generatedCert, setGeneratedCert] = useState<Certificate | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    const ass = storageService.getAssessments().find((a) => a._id === assessmentId);
    if (ass) {
      setAssessment(ass);
      setTimeLeft(ass.durationMinutes * 60);

      // Check if already taken
      const existingResult = storageService.getResults().find(
        (r) => r.traineeId === userId && r.assessmentId === assessmentId
      );
      if (existingResult) {
        setResult(existingResult);
        setIsSubmitted(true);
        // Check for certificate
        const cert = storageService.getCertificates().find(
          (c) => c.traineeId === userId && c.courseId === ass.courseId
        );
        if (cert) {
          setGeneratedCert(cert);
        }
      }
    }
  }, [assessmentId, userId]);

  // Countdown timer
  useEffect(() => {
    if (!isTestStarted || isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestStarted, isSubmitted, timeLeft]);

  if (!assessment) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Assessment not found.</p>
        <button
          onClick={() => onNavigate('trainee-assessments')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
        >
          Back to Assessments
        </button>
      </div>
    );
  }

  const questions = assessment.questions || [];
  const currentQ = questions[currentQuestionIdx];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIdx]: optIdx
    });
  };

  const handleToggleFlag = (qIdx: number) => {
    setFlaggedQuestions({
      ...flaggedQuestions,
      [qIdx]: !flaggedQuestions[qIdx]
    });
  };

  const handleSubmitTest = (force = false) => {
    const answeredCount = Object.keys(selectedAnswers).length;
    const unansweredCount = questions.length - answeredCount;

    const doSubmit = () => {
      if (!user) return;
      const res = assessmentService.submitAssessment(
        userId,
        user.name,
        assessment._id,
        selectedAnswers
      );
      setResult(res);
      setIsSubmitted(true);

      if (res.passed) {
        showToast(`Congratulations! You passed with ${res.percentage}% score!`, 'success');
        // Auto-generate certificate
        const cert = certificateService.generateCertificate(
          userId,
          user.name,
          assessment.courseId,
          assessment.courseTitle,
          res.percentage,
          assessment.trainerName
        );
        setGeneratedCert(cert);
      } else {
        showToast(`Assessment completed. Score: ${res.percentage}%. Passing threshold is ${assessment.passingPercentage}%.`, 'warning');
      }
    };

    if (force) {
      doSubmit();
    } else {
      confirmAction({
        title: 'Submit Assessment?',
        message: unansweredCount > 0
          ? `You have ${unansweredCount} unanswered questions. Are you sure you want to finalize your submission?`
          : 'Are you ready to submit your assessment and compute your certified competency score?',
        confirmText: 'Submit Final Answers',
        onConfirm: doSubmit
      });
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setCurrentQuestionIdx(0);
    setTimeLeft(assessment.durationMinutes * 60);
    setIsSubmitted(false);
    setIsTestStarted(true);
  };

  // 1. Initial State: Instructions before starting
  if (!isTestStarted && !isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <Award className="w-8 h-8 text-amber-600" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Official Competency Evaluation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{assessment.title}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Course: {assessment.courseTitle}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 text-center text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Total Questions</span>
            <strong className="text-base text-slate-900">{questions.length} Questions</strong>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Duration</span>
            <strong className="text-base text-slate-900">{assessment.durationMinutes} Minutes</strong>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Passing Mark</span>
            <strong className="text-base text-emerald-700">{assessment.passingPercentage}% Minimum</strong>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-600 mb-8 border-t border-b border-slate-100 py-4">
          <h4 className="font-bold text-slate-800 text-sm">Examination Guidelines:</h4>
          <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
            <li>The test contains multiple-choice questions. Each question has exactly one correct answer.</li>
            <li>A live timer runs continuously once started. The test will auto-submit when the countdown reaches 00:00.</li>
            <li>You can flag questions for later review and jump between questions at any time.</li>
            <li>Achieving <strong>{assessment.passingPercentage}% or higher</strong> unlocks your verified digital completion credential.</li>
          </ul>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('trainee-courses')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
          >
            Cancel & Return
          </button>
          <button
            onClick={() => setIsTestStarted(true)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors"
          >
            Begin Assessment Now
          </button>
        </div>
      </div>
    );
  }

  // 2. Results Screen
  if (isSubmitted && result) {
    const isPassed = result.passed;

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Results Banner */}
        <div
          className={`rounded-3xl p-8 border shadow-sm text-center ${
            isPassed
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
              : 'bg-rose-50/90 border-rose-200 text-rose-950'
          }`}
        >
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md ${
              isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {isPassed ? <CheckCircle2 className="w-9 h-9" /> : <XCircle className="w-9 h-9" />}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 bg-white/60">
            {isPassed ? 'ASSESSMENT PASSED' : 'MINIMUM PASS THRESHOLD NOT REACHED'}
          </div>

          <h2 className="text-2xl sm:text-4xl font-black">{result.percentage}% Score</h2>
          <p className="text-xs sm:text-sm mt-1 opacity-80">
            You scored {result.score} out of {result.totalMarks} total marks ({result.totalQuestions} questions evaluated).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {isPassed && generatedCert && (
              <button
                onClick={() => setShowCertModal(true)}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>View & Print Official Certificate</span>
              </button>
            )}

            <button
              onClick={handleRetake}
              className="px-4 py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Assessment</span>
            </button>

            <button
              onClick={() => onNavigate('trainee-dashboard')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Detailed Question Review Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span>Answer Key & Explanations Review</span>
          </h3>

          <div className="space-y-6">
            {questions.map((q, idx) => {
              const selectedIdx = result.answers?.[idx] !== undefined ? result.answers[idx] : -1;
              const isCorrect = selectedIdx === q.correctAnswer;

              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border ${
                    isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Question {idx + 1}: {q.question}
                    </h4>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? `+${q.marks} Marks` : '0 Marks'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs mb-3">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedIdx === optIdx;
                      const isActualCorrect = q.correctAnswer === optIdx;

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between ${
                            isActualCorrect
                              ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-bold'
                              : isSelected
                              ? 'bg-rose-100/70 border-rose-300 text-rose-950 font-medium'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="font-bold font-mono">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            {opt}
                          </span>
                          {isActualCorrect && (
                            <span className="text-[10px] uppercase font-bold text-emerald-700 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Correct Answer
                            </span>
                          )}
                          {isSelected && !isActualCorrect && (
                            <span className="text-[10px] uppercase font-bold text-rose-700">
                              Your Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="bg-slate-100/80 p-3 rounded-xl text-xs text-slate-600">
                      <strong className="text-slate-800 font-semibold">Explanation: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Modal Trigger */}
        {showCertModal && generatedCert && (
          <CertificateModal
            certificate={generatedCert}
            onClose={() => setShowCertModal(false)}
            onNavigate={onNavigate}
          />
        )}

      </div>
    );
  }

  // 3. Active MCQ Test Interface
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Test Live Timer & Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            Live Assessment
          </span>
          <h2 className="text-base font-bold text-slate-900 mt-0.5">{assessment.title}</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Timer Pill */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono font-bold text-sm border shadow-2xs ${
              timeLeft < 300
                ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => handleSubmitTest()}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Question & Navigation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Question Pane (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
          
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Question {currentQuestionIdx + 1} of {questions.length}
            </span>

            <button
              onClick={() => handleToggleFlag(currentQuestionIdx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                flaggedQuestions[currentQuestionIdx]
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{flaggedQuestions[currentQuestionIdx] ? 'Flagged' : 'Flag for Review'}</span>
            </button>
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-6 leading-relaxed">
            {currentQ.question}
          </h3>

          {/* MCQ Options */}
          <div className="space-y-3 mb-8">
            {currentQ.options.map((optionText, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;

              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs font-mono shrink-0 transition-colors ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className={`text-xs sm:text-sm ${isSelected ? 'font-bold text-blue-950' : 'text-slate-700'}`}>
                    {optionText}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentQuestionIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => handleSubmitTest()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <span>Finish & Submit</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Question Palette Sidebar (1 col) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Question Matrix</h4>
          
          <div className="grid grid-cols-4 gap-2">
            {questions.map((_, idx) => {
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isFlagged = flaggedQuestions[idx];
              const isCurrent = idx === currentQuestionIdx;

              let btnClass = 'bg-slate-100 text-slate-600 border-slate-200';
              if (isCurrent) btnClass = 'ring-2 ring-blue-600 font-bold';
              if (isAnswered) btnClass += ' bg-blue-600 text-white border-blue-600';
              if (isFlagged) btnClass += ' bg-amber-500 text-white border-amber-500';

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`h-9 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all ${btnClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-blue-600" />
              <span>Answered ({Object.keys(selectedAnswers).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-amber-500" />
              <span>Flagged ({Object.keys(flaggedQuestions).filter((k) => flaggedQuestions[Number(k)]).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-slate-100 border border-slate-200" />
              <span>Unanswered ({questions.length - Object.keys(selectedAnswers).length})</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
