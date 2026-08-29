import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { Notification } from '../../types';
import { Bell, Check, Award, AlertTriangle, Info, Clock, CheckCircle2, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface NotificationsPageProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const userId = user?._id || 'u-trainee-1';

  const [notifications, setNotifications] = useState<Notification[]>(
    notificationService.getNotifications(userId)
  );
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead(userId);
    setNotifications(notificationService.getNotifications(userId));
    showToast('All notifications marked as read', 'info');
  };

  const handleItemClick = (notif: Notification) => {
    notificationService.markAsRead(notif._id);
    setNotifications(notificationService.getNotifications(userId));

    if (notif.link) {
      if (notif.link.includes('certificates')) onNavigate('trainee-certificates');
      else if (notif.link.includes('assessments')) onNavigate('trainee-assessments');
      else if (notif.link.includes('learners')) onNavigate('trainer-learners');
      else if (notif.link.includes('courses')) onNavigate('courses-explore');
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'certificate':
        return <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'deadline':
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>Notification Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            System announcements, certification alerts, course reminders, and message notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${filter === 'all' ? 'bg-white dark:bg-[#151B28] shadow-2xs text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg transition-colors ${filter === 'unread' ? 'bg-white dark:bg-[#151B28] shadow-2xs text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Unread
            </button>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden transition-colors">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500 text-xs">
            <Bell className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2 opacity-50" />
            <p>No notifications found in this view.</p>
          </div>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleItemClick(notif)}
              className={`p-4 sm:p-5 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 cursor-pointer transition-colors ${
                !notif.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
              }`}
            >
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xs shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className={`text-sm ${!notif.read ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-700 dark:text-slate-300'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                  {notif.message}
                </p>

                {notif.link && (
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-block">
                    View Details →
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
