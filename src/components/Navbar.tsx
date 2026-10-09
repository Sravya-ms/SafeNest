import React, { useState } from 'react';
import { User, AppNotification } from '../types';
import {
  Bell,
  ShieldCheck,
  LogOut,
  MessageSquare,
  Users,
  Home,
  UserCheck,
  Building2,
  LogIn
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onSelectTab: (tab: 'properties' | 'tenant' | 'owner' | 'admin' | 'chat' | 'users') => void;
  activeTab: string;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSelectTab,
  activeTab,
  notifications,
  onMarkNotificationRead,
  onOpenAuth,
  onSignOut
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => onSelectTab('properties')}
            className="flex items-center gap-2.5 text-left text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-600 text-white font-extrabold shadow-sm">
              <ShieldCheck size={20} />
            </span>
            <span>SafeNest</span>
          </button>

          {/* Zone 2: Role-Restricted Tabs (Only visible to the user's perspective profile) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectTab('properties')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'properties' ? 'text-teal-700 border-teal-600 font-semibold' : 'border-transparent'
              }`}
            >
              <Home size={15} />
              <span>Explore Homes</span>
            </button>

            {/* TENANT-ONLY TABS */}
            {currentUser?.role === 'TENANT' && (
              <>
                <button
                  onClick={() => onSelectTab('tenant')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'tenant' ? 'text-teal-700 border-teal-600 font-semibold' : 'border-transparent'
                  }`}
                >
                  <UserCheck size={15} />
                  <span>Tenant Hub</span>
                </button>
                <button
                  onClick={() => onSelectTab('chat')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'chat' ? 'text-teal-700 border-teal-600 font-semibold' : 'border-transparent'
                  }`}
                >
                  <MessageSquare size={15} />
                  <span>Messages (Chat)</span>
                </button>
              </>
            )}

            {/* OWNER-ONLY TABS */}
            {currentUser?.role === 'OWNER' && (
              <>
                <button
                  onClick={() => onSelectTab('owner')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'owner' ? 'text-teal-700 border-teal-600 font-semibold' : 'border-transparent'
                  }`}
                >
                  <Building2 size={15} />
                  <span>Owner Portal</span>
                </button>
                <button
                  onClick={() => onSelectTab('chat')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'chat' ? 'text-teal-700 border-teal-600 font-semibold' : 'border-transparent'
                  }`}
                >
                  <MessageSquare size={15} />
                  <span>Messages (Chat)</span>
                </button>
              </>
            )}

            {/* ADMIN-ONLY TABS */}
            {currentUser?.role === 'ADMIN' && (
              <>
                <button
                  onClick={() => onSelectTab('admin')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'admin' ? 'text-teal-700 border-teal-600 font-semibold' : 'border-transparent'
                  }`}
                >
                  <ShieldCheck size={15} />
                  <span>Verification & Spam Queue</span>
                </button>
                <button
                  onClick={() => onSelectTab('users')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'users' ? 'text-teal-700 border-teal-600 font-semibold' : 'border-transparent'
                  }`}
                >
                  <Users size={15} />
                  <span>User Profiles (View Mode)</span>
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Notifications & Sign In / Sign Out */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  aria-label="View notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600" />
                  )}
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                        Notifications ({unreadCount} unread)
                      </span>
                      <span className="text-[11px] text-slate-500">{currentUser.name}</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-500">
                          No notifications right now.
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                              !n.isRead ? 'bg-teal-50/40' : ''
                            }`}
                            onClick={() => {
                              onMarkNotificationRead(n.id);
                              if (n.linkTab === 'tenant' && currentUser.role === 'TENANT') onSelectTab('tenant');
                              if (n.linkTab === 'owner' && currentUser.role === 'OWNER') onSelectTab('owner');
                              if (n.linkTab === 'admin' && currentUser.role === 'ADMIN') onSelectTab('admin');
                              if (n.linkTab === 'chat') onSelectTab('chat');
                              setShowNotifMenu(false);
                            }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-slate-900">{n.title}</span>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                {n.createdAt.split(' ')[0]}
                              </span>
                            </div>
                            <p className="text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Info and Explicit Sign Out */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800">
                  <span className="w-6 h-6 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[11px]">
                    {currentUser.name.charAt(0)}
                  </span>
                  <span className="font-semibold">{currentUser.name}</span>
                  <span
                    className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                      currentUser.role === 'OWNER'
                        ? 'bg-indigo-50 text-indigo-700'
                        : currentUser.role === 'ADMIN'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-teal-50 text-teal-700'
                    }`}
                  >
                    {currentUser.role}
                  </span>
                </div>

                <button
                  onClick={onSignOut}
                  title="Sign out of your account to switch profile"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-red-700 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
