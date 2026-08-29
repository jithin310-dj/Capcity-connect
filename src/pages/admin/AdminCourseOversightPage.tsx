import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { courseService } from '../../services/courseService';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';
import { Course } from '../../types';
import { 
  BookOpen, Search, Filter, CheckCircle2, XCircle, 
  Trash2, Star, Eye, Sparkles 
} from 'lucide-react';

interface AdminCourseOversightPageProps {
  onNavigate?: (view: string, payload?: any) => void;
}

export const AdminCourseOversightPage: React.FC<AdminCourseOversightPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const { confirmAction } = useModal();

  const [courses, setCourses] = useState<Course[]>(storageService.getCourses());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      !searchQuery.trim() ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.trainerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCat = categoryFilter === 'All' || c.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCat;
  });

  const handleToggleStatus = (course: Course) => {
    const nextStatus = course.status === 'published' ? 'draft' : 'published';
    courseService.updateCourse(course._id, { status: nextStatus });
    setCourses(storageService.getCourses());
    showToast(`Course status updated to ${nextStatus.toUpperCase()}`, 'success');
  };

  const handleDeleteCourse = (course: Course) => {
    confirmAction({
      title: 'Delete Curriculum Program?',
      message: `Are you sure you want to delete "${course.title}"? All associated modules and enrollments will be impacted.`,
      isDestructive: true,
      confirmText: 'Delete Course',
      onConfirm: () => {
        courseService.deleteCourse('u-admin-1', 'Director General (Admin)', 'admin', course._id);
        setCourses(storageService.getCourses());
        showToast('Course program removed by administrator', 'info');
      }
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            <span>Curriculum Oversight & Quality Control</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review submitted syllabus modules, certify pedagogical standards, and toggle publication status across the portal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Total Curricula:</span>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold">
            {courses.length} Courses
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by title or trainer name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft / Under Review</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Domains</option>
            <option value="Data Science & AI">Data Science & AI</option>
            <option value="Leadership & Management">Leadership</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Cloud Computing">Cloud Computing</option>
          </select>
        </div>
      </div>

      {/* Courses List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Curriculum Title</th>
                <th className="py-3.5 px-6">Domain / Category</th>
                <th className="py-3.5 px-6">Lead Faculty</th>
                <th className="py-3.5 px-6">Modules</th>
                <th className="py-3.5 px-6">Enrolled</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCourses.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                    <img src={c.thumbnail} alt={c.title} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0" />
                    <span className="max-w-xs truncate">{c.title}</span>
                  </td>

                  <td className="py-4 px-6 text-slate-400 font-semibold">{c.category}</td>

                  <td className="py-4 px-6 text-slate-300 font-medium">{c.trainerName}</td>

                  <td className="py-4 px-6 text-slate-400">{c.modules?.length || 0} Modules</td>

                  <td className="py-4 px-6 font-bold text-slate-200">{c.enrolledUsers}</td>

                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        c.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('course-learning', { courseId: c._id })}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg inline-flex items-center"
                        title="Preview Player"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleToggleStatus(c)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                        c.status === 'published'
                          ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {c.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      onClick={() => handleDeleteCourse(c)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg inline-flex items-center"
                      title="Delete Course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
