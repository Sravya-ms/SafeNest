import React from 'react';
import { Property } from '../types';
import { SafeImage } from './SafeImage';
import { ShieldCheck, Star, Bed, Bath, Maximize2, MapPin } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onRequest: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onRequest
}) => {
  return (
    <article className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all flex flex-col h-full">
      {/* Property Visual Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <SafeImage
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          propertyType={property.propertyType}
        />

        {/* Quiet verification indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/85 backdrop-blur-sm text-white rounded text-xs font-medium">
          <ShieldCheck size={13} className="text-teal-400" />
          <span>{property.verificationStatus === 'VERIFIED' ? 'Verified Property' : 'Audit Pending'}</span>
        </div>

        {/* Availability status */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-white/95 backdrop-blur-sm text-slate-800 rounded text-xs font-semibold">
          {property.isAvailable ? (
            <span className="text-emerald-700">Available</span>
          ) : (
            <span className="text-slate-500">Leased</span>
          )}
        </div>
      </div>

      {/* Property Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Location & Title */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
          <MapPin size={13} className="text-slate-400 shrink-0" />
          <span className="truncate">{property.address}, {property.city}</span>
        </div>

        <h3
          onClick={() => onSelect(property)}
          className="text-base font-semibold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1 cursor-pointer"
        >
          {property.title}
        </h3>

        {/* Unboxed Metadata with clean typographic separators (Zero-Pill discipline) */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 mb-3">
          <span className="flex items-center gap-1">
            <Bed size={13} />
            <span className="tabular-nums">{property.bedrooms}</span> Bed
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1">
            <Bath size={13} />
            <span className="tabular-nums">{property.bathrooms}</span> Bath
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1">
            <Maximize2 size={13} />
            <span className="tabular-nums">{property.areaSqFt}</span> sqft
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{property.furnishing}</span>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {property.description}
        </p>

        {/* Card Footer: Pricing and Primary Action */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                ₹{property.monthlyRent.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500">/mo</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Star size={11} className="fill-amber-400 text-amber-500" />
              <span className="font-semibold text-slate-700">{property.averageRating || 'New'}</span>
              <span>({property.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(property)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              Details
            </button>
            <button
              onClick={() => onRequest(property)}
              disabled={!property.isAvailable}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              Apply Lease
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
