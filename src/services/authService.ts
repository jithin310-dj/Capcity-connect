import { storageService } from './storageService';
import { activityLogService } from './activityLogService';
import { User, UserRole } from '../types';

export interface RegisterDTO {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  organization?: string;
  designation?: string;
  department?: string;
  skills?: string[];
  yearsOfExperience?: number;
}

export const authService = {
  getCurrentUser(): User | null {
    const cached = storageService.getCurrentAuthUser();
    if (!cached) return null;
    // Always sync with latest record in user table
    const users = storageService.getUsers();
    const found = users.find((u) => u._id === cached._id);
    if (found) {
      if (found.status === 'suspended') {
        this.logout();
        return null;
      }
      return found;
    }
    return cached;
  },

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const users = storageService.getUsers();
    const user = users.find((u) => u.email.toLowerCase().trim() === email.toLowerCase().trim());

    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (user.passwordHash && user.passwordHash !== password) {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    if (user.status === 'suspended') {
      return { success: false, error: 'Your account has been suspended by an administrator. Please contact support.' };
    }

    if (user.status === 'pending') {
      return { success: false, error: 'Your account registration is pending administrative review and approval.' };
    }

    storageService.setCurrentAuthUser(user);
    activityLogService.log(user._id, user.name, user.role, 'User Logged In', 'Session', `${user.role.toUpperCase()} Authentication`, 'success');

    return {
      success: true,
      user,
      token: `jwt_cc_${user._id}_${Date.now()}`
    };
  },

  async register(data: RegisterDTO): Promise<{ success: boolean; user?: User; message?: string; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const users = storageService.getUsers();
    const exists = users.some((u) => u.email.toLowerCase().trim() === data.email.toLowerCase().trim());

    if (exists) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser: User = {
      _id: `usr-${data.role}-${Date.now()}`,
      name: data.name,
      email: data.email,
      passwordHash: data.password,
      role: data.role,
      phone: data.phone || '+91 98765 00000',
      organization: data.organization || 'Public Sector / Institutional Organization',
      designation: data.designation || (data.role === 'trainer' ? 'Senior Technical Trainer' : 'Trainee Officer'),
      department: data.department || 'Capacity Development Cell',
      avatar: data.role === 'trainer' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      qualifications: [],
      skills: data.skills && data.skills.length > 0 ? data.skills : (data.role === 'trainer' ? ['Technical Training', 'Curriculum Design'] : ['General Administration']),
      interests: ['Capacity Development', 'Digital Skills'],
      experience: [],
      certificates: [],
      status: 'approved', // Auto-approved for smooth demo flow
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [...users, newUser];
    storageService.setUsers(updated);

    activityLogService.log(newUser._id, newUser.name, newUser.role, 'User Registered', 'User', `${newUser.name} (${newUser.role})`, 'info');

    // Auto-login registered user
    storageService.setCurrentAuthUser(newUser);

    return {
      success: true,
      user: newUser,
      message: 'Account registered successfully!'
    };
  },

  logout(): void {
    const current = storageService.getCurrentAuthUser();
    if (current) {
      activityLogService.log(current._id, current.name, current.role, 'User Logged Out', 'Session', 'Session Terminated', 'info');
    }
    storageService.setCurrentAuthUser(null);
  },

  switchDemoUser(role: UserRole): User {
    const users = storageService.getUsers();
    let target = users.find((u) => u.role === role && (u.status === 'approved' || u.status === 'active'));
    if (!target) {
      target = users.find((u) => u.role === role);
    }
    if (target) {
      storageService.setCurrentAuthUser(target);
      activityLogService.log(target._id, target.name, target.role, 'Switched Demo Account', 'Session', `Role: ${role.toUpperCase()}`, 'info');
      return target;
    }
    throw new Error(`No user found for role ${role}`);
  }
};
