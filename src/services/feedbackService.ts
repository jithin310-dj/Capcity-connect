import { storageService } from './storageService';
import { activityLogService } from './activityLogService';
import { Feedback } from '../types';

export interface SubmitFeedbackInput {
  courseId: string;
  courseTitle: string;
  trainerId?: string;
  trainerName?: string;
  traineeId: string;
  traineeName: string;
  traineeAvatar?: string;
  overallRating: number;
  courseQuality: number;
  trainerQuality: number;
  learningMaterials?: number;
  materialQuality?: number;
  assessmentQuality: number;
  comments: string;
}

export const feedbackService = {
  getFeedbacksByCourse(courseId: string): Feedback[] {
    return storageService.getFeedbacks().filter((f) => f.courseId === courseId);
  },

  getAllFeedbacks(): Feedback[] {
    return storageService.getFeedbacks();
  },

  submitFeedback(
    traineeIdOrData: string | SubmitFeedbackInput,
    traineeName?: string,
    courseId?: string,
    courseTitle?: string,
    data?: {
      overallRating: number;
      courseQuality: number;
      trainerQuality: number;
      learningMaterials?: number;
      materialQuality?: number;
      assessmentQuality: number;
      comments: string;
    }
  ): Feedback {
    let payload: SubmitFeedbackInput;

    if (typeof traineeIdOrData === 'object') {
      payload = traineeIdOrData;
    } else {
      payload = {
        traineeId: traineeIdOrData,
        traineeName: traineeName || 'Trainee',
        courseId: courseId || '',
        courseTitle: courseTitle || '',
        overallRating: data?.overallRating || 5,
        courseQuality: data?.courseQuality || 5,
        trainerQuality: data?.trainerQuality || 5,
        learningMaterials: data?.learningMaterials || 5,
        materialQuality: data?.materialQuality || 5,
        assessmentQuality: data?.assessmentQuality || 5,
        comments: data?.comments || ''
      };
    }

    const feedbacks = storageService.getFeedbacks();
    const newFeedback: Feedback = {
      _id: `fb-${Date.now()}`,
      courseId: payload.courseId,
      courseTitle: payload.courseTitle,
      trainerId: payload.trainerId,
      traineeId: payload.traineeId,
      traineeName: payload.traineeName,
      traineeAvatar: payload.traineeAvatar,
      overallRating: payload.overallRating,
      courseQuality: payload.courseQuality,
      trainerQuality: payload.trainerQuality,
      learningMaterials: payload.learningMaterials || payload.materialQuality || 5,
      materialQuality: payload.materialQuality || payload.learningMaterials || 5,
      assessmentQuality: payload.assessmentQuality,
      comments: payload.comments,
      createdAt: new Date().toISOString()
    };

    const updated = [newFeedback, ...feedbacks];
    storageService.setFeedbacks(updated);

    activityLogService.log(
      payload.traineeId,
      payload.traineeName,
      'trainee',
      'Submitted Course Feedback',
      'Feedback',
      `${payload.courseTitle} (${payload.overallRating}★)`,
      'info'
    );

    return newFeedback;
  }
};
