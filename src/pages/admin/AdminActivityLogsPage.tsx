import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { ActivityLog } from '../../types';
import { Activity, Search, Filter, Clock, ShieldCheck } from 'lucide-react';

export const AdminActivityLogsPage: React.FC = () => {
  const [logs] = useState<ActivityLog[]>(storageService.getActivityLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      !searchQuery.trim() ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.userName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || l.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-indigo-600" />
            <span>Administrative Audit & Activity Ledger</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Immutable system-wide transaction and verification log maintaining institutional governance trails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Log Entries:</span>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold font-mono">
            {logs.length} Events
          </span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by actor, action description, or details..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
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
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Action Executed</th>
                <th className="py-3.5 px-6">Actor / User</th>
                <th className="py-3.5 px-6">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase font-mono bg-slate-100 text-slate-700">
                      {log.category}
                    </span>
                  </td>

                  <td className="py-4 px-6 font-bold text-slate-900">
                    {log.action}
                  </td>

                  <td className="py-4 px-6 text-slate-800">
                    <span className="font-semibold">{log.userName}</span>
                  </td>

                  <td className="py-4 px-6 text-slate-600 max-w-sm truncate">
                    {log.details}
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
