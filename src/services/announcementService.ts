import { storageService } from './storageService';
import { activityLogService } from './activityLogService';
import { Announcement, UserRole } from '../types';

export const announcementService = {
  getAnnouncements(targetRole?: UserRole): Announcement[] {
    const all = storageService.getAnnouncements();
    if (!targetRole) {
      return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return all.filter((a) => {
      if (a.targetAudience === 'Everyone' || !a.targetAudience) return true;
      if (targetRole === 'trainee' && (a.targetAudience === 'Trainees' || a.targetRole === 'trainee')) return true;
      if (targetRole === 'trainer' && (a.targetAudience === 'Trainers' || a.targetRole === 'trainer')) return true;
      return false;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  publishAnnouncement(
    adminIdOrData: string | Partial<Announcement>,
    adminName?: string,
    data?: Partial<Announcement>
  ): Announcement {
    let adminId = 'u-admin-1';
    let aName = 'Director General (Admin)';
    let annData: Partial<Announcement> = {};

    if (typeof adminIdOrData === 'object') {
      annData = adminIdOrData;
      adminId = annData.authorId || 'u-admin-1';
      aName = annData.authorName || 'Director General (Admin)';
    } else {
      adminId = adminIdOrData;
      aName = adminName || 'Director General (Admin)';
      annData = data || {};
    }

    const announcements = storageService.getAnnouncements();
    const newAnnouncement: Announcement = {
      _id: `ann-${Date.now()}`,
      title: annData.title || 'General Platform Notice',
      description: annData.description || annData.content || '',
      content: annData.content || annData.description || '',
      category: annData.category || 'General',
      priority: annData.priority || 'medium',
      targetAudience: annData.targetAudience || (annData.targetRole === 'trainee' ? 'Trainees' : annData.targetRole === 'trainer' ? 'Trainers' : 'Everyone'),
      targetRole: annData.targetRole || 'all',
      authorId: adminId,
      courseId: annData.courseId,
      publishDate: annData.publishDate || new Date().toISOString().split('T')[0],
      authorName: aName,
      authorRole: annData.authorRole || 'admin',
      createdAt: new Date().toISOString()
    };

    const updated = [newAnnouncement, ...announcements];
    storageService.setAnnouncements(updated);

    activityLogService.log(adminId, aName, 'admin', 'Published Announcement', 'Announcement', newAnnouncement.title, 'success');

    return newAnnouncement;
  },

  createAnnouncement(data: Partial<Announcement>): Announcement {
    return this.publishAnnouncement(data);
  },

  deleteAnnouncement(
    adminIdOrId: string,
    adminName?: string,
    id?: string
  ): void {
    let targetId = adminIdOrId;
    let adminId = 'u-admin-1';
    let aName = 'Admin';

    if (id) {
      adminId = adminIdOrId;
      aName = adminName || 'Admin';
      targetId = id;
    }

    const announcements = storageService.getAnnouncements();
    const target = announcements.find((a) => a._id === targetId);
    if (!target) return;

    const filtered = announcements.filter((a) => a._id !== targetId);
    storageService.setAnnouncements(filtered);

    activityLogService.log(adminId, aName, 'admin', 'Deleted Announcement', 'Announcement', target.title, 'warning');
  }
};
