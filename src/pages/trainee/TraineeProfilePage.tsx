import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { storageService } from '../../services/storageService';
import { soundUtility } from '../../utils/soundUtility';
import { CertificateModal } from '../../components/common/CertificateModal';
import { 
  Certificate, Qualification, WorkExperience, UserCertificate, 
  SkillRecord, SkillProficiency 
} from '../../types';
import { 
  User, Mail, Phone, Building, Briefcase, MapPin, 
  GraduationCap, Award, Plus, Trash2, Edit3, X, Save, CheckCircle2, ShieldCheck, Sun, Moon,
  Volume2, VolumeX, BellRing, MessageSquare, BookOpen, Layers, Check, ExternalLink, Calendar,
  Search, ChevronDown, Filter, Sparkles, Star
} from 'lucide-react';

const CONFIGURABLE_INTEREST_DOMAINS = [
  'Leadership',
  'Technology',
  'Policy',
  'Governance',
  'Cybersecurity',
  'Public Administration',
  'Data Analysis & AI',
  'Project Management',
  'Finance & Budgeting',
  'Cloud Architecture',
  'Digital Transformation',
  'Ethics & Compliance',
  'Agile Operations',
  'Legal & Regulatory Frameworks',
  'Crisis Management',
  'Citizen Services Delivery',
  'Inter-departmental Coordination',
  'Procurement & GeM'
];

const SKILL_CATEGORIES = [
  'Technical',
  'Leadership',
  'Governance',
  'Analytical',
  'Policy & Legal',
  'Management',
  'Security & Compliance',
  'Communication'
];

const PROFICIENCY_LEVELS: { level: SkillProficiency; label: string; color: string; bg: string; stars: number }[] = [
  { level: 'Beginner', label: 'Beginner (Foundational)', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700', stars: 1 },
  { level: 'Intermediate', label: 'Intermediate (Applied)', color: 'text-amber-800 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/50', stars: 2 },
  { level: 'Advanced', label: 'Advanced (Proficient)', color: 'text-blue-800 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700/50', stars: 3 },
  { level: 'Expert', label: 'Expert (Mastery / Lead)', color: 'text-emerald-800 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/50', stars: 4 }
];

export const TraineeProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const certificates = user ? storageService.getCertificates().filter((c) => c.traineeId === user._id) : [];

  // Active section tab
  const [activeTab, setActiveTab] = useState<'profile' | 'qualifications' | 'experience' | 'skills' | 'interests' | 'certifications' | 'preferences'>('profile');

  // Personal Info
  const [name, setName] = useState(user?.name || 'Rahul Varma');
  const [email, setEmail] = useState(user?.email || 'rahul.varma@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [organization, setOrganization] = useState(user?.organization || 'National Informatics Centre (NIC)');
  const [designation, setDesignation] = useState(user?.designation || 'Senior Assistant Director');
  const [department, setDepartment] = useState(user?.department || 'Digital Services & Public Infrastructure');
  const [location, setLocation] = useState(user?.location || 'New Delhi, India');
  const [bio, setBio] = useState(user?.bio || 'Public sector officer specializing in digital public infrastructure, enterprise governance, and scalable capacity building.');
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(user?.yearsOfExperience || user?.experienceYears || 8);

  // Trainer specific fields
  const [expertise, setExpertise] = useState<string>(user?.qualification || 'Enterprise Cloud & Data Strategy');

  // Educational Qualifications
  const [qualifications, setQualifications] = useState<Qualification[]>(
    user?.qualifications && user.qualifications.length > 0
      ? user.qualifications
      : [
          { degree: 'Master of Technology (M.Tech) in Computer Science', institution: 'Indian Institute of Technology (IIT) Delhi', year: 2017 },
          { degree: 'Bachelor of Technology (B.Tech) in Information Technology', institution: 'National Institute of Technology (NIT) Kurukshetra', year: 2015 }
        ]
  );
  const [newDegree, setNewDegree] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newYear, setNewYear] = useState<number>(new Date().getFullYear());
  const [showAddQualModal, setShowAddQualModal] = useState(false);

  // Work Experience
  const [experience, setExperience] = useState<WorkExperience[]>(
    user?.experience && user.experience.length > 0
      ? user.experience
      : [
          {
            organization: 'National Informatics Centre (NIC)',
            role: 'Senior Assistant Director',
            designation: 'Senior Assistant Director',
            duration: '2020 - Present',
            startDate: '2020-06-01',
            endDate: 'Present',
            currentlyWorking: true,
            responsibilities: 'Overseeing national digital governance workflows and data interoperability protocols across state departments.',
            yearsOfExperience: 4,
            description: 'Overseeing national digital governance workflows and data interoperability protocols across state departments.'
          },
          {
            organization: 'Centre for Development of Advanced Computing (C-DAC)',
            role: 'Senior Systems Engineer',
            designation: 'Senior Systems Engineer',
            duration: '2016 - 2020',
            startDate: '2016-08-01',
            endDate: '2020-05-31',
            currentlyWorking: false,
            responsibilities: 'Designed high-performance computing clusters and enterprise security compliance frameworks.',
            yearsOfExperience: 4,
            description: 'Designed high-performance computing clusters and enterprise security compliance frameworks.'
          }
        ]
  );
  const [editingExpIndex, setEditingExpIndex] = useState<number | null>(null);
  const [expOrg, setExpOrg] = useState('');
  const [expDesignation, setExpDesignation] = useState('');
  const [expDuration, setExpDuration] = useState('');
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [expCurrentlyWorking, setExpCurrentlyWorking] = useState(false);
  const [expResponsibilities, setExpResponsibilities] = useState('');
  const [expYears, setExpYears] = useState<number>(2);
  const [showExpModal, setShowExpModal] = useState(false);

  // Skills (Rich Structured Records)
  const initialSkillRecords: SkillRecord[] = (user?.skillRecords && user.skillRecords.length > 0)
    ? user.skillRecords
    : (user?.skills && user.skills.length > 0)
      ? user.skills.map((s, i) => ({
          id: `sk-${i + 1}`,
          name: s,
          category: s.toLowerCase().includes('python') || s.toLowerCase().includes('cloud') || s.toLowerCase().includes('data') ? 'Technical' : s.toLowerCase().includes('lead') ? 'Leadership' : 'Governance',
          proficiency: (i % 3 === 0 ? 'Expert' : i % 2 === 0 ? 'Advanced' : 'Intermediate') as SkillProficiency
        }))
      : [
          { id: 'sk-1', name: 'Data Governance & Interoperability', category: 'Governance', proficiency: 'Expert' },
          { id: 'sk-2', name: 'Python for Data Analysis', category: 'Technical', proficiency: 'Advanced' },
          { id: 'sk-3', name: 'Public Sector Leadership', category: 'Leadership', proficiency: 'Advanced' },
          { id: 'sk-4', name: 'Cloud Infrastructure Security', category: 'Security & Compliance', proficiency: 'Intermediate' }
        ];

  const [skillRecords, setSkillRecords] = useState<SkillRecord[]>(initialSkillRecords);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState<string>('Technical');
  const [skillProficiency, setSkillProficiency] = useState<SkillProficiency>('Intermediate');
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [skillCategoryFilter, setSkillCategoryFilter] = useState<string>('all');

  // Interests (Multi-select)
  const [interests, setInterests] = useState<string[]>(
    user?.interests && user.interests.length > 0
      ? user.interests
      : ['Leadership', 'Technology', 'Policy', 'Data Analysis & AI']
  );
  const [interestSearch, setInterestSearch] = useState('');
  const [customInterestInput, setCustomInterestInput] = useState('');
  const [isInterestsDropdownOpen, setIsInterestsDropdownOpen] = useState(false);

  // Professional Certifications
  const [userCertifications, setUserCertifications] = useState<UserCertificate[]>(
    user?.certificates && user.certificates.length > 0
      ? user.certificates
      : [
          {
            name: 'Certified Information Systems Security Professional (CISSP)',
            issuingOrganization: '(ISC)²',
            date: '2022-04-15',
            expiryDate: '2025-04-15',
            credentialId: 'CISSP-884920',
            credentialUrl: 'https://www.isc2.org'
          },
          {
            name: 'AWS Certified Solutions Architect – Professional',
            issuingOrganization: 'Amazon Web Services',
            date: '2023-01-10',
            expiryDate: '2026-01-10',
            credentialId: 'AWS-PSA-99321',
            credentialUrl: 'https://aws.amazon.com/verification'
          }
        ]
  );
  const [newCertName, setNewCertName] = useState('');
  const [newCertOrg, setNewCertOrg] = useState('');
  const [newCertDate, setNewCertDate] = useState('');
  const [newCertExpiry, setNewCertExpiry] = useState('');
  const [newCertId, setNewCertId] = useState('');
  const [newCertUrl, setNewCertUrl] = useState('');
  const [showAddCertModal, setShowAddCertModal] = useState(false);

  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundUtility.isSoundEnabled());

  useEffect(() => {
    if (user) {
      if (user.name !== undefined) setName(user.name || '');
      if (user.email !== undefined) setEmail(user.email || '');
      if (user.phone !== undefined) setPhone(user.phone || '');
      if (user.organization !== undefined) setOrganization(user.organization || '');
      if (user.designation !== undefined) setDesignation(user.designation || '');
      if (user.department !== undefined) setDepartment(user.department || '');
      if (user.location !== undefined) setLocation(user.location || '');
      if (user.bio !== undefined) setBio(user.bio || '');
      if (user.yearsOfExperience !== undefined) setYearsOfExperience(user.yearsOfExperience);
      if (user.interests) setInterests(user.interests);
      if (user.qualifications && user.qualifications.length > 0) setQualifications(user.qualifications);
      if (user.experience && user.experience.length > 0) setExperience(user.experience);
      if (user.certificates && user.certificates.length > 0) setUserCertifications(user.certificates);
      if (user.skillRecords && user.skillRecords.length > 0) {
        setSkillRecords(user.skillRecords);
      } else if (user.skills && user.skills.length > 0) {
        setSkillRecords(
          user.skills.map((s, idx) => ({
            id: `sk-${idx + 1}`,
            name: s,
            category: s.toLowerCase().includes('tech') || s.toLowerCase().includes('data') ? 'Technical' : 'Governance',
            proficiency: 'Intermediate'
          }))
        );
      }
    }
  }, [user]);

  useEffect(() => {
    const handleSoundChange = (e: any) => {
      if (e.detail?.enabled !== undefined) {
        setSoundEnabled(e.detail.enabled);
      }
    };
    window.addEventListener('cc_sound_setting_changed', handleSoundChange);
    return () => window.removeEventListener('cc_sound_setting_changed', handleSoundChange);
  }, []);

  const handleToggleSound = () => {
    const next = soundUtility.toggleSoundEnabled();
    setSoundEnabled(next);
    if (next) {
      soundUtility.playNotificationSound(true);
    }
  };

  // Qualifications Actions
  const handleAddQualification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDegree.trim() || !newInstitution.trim()) return;
    const updated = [
      ...qualifications,
      { degree: newDegree.trim(), institution: newInstitution.trim(), year: Number(newYear) || new Date().getFullYear() }
    ];
    setQualifications(updated);
    setNewDegree('');
    setNewInstitution('');
    setShowAddQualModal(false);
    updateUserProfile({ qualifications: updated });
  };

  const handleRemoveQualification = (idx: number) => {
    const updated = qualifications.filter((_, i) => i !== idx);
    setQualifications(updated);
    updateUserProfile({ qualifications: updated });
  };

  // Work Experience Actions (Support Add, Edit, Delete with organization, designation, duration, responsibilities)
  const handleOpenAddExp = () => {
    setEditingExpIndex(null);
    setExpOrg('');
    setExpDesignation('');
    setExpDuration('');
    setExpStartDate('');
    setExpEndDate('');
    setExpCurrentlyWorking(false);
    setExpResponsibilities('');
    setExpYears(2);
    setShowExpModal(true);
  };

  const handleOpenEditExp = (idx: number) => {
    const item = experience[idx];
    setEditingExpIndex(idx);
    setExpOrg(item.organization || '');
    setExpDesignation(item.designation || item.role || '');
    setExpDuration(item.duration || '');
    setExpStartDate(item.startDate || '');
    setExpEndDate(item.endDate || '');
    setExpCurrentlyWorking(Boolean(item.currentlyWorking));
    setExpResponsibilities(item.responsibilities || item.description || '');
    setExpYears(item.yearsOfExperience || 2);
    setShowExpModal(true);
  };

  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expOrg.trim() || !expDesignation.trim()) return;
    
    const computedDuration = expDuration.trim() 
      ? expDuration.trim()
      : expCurrentlyWorking 
        ? `${expStartDate ? new Date(expStartDate).getFullYear() : '2022'} - Present` 
        : `${expStartDate ? new Date(expStartDate).getFullYear() : '2020'} - ${expEndDate ? new Date(expEndDate).getFullYear() : '2023'}`;

    const entry: WorkExperience = {
      organization: expOrg.trim(),
      role: expDesignation.trim(),
      designation: expDesignation.trim(),
      duration: computedDuration,
      startDate: expStartDate || undefined,
      endDate: expCurrentlyWorking ? 'Present' : (expEndDate || undefined),
      currentlyWorking: expCurrentlyWorking,
      responsibilities: expResponsibilities.trim() || 'Key operational leadership, policy management, and program execution responsibilities.',
      yearsOfExperience: Number(expYears) || 2,
      description: expResponsibilities.trim() || 'Key operational leadership, policy management, and program execution responsibilities.'
    };

    let updated: WorkExperience[];
    if (editingExpIndex !== null && editingExpIndex >= 0) {
      updated = [...experience];
      updated[editingExpIndex] = entry;
    } else {
      updated = [...experience, entry];
    }

    setExperience(updated);
    setShowExpModal(false);
    updateUserProfile({ experience: updated });
  };

  const handleRemoveExperience = (idx: number) => {
    const updated = experience.filter((_, i) => i !== idx);
    setExperience(updated);
    updateUserProfile({ experience: updated });
  };

  // Skills Actions (Add, Edit, Delete with name, category, proficiency level)
  const handleOpenAddSkill = () => {
    setEditingSkillId(null);
    setSkillName('');
    setSkillCategory('Technical');
    setSkillProficiency('Intermediate');
    setShowSkillModal(true);
  };

  const handleOpenEditSkill = (skill: SkillRecord) => {
    setEditingSkillId(skill.id || skill.name);
    setSkillName(skill.name);
    setSkillCategory(skill.category || 'Technical');
    setSkillProficiency(skill.proficiency || 'Intermediate');
    setShowSkillModal(true);
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    let updated: SkillRecord[];
    if (editingSkillId) {
      updated = skillRecords.map((s) => 
        (s.id === editingSkillId || s.name === editingSkillId)
          ? { ...s, name: skillName.trim(), category: skillCategory, proficiency: skillProficiency }
          : s
      );
    } else {
      const newEntry: SkillRecord = {
        id: `sk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: skillName.trim(),
        category: skillCategory,
        proficiency: skillProficiency
      };
      updated = [...skillRecords, newEntry];
    }

    setSkillRecords(updated);
    setShowSkillModal(false);
    updateUserProfile({ 
      skillRecords: updated,
      skills: updated.map(s => s.name)
    });
  };

  const handleRemoveSkill = (skillIdOrName: string) => {
    const updated = skillRecords.filter((s) => s.id !== skillIdOrName && s.name !== skillIdOrName);
    setSkillRecords(updated);
    updateUserProfile({ 
      skillRecords: updated,
      skills: updated.map(s => s.name)
    });
  };

  // Interests Multi-Select Actions (Configurable list, toggle, search, clear, add custom)
  const handleToggleInterest = (interest: string) => {
    const exists = interests.includes(interest);
    const updated = exists 
      ? interests.filter(i => i !== interest)
      : [...interests, interest];
    setInterests(updated);
    updateUserProfile({ interests: updated });
  };

  const handleAddCustomInterest = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = customInterestInput.trim();
    if (val && !interests.includes(val)) {
      const updated = [...interests, val];
      setInterests(updated);
      setCustomInterestInput('');
      updateUserProfile({ interests: updated });
    }
  };

  const handleSelectAllInterests = () => {
    const merged = Array.from(new Set([...interests, ...CONFIGURABLE_INTEREST_DOMAINS]));
    setInterests(merged);
    updateUserProfile({ interests: merged });
  };

  const handleClearAllInterests = () => {
    setInterests([]);
    updateUserProfile({ interests: [] });
  };

  // Professional Certifications Actions
  const handleAddUserCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName.trim() || !newCertOrg.trim()) return;
    const newEntry: UserCertificate = {
      name: newCertName.trim(),
      issuingOrganization: newCertOrg.trim(),
      date: newCertDate || new Date().toISOString().split('T')[0],
      expiryDate: newCertExpiry || undefined,
      credentialId: newCertId.trim() || `CERT-${Math.floor(100000 + Math.random() * 900000)}`,
      credentialUrl: newCertUrl.trim() || undefined
    };
    const updated = [...userCertifications, newEntry];
    setUserCertifications(updated);
    setNewCertName('');
    setNewCertOrg('');
    setNewCertDate('');
    setNewCertExpiry('');
    setNewCertId('');
    setNewCertUrl('');
    setShowAddCertModal(false);
    updateUserProfile({ certificates: updated });
  };

  const handleRemoveUserCertification = (idx: number) => {
    const updated = userCertifications.filter((_, i) => i !== idx);
    setUserCertifications(updated);
    updateUserProfile({ certificates: updated });
  };

  // Master Save Handler
  const handleSaveAll = (e: React.FormEvent) => {
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
      yearsOfExperience: Number(yearsOfExperience),
      experienceYears: Number(yearsOfExperience),
      qualification: expertise,
      skills: skillRecords.map(s => s.name),
      skillRecords,
      interests,
      qualifications,
      experience,
      certificates: userCertifications
    });
  };

  // Profile strength calculation
  const profileStrength = Math.min(
    100, 
    25 + 
    (skillRecords.length * 6) + 
    (interests.length * 4) + 
    (qualifications.length * 8) + 
    (experience.length * 8) + 
    (userCertifications.length * 8) + 
    (certificates.length * 10)
  );

  const filteredInterestsList = CONFIGURABLE_INTEREST_DOMAINS.filter(item =>
    item.toLowerCase().includes(interestSearch.toLowerCase())
  );

  const filteredSkills = skillRecords.filter(s => 
    skillCategoryFilter === 'all' ? true : s.category === skillCategoryFilter
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Profile Header & Strength Meter */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 w-full sm:w-auto">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={name}
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl object-cover ring-4 ring-blue-500/20 shadow-md"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">{name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700/40 uppercase tracking-wide">
                  {user?.role || 'Trainee'}
                </span>
                {user?.role === 'trainer' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/40">
                    ★ 4.9 Faculty Rating
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-0.5">{designation} • {organization}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                {location} • {yearsOfExperience} Years Experience
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl w-full sm:w-64">
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                Profile Strength
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-black">{profileStrength}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${profileStrength}%` }} />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">Competency mapping & course recommendations auto-sync</p>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-6 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Bio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qualifications')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'qualifications'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Qualifications ({qualifications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('experience')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'experience'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Work Experience ({experience.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'skills'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Skills Management ({skillRecords.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('interests')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'interests'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interests ({interests.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('certifications')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'certifications'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Accreditations ({userCertifications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preferences'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Profile & Bio */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveAll} className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Personal & Institutional Details</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Official profile data visible across verification rosters and certificates.
              </p>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Official Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Official Designation *</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Organization / Ministry *</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Department / Cell</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Directorate of Digital Services"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Work Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. New Delhi, India"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Total Years of Professional Experience</label>
              <input
                type="number"
                min="0"
                max="50"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Professional Executive Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief overview of public service domain background..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      )}

      {/* Tab 2: Qualifications */}
      {activeTab === 'qualifications' && (
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Academic Degrees & Qualifications</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verified educational qualifications referenced in competency evaluations.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddQualModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Degree</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {qualifications.map((qual, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{qual.degree}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{qual.institution}</p>
                    <span className="inline-block text-[11px] font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md mt-1.5 border border-blue-200 dark:border-blue-800/40">
                      Graduated: {qual.year}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveQualification(idx)}
                  className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                  title="Remove Qualification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Qualification Modal */}
          {showAddQualModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
              <div className="bg-white dark:bg-[#151B28] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Add Degree / Qualification</h3>
                  <button onClick={() => setShowAddQualModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleAddQualification} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Degree / Certification Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master of Public Administration (MPA)"
                      value={newDegree}
                      onChange={(e) => setNewDegree(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Institution / University *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lal Bahadur Shastri National Academy of Administration"
                      value={newInstitution}
                      onChange={(e) => setNewInstitution(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Graduation Year</label>
                    <input
                      type="number"
                      min="1970"
                      max="2035"
                      value={newYear}
                      onChange={(e) => setNewYear(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowAddQualModal(false)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                    >
                      Save Degree
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Work Experience (Fields for organization, designation, duration, and responsibilities, supporting multiple entries) */}
      {activeTab === 'experience' && (
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Work Experience & Employment History</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Structured track record detailing organization, designation, duration, and responsibilities.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddExp}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Work Experience</span>
            </button>
          </div>

          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-2xs">
                    <Building className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        {exp.designation || exp.role}
                      </h4>
                      {exp.currentlyWorking && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                          Current Position
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 opacity-70" />
                        {exp.organization}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 opacity-70" />
                        {exp.duration || `${exp.startDate || ''} - ${exp.endDate || 'Present'}`}
                      </span>
                      {exp.yearsOfExperience ? (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                          {exp.yearsOfExperience} Yrs
                        </span>
                      ) : null}
                    </div>

                    <div className="pt-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
                        Core Responsibilities:
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                        {exp.responsibilities || exp.description || 'Administrative oversight, program delivery, and stakeholder coordination.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditExp(idx)}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Edit Experience Entry"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(idx)}
                    className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Remove Experience Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Work Experience Modal (Add / Edit) */}
          {showExpModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
              <div className="bg-white dark:bg-[#151B28] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {editingExpIndex !== null ? 'Edit Work Experience Entry' : 'Add Work Experience Entry'}
                  </h3>
                  <button onClick={() => setShowExpModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSaveExperience} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Organization *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. National Informatics Centre (NIC) / Ministry of Finance"
                      value={expOrg}
                      onChange={(e) => setExpOrg(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Designation / Role Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Assistant Director / Policy Analyst"
                      value={expDesignation}
                      onChange={(e) => setExpDesignation(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Duration (e.g. 2020 - Present)</label>
                      <input
                        type="text"
                        placeholder="e.g. 2021 - Present or 3 Years"
                        value={expDuration}
                        onChange={(e) => setExpDuration(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Years in Position</label>
                      <input
                        type="number"
                        min="1"
                        max="40"
                        value={expYears}
                        onChange={(e) => setExpYears(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id="currentlyWorkingToggle"
                      checked={expCurrentlyWorking}
                      onChange={(e) => setExpCurrentlyWorking(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="currentlyWorkingToggle" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                      I currently serve in this position
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Responsibilities & Contributions *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Outline core responsibilities, policy initiatives led, operational targets accomplished..."
                      value={expResponsibilities}
                      onChange={(e) => setExpResponsibilities(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowExpModal(false)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                    >
                      {editingExpIndex !== null ? 'Update Experience' : 'Save Experience'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Skills Management Section (Add, Edit, and Delete skills with name, category, and proficiency level) */}
      {activeTab === 'skills' && (
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Skills & Competency Management</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure your verified skill taxonomy, domain category, and proficiency rating level.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddSkill}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Skill</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-bold shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            <button
              type="button"
              onClick={() => setSkillCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 ${
                skillCategoryFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              All ({skillRecords.length})
            </button>
            {SKILL_CATEGORIES.map((cat) => {
              const count = skillRecords.filter(s => s.category === cat).length;
              if (count === 0 && skillCategoryFilter !== cat) return null;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSkillCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 ${
                    skillCategoryFilter === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredSkills.map((skill, idx) => {
              const profMeta = PROFICIENCY_LEVELS.find(p => p.level === skill.proficiency) || PROFICIENCY_LEVELS[1];
              return (
                <div
                  key={skill.id || idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex flex-col justify-between gap-3 group hover:border-blue-300 dark:hover:border-blue-800 transition-all shadow-2xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700/60">
                        {skill.category || 'General'}
                      </span>
                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleOpenEditSkill(skill)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Skill Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill.id || skill.name)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete Skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-2">{skill.name}</h4>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${profMeta.bg} ${profMeta.color}`}>
                      {skill.proficiency}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4].map((star) => (
                        <div
                          key={star}
                          className={`w-2 h-2 rounded-full ${
                            star <= profMeta.stars
                              ? 'bg-blue-600 dark:bg-blue-400'
                              : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add / Edit Skill Modal */}
          {showSkillModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
              <div className="bg-white dark:bg-[#151B28] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {editingSkillId ? 'Edit Skill Profile' : 'Add New Skill'}
                  </h3>
                  <button onClick={() => setShowSkillModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSaveSkill} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Skill Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Public Policy Analysis, Python, Cloud Security"
                      value={skillName}
                      onChange={(e) => setSkillName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Skill Category *</label>
                    <select
                      value={skillCategory}
                      onChange={(e) => setSkillCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      {SKILL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Proficiency Level *</label>
                    <div className="space-y-2">
                      {PROFICIENCY_LEVELS.map((p) => (
                        <label
                          key={p.level}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            skillProficiency === p.level
                              ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 ring-1 ring-blue-500'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="proficiency"
                              value={p.level}
                              checked={skillProficiency === p.level}
                              onChange={() => setSkillProficiency(p.level)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs font-bold">{p.label}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4].map((star) => (
                              <div
                                key={star}
                                className={`w-2 h-2 rounded-full ${
                                  star <= p.stars ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                              />
                            ))}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowSkillModal(false)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                    >
                      {editingSkillId ? 'Update Skill' : 'Save Skill'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Interests Multi-Select Input Field (Configurable list: Leadership, Technology, Policy, etc.) */}
      {activeTab === 'interests' && (
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Interests & Learning Aspirations (Multi-Select)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Select learning areas from the configurable domain catalogue like Leadership, Technology, and Policy.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleSelectAllInterests}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={handleClearAllInterests}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Active Selected Interests Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Selected Focus Areas ({interests.length})
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Click × to unselect</span>
            </div>
            
            {interests.length === 0 ? (
              <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                No interests selected yet. Choose from the multi-select options below.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                {interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/50 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {interest}
                    <button 
                      type="button" 
                      onClick={() => handleToggleInterest(interest)} 
                      className="hover:text-rose-600 dark:hover:text-rose-400 ml-1 cursor-pointer"
                      title="Remove Interest"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Configurable Multi-Select Grid / Selector */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="text-xs font-bold text-slate-800 dark:text-white">
                Configurable Interest Catalogue (Click to Toggle):
              </label>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter interest catalogue..."
                  value={interestSearch}
                  onChange={(e) => setInterestSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {filteredInterestsList.map((item, idx) => {
                const isSelected = interests.includes(item);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleInterest(item)}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isSelected 
                          ? 'bg-emerald-600 border-emerald-600 text-white' 
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{item}</span>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">Selected</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Interest Input */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Add Custom Specialized Domain:
            </label>
            <form onSubmit={handleAddCustomInterest} className="flex gap-2 max-w-md">
              <input
                type="text"
                value={customInterestInput}
                onChange={(e) => setCustomInterestInput(e.target.value)}
                placeholder="e.g. Urban Mobility Frameworks"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Add Interest
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 6: Professional Certifications */}
      {activeTab === 'certifications' && (
        <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>Professional Certifications & Accreditations</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                External verified credentials from certified industry and national bodies.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddCertModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Certification</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userCertifications.map((cert, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-purple-200/80 dark:border-purple-900/40 bg-purple-50/40 dark:bg-purple-950/20 flex items-start justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 px-2 py-0.5 rounded">
                    ID: {cert.credentialId}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{cert.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{cert.issuingOrganization}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Issued: {cert.date} {cert.expiryDate ? `• Expires: ${cert.expiryDate}` : ''}
                  </p>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-purple-700 dark:text-purple-400 hover:underline pt-1 font-bold"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveUserCertification(idx)}
                  className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                  title="Remove Certification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Certification Modal */}
          {showAddCertModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
              <div className="bg-white dark:bg-[#151B28] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Add Professional Certification</h3>
                  <button onClick={() => setShowAddCertModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleAddUserCertification} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Certification Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Certified Data Protection Officer (CDPO)"
                      value={newCertName}
                      onChange={(e) => setNewCertName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Issuing Body / Authority *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. National Cyber Safety and Security Standards"
                      value={newCertOrg}
                      onChange={(e) => setNewCertOrg(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Issue Date</label>
                      <input
                        type="date"
                        value={newCertDate}
                        onChange={(e) => setNewCertDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Expiry Date (Optional)</label>
                      <input
                        type="date"
                        value={newCertExpiry}
                        onChange={(e) => setNewCertExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Credential ID / Number</label>
                    <input
                      type="text"
                      placeholder="e.g. CERT-993821"
                      value={newCertId}
                      onChange={(e) => setNewCertId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Verification URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newCertUrl}
                      onChange={(e) => setNewCertUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowAddCertModal(false)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                    >
                      Save Certification
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 7: Preferences */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Auditory Sound FX & Chimes</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                    soundEnabled
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{soundEnabled ? 'Sound Enabled' : 'Sound Muted'}</span>
                </button>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                  soundEnabled
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}>
                  {soundEnabled ? 'ENABLED' : 'MUTED'}
                </span>
              </div>
            </div>

            {/* Audio Test Controls */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Audition Chimes:</span>
              <button
                type="button"
                onClick={() => soundUtility.playNotificationSound(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <BellRing className="w-3.5 h-3.5 text-blue-500" />
                <span>Test Notification Chime</span>
              </button>
              <button
                type="button"
                onClick={() => soundUtility.playMessageSound(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-600 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                <span>Test Message Pop</span>
              </button>
              <button
                type="button"
                onClick={() => soundUtility.playSuccessSound(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300 dark:hover:border-purple-600 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-purple-500" />
                <span>Test Course Win Chime</span>
              </button>
            </div>
          </div>

          {/* Appearance & Interface Theme Preferences */}
          <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Appearance & Interface Theme</h2>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full uppercase self-start sm:self-auto">
                Active: {theme === 'dark' ? 'Dark Theme' : 'Light Theme'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Select your visual theme preference. The setting is securely saved to your local session and profile.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-900/50'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Light Mode</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">High-contrast bright canvas designed for daylight training environments.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                  theme === 'dark'
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-slate-900 text-white shadow-xs ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-900/50'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-900/60 text-indigo-400 flex items-center justify-center shrink-0 shadow-2xs">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Dark Mode</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Deep slate palette with reduced glare for low-light officer workstations.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Earned Platform Certificates on Profile */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xs transition-colors">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Verified Platform Credentials & Accreditations</h2>
        </div>

        {certificates.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">No course certificates earned yet. Complete courses & pass assessments to earn credentials.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert._id}
                className="p-4 rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/40 dark:bg-purple-950/20 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 px-2 py-0.5 rounded">
                    {cert.certificateId}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mt-1.5">{cert.courseTitle}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Score: {cert.score}% • Issued: {cert.issueDate}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCert(cert)}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shrink-0 shadow-2xs transition-colors cursor-pointer"
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
