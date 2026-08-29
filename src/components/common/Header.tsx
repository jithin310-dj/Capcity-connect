import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationService } from '../../services/notificationService';
import { 
  Search, Bell, Menu, ChevronDown, User, LogOut, Shield, 
  ExternalLink, Sun, Moon
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { GlobalSearchModal } from './GlobalSearchModal';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onNavigate: (view: string) => void;
  currentView?: string;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onNavigate, currentView, onOpenSearch }) => {
  const { user, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Global keyboard shortcuts: Esc to close dropdowns/menus, Ctrl+/ or Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowUserMenu(false);
        setShowSearchModal(false);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === '/' || e.key === 'k')) {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadCount = user ? notificationService.getUnreadCount(user._id) : 0;

  const roleColor = {
    trainee: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30',
    trainer: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
    admin: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30'
  }[role || 'trainee'];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 py-2.5 transition-colors text-slate-700 dark:text-slate-300">
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Brand & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Toggle sidebar navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div 
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 cursor-pointer group select-none py-1"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs group-hover:bg-blue-500 transition-colors shrink-0">
                CC
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight uppercase flex items-center gap-1">
                  CAPACITY<span className="text-blue-600 dark:text-blue-400">CONNECT</span>
                </span>
                <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden sm:inline">
                  LMS & Capacity Node
                </span>
              </div>
            </div>
          </div>

          {/* Center: Global Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              type="button"
              onClick={() => setShowSearchModal(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs bg-slate-100 dark:bg-[#151B28] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all font-mono min-h-[40px] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span className="text-xs">Search courses, trainers, competencies...</span>
              </div>
              <kbd className="text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 shadow-2xs">
                CTRL+/
              </kbd>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="md:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
              title="Search"
              aria-label="Open search dialog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Public Certificate Verification Link */}
            <button
              onClick={() => onNavigate('verify-certificate')}
              className="hidden xl:flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#151B28] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/40 transition-all cursor-pointer min-h-[40px]"
            >
              <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>VERIFY CERTIFICATE</span>
            </button>

            {/* Dark / Light Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center group cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 group-hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationDropdown
                  onClose={() => setShowNotifications(false)}
                  onNavigate={onNavigate}
                />
              )}
            </div>

            {/* User Profile / Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 sm:px-2 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-[#151B28] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors min-h-[44px] cursor-pointer"
                  aria-label="User menu"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500/30 shrink-0"
                  />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[110px] leading-none">
                      {user.name}
                    </span>
                    <span className={`text-[9px] font-mono uppercase tracking-wider px-1 py-0.2 rounded border inline-block w-fit mt-0.5 ${roleColor}`}>
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#151B28] rounded-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{user.organization}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate(`${role}-profile`);
                        }}
                        className="w-full px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 text-left"
                      >
                        <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Credentials & Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          toggleTheme();
                        }}
                        className="w-full px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-2">
                          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
                          <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                        </div>
                        <span className="text-[10px] font-mono uppercase text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Toggle</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate('landing');
                        }}
                        className="w-full px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 text-left"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        <span>Portal Homepage</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                          onNavigate('login');
                        }}
                        className="w-full px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2 text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-2.5 py-1 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors"
                >
                  LOG IN
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-2.5 py-1 text-xs font-mono font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-xs transition-colors"
                >
                  REGISTER
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      {showSearchModal && (
        <GlobalSearchModal
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onNavigate={(v) => {
            setShowSearchModal(false);
            onNavigate(v);
          }}
        />
      )}
    </>
  );
};
