import React, { useState } from 'react';
import { Building2, Home } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  propertyType?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  propertyType = 'Apartment'
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-300 p-6 ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-700/60 border border-slate-600/40 text-teal-400 mb-2">
          {propertyType === 'Villa' ? <Home size={24} /> : <Building2 size={24} />}
        </div>
        <p className="text-xs font-medium text-slate-200 tracking-wide text-center px-4 line-clamp-1">
          {alt}
        </p>
        <span className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider">
          {propertyType}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};
