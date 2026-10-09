import React, { useState } from 'react';
import { Property, PropertyType, FurnishingStatus, User } from '../types';
import { X, Building2, Check, Plus, Trash2 } from 'lucide-react';

interface AddEditPropertyModalProps {
  currentUser: User;
  propertyToEdit?: Property | null;
  onClose: () => void;
  onSave: (propertyData: any) => void;
}

const COMMON_AMENITIES = [
  'Central AC',
  'High-Speed Fiber',
  'Reserved Parking',
  'Fitness Center',
  'EV Charging',
  '24/7 Concierge',
  'Balcony',
  'In-Unit Washer & Dryer',
  'Dishwasher',
  'Smart Lock',
  'Pet Friendly',
  'Swimming Pool'
];

export const AddEditPropertyModal: React.FC<AddEditPropertyModalProps> = ({
  currentUser,
  propertyToEdit,
  onClose,
  onSave
}) => {
  const isEditing = Boolean(propertyToEdit);

  const [title, setTitle] = useState(propertyToEdit?.title || '');
  const [propertyType, setPropertyType] = useState<PropertyType>(propertyToEdit?.propertyType || 'Apartment');
  const [address, setAddress] = useState(propertyToEdit?.address || '');
  const [city, setCity] = useState(propertyToEdit?.city || 'Bengaluru');
  const [state, setState] = useState(propertyToEdit?.state || 'Karnataka');
  const [zipCode, setZipCode] = useState(propertyToEdit?.zipCode || '560038');
  const [monthlyRent, setMonthlyRent] = useState(propertyToEdit?.monthlyRent || 25000);
  const [securityDeposit, setSecurityDeposit] = useState(propertyToEdit?.securityDeposit || 50000);
  const [bedrooms, setBedrooms] = useState(propertyToEdit?.bedrooms || 2);
  const [bathrooms, setBathrooms] = useState(propertyToEdit?.bathrooms || 1.5);
  const [areaSqFt, setAreaSqFt] = useState(propertyToEdit?.areaSqFt || 950);
  const [furnishing, setFurnishing] = useState<FurnishingStatus>(propertyToEdit?.furnishing || 'Furnished');
  const [availableRooms, setAvailableRooms] = useState(propertyToEdit?.availableRooms || 2);
  const [totalRooms, setTotalRooms] = useState(propertyToEdit?.totalRooms || 2);
  const [isAvailable, setIsAvailable] = useState(propertyToEdit?.isAvailable ?? true);
  const [description, setDescription] = useState(propertyToEdit?.description || '');
  const [verificationDocName, setVerificationDocName] = useState(
    propertyToEdit?.verificationDocName || 'Land_Registry_Title_Deed_2026.pdf'
  );
  const [imageUrl, setImageUrl] = useState(
    propertyToEdit?.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  );

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    propertyToEdit?.amenities || ['Central AC', 'High-Speed Fiber', 'Reserved Parking', 'In-Unit Washer & Dryer']
  );

  const [rules, setRules] = useState<string[]>(
    propertyToEdit?.rules || ['No indoor smoking', 'Quiet hours 10 PM - 7 AM']
  );
  const [newRule, setNewRule] = useState('');

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const addRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule.trim()]);
      setNewRule('');
    }
  };

  const removeRule = (idx: number) => {
    setRules(rules.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerPhone: currentUser.phone,
      title,
      description,
      propertyType,
      address,
      city,
      state,
      zipCode,
      monthlyRent: Number(monthlyRent),
      securityDeposit: Number(securityDeposit),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      areaSqFt: Number(areaSqFt),
      furnishing,
      availableRooms: Number(availableRooms),
      totalRooms: Number(totalRooms),
      isAvailable,
      verificationStatus: propertyToEdit?.verificationStatus || 'PENDING',
      verificationDocName,
      images: [imageUrl],
      amenities: selectedAmenities,
      rules
    };

    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <Building2 size={16} />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? 'Edit Rental Property' : 'List New Verified Property'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing ? `Modifying listing: ${propertyToEdit?.title}` : 'SafeNest Verified Landlord Registry'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs text-slate-800">
          {/* Basic Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
              Listing Title & Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Property Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bellevue Pine: Modern 2BHK with Balcony"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Dwelling Type</label>
                <select
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value as PropertyType)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa / House</option>
                  <option value="Studio">Studio</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
              Location & Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 520 Bellevue Way NE, Unit 8"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Zip Code</label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={e => setZipCode(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Financials & Layout */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
              Financials & Spatial Specifications
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Monthly Rent (₹)</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={monthlyRent}
                  onChange={e => setMonthlyRent(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={securityDeposit}
                  onChange={e => setSecurityDeposit(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Bedrooms</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={10}
                  value={bedrooms}
                  onChange={e => setBedrooms(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Bathrooms</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  min={1}
                  max={8}
                  value={bathrooms}
                  onChange={e => setBathrooms(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Floor Area (sq ft)</label>
                <input
                  type="number"
                  required
                  value={areaSqFt}
                  onChange={e => setAreaSqFt(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Furnishing</label>
                <select
                  value={furnishing}
                  onChange={e => setFurnishing(e.target.value as FurnishingStatus)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Available Rooms</label>
                <input
                  type="number"
                  required
                  min={0}
                  max={totalRooms}
                  value={availableRooms}
                  onChange={e => setAvailableRooms(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Listing Status</label>
                <select
                  value={isAvailable ? 'true' : 'false'}
                  onChange={e => setIsAvailable(e.target.value === 'true')}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-medium"
                >
                  <option value="true">Active (Open to Lease)</option>
                  <option value="false">Occupied / Leased</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">Detailed Description</label>
            <textarea
              rows={3}
              required
              placeholder="Highlight finishes, neighborhood perks, heating/cooling, and transport connections..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none"
            />
          </div>

          {/* Ownership Verification Document */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-slate-700 font-semibold mb-1">
              Title Deed / Ownership Verification Document
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Deed_CountyRecords_Title_2026.pdf"
              value={verificationDocName}
              onChange={e => setVerificationDocName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              All SafeNest listings undergo deed cross-referencing by our compliance officer before receiving the Verified badge.
            </p>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">Cover Photo URL</label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-mono"
            />
          </div>

          {/* Amenities checklist */}
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COMMON_AMENITIES.map(item => {
                const checked = selectedAmenities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAmenity(item)}
                    className={`px-3 py-2 rounded-lg border text-left flex items-center justify-between transition-colors ${
                      checked ? 'bg-teal-50 border-teal-500 text-teal-900 font-medium' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item}</span>
                    {checked && <Check size={14} className="text-teal-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rules */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">House Rules & Covenants</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add rule (e.g. No indoor smoking, Quiet hours 10 PM - 7 AM)"
                value={newRule}
                onChange={e => setNewRule(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={addRule}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 font-semibold"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>
            <div className="space-y-1">
              {rules.map((rule, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-slate-700">
                  <span>{rule}</span>
                  <button
                    type="button"
                    onClick={() => removeRule(idx)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Submit Listing for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
