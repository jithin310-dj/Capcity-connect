import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { Notification } from '../../types';
import { Bell, Check, Award, AlertTriangle, Info, Clock, CheckCircle2 } from 'lucide-react';

interface NotificationDropdownProps {
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose, onNavigate }) => {
  const { user } = useAuth();
  const notifications = user ? notificationService.getNotifications(user._id) : [];

  const handleMarkAllRead = () => {
    if (user) {
      notificationService.markAllAsRead(user._id);
      onClose();
    }
  };

  const handleNotificationClick = (notif: Notification) => {
    notificationService.markAsRead(notif._id);
    onClose();
    if (notif.link) {
      // Map path to internal view
      if (notif.link.includes('certificates')) onNavigate('trainee-certificates');
      else if (notif.link.includes('assessments')) onNavigate('trainee-assessments');
      else if (notif.link.includes('learners')) onNavigate('trainer-learners');
      else if (notif.link.includes('feedback')) onNavigate('trainer-feedback');
      else if (notif.link.includes('users')) onNavigate('admin-users');
      else if (notif.link.includes('courses')) onNavigate('courses-explore');
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'certificate':
        return <Award className="w-4 h-4 text-purple-600" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'deadline':
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#151B28] rounded border border-slate-800 py-1 z-50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150 text-slate-300 font-sans">
      <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between bg-[#0F172A]">
        <div className="flex items-center gap-1.5 font-mono">
          <Bell className="w-3.5 h-3.5 text-slate-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">EVENT FEED</h4>
        </div>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="text-[10px] font-mono font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            CLEAR ALL
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs font-mono">
            <Bell className="w-6 h-6 mx-auto text-slate-600 mb-1.5 opacity-50" />
            <p>NO NEW EVENTS</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-2.5 flex items-start gap-2.5 hover:bg-slate-800/80 cursor-pointer transition-colors ${
                !notif.read ? 'bg-blue-500/5' : ''
              }`}
            >
              <div className="p-1.5 rounded bg-[#0B0F19] border border-slate-800 shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <p className={`text-xs font-mono ${!notif.read ? 'font-bold text-white' : 'text-slate-300'} truncate`}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
                <span className="text-[9px] font-mono text-slate-500 mt-1 block flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {new Date(notif.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
