import { 
  User, Course, Enrollment, Assessment, AssessmentResult, 
  Certificate, Feedback, Notification, Announcement, Message, Material, ActivityLog,
  PlatformAchievement, LearningContent 
} from '../types';

export const INITIAL_USERS: User[] = [
  // Admin
  {
    _id: 'usr-admin-1',
    name: 'Rajeshwar Sharma',
    email: 'admin@capacityconnect.demo',
    passwordHash: 'Admin@123',
    role: 'admin',
    phone: '+91 98101 23456',
    organization: 'National Capacity Building Commission (NCBC)',
    designation: 'Chief Learning Officer & Principal Admin',
    department: 'Digital Governance & Human Capital',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    qualifications: [
      { degree: 'Ph.D. in Organizational Systems', institution: 'IIT Delhi', year: 2010 },
      { degree: 'M.Tech in Computer Science', institution: 'IIT Bombay', year: 2004 }
    ],
    skills: ['Strategic Governance', 'L&D Leadership', 'Policy Formulation', 'Curriculum Auditing', 'Digital Transformation'],
    interests: ['Smart Education', 'Public Sector Capacity', 'Skill Taxonomies'],
    experience: [
      { organization: 'Ministry of Skill Development', role: 'Advisor (Digital Capacity)', duration: '2018 - Present', description: 'Overseeing nationwide workforce capability mapping frameworks.' },
      { organization: 'National Informatics Centre', role: 'Senior Consultant', duration: '2011 - 2018', description: 'Engineered national portal architectures.' }
    ],
    certificates: [
      { name: 'Certified Chief Learning Officer', issuingOrganization: 'Global L&D Council', date: '2019-05-12', credentialId: 'CCLO-9821' }
    ],
    status: 'approved',
    bio: 'Dedicated to modernizing public and institutional capacity building through data-driven competency frameworks.',
    createdAt: '2025-01-10T09:00:00.000Z',
    updatedAt: '2026-02-01T10:30:00.000Z'
  },

  // Trainers
  {
    _id: 'usr-trainer-1',
    name: 'Dr. Ananya Rao',
    email: 'trainer@capacityconnect.demo', // Primary trainer demo
    passwordHash: 'Trainer@123',
    role: 'trainer',
    phone: '+91 98450 11223',
    organization: 'Indian Institute of Data Sciences & AI',
    designation: 'Professor & Lead AI Researcher',
    department: 'Computer Science & AI',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    qualifications: [
      { degree: 'Ph.D. in Machine Learning & Neural Networks', institution: 'IISc Bangalore', year: 2014 },
      { degree: 'M.Tech in Data Science', institution: 'IIT Madras', year: 2009 }
    ],
    skills: ['Python', 'Machine Learning', 'Data Science', 'Deep Learning', 'Data Visualization', 'NLP', 'TensorFlow', 'PyTorch'],
    interests: ['Predictive Analytics', 'Explainable AI', 'Digital Governance Solutions'],
    yearsOfExperience: 12,
    experience: [
      { organization: 'IISc Bangalore', role: 'Research Fellow & Adjunct Faculty', duration: '2014 - Present', description: 'Trained over 4,000 corporate and government executives on applied machine learning.' },
      { organization: 'Wipro Technologies', role: 'Principal Data Scientist', duration: '2009 - 2014', description: 'Architected enterprise AI pipelines.' }
    ],
    certificates: [
      { name: 'Google Cloud Certified Professional ML Engineer', issuingOrganization: 'Google Cloud', date: '2023-04-10', credentialId: 'GCP-ML-44129' },
      { name: 'Deep Learning Specialization', issuingOrganization: 'DeepLearning.AI', date: '2021-08-15', credentialId: 'DL-8831' }
    ],
    status: 'approved',
    bio: 'Renowned researcher and veteran educator specializing in demystifying Machine Learning and statistical computation for engineers and domain managers.',
    rating: 4.88,
    reviewsCount: 142,
    createdAt: '2025-01-15T11:00:00.000Z',
    updatedAt: '2026-02-12T14:20:00.000Z'
  },
  {
    _id: 'usr-trainer-2',
    name: 'Dr. Vikram Reddy',
    email: 'vikram.reddy@capacityconnect.demo',
    passwordHash: 'Trainer@123',
    role: 'trainer',
    phone: '+91 97110 33445',
    organization: 'National Institute of Strategic Leadership',
    designation: 'Director of Executive Education',
    department: 'Management Studies',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    qualifications: [
      { degree: 'Ph.D. in Organizational Behavior', institution: 'IIM Ahmedabad', year: 2012 },
      { degree: 'MBA in Human Resources', institution: 'XLRI Jamshedpur', year: 2006 }
    ],
    skills: ['Leadership & Team Management', 'Effective Communication', 'Project Management Essentials', 'Strategic Negotiation', 'Conflict Resolution'],
    interests: ['Cross-functional Team Synergy', 'Public Sector Innovation', 'Change Management'],
    yearsOfExperience: 16,
    experience: [
      { organization: 'IIM Bangalore (Exec Ed)', role: 'Visiting Senior Faculty', duration: '2016 - Present', description: 'Conducted 80+ executive leadership roundtables.' },
      { organization: 'Tata Management Training Centre', role: 'Head of Leadership Programs', duration: '2008 - 2016', description: 'Coached over 2,500 senior managers.' }
    ],
    certificates: [
      { name: 'Executive Coach Master Practitioner', issuingOrganization: 'ICF', date: '2018-09-10', credentialId: 'ICF-MCC-1092' }
    ],
    status: 'approved',
    bio: 'Executive coach and leadership specialist dedicated to empowering cross-functional teams with high-impact communication and decisive leadership capabilities.',
    rating: 4.82,
    reviewsCount: 98,
    createdAt: '2025-02-01T09:30:00.000Z',
    updatedAt: '2026-02-15T11:00:00.000Z'
  },
  {
    _id: 'usr-trainer-3',
    name: 'Priya Sharma',
    email: 'priya.sharma@capacityconnect.demo',
    passwordHash: 'Trainer@123',
    role: 'trainer',
    phone: '+91 98200 55667',
    organization: 'Cyber Security Operations & Research Centre',
    designation: 'Chief Information Security Advisor',
    department: 'Cyber Defense & Information Assurance',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    qualifications: [
      { degree: 'M.S. in Information Security', institution: 'IIT Kanpur', year: 2015 },
      { degree: 'B.Tech in Computer Science', institution: 'NIT Trichy', year: 2011 }
    ],
    skills: ['Cybersecurity Awareness', 'Threat Modeling', 'Network Defense', 'Cloud Security', 'Incident Response', 'ISO 27001'],
    interests: ['Zero Trust Architecture', 'Enterprise Data Protection', 'Critical Infrastructure Resilience'],
    yearsOfExperience: 10,
    experience: [
      { organization: 'CERT-In Advisory Partner', role: 'Security Architect', duration: '2018 - Present', description: 'Trained 35+ departments on threat prevention.' },
      { organization: 'Infosys Cyber Defense', role: 'Senior Security Analyst', duration: '2012 - 2018', description: 'Managed national infrastructure pentests.' }
    ],
    certificates: [
      { name: 'Certified Information Systems Security Professional (CISSP)', issuingOrganization: 'ISC2', date: '2019-11-20', credentialId: 'CISSP-66120' },
      { name: 'Certified Ethical Hacker (CEH v12)', issuingOrganization: 'EC-Council', date: '2021-03-14', credentialId: 'CEH-99412' }
    ],
    status: 'approved',
    bio: 'Passionate cyber defense evangelist training professionals on zero-day awareness, social engineering mitigation, and security-first enterprise architectures.',
    rating: 4.91,
    reviewsCount: 116,
    createdAt: '2025-01-20T10:15:00.000Z',
    updatedAt: '2026-02-18T16:45:00.000Z'
  },
  {
    _id: 'usr-trainer-4',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@capacityconnect.demo',
    passwordHash: 'Trainer@123',
    role: 'trainer',
    phone: '+91 99300 77889',
    organization: 'CloudScale Enterprise Solutions',
    designation: 'Principal Solutions Architect',
    department: 'Cloud Infrastructure & DevOps',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    qualifications: [
      { degree: 'M.Tech in Software Engineering', institution: 'BITS Pilani', year: 2013 },
      { degree: 'B.E. in Information Technology', institution: 'Pune University', year: 2009 }
    ],
    skills: ['Cloud Computing Fundamentals', 'AWS Architecture', 'Google Cloud Platform', 'Docker & Kubernetes', 'DevOps & CI/CD', 'Microservices'],
    interests: ['Serverless Computing', 'Hybrid Cloud Migration', 'Edge Computing'],
    yearsOfExperience: 13,
    experience: [
      { organization: 'CloudScale Solutions', role: 'Chief Architect', duration: '2017 - Present', description: 'Engineered cloud migration tracks for 60+ organizations.' },
      { organization: 'Amazon Web Services Partner', role: 'Senior Solutions Specialist', duration: '2011 - 2017', description: 'Conducted hands-on cloud immersion days.' }
    ],
    certificates: [
      { name: 'AWS Certified Solutions Architect - Professional', issuingOrganization: 'Amazon Web Services', date: '2022-06-18', credentialId: 'AWS-SAP-7731' },
      { name: 'Certified Kubernetes Administrator (CKA)', issuingOrganization: 'CNCF', date: '2023-01-10', credentialId: 'CKA-33810' }
    ],
    status: 'approved',
    bio: 'Practitioner and educator bridging the gap between legacy monoliths and resilient, scalable cloud architectures.',
    rating: 4.85,
    reviewsCount: 88,
    createdAt: '2025-02-05T08:00:00.000Z',
    updatedAt: '2026-02-20T12:10:00.000Z'
  },
  {
    _id: 'usr-trainer-5',
    name: 'Sneha Iyer',
    email: 'sneha.iyer@capacityconnect.demo',
    passwordHash: 'Trainer@123',
    role: 'trainer',
    phone: '+91 98400 66778',
    organization: 'Digital Transformation Institute of India',
    designation: 'Senior Enterprise Strategist',
    department: 'Digital Innovation & Analytics',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    qualifications: [
      { degree: 'MBA in Technology Management', institution: 'IIM Calcutta', year: 2016 },
      { degree: 'B.Tech in Computer Science', institution: 'Anna University', year: 2012 }
    ],
    skills: ['Digital Transformation', 'Data Visualization', 'Business Intelligence', 'PowerBI & Tableau', 'Agile Product Management', 'Design Thinking'],
    interests: ['Data Storytelling', 'Process Automation', 'Digital Agility'],
    yearsOfExperience: 9,
    experience: [
      { organization: 'Digital Transformation Institute', role: 'Head of Enterprise Labs', duration: '2019 - Present', description: 'Curated modernization roadmaps for enterprise clients.' },
      { organization: 'Deloitte Digital', role: 'Senior Strategy Consultant', duration: '2014 - 2019', description: 'Led BI and executive dashboarding initiatives.' }
    ],
    certificates: [
      { name: 'Tableau Certified Data Analyst', issuingOrganization: 'Tableau Software', date: '2023-05-19', credentialId: 'TB-DA-4190' },
      { name: 'PMI-Agile Certified Practitioner (PMI-ACP)', issuingOrganization: 'PMI', date: '2022-09-08', credentialId: 'PMI-ACP-901' }
    ],
    status: 'approved',
    bio: 'Championing human-centered digital innovation, visual data intelligence, and agile capacity transformations.',
    rating: 4.87,
    reviewsCount: 75,
    createdAt: '2025-01-25T14:30:00.000Z',
    updatedAt: '2026-02-22T09:15:00.000Z'
  },

  // Trainees
  {
    _id: 'usr-trainee-1',
    name: 'Rahul Varma',
    email: 'trainee@capacityconnect.demo', // Primary trainee demo
    passwordHash: 'Trainee@123',
    role: 'trainee',
    phone: '+91 98765 43210',
    organization: 'Department of Telecommunications & IT',
    designation: 'Assistant Technical Officer',
    department: 'Network & Cloud Infrastructure',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    qualifications: [
      { degree: 'B.Tech in Information Technology', institution: 'Delhi Technological University (DTU)', year: 2022 }
    ],
    skills: ['Python', 'SQL', 'Data Analysis', 'Network Basics', 'Communication'],
    interests: ['Machine Learning', 'Data Visualization', 'Cloud Architecture', 'Leadership Development'],
    experience: [
      { organization: 'Dept of Telecom', role: 'Technical Assistant', duration: '2022 - Present', description: 'Assisting in regional bandwidth auditing and log analysis.' }
    ],
    certificates: [
      { name: 'Certified Python Associate', issuingOrganization: 'Python Institute', date: '2023-08-10', credentialId: 'PCAP-3109' }
    ],
    status: 'approved',
    bio: 'Eager technologist focused on advancing enterprise data engineering and machine learning capabilities to enhance public service delivery.',
    createdAt: '2025-02-10T10:00:00.000Z',
    updatedAt: '2026-02-26T15:00:00.000Z'
  },
  {
    _id: 'usr-trainee-2',
    name: 'Kavita Sundaram',
    email: 'kavita.s@capacityconnect.demo',
    passwordHash: 'Trainee@123',
    role: 'trainee',
    phone: '+91 98111 88990',
    organization: 'National Health Mission Data Cell',
    designation: 'Junior Statistical Officer',
    department: 'Epidemiological Informatics',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    qualifications: [
      { degree: 'M.Sc. in Statistics', institution: 'Madras University', year: 2021 },
      { degree: 'B.Sc. in Mathematics', institution: 'Loyola College Chennai', year: 2019 }
    ],
    skills: ['R Programming', 'Data Visualization', 'Statistical Modeling', 'Excel Advanced', 'Public Health Metrics'],
    interests: ['Predictive Modeling', 'Machine Learning', 'Tableau'],
    experience: [
      { organization: 'NHM Data Cell', role: 'Statistical Assistant', duration: '2021 - Present', description: 'Compiled state-level health indicators.' }
    ],
    certificates: [],
    status: 'approved',
    bio: 'Passionate about leveraging modern data science tools for evidence-based healthcare policy design.',
    createdAt: '2025-02-12T11:20:00.000Z',
    updatedAt: '2026-02-20T10:00:00.000Z'
  },
  {
    _id: 'usr-trainee-3',
    name: 'Manish Chawla',
    email: 'manish.c@capacityconnect.demo',
    passwordHash: 'Trainee@123',
    role: 'trainee',
    phone: '+91 97722 33441',
    organization: 'State Electricity Distribution Corporation',
    designation: 'Operations Engineer',
    department: 'Smart Grid & Metering',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    qualifications: [
      { degree: 'B.E. in Electrical & Electronics', institution: 'Punjab Engineering College', year: 2020 }
    ],
    skills: ['SCADA Systems', 'IoT Basics', 'Project Coordination', 'Problem Solving'],
    interests: ['Cybersecurity in Industrial Control', 'Cloud Infrastructure', 'Team Leadership'],
    experience: [
      { organization: 'SEDC', role: 'Junior Engineer', duration: '2020 - Present', description: 'Monitored grid telemetry systems and substations.' }
    ],
    certificates: [],
    status: 'approved',
    bio: 'Dedicated power systems engineer looking to integrate cyber defense and cloud resilience into critical grid operations.',
    createdAt: '2025-02-14T09:10:00.000Z',
    updatedAt: '2026-02-18T14:30:00.000Z'
  },
  {
    _id: 'usr-trainee-4',
    name: 'Divya Nair',
    email: 'divya.nair@capacityconnect.demo',
    passwordHash: 'Trainee@123',
    role: 'trainee',
    phone: '+91 98844 55661',
    organization: 'Urban Development Authority',
    designation: 'Project Associate',
    department: 'Smart Cities Mission',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    qualifications: [
      { degree: 'Bachelor of Urban Planning', institution: 'SPA Delhi', year: 2023 }
    ],
    skills: ['GIS Mapping', 'AutoCAD', 'Stakeholder Communication', 'Agile Principles'],
    interests: ['Digital Transformation', 'Data Storytelling', 'Leadership'],
    experience: [
      { organization: 'Urban Development Authority', role: 'Graduate Trainee', duration: '2023 - Present', description: 'Assisting smart mobility integration.' }
    ],
    certificates: [],
    status: 'approved',
    bio: 'Urban planner keen on leveraging digital governance workflows to build sustainable citizen-first smart cities.',
    createdAt: '2025-02-15T15:40:00.000Z',
    updatedAt: '2026-02-24T16:00:00.000Z'
  },
  {
    _id: 'usr-trainee-5',
    name: 'Aditya Sen',
    email: 'aditya.sen@capacityconnect.demo',
    passwordHash: 'Trainee@123',
    role: 'trainee',
    phone: '+91 98311 22334',
    organization: 'Public Works Department',
    designation: 'Assistant Executive Engineer',
    department: 'Infrastructure Delivery',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    qualifications: [
      { degree: 'B.Tech in Civil Engineering', institution: 'Jadavpur University', year: 2019 }
    ],
    skills: ['Project Estimation', 'Site Supervision', 'Vendor Management', 'Public Procurement'],
    interests: ['Project Management Essentials', 'Leadership & Team Management', 'Digital Transformation'],
    experience: [
      { organization: 'PWD', role: 'Assistant Engineer', duration: '2019 - Present', description: 'Supervising bridge and highway construction packages.' }
    ],
    certificates: [],
    status: 'approved',
    bio: 'Committed infrastructure engineer building modern managerial and project governance competencies.',
    createdAt: '2025-02-18T10:00:00.000Z',
    updatedAt: '2026-02-25T11:00:00.000Z'
  },
  {
    _id: 'usr-trainee-6',
    name: 'Pooja Deshmukh',
    email: 'pooja.d@capacityconnect.demo',
    passwordHash: 'Trainee@123',
    role: 'trainee',
    phone: '+91 98233 44556',
    organization: 'Revenue & Land Records Department',
    designation: 'Data Verification Analyst',
    department: 'Digital Land Records',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    qualifications: [
      { degree: 'B.Sc. in Computer Science', institution: 'Pune University', year: 2022 }
    ],
    skills: ['Database Management', 'Data Cleaning', 'Cybersecurity Awareness', 'Documentation'],
    interests: ['Cloud Computing Fundamentals', 'Data Security', 'Process Automation'],
    experience: [],
    certificates: [],
    status: 'approved',
    bio: 'Working on digitization of cadastral maps and secure storage of land registry records.',
    createdAt: '2025-02-20T12:00:00.000Z',
    updatedAt: '2026-02-26T14:00:00.000Z'
  },
  {
    _id: 'usr-trainee-7',
    name: 'Karthik Balakrishnan',
    email: 'karthik.b@capacityconnect.demo',
    passwordHash: 'Trainee@123',
    role: 'trainee',
    phone: '+91 98401 99887',
    organization: 'State Water Supply Board',
    designation: 'Systems Coordinator',
    department: 'IT & Automation',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    qualifications: [
      { degree: 'B.Tech in Electronics & Instrumentation', institution: 'NIT Calicut', year: 2021 }
    ],
    skills: ['Sensor Integration', 'Telemetry Analysis', 'Python', 'Reporting'],
    interests: ['Machine Learning Fundamentals', 'Data Visualization', 'IoT Systems'],
    experience: [],
    certificates: [],
    status: 'approved',
    bio: 'Bridging physical water sensor networks with real-time analytics for leak detection and demand forecasting.',
    createdAt: '2025-02-21T08:30:00.000Z',
    updatedAt: '2026-02-26T09:45:00.000Z'
  },
  {
    _id: 'usr-trainee-8',
    name: 'Sunita Banerjee',
    email: 'sunita.b@capacityconnect.demo',
    passwordHash: 'Trainee@123',
    role: 'trainee',
    phone: '+91 98305 11442',
    organization: 'Finance & Accounts Department',
    designation: 'Accounts Officer',
    department: 'Audit & Fiscal Planning',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
    qualifications: [
      { degree: 'M.Com in Accounting & Finance', institution: 'Calcutta University', year: 2020 }
    ],
    skills: ['Financial Analysis', 'Auditing', 'Risk Assessment', 'Advanced Spreadsheets'],
    interests: ['Data Visualization', 'Leadership & Team Management', 'Digital Transformation'],
    experience: [],
    certificates: [],
    status: 'pending', // Pending user for Admin approval demo
    bio: 'Finance professional striving to implement automated financial dashboards and predictive budget models.',
    createdAt: '2026-02-27T10:00:00.000Z',
    updatedAt: '2026-02-27T10:00:00.000Z'
  },
  {
    _id: 'usr-trainee-9',
    name: 'Gaurav Kulkarni',
    email: 'gaurav.k@capacityconnect.demo',
    passwordHash: 'Trainee@123',
    role: 'trainee',
    phone: '+91 97654 22110',
    organization: 'Transport Corporation',
    designation: 'Fleet Operations Assistant',
    department: 'Logistics & Dispatch',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    qualifications: [
      { degree: 'Diploma in Automobile Engineering', institution: 'Govt Polytechnic Pune', year: 2021 }
    ],
    skills: ['Fleet Tracking', 'Logistics Planning', 'Operational Reporting'],
    interests: ['Project Management Essentials', 'Digital Transformation', 'Effective Communication'],
    experience: [],
    certificates: [],
    status: 'pending', // Another pending for approval demo
    bio: 'Enhancing public transit fleet reliability through systematic process optimization.',
    createdAt: '2026-02-28T09:15:00.000Z',
    updatedAt: '2026-02-28T09:15:00.000Z'
  },
  {
    _id: 'usr-trainee-10',
    name: 'Nisha Singhal',
    email: 'nisha.s@capacityconnect.demo',
    passwordHash: 'Trainee@123',
    role: 'trainee',
    phone: '+91 98188 77665',
    organization: 'Tourism & Cultural Affairs',
    designation: 'Public Relations Officer',
    department: 'Digital Media & Outreach',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    qualifications: [
      { degree: 'Master in Mass Communication', institution: 'IIMC New Delhi', year: 2021 }
    ],
    skills: ['Content Strategy', 'Social Media Analytics', 'Public Speaking', 'Campaign Planning'],
    interests: ['Effective Communication', 'Digital Transformation', 'Data Storytelling'],
    experience: [],
    certificates: [],
    status: 'approved',
    bio: 'Digital communications specialist driving transparent citizen outreach for cultural initiatives.',
    createdAt: '2025-02-22T14:10:00.000Z',
    updatedAt: '2026-02-25T17:20:00.000Z'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    _id: 'crs-101',
    title: 'Python for Data Analysis',
    description: 'Master practical Python programming, Pandas, NumPy, and data wrangling workflows tailored for institutional data analysts and public sector reporting.',
    category: 'Data Science & Analytics',
    subject: 'Python',
    trainerId: 'usr-trainer-1',
    trainerName: 'Dr. Ananya Rao',
    trainerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    difficulty: 'Beginner',
    duration: '4 Weeks (16 Hours)',
    skills: ['Python', 'Pandas', 'NumPy', 'Data Cleaning', 'Exploratory Data Analysis'],
    learningObjectives: [
      'Understand core Python syntax, collections, and control flow',
      'Ingest and clean messy CSV, Excel, and JSON datasets using Pandas',
      'Perform statistical aggregations, filtering, and grouped computations',
      'Automate repetitive operational data processing tasks'
    ],
    modules: [
      {
        id: 'mod-101-1',
        title: 'Module 1: Python Fundamentals & Data Structures',
        description: 'Variables, loops, functions, lists, dictionaries, and list comprehensions.',
        durationMinutes: 45,
        type: 'video',
        contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        textContent: 'Python is a high-level, dynamically typed language known for its readable syntax. In this module, we examine basic data types, control flow structures, and function definitions crucial for data manipulation.',
        order: 1
      },
      {
        id: 'mod-101-2',
        title: 'Module 2: In-Depth Pandas DataFrames & Series',
        description: 'Loading real-world datasets, indexing, slicing, filtering, and missing value imputation.',
        durationMinutes: 50,
        type: 'presentation',
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'Pandas provides high-performance, easy-to-use data structures. A DataFrame represents a tabular, spreadsheet-like data structure containing an ordered collection of columns.',
        order: 2
      },
      {
        id: 'mod-101-3',
        title: 'Module 3: Numerical Computation with NumPy',
        description: 'Array operations, broadcasting, vectorized math, and statistical operations.',
        durationMinutes: 40,
        type: 'pdf',
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'NumPy forms the fundamental building block for scientific computing in Python. Vectorized operations on NumPy ndarrays execute with C-speed efficiency.',
        order: 3
      },
      {
        id: 'mod-101-4',
        title: 'Module 4: Exploratory Data Analysis & Case Studies',
        description: 'Hands-on capstone processing administrative datasets and generating automated summaries.',
        durationMinutes: 60,
        type: 'text',
        textContent: 'In this capstone module, we load public administrative data, clean anomalous entries, group by administrative divisions, and compute monthly capacity utilization indexes.',
        order: 4
      }
    ],
    materialsCount: 4,
    assessmentIds: ['asm-101'],
    enrolledUsers: 342,
    rating: 4.89,
    reviewsCount: 84,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    createdAt: '2025-01-20T10:00:00.000Z',
    updatedAt: '2026-02-10T11:00:00.000Z'
  },
  {
    _id: 'crs-102',
    title: 'Machine Learning Fundamentals',
    description: 'Comprehensive foundation in supervised, unsupervised, and evaluation methodologies with Scikit-Learn for organizational forecasting and pattern recognition.',
    category: 'Data Science & Analytics',
    subject: 'Machine Learning',
    trainerId: 'usr-trainer-1',
    trainerName: 'Dr. Ananya Rao',
    trainerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    difficulty: 'Intermediate',
    duration: '6 Weeks (24 Hours)',
    skills: ['Machine Learning', 'Python', 'Scikit-Learn', 'Classification', 'Regression', 'Clustering', 'Model Evaluation'],
    learningObjectives: [
      'Distinguish between supervised and unsupervised learning algorithms',
      'Train linear regression, logistic regression, decision trees, and random forests',
      'Evaluate models using Precision, Recall, F1-Score, and ROC-AUC curves',
      'Deploy baseline predictive models for resource allocation'
    ],
    modules: [
      {
        id: 'mod-102-1',
        title: 'Module 1: Introduction to Machine Learning Paradigms',
        description: 'Supervised vs. unsupervised learning, feature spaces, and data splitting.',
        durationMinutes: 50,
        type: 'video',
        contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        textContent: 'Machine learning algorithms learn patterns from historical observations. We explore feature engineering, target definitions, and standard train-test splitting practices.',
        order: 1
      },
      {
        id: 'mod-102-2',
        title: 'Module 2: Supervised Classification & Regression',
        description: 'Logistic regression, Decision Trees, and Random Forests in depth.',
        durationMinutes: 65,
        type: 'presentation',
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'Supervised learning involves learning a function that maps an input to an output based on example input-output pairs. We review decision boundary mechanics and ensemble voting.',
        order: 2
      },
      {
        id: 'mod-102-3',
        title: 'Module 3: Unsupervised Learning & Clustering',
        description: 'K-Means clustering, PCA dimensionality reduction, and anomaly detection.',
        durationMinutes: 45,
        type: 'pdf',
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'Unsupervised learning discovers hidden patterns or groupings in unlabeled datasets. K-means clusters observations by iteratively minimizing within-cluster inertia.',
        order: 3
      },
      {
        id: 'mod-102-4',
        title: 'Module 4: Model Evaluation, Hyperparameter Tuning & Cross-Validation',
        description: 'Confusion matrix, precision-recall tradeoffs, GridSearch, and preventing overfitting.',
        durationMinutes: 55,
        type: 'text',
        textContent: 'Accurate model evaluation prevents severe overfitting. We demonstrate k-fold cross validation, ROC-AUC metric interpretation, and hyperparameter grid optimization.',
        order: 4
      }
    ],
    materialsCount: 5,
    assessmentIds: ['asm-102'],
    enrolledUsers: 289,
    rating: 4.92,
    reviewsCount: 71,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&auto=format&fit=crop&q=80',
    createdAt: '2025-01-25T14:00:00.000Z',
    updatedAt: '2026-02-15T09:30:00.000Z'
  },
  {
    _id: 'crs-103',
    title: 'Leadership & Team Management',
    description: 'Cultivate strategic decision-making, adaptive leadership styles, delegation mastery, and team conflict resolution in high-stakes environments.',
    category: 'Leadership & Management',
    subject: 'Leadership',
    trainerId: 'usr-trainer-2',
    trainerName: 'Dr. Vikram Reddy',
    trainerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    difficulty: 'All Levels',
    duration: '3 Weeks (12 Hours)',
    skills: ['Leadership & Team Management', 'Strategic Decision Making', 'Conflict Resolution', 'Emotional Intelligence', 'Delegation'],
    learningObjectives: [
      'Adopt situational leadership models matching team maturity',
      'Build psychologically safe and high-accountability team cultures',
      'Navigate inter-departmental conflicts and consensus building',
      'Effectively delegate responsibilities while maintaining governance oversight'
    ],
    modules: [
      {
        id: 'mod-103-1',
        title: 'Module 1: Situational & Transformational Leadership',
        description: 'Leadership archetypes, self-assessment, and situational responsiveness.',
        durationMinutes: 40,
        type: 'video',
        contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        textContent: 'Leadership is not a fixed attribute but an adaptive behavior. We analyze how transformational leaders inspire shared visions and align organizational missions.',
        order: 1
      },
      {
        id: 'mod-103-2',
        title: 'Module 2: High-Performance Team Dynamics & Motivation',
        description: 'Tuckmans stages, psychological safety, and intrinsic motivators.',
        durationMinutes: 45,
        type: 'presentation',
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'High-performing teams move systematically through forming, storming, norming, and performing stages. Learn how to diagnose bottlenecks in team synergy.',
        order: 2
      },
      {
        id: 'mod-103-3',
        title: 'Module 3: Conflict Management & Constructive Feedback',
        description: 'Interest-based negotiation, non-violent communication, and feedback loops.',
        durationMinutes: 45,
        type: 'pdf',
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'Conflict is inevitable in mission-critical environments. We provide structured frameworks for de-escalating friction and converting differing viewpoints into innovation.',
        order: 3
      }
    ],
    materialsCount: 3,
    assessmentIds: ['asm-103'],
    enrolledUsers: 412,
    rating: 4.84,
    reviewsCount: 92,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
    createdAt: '2025-02-02T11:00:00.000Z',
    updatedAt: '2026-02-20T10:00:00.000Z'
  },
  {
    _id: 'crs-104',
    title: 'Effective Communication in Public Governance',
    description: 'Master crisp executive briefing, stakeholder management, cross-departmental documentation, and public messaging.',
    category: 'Communication & Soft Skills',
    subject: 'Communication',
    trainerId: 'usr-trainer-2',
    trainerName: 'Dr. Vikram Reddy',
    trainerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    difficulty: 'Beginner',
    duration: '2 Weeks (8 Hours)',
    skills: ['Effective Communication', 'Executive Briefing', 'Active Listening', 'Crisis Communication', 'Presentation Skills'],
    learningObjectives: [
      'Structure complex technical topics into clear executive summaries',
      'Apply active listening and stakeholder-empathy frameworks',
      'Deliver persuasive visual presentations to senior leadership'
    ],
    modules: [
      {
        id: 'mod-104-1',
        title: 'Module 1: The Pyramid Principle in Administrative Writing',
        description: 'Starting with the conclusion, grouping arguments, and logical ordering.',
        durationMinutes: 35,
        type: 'video',
        contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        textContent: 'The Pyramid Principle helps professionals communicate findings with clarity by stating the main message first followed by structured supporting arguments.',
        order: 1
      },
      {
        id: 'mod-104-2',
        title: 'Module 2: Verbal Fluency & Executive Presentations',
        description: 'Voice modulation, body language, handling Q&A under pressure.',
        durationMinutes: 40,
        type: 'presentation',
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'Delivering executive presentations requires concise articulation, sharp data grounding, and calm composure during cross-examination.',
        order: 2
      }
    ],
    materialsCount: 2,
    assessmentIds: ['asm-104'],
    enrolledUsers: 255,
    rating: 4.80,
    reviewsCount: 48,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
    createdAt: '2025-02-05T09:00:00.000Z',
    updatedAt: '2026-02-18T12:00:00.000Z'
  },
  {
    _id: 'crs-105',
    title: 'Cybersecurity Awareness & Defense Essentials',
    description: 'Understand modern threat landscapes, phishing detection, endpoint hardening, credential hygiene, and incident reporting protocols.',
    category: 'Security & Infrastructure',
    subject: 'Cybersecurity',
    trainerId: 'usr-trainer-3',
    trainerName: 'Priya Sharma',
    trainerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    difficulty: 'Beginner',
    duration: '3 Weeks (10 Hours)',
    skills: ['Cybersecurity Awareness', 'Threat Modeling', 'Phishing Defense', 'Identity & Access Management', 'Incident Response'],
    learningObjectives: [
      'Identify sophisticated social engineering and spear phishing tactics',
      'Enforce strong multi-factor authentication and credential safeguards',
      'Comply with national cyber incident reporting protocols'
    ],
    modules: [
      {
        id: 'mod-105-1',
        title: 'Module 1: The Modern Cyber Threat Landscape',
        description: 'Ransomware vectors, credential harvesting, and attack surfaces.',
        durationMinutes: 45,
        type: 'video',
        contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        textContent: 'Cyber attacks increasingly target human vulnerabilities rather than pure code flaws. We dissect recent threat campaigns and attack kill chains.',
        order: 1
      },
      {
        id: 'mod-105-2',
        title: 'Module 2: Network & Endpoint Hygiene',
        description: 'VPNs, secure Wi-Fi, patching routines, and removable media controls.',
        durationMinutes: 45,
        type: 'presentation',
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'Securing devices requires strict adherence to automated updates, encryption at rest, and firewall configuration across endpoints.',
        order: 2
      },
      {
        id: 'mod-105-3',
        title: 'Module 3: Incident Response & Emergency Procedures',
        description: 'Triage, containment steps, and reporting to organizational CERT units.',
        durationMinutes: 40,
        type: 'pdf',
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'When an anomaly or breach is suspected, swift containment without destroying digital forensic artifacts is paramount.',
        order: 3
      }
    ],
    materialsCount: 4,
    assessmentIds: ['asm-105'],
    enrolledUsers: 512,
    rating: 4.94,
    reviewsCount: 110,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    createdAt: '2025-01-18T10:00:00.000Z',
    updatedAt: '2026-02-22T14:00:00.000Z'
  },
  {
    _id: 'crs-106',
    title: 'Cloud Computing Fundamentals',
    description: 'Foundational concepts of IaaS, PaaS, SaaS, virtualization, containerization, and cloud resource management on modern hyperscalers.',
    category: 'Cloud & Infrastructure',
    subject: 'Cloud Computing',
    trainerId: 'usr-trainer-4',
    trainerName: 'Arjun Mehta',
    trainerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    difficulty: 'Intermediate',
    duration: '4 Weeks (16 Hours)',
    skills: ['Cloud Computing Fundamentals', 'Virtualization', 'Docker & Kubernetes', 'Cloud Storage', 'High Availability'],
    learningObjectives: [
      'Differentiate cloud delivery models (Public, Private, Hybrid, Sovereign)',
      'Provision and manage virtual compute instances and cloud object storage',
      'Understand foundational containerization with Docker'
    ],
    modules: [
      {
        id: 'mod-106-1',
        title: 'Module 1: Cloud Architecture Concepts & Service Models',
        description: 'IaaS, PaaS, SaaS, elasticity, and cloud economics.',
        durationMinutes: 50,
        type: 'video',
        contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        textContent: 'Cloud computing transforms capital infrastructure expenditure into flexible operational capability. We study multi-tenant architecture and SLA guarantees.',
        order: 1
      },
      {
        id: 'mod-106-2',
        title: 'Module 2: Compute, Storage & Virtual Networking',
        description: 'VPCs, subnets, security groups, block storage, and object stores.',
        durationMinutes: 55,
        type: 'presentation',
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'A solid cloud deployment requires properly configured virtual private clouds, network access control lists, and redundant storage tiers.',
        order: 2
      },
      {
        id: 'mod-106-3',
        title: 'Module 3: Containers & Microservices Essentials',
        description: 'Container runtimes, Dockerfiles, and orchestration introduction.',
        durationMinutes: 45,
        type: 'pdf',
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'Containers encapsulate applications with their runtime dependencies, enabling frictionless migration between dev, staging, and production clusters.',
        order: 3
      }
    ],
    materialsCount: 3,
    assessmentIds: ['asm-106'],
    enrolledUsers: 380,
    rating: 4.86,
    reviewsCount: 78,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    createdAt: '2025-02-01T11:00:00.000Z',
    updatedAt: '2026-02-23T11:00:00.000Z'
  },
  {
    _id: 'crs-107',
    title: 'Digital Transformation & Change Agility',
    description: 'Lead digital modernization initiatives, legacy system migrations, citizen experience redesign, and agile process re-engineering.',
    category: 'Strategy & Innovation',
    subject: 'Digital Transformation',
    trainerId: 'usr-trainer-5',
    trainerName: 'Sneha Iyer',
    trainerAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    difficulty: 'Intermediate',
    duration: '3 Weeks (12 Hours)',
    skills: ['Digital Transformation', 'Agile Product Management', 'Design Thinking', 'Change Management', 'Process Automation'],
    learningObjectives: [
      'Formulate comprehensive digital transformation roadmaps',
      'Apply design thinking to citizen and employee journey mapping',
      'Overcome institutional resistance to automated digital workflows'
    ],
    modules: [
      {
        id: 'mod-107-1',
        title: 'Module 1: Frameworks for Digital Modernization',
        description: 'Digital maturity assessments, tech debt mitigation, and strategic milestones.',
        durationMinutes: 40,
        type: 'video',
        contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        textContent: 'Successful transformation is 20% technology and 80% people and process alignment. We examine holistic capability blueprints.',
        order: 1
      },
      {
        id: 'mod-107-2',
        title: 'Module 2: Human-Centered Design & Agile Delivery',
        description: 'Empathy maps, user stories, sprint planning, and minimum viable deliverables.',
        durationMinutes: 50,
        type: 'presentation',
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'Learn how to iteratively pilot citizen-facing portals with rapid user testing and feedback-driven enhancements.',
        order: 2
      }
    ],
    materialsCount: 3,
    assessmentIds: ['asm-107'],
    enrolledUsers: 295,
    rating: 4.87,
    reviewsCount: 62,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    createdAt: '2025-01-28T10:00:00.000Z',
    updatedAt: '2026-02-24T16:00:00.000Z'
  },
  {
    _id: 'crs-108',
    title: 'Data Visualization & Executive Dashboarding',
    description: 'Transform complex organizational datasets into intuitive, actionable charts and dashboards using visual cognitive principles.',
    category: 'Data Science & Analytics',
    subject: 'Data Visualization',
    trainerId: 'usr-trainer-5',
    trainerName: 'Sneha Iyer',
    trainerAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    difficulty: 'All Levels',
    duration: '3 Weeks (12 Hours)',
    skills: ['Data Visualization', 'PowerBI & Tableau', 'Data Storytelling', 'KPI Design', 'Information Architecture'],
    learningObjectives: [
      'Select the right visual chart format for comparison, distribution, and composition',
      'Design clean, uncluttered executive dashboards for senior leadership',
      'Avoid misleading visual encodings and deceptive axes'
    ],
    modules: [
      {
        id: 'mod-108-1',
        title: 'Module 1: Visual Perception & Chart Selection Rules',
        description: 'Gestalt principles, pre-attentive attributes, and visual encodings.',
        durationMinutes: 40,
        type: 'video',
        contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        textContent: 'Visual charts should reduce cognitive load. We cover color theory, visual contrast, and choosing between line, bar, scatter, and tree maps.',
        order: 1
      },
      {
        id: 'mod-108-2',
        title: 'Module 2: Building Interactive Executive Dashboards',
        description: 'KPI hierarchy, filtering controls, drill-downs, and layout balance.',
        durationMinutes: 50,
        type: 'presentation',
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'A great dashboard answers the top 3 critical operational questions within 5 seconds of viewing.',
        order: 2
      }
    ],
    materialsCount: 3,
    assessmentIds: ['asm-108'],
    enrolledUsers: 330,
    rating: 4.88,
    reviewsCount: 67,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    createdAt: '2025-02-04T12:00:00.000Z',
    updatedAt: '2026-02-25T13:00:00.000Z'
  },
  {
    _id: 'crs-109',
    title: 'Project Management Essentials (PMBOK / Agile)',
    description: 'Master scope definition, work breakdown structures, critical path scheduling, budget tracking, risk mitigation, and sprint execution.',
    category: 'Leadership & Management',
    subject: 'Project Management',
    trainerId: 'usr-trainer-2',
    trainerName: 'Dr. Vikram Reddy',
    trainerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    difficulty: 'Intermediate',
    duration: '4 Weeks (16 Hours)',
    skills: ['Project Management Essentials', 'Risk Management', 'WBS Planning', 'Agile & Scrum', 'Budget Tracking'],
    learningObjectives: [
      'Construct a comprehensive Project Charter and Work Breakdown Structure',
      'Compute Critical Path Method (CPM) and schedule variance',
      'Maintain an active organizational risk register and mitigation plan'
    ],
    modules: [
      {
        id: 'mod-109-1',
        title: 'Module 1: Project Initiation & Scope Baseline',
        description: 'Stakeholder register, requirements traceability, and scope bounding.',
        durationMinutes: 45,
        type: 'video',
        contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
        textContent: 'Clear project scope definition prevents costly scope creep. We analyze the Project Management Body of Knowledge (PMBOK) initiation guidelines.',
        order: 1
      },
      {
        id: 'mod-109-2',
        title: 'Module 2: Scheduling, Critical Path & Earned Value Management',
        description: 'Gantt charts, CPM calculation, cost variance (CV), and schedule variance (SV).',
        durationMinutes: 55,
        type: 'presentation',
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'Earned Value Management (EVM) provides objective measures of project performance by comparing planned value with actual expenditure and work accomplished.',
        order: 2
      }
    ],
    materialsCount: 2,
    assessmentIds: ['asm-109'],
    enrolledUsers: 275,
    rating: 4.81,
    reviewsCount: 55,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
    createdAt: '2025-02-08T15:00:00.000Z',
    updatedAt: '2026-02-26T10:00:00.000Z'
  },
  {
    _id: 'crs-110',
    title: 'Artificial Intelligence Basics for Public Officials',
    description: 'High-level introduction to generative AI, large language models, ethical AI governance, bias mitigation, and responsible public adoption.',
    category: 'Data Science & Analytics',
    subject: 'Artificial Intelligence',
    trainerId: 'usr-trainer-1',
    trainerName: 'Dr. Ananya Rao',
    trainerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    difficulty: 'Beginner',
    duration: '2 Weeks (8 Hours)',
    skills: ['Artificial Intelligence Basics', 'Generative AI', 'AI Ethics', 'Prompt Engineering', 'Responsible AI'],
    learningObjectives: [
      'Understand how LLMs and transformer architectures generate language',
      'Formulate effective prompts for administrative summarization and drafting',
      'Identify hallucination risks, privacy constraints, and ethical pitfalls'
    ],
    modules: [
      {
        id: 'mod-110-1',
        title: 'Module 1: Generative AI & Foundation Models Demystified',
        description: 'How modern generative models work, context windows, and tokens.',
        durationMinutes: 40,
        type: 'video',
        contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        textContent: 'Generative AI models predict statistical continuations of text. We explore their immense productivity benefits alongside safe usage guidelines.',
        order: 1
      },
      {
        id: 'mod-110-2',
        title: 'Module 2: Governance, Ethics & Data Privacy in Public AI',
        description: 'Data sovereignty, algorithmic bias, auditability, and guardrails.',
        durationMinutes: 45,
        type: 'presentation',
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'Public sector AI deployment must adhere to stringent privacy standards, non-discrimination principles, and human-in-the-loop governance.',
        order: 2
      }
    ],
    materialsCount: 2,
    assessmentIds: ['asm-110'],
    enrolledUsers: 490,
    rating: 4.93,
    reviewsCount: 115,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
    createdAt: '2025-02-11T13:00:00.000Z',
    updatedAt: '2026-02-27T11:00:00.000Z'
  },
  {
    _id: 'crs-111',
    title: 'Full Stack Web Architecture & RESTful APIs',
    description: 'Design decoupled modern web systems with React frontend, Node/Express middleware, REST protocols, and secure database integrations.',
    category: 'Software Engineering',
    subject: 'Web Development',
    trainerId: 'usr-trainer-4',
    trainerName: 'Arjun Mehta',
    trainerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    difficulty: 'Advanced',
    duration: '6 Weeks (24 Hours)',
    skills: ['Web Development', 'React.js', 'Node.js', 'REST APIs', 'JWT Security', 'Database Design'],
    learningObjectives: [
      'Build single-page web applications with modern component state patterns',
      'Implement stateless REST endpoints with input validation and rate limiting',
      'Secure web transactions with JSON Web Tokens and RBAC'
    ],
    modules: [
      {
        id: 'mod-111-1',
        title: 'Module 1: Modern Component-Driven Frontend Architecture',
        description: 'State management, hooks, and responsive UX design.',
        durationMinutes: 50,
        type: 'video',
        contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        textContent: 'Component-driven frontends decouple user interface rendering from underlying data transport layers.',
        order: 1
      },
      {
        id: 'mod-111-2',
        title: 'Module 2: RESTful API Design & Express Middleware',
        description: 'Routing, middleware chains, error handling, and JSON serialization.',
        durationMinutes: 55,
        type: 'presentation',
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'Express provides an unopinionated, minimalist web framework for building resilient HTTP services.',
        order: 2
      }
    ],
    materialsCount: 3,
    assessmentIds: ['asm-111'],
    enrolledUsers: 210,
    rating: 4.85,
    reviewsCount: 42,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    createdAt: '2025-02-14T10:00:00.000Z',
    updatedAt: '2026-02-25T15:00:00.000Z'
  },
  {
    _id: 'crs-112',
    title: 'Advanced IoT & Smart Infrastructure Telemetry',
    description: 'Sensor network protocols (MQTT, CoAP), edge computing nodes, time-series data storage, and predictive maintenance telemetry.',
    category: 'Engineering & IoT',
    subject: 'Internet of Things',
    trainerId: 'usr-trainer-4',
    trainerName: 'Arjun Mehta',
    trainerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    difficulty: 'Advanced',
    duration: '5 Weeks (20 Hours)',
    skills: ['Internet of Things', 'Sensor Integration', 'MQTT Protocol', 'Edge Computing', 'Predictive Maintenance'],
    learningObjectives: [
      'Deploy lightweight telemetry publishers using MQTT brokers',
      'Aggregate high-frequency time-series telemetry data at the network edge',
      'Implement alert thresholds for predictive maintenance of physical assets'
    ],
    modules: [
      {
        id: 'mod-112-1',
        title: 'Module 1: IoT Communication Protocols & Architectures',
        description: 'MQTT publish-subscribe broker models, QoS levels, and CoAP.',
        durationMinutes: 45,
        type: 'video',
        contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        textContent: 'MQTT enables high-throughput, low-overhead messaging across resource-constrained edge gateways.',
        order: 1
      },
      {
        id: 'mod-112-2',
        title: 'Module 2: Edge Computing & Time-Series Telemetry',
        description: 'Edge filtering, time-series databases, and real-time visualization.',
        durationMinutes: 50,
        type: 'presentation',
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        textContent: 'Processing high-frequency sensor readings on edge devices minimizes bandwidth saturation and latency.',
        order: 2
      }
    ],
    materialsCount: 2,
    assessmentIds: ['asm-112'],
    enrolledUsers: 145,
    rating: 4.82,
    reviewsCount: 31,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    createdAt: '2025-02-16T14:00:00.000Z',
    updatedAt: '2026-02-26T12:00:00.000Z'
  }
];

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    _id: 'enr-1',
    traineeId: 'usr-trainee-1',
    traineeName: 'Rahul Varma',
    courseId: 'crs-101',
    courseTitle: 'Python for Data Analysis',
    progress: 100,
    completedModules: ['mod-101-1', 'mod-101-2', 'mod-101-3', 'mod-101-4'],
    status: 'completed',
    enrolledAt: '2025-02-12T10:00:00.000Z',
    completedAt: '2025-02-25T16:30:00.000Z',
    lastAccessedAt: '2026-02-25T16:30:00.000Z'
  },
  {
    _id: 'enr-2',
    traineeId: 'usr-trainee-1',
    traineeName: 'Rahul Varma',
    courseId: 'crs-102',
    courseTitle: 'Enterprise Cloud Architecture & DevOps Governance',
    progress: 75,
    completedModules: ['mod-102-1', 'mod-102-2', 'mod-102-3'],
    status: 'in-progress',
    enrolledAt: '2025-02-15T11:00:00.000Z',
    lastAccessedAt: '2026-02-27T14:20:00.000Z'
  },
  {
    _id: 'enr-3',
    traineeId: 'usr-trainee-1',
    traineeName: 'Rahul Varma',
    courseId: 'crs-105',
    courseTitle: 'Executive Agile Project & Program Management',
    progress: 33,
    completedModules: ['mod-105-1'],
    status: 'in-progress',
    enrolledAt: '2025-02-20T09:00:00.000Z',
    lastAccessedAt: '2026-02-26T11:15:00.000Z'
  },
  {
    _id: 'enr-4',
    traineeId: 'usr-trainee-2',
    traineeName: 'Sneha Patel',
    courseId: 'crs-101',
    courseTitle: 'Python for Data Analysis',
    progress: 100,
    completedModules: ['mod-101-1', 'mod-101-2', 'mod-101-3', 'mod-101-4'],
    status: 'completed',
    enrolledAt: '2025-02-14T09:00:00.000Z',
    completedAt: '2025-02-26T10:00:00.000Z',
    lastAccessedAt: '2026-02-26T10:00:00.000Z'
  },
  {
    _id: 'enr-5',
    traineeId: 'usr-trainee-3',
    traineeName: 'Vikramaditya Rathore',
    courseId: 'crs-105',
    courseTitle: 'Executive Agile Project & Program Management',
    progress: 66,
    completedModules: ['mod-105-1', 'mod-105-2'],
    status: 'in-progress',
    enrolledAt: '2025-02-16T14:00:00.000Z',
    lastAccessedAt: '2026-02-27T09:00:00.000Z'
  },
  {
    _id: 'enr-6',
    traineeId: 'usr-trainee-4',
    traineeName: 'Meera Nambiar',
    courseId: 'crs-107',
    courseTitle: 'Digital Personal Data Protection (DPDP) Act Compliance',
    progress: 50,
    completedModules: ['mod-107-1'],
    status: 'in-progress',
    enrolledAt: '2025-02-18T10:00:00.000Z',
    lastAccessedAt: '2026-02-25T11:00:00.000Z'
  },
  {
    _id: 'enr-7',
    traineeId: 'usr-trainee-5',
    traineeName: 'Col. Alok Mukherjee',
    courseId: 'crs-103',
    courseTitle: 'National Cybersecurity Defense & Threat Intelligence',
    progress: 100,
    completedModules: ['mod-103-1', 'mod-103-2', 'mod-103-3'],
    status: 'completed',
    enrolledAt: '2025-02-10T08:00:00.000Z',
    completedAt: '2025-02-22T15:00:00.000Z',
    lastAccessedAt: '2026-02-22T15:00:00.000Z'
  }
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    _id: 'asm-101',
    courseId: 'crs-101',
    courseTitle: 'Python for Data Analysis',
    trainerId: 'usr-trainer-1',
    trainerName: 'Dr. Ananya Rao',
    title: 'Python & Data Wrangling Final Competency Assessment',
    description: 'Comprehensive 10-question multiple-choice exam validating Python data structures, Pandas DataFrame transformations, NumPy vectorization, and data filtering capabilities.',
    durationMinutes: 15,
    deadline: '2026-04-30T23:59:59.000Z',
    passingScore: 70,
    status: 'published',
    createdAt: '2025-01-22T10:00:00.000Z',
    questions: [
      {
        id: 'q1',
        question: 'Which of the following Pandas functions is most suitable for handling missing or NaN values by replacing them with a default value?',
        options: ['dropna()', 'fillna()', 'replace_null()', 'impute_val()'],
        correctAnswer: 1,
        explanation: 'fillna() fills NaN or null values in a Pandas Series or DataFrame with specified values or interpolation methods.',
        marks: 10
      },
      {
        id: 'q2',
        question: 'In NumPy, what is the primary computational benefit of array broadcasting over standard Python for-loops?',
        options: [
          'It creates nested dynamic lists',
          'It executes vectorized computations at C-level speed without memory duplication',
          'It forces strict string typecasting',
          'It eliminates garbage collection overhead'
        ],
        correctAnswer: 1,
        explanation: 'Broadcasting allows NumPy to execute element-wise operations on arrays of different shapes in optimized C loops without unnecessary data copies.',
        marks: 10
      },
      {
        id: 'q3',
        question: 'Which DataFrame indexing method allows selection based on explicit integer row and column positions?',
        options: ['df.loc[]', 'df.iloc[]', 'df.at_index()', 'df.slice()'],
        correctAnswer: 1,
        explanation: 'df.iloc[] is strictly integer-position based (from 0 to length-1 of the axis).',
        marks: 10
      },
      {
        id: 'q4',
        question: 'What is the default return type when computing df.groupby("department")["salary"].mean()?',
        options: ['A NumPy Array', 'A Pandas Series indexed by department', 'A Python Dictionary', 'A JSON String'],
        correctAnswer: 1,
        explanation: 'Selecting a single column from a DataFrameGroupBy object and computing the aggregation yields a Pandas Series.',
        marks: 10
      },
      {
        id: 'q5',
        question: 'Which statement correctly describes a Python dictionary comprehension?',
        options: [
          'A generator expression enclosed in parentheses',
          'A concise syntax for creating dictionaries from iterables using {key: value for item in iterable}',
          'An immutable set comprehension',
          'A multi-threaded queue'
        ],
        correctAnswer: 1,
        explanation: 'Dictionary comprehension uses curly braces with key: value mapping expressions.',
        marks: 10
      },
      {
        id: 'q6',
        question: 'Which method should be used to merge two DataFrames on a shared unique column key similar to an SQL JOIN?',
        options: ['pd.concat()', 'pd.merge()', 'df.append()', 'pd.combine()'],
        correctAnswer: 1,
        explanation: 'pd.merge() connects rows in DataFrames based on one or more keys (SQL-style joins: inner, left, right, outer).',
        marks: 10
      },
      {
        id: 'q7',
        question: 'What does the parameter inplace=True signify in Pandas DataFrame methods?',
        options: [
          'It runs the operation asynchronously',
          'It modifies the existing DataFrame directly without returning a new copy',
          'It saves the DataFrame to disk immediately',
          'It enables multi-core execution'
        ],
        correctAnswer: 1,
        explanation: 'inplace=True modifies the calling DataFrame in place and returns None.',
        marks: 10
      },
      {
        id: 'q8',
        question: 'What happens when you execute np.array([1, 2, "3", 4.5]) in NumPy?',
        options: [
          'It raises a TypeError',
          'It creates an array of homogeneous strings due to implicit upcasting',
          'It creates a nested Python tuple',
          'It casts all values to float64'
        ],
        correctAnswer: 1,
        explanation: 'NumPy arrays require homogeneous data types; non-string elements are upcasted to Unicode strings.',
        marks: 10
      },
      {
        id: 'q9',
        question: 'Which Pandas function quickly displays summary statistics including count, mean, std, min, and quartiles?',
        options: ['df.info()', 'df.describe()', 'df.summary()', 'df.stats()'],
        correctAnswer: 1,
        explanation: 'df.describe() generates descriptive statistics summarizing the central tendency, dispersion, and shape of a dataset distribution.',
        marks: 10
      },
      {
        id: 'q10',
        question: 'How do you filter a DataFrame "df" for rows where column "age" is greater than 30 and "department" equals "Tech"?',
        options: [
          'df[(df["age"] > 30) and (df["department"] == "Tech")]',
          'df[(df["age"] > 30) & (df["department"] == "Tech")]',
          'df.filter(age > 30, department == "Tech")',
          'df.where("age > 30 & department == Tech")'
        ],
        correctAnswer: 1,
        explanation: 'Pandas uses bitwise operators (&, |) with individual conditions enclosed in parentheses for boolean indexing.',
        marks: 10
      }
    ]
  },
  {
    _id: 'asm-102',
    courseId: 'crs-102',
    courseTitle: 'Machine Learning Fundamentals',
    trainerId: 'usr-trainer-1',
    trainerName: 'Dr. Ananya Rao',
    title: 'Machine Learning Concepts & Algorithm Certification Quiz',
    description: 'Evaluates supervised classification, regression loss functions, clustering metrics, ROC curves, and cross-validation principles.',
    durationMinutes: 20,
    deadline: '2026-05-15T23:59:59.000Z',
    passingScore: 70,
    status: 'published',
    createdAt: '2025-01-26T12:00:00.000Z',
    questions: [
      {
        id: 'q1',
        question: 'What is the primary objective of Supervised Learning?',
        options: [
          'Discover unguided data clusters without target labels',
          'Learn a mapping function from input features to known target outputs',
          'Compress images using autoencoders',
          'Simulate robotic balance via reward penalties'
        ],
        correctAnswer: 1,
        explanation: 'Supervised learning algorithms are trained using labeled examples, such as an input where the desired output is known.',
        marks: 10
      },
      {
        id: 'q2',
        question: 'What does high variance in a machine learning model indicate?',
        options: [
          'The model is underfitting the training data',
          'The model is overfitting and learning noise in the training set',
          'The dataset has too few features',
          'The learning rate is too low'
        ],
        correctAnswer: 1,
        explanation: 'High variance indicates the model is overly complex and fits random noise in the training data, leading to poor generalization on unseen test data.',
        marks: 10
      },
      {
        id: 'q3',
        question: 'Which metric is best suited for evaluating a fraud detection model with severe class imbalance (e.g., 99.9% non-fraud, 0.1% fraud)?',
        options: ['Accuracy', 'Precision-Recall / F1-Score', 'Mean Squared Error', 'Adjusted R-squared'],
        correctAnswer: 1,
        explanation: 'In highly imbalanced datasets, standard accuracy is misleading. Precision, Recall, and F1-Score measure performance on the minority class accurately.',
        marks: 10
      },
      {
        id: 'q4',
        question: 'What algorithm is an ensemble method combining multiple decision trees via bootstrap aggregation (bagging)?',
        options: ['Logistic Regression', 'Random Forest', 'Support Vector Machine', 'K-Means'],
        correctAnswer: 1,
        explanation: 'Random Forest trains multiple decision trees on random subsets of data and features, aggregating their predictions to reduce variance.',
        marks: 10
      },
      {
        id: 'q5',
        question: 'What is the purpose of K-Fold Cross Validation?',
        options: [
          'To replace hyperparameter optimization',
          'To assess model generalization performance by partitioning the dataset into K subsets',
          'To speed up model training by 10x',
          'To automatically clean corrupt data points'
        ],
        correctAnswer: 1,
        explanation: 'K-Fold partitions the dataset into K folds, training on K-1 folds and testing on the remaining fold K times, ensuring every sample is evaluated.',
        marks: 10
      },
      {
        id: 'q6',
        question: 'Which of the following is an Unsupervised Learning algorithm?',
        options: ['K-Means Clustering', 'Linear Regression', 'Logistic Regression', 'Random Forest Classifier'],
        correctAnswer: 0,
        explanation: 'K-Means partitions data points into K clusters based on feature similarity without requiring prior labels.',
        marks: 10
      },
      {
        id: 'q7',
        question: 'What does the ROC-AUC curve plot?',
        options: [
          'Precision against Recall',
          'True Positive Rate (TPR) against False Positive Rate (FPR) across various classification thresholds',
          'Training Loss against Validation Loss',
          'Residuals against Predicted Values'
        ],
        correctAnswer: 1,
        explanation: 'ROC-AUC visualizes the trade-off between sensitivity (TPR) and 1-specificity (FPR) across all possible classification probability thresholds.',
        marks: 10
      },
      {
        id: 'q8',
        question: 'Why is feature scaling (e.g. StandardScaler) crucial for distance-based algorithms like KNN and SVM?',
        options: [
          'It prevents integer overflow',
          'It ensures features with larger numerical magnitudes do not disproportionately dominate Euclidean distance calculations',
          'It converts continuous features to categorical strings',
          'It removes outlier rows automatically'
        ],
        correctAnswer: 1,
        explanation: 'Distance-based algorithms compute spatial differences; unscaled features with large ranges would overwhelm features with smaller ranges.',
        marks: 10
      },
      {
        id: 'q9',
        question: 'What is the primary role of the Regularization term (L1/L2) in loss functions?',
        options: [
          'To penalize large model weights and prevent overfitting',
          'To speed up CPU clock cycles',
          'To add random noise to training inputs',
          'To force the model to memorize the dataset'
        ],
        correctAnswer: 0,
        explanation: 'Regularization adds a penalty proportional to weight magnitude (L1 lasso shrinks to zero, L2 ridge shrinks weights), reducing model complexity.',
        marks: 10
      },
      {
        id: 'q10',
        question: 'In a confusion matrix, if actual positives are 50 and the model predicts 45 correctly as positive and 5 incorrectly as negative, what is the Recall?',
        options: ['50%', '90%', '10%', '80%'],
        correctAnswer: 1,
        explanation: 'Recall = True Positives / (True Positives + False Negatives) = 45 / (45 + 5) = 45/50 = 90%.',
        marks: 10
      }
    ]
  },
  {
    _id: 'asm-103',
    courseId: 'crs-103',
    courseTitle: 'Leadership & Team Management',
    trainerId: 'usr-trainer-2',
    trainerName: 'Dr. Vikram Reddy',
    title: 'Strategic Leadership & Conflict Resolution Assessment',
    description: 'Examines situational leadership models, team psychological safety, delegation matrix, and crisis conflict management.',
    durationMinutes: 15,
    deadline: '2026-05-30T23:59:59.000Z',
    passingScore: 70,
    status: 'published',
    createdAt: '2025-02-04T10:00:00.000Z',
    questions: [
      {
        id: 'q1',
        question: 'According to the Situational Leadership model (Hersey-Blanchard), which leadership style should be used for a team member with low competence but high commitment?',
        options: ['Delegating (S4)', 'Directing / Telling (S1)', 'Coaching (S2)', 'Supporting (S3)'],
        correctAnswer: 1,
        explanation: 'Directing (S1) provides clear, step-by-step instructions and close supervision for enthusiastic beginners needing skill guidance.',
        marks: 20
      },
      {
        id: 'q2',
        question: 'What is the primary indicator of Psychological Safety within an organizational team?',
        options: [
          'Total absence of disagreement or constructive debate',
          'Team members feel safe taking interpersonal risks, voicing mistakes, and asking questions without fear of punishment',
          'Strict top-down hierarchy where only managers speak in meetings',
          '100% agreement on all strategic proposals'
        ],
        correctAnswer: 1,
        explanation: 'Psychological safety enables candid communication, rapid innovation, and fearless reporting of errors before they cascade.',
        marks: 20
      },
      {
        id: 'q3',
        question: 'In the Thomas-Kilmann Conflict Mode Instrument, which approach balances high assertiveness with high cooperativeness?',
        options: ['Avoiding', 'Competing', 'Collaborating', 'Accommodating'],
        correctAnswer: 2,
        explanation: 'Collaborating seeks win-win integrations addressing the core concerns of all stakeholders.',
        marks: 20
      },
      {
        id: 'q4',
        question: 'What distinguishes Effective Delegation from simple task dumping?',
        options: [
          'Transferring responsibility without granting corresponding authority',
          'Providing clear outcomes, necessary authority, resource support, and mutually agreed check-in milestones',
          'Never following up on deliverables',
          'Assigning only mundane, low-value administrative tasks'
        ],
        correctAnswer: 1,
        explanation: 'True delegation empowers employees with authority and boundary clarity while maintaining structured accountability.',
        marks: 20
      },
      {
        id: 'q5',
        question: 'What is the core emphasis of Transformational Leadership compared to Transactional Leadership?',
        options: [
          'Relying solely on financial reward and penalty contracts',
          'Inspiring a shared vision, encouraging intellectual stimulation, and fostering individual development',
          'Maintaining strict micro-management checklists',
          'Eliminating all organizational hierarchy'
        ],
        correctAnswer: 1,
        explanation: 'Transformational leaders elevate team aspirations, fostering innovation and intrinsic purpose beyond simple transactional exchanges.',
        marks: 20
      }
    ]
  },
  {
    _id: 'asm-105',
    courseId: 'crs-105',
    courseTitle: 'Cybersecurity Awareness & Defense Essentials',
    trainerId: 'usr-trainer-3',
    trainerName: 'Priya Sharma',
    title: 'Enterprise Cyber Defense & Threat Mitigation Exam',
    description: 'Tests knowledge of social engineering defense, multi-factor authentication, endpoint hygiene, and zero trust architectures.',
    durationMinutes: 15,
    deadline: '2026-06-15T23:59:59.000Z',
    passingScore: 70,
    status: 'published',
    createdAt: '2025-01-20T14:00:00.000Z',
    questions: [
      {
        id: 'q1',
        question: 'What is the core principle of Zero Trust Architecture in enterprise cybersecurity?',
        options: [
          'Trust everything inside the corporate firewall',
          'Never trust, always verify every user, device, and transaction regardless of location',
          'Eliminate the need for user passwords',
          'Allow unrestricted internal lateral network movement'
        ],
        correctAnswer: 1,
        explanation: 'Zero Trust assumes no implicit trust granted to assets or user accounts based solely on their physical or network location.',
        marks: 20
      },
      {
        id: 'q2',
        question: 'Which of the following is a classic indicator of a Spear Phishing attempt?',
        options: [
          'An email with generic greetings addressed to "Dear Customer"',
          'A highly customized email referencing specific ongoing projects with urgent requests to click a masked external link or alter bank accounts',
          'A standard system maintenance notice from your verified intranet portal',
          'A scheduled calendar invite from an internal colleague'
        ],
        correctAnswer: 1,
        explanation: 'Spear phishing uses curated reconnaissance to impersonate trusted partners or executives with tailored urgency.',
        marks: 20
      },
      {
        id: 'q3',
        question: 'Which combination qualifies as true Multi-Factor Authentication (MFA)?',
        options: [
          'A password and a security question answer (both something you know)',
          'A password (something you know) and a hardware security key / TOTP app code (something you have)',
          'Two different passwords stored in a spreadsheet',
          'An email password and an email confirmation link sent to the exact same inbox'
        ],
        correctAnswer: 1,
        explanation: 'MFA requires at least two distinct authentication categories: Something you know, Something you have, or Something you are (biometric).',
        marks: 20
      },
      {
        id: 'q4',
        question: 'What should be the immediate first step taken if ransomware or malicious lateral movement is detected on an office workstation?',
        options: [
          'Restart the machine repeatedly',
          'Immediately disconnect the device from Wi-Fi/Ethernet to isolate it and alert the IT Security Response team',
          'Attempt to negotiate payment with attackers',
          'Forward the encrypted files to all departmental colleagues'
        ],
        correctAnswer: 1,
        explanation: 'Physical or network isolation halts malware command-and-control communication and prevents lateral contagion across the subnet.',
        marks: 20
      },
      {
        id: 'q5',
        question: 'What is the purpose of regular Principle of Least Privilege (PoLP) access audits?',
        options: [
          'To ensure all employees have full domain administrator privileges',
          'To restrict user and service account access permissions to strictly what is essential for their legitimate job duties',
          'To delete user accounts automatically after 10 days',
          'To disable all cloud storage accounts'
        ],
        correctAnswer: 1,
        explanation: 'PoLP limits the blast radius of a compromised credential by minimizing unnecessary elevated permissions.',
        marks: 20
      }
    ]
  }
];

export const INITIAL_RESULTS: AssessmentResult[] = [
  {
    _id: 'res-1',
    traineeId: 'usr-trainee-1',
    traineeName: 'Rahul Varma',
    assessmentId: 'asm-101',
    assessmentTitle: 'Python & Data Wrangling Final Competency Assessment',
    courseId: 'crs-101',
    courseTitle: 'Python for Data Analysis',
    score: 90,
    totalMarks: 100,
    percentage: 90,
    passed: true,
    answers: { q1: 1, q2: 1, q3: 1, q4: 1, q5: 1, q6: 1, q7: 1, q8: 1, q9: 1, q10: 0 },
    submittedAt: '2025-02-25T16:25:00.000Z'
  },
  {
    _id: 'res-2',
    traineeId: 'usr-trainee-2',
    traineeName: 'Kavita Sundaram',
    assessmentId: 'asm-101',
    assessmentTitle: 'Python & Data Wrangling Final Competency Assessment',
    courseId: 'crs-101',
    courseTitle: 'Python for Data Analysis',
    score: 80,
    totalMarks: 100,
    percentage: 80,
    passed: true,
    answers: { q1: 1, q2: 1, q3: 1, q4: 1, q5: 0, q6: 1, q7: 1, q8: 0, q9: 1, q10: 1 },
    submittedAt: '2025-02-26T09:55:00.000Z'
  },
  {
    _id: 'res-3',
    traineeId: 'usr-trainee-5',
    traineeName: 'Aditya Sen',
    assessmentId: 'asm-103',
    assessmentTitle: 'Strategic Leadership & Conflict Resolution Assessment',
    courseId: 'crs-103',
    courseTitle: 'Leadership & Team Management',
    score: 100,
    totalMarks: 100,
    percentage: 100,
    passed: true,
    answers: { q1: 1, q2: 1, q3: 2, q4: 1, q5: 1 },
    submittedAt: '2025-02-22T14:50:00.000Z'
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    _id: 'cert-1',
    certificateId: 'CC-2026-10045',
    traineeId: 'usr-trainee-1',
    traineeName: 'Rahul Varma',
    traineeEmail: 'trainee@capacityconnect.demo',
    courseId: 'crs-101',
    courseTitle: 'Python for Data Analysis',
    trainerId: 'usr-trainer-1',
    trainerName: 'Dr. Ananya Rao',
    score: 90,
    issueDate: '2025-02-25',
    verificationStatus: 'valid'
  },
  {
    _id: 'cert-2',
    certificateId: 'CC-2026-10046',
    traineeId: 'usr-trainee-2',
    traineeName: 'Kavita Sundaram',
    traineeEmail: 'kavita.s@capacityconnect.demo',
    courseId: 'crs-101',
    courseTitle: 'Python for Data Analysis',
    trainerId: 'usr-trainer-1',
    trainerName: 'Dr. Ananya Rao',
    score: 80,
    issueDate: '2025-02-26',
    verificationStatus: 'valid'
  },
  {
    _id: 'cert-3',
    certificateId: 'CC-2026-10047',
    traineeId: 'usr-trainee-5',
    traineeName: 'Aditya Sen',
    traineeEmail: 'aditya.sen@capacityconnect.demo',
    courseId: 'crs-103',
    courseTitle: 'Leadership & Team Management',
    trainerId: 'usr-trainer-2',
    trainerName: 'Dr. Vikram Reddy',
    score: 100,
    issueDate: '2025-02-22',
    verificationStatus: 'valid'
  }
];

export const INITIAL_FEEDBACKS: Feedback[] = [
  {
    _id: 'fb-1',
    courseId: 'crs-101',
    courseTitle: 'Python for Data Analysis',
    traineeId: 'usr-trainee-1',
    traineeName: 'Rahul Varma',
    overallRating: 5,
    courseQuality: 5,
    trainerQuality: 5,
    learningMaterials: 5,
    assessmentQuality: 4,
    comments: 'Extremely structured modules! The Pandas and DataFrame manipulation examples helped me automate 6 hours of weekly report compilation at my department.',
    createdAt: '2025-02-25T16:40:00.000Z'
  },
  {
    _id: 'fb-2',
    courseId: 'crs-101',
    courseTitle: 'Python for Data Analysis',
    traineeId: 'usr-trainee-2',
    traineeName: 'Kavita Sundaram',
    overallRating: 5,
    courseQuality: 5,
    trainerQuality: 5,
    learningMaterials: 4,
    assessmentQuality: 5,
    comments: 'Dr. Ananya Rao explains vectorized math and broadcasting with exceptional clarity. The assessment was rigorous and fair.',
    createdAt: '2025-02-26T10:15:00.000Z'
  },
  {
    _id: 'fb-3',
    courseId: 'crs-103',
    courseTitle: 'Leadership & Team Management',
    traineeId: 'usr-trainee-5',
    traineeName: 'Aditya Sen',
    overallRating: 5,
    courseQuality: 5,
    trainerQuality: 5,
    learningMaterials: 5,
    assessmentQuality: 5,
    comments: 'Dr. Vikram Reddy brings unmatched field insights into conflict resolution and managing cross-functional public infrastructure teams.',
    createdAt: '2025-02-22T15:30:00.000Z'
  }
];

export const INITIAL_MATERIALS: Material[] = [
  {
    _id: 'mat-1',
    title: 'Pandas & NumPy Quick Reference Guide',
    courseId: 'crs-101',
    courseTitle: 'Python for Data Analysis',
    trainerId: 'usr-trainer-1',
    trainerName: 'Dr. Ananya Rao',
    subject: 'Python',
    moduleTitle: 'Module 2: In-Depth Pandas DataFrames & Series',
    skill: 'Python Data Structures',
    fileType: 'pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '3.4 MB',
    downloadsCount: 412,
    createdAt: '2025-01-21T11:00:00.000Z'
  },
  {
    _id: 'mat-2',
    title: 'Data Cleaning & Wrangling Master Cheatsheet',
    courseId: 'crs-101',
    courseTitle: 'Python for Data Analysis',
    trainerId: 'usr-trainer-1',
    trainerName: 'Dr. Ananya Rao',
    subject: 'Python',
    moduleTitle: 'Module 3: Numerical Computation with NumPy',
    skill: 'Data Wrangling',
    fileType: 'document',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '1.8 MB',
    downloadsCount: 388,
    createdAt: '2025-01-22T14:30:00.000Z'
  },
  {
    _id: 'mat-3',
    title: 'Recorded Lecture: Vectorized Computation Architecture',
    courseId: 'crs-101',
    courseTitle: 'Python for Data Analysis',
    trainerId: 'usr-trainer-1',
    trainerName: 'Dr. Ananya Rao',
    subject: 'Python',
    moduleTitle: 'Module 1: Python Fundamentals & Data Structures',
    skill: 'Python',
    fileType: 'video',
    fileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    fileSize: '245 MB',
    downloadsCount: 520,
    createdAt: '2025-01-20T16:00:00.000Z'
  },
  {
    _id: 'mat-4',
    title: 'Executive Slide Deck: Supervised Learning Mechanics',
    courseId: 'crs-102',
    courseTitle: 'Machine Learning Fundamentals',
    trainerId: 'usr-trainer-1',
    trainerName: 'Dr. Ananya Rao',
    subject: 'Machine Learning',
    moduleTitle: 'Module 1: Introduction to Machine Learning Paradigms',
    skill: 'Machine Learning',
    fileType: 'presentation',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '14.2 MB',
    downloadsCount: 310,
    createdAt: '2025-01-26T10:00:00.000Z'
  },
  {
    _id: 'mat-5',
    title: 'Situational Leadership Framework & Diagnostic Matrix',
    courseId: 'crs-103',
    courseTitle: 'Leadership & Team Management',
    trainerId: 'usr-trainer-2',
    trainerName: 'Dr. Vikram Reddy',
    subject: 'Leadership',
    moduleTitle: 'Module 1: Situational & Transformational Leadership',
    skill: 'Leadership & Team Management',
    fileType: 'pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '4.1 MB',
    downloadsCount: 490,
    createdAt: '2025-02-03T11:00:00.000Z'
  },
  {
    _id: 'mat-6',
    title: 'Enterprise Incident Response Playbook & Triage Runbook',
    courseId: 'crs-105',
    courseTitle: 'Cybersecurity Awareness & Defense Essentials',
    trainerId: 'usr-trainer-3',
    trainerName: 'Priya Sharma',
    subject: 'Cybersecurity',
    moduleTitle: 'Module 3: Incident Response & Emergency Procedures',
    skill: 'Incident Response',
    fileType: 'pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '6.5 MB',
    downloadsCount: 615,
    createdAt: '2025-01-20T12:00:00.000Z'
  },
  {
    _id: 'mat-7',
    title: 'Docker & Kubernetes Microservices Reference Blueprint',
    courseId: 'crs-106',
    courseTitle: 'Cloud Computing Fundamentals',
    trainerId: 'usr-trainer-4',
    trainerName: 'Arjun Mehta',
    subject: 'Cloud Computing',
    moduleTitle: 'Module 3: Containers & Microservices Essentials',
    skill: 'Docker & Kubernetes',
    fileType: 'presentation',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '18.9 MB',
    downloadsCount: 370,
    createdAt: '2025-02-02T15:00:00.000Z'
  },
  {
    _id: 'mat-8',
    title: 'Data Storytelling & Executive Dashboard Wireframes',
    courseId: 'crs-108',
    courseTitle: 'Data Visualization & Executive Dashboarding',
    trainerId: 'usr-trainer-5',
    trainerName: 'Sneha Iyer',
    subject: 'Data Visualization',
    moduleTitle: 'Module 2: Building Interactive Executive Dashboards',
    skill: 'Data Storytelling',
    fileType: 'document',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '8.2 MB',
    downloadsCount: 295,
    createdAt: '2025-02-05T14:00:00.000Z'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    _id: 'ann-1',
    title: 'National Digital Capacity Building Hackathon 2026 Live',
    description: 'Capacity Connect portal deployed nationwide under Smart India Hackathon 2026 (Problem Statement 26075 - Smart Education). All department cohorts are invited to enroll in competency roadmaps.',
    category: 'Achievement',
    priority: 'high',
    targetAudience: 'Everyone',
    publishDate: '2026-02-28',
    authorName: 'Rajeshwar Sharma (Admin)',
    createdAt: '2026-02-28T08:00:00.000Z'
  },
  {
    _id: 'ann-2',
    title: 'New Course Launch: Artificial Intelligence Basics for Public Officials',
    description: 'Authored by Dr. Ananya Rao, this foundational 2-week course explores Generative AI adoption guardrails, prompt engineering, and bias mitigation.',
    category: 'New Course',
    priority: 'medium',
    targetAudience: 'Trainees',
    publishDate: '2026-02-27',
    authorName: 'Rajeshwar Sharma (Admin)',
    createdAt: '2026-02-27T10:00:00.000Z'
  },
  {
    _id: 'ann-3',
    title: 'Competency Mapping Engine V2.0 Activated',
    description: 'Trainers can now review match scores against organizational requirement taxonomies with full transparent parameter breakdown (Skills 40%, Experience 20%, Qualifications 20%, Subject 15%, Rating 5%).',
    category: 'System Update',
    priority: 'medium',
    targetAudience: 'Trainers',
    publishDate: '2026-02-26',
    authorName: 'Rajeshwar Sharma (Admin)',
    createdAt: '2026-02-26T12:00:00.000Z'
  },
  {
    _id: 'ann-4',
    title: 'Mandatory Quarterly Cyber Defense Refreshers Announced',
    description: 'All enrolled civil and technical officers must complete Cybersecurity Awareness modules before April 30 to maintain digital operational compliance.',
    category: 'Training Program',
    priority: 'urgent',
    targetAudience: 'Trainees',
    publishDate: '2026-02-24',
    authorName: 'Rajeshwar Sharma (Admin)',
    createdAt: '2026-02-24T09:00:00.000Z'
  },
  {
    _id: 'ann-5',
    title: 'Over 5,400 Digital Assessments Completed Nationwide!',
    description: 'Capacity Connect celebrates passing milestone metrics with 94.2% course satisfaction and 1,250+ verified digital credentials generated.',
    category: 'Achievement',
    priority: 'low',
    targetAudience: 'Everyone',
    publishDate: '2026-02-20',
    authorName: 'Rajeshwar Sharma (Admin)',
    createdAt: '2026-02-20T11:00:00.000Z'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    _id: 'notif-1',
    userId: 'usr-trainee-1',
    title: 'Certificate Generated Successfully',
    message: 'Congratulations! Your digital certificate for "Python for Data Analysis" (CC-2026-10045) is now ready to view, download, and verify.',
    type: 'certificate',
    read: false,
    link: '/trainee/certificates',
    createdAt: '2026-02-25T16:30:00.000Z'
  },
  {
    _id: 'notif-2',
    userId: 'usr-trainee-1',
    title: 'Assessment Score: 90% (Passed)',
    message: 'You scored 90% in Python & Data Wrangling Final Competency Assessment. Superb work!',
    type: 'success',
    read: false,
    link: '/trainee/assessments',
    createdAt: '2026-02-25T16:25:00.000Z'
  },
  {
    _id: 'notif-3',
    userId: 'usr-trainee-1',
    title: 'Upcoming Assessment Deadline',
    message: 'Machine Learning Concepts & Algorithm Certification Quiz deadline is approaching on May 15.',
    type: 'deadline',
    read: true,
    link: '/trainee/assessments',
    createdAt: '2026-02-24T10:00:00.000Z'
  },
  {
    _id: 'notif-4',
    userId: 'usr-trainee-1',
    title: 'New Study Material Uploaded',
    message: 'Dr. Ananya Rao uploaded "Data Cleaning & Wrangling Master Cheatsheet" to Python for Data Analysis.',
    type: 'info',
    read: true,
    link: '/trainee/courses',
    createdAt: '2026-02-23T14:00:00.000Z'
  },
  {
    _id: 'notif-5',
    userId: 'usr-trainer-1',
    title: 'New Learner Enrolled',
    message: 'Rahul Varma and 3 other trainees enrolled in your course "Machine Learning Fundamentals".',
    type: 'info',
    read: false,
    link: '/trainer/learners',
    createdAt: '2026-02-26T11:00:00.000Z'
  },
  {
    _id: 'notif-6',
    userId: 'usr-trainer-1',
    title: 'Course Feedback Received',
    message: 'Rahul Varma submitted a 5-star review for "Python for Data Analysis".',
    type: 'success',
    read: false,
    link: '/trainer/feedback',
    createdAt: '2026-02-25T16:40:00.000Z'
  },
  {
    _id: 'notif-7',
    userId: 'usr-admin-1',
    title: 'Pending User Registrations',
    message: 'Sunita Banerjee and Gaurav Kulkarni have registered and await administrative approval.',
    type: 'warning',
    read: false,
    link: '/admin/users',
    createdAt: '2026-02-28T09:15:00.000Z'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    _id: 'msg-1',
    conversationId: 'conv-trainee1-trainer1',
    senderId: 'usr-trainee-1',
    senderName: 'Rahul Varma',
    senderRole: 'trainee',
    senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    receiverId: 'usr-trainer-1',
    receiverName: 'Dr. Ananya Rao',
    receiverRole: 'trainer',
    receiverAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    content: 'Good morning Dr. Rao, I had a question regarding Module 2 Pandas grouping on multi-index columns.',
    timestamp: '2026-02-26T09:30:00.000Z',
    read: true
  },
  {
    _id: 'msg-2',
    conversationId: 'conv-trainee1-trainer1',
    senderId: 'usr-trainer-1',
    senderName: 'Dr. Ananya Rao',
    senderRole: 'trainer',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    receiverId: 'usr-trainee-1',
    receiverName: 'Rahul Varma',
    receiverRole: 'trainee',
    receiverAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    content: 'Hello Rahul! You can pass a tuple to df.xs() or specify level=[0, 1] in df.groupby(). Check out the Cheatsheet PDF uploaded in your resources tab.',
    timestamp: '2026-02-26T10:15:00.000Z',
    read: true
  },
  {
    _id: 'msg-3',
    conversationId: 'conv-trainee1-trainer1',
    senderId: 'usr-trainee-1',
    senderName: 'Rahul Varma',
    senderRole: 'trainee',
    senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    receiverId: 'usr-trainer-1',
    receiverName: 'Dr. Ananya Rao',
    receiverRole: 'trainer',
    receiverAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    content: 'That worked perfectly! Thank you so much for the quick guidance.',
    timestamp: '2026-02-26T10:45:00.000Z',
    read: true
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    _id: 'act-1',
    time: '2026-02-28T09:15:00.000Z',
    timestamp: '2026-02-28T09:15:00.000Z',
    userId: 'usr-trainee-9',
    userName: 'Gaurav Kulkarni',
    userRole: 'trainee',
    action: 'Registered Account',
    entity: 'User',
    entityName: 'Gaurav Kulkarni (Transport Corp)',
    details: 'Gaurav Kulkarni registered as Trainee (Transport Corp)',
    category: 'auth',
    status: 'info'
  },
  {
    _id: 'act-2',
    time: '2026-02-28T08:00:00.000Z',
    timestamp: '2026-02-28T08:00:00.000Z',
    userId: 'usr-admin-1',
    userName: 'Rajeshwar Sharma',
    userRole: 'admin',
    action: 'Published Announcement',
    entity: 'Announcement',
    entityName: 'National Digital Capacity Building Hackathon 2026 Live',
    details: 'Broadcasted National Digital Capacity Building Hackathon 2026 Live',
    category: 'admin',
    status: 'success'
  },
  {
    _id: 'act-3',
    time: '2026-02-27T14:20:00.000Z',
    timestamp: '2026-02-27T14:20:00.000Z',
    userId: 'usr-trainee-1',
    userName: 'Rahul Varma',
    userRole: 'trainee',
    action: 'Completed Module',
    entity: 'Course Module',
    entityName: 'Module 3: Unsupervised Learning (ML Fundamentals)',
    details: 'Finished video lecture and practice quiz for Module 3',
    category: 'course',
    status: 'success'
  },
  {
    _id: 'act-4',
    time: '2026-02-27T10:00:00.000Z',
    timestamp: '2026-02-27T10:00:00.000Z',
    userId: 'usr-admin-1',
    userName: 'Rajeshwar Sharma',
    userRole: 'admin',
    action: 'Approved User Registration',
    entity: 'User',
    entityName: 'Nisha Singhal (Approved)',
    details: 'Approved trainee account for Nisha Singhal (Tourism & Cultural Affairs)',
    category: 'admin',
    status: 'success'
  },
  {
    _id: 'act-5',
    time: '2026-02-26T16:00:00.000Z',
    timestamp: '2026-02-26T16:00:00.000Z',
    userId: 'usr-trainer-1',
    userName: 'Dr. Ananya Rao',
    userRole: 'trainer',
    action: 'Uploaded Study Material',
    entity: 'Material',
    entityName: 'Pandas & NumPy Quick Reference Guide',
    details: 'Uploaded PDF resource to central library',
    category: 'course',
    status: 'info'
  },
  {
    _id: 'act-6',
    time: '2026-02-25T16:30:00.000Z',
    timestamp: '2026-02-25T16:30:00.000Z',
    userId: 'usr-trainee-1',
    userName: 'Rahul Varma',
    userRole: 'trainee',
    action: 'Generated Digital Certificate',
    entity: 'Certificate',
    entityName: 'CC-2026-10045 (Python for Data Analysis)',
    details: 'Issued official verifiable completion credential CC-2026-10045',
    category: 'certificate',
    status: 'success'
  },
  {
    _id: 'act-7',
    time: '2026-02-25T16:25:00.000Z',
    timestamp: '2026-02-25T16:25:00.000Z',
    userId: 'usr-trainee-1',
    userName: 'Rahul Varma',
    userRole: 'trainee',
    action: 'Submitted Assessment',
    entity: 'Assessment',
    entityName: 'Score 90% (Passed Python Assessment)',
    details: 'Achieved 90% score on Python for Data Analysis Final Assessment',
    category: 'assessment',
    status: 'success'
  },
  {
    _id: 'act-8',
    time: '2026-02-24T11:00:00.000Z',
    timestamp: '2026-02-24T11:00:00.000Z',
    userId: 'usr-trainer-3',
    userName: 'Priya Sharma',
    userRole: 'trainer',
    action: 'Created Questionnaire',
    entity: 'Assessment',
    entityName: 'Enterprise Cyber Defense & Threat Mitigation Exam',
    details: 'Configured 10-question MCQ certification assessment',
    category: 'assessment',
    status: 'info'
  }
];

export const INITIAL_ACHIEVEMENTS: PlatformAchievement[] = [
  {
    _id: 'ach-1',
    title: 'National Digital Governance Milestone',
    description: 'Surpassed 50,000 certified public sector officers across digital infrastructure, procurement, and data security tracks.',
    category: 'Milestone',
    badgeIcon: 'trophy',
    criteria: 'Platform-wide completion benchmark of 50,000 accredited certifications issued across ministry departments.',
    targetAudience: 'All Platform Users',
    milestoneTarget: 50000,
    currentProgress: 52480,
    unit: 'Certificates',
    recipientCount: 52480,
    status: 'published',
    publishedDate: '2026-02-15T10:00:00.000Z',
    createdDate: '2026-02-15T09:30:00.000Z',
    featured: true
  },
  {
    _id: 'ach-2',
    title: 'Top 5% Performer - Cyber & AI Vanguard',
    description: 'Awarded to trainees scoring above 95% across both AI Governance and Enterprise Cloud Defense certification programs.',
    category: 'Top Performer',
    badgeIcon: 'shield',
    criteria: 'Minimum 95% aggregate assessment score and 100% attendance in Cyber Security and AI curricula.',
    targetAudience: 'Trainees',
    milestoneTarget: 500,
    currentProgress: 342,
    unit: 'Officers',
    recipientCount: 342,
    status: 'published',
    publishedDate: '2026-02-20T14:30:00.000Z',
    createdDate: '2026-02-20T12:00:00.000Z',
    featured: true
  },
  {
    _id: 'ach-3',
    title: 'Distinguished Faculty Excellence Badge',
    description: 'Honoring trainers maintaining an average faculty feedback score >4.85 across more than 100 trainee reviews.',
    category: 'Excellence',
    badgeIcon: 'star',
    criteria: 'Average student feedback rating of >= 4.85 stars with minimum 100 verified trainee evaluations.',
    targetAudience: 'Trainers',
    milestoneTarget: 50,
    currentProgress: 28,
    unit: 'Trainers',
    recipientCount: 28,
    status: 'published',
    publishedDate: '2026-02-10T11:15:00.000Z',
    createdDate: '2026-02-10T10:00:00.000Z',
    featured: true
  },
  {
    _id: 'ach-4',
    title: '100k Course Modules Completed',
    description: 'Platform milestone honoring the completion of over one hundred thousand training modules nationwide.',
    category: 'Milestone',
    badgeIcon: 'zap',
    criteria: 'Total aggregate module completions tracked across all enrolled institutional users.',
    targetAudience: 'All Platform Users',
    milestoneTarget: 100000,
    currentProgress: 114500,
    unit: 'Modules',
    recipientCount: 114500,
    status: 'published',
    publishedDate: '2026-02-22T09:00:00.000Z',
    createdDate: '2026-02-22T08:00:00.000Z',
    featured: false
  }
];

export const INITIAL_LEARNING_CONTENT: LearningContent[] = [
  {
    _id: 'lc-1',
    title: 'National AI & Governance Framework Guidelines 2026',
    description: 'Comprehensive regulatory blueprint detailing ethical AI implementation, data privacy, and algorithm transparency across government institutions.',
    category: 'AI & Policy',
    resourceLink: 'https://niti.gov.in/sites/default/files/2023-03/National-Strategy-for-AI-Discussion-Paper.pdf',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    featured: true,
    published: true,
    contentType: 'policy-brief',
    readTime: '12 min read',
    createdAt: '2026-02-18T10:00:00.000Z',
    authorName: 'National Capacity Building Commission'
  },
  {
    _id: 'lc-2',
    title: 'Enterprise Cyber Resilience Playbook for Public Sector',
    description: 'Standard operating protocols for zero-trust architecture, incident mitigation, vulnerability disclosures, and critical infrastructure hardening.',
    category: 'Cybersecurity',
    resourceLink: 'https://www.cert-in.org.in/',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    featured: true,
    published: true,
    contentType: 'handbook',
    readTime: '20 min read',
    createdAt: '2026-02-20T14:30:00.000Z',
    authorName: 'Dr. Vikramaditya Sen'
  },
  {
    _id: 'lc-3',
    title: 'Modern Public Procurement & GeM Masterclass Primer',
    description: 'Practical guide to transparent digital tendering, vendor evaluation, contract compliance, and reverse auctions on the Government e-Marketplace.',
    category: 'Public Administration',
    resourceLink: 'https://gem.gov.in/',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
    featured: true,
    published: true,
    contentType: 'article',
    readTime: '8 min read',
    createdAt: '2026-02-24T09:15:00.000Z',
    authorName: 'Meenakshi Sundaram'
  }
];


