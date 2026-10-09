import {
  User,
  Property,
  RentalRequest,
  RentalAgreement,
  RentPayment,
  MaintenanceRequest,
  PropertyReview,
  AppNotification,
  ChatConversation,
  ChatMessage,
  GovernmentReport
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_tenant_1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    password: 'password123',
    securityQuestion: 'What was the name of your first school?',
    securityAnswer: "St. Xavier's High School",
    role: 'TENANT',
    phone: '+91 98765 43210',
    isVerified: true,
    joinedDate: 'Jan 2026'
  },
  {
    id: 'user_owner_1',
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    password: 'password123',
    securityQuestion: "What was your first pet's name?",
    securityAnswer: 'Bruno',
    role: 'OWNER',
    phone: '+91 98123 45678',
    isVerified: true,
    joinedDate: 'Nov 2025'
  },
  {
    id: 'user_owner_2',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    password: 'password123',
    securityQuestion: "What is your mother's maiden name?",
    securityAnswer: 'Sharma',
    role: 'OWNER',
    phone: '+91 97234 56789',
    isVerified: true,
    joinedDate: 'Feb 2026'
  },
  {
    id: 'user_admin_1',
    name: 'David Miller',
    email: 'admin@safenest.org',
    password: 'password123',
    securityQuestion: 'What was the name of your first school?',
    securityAnswer: 'Delhi Public School',
    role: 'ADMIN',
    phone: '+91 99000 11223',
    isVerified: true,
    joinedDate: 'Oct 2025'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop_1',
    ownerId: 'user_owner_1',
    ownerName: 'Marcus Vance',
    ownerPhone: '+91 98123 45678',
    title: 'The Horizon: High-Rise 2BHK with Skyline Panorama',
    description: 'Corner unit residence featuring expansive floor-to-ceiling double-glazed windows, European engineered oak flooring, designer quartz kitchen island with stainless appliances, and in-unit washer/dryer. Dedicated reserved underground parking and concierge included.',
    propertyType: 'Apartment',
    address: '100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    zipCode: '560038',
    monthlyRent: 28500,
    securityDeposit: 57000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1180,
    furnishing: 'Furnished',
    availableRooms: 2,
    totalRooms: 2,
    isAvailable: true,
    verificationStatus: 'VERIFIED',
    verificationDocName: 'Deed_Indiranagar_Title_2025.pdf',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Central AC', 'High-Speed Fiber', 'Reserved Parking', 'Fitness Center', 'EV Charging', '24/7 Concierge', 'Balcony'],
    rules: ['No indoor smoking', 'Small pets allowed with deposit', 'Quiet hours 10 PM - 7 AM', 'No subleasing'],
    createdAt: '2026-08-10',
    averageRating: 4.9,
    reviewCount: 14
  },
  {
    id: 'prop_2',
    ownerId: 'user_owner_1',
    ownerName: 'Marcus Vance',
    ownerPhone: '+91 98123 45678',
    title: 'Oakridge Terrace: Modern Minimalist Studio Loft',
    description: 'Architect-designed industrial loft space with 14-foot exposed concrete ceilings, polished matte screed floors, custom walnut cabinetry, and private south-facing sun terrace. Located within 4 minutes walking distance from metro station.',
    propertyType: 'Studio',
    address: 'Sector 4, HSR Layout',
    city: 'Bengaluru',
    state: 'Karnataka',
    zipCode: '560102',
    monthlyRent: 18500,
    securityDeposit: 37000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 720,
    furnishing: 'Semi-Furnished',
    availableRooms: 1,
    totalRooms: 1,
    isAvailable: true,
    verificationStatus: 'VERIFIED',
    verificationDocName: 'Gov_Registration_Doc_KA560102.pdf',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Central Heating', 'Private Terrace', 'Dishwasher', 'Bike Storage', 'Keyless Smart Lock'],
    rules: ['No pets', 'No smoking', 'Max 2 occupants'],
    createdAt: '2026-08-20',
    averageRating: 4.8,
    reviewCount: 9
  },
  {
    id: 'prop_3',
    ownerId: 'user_owner_2',
    ownerName: 'Elena Rostova',
    ownerPhone: '+91 97234 56789',
    title: 'Cascadia Green Villa: 3BHK Family Residence',
    description: 'Serene standalone townhouse with private landscaped backyard patio, attached two-car garage, primary suite with soaking tub, solar roof panels, and energy-efficient heat pump. Situated in peaceful gated enclave.',
    propertyType: 'Villa',
    address: 'Lane 7, Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    zipCode: '411001',
    monthlyRent: 42000,
    securityDeposit: 84000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 2150,
    furnishing: 'Unfurnished',
    availableRooms: 3,
    totalRooms: 3,
    isAvailable: true,
    verificationStatus: 'VERIFIED',
    verificationDocName: 'Property_Tax_Assessment_Elena.pdf',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Private Fenced Yard', '2-Car Garage', 'Solar System', 'Washer & Dryer', 'Central AC', 'Storage Shed'],
    rules: ['Pets welcome', 'Tenant maintains lawn', 'Long-term leases preferred (12+ mo)'],
    createdAt: '2026-09-01',
    averageRating: 5.0,
    reviewCount: 6
  },
  {
    id: 'prop_4',
    ownerId: 'user_owner_2',
    ownerName: 'Elena Rostova',
    ownerPhone: '+91 97234 56789',
    title: 'Bandra West Sea-Breeze 1BHK Flat',
    description: 'Chic urban sanctuary positioned at the epicenter of dining and cultural venues. Features smart thermostat, acoustic double-pane acoustic glass, custom closet storage, and rooftop terrace with sea view.',
    propertyType: 'Apartment',
    address: 'Pali Hill, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400050',
    monthlyRent: 38000,
    securityDeposit: 76000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 680,
    furnishing: 'Furnished',
    availableRooms: 1,
    totalRooms: 1,
    isAvailable: true,
    verificationStatus: 'VERIFIED',
    verificationDocName: 'Elena_Title_Bandra_2025.pdf',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502005229762-ae1b466320f2?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Rooftop BBQ Lounge', 'Package Lockers', 'Smart Thermostat', 'Elevator', 'Pet Wash Station'],
    rules: ['Cats allowed', 'No smoking', 'Quiet hours after 10 PM'],
    createdAt: '2026-09-12',
    averageRating: 4.7,
    reviewCount: 8
  },
  {
    id: 'prop_5',
    ownerId: 'user_owner_1',
    ownerName: 'Marcus Vance',
    ownerPhone: '+91 98123 45678',
    title: 'Golf Course Road Luxury Penthouse with Deck',
    description: 'Prestigious top-floor residence offering panoramic city and golf course views. Italian marble countertops, German modular fittings, custom motorized blinds, and primary suite with radiant Jacuzzi.',
    propertyType: 'Penthouse',
    address: 'DLF Phase 5, Golf Course Road',
    city: 'Gurugram',
    state: 'Haryana',
    zipCode: '122002',
    monthlyRent: 75000,
    securityDeposit: 150000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 2400,
    furnishing: 'Furnished',
    availableRooms: 3,
    totalRooms: 3,
    isAvailable: false,
    verificationStatus: 'VERIFIED',
    verificationDocName: 'Vance_Waterfront_Title_Deed.pdf',
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Private Elevator Access', 'Wine Cellar', '2 Reserved Parking Slots', 'Gas Fireplace', '24/7 Security'],
    rules: ['No pets', 'No smoking', 'Strict noise regulations'],
    createdAt: '2026-07-15',
    averageRating: 5.0,
    reviewCount: 5
  },
  {
    id: 'prop_6',
    ownerId: 'user_owner_2',
    ownerName: 'Elena Rostova',
    ownerPhone: '+91 97234 56789',
    title: 'Financial District Gachibowli 2BHK Apartment',
    description: 'Garden-level contemporary flat directly adjacent to tech parks and botanical garden. Walk to IT offices, supermarkets, and metro. Fully updated kitchen with granite countertops.',
    propertyType: 'Apartment',
    address: 'ISB Road, Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    zipCode: '500032',
    monthlyRent: 26000,
    securityDeposit: 52000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1100,
    furnishing: 'Semi-Furnished',
    availableRooms: 2,
    totalRooms: 2,
    isAvailable: true,
    verificationStatus: 'PENDING',
    verificationDocName: 'Hyderabad_Purchase_Agreement_Pending.pdf',
    images: [
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Lake View', 'Swimming Pool', 'Assigned Parking', 'On-Site Management', 'Dishwasher'],
    rules: ['No smoking', 'Small pets allowed'],
    createdAt: '2026-09-28',
    averageRating: 4.6,
    reviewCount: 3
  }
];

export const INITIAL_REQUESTS: RentalRequest[] = [
  {
    id: 'req_1',
    propertyId: 'prop_1',
    propertyTitle: 'The Horizon: High-Rise 2BHK with Skyline Panorama',
    propertyAddress: '100 Feet Road, Indiranagar, Bengaluru',
    tenantId: 'user_tenant_1',
    tenantName: 'Sarah Chen',
    tenantEmail: 'sarah.chen@example.com',
    tenantPhone: '+91 98765 43210',
    ownerId: 'user_owner_1',
    moveInDate: '2026-11-01',
    durationMonths: 12,
    occupants: 1,
    message: 'Hello Marcus, I am a senior software engineer working in tech park. I can provide corporate employment verification and bank statement records immediately.',
    status: 'APPROVED',
    monthlyRent: 28500,
    securityDeposit: 57000,
    submittedAt: '2026-09-15',
    updatedAt: '2026-09-16'
  },
  {
    id: 'req_2',
    propertyId: 'prop_2',
    propertyTitle: 'Oakridge Terrace: Modern Minimalist Studio Loft',
    propertyAddress: 'Sector 4, HSR Layout, Bengaluru',
    tenantId: 'user_tenant_2_demo',
    tenantName: 'Jordan Taylor',
    tenantEmail: 'jordan.t@example.com',
    tenantPhone: '+91 98888 77766',
    ownerId: 'user_owner_1',
    moveInDate: '2026-11-15',
    durationMonths: 6,
    occupants: 2,
    message: 'We are looking for a clean, quiet 6-month lease while our permanent house undergoes renovation. Happy to pay 2 months deposit upfront.',
    status: 'PENDING',
    monthlyRent: 18500,
    securityDeposit: 37000,
    submittedAt: '2026-10-02',
    updatedAt: '2026-10-02'
  }
];

export const INITIAL_AGREEMENTS: RentalAgreement[] = [
  {
    id: 'agr_1',
    agreementNumber: 'SN-AGR-2026-8841',
    propertyId: 'prop_1',
    propertyTitle: 'The Horizon: High-Rise 2BHK with Skyline Panorama',
    propertyAddress: '100 Feet Road, Indiranagar, Bengaluru, KA 560038',
    ownerId: 'user_owner_1',
    ownerName: 'Marcus Vance',
    ownerSignature: 'Marcus Vance [Verified SafeNest Landlord]',
    ownerSignedAt: '2026-09-17 14:30 IST',
    tenantId: 'user_tenant_1',
    tenantName: 'Sarah Chen',
    tenantSignature: 'Sarah Chen [Verified Tenant ID: 9481]',
    tenantSignedAt: '2026-09-18 09:15 IST',
    startDate: '2026-11-01',
    endDate: '2027-10-31',
    monthlyRent: 28500,
    securityDeposit: 57000,
    paymentDueDay: 1,
    status: 'ACTIVE',
    terms: [
      'The Tenant agrees to pay the monthly rental of ₹28,500 on or before the 1st calendar day of each month.',
      'A refundable security deposit of ₹57,000 is held in audited escrow custody, returnable within 21 days following lease termination.',
      'Subletting, assignment, or unauthorized commercial operation without written lessor consent is strictly prohibited.',
      'Routine maintenance requests must be raised via the SafeNest tenant portal within 48 hours of detection.',
      'Both parties agree to conduct all communication exclusively through SafeNest verified chat to maintain privacy.'
    ],
    createdAt: '2026-09-16'
  }
];

export const INITIAL_PAYMENTS: RentPayment[] = [
  {
    id: 'pay_1',
    agreementId: 'agr_1',
    propertyId: 'prop_1',
    propertyTitle: 'The Horizon: High-Rise 2BHK with Skyline Panorama',
    tenantId: 'user_tenant_1',
    tenantName: 'Sarah Chen',
    ownerId: 'user_owner_1',
    amount: 28500,
    billingMonth: 'November 2026',
    dueDate: '2026-11-01',
    paidDate: '2026-10-05',
    status: 'PAID',
    paymentMethod: 'UPI',
    transactionRef: 'UPI-REF-88491024-HDFC',
    receiptNumber: 'RCP-SN-2026-0091'
  },
  {
    id: 'pay_2',
    agreementId: 'agr_1',
    propertyId: 'prop_1',
    propertyTitle: 'The Horizon: High-Rise 2BHK with Skyline Panorama',
    tenantId: 'user_tenant_1',
    tenantName: 'Sarah Chen',
    ownerId: 'user_owner_1',
    amount: 28500,
    billingMonth: 'December 2026',
    dueDate: '2026-12-01',
    status: 'PENDING'
  }
];

export const INITIAL_MAINTENANCE: MaintenanceRequest[] = [
  {
    id: 'maint_1',
    propertyId: 'prop_1',
    propertyTitle: 'The Horizon: High-Rise 2BHK with Skyline Panorama',
    tenantId: 'user_tenant_1',
    tenantName: 'Sarah Chen',
    ownerId: 'user_owner_1',
    category: 'HVAC',
    title: 'Smart Inverter AC sensor variance',
    description: 'The master bedroom AC digital temperature displays a 3-degree variance during afternoon cycles. Kindly send an authorized technician for filter check.',
    urgency: 'MEDIUM',
    status: 'IN_PROGRESS',
    resolutionNote: 'Technician booked for Thursday 11:00 AM inspection with apartment building supervisor.',
    createdAt: '2026-10-04 11:20',
    updatedAt: '2026-10-05 09:30'
  },
  {
    id: 'maint_2',
    propertyId: 'prop_1',
    propertyTitle: 'The Horizon: High-Rise 2BHK with Skyline Panorama',
    tenantId: 'user_tenant_1',
    tenantName: 'Sarah Chen',
    ownerId: 'user_owner_1',
    category: 'Plumbing',
    title: 'Kitchen faucet aerator slight drip',
    description: 'Noticed a slow drip when high pressure faucet is shut off rapidly.',
    urgency: 'LOW',
    status: 'RESOLVED',
    resolutionNote: 'Replaced rubber washer and tightened aerator housing. Inspected and verified leak-free.',
    createdAt: '2026-09-22 16:45',
    updatedAt: '2026-09-23 15:10'
  }
];

export const INITIAL_REVIEWS: PropertyReview[] = [
  {
    id: 'rev_1',
    propertyId: 'prop_1',
    tenantId: 'user_tenant_1',
    tenantName: 'Sarah Chen',
    rating: 5,
    cleanlinessRating: 5,
    communicationRating: 5,
    valueRating: 4.8,
    comment: 'Exceptional property! Marcus has been a prompt, professional landlord. The building amenities are meticulously maintained, sound isolation is outstanding, and in-app chat is so convenient without sharing personal mobile numbers.',
    createdAt: '2026-09-25',
    isVerifiedStay: true
  },
  {
    id: 'rev_2',
    propertyId: 'prop_1',
    tenantId: 'user_tenant_prior',
    tenantName: 'Alex Rivera',
    rating: 4.8,
    cleanlinessRating: 4.9,
    communicationRating: 4.8,
    valueRating: 4.7,
    comment: 'Lived here for 18 months before relocating. The views are unbelievable and maintenance tickets were always resolved in under 24 hours. Highly recommended.',
    createdAt: '2026-07-14',
    isVerifiedStay: true
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    userId: 'user_tenant_1',
    title: 'Rental Agreement Active',
    message: 'Your digital rental agreement for The Horizon (Indiranagar) has been fully countersigned and is now active.',
    category: 'AGREEMENT',
    isRead: false,
    createdAt: '2026-09-18 09:15',
    linkTab: 'tenant'
  },
  {
    id: 'notif_2',
    userId: 'user_tenant_1',
    title: 'Rent Payment Receipt Generated',
    message: 'Payment for November 2026 (₹28,500.00) was successfully processed. Receipt #RCP-SN-2026-0091 available.',
    category: 'RENT',
    isRead: false,
    createdAt: '2026-10-05 10:00',
    linkTab: 'tenant'
  },
  {
    id: 'notif_3',
    userId: 'user_owner_1',
    title: 'New Rental Application',
    message: 'Jordan Taylor submitted a rental application for Oakridge Terrace: Modern Minimalist Studio Loft.',
    category: 'REQUEST',
    isRead: false,
    createdAt: '2026-10-02 14:10',
    linkTab: 'owner'
  }
];

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv_1',
    propertyId: 'prop_1',
    propertyTitle: 'The Horizon: High-Rise 2BHK',
    tenantId: 'user_tenant_1',
    tenantName: 'Sarah Chen',
    ownerId: 'user_owner_1',
    ownerName: 'Marcus Vance',
    lastMessage: 'Technician is confirmed for 11:00 AM on Thursday for the AC inspection.',
    lastMessageTime: '10:45 AM',
    unreadCountTenant: 0,
    unreadCountOwner: 0
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    conversationId: 'conv_1',
    senderId: 'system',
    senderName: 'SafeNest Security',
    senderRole: 'ADMIN',
    text: '🔒 SafeNest Private Channel initialized. Personal phone numbers are masked for privacy and spam prevention.',
    timestamp: '2026-09-15 10:00',
    isSystemNote: true
  },
  {
    id: 'msg_2',
    conversationId: 'conv_1',
    senderId: 'user_tenant_1',
    senderName: 'Sarah Chen',
    senderRole: 'TENANT',
    text: 'Hi Marcus! Just wanted to check if 2-wheeler and car parking slots are side by side in the basement?',
    timestamp: '2026-09-15 10:05'
  },
  {
    id: 'msg_3',
    conversationId: 'conv_1',
    senderId: 'user_owner_1',
    senderName: 'Marcus Vance',
    senderRole: 'OWNER',
    text: 'Hello Sarah! Yes, slot #B2-14 has dedicated EV charging as well as space for a two-wheeler right next to the pillar.',
    timestamp: '2026-09-15 10:12'
  },
  {
    id: 'msg_4',
    conversationId: 'conv_1',
    senderId: 'user_tenant_1',
    senderName: 'Sarah Chen',
    senderRole: 'TENANT',
    text: 'That sounds perfect. I have reviewed the digital agreement draft and signed it via the portal.',
    timestamp: '2026-09-18 09:16'
  },
  {
    id: 'msg_5',
    conversationId: 'conv_1',
    senderId: 'user_owner_1',
    senderName: 'Marcus Vance',
    senderRole: 'OWNER',
    text: 'Technician is confirmed for 11:00 AM on Thursday for the AC inspection.',
    timestamp: '2026-10-05 10:45'
  }
];

export const INITIAL_GOV_REPORTS: GovernmentReport[] = [
  {
    id: 'gov_1',
    reportNumber: 'GOV-CYBER-2026-0941',
    targetType: 'PROPERTY_SCAM',
    targetId: 'fraud_listing_99',
    targetTitle: 'Suspicious 3BHK Penthouse at 80% Below Market Price',
    offenderName: 'Rohan Verma (Alias)',
    offenderEmail: 'scam.fakeowner99@tempmail.org',
    description: 'Suspicious listing demanding ₹50,000 security advance before property visit without verified title deed.',
    evidenceNotes: 'Forged stamp paper with invalid Sub-Registrar Office barcode detected during automated compliance check.',
    reportedByAdminId: 'user_admin_1',
    reportedByAdminName: 'David Miller',
    regulatoryBody: 'RERA_CYBER_CRIME_CELL',
    status: 'SUBMITTED_TO_PORTAL',
    acknowledgementToken: 'ACK-NCR-RERA-2026-448102',
    createdAt: '2026-10-01 16:30'
  }
];
