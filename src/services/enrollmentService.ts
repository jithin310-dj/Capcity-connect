import { storageService } from './storageService';
import { activityLogService } from './activityLogService';
import { courseService } from './courseService';
import { Enrollment } from '../types';

export const enrollmentService = {
  getEnrollmentsByTrainee(traineeId: string): Enrollment[] {
    return storageService.getEnrollments().filter((e) => e.traineeId === traineeId);
  },

  getAllEnrollments(): Enrollment[] {
    return storageService.getEnrollments();
  },

  getEnrollment(traineeId: string, courseId: string): Enrollment | undefined {
    return storageService.getEnrollments().find((e) => e.traineeId === traineeId && e.courseId === courseId);
  },

  enroll(traineeId: string, traineeName: string, courseId: string): Enrollment {
    const enrollments = storageService.getEnrollments();
    const existing = enrollments.find((e) => e.traineeId === traineeId && e.courseId === courseId);
    if (existing) return existing;

    const course = courseService.getCourseById(courseId);
    if (!course) throw new Error('Course not found');

    const newEnrollment: Enrollment = {
      _id: `enr-${Date.now()}`,
      traineeId,
      traineeName,
      courseId,
      courseTitle: course.title,
      progress: 0,
      completedModules: [],
      status: 'in-progress',
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString()
    };

    const updated = [newEnrollment, ...enrollments];
    storageService.setEnrollments(updated);

    // Increment course learner count
    courseService.updateCourse(courseId, { enrolledUsers: (course.enrolledUsers || 0) + 1 });

    activityLogService.log(traineeId, traineeName, 'trainee', 'Enrolled in Course', 'Course', course.title, 'success');

    return newEnrollment;
  },

  enrollCourse(traineeId: string, traineeName: string, courseId: string): Enrollment {
    return this.enroll(traineeId, traineeName, courseId);
  },

  markModuleComplete(traineeId: string, traineeName: string, courseId: string, moduleId: string): Enrollment {
    const enrollments = storageService.getEnrollments();
    const idx = enrollments.findIndex((e) => e.traineeId === traineeId && e.courseId === courseId);
    if (idx === -1) {
      // Auto-enroll if not enrolled
      this.enroll(traineeId, traineeName, courseId);
      return this.markModuleComplete(traineeId, traineeName, courseId, moduleId);
    }

    const enrollment = enrollments[idx];
    const course = courseService.getCourseById(courseId);
    if (!course) throw new Error('Course not found');

    const completed = new Set(enrollment.completedModules);
    completed.add(moduleId);
    const updatedCompletedList = Array.from(completed);

    const totalModules = course.modules.length || 1;
    const progress = Math.min(100, Math.round((updatedCompletedList.length / totalModules) * 100));
    const isCompleted = progress === 100;

    enrollment.completedModules = updatedCompletedList;
    enrollment.progress = progress;
    enrollment.lastAccessedAt = new Date().toISOString();
    if (isCompleted && enrollment.status !== 'completed') {
      enrollment.status = 'completed';
      enrollment.completedAt = new Date().toISOString();
      activityLogService.log(traineeId, traineeName, 'trainee', 'Completed All Course Modules', 'Course', course.title, 'success');
    }

    enrollments[idx] = enrollment;
    storageService.setEnrollments(enrollments);

    return enrollment;
  },

  completeModule(traineeId: string, traineeName: string, courseId: string, moduleId: string): Enrollment {
    return this.markModuleComplete(traineeId, traineeName, courseId, moduleId);
  }
};
