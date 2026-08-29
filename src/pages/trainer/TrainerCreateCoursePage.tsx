import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { courseService } from '../../services/courseService';
import { storageService } from '../../services/storageService';
import { Course, CourseModule } from '../../types';
import { 
  BookOpen, Plus, Trash2, Video, Presentation, 
  FileText, HelpCircle, Save, ArrowLeft, Sparkles, CheckCircle2 
} from 'lucide-react';

interface TrainerCreateCoursePageProps {
  editCourseId?: string;
  onNavigate: (view: string, payload?: any) => void;
}

export const TrainerCreateCoursePage: React.FC<TrainerCreateCoursePageProps> = ({ editCourseId, onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Data Science & AI');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [duration, setDuration] = useState('8 Hours');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80');
  const [skillsInput, setSkillsInput] = useState('Python, Data Analysis, Machine Learning');
  const [targetAudience, setTargetAudience] = useState('Public sector officers, system analysts, data engineers');
  const [prerequisites, setPrerequisites] = useState('Basic analytical thinking and introductory programming concepts');
  const [status, setStatus] = useState<'draft' | 'published'>('published');

  const [modules, setModules] = useState<CourseModule[]>([
    {
      _id: 'm-temp-1',
      title: 'Module 1: Foundations & Architecture Overview',
      type: 'video',
      duration: '45 mins',
      content: 'Detailed video lecture on fundamental architecture patterns, data flow mechanisms, and scalable framework standards.'
    },
    {
      _id: 'm-temp-2',
      title: 'Module 2: Practical Implementation Guide & Walkthrough',
      type: 'presentation',
      duration: '60 mins',
      content: 'Step-by-step presentation slides and reference materials for hands-on execution and team deployment.'
    }
  ]);

  useEffect(() => {
    if (editCourseId) {
      const existing = storageService.getCourses().find((c) => c._id === editCourseId);
      if (existing) {
        setTitle(existing.title);
        setDescription(existing.description);
        setCategory(existing.category);
        setDifficulty(existing.difficulty);
        setDuration(existing.duration);
        setThumbnail(existing.thumbnail);
        setSkillsInput(existing.skills.join(', '));
        setTargetAudience(existing.targetAudience);
        setPrerequisites(existing.prerequisites);
        setStatus(existing.status);
        setModules(existing.modules || []);
      }
    }
  }, [editCourseId]);

  const handleAddModule = () => {
    const newMod: CourseModule = {
      id: `m-${Date.now()}`,
      title: `Module ${modules.length + 1}: Key Topic & Practice`,
      description: 'Comprehensive topic coverage and practical instruction notes.',
      durationMinutes: 45,
      type: 'video',
      order: modules.length + 1,
      textContent: 'Comprehensive topic coverage and practical instruction notes.'
    };
    setModules([...modules, newMod]);
  };

  const handleRemoveModule = (idx: number) => {
    setModules(modules.filter((_, i) => i !== idx));
  };

  const handleUpdateModule = (idx: number, updates: Partial<CourseModule>) => {
    const next = [...modules];
    next[idx] = { ...next[idx], ...updates };
    setModules(next);
  };

  const handleSubmit = (publishStatus: 'draft' | 'published') => {
    if (!title.trim() || !description.trim()) {
      showToast('Please fill in the course title and description', 'warning');
      return;
    }

    if (!user) return;

    const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);

    if (editCourseId) {
      courseService.updateCourse(editCourseId, {
        title,
        description,
        category,
        difficulty,
        duration,
        thumbnail,
        skills,
        targetAudience,
        prerequisites,
        status: publishStatus,
        modules
      });
      showToast('Course updated successfully!', 'success');
    } else {
      courseService.createCourse({
        title,
        description,
        category,
        difficulty,
        duration,
        thumbnail,
        trainerId: user._id,
        trainerName: user.name,
        trainerAvatar: user.avatar,
        skills,
        targetAudience,
        prerequisites,
        status: publishStatus,
        modules
      });
      showToast(`Course created and marked as ${publishStatus.toUpperCase()}!`, 'success');
    }

    onNavigate('trainer-dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('trainer-dashboard')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {editCourseId ? 'Edit Course Program' : 'Create New Course Program'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Design institutional training modules and define targeted competencies.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('published')}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Publish Curriculum</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
        
        {/* Basic Meta */}
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-4">Course Identity & Scope</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Course Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Advanced Machine Learning for Public Governance"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Overview & Objectives *</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what officers will achieve and apply upon completion..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option>Data Science & AI</option>
                  <option>Leadership & Management</option>
                  <option>Cybersecurity</option>
                  <option>Cloud Computing</option>
                  <option>Public Administration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Total Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 12 Hours"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Cover Thumbnail Image URL</label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Skills Taught (Comma Separated)</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="Python, Machine Learning, Analytics"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-500 font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Curriculum Modules & Content</h3>
              <p className="text-xs text-slate-500">Add lectures, presentation slide decks, and reading guides.</p>
            </div>

            <button
              type="button"
              onClick={handleAddModule}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Module</span>
            </button>
          </div>

          <div className="space-y-4">
            {modules.map((mod, idx) => (
              <div
                key={mod._id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-slate-400 uppercase">Module {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveModule(idx)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Remove Module"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Module Title</label>
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => handleUpdateModule(idx, { title: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Media Type</label>
                    <select
                      value={mod.type}
                      onChange={(e) => handleUpdateModule(idx, { type: e.target.value as any })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
                    >
                      <option value="video">Video Lecture</option>
                      <option value="presentation">Slide Deck</option>
                      <option value="document">Curriculum Document</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Content Notes & Syllabus Details</label>
                  <textarea
                    rows={2}
                    value={mod.content}
                    onChange={(e) => handleUpdateModule(idx, { content: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
