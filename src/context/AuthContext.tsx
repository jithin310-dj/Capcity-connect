import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, RegisterDTO } from '../services/authService';
import { userService } from '../services/userService';
import { storageService } from '../services/storageService';
import { User, UserRole } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterDTO) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  updateUserProfile: (partial: Partial<User>) => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Bootstrap initial storage and user
    storageService.initStorage();
    const current = authService.getCurrentUser();
    // Default to trainee if not logged in for instant judges exploration
    if (!current) {
      const defaultTrainee = authService.switchDemoUser('trainee');
      setUser(defaultTrainee);
    } else {
      setUser(current);
    }
    setIsLoading(false);
  }, []);

  const refreshUser = () => {
    const current = authService.getCurrentUser();
    setUser(current);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await authService.login(email, password);
    setIsLoading(false);

    if (result.success && result.user) {
      setUser(result.user);
      showToast(`Welcome back, ${result.user.name}!`, 'success');
      return { success: true };
    } else {
      showToast(result.error || 'Login failed', 'error');
      return { success: false, error: result.error };
    }
  };

  const register = async (data: RegisterDTO) => {
    setIsLoading(true);
    const result = await authService.register(data);
    setIsLoading(false);

    if (result.success && result.user) {
      setUser(result.user);
      showToast(`Account registered successfully as ${data.role.toUpperCase()}!`, 'success');
      return { success: true };
    } else {
      showToast(result.error || 'Registration failed', 'error');
      return { success: false, error: result.error };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  const switchDemoRole = (targetRole: UserRole) => {
    const newUser = authService.switchDemoUser(targetRole);
    setUser(newUser);
    showToast(`Switched active session to ${targetRole.toUpperCase()}: ${newUser.name}`, 'info');
  };

  const updateUserProfile = (partial: Partial<User>) => {
    if (!user) return;
    const updated = userService.updateProfile(user._id, partial);
    setUser(updated);
    showToast('Profile updated successfully!', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
        updateUserProfile,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
