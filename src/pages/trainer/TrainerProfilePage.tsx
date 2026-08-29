import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { storageService } from '../../services/storageService';
import { soundUtility } from '../../utils/soundUtility';
import { 
  Qualification, WorkExperience, UserCertificate, 
  SkillRecord, SkillProficiency 
} from '../../types';
import { 
  User, Mail, Phone, Building, Briefcase, MapPin, 
  GraduationCap, Award, Plus, Trash2, Edit3, X, Save, CheckCircle2, ShieldCheck, Sun, Moon,
  Volume2, VolumeX, BellRing, MessageSquare, BookOpen, Layers, Check, ExternalLink, Calendar,
  Search, ChevronDown, Filter, Sparkles, Star, Users, FileText, CheckCircle, Video, FolderGit2
} from 'lucide-react';

const TRAINER_INTEREST_DOMAINS = [
  'Data Science & AI',
  'Cybersecurity & Defense',
  'Public Policy & Administration',
  'Digital Infrastructure & Cloud',
  'Enterprise Leadership & Governance',
  'Project Management',
  'Financial Technology & GeM',
  'Agile Public Operations',
  'Ethics & Regulatory Compliance',
  'Citizen Service Delivery',
  'Inter-departmental Coordination',
  'Digital Public Infrastructure (DPI)'
];

const SKILL_CATEGORIES = [
  'Technical',
  'Leadership',
  'Governance',
  'Analytical',
  'Policy & Legal',
  'Pedagogy & Training',
  'Security & Compliance',
  'Communication'
];

const PROFICIENCY_LEVELS: { level: SkillProficiency; label: string; color: string; bg: string; stars: number }[] = [
  { level: 'Beginner', label: 'Beginner (Foundational)', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700', stars: 1 },
  { level: 'Intermediate', label: 'Intermediate (Applied)', color: 'text-amber-800 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/50', stars: 2 },
  { level: 'Advanced', label: 'Advanced (Proficient)', color: 'text-blue-800 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700/50', stars: 3 },
  { level: 'Expert', label: 'Expert (Mastery / Faculty Lead)', color: 'text-emerald-800 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/50', stars: 4 }
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
];

interface TrainerProfilePageProps {
  onNavigate?: (view: string, payload?: any) => void;
}

export const TrainerProfilePage: React.FC<TrainerProfilePageProps> = ({ onNavigate }) => {
  const { user, updateUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  // Active section tab
  const [activeTab, setActiveTab] = useState<'profile' | 'qualifications' | 'experience' | 'skills' | 'expertise' | 'certifications' | 'preferences'>('profile');

  // Personal Info
  const [name, setName] = useState(user?.name || 'Dr. Vikramaditya Sen');
  const [email, setEmail] = useState(user?.email || 'vikramaditya.sen@iitd.ac.in');
  const [phone, setPhone] = useState(user?.phone || '+91 98112 34567');
  const [organization, setOrganization] = useState(user?.organization || 'Indian Institute of Technology (IIT) Delhi');
  const [designation, setDesignation] = useState(user?.designation || 'Professor & Principal Capacity Consultant');
  const [department, setDepartment] = useState(user?.department || 'Department of Computer Science & AI Systems');
  const [location, setLocation] = useState(user?.location || 'New Delhi, India');
  const [bio, setBio] = useState(user?.bio || 'Distinguished faculty lead with 14+ years of expertise in Machine Learning systems, Data Governance, and public sector enterprise architectures.');
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(user?.yearsOfExperience || user?.experienceYears || 14);
  const [avatar, setAvatar] = useState(user?.avatar || PRESET_AVATARS[1]);

  // Areas of Expertise & Subjects Taught
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>(() => {
    if (user?.skills && user.skills.length > 0) return user.skills.slice(0, 5);
    return ['Enterprise AI Strategy', 'Data Governance', 'Machine Learning at Scale', 'Cloud Infrastructure', 'Public Sector IT Leadership'];
  });
  const [newExpertiseInput, setNewExpertiseInput] = useState('');

  const [subjectsTaught, setSubjectsTaught] = useState<string[]>([
    'Applied Machine Learning for Public Governance',
    'Enterprise Cloud & High-Performance Data Architecture',
    'Data Protection & DPDP Compliance Standards'
  ]);
  const [newSubjectInput, setNewSubjectInput] = useState('');

  // Educational Qualifications
  const [qualifications, setQualifications] = useState<Qualification[]>(
    user?.qualifications && user.qualifications.length > 0
      ? user.qualifications
      : [
          { degree: 'Ph.D. in Computer Science & Artificial Intelligence', institution: 'Indian Institute of Technology (IIT) Delhi', year: 2014 },
          { degree: 'Master of Technology (M.Tech) in Computer Systems', institution: 'Indian Institute of Science (IISc) Bangalore', year: 2009 }
        ]
  );
  const [newDegree, setNewDegree] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newYear, setNewYear] = useState<number>(new Date().getFullYear());
  const [showAddQualModal, setShowAddQualModal] = useState(false);
  const [editingQualIndex, setEditingQualIndex] = useState<number | null>(null);

  // Work Experience
  const [experience, setExperience] = useState<WorkExperience[]>(
    user?.experience && user.experience.length > 0
      ? user.experience
      : [
          {
            organization: 'Indian Institute of Technology (IIT) Delhi',
            role: 'Professor & Lead AI Researcher',
            designation: 'Professor & Lead AI Researcher',
            duration: '2018 - Present',
            startDate: '2018-07-01',
            currentlyWorking: true,
            responsibilities: 'Directing capacity development programs for senior public administrators, leading national AI research labs, and authoring accredited executive training modules.',
            description: 'Directing capacity development programs and leading AI research labs.'
          },
          {
            organization: 'National Informatics Centre (NIC)',
            role: 'Senior Technology Advisor',
            designation: 'Senior Technology Advisor',
            duration: '2014 - 2018',
            startDate: '2014-06-01',
            endDate: '2018-06-30',
            currentlyWorking: false,
            responsibilities: 'Architected distributed national registry systems and conducted nationwide capacity training for over 4,500 state IT officers.',
            description: 'Architected distributed national registry systems.'
          }
        ]
  );
  const [showAddExpModal, setShowAddExpModal] = useState(false);
  const [editingExpIndex, setEditingExpIndex] = useState<number | null>(null);
  const [expOrg, setExpOrg] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expDuration, setExpDuration] = useState('');
  const [expResponsibilities, setExpResponsibilities] = useState('');
  const [expCurrentlyWorking, setExpCurrentlyWorking] = useState(false);

  // Skills & Skill Records
  const [skills, setSkills] = useState<string[]>(
    user?.skills && user.skills.length > 0
      ? user.skills
      : ['Machine Learning', 'Python', 'Enterprise Cloud Architecture', 'Data Governance', 'Public Sector IT Strategy', 'Neural Networks', 'Docker & Kubernetes']
  );
  const [skillRecords, setSkillRecords] = useState<SkillRecord[]>(
    user?.skillRecords && user.skillRecords.length > 0
      ? user.skillRecords
      : [
          { id: 'sk-1', name: 'Machine Learning & AI Architecture', category: 'Technical', proficiency: 'Expert' },
          { id: 'sk-2', name: 'Enterprise Cloud Architecture', category: 'Technical', proficiency: 'Expert' },
          { id: 'sk-3', name: 'Public Sector IT Governance', category: 'Governance', proficiency: 'Expert' },
          { id: 'sk-4', name: 'Curriculum & Pedagogy Design', category: 'Pedagogy & Training', proficiency: 'Expert' },
          { id: 'sk-5', name: 'Cybersecurity & Compliance', category: 'Security & Compliance', proficiency: 'Advanced' }
        ]
  );
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Technical');
  const [newSkillProficiency, setNewSkillProficiency] = useState<SkillProficiency>('Expert');

  // Professional Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.interests && user.interests.length > 0
      ? user.interests
      : ['Data Science & AI', 'Cybersecurity & Defense', 'Public Policy & Administration', 'Digital Infrastructure & Cloud']
  );
  const [customInterestInput, setCustomInterestInput] = useState('');
  const [interestSearchQuery, setInterestSearchQuery] = useState('');

  // Certifications
  const [externalCerts, setExternalCerts] = useState<UserCertificate[]>(
    user?.certificates && user.certificates.length > 0
      ? user.certificates
      : [
          {
            name: 'Google Cloud Certified Professional Cloud Architect',
            issuingOrganization: 'Google Cloud Platform',
            date: '2023-05-15',
            credentialId: 'GCP-PCA-98214',
            credentialUrl: 'https://cloud.google.com/certification'
          },
          {
            name: 'Certified Information Systems Security Professional (CISSP)',
            issuingOrganization: '(ISC)²',
            date: '2022-11-20',
            credentialId: 'CISSP-654321',
            credentialUrl: 'https://www.isc2.org'
          }
        ]
  );
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [newCertName, setNewCertName] = useState('');
  const [newCertOrg, setNewCertOrg] = useState('');
  const [newCertDate, setNewCertDate] = useState('');
  const [newCertId, setNewCertId] = useState('');
  const [newCertUrl, setNewCertUrl] = useState('');

  // Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [learnerQuestions, setLearnerQuestions] = useState(true);
  const [assessmentSubmissions, setAssessmentSubmissions] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(soundUtility.isAudioEnabled());

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Faculty performance metrics
  const trainerId = user?._id || 'u-trainer-1';
  const authoredCourses = storageService.getCourses().filter(c => c.trainerId === trainerId);
  const trainerMaterials = storageService.getMaterials().filter(m => m.trainerId === trainerId);
  const totalEnrolledLearners = authoredCourses.reduce((acc, c) => acc + (c.enrolledUsers || 0), 0);
  const trainerRating = user?.rating || 4.95;

  const handleSaveProfile = () => {
    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      const updatedUser = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        organization: organization.trim(),
        designation: designation.trim(),
        department: department.trim(),
        location: location.trim(),
        bio: bio.trim(),
        avatar,
        yearsOfExperience: Number(yearsOfExperience),
        experienceYears: Number(yearsOfExperience),
        qualification: qualifications[0]?.degree || 'Ph.D. in Computer Science',
        qualifications,
        experience,
        skills,
        skillRecords,
        interests: selectedInterests,
        certificates: externalCerts,
        updatedAt: new Date().toISOString()
      };

      updateUserProfile(updatedUser);
      setIsSaving(false);
      setSaveSuccess(true);
      soundUtility.playSuccess();
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 400);
  };

  // Add / Edit Qualification
  const handleSaveQualification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDegree.trim() || !newInstitution.trim()) return;

    if (editingQualIndex !== null) {
      const updated = [...qualifications];
      updated[editingQualIndex] = {
        degree: newDegree.trim(),
        institution: newInstitution.trim(),
        year: Number(newYear)
      };
      setQualifications(updated);
      setEditingQualIndex(null);
    } else {
      setQualifications([
        ...qualifications,
        {
          degree: newDegree.trim(),
          institution: newInstitution.trim(),
          year: Number(newYear)
        }
      ]);
    }

    setNewDegree('');
    setNewInstitution('');
    setNewYear(new Date().getFullYear());
    setShowAddQualModal(false);
  };

  const handleRemoveQualification = (idx: number) => {
    setQualifications(qualifications.filter((_, i) => i !== idx));
  };

  // Add / Edit Experience
  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expOrg.trim() || !expRole.trim()) return;

    const record: WorkExperience = {
      organization: expOrg.trim(),
      role: expRole.trim(),
      designation: expRole.trim(),
      duration: expDuration.trim() || '2020 - Present',
      currentlyWorking: expCurrentlyWorking,
      responsibilities: expResponsibilities.trim(),
      description: expResponsibilities.trim() || `${expRole.trim()} at ${expOrg.trim()}`
    };

    if (editingExpIndex !== null) {
      const updated = [...experience];
      updated[editingExpIndex] = record;
      setExperience(updated);
      setEditingExpIndex(null);
    } else {
      setExperience([record, ...experience]);
    }

    setExpOrg('');
    setExpRole('');
    setExpDuration('');
    setExpResponsibilities('');
    setExpCurrentlyWorking(false);
    setShowAddExpModal(false);
  };

  const handleRemoveExperience = (idx: number) => {
    setExperience(experience.filter((_, i) => i !== idx));
  };

  // Add Skill Record
  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newRecord: SkillRecord = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      proficiency: newSkillProficiency
    };

    setSkillRecords([...skillRecords, newRecord]);
    if (!skills.includes(newSkillName.trim())) {
      setSkills([...skills, newSkillName.trim()]);
    }

    setNewSkillName('');
    setShowAddSkillModal(false);
  };

  const handleRemoveSkill = (id?: string, skillName?: string) => {
    if (id) {
      setSkillRecords(skillRecords.filter(s => s.id !== id));
    }
    if (skillName) {
      setSkills(skills.filter(s => s !== skillName));
    }
  };

  // Toggle Interest Tag
  const handleToggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleAddCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customInterestInput.trim();
    if (clean && !selectedInterests.includes(clean)) {
      setSelectedInterests([...selectedInterests, clean]);
      setCustomInterestInput('');
    }
  };

  // Add Certification
  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName.trim() || !newCertOrg.trim()) return;

    setExternalCerts([
      ...externalCerts,
      {
        name: newCertName.trim(),
        issuingOrganization: newCertOrg.trim(),
        date: newCertDate || new Date().toISOString().split('T')[0],
        credentialId: newCertId.trim() || `CERT-${Date.now().toString().slice(-6)}`,
        credentialUrl: newCertUrl.trim()
      }
    ]);

    setNewCertName('');
    setNewCertOrg('');
    setNewCertDate('');
    setNewCertId('');
    setNewCertUrl('');
    setShowAddCertModal(false);
  };

  const handleRemoveCert = (idx: number) => {
    setExternalCerts(externalCerts.filter((_, i) => i !== idx));
  };

  // Add Expertise & Subjects
  const handleAddExpertise = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newExpertiseInput.trim();
    if (val && !expertiseAreas.includes(val)) {
      setExpertiseAreas([...expertiseAreas, val]);
      if (!skills.includes(val)) setSkills([...skills, val]);
      setNewExpertiseInput('');
    }
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newSubjectInput.trim();
    if (val && !subjectsTaught.includes(val)) {
      setSubjectsTaught([...subjectsTaught, val]);
      setNewSubjectInput('');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Top Banner & Faculty Profile Card */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative group">
              <img
                src={avatar}
                alt={name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-amber-500/20 shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 bg-amber-600 text-white p-1.5 rounded-xl shadow-xs">
                <Award className="w-4 h-4" />
              </div>
            </div>

            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase">
                  Accredited Faculty Trainer
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center sm:justify-start gap-2">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>{designation}</span>
                <span className="text-slate-400">•</span>
                <span>{organization}</span>
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <strong className="text-slate-800 dark:text-slate-200">{trainerRating.toFixed(2)}/5.0</strong> Rating
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                  <strong className="text-slate-800 dark:text-slate-200">{authoredCourses.length || 3}</strong> Courses Authored
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  <strong className="text-slate-800 dark:text-slate-200">{totalEnrolledLearners || 1420}+</strong> Enrolled Trainees
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-500" />
                  <strong className="text-slate-800 dark:text-slate-200">{yearsOfExperience}</strong> Yrs Experience
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-3">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>SAVING...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>SAVED!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>SAVE PROFILE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Avatar Preset Selector */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Change Profile Photo:</span>
          <div className="flex items-center gap-2">
            {PRESET_AVATARS.map((p, idx) => (
              <img
                key={idx}
                src={p}
                alt="Avatar preset"
                onClick={() => setAvatar(p)}
                className={`w-9 h-9 rounded-xl object-cover cursor-pointer transition-all ${
                  avatar === p ? 'ring-2 ring-amber-500 scale-110' : 'opacity-60 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
        {[
          { id: 'profile', label: 'Faculty Bio & Info', icon: User },
          { id: 'expertise', label: 'Expertise & Subjects', icon: Layers },
          { id: 'skills', label: `Skills (${skills.length})`, icon: Sparkles },
          { id: 'qualifications', label: `Qualifications (${qualifications.length})`, icon: GraduationCap },
          { id: 'experience', label: `Work History (${experience.length})`, icon: Briefcase },
          { id: 'certifications', label: `Certifications (${externalCerts.length})`, icon: Award },
          { id: 'preferences', label: 'Settings & Alerts', icon: BellRing }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-[#151B28] text-amber-600 dark:text-amber-400 shadow-xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Faculty Bio & Info */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Personal & Institutional Credentials</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                This verified profile details your institutional capacity and feeds into the Transparent Competency Matching Engine.
              </p>
            </div>
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>SAVE</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Full Legal / Academic Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Official Institutional Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Parent Academic / Govt Institute</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Faculty Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Department / Research Division</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Location / City</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Total Years of Experience</label>
              <input
                type="number"
                min="1"
                max="50"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Professional Faculty Bio</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500 leading-relaxed"
                placeholder="Detail your pedagogical background, advisory roles, and capacity building focus areas..."
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Areas of Expertise & Subjects Taught */}
      {activeTab === 'expertise' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Core Areas of Domain Expertise</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                These tags are matched against institutional capacity requirements when trainees or organizations query the Trainer Matching engine.
              </p>
            </div>

            <form onSubmit={handleAddExpertise} className="flex gap-2">
              <input
                type="text"
                value={newExpertiseInput}
                onChange={(e) => setNewExpertiseInput(e.target.value)}
                placeholder="e.g. Enterprise Cloud Security, High-Throughput Analytics"
                className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD EXPERTISE</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {expertiseAreas.map((exp, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-mono font-medium"
                >
                  <span>{exp}</span>
                  <button
                    type="button"
                    onClick={() => setExpertiseAreas(expertiseAreas.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Subjects & Curricula Taught</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Specialized training tracks and subject modules delivered across partner institutions.
              </p>
            </div>

            <form onSubmit={handleAddSubject} className="flex gap-2">
              <input
                type="text"
                value={newSubjectInput}
                onChange={(e) => setNewSubjectInput(e.target.value)}
                placeholder="e.g. Applied AI in Public Administration"
                className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD SUBJECT</span>
              </button>
            </form>

            <div className="space-y-2">
              {subjectsTaught.map((sub, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{sub}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubjectsTaught(subjectsTaught.filter((_, i) => i !== idx))}
                    className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Skills & Proficiency Records */}
      {activeTab === 'skills' && (
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Trainer Skills & Proficiency Matrix</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Calibrated competencies used for skill gap analysis and automated trainee-trainer matching.
              </p>
            </div>
            <button
              onClick={() => setShowAddSkillModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD SKILL</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillRecords.map((sk) => {
              const prof = PROFICIENCY_LEVELS.find(p => p.level === sk.proficiency) || PROFICIENCY_LEVELS[3];
              return (
                <div
                  key={sk.id || sk.name}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {sk.category}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${prof.color} ${prof.bg}`}>
                        {sk.proficiency}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{sk.name}</h4>
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(sk.id, sk.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                    title="Remove Skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Educational Qualifications */}
      {activeTab === 'qualifications' && (
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Academic Qualifications & Credentials</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Doctorate, Master's, and specialized academic accreditations.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingQualIndex(null);
                setNewDegree('');
                setNewInstitution('');
                setNewYear(new Date().getFullYear());
                setShowAddQualModal(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD DEGREE</span>
            </button>
          </div>

          <div className="space-y-4">
            {qualifications.map((q, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{q.degree}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{q.institution}</p>
                    <span className="inline-block mt-2 text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                      Conferred: {q.year}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingQualIndex(idx);
                      setNewDegree(q.degree);
                      setNewInstitution(q.institution);
                      setNewYear(q.year);
                      setShowAddQualModal(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-500 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveQualification(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Work Experience */}
      {activeTab === 'experience' && (
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Professional Faculty & Advisory Work History</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Past positions, institutional advisory mandates, and capacity training tenures.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingExpIndex(null);
                setExpOrg('');
                setExpRole('');
                setExpDuration('');
                setExpResponsibilities('');
                setExpCurrentlyWorking(false);
                setShowAddExpModal(true);
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD POSITION</span>
            </button>
          </div>

          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{exp.role || exp.designation}</h4>
                      {exp.currentlyWorking && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Current Mandate
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{exp.organization}</p>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block mt-1">
                      {exp.duration}
                    </span>
                    {exp.responsibilities && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-2xl">
                        {exp.responsibilities}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingExpIndex(idx);
                      setExpOrg(exp.organization);
                      setExpRole(exp.role || exp.designation || '');
                      setExpDuration(exp.duration);
                      setExpResponsibilities(exp.responsibilities || exp.description || '');
                      setExpCurrentlyWorking(!!exp.currentlyWorking);
                      setShowAddExpModal(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-purple-500 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveExperience(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Professional Certifications */}
      {activeTab === 'certifications' && (
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Accreditations & External Certifications</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Industry and international credentials supporting your domain authority.
              </p>
            </div>
            <button
              onClick={() => setShowAddCertModal(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD CERTIFICATE</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {externalCerts.map((c, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{c.name}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{c.issuingOrganization}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">ID: {c.credentialId}</span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">• Issued: {c.date}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveCert(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: Preferences & System Alerts */}
      {activeTab === 'preferences' && (
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Trainer Notification & Audio Preferences</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Configure system alerts for course enrollments, learner queries, and assessment grading.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-500" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Platform Acoustic Feedback</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Play subtle audio cues upon course publishing, asset upload, and save events.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  soundUtility.setAudioEnabled(next);
                  if (next) soundUtility.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer ${
                  soundEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {soundEnabled ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <BellRing className="w-5 h-5 text-blue-500" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Trainee Enrollment Alerts</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Receive real-time notifications when a trainee enrolls in your authored courses.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-purple-500" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Learner Q&A Messages</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Allow enrolled officers to send direct queries via the Trainer Messaging portal.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={learnerQuestions}
                onChange={(e) => setLearnerQuestions(e.target.checked)}
                className="w-4 h-4 accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-500" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">MCQ Assessment Submissions</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tabulate scores automatically and receive badge generation summaries.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={assessmentSubmissions}
                onChange={(e) => setAssessmentSubmissions(e.target.checked)}
                className="w-4 h-4 accent-amber-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Qualification */}
      {showAddQualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#151B28] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {editingQualIndex !== null ? 'Edit Academic Qualification' : 'Add Academic Qualification'}
            </h3>
            <form onSubmit={handleSaveQualification} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Degree Title *</label>
                <input
                  type="text"
                  required
                  value={newDegree}
                  onChange={(e) => setNewDegree(e.target.value)}
                  placeholder="e.g. Ph.D. in Machine Learning & AI"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Institution *</label>
                <input
                  type="text"
                  required
                  value={newInstitution}
                  onChange={(e) => setNewInstitution(e.target.value)}
                  placeholder="e.g. IIT Delhi"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Year Conferred</label>
                <input
                  type="number"
                  value={newYear}
                  onChange={(e) => setNewYear(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddQualModal(false)}
                  className="px-4 py-2 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-mono font-bold text-xs rounded-xl"
                >
                  Save Degree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Experience */}
      {showAddExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#151B28] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {editingExpIndex !== null ? 'Edit Work Position' : 'Add Professional Work Position'}
            </h3>
            <form onSubmit={handleSaveExperience} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Organization / Institution *</label>
                <input
                  type="text"
                  required
                  value={expOrg}
                  onChange={(e) => setExpOrg(e.target.value)}
                  placeholder="e.g. National Informatics Centre (NIC)"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Role / Designation *</label>
                <input
                  type="text"
                  required
                  value={expRole}
                  onChange={(e) => setExpRole(e.target.value)}
                  placeholder="e.g. Principal Training Consultant"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Duration</label>
                <input
                  type="text"
                  value={expDuration}
                  onChange={(e) => setExpDuration(e.target.value)}
                  placeholder="e.g. 2019 - Present"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Responsibilities & Outcomes</label>
                <textarea
                  rows={3}
                  value={expResponsibilities}
                  onChange={(e) => setExpResponsibilities(e.target.value)}
                  placeholder="Summary of capacity building projects, teaching duties..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="currWorking"
                  checked={expCurrentlyWorking}
                  onChange={(e) => setExpCurrentlyWorking(e.target.checked)}
                  className="w-4 h-4 accent-purple-600"
                />
                <label htmlFor="currWorking" className="text-xs font-mono text-slate-700 dark:text-slate-300">Currently serving in this role</label>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddExpModal(false)}
                  className="px-4 py-2 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white font-mono font-bold text-xs rounded-xl"
                >
                  Save Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Skill */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#151B28] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Add Faculty Skill & Calibration</h3>
            <form onSubmit={handleSaveSkill} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Distributed AI Architecture"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Domain Category</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200"
                >
                  {SKILL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Proficiency Level</label>
                <select
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200"
                >
                  {PROFICIENCY_LEVELS.map((p) => (
                    <option key={p.level} value={p.level}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="px-4 py-2 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-mono font-bold text-xs rounded-xl"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Certification */}
      {showAddCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#151B28] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Add Professional Certification</h3>
            <form onSubmit={handleSaveCert} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Certificate Title *</label>
                <input
                  type="text"
                  required
                  value={newCertName}
                  onChange={(e) => setNewCertName(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Issuing Body / Organization *</label>
                <input
                  type="text"
                  required
                  value={newCertOrg}
                  onChange={(e) => setNewCertOrg(e.target.value)}
                  placeholder="e.g. Amazon Web Services"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={newCertDate}
                    onChange={(e) => setNewCertDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Credential ID</label>
                  <input
                    type="text"
                    value={newCertId}
                    onChange={(e) => setNewCertId(e.target.value)}
                    placeholder="e.g. AWS-88219"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCertModal(false)}
                  className="px-4 py-2 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white font-mono font-bold text-xs rounded-xl"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
