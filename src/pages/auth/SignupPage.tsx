import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';
import { User, Mail, Lock, Building, Briefcase, ArrowRight, GraduationCap, Sun, Moon } from 'lucide-react';

interface SignupPageProps {
  onNavigate: (view: string) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('trainee');
  const [organization, setOrganization] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [yearsOfExp, setYearsOfExp] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !organization) {
      showToast('Please fill in all mandatory fields', 'error');
      return;
    }

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    const result = await register({
      name,
      email,
      password,
      role,
      organization,
      designation: designation || (role === 'trainer' ? 'Senior Trainer' : 'Officer Trainee'),
      department: department || 'Operations',
      skills: skills.length > 0 ? skills : ['General Management', 'Digital Literacy'],
      yearsOfExperience: Number(yearsOfExp)
    });
    setIsSubmitting(false);

    if (result.success) {
      if (role === 'trainer') onNavigate('trainer-dashboard');
      else onNavigate('trainee-dashboard');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl max-w-lg w-full p-8 relative">
        
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

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-800 text-white font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
            CC
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Your Account</h2>
          <p className="text-xs text-slate-500 mt-1">CAPACITY CONNECT • Digital Capacity Building & LMS</p>
        </div>

        {/* Role Selector */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 mb-2">Select Your Role</label>
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => setRole('trainee')}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                role === 'trainee'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-950'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${role === 'trainee' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold">Trainee / Learner</p>
                <p className="text-[10px] text-slate-500">Take courses & earn certificates</p>
              </div>
            </div>

            <div
              onClick={() => setRole('trainer')}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                role === 'trainer'
                  ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${role === 'trainer' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold">Trainer / Expert</p>
                <p className="text-[10px] text-slate-500">Create courses & assess learners</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name || ''}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email || ''}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.org"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
            <input
              type="password"
              required
              value={password || ''}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Organization *</label>
              <input
                type="text"
                required
                value={organization || ''}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. National Informatics Centre"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                value={designation || ''}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Assistant Director"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
            <input
              type="text"
              value={department || ''}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. E-Governance & Information Tech"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Skills (comma separated)</label>
            <input
              type="text"
              value={skillsInput || ''}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Python, Machine Learning, Leadership, Data Governance"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {role === 'trainer' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Years of Experience</label>
              <input
                type="number"
                min="0"
                max="50"
                value={yearsOfExp ?? 1}
                onChange={(e) => setYearsOfExp(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Registering...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Already registered?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="font-bold text-blue-600 hover:text-blue-800"
          >
            Sign In here
          </button>
        </div>

      </div>
    </div>
  );
};
