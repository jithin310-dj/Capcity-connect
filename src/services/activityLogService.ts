import { storageService } from './storageService';
import { ActivityLog, UserRole } from '../types';

export const activityLogService = {
  getLogs(): ActivityLog[] {
    return storageService.getActivityLogs().sort((a, b) => {
      const timeA = a.time || a.timestamp || '';
      const timeB = b.time || b.timestamp || '';
      return new Date(timeB).getTime() - new Date(timeA).getTime();
    });
  },

  log(userId: string, userName: string, userRole: UserRole, action: string, entity: string, entityName: string, status: 'success' | 'warning' | 'info' = 'info'): ActivityLog {
    const logs = storageService.getActivityLogs();
    const now = new Date().toISOString();
    const newLog: ActivityLog = {
      _id: `act-${Date.now()}`,
      time: now,
      timestamp: now,
      userId,
      userName,
      userRole,
      action,
      entity,
      entityName,
      details: entityName || `${action} on ${entity}`,
      category: (entity || 'admin').toLowerCase(),
      status
    };
    const updated = [newLog, ...logs].slice(0, 100); // keep last 100
    storageService.setActivityLogs(updated);
    return newLog;
  }
};
