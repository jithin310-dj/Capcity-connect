import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { storageService } from '../../services/storageService';
import { CourseCard } from '../../components/common/CourseCard';
import { TrainerCard } from '../../components/common/TrainerCard';
import { 
  BookOpen, Award, Users, ShieldCheck, CheckCircle2, 
  ArrowRight, Search, Compass, Shield, 
  Layers, Megaphone, ChevronRight, FileText, Sun, Moon,
  ExternalLink, Sparkles, Trophy, Star, Zap 
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { user, role, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const courses = storageService.getCourses().filter(c => c.status === 'published').slice(0, 4);
  const trainers = storageService.getUsers().filter(u => u.role === 'trainer').slice(0, 3);
  const announcements = storageService.getAnnouncements().slice(0, 3);
  const learningContents = storageService.getLearningContents().filter(c => c.published);
  const achievements = storageService.getAchievements().filter(a => a.status === 'published' && a.featured);

  const stats = [
    { label: 'Enrolled Trainees', value: '12,450+', sub: 'Across 48 institutions' },
    { label: 'Domain Curricula', value: '120+', sub: 'Accredited micro-tracks' },
    { label: 'Vetted Faculty', value: '85+', sub: 'Premier domain specialists' },
    { label: 'Digital Credentials', value: '9,820+', sub: 'Cryptographically verifiable' }
  ];

  const features = [
    {
      icon: Layers,
      title: 'Modular Curriculum Builder',
      description: 'Trainers construct structured learning tracks with rich media, video lectures, presentation slide decks, and downloadable PDF course packs.'
    },
    {
      icon: CheckCircle2,
      title: 'Automated MCQ Evaluations',
      description: 'Timed assessment engines with instant scoring, real-time result tabulation, automated retry rules, and 70% threshold verification.'
    },
    {
      icon: ShieldCheck,
      title: 'Tamper-Evident Certification',
      description: 'Instant PDF credential generation with unique verification hashes and QR codes that anyone can validate publicly.'
    },
    {
      icon: Compass,
      title: 'Competency Matching Matrix',
      description: 'Multi-criteria ranking engine connecting organizational skill gaps with domain-expert trainers based on verified qualifications.'
    },
    {
      icon: Users,
      title: 'Institutional Governance',
      description: 'Comprehensive administrative oversight, approval workflows for faculty onboarding, and course publishing quality gates.'
    },
    {
      icon: FileText,
      title: 'Full Audit Trail & Logs',
      description: 'Exportable CSV reporting, real-time activity tracking, and analytics dashboards across organizational capacity nodes.'
    }
  ];

  const journeySteps = [
    { num: '01', title: 'Profile Setup', desc: 'Define qualifications, skills & learning goals' },
    { num: '02', title: 'Discover & Match', desc: 'Explore courses or use Competency Mapping' },
    { num: '03', title: 'Enroll & Learn', desc: 'Access recorded lectures, slides & materials' },
    { num: '04', title: 'Assessment', desc: 'Pass timed MCQ evaluations (70% threshold)' },
    { num: '05', title: 'Certification', desc: 'Obtain verified digital credential & grow' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-300 flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-200">
      
      {/* Top Public Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs group-hover:bg-blue-500 transition-colors">
              CC
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 dark:text-white text-xs tracking-tight uppercase flex items-center gap-1">
                CAPACITY<span className="text-blue-600 dark:text-blue-400">CONNECT</span>
              </span>
              <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden sm:inline">
                National Capacity Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => onNavigate('courses-explore')}
              className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Explore Courses</span>
            </button>

            <button
              onClick={() => onNavigate('verify-certificate')}
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
            >
              <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Verify Credential</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {user ? (
              <button
                onClick={() => onNavigate(`${role}-dashboard`)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-[#151B28] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-xs rounded-lg border border-slate-200 dark:border-slate-800 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-xs transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-blue-50/50 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800">
        
        {/* Background Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 dark:opacity-30"></div>

        <div className="relative max-w-6xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-400/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Smart India Hackathon 2026 • Problem ID 26075 (Smart Education)
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            Connect Skills. Build Capacity. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-teal-300 dark:to-indigo-300">
              Empower Learning.
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed mb-10">
            A centralized digital platform for organizational capacity building, competency development, 
            course management, MCQ assessment engines, trainer discovery, and verifiable digital certifications.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
            <button
              onClick={() => onNavigate('courses-explore')}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Explore Courses</span>
            </button>

            {user ? (
              <button
                onClick={() => onNavigate(`${role}-dashboard`)}
                className="px-6 py-3.5 bg-slate-900 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white font-bold text-sm rounded-xl border border-slate-800 dark:border-white/20 backdrop-blur-xs transition-all flex items-center gap-2"
              >
                <span>Go to {role?.toUpperCase()} Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('signup')}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2"
              >
                <span>Join Capacity Connect</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onNavigate('verify-certificate')}
              className="px-5 py-3.5 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Verify Certificate</span>
            </button>
          </div>

          {/* Dynamic Ecosystem Visualizer */}
          <div className="max-w-4xl mx-auto bg-white/90 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 backdrop-blur-md shadow-xl dark:shadow-2xl">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
              Integrated Multi-Stakeholder Ecosystem
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              
              <div 
                onClick={() => { switchDemoRole('trainee'); onNavigate('trainee-dashboard'); }}
                className="p-4 rounded-xl bg-blue-50/80 dark:bg-slate-900/80 border border-blue-200 dark:border-blue-500/30 hover:border-blue-400 cursor-pointer transition-all hover:scale-[1.02] group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">TRAINEES</h3>
                  </div>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform">Demo →</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Personalized learning pathways, timed MCQ assessments, competency tracking & instant certificates.
                </p>
              </div>

              <div 
                onClick={() => { switchDemoRole('trainer'); onNavigate('trainer-dashboard'); }}
                className="p-4 rounded-xl bg-emerald-50/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-400 cursor-pointer transition-all hover:scale-[1.02] group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <Award className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">TRAINERS</h3>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">Demo →</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Modular course builder, cloud library upload, questionnaire engine & learner participation analytics.
                </p>
              </div>

              <div 
                onClick={() => { switchDemoRole('admin'); onNavigate('admin-dashboard'); }}
                className="p-4 rounded-xl bg-purple-50/80 dark:bg-slate-900/80 border border-purple-200 dark:border-purple-500/30 hover:border-purple-400 cursor-pointer transition-all hover:scale-[1.02] group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">ADMINS</h3>
                  </div>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold group-hover:translate-x-1 transition-transform">Demo →</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  User approval queues, role governance, system activity logs, announcements & CSV audit reports.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Section 1: Platform Statistics */}
      <section className="relative -mt-10 max-w-6xl mx-auto px-4 w-full z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white dark:bg-[#151B28] rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
          {stats.map((item, idx) => (
            <div key={idx} className="text-center sm:text-left sm:px-4 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800 last:border-none pb-4 sm:pb-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{item.value}</p>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">{item.label}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Featured Courses */}
      <section className="max-w-6xl mx-auto px-4 py-16 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Curriculum Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Featured Capacity Courses</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Curated training tracks designed to uplift organizational & technical competencies.
            </p>
          </div>

          <button
            onClick={() => onNavigate('courses-explore')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 w-fit"
          >
            <span>View All 120+ Courses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onSelect={(id) => onNavigate('course-detail', { courseId: id })}
              onEnroll={(id) => onNavigate('course-detail', { courseId: id })}
            />
          ))}
        </div>
      </section>

      {/* Section 3: Core Innovations */}
      <section className="bg-slate-100/80 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Smart India Hackathon Innovation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Purpose-Built Digital Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Everything organizations need to connect the right trainee with the right course and trainer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#151B28] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 border border-blue-100 dark:border-blue-800/40">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Featured Trainers & Competency Matching Preview */}
      <section className="max-w-6xl mx-auto px-4 py-16 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" />
              <span>Expert Faculty</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Featured Domain Trainers</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Top-rated educators from premier institutes and institutional research cells.
            </p>
          </div>

          <button
            onClick={() => onNavigate('trainer-matching')}
            className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Launch Competency Matching Engine</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <TrainerCard
              key={trainer._id}
              trainer={trainer}
              onViewProfile={() => onNavigate('trainer-matching', { query: trainer.name })}
              onMessage={() => onNavigate('trainee-messages', { targetUserId: trainer._id })}
            />
          ))}
        </div>
      </section>

      {/* Section 5: Learning Journey Roadmap */}
      <section className="bg-white dark:bg-[#0F172A] border-y border-slate-200 dark:border-slate-800 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Step-by-Step Flow</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              The Capacity Building Lifecycle
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {journeySteps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-slate-50 dark:bg-[#151B28] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-blue-600/30 dark:text-blue-400/30 block mb-2">{step.num}</span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
                {idx < 4 && (
                  <ChevronRight className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 text-blue-500 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-xs z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: New Learning Content & Featured Resources */}
      {learningContents.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Knowledge & Research Bank</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                New Learning Content & Featured Resources
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official blueprints, whitepapers, playbooks, and reference materials curated by institutional leadership.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningContents.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={item.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                      {item.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono mb-2">
                      <span className="uppercase">{item.contentType}</span>
                      <span>{item.readTime || '5 min read'}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium truncate max-w-[160px]">
                    By {item.authorName || 'Platform Admin'}
                  </span>

                  {item.resourceLink ? (
                    <a
                      href={item.resourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>Read Resource</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Available</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 7: Live Announcements */}
      <section className="max-w-6xl mx-auto px-4 py-16 w-full">
        <div className="flex items-center gap-2 mb-6">
          <Megaphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Latest Portal Announcements</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {announcements.map((ann) => (
            <div
              key={ann._id}
              className="bg-white dark:bg-[#151B28] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/40 uppercase">
                    {ann.category}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{ann.publishDate}</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">{ann.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">{ann.description}</p>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-3 border-t border-slate-100 dark:border-slate-800 mt-4">
                By: {ann.authorName}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 px-4 border-t border-slate-800 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                CC
              </div>
              <span className="font-bold text-white text-sm">CAPACITY CONNECT</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Smart India Hackathon 2026 project by Team Byteforce. Centralized digital capacity building & learning management portal.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Platform Portals</h4>
            <ul className="space-y-2">
              <li><button onClick={() => { switchDemoRole('trainee'); onNavigate('trainee-dashboard'); }} className="hover:text-white transition-colors">Trainee Learning Space</button></li>
              <li><button onClick={() => { switchDemoRole('trainer'); onNavigate('trainer-dashboard'); }} className="hover:text-white transition-colors">Trainer Creator Studio</button></li>
              <li><button onClick={() => { switchDemoRole('admin'); onNavigate('admin-dashboard'); }} className="hover:text-white transition-colors">Admin Command Center</button></li>
              <li><button onClick={() => onNavigate('verify-certificate')} className="hover:text-white transition-colors">Certificate Verification</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Key Technologies</h4>
            <ul className="space-y-2 text-slate-400">
              <li>React.js & Tailwind CSS</li>
              <li>REST API Architecture</li>
              <li>Role-Based Access Control (RBAC)</li>
              <li>Competency Mapping Algorithm</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Hackathon Info</h4>
            <p className="text-slate-400 leading-relaxed mb-2">
              Problem ID: <strong>26075</strong><br />
              Category: <strong>Software</strong><br />
              Theme: <strong>Smart Education</strong>
            </p>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px] inline-block">
              Team: Byteforce
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 CAPACITY CONNECT • Smart India Hackathon Prototype. All rights reserved.</p>
          <p>Tagline: "Connect Skills. Build Capacity. Empower Learning."</p>
        </div>
      </footer>

    </div>
  );
};
