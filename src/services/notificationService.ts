import { storageService } from './storageService';
import { Notification } from '../types';

export const notificationService = {
  getNotifications(userId: string): Notification[] {
    const notifications = storageService.getNotifications();
    return notifications
      .filter((n) => n.userId === userId || n.userId === 'all')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getUnreadCount(userId: string): number {
    return this.getNotifications(userId).filter((n) => !n.read).length;
  },

  markAsRead(id: string): void {
    const notifications = storageService.getNotifications();
    const idx = notifications.findIndex((n) => n._id === id);
    if (idx !== -1) {
      notifications[idx].read = true;
      storageService.setNotifications(notifications);
    }
  },

  markAllAsRead(userId: string): void {
    const notifications = storageService.getNotifications();
    notifications.forEach((n) => {
      if (n.userId === userId || n.userId === 'all') {
        n.read = true;
      }
    });
    storageService.setNotifications(notifications);
  },

  sendNotification(notification: Omit<Notification, '_id' | 'createdAt' | 'read'>): Notification {
    const notifications = storageService.getNotifications();
    const newNotif: Notification = {
      _id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
      ...notification
    };
    storageService.setNotifications([newNotif, ...notifications]);
    return newNotif;
  }
};
