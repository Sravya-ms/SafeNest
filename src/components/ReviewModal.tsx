import React, { useState } from 'react';
import { Property, User } from '../types';
import { X, Star, ShieldCheck } from 'lucide-react';

interface ReviewModalProps {
  property: Property;
  currentUser: User;
  onClose: () => void;
  onSubmit: (data: {
    propertyId: string;
    tenantId: string;
    tenantName: string;
    rating: number;
    cleanlinessRating: number;
    communicationRating: number;
    valueRating: number;
    comment: string;
    isVerifiedStay: boolean;
  }) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  property,
  currentUser,
  onClose,
  onSubmit
}) => {
  const [rating, setRating] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [value, setValue] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      propertyId: property.id,
      tenantId: currentUser.id,
      tenantName: currentUser.name,
      rating,
      cleanlinessRating: cleanliness,
      communicationRating: communication,
      valueRating: value,
      comment,
      isVerifiedStay: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Review Resident Experience</h2>
            <p className="text-xs text-slate-500">{property.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-800">
          <div className="flex items-center gap-2 p-2.5 bg-teal-50 rounded-lg text-teal-800 text-[11px] font-medium">
            <ShieldCheck size={16} className="text-teal-600 shrink-0" />
            <span>Posting as verified tenant {currentUser.name}. Reviews contribute to landlord reliability score.</span>
          </div>

          {/* Overall Rating */}
          <div className="text-center py-2">
            <span className="block text-slate-500 font-medium mb-1">Overall Rating</span>
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    size={28}
                    className={
                      star <= rating
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-slate-300'
                    }
                  />
                </button>
              ))}
            </div>
            <span className="text-sm font-mono font-bold text-slate-900 mt-1 block">
              {rating}.0 / 5.0
            </span>
          </div>

          {/* Sub-ratings */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 font-medium">Property Cleanliness & Upkeep:</span>
                <span className="font-mono font-bold text-slate-800">{cleanliness}/5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={cleanliness}
                onChange={e => setCleanliness(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 font-medium">Landlord Communication & Responsiveness:</span>
                <span className="font-mono font-bold text-slate-800">{communication}/5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={communication}
                onChange={e => setCommunication(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 font-medium">Value for Money:</span>
                <span className="font-mono font-bold text-slate-800">{value}/5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={value}
                onChange={e => setValue(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>
          </div>

          {/* Written feedback */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">Your Detailed Experience</label>
            <textarea
              rows={4}
              required
              placeholder="Share details about the neighborhood, management responsiveness, noise level, and move-in process..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none"
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
              className="px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
