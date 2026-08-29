import React from 'react';
import { Course, Enrollment } from '../../types';
import { Clock, Users, Star, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  enrollment?: Enrollment;
  onSelect: (courseId: string) => void;
  onEnroll?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, enrollment, onSelect, onEnroll }) => {
  const isEnrolled = !!enrollment;
  const isCompleted = enrollment?.status === 'completed';

  return (
    <div className="bg-white dark:bg-[#151B28] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all flex flex-col group text-slate-700 dark:text-slate-300 shadow-xs">
      {/* Thumbnail Header */}
      <div className="relative h-38 w-full overflow-hidden bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-95 group-hover:opacity-100"
        />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap z-10">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-900/90 text-white border border-slate-700/80 shadow-xs backdrop-blur-xs">
            {course.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-600 text-white shadow-xs">
            {course.difficulty}
          </span>
        </div>

        {isCompleted && (
          <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 shadow-sm z-10">
            <CheckCircle className="w-3 h-3 text-white" />
            COMPLETED
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Trainer Info */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={course.trainerAvatar}
              alt={course.trainerName}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
            />
            <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-medium truncate">{course.trainerName}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(course._id)}
            className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors line-clamp-2 mb-1.5"
          >
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {course.description}
          </p>

          {/* Skills Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {course.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-medium"
              >
                {skill}
              </span>
            ))}
            {course.skills.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-semibold">
                +{course.skills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Footer info & Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
          {/* Progress bar if enrolled */}
          {isEnrolled && (
            <div>
              <div className="flex justify-between text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-400 mb-1">
                <span>PROGRESS</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{enrollment.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isCompleted ? 'bg-emerald-500' : 'bg-blue-600 dark:bg-blue-500'
                  }`}
                  style={{ width: `${enrollment.progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>{course.duration}</span>
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <strong className="text-slate-900 dark:text-white font-bold">{course.rating}</strong>
              </span>
            </div>

            <span className="flex items-center gap-1 font-mono text-slate-600 dark:text-slate-400">
              <Users className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>{course.enrolledUsers} learners</span>
            </span>
          </div>

          <div className="pt-1">
            {isEnrolled ? (
              <button
                onClick={() => onSelect(course._id)}
                className="w-full min-h-[44px] sm:min-h-[40px] py-2.5 px-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{isCompleted ? 'REVIEW MODULES' : 'CONTINUE LEARNING'}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            ) : onEnroll ? (
              <button
                onClick={() => onEnroll(course._id)}
                className="w-full min-h-[44px] sm:min-h-[40px] py-2.5 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span>ENROLL NOW</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            ) : (
              <button
                onClick={() => onSelect(course._id)}
                className="w-full min-h-[44px] sm:min-h-[40px] py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>VIEW DETAILS</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
