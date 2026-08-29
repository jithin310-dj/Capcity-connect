import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import { User } from '../../types';
import { 
  Users, Search, Filter, CheckCircle2, XCircle, 
  ShieldCheck, Star, Building, Briefcase, GraduationCap 
} from 'lucide-react';

interface AdminTrainerManagementPageProps {
  onNavigate?: (view: string, payload?: any) => void;
}

export const AdminTrainerManagementPage: React.FC<AdminTrainerManagementPageProps> = () => {
  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>(storageService.getUsers().filter((u) => u.role === 'trainer'));
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTrainers = users.filter((t) => {
    const matchesSearch =
      !searchQuery.trim() ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.organization && t.organization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.skills && t.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (trainerId: string, newStatus: 'active' | 'suspended' | 'pending') => {
    userService.updateUserStatus(trainerId, newStatus);
    setUsers(storageService.getUsers().filter((u) => u.role === 'trainer'));
    showToast(`Faculty status updated to ${newStatus.toUpperCase()}`, 'success');
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Faculty Accreditation
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Institutional Faculty & Trainer Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Vet incoming trainer applications, inspect qualifications and verified skills, and regulate active faculty rosters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Registered Faculty:</span>
          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-xs font-bold font-mono">
            {users.length} Trainers
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs flex flex-col md:flex-row gap-3 transition-colors">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trainers by name, organization, or skill set..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0F172A] focus:outline-hidden focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-h-[42px] px-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Verification Statuses</option>
            <option value="active">Active & Verified</option>
            <option value="pending">Pending Approval</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Trainers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainers.map((trainer) => (
          <div
            key={trainer._id}
            className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <img
                  src={trainer.avatar}
                  alt={trainer.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-xs"
                />

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                    trainer.status === 'active'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50'
                      : trainer.status === 'pending'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/50'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/50'
                  }`}
                >
                  {trainer.status}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{trainer.name}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{trainer.designation} • {trainer.organization}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{trainer.department}</p>

              {trainer.bio && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {trainer.bio}
                </p>
              )}

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 my-4 bg-slate-50 dark:bg-[#0B0F19] p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Experience:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{trainer.experienceYears || 5} Years</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Qualification:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{trainer.qualification || 'M.Tech / Specialist'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Rating:</span>
                  <strong className="text-amber-600 dark:text-amber-400 font-bold">{trainer.rating || 4.9} ★</strong>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {(trainer.skills || []).map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-100 dark:border-emerald-800/50">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              {trainer.status === 'pending' ? (
                <>
                  <button
                    onClick={() => handleUpdateStatus(trainer._id, 'active')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(trainer._id, 'suspended')}
                    className="px-3 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                </>
              ) : trainer.status === 'active' ? (
                <button
                  onClick={() => handleUpdateStatus(trainer._id, 'suspended')}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-700 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Suspend Accreditation
                </button>
              ) : (
                <button
                  onClick={() => handleUpdateStatus(trainer._id, 'active')}
                  className="w-full py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Reactivate Faculty
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

