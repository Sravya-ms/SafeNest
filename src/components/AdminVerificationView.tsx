import React from 'react';
import { Property, User, GovernmentReport } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  Eye,
  ShieldAlert,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface AdminVerificationViewProps {
  currentUser: User;
  properties: Property[];
  govReports: GovernmentReport[];
  onVerify: (propertyId: string, status: 'VERIFIED' | 'REJECTED') => void;
  onViewProperty: (property: Property) => void;
  onOpenGovReport: (property?: Property) => void;
}

export const AdminVerificationView: React.FC<AdminVerificationViewProps> = ({
  currentUser,
  properties,
  govReports,
  onVerify,
  onViewProperty,
  onOpenGovReport
}) => {
  const pendingProps = properties.filter(p => p.verificationStatus === 'PENDING');
  const verifiedProps = properties.filter(p => p.verificationStatus === 'VERIFIED');
  const spamProps = properties.filter(p => p.isSpamReported);

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              SafeNest Trust & Verification Registry
            </h1>
            <span className="text-[11px] font-mono uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold">
              Compliance Officer: {currentUser.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Audit registered title deeds, check municipal Sub-Registrar records, and report fraudulent scam listings directly to government enforcement agencies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200">
            {pendingProps.length} Pending Audit
          </span>
          <span className="px-3 py-1 rounded bg-teal-50 text-teal-800 font-semibold border border-teal-200">
            {verifiedProps.length} Verified
          </span>
          <button
            onClick={() => onOpenGovReport()}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-sans font-bold flex items-center gap-1.5 transition-colors shadow-sm ml-auto"
          >
            <ShieldAlert size={14} />
            <span>Report Spam to Government</span>
          </button>
        </div>
      </div>

      {/* Government Dispatched Reports Banner */}
      <div className="bg-white rounded-xl border border-red-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-red-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-red-100 text-red-700">
              <ShieldAlert size={16} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Official Government Fraud & Spam Complaints ({govReports.length})
              </h2>
              <p className="text-[11px] text-slate-500">
                Dossiers transmitted to RERA State Cyber Cell and National Cyber Crime Portal.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Automated Police Referral
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {govReports.map(rep => (
            <div key={rep.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-red-800">{rep.reportNumber}</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-bold text-slate-900">{rep.targetTitle}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-red-100 text-red-800 rounded font-semibold uppercase">
                    {rep.targetType.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Offender: <strong>{rep.offenderName}</strong> ({rep.offenderEmail}) · {rep.description}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                  <span>Acknowledged Token: <strong className="text-slate-700">{rep.acknowledgementToken}</strong></span>
                  <span>·</span>
                  <span>Regulatory Agency: {rep.regulatoryBody}</span>
                  <span>·</span>
                  <span>Dispatched: {rep.createdAt}</span>
                </div>
              </div>

              <div className="shrink-0">
                <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold">
                  {rep.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Audits Queue */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-amber-600" />
              <span>Pending Property Title Audits</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review deed attachments and verify ownership before granting public Verified badge.
            </p>
          </div>
        </div>

        {pendingProps.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            All submitted property listings are currently verified! Queue is clear.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingProps.map(p => (
              <div key={p.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{p.title}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 font-medium">{p.propertyType}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin size={13} className="text-slate-400" />
                    <span>{p.address}, {p.city}, {p.state} {p.zipCode}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      <FileText size={16} className="text-teal-600" />
                      <span>Attached Deed Document:</span>
                      <strong className="font-mono text-slate-900">{p.verificationDocName || 'Deed_Registry_Document.pdf'}</strong>
                    </div>
                    <span className="text-[11px] text-teal-700 font-mono">Title Serial Cross-Check</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>Owner: <strong>{p.ownerName}</strong> ({p.ownerPhone})</span>
                    <span>·</span>
                    <span>Monthly Rent: <strong className="font-mono text-slate-900">₹{p.monthlyRent.toLocaleString('en-IN')}</strong></span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => onViewProperty(p)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Inspect Listing"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onOpenGovReport(p)}
                    className="px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1 transition-colors border border-red-200"
                    title="Report Fake Listing to Police/RERA"
                  >
                    <ShieldAlert size={14} />
                    <span>Report Spam</span>
                  </button>
                  <button
                    onClick={() => onVerify(p.id, 'REJECTED')}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <XCircle size={14} />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => onVerify(p.id, 'VERIFIED')}
                    className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve & Certify</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Registry Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-teal-600" />
            <span>Audited & Certified Properties ({verifiedProps.length})</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Property</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Owner</th>
                <th className="py-2.5 px-3">Document Title</th>
                <th className="py-2.5 px-3 text-right">Monthly Rent</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {verifiedProps.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">{p.title}</td>
                  <td className="py-3 px-3 text-slate-500">{p.city}, {p.state}</td>
                  <td className="py-3 px-3 text-slate-700">{p.ownerName}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-teal-800">{p.verificationDocName}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 text-right tabular-nums">
                    ₹{p.monthlyRent.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onVerify(p.id, 'REJECTED')}
                      className="text-red-600 hover:text-red-800 font-medium text-[11px]"
                    >
                      Revoke
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
