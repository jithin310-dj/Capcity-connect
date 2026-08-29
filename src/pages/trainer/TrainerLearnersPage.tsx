import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Users, Search, CheckCircle2, Clock, Award, BookOpen, Mail } from 'lucide-react';

interface TrainerLearnersPageProps {
  onNavigate?: (view: string, payload?: any) => void;
}

export const TrainerLearnersPage: React.FC<TrainerLearnersPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const trainerId = user?._id || 'u-trainer-1';

  const allUsers = storageService.getUsers();
  const allCourses = storageService.getCourses();
  const myCourses = allCourses.filter((c) => c.trainerId === trainerId);
  const myCourseIds = new Set(myCourses.map((c) => c._id));

  const allEnrollments = storageService.getEnrollments().filter((e) => myCourseIds.has(e.courseId));
  const allResults = storageService.getResults();
  const allCertificates = storageService.getCertificates();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('All');

  const filteredEnrollments = allEnrollments.filter((enr) => {
    const trainee = allUsers.find((u) => u._id === enr.traineeId);
    const course = allCourses.find((c) => c._id === enr.courseId);
    const traineeName = (enr.traineeName || trainee?.name || 'Trainee').toLowerCase();
    const courseTitle = (enr.courseTitle || course?.title || 'Course').toLowerCase();
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch = !q || traineeName.includes(q) || courseTitle.includes(q);
    const matchesCourse = selectedCourseId === 'All' || enr.courseId === selectedCourseId;

    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-blue-600" />
            <span>Enrolled Learners & Performance Ledger</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track individual participant progression, module milestones, and certified assessment scores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Total Enrolled:</span>
          <span className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold">
            {allEnrollments.length} Trainees
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search enrolled trainee name or course..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Authored Courses</option>
            {myCourses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Learners Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Learner Name</th>
                <th className="py-3.5 px-6">Course Program</th>
                <th className="py-3.5 px-6">Enrolled Date</th>
                <th className="py-3.5 px-6">Progress</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">MCQ Score</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No enrolled learners found.
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((enr) => {
                  const trainee = allUsers.find((u) => u._id === enr.traineeId);
                  const course = allCourses.find((c) => c._id === enr.courseId);
                  const tName = enr.traineeName || trainee?.name || 'Trainee Officer';
                  const cTitle = enr.courseTitle || course?.title || 'Capacity Program';

                  const cert = allCertificates.find(
                    (c) => c.traineeId === enr.traineeId && c.courseId === enr.courseId
                  );
                  const result = allResults.find(
                    (r) => r.traineeId === enr.traineeId
                  );

                  return (
                    <tr key={enr._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {tName.charAt(0)}
                        </div>
                        <div>
                          <span>{tName}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">ID: {enr.traineeId}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-800 font-semibold max-w-xs truncate">
                        {cTitle}
                      </td>

                      <td className="py-4 px-6 text-slate-500">
                        {new Date(enr.enrolledAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6">
                        <div className="w-24">
                          <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                            <span>{enr.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${enr.progress}%` }} />
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            enr.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {enr.status}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        {cert ? (
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {cert.score}% Passed
                          </span>
                        ) : result ? (
                          <span className="text-xs font-bold text-slate-600">
                            {result.percentage}% ({result.passed ? 'Passed' : 'Failed'})
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Not Attempted</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {onNavigate && (
                          <button
                            onClick={() => onNavigate('trainee-messages', { targetUserId: enr.traineeId })}
                            className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg transition-colors inline-flex items-center gap-1"
                            title="Message Trainee"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
