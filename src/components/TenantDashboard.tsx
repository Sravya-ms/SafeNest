import React from 'react';
import {
  User,
  RentalAgreement,
  RentalRequest,
  RentPayment,
  MaintenanceRequest,
  Property
} from '../types';
import { TenantRentChart } from './TenantRentChart';
import {
  FileText,
  CreditCard,
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Building,
  Plus,
  MessageSquare
} from 'lucide-react';

interface TenantDashboardProps {
  currentUser: User;
  agreements: RentalAgreement[];
  requests: RentalRequest[];
  payments: RentPayment[];
  maintenance: MaintenanceRequest[];
  properties: Property[];
  onViewAgreement: (agr: RentalAgreement) => void;
  onPayRent: (payment: RentPayment) => void;
  onNewMaintenance: () => void;
  onExploreProperties: () => void;
  onOpenChat?: () => void;
}

export const TenantDashboard: React.FC<TenantDashboardProps> = ({
  currentUser,
  agreements,
  requests,
  payments,
  maintenance,
  properties,
  onViewAgreement,
  onPayRent,
  onNewMaintenance,
  onExploreProperties,
  onOpenChat
}) => {
  const myAgreements = agreements.filter(a => a.tenantId === currentUser.id);
  const myRequests = requests.filter(r => r.tenantId === currentUser.id);
  const myPayments = payments.filter(p => p.tenantId === currentUser.id);
  const myMaintenance = maintenance.filter(m => m.tenantId === currentUser.id);

  const activeAgreement = myAgreements.find(a => a.status === 'ACTIVE');
  const pendingSignAgreement = myAgreements.find(a => a.status === 'AWAITING_TENANT');
  const pendingPayment = myPayments.find(p => p.status === 'PENDING' || p.status === 'OVERDUE');

  const totalPaid = myPayments
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Top Banner / Welcome */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Welcome back, {currentUser.name}
            </h1>
            <span className="text-[11px] font-mono uppercase bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-semibold">
              Tenant Hub
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Access active leases, view verified property documents, settle monthly rent in escrow, and monitor repair tickets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="px-4 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare size={14} />
              <span>Private Chat</span>
            </button>
          )}
          <button
            onClick={onNewMaintenance}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Wrench size={14} />
            <span>Report Issue</span>
          </button>
          <button
            onClick={onExploreProperties}
            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Building size={14} />
            <span>Browse Homes</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block">
            Active Leases
          </span>
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1 block">
            {myAgreements.filter(a => a.status === 'ACTIVE').length}
          </span>
          <span className="text-[11px] text-teal-700 font-medium">All covenants binding</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block">
            Next Rent Due
          </span>
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1 block">
            {pendingPayment ? `₹${pendingPayment.amount.toLocaleString('en-IN')}` : '₹0'}
          </span>
          <span className="text-[11px] text-slate-500">
            {pendingPayment ? `Due ${pendingPayment.dueDate}` : 'Settled for the month'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block">
            Lifetime Rent Settled
          </span>
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1 block">
            ₹{totalPaid.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">Escrow protected</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block">
            Open Maintenance Tickets
          </span>
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1 block">
            {myMaintenance.filter(m => m.status !== 'RESOLVED').length}
          </span>
          <span className="text-[11px] text-slate-500">Fast-response SLA</span>
        </div>
      </div>

      {/* Action Callout if Lease Pending Signature */}
      {pendingSignAgreement && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <FileText size={22} className="text-teal-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-teal-950">
                Action Required: Sign Lease for {pendingSignAgreement.propertyTitle}
              </p>
              <p className="text-xs text-teal-800 mt-0.5">
                The landlord approved your application. Please review and execute the digital lease agreement to finalize residency.
              </p>
            </div>
          </div>
          <button
            onClick={() => onViewAgreement(pendingSignAgreement)}
            className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shrink-0 transition-colors"
          >
            Review & Sign Agreement
          </button>
        </div>
      )}

      {/* Recharts Monthly Rent Payment Trends over Last 12 Months */}
      <TenantRentChart
        payments={myPayments}
        monthlyRent={activeAgreement?.monthlyRent || 28500}
      />

      {/* Current Residence & Upcoming Rent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Lease Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText size={16} className="text-teal-600" />
              <span>Current Residence & Digital Lease</span>
            </h2>
            {activeAgreement && (
              <span className="text-[11px] font-mono text-slate-400">
                {activeAgreement.agreementNumber}
              </span>
            )}
          </div>

          {activeAgreement ? (
            <div className="space-y-3 text-xs">
              <div>
                <p className="font-semibold text-slate-900 text-sm">{activeAgreement.propertyTitle}</p>
                <p className="text-slate-500 mt-0.5">{activeAgreement.propertyAddress}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono">
                <div>
                  <span className="block text-[10px] text-slate-400 font-sans uppercase">Monthly Rent</span>
                  <span className="font-bold text-slate-900">₹{activeAgreement.monthlyRent.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-sans uppercase">Security Deposit</span>
                  <span className="font-bold text-slate-900">₹{activeAgreement.securityDeposit.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-sans uppercase">Lease Term</span>
                  <span className="text-slate-700">{activeAgreement.startDate} to {activeAgreement.endDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 size={13} />
                  <span>Fully Signed by Both Parties</span>
                </span>
                <button
                  onClick={() => onViewAgreement(activeAgreement)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  View Agreement Document
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500 space-y-2">
              <p>No active lease registered on this account.</p>
              <button
                onClick={onExploreProperties}
                className="text-teal-700 font-semibold hover:underline"
              >
                Browse verified properties to apply
              </button>
            </div>
          )}
        </div>

        {/* Rent Payments Schedule & Settlement */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard size={16} className="text-teal-600" />
              <span>Rent Schedule & Ledger</span>
            </h2>
            <span className="text-xs text-slate-500">Escrow Protected</span>
          </div>

          {myPayments.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No rent installments due yet.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {myPayments.map(p => (
                <div
                  key={p.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{p.billingMonth}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>Due: {p.dueDate}</span>
                      {p.receiptNumber && (
                        <>
                          <span>·</span>
                          <span className="font-mono text-slate-600">{p.receiptNumber}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </span>

                    {p.status === 'PAID' ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        Paid
                      </span>
                    ) : (
                      <button
                        onClick={() => onPayRent(p)}
                        className="px-3 py-1 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors"
                      >
                        Pay Rent
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Applications & Maintenance Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rental Applications Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock size={16} className="text-teal-600" />
              <span>Rental Applications Sent</span>
            </h2>
            <span className="text-xs text-slate-500">{myRequests.length} total</span>
          </div>

          {myRequests.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No applications submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.map(r => (
                <div key={r.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">{r.propertyTitle}</p>
                      <p className="text-[11px] text-slate-500">{r.propertyAddress}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        r.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                    <span>Move-in: {r.moveInDate}</span>
                    <span>·</span>
                    <span>{r.durationMonths} Months</span>
                    <span>·</span>
                    <span>₹{r.monthlyRent.toLocaleString('en-IN')}/mo</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Maintenance Requests */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Wrench size={16} className="text-teal-600" />
              <span>Maintenance & Complaints</span>
            </h2>
            <button
              onClick={onNewMaintenance}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <Plus size={13} />
              <span>Report Issue</span>
            </button>
          </div>

          {myMaintenance.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No maintenance tickets filed.
            </div>
          ) : (
            <div className="space-y-3">
              {myMaintenance.map(m => (
                <div key={m.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">{m.title}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>{m.category}</span>
                        <span>·</span>
                        <span className="font-semibold text-amber-700">{m.urgency} Urgency</span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        m.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed text-[11px]">{m.description}</p>

                  {m.resolutionNote && (
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-700">
                      <strong>Owner Note:</strong> {m.resolutionNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
