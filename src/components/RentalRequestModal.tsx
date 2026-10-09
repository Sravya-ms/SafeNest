import React, { useState } from 'react';
import { Property, User } from '../types';
import { X, Send } from 'lucide-react';

interface RentalRequestModalProps {
  property: Property;
  currentUser: User;
  onClose: () => void;
  onSubmit: (data: {
    moveInDate: string;
    durationMonths: number;
    occupants: number;
    message: string;
  }) => void;
}

export const RentalRequestModal: React.FC<RentalRequestModalProps> = ({
  property,
  currentUser,
  onClose,
  onSubmit
}) => {
  const [moveInDate, setMoveInDate] = useState('2026-11-01');
  const [durationMonths, setDurationMonths] = useState(12);
  const [occupants, setOccupants] = useState(1);
  const [message, setMessage] = useState(
    `Hello ${property.ownerName}, I would like to apply for a lease for ${property.title}. My income is stable and I can provide references and background authorization immediately.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalMoveIn = property.monthlyRent + property.securityDeposit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        moveInDate,
        durationMonths,
        occupants,
        message
      });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Submit Rental Application</h2>
            <p className="text-xs text-slate-500 mt-0.5">{property.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Summary Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Monthly Rent:</span>
              <span className="font-mono font-semibold text-slate-900">₹{property.monthlyRent.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Security Deposit:</span>
              <span className="font-mono font-semibold text-slate-900">₹{property.securityDeposit.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 text-teal-800 font-medium">
              <span>Estimated Move-In Total:</span>
              <span className="font-mono font-bold">₹{totalMoveIn.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Applicant Info (read-only verification) */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 mb-1">Applicant Name</label>
              <input
                type="text"
                disabled
                value={currentUser.name}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Email</label>
              <input
                type="text"
                disabled
                value={currentUser.email}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 truncate cursor-not-allowed"
              />
            </div>
          </div>

          {/* Move-in Date & Duration */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Preferred Move-In</label>
              <input
                type="date"
                required
                value={moveInDate}
                onChange={e => setMoveInDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Lease Duration</label>
              <select
                value={durationMonths}
                onChange={e => setDurationMonths(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value={6}>6 Months</option>
                <option value={12}>12 Months (Standard)</option>
                <option value={24}>24 Months (Long Term)</option>
              </select>
            </div>
          </div>

          {/* Occupants */}
          <div className="text-xs">
            <label className="block text-slate-700 font-medium mb-1">Number of Occupants</label>
            <input
              type="number"
              min={1}
              max={6}
              value={occupants}
              onChange={e => setOccupants(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
            />
          </div>

          {/* Intro message */}
          <div className="text-xs">
            <label className="block text-slate-700 font-medium mb-1">
              Note to Landlord ({property.ownerName})
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
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
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Send size={13} />
              <span>{isSubmitting ? 'Submitting...' : 'Send Rental Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
