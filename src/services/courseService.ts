import { storageService } from './storageService';
import { activityLogService } from './activityLogService';
import { Course } from '../types';

export interface CourseFilterParams {
  search?: string;
  category?: string;
  subject?: string;
  skill?: string;
  difficulty?: string;
  trainerId?: string;
  status?: 'draft' | 'published' | 'archived';
  sortBy?: 'popular' | 'rating' | 'newest' | 'duration';
}

export const courseService = {
  getCourses(filters?: CourseFilterParams): Course[] {
    let courses = storageService.getCourses();

    if (filters) {
      if (filters.status) {
        courses = courses.filter((c) => c.status === filters.status);
      }
      if (filters.trainerId) {
        courses = courses.filter((c) => c.trainerId === filters.trainerId);
      }
      if (filters.category && filters.category !== 'All') {
        courses = courses.filter((c) => c.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (filters.subject && filters.subject !== 'All') {
        courses = courses.filter((c) => c.subject.toLowerCase() === filters.subject!.toLowerCase());
      }
      if (filters.difficulty && filters.difficulty !== 'All') {
        courses = courses.filter((c) => c.difficulty === filters.difficulty);
      }
      if (filters.skill && filters.skill !== 'All') {
        courses = courses.filter((c) => c.skills.some((s) => s.toLowerCase().includes(filters.skill!.toLowerCase())));
      }
      if (filters.search && filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        courses = courses.filter(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query) ||
            c.trainerName.toLowerCase().includes(query) ||
            c.subject.toLowerCase().includes(query) ||
            c.skills.some((s) => s.toLowerCase().includes(query))
        );
      }

      if (filters.sortBy) {
        if (filters.sortBy === 'popular') {
          courses.sort((a, b) => b.enrolledUsers - a.enrolledUsers);
        } else if (filters.sortBy === 'rating') {
          courses.sort((a, b) => b.rating - a.rating);
        } else if (filters.sortBy === 'newest') {
          courses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
      }
    }

    return courses;
  },

  getCourseById(id: string): Course | undefined {
    return storageService.getCourses().find((c) => c._id === id);
  },

  createCourse(
    trainerIdOrData: string | Partial<Course>,
    trainerName?: string,
    trainerAvatar?: string,
    data?: Partial<Course>
  ): Course {
    let trainerId = 'u-trainer-1';
    let tName = 'Trainer';
    let tAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
    let courseData: Partial<Course> = {};

    if (typeof trainerIdOrData === 'object') {
      courseData = trainerIdOrData;
      trainerId = courseData.trainerId || 'u-trainer-1';
      tName = courseData.trainerName || 'Trainer';
      tAvatar = courseData.trainerAvatar || tAvatar;
    } else {
      trainerId = trainerIdOrData;
      tName = trainerName || 'Trainer';
      tAvatar = trainerAvatar || tAvatar;
      courseData = data || {};
    }

    const courses = storageService.getCourses();
    const newCourse: Course = {
      _id: `crs-${Date.now()}`,
      title: courseData.title || 'Untitled Course',
      description: courseData.description || '',
      category: courseData.category || 'General Competency',
      subject: courseData.subject || 'Specialized Topic',
      trainerId,
      trainerName: tName,
      trainerAvatar: tAvatar,
      difficulty: courseData.difficulty || 'Beginner',
      duration: courseData.duration || '4 Weeks',
      skills: courseData.skills || [],
      learningObjectives: courseData.learningObjectives || [],
      targetAudience: courseData.targetAudience,
      prerequisites: courseData.prerequisites,
      modules: courseData.modules || [],
      materialsCount: courseData.materialsCount || 0,
      assessmentIds: courseData.assessmentIds || [],
      enrolledUsers: 0,
      rating: 5.0,
      reviewsCount: 0,
      status: courseData.status || 'published',
      thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newCourse, ...courses];
    storageService.setCourses(updated);

    activityLogService.log(trainerId, tName, 'trainer', 'Created New Course', 'Course', newCourse.title, 'success');

    return newCourse;
  },

  updateCourse(courseId: string, partial: Partial<Course>): Course {
    const courses = storageService.getCourses();
    const idx = courses.findIndex((c) => c._id === courseId);
    if (idx === -1) throw new Error('Course not found');

    const updatedCourse = {
      ...courses[idx],
      ...partial,
      updatedAt: new Date().toISOString()
    };
    courses[idx] = updatedCourse;
    storageService.setCourses(courses);

    activityLogService.log(updatedCourse.trainerId, updatedCourse.trainerName, 'trainer', 'Updated Course', 'Course', updatedCourse.title, 'info');

    return updatedCourse;
  },

  deleteCourse(
    userIdOrCourseId: string,
    userName?: string,
    userRole?: 'trainer' | 'admin',
    courseId?: string
  ): void {
    let targetCourseId = userIdOrCourseId;
    let userId = 'u-admin-1';
    let uName = 'Admin';
    let uRole: 'trainer' | 'admin' = 'admin';

    if (courseId) {
      userId = userIdOrCourseId;
      uName = userName || 'Admin';
      uRole = userRole || 'admin';
      targetCourseId = courseId;
    }

    const courses = storageService.getCourses();
    const target = courses.find((c) => c._id === targetCourseId);
    if (!target) return;

    const filtered = courses.filter((c) => c._id !== targetCourseId);
    storageService.setCourses(filtered);

    activityLogService.log(userId, uName, uRole, 'Deleted Course', 'Course', target.title, 'warning');
  },

  togglePublishStatus(userId: string, userName: string, userRole: 'trainer' | 'admin', courseId: string): Course {
    const courses = storageService.getCourses();
    const idx = courses.findIndex((c) => c._id === courseId);
    if (idx === -1) throw new Error('Course not found');

    const nextStatus = courses[idx].status === 'published' ? 'draft' : 'published';
    courses[idx].status = nextStatus;
    courses[idx].updatedAt = new Date().toISOString();
    storageService.setCourses(courses);

    activityLogService.log(userId, userName, userRole, nextStatus === 'published' ? 'Published Course' : 'Unpublished Course', 'Course', courses[idx].title, 'success');

    return courses[idx];
  }
};
