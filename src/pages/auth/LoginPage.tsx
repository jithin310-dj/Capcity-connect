import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';
import { Lock, Mail, ArrowRight, User, Shield, GraduationCap, Sparkles, CheckCircle2, Sun, Moon } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (view: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [email, setEmail] = useState('rahul.varma@example.com');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      if (email.includes('admin')) {
        onNavigate('admin-dashboard');
      } else if (email.includes('ananya')) {
        onNavigate('trainer-dashboard');
      } else {
        onNavigate('trainee-dashboard');
      }
    }
  };

  const handleDemoPreset = (presetRole: UserRole) => {
    switchDemoRole(presetRole);
    if (presetRole === 'admin') onNavigate('admin-dashboard');
    else if (presetRole === 'trainer') onNavigate('trainer-dashboard');
    else onNavigate('trainee-dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl max-w-md w-full p-8 relative">
        
        {/* Top Right Theme Switch */}
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-800 text-white font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
            CC
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to Portal</h2>
          <p className="text-xs text-slate-500 mt-1">CAPACITY CONNECT • Digital Learning Management</p>
        </div>

        {/* Demo Quick Logins for Hackathon Judges */}
        <div className="mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>SIH 2026 1-Click Demo Logins</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoPreset('trainee')}
              className="px-2 py-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 text-xs font-bold flex flex-col items-center gap-1 transition-all shadow-2xs"
            >
              <User className="w-4 h-4 text-blue-600" />
              <span>Trainee</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoPreset('trainer')}
              className="px-2 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 text-xs font-bold flex flex-col items-center gap-1 transition-all shadow-2xs"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Trainer</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoPreset('admin')}
              className="px-2 py-2 rounded-xl bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-800 text-xs font-bold flex flex-col items-center gap-1 transition-all shadow-2xs"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.org"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <span className="text-[11px] text-slate-400 font-medium">Demo: password123</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="font-bold text-blue-600 hover:text-blue-800"
          >
            Create one here
          </button>
        </div>

      </div>
    </div>
  );
};
