import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { ActivityLog } from '../../types';
import { Activity, Search, Filter, Clock, ShieldCheck } from 'lucide-react';

export const AdminActivityLogsPage: React.FC = () => {
  const [logs] = useState<ActivityLog[]>(storageService.getActivityLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredLogs = logs.filter((l) => {
    const action = l.action || '';
    const details = l.details || l.entityName || '';
    const userName = l.userName || '';
    const category = (l.category || l.entity || 'admin').toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || category === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const formatLogDate = (log: ActivityLog) => {
    const raw = log.time || log.timestamp;
    if (!raw) return new Date().toLocaleString();
    const d = new Date(raw);
    return isNaN(d.getTime()) ? new Date().toLocaleString() : d.toLocaleString();
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Administrative Audit & Activity Ledger</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Immutable system-wide transaction and verification log maintaining institutional governance trails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Log Entries:</span>
          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 rounded-xl text-xs font-bold font-mono">
            {logs.length} Events
          </span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs flex flex-col md:flex-row gap-3 transition-colors">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by actor, action description, or details..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0F172A] focus:outline-hidden focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="min-h-[42px] px-3 py-2 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Event Categories</option>
            <option value="auth">Auth & Session</option>
            <option value="course">Course Curriculum</option>
            <option value="enrollment">Enrollments</option>
            <option value="assessment">Assessments</option>
            <option value="certificate">Certificates</option>
            <option value="admin">Admin Actions</option>
            <option value="feedback">User Reviews</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Action Executed</th>
                <th className="py-3.5 px-6">Actor / User</th>
                <th className="py-3.5 px-6">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatLogDate(log)}
                  </td>

                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {log.category || log.entity || 'system'}
                    </span>
                  </td>

                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                    {log.action}
                  </td>

                  <td className="py-4 px-6 text-slate-800 dark:text-slate-200">
                    <span className="font-semibold">{log.userName}</span>
                  </td>

                  <td className="py-4 px-6 text-slate-600 dark:text-slate-400 max-w-sm truncate">
                    {log.details || log.entityName || '—'}
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

