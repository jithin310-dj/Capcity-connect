import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { Course, User, Material, Announcement } from '../../types';
import { Search, BookOpen, Users, FolderGit2, Megaphone, ArrowRight, X } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onNavigate: (view: string, payload?: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen = true, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [trainers, setTrainers] = useState<User[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Keyboard shortcut listener for ESC key to dismiss modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    if (!query.trim()) {
      setCourses([]);
      setTrainers([]);
      setMaterials([]);
      setAnnouncements([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const allCourses = storageService.getCourses();
    const allTrainers = storageService.getUsers().filter((u) => u.role === 'trainer');
    const allMaterials = storageService.getMaterials();
    const allAnnouncements = storageService.getAnnouncements();

    setCourses(
      allCourses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
      ).slice(0, 4)
    );

    setTrainers(
      allTrainers.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.organization.toLowerCase().includes(q) ||
          t.skills.some((s) => s.toLowerCase().includes(q))
      ).slice(0, 3)
    );

    setMaterials(
      allMaterials.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.skill.toLowerCase().includes(q)
      ).slice(0, 3)
    );

    setAnnouncements(
      allAnnouncements.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      ).slice(0, 2)
    );
  }, [query]);

  const hasResults = courses.length > 0 || trainers.length > 0 || materials.length > 0 || announcements.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 px-4 bg-slate-950/80 backdrop-blur-xs font-sans">
      <div className="bg-[#151B28] rounded-lg max-w-2xl w-full shadow-2xl border border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-300">
        
        {/* Search Input Bar */}
        <div className="p-3 border-b border-slate-800 flex items-center gap-2.5 bg-[#0F172A]">
          <Search className="w-4 h-4 text-blue-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type search terms (e.g. Python, ML, Dr. Ananya)..."
            className="w-full bg-transparent border-none text-white placeholder-slate-500 text-xs focus:outline-hidden font-mono"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-800 text-slate-400 rounded border border-slate-700 hover:bg-slate-700 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {!query.trim() && (
            <div className="text-center py-6 text-slate-500 text-xs font-mono">
              <p>Search index for <span className="text-blue-400 cursor-pointer underline" onClick={() => setQuery('Python')}>Python</span>, <span className="text-blue-400 cursor-pointer underline" onClick={() => setQuery('Machine Learning')}>Machine Learning</span>, <span className="text-blue-400 cursor-pointer underline" onClick={() => setQuery('Cybersecurity')}>Cybersecurity</span>, or <span className="text-blue-400 cursor-pointer underline" onClick={() => setQuery('Dr. Ananya Rao')}>Dr. Ananya Rao</span>.</p>
            </div>
          )}

          {query.trim() && !hasResults && (
            <div className="text-center py-8 text-slate-400 text-xs font-mono">
              <p>NO_RECORDS_FOUND for: "<span className="text-white font-semibold">{query}</span>"</p>
              <p className="text-[10px] text-slate-500 mt-1">Try broader terms or alternative competencies.</p>
            </div>
          )}

          {/* Courses */}
          {courses.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5 border-l-2 border-blue-500 pl-2">
                <BookOpen className="w-3 h-3 text-blue-400" />
                <span>COURSES ({courses.length})</span>
              </div>
              <div className="space-y-1">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    onClick={() => onNavigate('course-detail', { courseId: course._id })}
                    className="flex items-center justify-between p-2 rounded bg-[#0B0F19] hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition-all group font-mono"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={course.thumbnail} alt={course.title} className="w-8 h-8 rounded object-cover" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate group-hover:text-blue-400">{course.title}</p>
                        <p className="text-[10px] text-slate-500 truncate">{course.trainerName} • {course.difficulty} • {course.rating}★</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trainers */}
          {trainers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5 border-l-2 border-emerald-500 pl-2">
                <Users className="w-3 h-3 text-emerald-400" />
                <span>FACULTY & TRAINERS ({trainers.length})</span>
              </div>
              <div className="space-y-1">
                {trainers.map((trainer) => (
                  <div
                    key={trainer._id}
                    onClick={() => onNavigate('trainer-matching', { query: trainer.name })}
                    className="flex items-center justify-between p-2 rounded bg-[#0B0F19] hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition-all group font-mono"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={trainer.avatar} alt={trainer.name} className="w-7 h-7 rounded object-cover ring-1 ring-emerald-500/30" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate group-hover:text-emerald-400">{trainer.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{trainer.designation} • {trainer.organization}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Materials */}
          {materials.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5 border-l-2 border-amber-500 pl-2">
                <FolderGit2 className="w-3 h-3 text-amber-400" />
                <span>RESOURCES ({materials.length})</span>
              </div>
              <div className="space-y-1">
                {materials.map((mat) => (
                  <div
                    key={mat._id}
                    onClick={() => onNavigate('trainer-library', { materialId: mat._id })}
                    className="flex items-center justify-between p-2 rounded bg-[#0B0F19] hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition-all group font-mono"
                  >
                    <div>
                      <p className="text-xs font-bold text-white truncate group-hover:text-amber-400">{mat.title}</p>
                      <p className="text-[10px] text-slate-500 truncate">{mat.courseTitle} • {mat.fileType.toUpperCase()} ({mat.fileSize})</p>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                      {mat.fileType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Announcements */}
          {announcements.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5 border-l-2 border-purple-500 pl-2">
                <Megaphone className="w-3 h-3 text-purple-400" />
                <span>BULLETINS ({announcements.length})</span>
              </div>
              <div className="space-y-1">
                {announcements.map((ann) => (
                  <div
                    key={ann._id}
                    onClick={() => onNavigate('landing')}
                    className="p-2 rounded bg-[#0B0F19] hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition-all font-mono"
                  >
                    <p className="text-xs font-bold text-white">{ann.title}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{ann.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 bg-[#0F172A] border-t border-slate-800 text-center text-slate-500 text-[10px] font-mono">
          PRESS <kbd className="px-1 py-0.2 bg-slate-800 border border-slate-700 text-slate-300 rounded text-[9px]">ESC</kbd> TO DISMISS
        </div>
      </div>
    </div>
  );
};
