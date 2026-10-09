import React, { useState } from 'react';
import { User, Property, RentalAgreement } from '../types';
import { Users, Eye, ShieldCheck, Mail, Phone, Calendar, Building, X, Lock, Search, Filter } from 'lucide-react';

interface AdminUsersViewProps {
  users: User[];
  properties: Property[];
  agreements: RentalAgreement[];
  onReportSpamUser?: (user: User) => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({
  users,
  properties,
  agreements,
  onReportSpamUser
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'TENANT' | 'OWNER' | 'ADMIN'>('ALL');

  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Registered User Directory
            </h1>
            <span className="text-[11px] font-mono uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold">
              Read-Only View Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Auditing console for Compliance Officers. Admins can view tenant and property owner profiles strictly in read-only mode to prevent unauthorized modifications.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded bg-slate-100 text-slate-700 font-semibold">
            {users.length} Total Registered Users
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or user ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
            <Filter size={13} />
            <span>Role:</span>
          </span>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="TENANT">Tenants ({users.filter(u => u.role === 'TENANT').length})</option>
            <option value="OWNER">Property Owners ({users.filter(u => u.role === 'OWNER').length})</option>
            <option value="ADMIN">Admins ({users.filter(u => u.role === 'ADMIN').length})</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Portfolio / Leases</th>
                <th className="py-3 px-4">Member Since</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
                    No users matching "{searchQuery}" in {roleFilter} role.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => {
                  const userProperties = properties.filter(p => p.ownerId === u.id);
                  const userAgreements = agreements.filter(a => a.tenantId === u.id || a.ownerId === u.id);

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{u.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">ID: {u.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'OWNER'
                              ? 'bg-indigo-50 text-indigo-800'
                              : u.role === 'TENANT'
                              ? 'bg-teal-50 text-teal-800'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <p className="text-slate-900 truncate">{u.email}</p>
                        <p className="text-slate-500 font-mono text-[11px]">{u.phone}</p>
                      </td>

                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <ShieldCheck size={13} />
                          <span>Verified Citizen ID</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px]">
                        {u.role === 'OWNER' ? (
                          <span>{userProperties.length} Properties Listed</span>
                        ) : (
                          <span>{userAgreements.length} Active Leases</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-500">{u.joinedDate}</td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye size={12} />
                          <span>View Profile</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Read-Only Profile Inspection Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  User Profile Inspection (View Mode Only)
                </h3>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-lg font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{selectedUser.name}</h4>
                  <p className="text-slate-500">{selectedUser.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    Role: {selectedUser.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Mobile Number</span>
                  <span className="font-mono text-slate-900 font-medium">{selectedUser.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Joined Date</span>
                  <span className="text-slate-900 font-medium">{selectedUser.joinedDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">KYC Status</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck size={12} />
                    <span>Verified Citizen ID</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Security Setup</span>
                  <span className="text-teal-700 font-semibold flex items-center gap-1 mt-0.5">
                    <Lock size={12} />
                    <span>Security Question Configured</span>
                  </span>
                </div>
              </div>

              {selectedUser.role === 'OWNER' && (
                <div>
                  <h5 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">
                    Managed Properties
                  </h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {properties.filter(p => p.ownerId === selectedUser.id).map(p => (
                      <div key={p.id} className="p-2.5 rounded-lg border border-slate-200 bg-white flex justify-between items-center">
                        <span className="font-medium text-slate-800 truncate">{p.title}</span>
                        <span className="font-mono font-bold text-slate-900 shrink-0">
                          ₹{p.monthlyRent.toLocaleString('en-IN')}/mo
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.role === 'TENANT' && (
                <div>
                  <h5 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">
                    Active Leases & Tenancies
                  </h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {agreements.filter(a => a.tenantId === selectedUser.id).map(a => (
                      <div key={a.id} className="p-2.5 rounded-lg border border-slate-200 bg-white flex justify-between items-center">
                        <span className="font-medium text-slate-800 truncate">{a.propertyTitle}</span>
                        <span className="font-mono font-bold text-slate-900 shrink-0">
                          ₹{a.monthlyRent.toLocaleString('en-IN')}/mo
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                <span>View-only administrator audit trail. Profile modifications can only be performed by the verified account owner.</span>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              {onReportSpamUser && (
                <button
                  onClick={() => {
                    onReportSpamUser(selectedUser);
                    setSelectedUser(null);
                  }}
                  className="text-xs font-semibold text-red-600 hover:text-red-800"
                >
                  Report to Government for Spam / Scam
                </button>
              )}
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-lg ml-auto transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
