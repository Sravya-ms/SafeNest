import React, { useState } from 'react';
import { MaintenanceRequest, MaintenanceCategory, MaintenanceUrgency, User, Property } from '../types';
import { X, Wrench, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MaintenanceModalProps {
  currentUser: User;
  activeProperties: Property[];
  existingRequest?: MaintenanceRequest | null;
  onClose: () => void;
  onSubmitNew: (data: {
    propertyId: string;
    propertyTitle: string;
    ownerId: string;
    category: MaintenanceCategory;
    title: string;
    description: string;
    urgency: MaintenanceUrgency;
  }) => void;
  onUpdateStatus?: (id: string, status: 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED', note?: string) => void;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  currentUser,
  activeProperties,
  existingRequest,
  onClose,
  onSubmitNew,
  onUpdateStatus
}) => {
  const isOwnerUpdating = Boolean(existingRequest && currentUser.role === 'OWNER');

  // Tenant submission state
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    existingRequest?.propertyId || (activeProperties[0]?.id ?? '')
  );
  const [category, setCategory] = useState<MaintenanceCategory>(existingRequest?.category || 'Plumbing');
  const [urgency, setUrgency] = useState<MaintenanceUrgency>(existingRequest?.urgency || 'MEDIUM');
  const [title, setTitle] = useState(existingRequest?.title || '');
  const [description, setDescription] = useState(existingRequest?.description || '');

  // Owner update state
  const [status, setStatus] = useState<'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'>(
    existingRequest?.status === 'SUBMITTED' ? 'IN_PROGRESS' : (existingRequest?.status as any) || 'IN_PROGRESS'
  );
  const [resolutionNote, setResolutionNote] = useState(existingRequest?.resolutionNote || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOwnerUpdating && existingRequest && onUpdateStatus) {
      onUpdateStatus(existingRequest.id, status, resolutionNote);
      onClose();
      return;
    }

    const prop = activeProperties.find(p => p.id === selectedPropertyId) || activeProperties[0];
    if (!prop) return;

    onSubmitNew({
      propertyId: prop.id,
      propertyTitle: prop.title,
      ownerId: prop.ownerId,
      category,
      urgency,
      title,
      description
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <Wrench size={16} />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isOwnerUpdating ? 'Update Maintenance Resolution' : 'Log Maintenance Ticket'}
              </h2>
              <p className="text-xs text-slate-500">
                {isOwnerUpdating ? `Ticket ID: ${existingRequest?.id}` : 'Direct response SLA guaranteed'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isOwnerUpdating && existingRequest ? (
            /* Landlord Resolution View */
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <p className="font-semibold text-slate-900 text-sm">{existingRequest.title}</p>
                <p className="text-slate-600">{existingRequest.description}</p>
                <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-500">
                  <span>Tenant: <strong>{existingRequest.tenantName}</strong></span>
                  <span>·</span>
                  <span>Category: <strong>{existingRequest.category}</strong></span>
                  <span>·</span>
                  <span>Urgency: <strong className="text-amber-700">{existingRequest.urgency}</strong></span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Update Status</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('IN_PROGRESS')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold ${
                      status === 'IN_PROGRESS' ? 'bg-amber-50 border-amber-500 text-amber-800' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('RESOLVED')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold ${
                      status === 'RESOLVED' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Resolved
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('REJECTED')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold ${
                      status === 'REJECTED' ? 'bg-red-50 border-red-500 text-red-800' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Contractor / Resolution Note
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g., Plumber dispatched on Thursday. Replaced supply valve and tested water flow."
                  value={resolutionNote}
                  onChange={e => setResolutionNote(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>
          ) : (
            /* Tenant Submission View */
            <div className="space-y-4 text-xs">
              {/* Target Property */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Property</label>
                <select
                  value={selectedPropertyId}
                  onChange={e => setSelectedPropertyId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  {activeProperties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.address})
                    </option>
                  ))}
                </select>
              </div>

              {/* Category & Urgency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as MaintenanceCategory)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="HVAC">HVAC / Heating / AC</option>
                    <option value="Appliance">Kitchen Appliance</option>
                    <option value="Structural">Structural / Locks</option>
                    <option value="Pest Control">Pest Control</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Urgency Level</label>
                  <select
                    value={urgency}
                    onChange={e => setUrgency(e.target.value as MaintenanceUrgency)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 outline-none font-semibold text-slate-800"
                  >
                    <option value="LOW">Low (Routine)</option>
                    <option value="MEDIUM">Medium (Prompt)</option>
                    <option value="HIGH">High (Urgent)</option>
                    <option value="EMERGENCY">Emergency (Immediate)</option>
                  </select>
                </div>
              </div>

              {/* Issue Title */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Issue Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master bathroom sink drain clogged"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Detailed Description & Location
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe when the issue began, exact room location, and current behavior..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                <AlertTriangle size={15} className="shrink-0 text-amber-700" />
                <span>
                  For active water floods or gas leaks, please shut off primary main valves immediately before logging.
                </span>
              </div>
            </div>
          )}

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
              className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <CheckCircle2 size={14} />
              <span>{isOwnerUpdating ? 'Save Resolution' : 'Submit Maintenance Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
