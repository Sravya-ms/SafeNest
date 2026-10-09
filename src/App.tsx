import React, { useState, useEffect } from 'react';
import {
  User,
  Property,
  RentalRequest,
  RentalAgreement,
  RentPayment,
  MaintenanceRequest,
  PropertyReview,
  AppNotification,
  GovernmentReport
} from './types';
import { storage } from './services/storageService';
import { Navbar } from './components/Navbar';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { RentalRequestModal } from './components/RentalRequestModal';
import { DigitalAgreementModal } from './components/DigitalAgreementModal';
import { PaymentModal } from './components/PaymentModal';
import { MaintenanceModal } from './components/MaintenanceModal';
import { ReviewModal } from './components/ReviewModal';
import { AddEditPropertyModal } from './components/AddEditPropertyModal';
import { AuthModal } from './components/AuthModal';
import { TenantDashboard } from './components/TenantDashboard';
import { OwnerDashboard } from './components/OwnerDashboard';
import { AdminVerificationView } from './components/AdminVerificationView';
import { AdminUsersView } from './components/AdminUsersView';
import { AdminGovernmentReportModal } from './components/AdminGovernmentReportModal';
import { ChatView } from './components/ChatView';
import {
  Search,
  ShieldCheck,
  FileText,
  CreditCard,
  Wrench,
  Sparkles,
  ArrowRight,
  RotateCcw,
  MessageSquare,
  Lock
} from 'lucide-react';

export default function App() {
  // Application Data States
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [properties, setProperties] = useState<Property[]>(() => storage.getProperties());
  const [requests, setRequests] = useState<RentalRequest[]>(() => storage.getRentalRequests());
  const [agreements, setAgreements] = useState<RentalAgreement[]>(() => storage.getAgreements());
  const [payments, setPayments] = useState<RentPayment[]>(() => storage.getPayments());
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>(() => storage.getMaintenanceRequests());
  const [reviews, setReviews] = useState<PropertyReview[]>(() => storage.getReviews());
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    currentUser ? storage.getNotifications(currentUser.id) : []
  );
  const [govReports, setGovReports] = useState<GovernmentReport[]>(() => storage.getGovernmentReports());

  // Active Navigation Tab: 'properties' | 'tenant' | 'owner' | 'admin' | 'chat' | 'users'
  const [activeTab, setActiveTab] = useState<'properties' | 'tenant' | 'owner' | 'admin' | 'chat' | 'users'>('properties');

  // Search & Filters State (all in Indian Rupees ₹)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterBedrooms, setFilterBedrooms] = useState('ALL');
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(100000);
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);

  // Modal Triggers
  const [selectedPropertyForDetails, setSelectedPropertyForDetails] = useState<Property | null>(null);
  const [selectedPropertyForRequest, setSelectedPropertyForRequest] = useState<Property | null>(null);
  const [selectedPropertyForReview, setSelectedPropertyForReview] = useState<Property | null>(null);
  const [selectedAgreement, setSelectedAgreement] = useState<RentalAgreement | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<RentPayment | null>(null);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedMaintenanceToEdit, setSelectedMaintenanceToEdit] = useState<MaintenanceRequest | null>(null);
  const [isAddEditPropertyOpen, setIsAddEditPropertyOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Government Fraud Report Modal
  const [isGovReportModalOpen, setIsGovReportModalOpen] = useState(false);
  const [propertyForGovReport, setPropertyForGovReport] = useState<Property | null>(null);

  // In-App Chat target conversation
  const [chatInitialConvId, setChatInitialConvId] = useState<string | null>(null);

  // Toast banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const reloadData = () => {
    setProperties(storage.getProperties());
    setRequests(storage.getRentalRequests());
    setAgreements(storage.getAgreements());
    setPayments(storage.getPayments());
    setMaintenance(storage.getMaintenanceRequests());
    setReviews(storage.getReviews());
    setGovReports(storage.getGovernmentReports());
    if (currentUser) {
      setNotifications(storage.getNotifications(currentUser.id));
    } else {
      setNotifications([]);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setNotifications(storage.getNotifications(currentUser.id));
    } else {
      setNotifications([]);
    }
  }, [currentUser]);

  // Handler: Explicit Sign Out (required to switch profiles)
  const handleSignOut = () => {
    storage.signOut();
    setCurrentUser(null);
    setActiveTab('properties');
    showToast('Signed out of SafeNest. Please sign in to access another profile.');
  };

  // Handler: Tab Navigation with Role-Protection
  const handleSelectTab = (tab: 'properties' | 'tenant' | 'owner' | 'admin' | 'chat' | 'users') => {
    if (tab === 'properties') {
      setActiveTab('properties');
      return;
    }

    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('Please sign in to access this section.');
      return;
    }

    // Role-based restrictions
    if (tab === 'tenant' && currentUser.role !== 'TENANT') {
      showToast('Tenant Hub is exclusively available to tenant accounts.');
      return;
    }
    if (tab === 'owner' && currentUser.role !== 'OWNER') {
      showToast('Owner Portal is exclusively available to verified property owners.');
      return;
    }
    if ((tab === 'admin' || tab === 'users') && currentUser.role !== 'ADMIN') {
      showToast('Restricted to authorized SafeNest compliance administrators.');
      return;
    }

    setActiveTab(tab);
  };

  // Handler: Start Chat with Landlord without exchanging private phone numbers
  const handleStartChatWithLandlord = (property: Property) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('Please sign in to chat with the property owner.');
      return;
    }
    const conv = storage.getOrCreateConversation(property.id, currentUser.id, property.ownerId);
    setChatInitialConvId(conv.id);
    setActiveTab('chat');
    showToast(`Private SafeNest chat opened with ${property.ownerName} (${property.title}). Phone numbers masked.`);
  };

  // Handler: Submit Rental Request
  const handleRentalRequestSubmit = (data: {
    moveInDate: string;
    durationMonths: number;
    occupants: number;
    message: string;
  }) => {
    if (!selectedPropertyForRequest || !currentUser) return;
    storage.submitRentalRequest({
      propertyId: selectedPropertyForRequest.id,
      propertyTitle: selectedPropertyForRequest.title,
      propertyAddress: selectedPropertyForRequest.address,
      tenantId: currentUser.id,
      tenantName: currentUser.name,
      tenantEmail: currentUser.email,
      tenantPhone: currentUser.phone,
      ownerId: selectedPropertyForRequest.ownerId,
      monthlyRent: selectedPropertyForRequest.monthlyRent,
      securityDeposit: selectedPropertyForRequest.securityDeposit,
      ...data
    });
    setSelectedPropertyForRequest(null);
    reloadData();
    showToast('Rental application submitted to property owner!');
    setActiveTab('tenant');
  };

  // Handler: Owner approves rental request
  const handleApproveRequest = (requestId: string) => {
    storage.updateRentalRequestStatus(requestId, 'APPROVED');
    reloadData();
    showToast('Application approved! Digital lease agreement generated automatically.');
  };

  // Handler: Owner rejects rental request
  const handleRejectRequest = (requestId: string) => {
    storage.updateRentalRequestStatus(requestId, 'REJECTED');
    reloadData();
    showToast('Application declined.');
  };

  // Handler: Sign agreement
  const handleSignAgreement = (agreementId: string, signature: string) => {
    storage.signAgreementByTenant(agreementId, signature);
    setSelectedAgreement(null);
    reloadData();
    showToast('Lease signed successfully! First month rent schedule created in escrow.');
  };

  // Handler: Record rent payment
  const handlePaymentSuccess = (paymentId: string, method: 'CARD' | 'UPI' | 'NET_BANKING') => {
    storage.recordPayment(paymentId, method);
    reloadData();
    showToast('Payment settled in escrow! GST invoice receipt issued.');
  };

  // Handler: Submit Maintenance Ticket
  const handleMaintenanceSubmit = (data: any) => {
    if (!currentUser) return;
    storage.submitMaintenanceRequest({
      tenantId: currentUser.id,
      tenantName: currentUser.name,
      ...data
    });
    reloadData();
    showToast('Maintenance ticket submitted to owner.');
  };

  // Handler: Owner updates maintenance status
  const handleMaintenanceUpdateStatus = (id: string, status: any, note?: string) => {
    storage.updateMaintenanceStatus(id, status, note);
    reloadData();
    showToast(`Maintenance ticket updated to ${status}.`);
  };

  // Handler: Property Save (Add or Edit)
  const handlePropertySave = (data: any) => {
    if (propertyToEdit) {
      storage.updateProperty(propertyToEdit.id, data);
      showToast('Property listing updated.');
    } else {
      storage.addProperty(data);
      showToast('Property submitted! Pending title deed audit.');
    }
    setPropertyToEdit(null);
    reloadData();
  };

  // Handler: Toggle Property Availability
  const handleToggleAvailability = (prop: Property) => {
    storage.updateProperty(prop.id, { isAvailable: !prop.isAvailable });
    reloadData();
    showToast(`Marked as ${!prop.isAvailable ? 'Available' : 'Leased'}.`);
  };

  // Handler: Delete Property
  const handleDeleteProperty = (id: string) => {
    if (window.confirm('Delete this listing?')) {
      storage.deleteProperty(id);
      reloadData();
      showToast('Listing removed.');
    }
  };

  // Handler: Admin verifies property
  const handleVerifyProperty = (propertyId: string, status: 'VERIFIED' | 'REJECTED') => {
    storage.verifyProperty(propertyId, status);
    reloadData();
    showToast(`Property marked as ${status}.`);
  };

  // Handler: Submit Review
  const handleReviewSubmit = (reviewData: any) => {
    storage.addReview(reviewData);
    reloadData();
    showToast('Thank you! Your verified resident review has been published.');
  };

  // Handler: Admin Lodges Government Fraud Report
  const handleGovReportSubmit = (data: any) => {
    const rep = storage.submitGovernmentReport(data);
    reloadData();
    showToast(`Official Government Report dispatched! Reference: ${rep.reportNumber}`);
  };

  // Handler: Reset demo data
  const handleResetDemo = () => {
    if (window.confirm('Reset all SafeNest data back to initial seeds?')) {
      storage.resetToDemo();
      window.location.reload();
    }
  };

  // Filter logic
  const filteredProperties = properties.filter(prop => {
    if (filterVerifiedOnly && prop.verificationStatus !== 'VERIFIED') return false;
    if (filterAvailableOnly && !prop.isAvailable) return false;
    if (filterType !== 'ALL' && prop.propertyType !== filterType) return false;
    if (filterBedrooms !== 'ALL') {
      const beds = Number(filterBedrooms);
      if (beds >= 3 ? prop.bedrooms < 3 : prop.bedrooms !== beds) return false;
    }
    if (prop.monthlyRent > filterMaxPrice) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        prop.title.toLowerCase().includes(q) ||
        prop.city.toLowerCase().includes(q) ||
        prop.address.toLowerCase().includes(q) ||
        prop.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles size={15} className="text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar with Strict Role-Isolation and Explicit Sign Out */}
      <Navbar
        currentUser={currentUser}
        onSelectTab={handleSelectTab}
        activeTab={activeTab}
        notifications={notifications}
        onMarkNotificationRead={(id) => {
          storage.markNotificationRead(id);
          reloadData();
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: EXPLORE PROPERTIES */}
        {activeTab === 'properties' && (
          <div className="space-y-10">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-medium">
                  <ShieldCheck size={14} />
                  <span>Verified Landlord Deeds & Transparent Escrow in Indian Rupees (₹)</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight font-display">
                  Verified Homes. Transparent Leases. Zero Disputes.
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  SafeNest connects prospective tenants with title-verified property owners across top cities like Bengaluru, Mumbai, Pune, and Gurugram. Sign digital agreements, chat directly without sharing personal phone numbers, and settle rent in ₹ escrow.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('search-filters');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shadow-lg flex items-center gap-2"
                  >
                    <span>Browse Available Homes</span>
                    <ArrowRight size={14} />
                  </button>
                  {currentUser && (
                    <button
                      onClick={() => {
                        if (currentUser.role === 'TENANT') setActiveTab('tenant');
                        else if (currentUser.role === 'OWNER') setActiveTab('owner');
                        else setActiveTab('admin');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/10 transition-colors"
                    >
                      <span>Open My {currentUser.role === 'TENANT' ? 'Tenant Hub' : currentUser.role === 'OWNER' ? 'Owner Portal' : 'Admin Console'}</span>
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Search & Filter Bar */}
            <section id="search-filters" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                {/* Search query input */}
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by city (e.g. Bengaluru, Mumbai, Pune), address, or neighborhood..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Property Type Filter */}
                <div className="flex items-center gap-2">
                  <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="ALL">All Property Types</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Studio">Studio</option>
                    <option value="Villa">Villa / House</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>

                  {/* Bedrooms */}
                  <select
                    value={filterBedrooms}
                    onChange={e => setFilterBedrooms(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="ALL">All Bedrooms</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3+ Bedrooms</option>
                  </select>
                </div>

                {/* Max Price Slider in Indian Rupees (₹) */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <span className="text-slate-500 font-medium whitespace-nowrap">Max Rent:</span>
                  <input
                    type="range"
                    min={10000}
                    max={150000}
                    step={2500}
                    value={filterMaxPrice}
                    onChange={e => setFilterMaxPrice(Number(e.target.value))}
                    className="w-24 sm:w-28 accent-teal-600"
                  />
                  <span className="font-mono font-bold text-slate-900 whitespace-nowrap">
                    ₹{filterMaxPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Toggles Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={filterVerifiedOnly}
                      onChange={e => setFilterVerifiedOnly(e.target.checked)}
                      className="rounded text-teal-600 accent-teal-600"
                    />
                    <span>Verified Title Only</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={filterAvailableOnly}
                      onChange={e => setFilterAvailableOnly(e.target.checked)}
                      className="rounded text-teal-600 accent-teal-600"
                    />
                    <span>Available to Lease Now</span>
                  </label>
                </div>

                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span>Showing <strong className="text-slate-900 font-mono">{filteredProperties.length}</strong> matching homes</span>
                  {(searchQuery || filterType !== 'ALL' || filterBedrooms !== 'ALL' || filterMaxPrice !== 100000 || filterVerifiedOnly || filterAvailableOnly) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterType('ALL');
                        setFilterBedrooms('ALL');
                        setFilterMaxPrice(100000);
                        setFilterVerifiedOnly(false);
                        setFilterAvailableOnly(false);
                      }}
                      className="text-teal-700 font-semibold hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Properties Grid */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Featured Verified Listings</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Every property undergoes title deed audit and physical lease terms verification. Prices listed in Indian Rupees (₹).
                  </p>
                </div>
              </div>

              {filteredProperties.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                  <p className="text-sm font-semibold text-slate-800">No properties matched your current filters.</p>
                  <p className="text-xs text-slate-500">Try widening your price range or clearing search criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterType('ALL');
                      setFilterBedrooms('ALL');
                      setFilterMaxPrice(100000);
                      setFilterVerifiedOnly(false);
                      setFilterAvailableOnly(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map(property => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onSelect={prop => setSelectedPropertyForDetails(prop)}
                      onRequest={prop => {
                        if (!currentUser) {
                          setIsAuthModalOpen(true);
                          showToast('Please sign in to apply for a lease.');
                          return;
                        }
                        if (currentUser.role !== 'TENANT') {
                          showToast('Only tenant accounts can submit rental applications. Please sign out and sign in as a tenant.');
                          return;
                        }
                        setSelectedPropertyForRequest(prop);
                      }}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* SafeNest Value Propositions Section */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 py-6 border-t border-slate-200">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Deed-Verified Listings</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every property title deed is audited against state Sub-Registrar records before listing publication.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <MessageSquare size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Private SafeNest Chat</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Built-in chatbox between owners and tenants ensures full privacy without exchanging private phone numbers.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <CreditCard size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">INR (₹) Escrow Ledger</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Protected monthly rent payment processing via UPI, Cards, and Net Banking with instant receipts and deposit custody.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Wrench size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Tracked Maintenance</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Log electrical, plumbing, or appliance tickets directly with SLA commitments and work order updates.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: TENANT HUB (Restricted to TENANT role) */}
        {activeTab === 'tenant' && currentUser?.role === 'TENANT' && (
          <TenantDashboard
            currentUser={currentUser}
            agreements={agreements}
            requests={requests}
            payments={payments}
            maintenance={maintenance}
            properties={properties}
            onViewAgreement={agr => setSelectedAgreement(agr)}
            onPayRent={pay => setSelectedPayment(pay)}
            onNewMaintenance={() => {
              setSelectedMaintenanceToEdit(null);
              setIsMaintenanceModalOpen(true);
            }}
            onExploreProperties={() => setActiveTab('properties')}
            onOpenChat={() => setActiveTab('chat')}
          />
        )}

        {/* TAB 3: OWNER PORTAL (Restricted to OWNER role) */}
        {activeTab === 'owner' && currentUser?.role === 'OWNER' && (
          <OwnerDashboard
            currentUser={currentUser}
            properties={properties}
            requests={requests}
            agreements={agreements}
            maintenance={maintenance}
            payments={payments}
            onAddNewProperty={() => {
              setPropertyToEdit(null);
              setIsAddEditPropertyOpen(true);
            }}
            onEditProperty={prop => {
              setPropertyToEdit(prop);
              setIsAddEditPropertyOpen(true);
            }}
            onDeleteProperty={handleDeleteProperty}
            onToggleAvailability={handleToggleAvailability}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onViewAgreement={agr => setSelectedAgreement(agr)}
            onManageMaintenance={m => {
              setSelectedMaintenanceToEdit(m);
              setIsMaintenanceModalOpen(true);
            }}
            onOpenChat={() => setActiveTab('chat')}
          />
        )}

        {/* TAB 4: ADMIN VERIFICATION & SPAM REGISTRY (Restricted to ADMIN role) */}
        {activeTab === 'admin' && currentUser?.role === 'ADMIN' && (
          <AdminVerificationView
            currentUser={currentUser}
            properties={properties}
            govReports={govReports}
            onVerify={handleVerifyProperty}
            onViewProperty={p => setSelectedPropertyForDetails(p)}
            onOpenGovReport={prop => {
              setPropertyForGovReport(prop || null);
              setIsGovReportModalOpen(true);
            }}
          />
        )}

        {/* TAB 5: ADMIN USER DIRECTORY (READ ONLY VIEW MODE) */}
        {activeTab === 'users' && currentUser?.role === 'ADMIN' && (
          <AdminUsersView
            users={storage.getUsers()}
            properties={properties}
            agreements={agreements}
            onReportSpamUser={() => {
              setPropertyForGovReport(null);
              setIsGovReportModalOpen(true);
            }}
          />
        )}

        {/* TAB 6: IN-APP CHAT (Restricted to logged-in Tenant or Owner) */}
        {activeTab === 'chat' && currentUser && (
          <ChatView
            currentUser={currentUser}
            initialConversationId={chatInitialConvId}
            onOpenProperty={propId => {
              const p = properties.find(prop => prop.id === propId);
              if (p) setSelectedPropertyForDetails(p);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded bg-teal-600 text-white font-bold text-xs">
              <ShieldCheck size={14} />
            </span>
            <span className="font-bold text-slate-800">SafeNest</span>
            <span>— Verified Rental & Tenant Management System (All amounts in ₹ INR)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetDemo}
              className="hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>Reset Demo Seeds</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      {selectedPropertyForDetails && (
        <PropertyDetailsModal
          property={selectedPropertyForDetails}
          reviews={reviews.filter(r => r.propertyId === selectedPropertyForDetails.id)}
          onClose={() => setSelectedPropertyForDetails(null)}
          onApply={prop => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
              showToast('Please sign in to apply for a lease.');
              return;
            }
            if (currentUser.role !== 'TENANT') {
              showToast('Only tenant accounts can submit rental applications. Please sign out and sign in as a tenant.');
              return;
            }
            setSelectedPropertyForRequest(prop);
          }}
          onAddReview={prop => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
              showToast('Please sign in to write a review.');
              return;
            }
            setSelectedPropertyForReview(prop);
          }}
          onChatWithOwner={prop => handleStartChatWithLandlord(prop)}
        />
      )}

      {selectedPropertyForRequest && currentUser && (
        <RentalRequestModal
          property={selectedPropertyForRequest}
          currentUser={currentUser}
          onClose={() => setSelectedPropertyForRequest(null)}
          onSubmit={handleRentalRequestSubmit}
        />
      )}

      {selectedAgreement && currentUser && (
        <DigitalAgreementModal
          agreement={selectedAgreement}
          currentUser={currentUser}
          onClose={() => setSelectedAgreement(null)}
          onSign={handleSignAgreement}
        />
      )}

      {selectedPayment && (
        <PaymentModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {isMaintenanceModalOpen && currentUser && (
        <MaintenanceModal
          currentUser={currentUser}
          activeProperties={properties}
          existingRequest={selectedMaintenanceToEdit}
          onClose={() => {
            setIsMaintenanceModalOpen(false);
            setSelectedMaintenanceToEdit(null);
          }}
          onSubmitNew={handleMaintenanceSubmit}
          onUpdateStatus={handleMaintenanceUpdateStatus}
        />
      )}

      {selectedPropertyForReview && currentUser && (
        <ReviewModal
          property={selectedPropertyForReview}
          currentUser={currentUser}
          onClose={() => setSelectedPropertyForReview(null)}
          onSubmit={handleReviewSubmit}
        />
      )}

      {isAddEditPropertyOpen && currentUser && (
        <AddEditPropertyModal
          currentUser={currentUser}
          propertyToEdit={propertyToEdit}
          onClose={() => {
            setIsAddEditPropertyOpen(false);
            setPropertyToEdit(null);
          }}
          onSave={handlePropertySave}
        />
      )}

      {/* Admin Government Fraud & Spam Reporting Modal */}
      {isGovReportModalOpen && currentUser && (
        <AdminGovernmentReportModal
          adminUser={currentUser}
          property={propertyForGovReport}
          onClose={() => {
            setIsGovReportModalOpen(false);
            setPropertyForGovReport(null);
          }}
          onSubmit={handleGovReportSubmit}
        />
      )}

      {/* Auth Modal: Sign In / Register with Confirm Password & Security Question */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={user => {
            setCurrentUser(user);
            showToast(`Signed in successfully as ${user.name} (${user.role})`);
            if (user.role === 'TENANT') setActiveTab('tenant');
            else if (user.role === 'OWNER') setActiveTab('owner');
            else if (user.role === 'ADMIN') setActiveTab('admin');
          }}
        />
      )}
    </div>
  );
}
