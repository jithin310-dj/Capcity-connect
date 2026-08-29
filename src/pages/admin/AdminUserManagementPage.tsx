import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';
import { User, UserRole } from '../../types';
import { Users, Search, Filter, Shield, UserCheck, Trash2, Edit3, Sparkles } from 'lucide-react';

export const AdminUserManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const { confirmAction } = useModal();

  const [users, setUsers] = useState<User[]>(storageService.getUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchQuery.trim() ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.organization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (targetUser: User) => {
    const nextStatus = targetUser.status === 'active' ? 'suspended' : 'active';
    userService.updateUserStatus(targetUser._id, nextStatus);
    setUsers(storageService.getUsers());
    showToast(`User status changed to ${nextStatus.toUpperCase()}`, 'info');
  };

  const handleRoleChange = (targetUser: User, newRole: UserRole) => {
    userService.updateUserProfile(targetUser._id, { role: newRole });
    setUsers(storageService.getUsers());
    showToast(`Role for ${targetUser.name} changed to ${newRole.toUpperCase()}`, 'success');
  };

  const handleDeleteUser = (targetUser: User) => {
    confirmAction({
      title: 'Delete User Account?',
      message: `Are you sure you want to remove ${targetUser.name} (${targetUser.email})?`,
      isDestructive: true,
      confirmText: 'Delete Account',
      onConfirm: () => {
        userService.deleteUser(targetUser._id, 'u-admin-1', 'Admin');
        setUsers(storageService.getUsers());
        showToast('User account deleted', 'info');
      }
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-indigo-600" />
            <span>National Identity & Role Governance</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Oversee all registered trainees, domain trainers, and administrative delegates across participating bodies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Total Accounts:</span>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold">
            {users.length} Users
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
            placeholder="Search by name, email, or department..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Roles</option>
            <option value="trainee">Trainee Officers</option>
            <option value="trainer">Domain Trainers</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Account States</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">User / Officer</th>
                <th className="py-3.5 px-6">Organization & Designation</th>
                <th className="py-3.5 px-6">Role Assignment</th>
                <th className="py-3.5 px-6">Account Status</th>
                <th className="py-3.5 px-6">Registered Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 shrink-0" />
                    <div>
                      <span>{u.name}</span>
                      <span className="block text-[11px] text-slate-400 font-normal">{u.email}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-slate-800">
                    <div className="font-semibold text-xs text-slate-900">{u.organization}</div>
                    <div className="text-[11px] text-slate-500">{u.designation || 'Specialist Officer'}</div>
                  </td>

                  <td className="py-4 px-6">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                      className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden"
                    >
                      <option value="trainee">Trainee</option>
                      <option value="trainer">Trainer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                        u.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : u.status === 'pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                        u.status === 'active'
                          ? 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {u.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>

                    <button
                      onClick={() => handleDeleteUser(u)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg inline-flex items-center"
                      title="Delete User"
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
