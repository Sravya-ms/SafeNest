import React, { useState } from 'react';
import { User, Property, GovernmentReport } from '../types';
import { X, ShieldAlert, Send, FileCheck, AlertTriangle } from 'lucide-react';

interface AdminGovernmentReportModalProps {
  adminUser: User;
  property?: Property | null;
  onClose: () => void;
  onSubmit: (reportData: {
    targetType: 'PROPERTY_SCAM' | 'FAKE_LANDLORD' | 'PHISHING_SPAM' | 'DEED_FORGERY';
    targetId: string;
    targetTitle: string;
    offenderName: string;
    offenderEmail: string;
    description: string;
    evidenceNotes: string;
    adminUser: User;
    regulatoryBody: 'RERA_CYBER_CRIME_CELL' | 'NATIONAL_CONSUMER_HELPLINE' | 'HOUSING_MINISTRY_FRAUD_MONITOR';
  }) => void;
}

export const AdminGovernmentReportModal: React.FC<AdminGovernmentReportModalProps> = ({
  adminUser,
  property,
  onClose,
  onSubmit
}) => {
  const [targetType, setTargetType] = useState<'PROPERTY_SCAM' | 'FAKE_LANDLORD' | 'PHISHING_SPAM' | 'DEED_FORGERY'>('PROPERTY_SCAM');
  const [regulatoryBody, setRegulatoryBody] = useState<'RERA_CYBER_CRIME_CELL' | 'NATIONAL_CONSUMER_HELPLINE' | 'HOUSING_MINISTRY_FRAUD_MONITOR'>('RERA_CYBER_CRIME_CELL');
  const [targetTitle, setTargetTitle] = useState(property?.title || 'Suspicious Rental Scam Listing');
  const [offenderName, setOffenderName] = useState(property?.ownerName || 'Unknown Offender');
  const [offenderEmail, setOffenderEmail] = useState(property ? `${property.ownerId}@unverified.org` : 'fraudulent.account@domain.in');
  const [description, setDescription] = useState(
    property ? `Listing "${property.title}" contains unverified ownership documentation and suspected advance fee phishing activity.` : 'Deed title document verification failed due to duplicate stamp serial number.'
  );
  const [evidenceNotes, setEvidenceNotes] = useState(
    `1. Digital deed attachment mismatch with Sub-Registrar records.\n2. Discrepancy between stated owner name and municipal property tax records.\n3. SafeNest Anti-Fraud heuristics flagged abnormal pricing.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmit({
        targetType,
        targetId: property?.id || `user_scam_${Date.now()}`,
        targetTitle,
        offenderName,
        offenderEmail,
        description,
        evidenceNotes,
        adminUser,
        regulatoryBody
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-red-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-red-50/95 backdrop-blur-md px-6 py-4 border-b border-red-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-red-600 text-white">
              <ShieldAlert size={18} />
            </span>
            <div>
              <h2 className="text-base font-bold text-red-950">
                Lodge Official Government Fraud Report
              </h2>
              <p className="text-xs text-red-800">
                SafeNest Compliance Officer Direct Portal to Cyber Crime & RERA Vigilance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-800">
          <div className="p-3 bg-red-50 rounded-xl border border-red-200 flex items-start gap-2 text-[11px] text-red-900 leading-relaxed">
            <AlertTriangle size={15} className="shrink-0 text-red-600 mt-0.5" />
            <span>
              This submission generates an electronic FIR reference and forwards forensic evidence directly to law enforcement agencies for immediate takedown and account freezing.
            </span>
          </div>

          {/* Offense Category & Authority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Offense Category</label>
              <select
                value={targetType}
                onChange={e => setTargetType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 outline-none font-medium"
              >
                <option value="PROPERTY_SCAM">Rental Scam / Fake Property</option>
                <option value="DEED_FORGERY">Forged Title Deed / Fake Stamp Paper</option>
                <option value="FAKE_LANDLORD">Identity Theft / Impersonating Owner</option>
                <option value="PHISHING_SPAM">Advance Fee Fraud & Phishing</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Regulatory Agency</label>
              <select
                value={regulatoryBody}
                onChange={e => setRegulatoryBody(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 outline-none font-medium"
              >
                <option value="RERA_CYBER_CRIME_CELL">RERA State Cyber Cell</option>
                <option value="NATIONAL_CONSUMER_HELPLINE">National Consumer Helpline (NCH)</option>
                <option value="HOUSING_MINISTRY_FRAUD_MONITOR">MoHUA Anti-Fraud Vigilance</option>
              </select>
            </div>
          </div>

          {/* Target Title & Offender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-medium mb-1">Suspect Listing / Title</label>
              <input
                type="text"
                required
                value={targetTitle}
                onChange={e => setTargetTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 outline-none font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Suspect Name</label>
              <input
                type="text"
                required
                value={offenderName}
                onChange={e => setOffenderName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Suspect Email Address</label>
            <input
              type="text"
              required
              value={offenderEmail}
              onChange={e => setOffenderEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 outline-none font-mono"
            />
          </div>

          {/* Incident Description */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">Incident Summary & Modus Operandi</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Evidence Dossier */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">Evidence & Verification Logs</label>
            <textarea
              rows={3}
              required
              value={evidenceNotes}
              onChange={e => setEvidenceNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 outline-none resize-none font-mono text-[11px] leading-relaxed"
            />
          </div>

          {/* Reporting Officer Signature Preview */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px]">
            <div>
              <span className="text-slate-500 block">Reporting Officer:</span>
              <span className="font-bold text-slate-900">{adminUser.name} ({adminUser.email})</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Digital Certificate:</span>
              <span className="font-mono text-teal-800 font-semibold">CERT-OFFICER-IND-9481</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-slate-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Send size={13} />
              <span>{isSubmitting ? 'Transmitting to Government Cyber Cell...' : 'File Government Cyber Crime Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
