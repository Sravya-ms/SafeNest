export type UserRole = 'TENANT' | 'OWNER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  securityQuestion?: string;
  securityAnswer?: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  isVerified: boolean;
  joinedDate: string;
  isSpamFlagged?: boolean;
}

export type PropertyType = 'Apartment' | 'Villa' | 'Studio' | 'Townhouse' | 'Penthouse';
export type FurnishingStatus = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'REJECTED';

export interface Property {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  monthlyRent: number;
  securityDeposit: number;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  furnishing: FurnishingStatus;
  availableRooms: number;
  totalRooms: number;
  isAvailable: boolean;
  verificationStatus: VerificationStatus;
  verificationDocName?: string;
  images: string[];
  amenities: string[];
  rules: string[];
  createdAt: string;
  averageRating: number;
  reviewCount: number;
  isSpamReported?: boolean;
  spamReportReason?: string;
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface RentalRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  ownerId: string;
  moveInDate: string;
  durationMonths: number;
  occupants: number;
  message: string;
  status: RequestStatus;
  monthlyRent: number;
  securityDeposit: number;
  submittedAt: string;
  updatedAt: string;
}

export type AgreementStatus = 'DRAFT' | 'AWAITING_TENANT' | 'AWAITING_OWNER' | 'ACTIVE' | 'TERMINATED';

export interface RentalAgreement {
  id: string;
  agreementNumber: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  ownerId: string;
  ownerName: string;
  ownerSignature?: string;
  ownerSignedAt?: string;
  tenantId: string;
  tenantName: string;
  tenantSignature?: string;
  tenantSignedAt?: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  paymentDueDay: number;
  status: AgreementStatus;
  terms: string[];
  createdAt: string;
}

export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';
export type PaymentMethod = 'CARD' | 'UPI' | 'NET_BANKING' | 'CASH';

export interface RentPayment {
  id: string;
  agreementId: string;
  propertyId: string;
  propertyTitle: string;
  tenantId: string;
  tenantName: string;
  ownerId: string;
  amount: number;
  billingMonth: string; // e.g. "October 2026"
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionRef?: string;
  receiptNumber?: string;
}

export type MaintenanceUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
export type MaintenanceStatus = 'SUBMITTED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
export type MaintenanceCategory = 'Plumbing' | 'Electrical' | 'Appliance' | 'HVAC' | 'Structural' | 'Pest Control' | 'Other';

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantId: string;
  tenantName: string;
  ownerId: string;
  category: MaintenanceCategory;
  title: string;
  description: string;
  urgency: MaintenanceUrgency;
  status: MaintenanceStatus;
  resolutionNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyReview {
  id: string;
  propertyId: string;
  tenantId: string;
  tenantName: string;
  rating: number; // 1 to 5
  cleanlinessRating: number;
  communicationRating: number;
  valueRating: number;
  comment: string;
  createdAt: string;
  isVerifiedStay: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: 'REQUEST' | 'AGREEMENT' | 'RENT' | 'MAINTENANCE' | 'SYSTEM' | 'CHAT';
  isRead: boolean;
  createdAt: string;
  linkTab?: string;
}

// In-App Chat Models (Tenant <-> Owner without sharing private numbers)
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isSystemNote?: boolean;
}

export interface ChatConversation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantId: string;
  tenantName: string;
  ownerId: string;
  ownerName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCountTenant: number;
  unreadCountOwner: number;
}

// Admin Government Reporting for Spams / Scams
export interface GovernmentReport {
  id: string;
  reportNumber: string;
  targetType: 'PROPERTY_SCAM' | 'FAKE_LANDLORD' | 'PHISHING_SPAM' | 'DEED_FORGERY';
  targetId: string;
  targetTitle: string;
  offenderName: string;
  offenderEmail: string;
  description: string;
  evidenceNotes: string;
  reportedByAdminId: string;
  reportedByAdminName: string;
  regulatoryBody: 'RERA_CYBER_CRIME_CELL' | 'NATIONAL_CONSUMER_HELPLINE' | 'HOUSING_MINISTRY_FRAUD_MONITOR';
  status: 'SUBMITTED_TO_PORTAL' | 'UNDER_POLICE_INQUIRY' | 'ACTION_TAKEN';
  acknowledgementToken: string;
  createdAt: string;
}
