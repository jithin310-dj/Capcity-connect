import { storageService } from './storageService';
import { activityLogService } from './activityLogService';
import { User, UserRole, UserStatus } from '../types';

export const userService = {
  getUsers(): User[] {
    return storageService.getUsers();
  },

  getUserById(id: string): User | undefined {
    return storageService.getUsers().find((u) => u._id === id);
  },

  getTrainers(): User[] {
    return storageService.getUsers().filter((u) => u.role === 'trainer' && (u.status === 'approved' || u.status === 'active'));
  },

  getTrainees(): User[] {
    return storageService.getUsers().filter((u) => u.role === 'trainee');
  },

  updateProfile(userId: string, partial: Partial<User>): User {
    const users = storageService.getUsers();
    const index = users.findIndex((u) => u._id === userId);
    if (index === -1) throw new Error('User not found');

    const updatedUser = {
      ...users[index],
      ...partial,
      updatedAt: new Date().toISOString()
    };
    users[index] = updatedUser;
    storageService.setUsers(users);

    const currentUser = storageService.getCurrentAuthUser();
    if (currentUser && currentUser._id === userId) {
      storageService.setCurrentAuthUser(updatedUser);
    }

    activityLogService.log(userId, updatedUser.name, updatedUser.role, 'Updated Profile', 'User Profile', updatedUser.name, 'info');

    return updatedUser;
  },

  updateUserProfile(userId: string, partial: Partial<User>): User {
    return this.updateProfile(userId, partial);
  },

  updateStatus(adminId: string, adminName: string, targetUserId: string, status: UserStatus): User {
    const users = storageService.getUsers();
    const index = users.findIndex((u) => u._id === targetUserId);
    if (index === -1) throw new Error('Target user not found');

    const targetUser = users[index];
    targetUser.status = status;
    targetUser.updatedAt = new Date().toISOString();
    users[index] = targetUser;
    storageService.setUsers(users);

    activityLogService.log(adminId, adminName, 'admin', `Changed Status to ${status.toUpperCase()}`, 'User Account', targetUser.name, 'success');

    return targetUser;
  },

  updateUserStatus(targetUserId: string, status: UserStatus): User {
    return this.updateStatus('u-admin-1', 'Admin', targetUserId, status);
  },

  updateRole(adminId: string, adminName: string, targetUserId: string, newRole: UserRole): User {
    const users = storageService.getUsers();
    const index = users.findIndex((u) => u._id === targetUserId);
    if (index === -1) throw new Error('Target user not found');

    const targetUser = users[index];
    const oldRole = targetUser.role;
    targetUser.role = newRole;
    targetUser.updatedAt = new Date().toISOString();
    users[index] = targetUser;
    storageService.setUsers(users);

    activityLogService.log(adminId, adminName, 'admin', `Changed Role from ${oldRole.toUpperCase()} to ${newRole.toUpperCase()}`, 'User Role', targetUser.name, 'warning');

    return targetUser;
  },

  deleteUser(targetUserId: string, adminId = 'u-admin-1', adminName = 'Admin'): void {
    const users = storageService.getUsers();
    const target = users.find((u) => u._id === targetUserId);
    if (!target) return;

    const filtered = users.filter((u) => u._id !== targetUserId);
    storageService.setUsers(filtered);

    activityLogService.log(adminId, adminName, 'admin', 'Deleted User Account', 'User Account', target.name, 'warning');
  }
};
