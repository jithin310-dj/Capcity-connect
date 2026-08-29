import { storageService } from './storageService';
import { activityLogService } from './activityLogService';
import { Assessment, AssessmentResult } from '../types';

export const assessmentService = {
  getAssessments(courseId?: string): Assessment[] {
    const assessments = storageService.getAssessments();
    if (courseId) {
      return assessments.filter((a) => a.courseId === courseId);
    }
    return assessments;
  },

  getAssessmentById(id: string): Assessment | undefined {
    return storageService.getAssessments().find((a) => a._id === id);
  },

  getAssessmentByCourseId(courseId: string): Assessment | undefined {
    return storageService.getAssessments().find((a) => a.courseId === courseId && a.status === 'published');
  },

  createAssessment(
    trainerIdOrData: string | Partial<Assessment>,
    trainerName?: string,
    data?: Partial<Assessment>
  ): Assessment {
    let trainerId = 'u-trainer-1';
    let tName = 'Trainer';
    let assessmentData: Partial<Assessment> = {};

    if (typeof trainerIdOrData === 'object') {
      assessmentData = trainerIdOrData;
      trainerId = assessmentData.trainerId || 'u-trainer-1';
      tName = assessmentData.trainerName || 'Trainer';
    } else {
      trainerId = trainerIdOrData;
      tName = trainerName || 'Trainer';
      assessmentData = data || {};
    }

    const assessments = storageService.getAssessments();
    const newAssessment: Assessment = {
      _id: `asm-${Date.now()}`,
      courseId: assessmentData.courseId || '',
      courseTitle: assessmentData.courseTitle || 'General Assessment',
      trainerId,
      trainerName: tName,
      title: assessmentData.title || 'Course Competency Assessment',
      description: assessmentData.description || 'Multiple choice questionnaire assessing course learning objectives.',
      questions: assessmentData.questions || [],
      durationMinutes: assessmentData.durationMinutes || 15,
      deadline: assessmentData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      passingScore: assessmentData.passingScore || assessmentData.passingPercentage || 70,
      passingPercentage: assessmentData.passingPercentage || assessmentData.passingScore || 70,
      status: assessmentData.status || 'published',
      createdAt: new Date().toISOString()
    };

    const updated = [newAssessment, ...assessments];
    storageService.setAssessments(updated);

    activityLogService.log(trainerId, tName, 'trainer', 'Created Assessment Questionnaire', 'Assessment', newAssessment.title, 'success');

    return newAssessment;
  },

  updateAssessment(assessmentId: string, partial: Partial<Assessment>): Assessment {
    const assessments = storageService.getAssessments();
    const idx = assessments.findIndex((a) => a._id === assessmentId);
    if (idx === -1) throw new Error('Assessment not found');

    assessments[idx] = {
      ...assessments[idx],
      ...partial
    };
    storageService.setAssessments(assessments);
    return assessments[idx];
  },

  deleteAssessment(assessmentId: string): void {
    const assessments = storageService.getAssessments();
    const filtered = assessments.filter((a) => a._id !== assessmentId);
    storageService.setAssessments(filtered);
  },

  submitAssessment(
    traineeId: string,
    traineeName: string,
    assessmentId: string,
    answers: Record<string, number>,
    _timeSpentSeconds?: number,
    _courseTitle?: string
  ): AssessmentResult {
    const assessment = this.getAssessmentById(assessmentId);
    if (!assessment) throw new Error('Assessment not found');

    const totalQuestions = assessment.questions.length || 1;
    let correctCount = 0;

    assessment.questions.forEach((q, idx) => {
      // Robust lookup: checks question ID, numeric index, string index
      const ansById = q.id !== undefined && answers[q.id] !== undefined ? answers[q.id] : undefined;
      const ansByIdx = answers[String(idx)] !== undefined ? answers[String(idx)] : (answers as any)[idx];
      const selected = ansById !== undefined ? ansById : ansByIdx;

      if (selected !== undefined && Number(selected) === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= (assessment.passingScore || assessment.passingPercentage || 70);

    const results = storageService.getResults();
    // Remove previous attempt for same assessment if any, or append
    const filteredResults = results.filter((r) => !(r.traineeId === traineeId && r.assessmentId === assessmentId));

    const newResult: AssessmentResult = {
      _id: `res-${Date.now()}`,
      traineeId,
      traineeName,
      assessmentId,
      assessmentTitle: assessment.title,
      courseId: assessment.courseId,
      courseTitle: assessment.courseTitle,
      score: percentage,
      totalMarks: 100,
      percentage,
      passed,
      answers,
      submittedAt: new Date().toISOString()
    };

    storageService.setResults([newResult, ...filteredResults]);

    activityLogService.log(
      traineeId,
      traineeName,
      'trainee',
      passed ? 'Passed Assessment' : 'Attempted Assessment',
      'Assessment Result',
      `${assessment.courseTitle} - Score: ${percentage}% (${passed ? 'PASSED' : 'NOT PASSED'})`,
      passed ? 'success' : 'warning'
    );

    return newResult;
  },

  getResultsByTrainee(traineeId: string): AssessmentResult[] {
    return storageService.getResults().filter((r) => r.traineeId === traineeId);
  },

  getResult(traineeId: string, assessmentId: string): AssessmentResult | undefined {
    return storageService.getResults().find((r) => r.traineeId === traineeId && r.assessmentId === assessmentId);
  },

  getAllResults(): AssessmentResult[] {
    return storageService.getResults();
  }
};
