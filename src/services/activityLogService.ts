import { storageService } from './storageService';
import { ActivityLog, UserRole } from '../types';

export const activityLogService = {
  getLogs(): ActivityLog[] {
    return storageService.getActivityLogs().sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  },

  log(userId: string, userName: string, userRole: UserRole, action: string, entity: string, entityName: string, status: 'success' | 'warning' | 'info' = 'info'): ActivityLog {
    const logs = storageService.getActivityLogs();
    const newLog: ActivityLog = {
      _id: `act-${Date.now()}`,
      time: new Date().toISOString(),
      userId,
      userName,
      userRole,
      action,
      entity,
      entityName,
      status
    };
    const updated = [newLog, ...logs].slice(0, 100); // keep last 100
    storageService.setActivityLogs(updated);
    return newLog;
  }
};
