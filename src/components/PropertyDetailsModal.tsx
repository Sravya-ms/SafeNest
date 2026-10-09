import React, { useState } from 'react';
import { Property, PropertyReview } from '../types';
import { SafeImage } from './SafeImage';
import {
  X,
  ShieldCheck,
  Star,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  FileCheck,
  Phone,
  User,
  Calendar,
  Check
} from 'lucide-react';

interface PropertyDetailsModalProps {
  property: Property;
  reviews: PropertyReview[];
  onClose: () => void;
  onApply: (property: Property) => void;
  onAddReview: (property: Property) => void;
  onChatWithOwner?: (property: Property) => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  reviews,
  onClose,
  onApply,
  onAddReview,
  onChatWithOwner
}) => {
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
              {property.propertyType} Residence
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <ShieldCheck size={14} className="text-teal-600" />
              <span>{property.verificationStatus === 'VERIFIED' ? 'Verified Title & Owner' : 'Pending Verification'}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Main Visual Display */}
          <div className="space-y-3">
            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <SafeImage
                src={property.images[selectedImgIdx] || property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
                propertyType={property.propertyType}
              />
            </div>
            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImgIdx === idx ? 'border-teal-600 ring-2 ring-teal-200' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <SafeImage
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      propertyType={property.propertyType}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Key Metrics Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{property.title}</h2>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                <MapPin size={15} className="text-slate-400 shrink-0" />
                <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
                    ₹{property.monthlyRent.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-slate-500">/mo</span>
                </div>
                <div className="text-xs text-slate-500">
                  Deposit: <span className="font-mono tabular-nums font-semibold">₹{property.securityDeposit.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onApply(property);
                }}
                disabled={!property.isAvailable}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                Apply for Lease
              </button>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <div className="flex items-center gap-2.5">
              <Bed size={18} className="text-slate-500" />
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Bedrooms</p>
                <p className="font-bold font-mono text-sm">{property.bedrooms} Beds</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Bath size={18} className="text-slate-500" />
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Bathrooms</p>
                <p className="font-bold font-mono text-sm">{property.bathrooms} Baths</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Maximize2 size={18} className="text-slate-500" />
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Living Area</p>
                <p className="font-bold font-mono text-sm">{property.areaSqFt} sq.ft</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar size={18} className="text-slate-500" />
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Rooms Available</p>
                <p className="font-bold font-mono text-sm text-emerald-700">
                  {property.availableRooms} of {property.totalRooms} Free
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">
              Property Description
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Verified Owner & Legal Verification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm">
                  {property.ownerName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">Verified Landlord</p>
                  <p className="text-sm font-semibold text-slate-900">{property.ownerName}</p>
                  <p className="text-[11px] text-teal-700 flex items-center gap-1 mt-0.5 font-medium">
                    <span>🔒 SafeNest Masked ID · No private mobile shared</span>
                  </p>
                </div>
              </div>
              {onChatWithOwner && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onChatWithOwner(property);
                  }}
                  className="mt-3 w-full py-2 px-3 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>💬 Message Landlord Directly</span>
                </button>
              )}
            </div>

            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50">
              <div className="flex items-start gap-3">
                <FileCheck size={22} className="text-teal-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-teal-900">Verified Deed & Regulatory Title</p>
                  <p className="text-teal-800 mt-0.5">
                    Document registered: <span className="font-mono">{property.verificationDocName || 'Registry_Record_2025.pdf'}</span>
                  </p>
                  <p className="text-[11px] text-teal-600 mt-1">
                    Audited by SafeNest Verification Protocol. No disputes or dual ownership detected.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities & Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                Amenities & Features
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {property.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <Check size={14} className="text-teal-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                Lease & House Rules
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                {property.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900">
                  Verified Resident Reviews
                </h3>
                <div className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  <Star size={13} className="fill-amber-400 text-amber-500" />
                  <span className="font-bold">{property.averageRating || 'New'}</span>
                  <span>({reviews.length} reviews)</span>
                </div>
              </div>

              <button
                onClick={() => onAddReview(property)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
              >
                + Write a Review
              </button>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">
                No reviews yet. Be the first tenant to leave feedback after tenancy verification.
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900">{r.tenantName}</span>
                        {r.isVerifiedStay && (
                          <span className="text-[10px] text-teal-700 font-medium flex items-center gap-0.5">
                            <ShieldCheck size={12} />
                            <span>Verified Stay</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{r.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>Rating: <strong className="text-slate-800 font-mono">{r.rating}/5</strong></span>
                      <span>·</span>
                      <span>Cleanliness: <strong className="text-slate-800 font-mono">{r.cleanlinessRating}/5</strong></span>
                      <span>·</span>
                      <span>Owner Response: <strong className="text-slate-800 font-mono">{r.communicationRating}/5</strong></span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            SafeNest Guarantee: Escrow deposit protection and verifiable tenancy agreement.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
