import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import { User } from '../../types';
import { 
  Users, Search, Filter, CheckCircle2, XCircle, 
  ShieldCheck, Star, Sparkles, Building, Briefcase, GraduationCap 
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
      t.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (trainerId: string, newStatus: 'active' | 'suspended' | 'pending') => {
    userService.updateUserStatus(trainerId, newStatus);
    setUsers(storageService.getUsers().filter((u) => u.role === 'trainer'));
    showToast(`Faculty status updated to ${newStatus.toUpperCase()}`, 'success');
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Faculty Accreditation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Institutional Faculty & Trainer Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Vet incoming trainer applications, inspect qualifications and verified skills, and regulate active faculty rosters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Registered Faculty:</span>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
            {users.length} Trainers
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
            placeholder="Search trainers by name, organization, or skill set..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
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
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
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
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : trainer.status === 'pending'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {trainer.status}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base">{trainer.name}</h3>
              <p className="text-xs text-slate-600 font-medium">{trainer.designation} • {trainer.organization}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{trainer.department}</p>

              {trainer.bio && (
                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {trainer.bio}
                </p>
              )}

              <div className="space-y-1.5 text-xs text-slate-600 my-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Experience:</span>
                  <strong>{trainer.experienceYears} Years</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Qualification:</span>
                  <strong>{trainer.qualification}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rating:</span>
                  <strong className="text-amber-600 font-bold">{trainer.rating} ★</strong>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {trainer.skills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              {trainer.status === 'pending' ? (
                <>
                  <button
                    onClick={() => handleUpdateStatus(trainer._id, 'active')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(trainer._id, 'suspended')}
                    className="px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold rounded-xl"
                  >
                    Reject
                  </button>
                </>
              ) : trainer.status === 'active' ? (
                <button
                  onClick={() => handleUpdateStatus(trainer._id, 'suspended')}
                  className="w-full py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Suspend Accreditation
                </button>
              ) : (
                <button
                  onClick={() => handleUpdateStatus(trainer._id, 'active')}
                  className="w-full py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-xl transition-colors"
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
