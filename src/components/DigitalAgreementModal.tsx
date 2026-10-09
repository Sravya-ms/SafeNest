import React, { useState } from 'react';
import { RentalAgreement, User } from '../types';
import { X, ShieldCheck, CheckCircle2, Download, Printer, PenTool } from 'lucide-react';

interface DigitalAgreementModalProps {
  agreement: RentalAgreement;
  currentUser: User;
  onClose: () => void;
  onSign: (agreementId: string, signature: string) => void;
}

export const DigitalAgreementModal: React.FC<DigitalAgreementModalProps> = ({
  agreement,
  currentUser,
  onClose,
  onSign
}) => {
  const [signatureName, setSignatureName] = useState(currentUser.name);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const canSignAsTenant =
    currentUser.role === 'TENANT' &&
    agreement.status === 'AWAITING_TENANT';

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) return;
    setIsSigning(true);
    setTimeout(() => {
      onSign(agreement.id, `${signatureName} [Digital Token: SHA256-${Math.random().toString(36).substring(2, 10)}]`);
      setIsSigning(false);
    }, 500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              {agreement.agreementNumber}
            </span>
            <span className="text-xs text-slate-500 font-medium">SafeNest Standard Residential Lease</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Print Agreement"
            >
              <Printer size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Legal Document Content */}
        <div className="p-8 space-y-6 text-slate-800 text-xs leading-relaxed print:p-0">
          {/* Document Title Banner */}
          <div className="text-center pb-6 border-b border-slate-200">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              RESIDENTIAL LEASE AGREEMENT
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Executed under SafeNest Verified Rental Protocol · Document Hash: {agreement.id}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md mt-3 bg-slate-100 text-slate-800">
              <ShieldCheck size={14} className="text-teal-600" />
              <span>Status: {agreement.status === 'ACTIVE' ? 'Fully Executed & Binding' : 'Pending Signatures'}</span>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-semibold text-slate-900 uppercase text-[11px] tracking-wider mb-1">
                Lessor (Property Owner)
              </p>
              <p className="text-sm font-bold text-slate-800">{agreement.ownerName}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Verified SafeNest Landlord ID: {agreement.ownerId}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 uppercase text-[11px] tracking-wider mb-1">
                Lessee (Tenant)
              </p>
              <p className="text-sm font-bold text-slate-800">{agreement.tenantName}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Verified Tenant ID: {agreement.tenantId}</p>
            </div>
          </div>

          {/* Premises & Financial Terms */}
          <div>
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">
              1. Leased Premises & Financial Terms
            </h3>
            <div className="p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <p>
                <strong>Property Address:</strong> {agreement.propertyAddress} ({agreement.propertyTitle})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 font-mono">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-sans">Monthly Rent</span>
                  <span className="font-bold text-slate-900">₹{agreement.monthlyRent.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-sans">Escrow Deposit</span>
                  <span className="font-bold text-slate-900">₹{agreement.securityDeposit.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-sans">Lease Start</span>
                  <span className="font-bold text-slate-900">{agreement.startDate}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-sans">Lease End</span>
                  <span className="font-bold text-slate-900">{agreement.endDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Covenants */}
          <div>
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">
              2. Standard Covenants & Regulations
            </h3>
            <ol className="space-y-2 list-decimal list-inside text-xs text-slate-600 bg-white p-4 rounded-xl border border-slate-200">
              {agreement.terms.map((t, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span className="text-slate-800">{t}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Signatures Section */}
          <div>
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">
              3. Digital Signatures & Execution Cryptography
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Owner Signature */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <p className="text-[11px] text-slate-500 uppercase font-semibold">Owner Signature</p>
                <div className="p-3 bg-white rounded border border-slate-200 font-mono text-xs text-slate-800 font-medium">
                  {agreement.ownerSignature || 'Pending Owner Signature'}
                </div>
                <p className="text-[10px] text-slate-400">
                  Signed: {agreement.ownerSignedAt || 'Not yet recorded'}
                </p>
              </div>

              {/* Tenant Signature */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <p className="text-[11px] text-slate-500 uppercase font-semibold">Tenant Signature</p>
                {agreement.tenantSignature ? (
                  <>
                    <div className="p-3 bg-white rounded border border-slate-200 font-mono text-xs text-teal-800 font-medium">
                      {agreement.tenantSignature}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Signed: {agreement.tenantSignedAt}
                    </p>
                  </>
                ) : (
                  <div className="p-3 bg-amber-50/60 rounded border border-amber-200 text-xs text-amber-800 italic">
                    Awaiting Tenant digital countersignature
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sign Action for Tenant */}
          {canSignAsTenant && (
            <form onSubmit={handleSign} className="p-4 rounded-xl bg-teal-50 border border-teal-200 space-y-3">
              <div className="flex items-center gap-2 text-teal-900 font-semibold text-xs">
                <PenTool size={15} />
                <span>Sign this Lease Agreement Digitally</span>
              </div>
              <div>
                <label className="block text-[11px] text-teal-900 font-medium mb-1">
                  Type your Legal Full Name to verify signature:
                </label>
                <input
                  type="text"
                  required
                  value={signatureName}
                  onChange={e => setSignatureName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-teal-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <label className="flex items-start gap-2 text-xs text-teal-950 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreedTerms}
                  onChange={e => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 text-teal-600 rounded"
                />
                <span>
                  I have read and agree to all terms, covenants, and financial schedules defined in Agreement #{agreement.agreementNumber}.
                </span>
              </label>

              <button
                type="submit"
                disabled={!agreedTerms || isSigning}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 size={15} />
                <span>{isSigning ? 'Authorizing Cryptographic Signature...' : 'Execute & Sign Lease Agreement'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Download size={13} />
            <span>Digital agreements are legally compliant under the Electronic Signatures Act.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
