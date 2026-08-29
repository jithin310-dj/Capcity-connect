import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  LayoutDashboard, BookOpen, Search, CheckSquare, Award, 
  Compass, Users, MessageSquare, Bell, User, Settings, 
  PlusCircle, FileQuestion, FolderGit2, BarChart3, Star, 
  UserCheck, Megaphone, Activity, Layers, Sun, Moon
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose }) => {
  const { user, role } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    onClose();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const traineeLinks = [
    { id: 'trainee-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trainee-courses', label: 'My Learning', icon: BookOpen },
    { id: 'courses-explore', label: 'Explore Courses', icon: Search },
    { id: 'trainee-assessments', label: 'Assessments', icon: CheckSquare },
    { id: 'trainee-certificates', label: 'Certificates', icon: Award },
    { id: 'trainee-competencies', label: 'Competencies', icon: Compass },
    { id: 'trainee-trainer-matching', label: 'Trainer Matching', icon: Users, badge: 'Smart' },
    { id: 'trainee-messages', label: 'Messages', icon: MessageSquare },
    { id: 'trainee-notifications', label: 'Notifications', icon: Bell },
    { id: 'trainee-profile', label: 'Profile', icon: User },
    { id: 'trainee-settings', label: 'Settings', icon: Settings }
  ];

  const trainerLinks = [
    { id: 'trainer-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trainer-courses', label: 'My Courses', icon: BookOpen },
    { id: 'trainer-create-course', label: 'Create Course', icon: PlusCircle },
    { id: 'trainer-questionnaires', label: 'Questionnaires', icon: FileQuestion },
    { id: 'trainer-library', label: 'Trainer Library', icon: FolderGit2, badge: 'Cloud' },
    { id: 'trainer-learners', label: 'Learners', icon: Users },
    { id: 'trainer-analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'trainer-feedback', label: 'Feedback & Ratings', icon: Star },
    { id: 'trainer-competency-matching', label: 'Competency Matching', icon: Compass },
    { id: 'trainer-messages', label: 'Messages', icon: MessageSquare },
    { id: 'trainer-notifications', label: 'Notifications', icon: Bell },
    { id: 'trainer-profile', label: 'Profile', icon: User },
    { id: 'trainer-settings', label: 'Settings', icon: Settings }
  ];

  const adminLinks = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-users', label: 'User Management', icon: Users, badge: 'Approval' },
    { id: 'admin-roles', label: 'Role Management', icon: UserCheck },
    { id: 'admin-courses', label: 'Courses Monitor', icon: BookOpen },
    { id: 'admin-enrollments', label: 'Enrollments', icon: Layers },
    { id: 'admin-assessments', label: 'Assessments', icon: CheckSquare },
    { id: 'admin-certificates', label: 'Certificates', icon: Award },
    { id: 'admin-announcements', label: 'Announcements', icon: Megaphone },
    { id: 'admin-competency-mapping', label: 'Competency Mapping', icon: Compass },
    { id: 'admin-reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'admin-activity', label: 'System Activity Logs', icon: Activity },
    { id: 'admin-settings', label: 'Settings & Data Reset', icon: Settings }
  ];

  const links = role === 'admin' ? adminLinks : role === 'trainer' ? trainerLinks : traineeLinks;

  const roleTheme = {
    trainee: {
      badge: 'TRAINEE_NODE',
      color: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
      activeItem: 'bg-blue-50 dark:bg-[#151B28] text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-slate-700 font-semibold shadow-2xs'
    },
    trainer: {
      badge: 'FACULTY_NODE',
      color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30',
      activeItem: 'bg-emerald-50 dark:bg-[#151B28] text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-slate-700 font-semibold shadow-2xs'
    },
    admin: {
      badge: 'ADMIN_ROOT',
      color: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30',
      activeItem: 'bg-purple-50 dark:bg-[#151B28] text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-slate-700 font-semibold shadow-2xs'
    }
  }[role || 'trainee'];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-2xs lg:hidden transition-opacity"
          aria-label="Close mobile navigation menu"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-60 bg-white dark:bg-[#0B0F19] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0F172A]">
          <div 
            onClick={() => {
              handleNavClick(role === 'admin' ? 'admin-dashboard' : role === 'trainer' ? 'trainer-dashboard' : 'trainee-dashboard');
            }}
            className="flex items-center gap-2.5 cursor-pointer group py-1"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs group-hover:bg-blue-500 transition-colors shrink-0">
              CC
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-xs leading-none tracking-tight">CAPACITY CONNECT</h2>
              <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border inline-block mt-1 ${roleTheme.color}`}>
                {roleTheme.badge}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
            title="Close menu"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Navigation items list */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          <p className="px-3 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono mb-2">
            // NAVIGATION
          </p>
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full min-h-[44px] sm:min-h-[40px] flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? roleTheme.activeItem
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#151B28]/70'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className="truncate text-xs font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom User Card & Theme Switcher in Sidebar */}
        <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] space-y-2">
          {/* Quick Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="w-full min-h-[44px] sm:min-h-[40px] flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-[#151B28] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-all font-mono shadow-2xs cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 shrink-0" />
              )}
              <span className="text-xs font-medium">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              Switch
            </span>
          </button>

          {user && (
            <button
              onClick={() => handleNavClick(`${role}-profile`)}
              className="w-full min-h-[48px] text-left flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#151B28] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all group shadow-2xs cursor-pointer"
              title="View profile & settings"
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-300 dark:ring-slate-700 group-hover:ring-blue-500 transition-colors"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate leading-tight transition-colors">{user.name}</p>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate leading-none mt-0.5">{user.designation || user.role}</p>
              </div>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
