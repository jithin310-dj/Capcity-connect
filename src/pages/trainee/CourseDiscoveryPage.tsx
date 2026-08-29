import React, { useState, useMemo } from 'react';
import { storageService } from '../../services/storageService';
import { enrollmentService } from '../../services/enrollmentService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CourseCard } from '../../components/common/CourseCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Course } from '../../types';
import { Search, Filter, SlidersHorizontal, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface CourseDiscoveryPageProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const CourseDiscoveryPage: React.FC<CourseDiscoveryPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const userId = user?._id || 'u-trainee-1';

  const [courses, setCourses] = useState<Course[]>(storageService.getCourses());
  const [enrollments, setEnrollments] = useState(storageService.getEnrollments().filter((e) => e.traineeId === userId));

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');

  const categories = ['All', 'Data Science & AI', 'Leadership & Management', 'Cybersecurity', 'Cloud Computing', 'Public Administration'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      // Search
      const matchesSearch =
        !searchQuery.trim() ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.trainerName.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;

      // Difficulty
      const matchesDifficulty = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;

      // Rating
      const matchesRating =
        selectedRating === 'All' ||
        (selectedRating === '4.5' && c.rating >= 4.5) ||
        (selectedRating === '4.0' && c.rating >= 4.0);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesRating;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return b.enrolledUsers - a.enrolledUsers;
    });
  }, [courses, searchQuery, selectedCategory, selectedDifficulty, selectedRating, sortBy]);

  const handleEnroll = (courseId: string) => {
    if (!user) {
      showToast('Please sign in to enroll in courses', 'warning');
      return;
    }

    try {
      enrollmentService.enroll(userId, user.name, courseId);
      showToast('Enrolled in course successfully! Modules unlocked.', 'success');
      setEnrollments(storageService.getEnrollments().filter((e) => e.traineeId === userId));
      setCourses(storageService.getCourses());
      onNavigate('course-learning', { courseId });
    } catch (err: any) {
      showToast(err?.message || 'Failed to enroll', 'error');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-blue-600" />
            <span>Capacity Course Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover and enroll in institutional courses aligned with digital competency frameworks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Showing:</span>
          <span className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold">
            {filteredCourses.length} Courses
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        
        {/* Search row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, domain skill (e.g. Python, Leadership), or trainer..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Recently Added</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  Difficulty: {diff}
                </option>
              ))}
            </select>

            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Ratings</option>
              <option value="4.5">★ 4.5 & Above</option>
              <option value="4.0">★ 4.0 & Above</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 shrink-0 mr-1">Categories:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          title="No Courses Found"
          description="We couldn't find any courses matching your specific search query or active filter combination."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setSelectedDifficulty('All');
            setSelectedRating('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => {
            const enrollment = enrollments.find((e) => e.courseId === course._id);
            return (
              <CourseCard
                key={course._id}
                course={course}
                enrollment={enrollment}
                onSelect={(id) => {
                  if (enrollment) {
                    onNavigate('course-learning', { courseId: id });
                  } else {
                    onNavigate('course-detail', { courseId: id });
                  }
                }}
                onEnroll={handleEnroll}
              />
            );
          })}
        </div>
      )}

    </div>
  );
};
