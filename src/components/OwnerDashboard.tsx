import React from 'react';
import {
  User,
  Property,
  RentalRequest,
  RentalAgreement,
  MaintenanceRequest,
  RentPayment
} from '../types';
import { SafeImage } from './SafeImage';
import {
  Plus,
  Building2,
  DollarSign,
  Users,
  Wrench,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  FileText,
  ShieldCheck,
  Eye,
  MessageSquare
} from 'lucide-react';

interface OwnerDashboardProps {
  currentUser: User;
  properties: Property[];
  requests: RentalRequest[];
  agreements: RentalAgreement[];
  maintenance: MaintenanceRequest[];
  payments: RentPayment[];
  onAddNewProperty: () => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
  onToggleAvailability: (property: Property) => void;
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onViewAgreement: (agr: RentalAgreement) => void;
  onManageMaintenance: (ticket: MaintenanceRequest) => void;
  onOpenChat?: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  currentUser,
  properties,
  requests,
  agreements,
  maintenance,
  payments,
  onAddNewProperty,
  onEditProperty,
  onDeleteProperty,
  onToggleAvailability,
  onApproveRequest,
  onRejectRequest,
  onViewAgreement,
  onManageMaintenance,
  onOpenChat
}) => {
  const myProperties = properties.filter(p => p.ownerId === currentUser.id);
  const myRequests = requests.filter(r => r.ownerId === currentUser.id);
  const myAgreements = agreements.filter(a => a.ownerId === currentUser.id);
  const myMaintenance = maintenance.filter(m => m.ownerId === currentUser.id);
  const myPayments = payments.filter(p => p.ownerId === currentUser.id);

  const totalMonthlyPotential = myProperties.reduce((sum, p) => sum + p.monthlyRent, 0);
  const occupiedProperties = myProperties.filter(p => !p.isAvailable).length;
  const occupancyRate = myProperties.length > 0 ? Math.round((occupiedProperties / myProperties.length) * 100) : 0;
  const pendingRequests = myRequests.filter(r => r.status === 'PENDING');
  const openMaintenance = myMaintenance.filter(m => m.status !== 'RESOLVED');

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Owner Management Console
            </h1>
            <span className="text-[11px] font-mono uppercase bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-semibold">
              Landlord: {currentUser.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your verified property portfolio, approve tenant rental applications, execute digital agreements, and oversee building repairs.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="px-4 py-2.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare size={15} />
              <span>Private Chat</span>
            </button>
          )}
          <button
            onClick={onAddNewProperty}
            className="px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus size={15} />
            <span>List New Property</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block">
            Portfolio Size
          </span>
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1 block">
            {myProperties.length} Properties
          </span>
          <span className="text-[11px] text-teal-700 font-medium">{occupancyRate}% Occupancy Rate</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block">
            Monthly Potential
          </span>
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1 block">
            ₹{totalMonthlyPotential.toLocaleString('en-IN')}/mo
          </span>
          <span className="text-[11px] text-slate-500">Gross rental roll</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block">
            Pending Applications
          </span>
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1 block">
            {pendingRequests.length}
          </span>
          <span className="text-[11px] text-amber-700 font-medium">Requires review</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block">
            Maintenance Tickets
          </span>
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1 block">
            {openMaintenance.length}
          </span>
          <span className="text-[11px] text-slate-500">Open work orders</span>
        </div>
      </div>

      {/* Pending Rental Applications - Prominent Queue */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users size={18} className="text-teal-600" />
              <span>Incoming Tenant Rental Applications</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Approving an application automatically drafts an authorized Digital Rental Agreement.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded text-slate-700">
            {pendingRequests.length} Pending
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No pending rental applications awaiting your review.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingRequests.map(req => (
              <div key={req.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{req.tenantName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{req.tenantEmail}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 font-mono">{req.tenantPhone}</span>
                  </div>

                  <p className="font-medium text-teal-800">
                    Applying for: {req.propertyTitle}
                  </p>

                  <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 italic leading-relaxed">
                    "{req.message}"
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
                    <span>Move-In: <strong>{req.moveInDate}</strong></span>
                    <span>·</span>
                    <span>Duration: <strong>{req.durationMonths} Months</strong></span>
                    <span>·</span>
                    <span>Occupants: <strong>{req.occupants}</strong></span>
                    <span>·</span>
                    <span>Rent: <strong>₹{req.monthlyRent.toLocaleString('en-IN')}/mo</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onRejectRequest(req.id)}
                    className="px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <XCircle size={14} />
                    <span>Decline</span>
                  </button>
                  <button
                    onClick={() => onApproveRequest(req.id)}
                    className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <CheckCircle size={14} />
                    <span>Approve & Generate Lease</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Properties Portfolio */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 size={18} className="text-teal-600" />
              <span>My Listed Rental Properties</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live room availability control, price modifications, and verification documents.
            </p>
          </div>
        </div>

        {myProperties.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 space-y-3">
            <p>You haven't listed any properties yet.</p>
            <button
              onClick={onAddNewProperty}
              className="text-teal-700 font-semibold hover:underline"
            >
              List your first property now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myProperties.map(p => (
              <div key={p.id} className="rounded-xl border border-slate-200 overflow-hidden flex flex-col bg-white">
                <div className="relative aspect-[16/9] bg-slate-100">
                  <SafeImage
                    src={p.images[0]}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    propertyType={p.propertyType}
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-semibold rounded">
                    {p.propertyType}
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-900 shadow">
                    {p.isAvailable ? (
                      <span className="text-emerald-700">Available</span>
                    ) : (
                      <span className="text-slate-500">Leased</span>
                    )}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1 space-y-2 text-xs">
                  <h3 className="font-bold text-slate-900 line-clamp-1">{p.title}</h3>
                  <p className="text-slate-500 text-[11px] truncate">{p.address}, {p.city}</p>

                  <div className="flex items-center justify-between pt-1 font-mono">
                    <span className="text-sm font-bold text-slate-900">₹{p.monthlyRent.toLocaleString('en-IN')}/mo</span>
                    <span className="text-slate-500 text-[11px]">
                      {p.availableRooms}/{p.totalRooms} Rooms Free
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-teal-700 font-medium">
                    <ShieldCheck size={13} />
                    <span>{p.verificationStatus === 'VERIFIED' ? 'Verified Title Deed' : 'Under Compliance Audit'}</span>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between gap-2">
                    <button
                      onClick={() => onToggleAvailability(p)}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                        p.isAvailable
                          ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {p.isAvailable ? 'Mark Leased' : 'Mark Available'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditProperty(p)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                        title="Edit Property"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteProperty(p.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Property"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Digital Agreements & Maintenance Management Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Digital Agreements */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText size={16} className="text-teal-600" />
              <span>Digital Lease Agreements</span>
            </h2>
            <span className="text-xs text-slate-500">{myAgreements.length} Total</span>
          </div>

          {myAgreements.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No digital agreements executed yet.
            </div>
          ) : (
            <div className="space-y-3">
              {myAgreements.map(a => (
                <div key={a.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{a.propertyTitle}</p>
                      <p className="text-[11px] text-slate-500">Tenant: <strong>{a.tenantName}</strong></p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      {a.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono text-slate-500">
                      ₹{a.monthlyRent.toLocaleString('en-IN')}/mo · Term: {a.startDate} - {a.endDate}
                    </span>
                    <button
                      onClick={() => onViewAgreement(a)}
                      className="px-3 py-1 text-xs font-semibold text-teal-700 hover:text-teal-800 hover:bg-teal-50 rounded transition-colors"
                    >
                      View Lease
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Maintenance Tickets Assigned to Owner */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Wrench size={16} className="text-teal-600" />
              <span>Maintenance & Repairs Workflow</span>
            </h2>
            <span className="text-xs text-slate-500">{openMaintenance.length} Open</span>
          </div>

          {myMaintenance.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No maintenance requests from tenants.
            </div>
          ) : (
            <div className="space-y-3">
              {myMaintenance.map(m => (
                <div key={m.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{m.title}</p>
                      <p className="text-[11px] text-slate-500">{m.propertyTitle} · Tenant: {m.tenantName}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        m.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed text-[11px]">"{m.description}"</p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-amber-700 font-semibold">
                      Urgency: {m.urgency}
                    </span>
                    <button
                      onClick={() => onManageMaintenance(m)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
                    >
                      Update Resolution
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
