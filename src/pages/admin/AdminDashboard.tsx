import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { courseService } from '../../services/courseService';
import { useToast } from '../../context/ToastContext';
import { StatsCard } from '../../components/common/StatsCard';
import { PlatformAchievement, LearningContent } from '../../types';
import { 
  Users, BookOpen, Award, Activity, ShieldCheck, 
  CheckCircle2, XCircle, Megaphone, ChevronRight, BarChart3,
  Trophy, Star, Zap, Shield, Flame, Gem, Crown, Target, Medal,
  Plus, Edit3, Trash2, Eye, EyeOff, Sparkles, TrendingUp,
  Clock, Check, X, ArrowUpRight, Filter, ExternalLink, FileText, Globe, Bookmark
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface AdminDashboardProps {
  onNavigate: (view: string, payload?: any) => void;
}

const BADGE_ICONS = {
  trophy: Trophy,
  award: Award,
  star: Star,
  zap: Zap,
  shield: Shield,
  flame: Flame,
  gem: Gem,
  crown: Crown,
  target: Target,
  medal: Medal
};

// Engagement Trend Dataset
const ENGAGEMENT_DATA_7D = [
  { time: 'Mon', activeTrainees: 840, activeFaculty: 65, totalInteractions: 3120, avgScore: 84.5 },
  { time: 'Tue', activeTrainees: 920, activeFaculty: 72, totalInteractions: 3450, avgScore: 85.1 },
  { time: 'Wed', activeTrainees: 1100, activeFaculty: 80, totalInteractions: 4200, avgScore: 86.8 },
  { time: 'Thu', activeTrainees: 1250, activeFaculty: 88, totalInteractions: 4890, avgScore: 87.2 },
  { time: 'Fri', activeTrainees: 1420, activeFaculty: 95, totalInteractions: 5600, avgScore: 86.9 },
  { time: 'Sat', activeTrainees: 980, activeFaculty: 58, totalInteractions: 3800, avgScore: 85.8 },
  { time: 'Sun', activeTrainees: 760, activeFaculty: 42, totalInteractions: 2900, avgScore: 86.2 }
];

const ENGAGEMENT_DATA_30D = [
  { time: 'Week 1', activeTrainees: 3400, activeFaculty: 210, totalInteractions: 14200, avgScore: 83.9 },
  { time: 'Week 2', activeTrainees: 4100, activeFaculty: 245, totalInteractions: 17800, avgScore: 85.4 },
  { time: 'Week 3', activeTrainees: 5200, activeFaculty: 290, totalInteractions: 22400, avgScore: 86.8 },
  { time: 'Week 4', activeTrainees: 6150, activeFaculty: 340, totalInteractions: 26900, avgScore: 87.5 }
];

const ENGAGEMENT_DATA_QUARTERLY = [
  { time: 'Q1 Jan', activeTrainees: 12500, activeFaculty: 620, totalInteractions: 54000, avgScore: 82.5 },
  { time: 'Q1 Feb', activeTrainees: 15800, activeFaculty: 780, totalInteractions: 68000, avgScore: 84.8 },
  { time: 'Q1 Mar', activeTrainees: 19400, activeFaculty: 940, totalInteractions: 86000, avgScore: 86.7 }
];

// Course Completion Rates by Curriculum Domain
const DOMAIN_COMPLETION_DATA = [
  { domain: 'Data & AI Governance', completionRate: 88.4, targetRate: 80, enrolled: 1840, completed: 1626 },
  { domain: 'Cyber Defense', completionRate: 84.2, targetRate: 80, enrolled: 1420, completed: 1195 },
  { domain: 'Public Administration', completionRate: 92.6, targetRate: 85, enrolled: 2150, completed: 1991 },
  { domain: 'Digital Infrastructure', completionRate: 79.5, targetRate: 75, enrolled: 1120, completed: 890 },
  { domain: 'Procurement & GeM', completionRate: 86.0, targetRate: 80, enrolled: 960, completed: 825 },
  { domain: 'Leadership & Policy', completionRate: 94.1, targetRate: 85, enrolled: 1680, completed: 1581 }
];

// Assessment Score Breakdown
const ASSESSMENT_PERFORMANCE_DATA = [
  { module: 'Module 1: Foundations', avgScore: 89.4, passRate: 96.2, highestScore: 100 },
  { module: 'Module 2: Applied Policy', avgScore: 85.1, passRate: 91.8, highestScore: 98 },
  { module: 'Module 3: Security Ops', avgScore: 82.7, passRate: 88.4, highestScore: 99 },
  { module: 'Module 4: Institutional AI', avgScore: 87.8, passRate: 93.5, highestScore: 100 },
  { module: 'Module 5: Capstone Eval', avgScore: 86.2, passRate: 91.0, highestScore: 98 }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [users, setUsers] = useState(storageService.getUsers());
  const [courses, setCourses] = useState(storageService.getCourses());
  const [logs] = useState(storageService.getActivityLogs().slice(0, 5));
  const [achievements, setAchievements] = useState<PlatformAchievement[]>(storageService.getAchievements());

  // Analytics timeframe
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'quarterly'>('7d');

  // Achievement Modal State
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [editingAchievementId, setEditingAchievementId] = useState<string | null>(null);
  const [achTitle, setAchTitle] = useState('');
  const [achDescription, setAchDescription] = useState('');
  const [achCategory, setAchCategory] = useState<PlatformAchievement['category']>('Milestone');
  const [achBadgeIcon, setAchBadgeIcon] = useState<PlatformAchievement['badgeIcon']>('trophy');
  const [achCriteria, setAchCriteria] = useState('');
  const [achTargetAudience, setAchTargetAudience] = useState<PlatformAchievement['targetAudience']>('All Platform Users');
  const [achMilestoneTarget, setAchMilestoneTarget] = useState<number>(50000);
  const [achCurrentProgress, setAchCurrentProgress] = useState<number>(52480);
  const [achUnit, setAchUnit] = useState('Certified Officers');
  const [achStatus, setAchStatus] = useState<'published' | 'draft'>('published');
  const [achFeatured, setAchFeatured] = useState(true);

  // Homepage Learning Content Management State
  const [learningContents, setLearningContents] = useState<LearningContent[]>(storageService.getLearningContents());
  const [showContentModal, setShowContentModal] = useState(false);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [contentTitle, setContentTitle] = useState('');
  const [contentDescription, setContentDescription] = useState('');
  const [contentCategory, setContentCategory] = useState('AI & Policy');
  const [contentLink, setContentLink] = useState('');
  const [contentThumbnail, setContentThumbnail] = useState('');
  const [contentType, setContentType] = useState<LearningContent['contentType']>('policy-brief');
  const [contentReadTime, setContentReadTime] = useState('10 min read');
  const [contentFeatured, setContentFeatured] = useState(true);
  const [contentPublished, setContentPublished] = useState(true);
  const [contentAuthor, setContentAuthor] = useState('National Capacity Building Commission');

  const analytics = storageService.getPortalAnalytics();

  const pendingTrainers = users.filter(
    (u) => u.role === 'trainer' && (u.status === 'pending' || (u as any).trainerVerificationStatus === 'pending')
  );

  const pendingCourses = courses.filter((c) => c.status === 'draft');

  const handleApproveTrainer = (trainerId: string) => {
    storageService.updateUser(trainerId, { status: 'approved' });
    setUsers(storageService.getUsers());
    showToast('Trainer credentials approved and status updated to verified!', 'success');
  };

  const handleRejectTrainer = (trainerId: string) => {
    storageService.updateUser(trainerId, { status: 'suspended' });
    setUsers(storageService.getUsers());
    showToast('Trainer application rejected.', 'info');
  };

  const handleApproveCourse = (courseId: string) => {
    courseService.updateCourse(courseId, { status: 'published' });
    setCourses(storageService.getCourses());
    showToast('Course curriculum approved and published across portal!', 'success');
  };

  // Achievement Handlers
  const handleOpenAddAchievement = () => {
    setEditingAchievementId(null);
    setAchTitle('');
    setAchDescription('');
    setAchCategory('Milestone');
    setAchBadgeIcon('trophy');
    setAchCriteria('');
    setAchTargetAudience('All Platform Users');
    setAchMilestoneTarget(50000);
    setAchCurrentProgress(52480);
    setAchUnit('Certified Officers');
    setAchStatus('published');
    setAchFeatured(true);
    setShowAchievementModal(true);
  };

  const handleOpenEditAchievement = (ach: PlatformAchievement) => {
    setEditingAchievementId(ach._id);
    setAchTitle(ach.title);
    setAchDescription(ach.description);
    setAchCategory(ach.category);
    setAchBadgeIcon(ach.badgeIcon);
    setAchCriteria(ach.criteria);
    setAchTargetAudience(ach.targetAudience);
    setAchMilestoneTarget(ach.milestoneTarget || 50000);
    setAchCurrentProgress(ach.currentProgress || 0);
    setAchUnit(ach.unit || 'Officers');
    setAchStatus(ach.status);
    setAchFeatured(Boolean(ach.featured));
    setShowAchievementModal(true);
  };

  const handleSaveAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achTitle.trim() || !achDescription.trim()) return;

    if (editingAchievementId) {
      storageService.updateAchievement(editingAchievementId, {
        title: achTitle.trim(),
        description: achDescription.trim(),
        category: achCategory,
        badgeIcon: achBadgeIcon,
        criteria: achCriteria.trim() || 'Achieve benchmark platform milestone criteria.',
        targetAudience: achTargetAudience,
        milestoneTarget: Number(achMilestoneTarget),
        currentProgress: Number(achCurrentProgress),
        unit: achUnit.trim(),
        status: achStatus,
        featured: achFeatured
      });
      showToast('Platform achievement updated successfully!', 'success');
    } else {
      storageService.createAchievement({
        title: achTitle.trim(),
        description: achDescription.trim(),
        category: achCategory,
        badgeIcon: achBadgeIcon,
        criteria: achCriteria.trim() || 'Achieve benchmark platform milestone criteria.',
        targetAudience: achTargetAudience,
        milestoneTarget: Number(achMilestoneTarget),
        currentProgress: Number(achCurrentProgress),
        unit: achUnit.trim(),
        recipientCount: achCategory === 'Top Performer' ? 342 : 1,
        status: achStatus,
        publishedDate: new Date().toISOString().split('T')[0],
        featured: achFeatured
      });
      showToast('New platform achievement created and published!', 'success');
    }

    setAchievements(storageService.getAchievements());
    setShowAchievementModal(false);
  };

  const handleToggleAchievementStatus = (ach: PlatformAchievement) => {
    const nextStatus = ach.status === 'published' ? 'draft' : 'published';
    storageService.updateAchievement(ach._id, { status: nextStatus });
    setAchievements(storageService.getAchievements());
    showToast(
      nextStatus === 'published' 
        ? `Achievement "${ach.title}" is now published and live on the dashboard!` 
        : `Achievement "${ach.title}" reverted to draft.`,
      'info'
    );
  };

  const handleDeleteAchievement = (id: string) => {
    storageService.deleteAchievement(id);
    setAchievements(storageService.getAchievements());
    showToast('Platform achievement removed.', 'info');
  };

  // Learning Content Handlers
  const handleOpenAddContent = () => {
    setEditingContentId(null);
    setContentTitle('');
    setContentDescription('');
    setContentCategory('AI & Policy');
    setContentLink('');
    setContentThumbnail('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80');
    setContentType('policy-brief');
    setContentReadTime('10 min read');
    setContentFeatured(true);
    setContentPublished(true);
    setContentAuthor('National Capacity Building Commission');
    setShowContentModal(true);
  };

  const handleOpenEditContent = (content: LearningContent) => {
    setEditingContentId(content._id);
    setContentTitle(content.title);
    setContentDescription(content.description);
    setContentCategory(content.category);
    setContentLink(content.resourceLink || '');
    setContentThumbnail(content.thumbnail || '');
    setContentType(content.contentType);
    setContentReadTime(content.readTime || '5 min read');
    setContentFeatured(content.featured);
    setContentPublished(content.published);
    setContentAuthor(content.authorName || 'National Capacity Building Commission');
    setShowContentModal(true);
  };

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentTitle.trim() || !contentDescription.trim()) {
      showToast('Please provide a title and summary description for the content.', 'warning');
      return;
    }

    if (editingContentId) {
      storageService.updateLearningContent(editingContentId, {
        title: contentTitle.trim(),
        description: contentDescription.trim(),
        category: contentCategory.trim(),
        resourceLink: contentLink.trim() || undefined,
        thumbnail: contentThumbnail.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
        contentType,
        readTime: contentReadTime.trim() || '5 min read',
        featured: contentFeatured,
        published: contentPublished,
        authorName: contentAuthor.trim() || 'Platform Administration'
      });
      showToast('Homepage learning content updated successfully!', 'success');
    } else {
      storageService.createLearningContent({
        title: contentTitle.trim(),
        description: contentDescription.trim(),
        category: contentCategory.trim(),
        resourceLink: contentLink.trim() || undefined,
        thumbnail: contentThumbnail.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
        contentType,
        readTime: contentReadTime.trim() || '5 min read',
        featured: contentFeatured,
        published: contentPublished,
        authorName: contentAuthor.trim() || 'Platform Administration'
      });
      showToast('New learning content published to portal homepage!', 'success');
    }

    setLearningContents(storageService.getLearningContents());
    setShowContentModal(false);
  };

  const handleToggleContentPublish = (content: LearningContent) => {
    const nextStatus = !content.published;
    storageService.updateLearningContent(content._id, { published: nextStatus });
    setLearningContents(storageService.getLearningContents());
    showToast(
      nextStatus 
        ? `Content "${content.title}" is now published on the homepage!` 
        : `Content "${content.title}" unpublished from homepage.`,
      'info'
    );
  };

  const handleDeleteContent = (id: string) => {
    storageService.deleteLearningContent(id);
    setLearningContents(storageService.getLearningContents());
    showToast('Learning content resource removed.', 'info');
  };

  const getEngagementChartData = () => {
    switch (timeframe) {
      case '30d': return ENGAGEMENT_DATA_30D;
      case 'quarterly': return ENGAGEMENT_DATA_QUARTERLY;
      default: return ENGAGEMENT_DATA_7D;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950/80 dark:to-slate-950 rounded-3xl p-5 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-800/40">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Institutional Directorate • CAPACITY CONNECT</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Institutional Governance & Admin Console
          </h1>
          <p className="text-slate-200 dark:text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Centralized orchestration of institutional users, faculty vetting, course publishing approvals, platform-wide achievements, and visual engagement analytics.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleOpenAddAchievement}
            className="min-h-[44px] px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trophy className="w-4 h-4 shrink-0" />
            <span>Publish Achievement</span>
          </button>
          <button
            onClick={() => onNavigate('admin-announcements')}
            className="min-h-[44px] px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Megaphone className="w-4 h-4 shrink-0" />
            <span>Post Announcement</span>
          </button>
          <button
            onClick={() => onNavigate('admin-logs')}
            className="min-h-[44px] px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 backdrop-blur-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Registered Users"
          value={analytics.totalUsers}
          subtitle={`${analytics.totalTrainees} Trainees • ${analytics.totalTrainers} Faculty`}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Curricula Catalog"
          value={analytics.totalCourses}
          subtitle={`${analytics.publishedCourses} Published • ${analytics.draftCourses} Drafts`}
          icon={BookOpen}
          color="emerald"
        />
        <StatsCard
          title="Certificates Issued"
          value={analytics.totalCertificatesIssued}
          subtitle="Verifiable accreditations"
          icon={Award}
          color="purple"
        />
        <StatsCard
          title="Platform Achievements"
          value={analytics.publishedAchievements || achievements.length}
          subtitle={`${achievements.filter(a => a.status === 'published').length} Active Milestones`}
          icon={Trophy}
          color="amber"
        />
      </div>

      {/* Visual Analytics Charts Section (Total Platform Engagement: Active Users, Course Completion Rates, Average Assessment Scores) */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Total Platform Engagement & Institutional Analytics
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live telemetry tracking active officer users, curriculum completion benchmarks, and assessment score distributions.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Timeframe:
            </span>
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setTimeframe('7d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeframe === '7d'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('30d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeframe === '30d'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Last 30 Days
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('quarterly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeframe === 'quarterly'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Quarterly
              </button>
            </div>
          </div>
        </div>

        {/* Highlight Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-300 mb-1">
              <span>Active Platform Engagement</span>
              <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-[11px] font-mono">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +18.4% MoM
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {analytics.activeUsersCount ? analytics.activeUsersCount.toLocaleString() : '1,420'} DAU
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              Active concurrent training sessions across all ministries
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-1">
              <span>Course Completion Benchmark</span>
              <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-[11px] font-mono">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +6.2%
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {analytics.courseCompletionRate || 78.4}%
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              Overall enrolled modules completed to certification
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/40">
            <div className="flex items-center justify-between text-xs font-bold text-purple-900 dark:text-purple-300 mb-1">
              <span>Average Assessment Score</span>
              <span className="flex items-center text-purple-700 dark:text-purple-300 text-[11px] font-mono">
                Pass Rate: 91.8%
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {analytics.averageAssessmentScore || 86.2}%
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              Evaluated across {analytics.totalAssessments || 12} standardized knowledge checks
            </p>
          </div>
        </div>

        {/* Main Engagement & Completion Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* Chart 1: Active Users & Interactions Over Time */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Active User Trajectory</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Daily active trainees vs. faculty members</p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/40">
                Live Pulse
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getEngagementChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="traineeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="facultyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="activeTrainees"
                    name="Active Trainees"
                    stroke="#4F46E5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#traineeGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="activeFaculty"
                    name="Active Faculty"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#facultyGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Course Completion Rates by Curriculum Domain */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Course Completion Rates by Domain</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">% of officers completing registered curricula</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                Target: 80%+
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DOMAIN_COMPLETION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                  <XAxis 
                    dataKey="domain" 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickLine={false} 
                    tickFormatter={(v) => v.split(' ')[0]} 
                  />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, 'Completion Rate']}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="completionRate" name="Actual Completion %" fill="#059669" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="targetRate" name="Target Benchmark %" fill="#94a3b8" radius={[6, 6, 0, 0]} opacity={0.4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 3: Assessment Performance & Average Score Distribution */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Assessment Performance & Average Score Distribution</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Cohort scores and pass percentage across standard examination modules</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800/40 self-start sm:self-auto">
              Cohort Mean: 86.2%
            </span>
          </div>

          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ASSESSMENT_PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="module" stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => v.split(':')[0]} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[70, 100]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  name="Average Score %"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#8B5CF6' }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="passRate"
                  name="Cohort Pass Rate %"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Platform-wide Achievements Management & Showcase Section */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Platform-wide Achievements & Institutional Milestones
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Create, publish, and manage recognition badges, top performer awards, and platform-wide training milestones.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddAchievement}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create & Publish Achievement</span>
          </button>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const IconComponent = BADGE_ICONS[ach.badgeIcon] || Trophy;
            const isMilestone = ach.category === 'Milestone';
            const progressPercent = ach.milestoneTarget 
              ? Math.min(100, Math.round(((ach.currentProgress || 0) / ach.milestoneTarget) * 100))
              : 100;

            return (
              <div
                key={ach._id}
                className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${
                  ach.status === 'published'
                    ? 'border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 dark:from-[#1A2234] dark:to-[#151B28] shadow-2xs hover:shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 opacity-75'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-2xs shrink-0 ${
                        ach.status === 'published'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-300/60 dark:border-amber-700/50'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                          {ach.category}
                        </span>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1">{ach.title}</h3>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      ach.status === 'published'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}>
                      {ach.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                    {ach.description}
                  </p>

                  {/* Milestone Progress Bar if applicable */}
                  {isMilestone && ach.milestoneTarget && (
                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                      <div className="flex justify-between items-center text-xs font-bold mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Milestone Target:</span>
                        <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">
                          {ach.currentProgress?.toLocaleString()} / {ach.milestoneTarget.toLocaleString()} {ach.unit}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Top Performer Badge Stats */}
                  {!isMilestone && (
                    <div className="mt-3 text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span>Audience: <strong className="text-slate-800 dark:text-slate-200">{ach.targetAudience}</strong></span>
                      {(ach.recipientCount || (ach as any).awardedCount) ? (
                        <span className="text-amber-700 dark:text-amber-300 font-bold">★ {ach.recipientCount || (ach as any).awardedCount} Officers Awarded</span>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleAchievementStatus(ach)}
                    className="font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                  >
                    {ach.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{ach.status === 'published' ? 'Unpublish' : 'Publish to Board'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditAchievement(ach)}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit Achievement"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAchievement(ach._id)}
                      className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Delete Achievement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create / Edit Achievement Modal */}
        {showAchievementModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#151B28] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {editingAchievementId ? 'Edit Platform Achievement' : 'Create & Publish Platform Achievement'}
                  </h3>
                </div>
                <button onClick={() => setShowAchievementModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAchievement} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Achievement Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50,000 Officers Certified Milestone or Cyber & AI Vanguard"
                    value={achTitle}
                    onChange={(e) => setAchTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Brief description of the milestone or badge recognition..."
                    value={achDescription}
                    onChange={(e) => setAchDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                    <select
                      value={achCategory}
                      onChange={(e) => setAchCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    >
                      <option value="Milestone">Milestone (Platform Metric)</option>
                      <option value="Top Performer">Top Performer Badge</option>
                      <option value="Institutional Badge">Institutional Badge</option>
                      <option value="Excellence">Faculty Excellence</option>
                      <option value="Special Honor">Special Honor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Badge Icon *</label>
                    <select
                      value={achBadgeIcon}
                      onChange={(e) => setAchBadgeIcon(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    >
                      <option value="trophy">Trophy</option>
                      <option value="award">Award Ribbon</option>
                      <option value="star">Gold Star</option>
                      <option value="zap">Lightning Bolt (Fast Track)</option>
                      <option value="shield">Shield (Security/Gov)</option>
                      <option value="flame">Flame (Streak/Top)</option>
                      <option value="crown">Crown (Mastery)</option>
                      <option value="target">Target (Milestone)</option>
                      <option value="medal">Medal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Audience</label>
                  <select
                    value={achTargetAudience}
                    onChange={(e) => setAchTargetAudience(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="All Platform Users">All Platform Users</option>
                    <option value="Trainees">Trainees</option>
                    <option value="Trainers">Trainers & Faculty</option>
                    <option value="Top Performers">Top Performers</option>
                  </select>
                </div>

                {achCategory === 'Milestone' && (
                  <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-3">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
                      Milestone Metric Configuration:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Target</label>
                        <input
                          type="number"
                          value={achMilestoneTarget}
                          onChange={(e) => setAchMilestoneTarget(Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Current</label>
                        <input
                          type="number"
                          value={achCurrentProgress}
                          onChange={(e) => setAchCurrentProgress(Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Unit Label</label>
                        <input
                          type="text"
                          value={achUnit}
                          onChange={(e) => setAchUnit(e.target.value)}
                          placeholder="e.g. Officers"
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Award Criteria</label>
                  <input
                    type="text"
                    placeholder="e.g. Complete 5 or more certified governance modules with score > 90%"
                    value={achCriteria}
                    onChange={(e) => setAchCriteria(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="statusPublishToggle"
                      checked={achStatus === 'published'}
                      onChange={(e) => setAchStatus(e.target.checked ? 'published' : 'draft')}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <label htmlFor="statusPublishToggle" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                      Publish immediately to dashboard
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featuredToggle"
                      checked={achFeatured}
                      onChange={(e) => setAchFeatured(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <label htmlFor="featuredToggle" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                      Feature on Home
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAchievementModal(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold rounded-xl shadow-xs cursor-pointer"
                  >
                    {editingAchievementId ? 'Update Achievement' : 'Publish Achievement'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Homepage Featured Learning Content & Research Bank Management (Req 7) */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Homepage Featured Learning Content & Research Bank
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Publish blueprints, policy guidelines, and open-access materials directly to the public landing page.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddContent}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Resource</span>
          </button>
        </div>

        {/* Content Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {learningContents.map((content) => (
            <div
              key={content._id}
              className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${
                content.published
                  ? 'border-blue-200/80 dark:border-blue-900/40 bg-white dark:bg-[#151B28] shadow-2xs hover:shadow-md'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                      {content.category}
                    </span>
                    {content.featured && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200">
                        Featured
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    content.published
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}>
                    {content.published ? 'LIVE ON HOME' : 'DRAFT'}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={content.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
                    alt={content.title}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-1">{content.title}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-mono">{content.contentType} • {content.readTime || '5 min'}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {content.description}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleContentPublish(content)}
                  className="font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer"
                >
                  {content.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{content.published ? 'Unpublish' : 'Publish to Home'}</span>
                </button>

                <div className="flex items-center gap-1">
                  {content.resourceLink && (
                    <a
                      href={content.resourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Open Resource Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenEditContent(content)}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Edit Content"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteContent(content._id)}
                    className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Delete Content"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create / Edit Content Modal */}
        {showContentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#151B28] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {editingContentId ? 'Edit Homepage Learning Content' : 'Publish Learning Content to Homepage'}
                  </h3>
                </div>
                <button onClick={() => setShowContentModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveContent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    value={contentTitle}
                    onChange={(e) => setContentTitle(e.target.value)}
                    placeholder="e.g. National AI & Governance Framework Guidelines 2026"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={contentCategory}
                      onChange={(e) => setContentCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
                    >
                      <option value="AI & Policy">AI & Policy</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Public Administration">Public Administration</option>
                      <option value="Digital Governance">Digital Governance</option>
                      <option value="Cloud Architecture">Cloud Architecture</option>
                      <option value="Healthcare Systems">Healthcare Systems</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Format Type
                    </label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
                    >
                      <option value="policy-brief">Policy Brief</option>
                      <option value="handbook">Standard Handbook</option>
                      <option value="article">Technical Article</option>
                      <option value="video">Video Masterclass</option>
                      <option value="interactive">Interactive Sandbox</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Summary Description *
                  </label>
                  <textarea
                    rows={3}
                    value={contentDescription}
                    onChange={(e) => setContentDescription(e.target.value)}
                    placeholder="Brief overview of the material, core learning objectives, and institutional relevance..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Resource URL / Link
                    </label>
                    <input
                      type="url"
                      value={contentLink}
                      onChange={(e) => setContentLink(e.target.value)}
                      placeholder="https://niti.gov.in/resource..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Read / Estimated Time
                    </label>
                    <input
                      type="text"
                      value={contentReadTime}
                      onChange={(e) => setContentReadTime(e.target.value)}
                      placeholder="e.g. 12 min read"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Thumbnail Image URL
                    </label>
                    <input
                      type="text"
                      value={contentThumbnail}
                      onChange={(e) => setContentThumbnail(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Author / Organization
                    </label>
                    <input
                      type="text"
                      value={contentAuthor}
                      onChange={(e) => setContentAuthor(e.target.value)}
                      placeholder="National Capacity Building Commission"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="contentPubToggle"
                      checked={contentPublished}
                      onChange={(e) => setContentPublished(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="contentPubToggle" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                      Publish to Homepage
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="contentFeatToggle"
                      checked={contentFeatured}
                      onChange={(e) => setContentFeatured(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <label htmlFor="contentFeatToggle" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                      Featured Badge
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowContentModal(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    {editingContentId ? 'Update Resource' : 'Publish Resource'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Pending Approvals Section (Trainers & Courses) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Trainers */}
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Pending Faculty Verifications</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                {pendingTrainers.length} Pending
              </span>
            </div>

            {pendingTrainers.length === 0 ? (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-60" />
                <p>All faculty applicants are fully verified!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTrainers.map((t) => (
                  <div
                    key={t._id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">{t.name}</h4>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">{t.designation} • {t.organization}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleApproveTrainer(t._id)}
                        className="min-h-[40px] px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleRejectTrainer(t._id)}
                        className="min-h-[40px] min-w-[40px] p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                        title="Reject"
                        aria-label="Reject trainer"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('admin-trainers')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 min-h-[44px] cursor-pointer"
            >
              <span>Manage All Trainers Directory</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pending Courses */}
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Pending Curriculum Approvals</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                {pendingCourses.length} In Review
              </span>
            </div>

            {pendingCourses.length === 0 ? (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-60" />
                <p>No new draft courses awaiting approval.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingCourses.map((c) => (
                  <div
                    key={c._id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">{c.title}</h4>
                      <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">By {c.trainerName} • {c.category}</p>
                    </div>

                    <button
                      onClick={() => handleApproveCourse(c._id)}
                      className="min-h-[40px] px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shrink-0 flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-end sm:self-center"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Publish
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('admin-courses')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 min-h-[44px] cursor-pointer"
            >
              <span>Full Curriculum Oversight Console</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Quick Nav Module Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div
          onClick={() => onNavigate('admin-users')}
          className="bg-white dark:bg-[#151B28] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center gap-4 group"
        >
          <div className="w-13 h-13 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Users className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">User Directory & Roles</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Role management and account status toggles</p>
          </div>
        </div>

        <div
          onClick={() => onNavigate('admin-analytics')}
          className="bg-white dark:bg-[#151B28] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center gap-4 group"
        >
          <div className="w-13 h-13 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">National Capacity Analytics</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Competency pillar distribution and trends</p>
          </div>
        </div>

        <div
          onClick={() => onNavigate('admin-logs')}
          className="bg-white dark:bg-[#151B28] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center gap-4 group sm:col-span-2 lg:col-span-1"
        >
          <div className="w-13 h-13 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">System Audit Ledger</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Timestamped administrative actions trail</p>
          </div>
        </div>
      </div>

      {/* Recent Audit Activities */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Recent System Activity Stream</h3>
          </div>

          <button
            onClick={() => onNavigate('admin-logs')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors min-h-[44px] sm:min-h-0 flex items-center cursor-pointer"
          >
            View Full Audit Trail →
          </button>
        </div>

        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log._id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-mono text-[10px] font-bold rounded uppercase">
                  {log.category}
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{log.action}</span>
                <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">• {log.details}</span>
              </div>
              <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
