import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { announcementService } from '../../services/announcementService';
import { useToast } from '../../context/ToastContext';
import { Announcement } from '../../types';
import { Megaphone, Plus, Trash2, CheckCircle2, AlertTriangle, Info, Clock, Sparkles } from 'lucide-react';

export const AdminAnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [announcements, setAnnouncements] = useState<Announcement[]>(storageService.getAnnouncements());
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [targetRole, setTargetRole] = useState<'all' | 'trainee' | 'trainer'>('all');

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !user) {
      showToast('Please enter title and announcement content', 'warning');
      return;
    }

    announcementService.createAnnouncement({
      title,
      content,
      priority,
      targetRole,
      authorId: user._id,
      authorName: user.name,
      authorRole: user.role
    });

    setAnnouncements(storageService.getAnnouncements());
    setShowModal(false);
    setTitle('');
    setContent('');
    showToast('Platform announcement broadcasted successfully!', 'success');
  };

  const handleDelete = (id: string) => {
    announcementService.deleteAnnouncement(id);
    setAnnouncements(storageService.getAnnouncements());
    showToast('Announcement removed', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-7 h-7 text-indigo-600" />
            <span>Platform Broadcast & Institutional Announcements</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish systemic updates, compliance notices, and accreditation schedules to all users.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Broadcast</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann._id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-3 relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
                    ann.priority === 'high'
                      ? 'bg-rose-100 text-rose-800'
                      : ann.priority === 'medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {ann.priority} Priority
                </span>

                <span className="text-xs text-slate-400">
                  Target: <strong className="text-slate-700 capitalize">{ann.targetRole}</strong>
                </span>
              </div>

              <button
                onClick={() => handleDelete(ann._id)}
                className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg"
                title="Delete Announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-extrabold text-slate-900 text-base">{ann.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{ann.content}</p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Posted by: <strong className="text-slate-700">{ann.authorName}</strong></span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(ann.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create System Announcement</h3>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mandatory DPDP Compliance Verification Scheduled"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="low">Low Notice</option>
                    <option value="medium">Medium</option>
                    <option value="high">High Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="all">All Portal Users</option>
                    <option value="trainee">Trainees Only</option>
                    <option value="trainer">Trainers Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Body Content *</label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Full text details of announcement..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Broadcast Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
