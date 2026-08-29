export type UserRole = 'trainee' | 'trainer' | 'admin';
export type UserStatus = 'pending' | 'active' | 'approved' | 'suspended';

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface SkillRecord {
  id?: string;
  name: string;
  category: string;
  proficiency: SkillProficiency;
}

export interface Qualification {
  degree: string;
  institution: string;
  year: number;
}

export interface WorkExperience {
  organization: string;
  role: string;
  designation?: string;
  duration: string;
  description: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  responsibilities?: string;
  yearsOfExperience?: number;
}

export interface UserCertificate {
  name: string;
  issuingOrganization: string;
  date: string;
  credentialId: string;
  expiryDate?: string;
  credentialUrl?: string;
}

export interface PlatformAchievement {
  _id: string;
  title: string;
  description: string;
  category: 'Milestone' | 'Top Performer' | 'Institutional Badge' | 'Excellence' | 'Special Honor';
  badgeIcon: 'trophy' | 'award' | 'star' | 'zap' | 'shield' | 'flame' | 'gem' | 'crown' | 'target' | 'medal';
  criteria: string;
  targetAudience: 'All Platform Users' | 'Trainees' | 'Trainers' | 'Top Performers';
  milestoneTarget?: number;
  currentProgress?: number;
  unit?: string;
  recipientCount: number;
  status: 'published' | 'draft';
  publishedDate: string;
  createdDate: string;
  featured?: boolean;
}

export interface LearningContent {
  _id: string;
  title: string;
  description: string;
  category: string;
  resourceLink?: string;
  thumbnail?: string;
  featured: boolean;
  published: boolean;
  contentType: 'article' | 'video' | 'handbook' | 'interactive' | 'policy-brief';
  readTime?: string;
  createdAt: string;
  authorName?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  phone: string;
  organization: string;
  designation: string;
  department?: string;
  avatar: string;
  qualifications: Qualification[];
  skills: string[];
  skillRecords?: SkillRecord[];
  interests: string[];
  experience: WorkExperience[];
  certificates: UserCertificate[];
  status: UserStatus;
  bio?: string;
  yearsOfExperience?: number;
  experienceYears?: number;
  qualification?: string;
  location?: string;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  _id?: string;
  title: string;
  description: string;
  durationMinutes: number;
  duration?: string;
  type: 'video' | 'presentation' | 'pdf' | 'text';
  contentUrl?: string;
  textContent?: string;
  content?: string;
  order: number;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  subject: string;
  trainerId: string;
  trainerName: string;
  trainerAvatar: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  skills: string[];
  learningObjectives: string[];
  targetAudience?: string;
  prerequisites?: string[];
  modules: CourseModule[];
  materialsCount?: number;
  assessmentIds: string[];
  enrolledUsers: number;
  rating: number;
  reviewsCount: number;
  status: 'draft' | 'published' | 'archived';
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  _id: string;
  traineeId: string;
  traineeName?: string;
  courseId: string;
  courseTitle?: string;
  progress: number;
  completedModules: string[];
  status: 'in-progress' | 'completed';
  enrolledAt: string;
  completedAt?: string;
  lastAccessedAt: string;
}

export interface AssessmentQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  marks: number;
}

export type Question = AssessmentQuestion;

export interface Assessment {
  _id: string;
  courseId: string;
  courseTitle: string;
  trainerId: string;
  trainerName?: string;
  title: string;
  description: string;
  subject?: string;
  moduleTitle?: string;
  totalMarks?: number;
  passingMarks?: number;
  questions: AssessmentQuestion[];
  durationMinutes: number;
  deadline: string;
  passingScore: number; // e.g. 70
  passingPercentage?: number;
  status: 'draft' | 'published';
  createdAt: string;
}

export interface AssessmentResult {
  _id: string;
  traineeId: string;
  traineeName: string;
  assessmentId: string;
  assessmentTitle: string;
  courseId: string;
  courseTitle: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  answers: Record<string, number>;
  submittedAt: string;
}

export interface Certificate {
  _id: string;
  certificateId: string;
  traineeId: string;
  traineeName: string;
  traineeEmail: string;
  courseId: string;
  courseTitle: string;
  trainerId: string;
  trainerName: string;
  score: number;
  issueDate: string;
  verificationStatus: 'valid' | 'revoked';
}

export interface Feedback {
  _id: string;
  courseId: string;
  courseTitle: string;
  traineeId: string;
  trainerId?: string;
  traineeName: string;
  traineeAvatar?: string;
  overallRating: number;
  courseQuality: number;
  trainerQuality: number;
  learningMaterials?: number;
  materialQuality?: number;
  assessmentQuality: number;
  comments: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string; // or 'all'
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'certificate' | 'deadline';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  category?: 'General' | 'New Course' | 'Achievement' | 'Training Program' | 'System Update';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience?: 'Everyone' | 'Trainees' | 'Trainers' | 'Specific Course';
  targetRole?: 'all' | 'trainee' | 'trainer';
  authorId?: string;
  courseId?: string;
  publishDate?: string;
  authorName: string;
  authorRole?: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverRole: UserRole;
  receiverAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Material {
  _id: string;
  title: string;
  courseId?: string;
  courseTitle?: string;
  trainerId: string;
  trainerName: string;
  subject?: string;
  moduleTitle?: string;
  skill?: string;
  fileType?: 'video' | 'pdf' | 'presentation' | 'document' | string;
  type?: 'video' | 'presentation' | 'pdf' | 'document' | string;
  description?: string;
  category?: string;
  tags?: string[];
  duration?: string;
  fileUrl: string;
  fileSize: string;
  downloadsCount?: number;
  createdAt: string;
}

export type TrainingMaterial = Material;

export interface CompetencyScoreBreakdown {
  skillMatch: number; // max 40
  qualificationMatch: number; // max 20
  experienceMatch: number; // max 20
  subjectMatch: number; // max 15
  ratingMatch: number; // max 5
}

export interface CompetencyMatchResult {
  trainer: User;
  totalScore: number; // max 100
  breakdown: CompetencyScoreBreakdown;
  matchReasons: string[];
  recommendation: 'Highly Suitable' | 'Suitable' | 'Moderate Match' | 'Basic Match';
}

export interface ActivityLog {
  _id: string;
  time?: string;
  timestamp?: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity?: string;
  entityName?: string;
  details?: string;
  category?: string;
  status: 'success' | 'warning' | 'info';
}
