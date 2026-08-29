import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { storageService } from '../../services/storageService';
import { CertificateModal } from '../../components/common/CertificateModal';
import { Certificate } from '../../types';
import { 
  User, Mail, Phone, Building, Briefcase, MapPin, 
  GraduationCap, Award, Plus, X, Save, CheckCircle2, ShieldCheck, Sparkles, Sun, Moon 
} from 'lucide-react';

export const TraineeProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const certificates = user ? storageService.getCertificates().filter((c) => c.traineeId === user._id) : [];

  const [name, setName] = useState(user?.name || 'Rahul Varma');
  const [email, setEmail] = useState(user?.email || 'rahul.varma@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [organization, setOrganization] = useState(user?.organization || 'National Informatics Centre (NIC)');
  const [designation, setDesignation] = useState(user?.designation || 'Senior Assistant Director');
  const [department, setDepartment] = useState(user?.department || 'Digital Services & Public Infrastructure');
  const [location, setLocation] = useState(user?.location || 'New Delhi, India');
  const [bio, setBio] = useState(user?.bio || 'Public sector officer specializing in digital public infrastructure, enterprise governance, and scalable capacity building.');

  const [skills, setSkills] = useState<string[]>(user?.skills || ['Data Governance', 'Python', 'Leadership', 'Cloud Security']);
  const [newSkill, setNewSkill] = useState('');

  const [interests, setInterests] = useState<string[]>(user?.interests || ['AI in Governance', 'Cybersecurity Policies', 'Agile Project Management']);
  const [newInterest, setNewInterest] = useState('');

  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter((i) => i !== interestToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      organization,
      designation,
      department,
      location,
      bio,
      skills,
      interests
    });
  };

  // Profile strength calculation
  const profileStrength = Math.min(100, 40 + (skills.length * 5) + (interests.length * 5) + (certificates.length * 10));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Profile Header & Strength Meter */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-blue-500/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wide">
                  {user?.role || 'Trainee'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">{designation} • {organization}</p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {location}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl w-full sm:w-64">
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Profile Strength
              </span>
              <span className="text-blue-600">{profileStrength}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${profileStrength}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">Add skills and complete courses to reach 100%</p>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="pt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Location / City</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Organization</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Professional Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Skills Management */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Verified & Practiced Skills</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill (e.g. Prompt Engineering)"
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
              >
                Add
              </button>
            </div>
          </div>

          {/* Learning Interests */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Learning Interests</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  {interest}
                  <button type="button" onClick={() => handleRemoveInterest(interest)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add interest (e.g. Edge AI)"
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
              >
                Add
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Appearance & Interface Theme Preferences */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Appearance & Interface Theme</h2>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase">
            Active: {theme === 'dark' ? 'Dark Theme' : 'Light Theme'}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Select your visual theme preference. The setting is securely saved to your local session and profile.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Light Mode</h4>
              <p className="text-xs text-slate-500 mt-0.5">High-contrast bright canvas designed for daylight training environments.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
              theme === 'dark'
                ? 'border-blue-600 bg-slate-900 text-white shadow-xs ring-2 ring-blue-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-900/60 text-indigo-400 flex items-center justify-center shrink-0 shadow-2xs">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Dark Mode</h4>
              <p className="text-xs text-slate-500 mt-0.5">Deep slate palette with reduced glare for low-light officer workstations.</p>
            </div>
          </button>
        </div>
      </div>

      {/* Earned Certificates on Profile */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-slate-900">Verified Credentials & Accreditations</h2>
        </div>

        {certificates.length === 0 ? (
          <p className="text-xs text-slate-400">No certificates earned yet. Complete courses & pass assessments to earn credentials.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert._id}
                className="p-4 rounded-2xl border border-purple-200 bg-purple-50/40 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    {cert.certificateId}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1.5">{cert.courseTitle}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Score: {cert.score}% • Issued: {cert.issueDate}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCert(cert)}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shrink-0 shadow-2xs"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}

    </div>
  );
};
