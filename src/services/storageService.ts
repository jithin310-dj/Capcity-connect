import { 
  INITIAL_USERS, INITIAL_COURSES, INITIAL_ENROLLMENTS, INITIAL_ASSESSMENTS, 
  INITIAL_RESULTS, INITIAL_CERTIFICATES, INITIAL_FEEDBACKS, INITIAL_MATERIALS, 
  INITIAL_ANNOUNCEMENTS, INITIAL_NOTIFICATIONS, INITIAL_MESSAGES, INITIAL_ACTIVITY_LOGS 
} from '../data/seedData';
import { 
  User, Course, Enrollment, Assessment, AssessmentResult, 
  Certificate, Feedback, Material, Announcement, Notification, 
  Message, ActivityLog 
} from '../types';

const STORAGE_KEYS = {
  USERS: 'capacity_connect_users',
  COURSES: 'capacity_connect_courses',
  ENROLLMENTS: 'capacity_connect_enrollments',
  ASSESSMENTS: 'capacity_connect_assessments',
  RESULTS: 'capacity_connect_results',
  CERTIFICATES: 'capacity_connect_certificates',
  FEEDBACKS: 'capacity_connect_feedbacks',
  MATERIALS: 'capacity_connect_materials',
  ANNOUNCEMENTS: 'capacity_connect_announcements',
  NOTIFICATIONS: 'capacity_connect_notifications',
  MESSAGES: 'capacity_connect_messages',
  ACTIVITY_LOGS: 'capacity_connect_activity_logs',
  CURRENT_USER: 'capacity_connect_auth_user',
  TOKEN: 'capacity_connect_jwt_token',
};

// Generic LocalStorage helper with seed fallback
function getStoredData<T>(key: string, seed: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(item) as T;
  } catch {
    return seed;
  }
}

function setStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving to localStorage key: ${key}`, err);
  }
}

export const storageService = {
  // Initialize storage
  initStorage() {
    getStoredData(STORAGE_KEYS.USERS, INITIAL_USERS);
    getStoredData(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    getStoredData(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    getStoredData(STORAGE_KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
    getStoredData(STORAGE_KEYS.RESULTS, INITIAL_RESULTS);
    getStoredData(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    getStoredData(STORAGE_KEYS.FEEDBACKS, INITIAL_FEEDBACKS);
    getStoredData(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
    getStoredData(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    getStoredData(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    getStoredData(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    getStoredData(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
  },

  // Reset demo data to pristine initial seed
  resetAllDemoData() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(INITIAL_ENROLLMENTS));
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(INITIAL_ASSESSMENTS));
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(INITIAL_RESULTS));
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(INITIAL_FEEDBACKS));
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(INITIAL_MATERIALS));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
  },

  // Cloud storage upload simulation
  async uploadFile(file: File, category: string = 'general'): Promise<{ url: string; size: string; name: string }> {
    // Simulate cloud upload latency and return accessible URL / simulated object store
    await new Promise((resolve) => setTimeout(resolve, 600));
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    
    // For PDFs or generic items, create blob URL or sample url
    const blobUrl = URL.createObjectURL(file);
    return {
      url: blobUrl,
      size: `${sizeInMb} MB`,
      name: file.name
    };
  },

  // Collections accessors
  getUsers: (): User[] => getStoredData(STORAGE_KEYS.USERS, INITIAL_USERS),
  setUsers: (users: User[]) => setStoredData(STORAGE_KEYS.USERS, users),

  updateUser: (userId: string, updates: Partial<User>): User | null => {
    const users = getStoredData<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const index = users.findIndex(u => u._id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      setStoredData(STORAGE_KEYS.USERS, users);
      return users[index];
    }
    return null;
  },

  getCourses: (): Course[] => getStoredData(STORAGE_KEYS.COURSES, INITIAL_COURSES),
  setCourses: (courses: Course[]) => setStoredData(STORAGE_KEYS.COURSES, courses),

  getEnrollments: (): Enrollment[] => getStoredData(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS),
  setEnrollments: (enrollments: Enrollment[]) => setStoredData(STORAGE_KEYS.ENROLLMENTS, enrollments),

  getAssessments: (): Assessment[] => getStoredData(STORAGE_KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS),
  setAssessments: (assessments: Assessment[]) => setStoredData(STORAGE_KEYS.ASSESSMENTS, assessments),

  getResults: (): AssessmentResult[] => getStoredData(STORAGE_KEYS.RESULTS, INITIAL_RESULTS),
  setResults: (results: AssessmentResult[]) => setStoredData(STORAGE_KEYS.RESULTS, results),

  getCertificates: (): Certificate[] => getStoredData(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES),
  setCertificates: (certificates: Certificate[]) => setStoredData(STORAGE_KEYS.CERTIFICATES, certificates),

  getFeedbacks: (): Feedback[] => getStoredData(STORAGE_KEYS.FEEDBACKS, INITIAL_FEEDBACKS),
  setFeedbacks: (feedbacks: Feedback[]) => setStoredData(STORAGE_KEYS.FEEDBACKS, feedbacks),

  getMaterials: (): Material[] => getStoredData(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS),
  setMaterials: (materials: Material[]) => setStoredData(STORAGE_KEYS.MATERIALS, materials),

  getAnnouncements: (): Announcement[] => getStoredData(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS),
  setAnnouncements: (announcements: Announcement[]) => setStoredData(STORAGE_KEYS.ANNOUNCEMENTS, announcements),

  getNotifications: (): Notification[] => getStoredData(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  setNotifications: (notifications: Notification[]) => setStoredData(STORAGE_KEYS.NOTIFICATIONS, notifications),

  getMessages: (): Message[] => getStoredData(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES),
  setMessages: (messages: Message[]) => setStoredData(STORAGE_KEYS.MESSAGES, messages),

  getActivityLogs: (): ActivityLog[] => getStoredData(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS),
  setActivityLogs: (logs: ActivityLog[]) => setStoredData(STORAGE_KEYS.ACTIVITY_LOGS, logs),

  getPortalAnalytics: () => {
    const users = getStoredData<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const courses = getStoredData<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    const enrollments = getStoredData<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    const certificates = getStoredData<Certificate[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    const assessments = getStoredData<Assessment[]>(STORAGE_KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);

    return {
      totalUsers: users.length,
      totalTrainees: users.filter(u => u.role === 'trainee').length,
      totalTrainers: users.filter(u => u.role === 'trainer').length,
      totalCourses: courses.length,
      publishedCourses: courses.filter(c => c.status === 'published').length,
      draftCourses: courses.filter(c => c.status === 'draft').length,
      totalEnrollments: enrollments.length,
      totalCertificatesIssued: certificates.length,
      totalAssessments: assessments.length
    };
  },

  // Auth local session
  getCurrentAuthUser: (): User | null => {
    try {
      const item = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  setCurrentAuthUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, `jwt_cc_${user._id}_${Date.now()}`);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  }
};
