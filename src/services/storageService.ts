import {
  User,
  Property,
  RentalRequest,
  RentalAgreement,
  RentPayment,
  MaintenanceRequest,
  PropertyReview,
  AppNotification,
  UserRole,
  ChatConversation,
  ChatMessage,
  GovernmentReport
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROPERTIES,
  INITIAL_REQUESTS,
  INITIAL_AGREEMENTS,
  INITIAL_PAYMENTS,
  INITIAL_MAINTENANCE,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_GOV_REPORTS
} from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'safenest_users',
  CURRENT_USER: 'safenest_current_user',
  PROPERTIES: 'safenest_properties',
  REQUESTS: 'safenest_requests',
  AGREEMENTS: 'safenest_agreements',
  PAYMENTS: 'safenest_payments',
  MAINTENANCE: 'safenest_maintenance',
  REVIEWS: 'safenest_reviews',
  NOTIFICATIONS: 'safenest_notifications',
  CONVERSATIONS: 'safenest_conversations',
  MESSAGES: 'safenest_messages',
  GOV_REPORTS: 'safenest_gov_reports'
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    return JSON.parse(saved) as T;
  } catch (e) {
    console.error(`Error loading key ${key}:`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving key ${key}:`, e);
  }
}

class StorageService {
  getUsers(): User[] {
    return getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  saveUsers(users: User[]): void {
    setItem(STORAGE_KEYS.USERS, users);
  }

  getCurrentUser(): User | null {
    const users = this.getUsers();
    const stored = getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (stored && users.some(u => u.id === stored.id)) {
      // Return fresh user object from array
      return users.find(u => u.id === stored.id) || stored;
    }
    // Default to Sarah Chen if first visit
    if (stored === null) {
      return users[0];
    }
    return null;
  }

  setCurrentUser(user: User | null): void {
    if (user === null) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      setItem(STORAGE_KEYS.CURRENT_USER, user);
    }
  }

  loginWithCredentials(email: string, pass: string): User {
    const users = this.getUsers();
    const user = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      throw new Error('No registered account found with this email address.');
    }
    if (user.password && user.password !== pass) {
      throw new Error('Incorrect password. Please verify credentials or reset via security question.');
    }
    this.setCurrentUser(user);
    return user;
  }

  registerUser(
    name: string,
    email: string,
    pass: string,
    role: UserRole,
    phone: string,
    securityQuestion: string,
    securityAnswer: string
  ): User {
    const users = this.getUsers();
    const existing = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      throw new Error('An account is already registered with this email address.');
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email: email.trim().toLowerCase(),
      password: pass,
      securityQuestion,
      securityAnswer,
      role,
      phone,
      isVerified: true,
      joinedDate: 'Oct 2026'
    };

    const updated = [...users, newUser];
    this.saveUsers(updated);
    this.setCurrentUser(newUser);
    return newUser;
  }

  recoverPassword(email: string, securityAnswer: string, newPass: string): User {
    const users = this.getUsers();
    const user = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      throw new Error('No registered account found with this email.');
    }
    if (!user.securityAnswer || user.securityAnswer.trim().toLowerCase() !== securityAnswer.trim().toLowerCase()) {
      throw new Error('Security question answer does not match our records.');
    }

    user.password = newPass;
    this.saveUsers([...users]);
    this.setCurrentUser(user);
    return user;
  }

  signOut(): void {
    this.setCurrentUser(null);
  }

  getProperties(): Property[] {
    return getItem<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
  }

  getPropertyById(id: string): Property | undefined {
    return this.getProperties().find(p => p.id === id);
  }

  saveProperties(properties: Property[]): void {
    setItem(STORAGE_KEYS.PROPERTIES, properties);
  }

  addProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'averageRating' | 'reviewCount'>): Property {
    const properties = this.getProperties();
    const newProp: Property = {
      ...propertyData,
      id: `prop_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      averageRating: 0,
      reviewCount: 0
    };
    this.saveProperties([newProp, ...properties]);

    this.addNotification({
      userId: 'user_admin_1',
      title: 'New Property Listing Pending Verification',
      message: `${newProp.ownerName} submitted "${newProp.title}" for verification review.`,
      category: 'SYSTEM',
      linkTab: 'admin'
    });

    return newProp;
  }

  updateProperty(id: string, updates: Partial<Property>): Property {
    const properties = this.getProperties();
    const index = properties.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Property not found');
    const updated = { ...properties[index], ...updates };
    properties[index] = updated;
    this.saveProperties([...properties]);
    return updated;
  }

  deleteProperty(id: string): void {
    const properties = this.getProperties().filter(p => p.id !== id);
    this.saveProperties(properties);
  }

  verifyProperty(id: string, status: 'VERIFIED' | 'REJECTED'): void {
    const prop = this.getPropertyById(id);
    if (!prop) return;
    this.updateProperty(id, { verificationStatus: status });

    this.addNotification({
      userId: prop.ownerId,
      title: `Property Verification: ${status}`,
      message: `Your listing "${prop.title}" has been reviewed by SafeNest audit and marked as ${status}.`,
      category: 'SYSTEM',
      linkTab: 'owner'
    });
  }

  flagPropertyAsSpam(propertyId: string, reason: string): void {
    this.updateProperty(propertyId, {
      isSpamReported: true,
      spamReportReason: reason,
      verificationStatus: 'REJECTED'
    });
  }

  getRentalRequests(): RentalRequest[] {
    return getItem<RentalRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  }

  submitRentalRequest(data: Omit<RentalRequest, 'id' | 'status' | 'submittedAt' | 'updatedAt'>): RentalRequest {
    const requests = this.getRentalRequests();
    const newReq: RentalRequest = {
      ...data,
      id: `req_${Date.now()}`,
      status: 'PENDING',
      submittedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setItem(STORAGE_KEYS.REQUESTS, [newReq, ...requests]);

    this.addNotification({
      userId: newReq.ownerId,
      title: 'New Rental Application Received',
      message: `${newReq.tenantName} submitted an application for ${newReq.propertyTitle}.`,
      category: 'REQUEST',
      linkTab: 'owner'
    });

    // Also initialize or find in-app chat conversation between Tenant and Owner!
    this.getOrCreateConversation(newReq.propertyId, newReq.tenantId, newReq.ownerId);

    return newReq;
  }

  updateRentalRequestStatus(requestId: string, status: 'APPROVED' | 'REJECTED'): RentalRequest {
    const requests = this.getRentalRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) throw new Error('Rental request not found');

    req.status = status;
    req.updatedAt = new Date().toISOString().split('T')[0];
    setItem(STORAGE_KEYS.REQUESTS, [...requests]);

    this.addNotification({
      userId: req.tenantId,
      title: `Rental Application ${status}`,
      message: `Your application for "${req.propertyTitle}" was ${status.toLowerCase()} by the property owner.`,
      category: 'REQUEST',
      linkTab: 'tenant'
    });

    if (status === 'APPROVED') {
      this.createDraftAgreementFromRequest(req);
    }

    return req;
  }

  getAgreements(): RentalAgreement[] {
    return getItem<RentalAgreement[]>(STORAGE_KEYS.AGREEMENTS, INITIAL_AGREEMENTS);
  }

  private createDraftAgreementFromRequest(req: RentalRequest): RentalAgreement {
    const agreements = this.getAgreements();
    const startDate = req.moveInDate;
    const endDateObj = new Date(startDate);
    endDateObj.setMonth(endDateObj.getMonth() + req.durationMonths);
    const endDate = endDateObj.toISOString().split('T')[0];

    const prop = this.getPropertyById(req.propertyId);

    const newAgreement: RentalAgreement = {
      id: `agr_${Date.now()}`,
      agreementNumber: `SN-AGR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      propertyId: req.propertyId,
      propertyTitle: req.propertyTitle,
      propertyAddress: req.propertyAddress,
      ownerId: req.ownerId,
      ownerName: prop?.ownerName || 'Verified SafeNest Owner',
      ownerSignature: `${prop?.ownerName || 'Owner'} [Digitally Pre-authorized via SafeNest Protocol]`,
      ownerSignedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' IST',
      tenantId: req.tenantId,
      tenantName: req.tenantName,
      startDate,
      endDate,
      monthlyRent: req.monthlyRent,
      securityDeposit: req.securityDeposit,
      paymentDueDay: 1,
      status: 'AWAITING_TENANT',
      terms: [
        `The Tenant agrees to pay the monthly rental of ₹${req.monthlyRent.toLocaleString('en-IN')} on or before the 1st of each month.`,
        `A refundable security deposit of ₹${req.securityDeposit.toLocaleString('en-IN')} is deposited into audited escrow custody.`,
        `Premises shall be occupied solely for private residential purposes by ${req.occupants} approved occupant(s).`,
        `Tenant agrees to comply with quiet hours (10:00 PM – 07:00 AM) and community standards.`,
        `Both parties agree to conduct all communication exclusively through SafeNest in-app chat to protect personal privacy.`
      ],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setItem(STORAGE_KEYS.AGREEMENTS, [newAgreement, ...agreements]);

    this.addNotification({
      userId: req.tenantId,
      title: 'Digital Lease Ready to Sign',
      message: `Your rental agreement for ${req.propertyTitle} has been drafted and countersigned by the owner. Please sign digitally to finalize.`,
      category: 'AGREEMENT',
      linkTab: 'tenant'
    });

    return newAgreement;
  }

  signAgreementByTenant(agreementId: string, signatureText: string): RentalAgreement {
    const agreements = this.getAgreements();
    const agr = agreements.find(a => a.id === agreementId);
    if (!agr) throw new Error('Agreement not found');

    agr.tenantSignature = signatureText;
    agr.tenantSignedAt = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' IST';
    agr.status = 'ACTIVE';
    setItem(STORAGE_KEYS.AGREEMENTS, [...agreements]);

    this.createRentPaymentForAgreement(agr);

    this.addNotification({
      userId: agr.ownerId,
      title: 'Lease Agreement Fully Executed!',
      message: `${agr.tenantName} has signed the lease agreement for ${agr.propertyTitle}. Tenancy is active.`,
      category: 'AGREEMENT',
      linkTab: 'owner'
    });

    return agr;
  }

  getPayments(): RentPayment[] {
    return getItem<RentPayment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  }

  private createRentPaymentForAgreement(agr: RentalAgreement): void {
    const payments = this.getPayments();
    const newPayment: RentPayment = {
      id: `pay_${Date.now()}`,
      agreementId: agr.id,
      propertyId: agr.propertyId,
      propertyTitle: agr.propertyTitle,
      tenantId: agr.tenantId,
      tenantName: agr.tenantName,
      ownerId: agr.ownerId,
      amount: agr.monthlyRent,
      billingMonth: 'Current Month',
      dueDate: agr.startDate,
      status: 'PENDING'
    };
    setItem(STORAGE_KEYS.PAYMENTS, [newPayment, ...payments]);
  }

  recordPayment(
    paymentId: string,
    method: 'CARD' | 'UPI' | 'NET_BANKING'
  ): RentPayment {
    const payments = this.getPayments();
    const p = payments.find(pay => pay.id === paymentId);
    if (!p) throw new Error('Payment record not found');

    p.status = 'PAID';
    p.paidDate = new Date().toISOString().split('T')[0];
    p.paymentMethod = method;
    p.transactionRef = `UPI-REF-${Math.floor(10000000 + Math.random() * 90000000)}-HDFC`;
    p.receiptNumber = `RCP-SN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    setItem(STORAGE_KEYS.PAYMENTS, [...payments]);

    this.addNotification({
      userId: p.tenantId,
      title: 'Rent Payment Successful',
      message: `Rent for ${p.billingMonth} (₹${p.amount.toLocaleString('en-IN')}) settled. Receipt: ${p.receiptNumber}`,
      category: 'RENT',
      linkTab: 'tenant'
    });

    this.addNotification({
      userId: p.ownerId,
      title: 'Rent Received in Escrow',
      message: `${p.tenantName} paid ₹${p.amount.toLocaleString('en-IN')} for ${p.propertyTitle}. Reference: ${p.transactionRef}`,
      category: 'RENT',
      linkTab: 'owner'
    });

    return p;
  }

  getMaintenanceRequests(): MaintenanceRequest[] {
    return getItem<MaintenanceRequest[]>(STORAGE_KEYS.MAINTENANCE, INITIAL_MAINTENANCE);
  }

  submitMaintenanceRequest(
    data: Omit<MaintenanceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): MaintenanceRequest {
    const requests = this.getMaintenanceRequests();
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newReq: MaintenanceRequest = {
      ...data,
      id: `maint_${Date.now()}`,
      status: 'SUBMITTED',
      createdAt: now,
      updatedAt: now
    };
    setItem(STORAGE_KEYS.MAINTENANCE, [newReq, ...requests]);

    this.addNotification({
      userId: newReq.ownerId,
      title: `Maintenance Ticket (${newReq.urgency} Urgency)`,
      message: `${newReq.tenantName} reported "${newReq.title}" at ${newReq.propertyTitle}.`,
      category: 'MAINTENANCE',
      linkTab: 'owner'
    });

    return newReq;
  }

  updateMaintenanceStatus(
    id: string,
    status: 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED',
    resolutionNote?: string
  ): MaintenanceRequest {
    const requests = this.getMaintenanceRequests();
    const req = requests.find(r => r.id === id);
    if (!req) throw new Error('Maintenance request not found');

    req.status = status;
    if (resolutionNote) req.resolutionNote = resolutionNote;
    req.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setItem(STORAGE_KEYS.MAINTENANCE, [...requests]);

    this.addNotification({
      userId: req.tenantId,
      title: `Maintenance Ticket Updated: ${status}`,
      message: `Ticket "${req.title}" has been updated: ${resolutionNote || status}`,
      category: 'MAINTENANCE',
      linkTab: 'tenant'
    });

    return req;
  }

  getReviews(propertyId?: string): PropertyReview[] {
    const reviews = getItem<PropertyReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    if (propertyId) {
      return reviews.filter(r => r.propertyId === propertyId);
    }
    return reviews;
  }

  addReview(data: Omit<PropertyReview, 'id' | 'createdAt'>): PropertyReview {
    const reviews = this.getReviews();
    const newReview: PropertyReview = {
      ...data,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newReview, ...reviews];
    setItem(STORAGE_KEYS.REVIEWS, updated);

    const propReviews = updated.filter(r => r.propertyId === data.propertyId);
    const avg = propReviews.reduce((sum, r) => sum + r.rating, 0) / propReviews.length;
    this.updateProperty(data.propertyId, {
      averageRating: parseFloat(avg.toFixed(1)),
      reviewCount: propReviews.length
    });

    return newReview;
  }

  getNotifications(userId: string): AppNotification[] {
    const all = getItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return all.filter(n => n.userId === userId);
  }

  addNotification(notif: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'>): void {
    const all = getItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setItem(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...all]);
  }

  markNotificationRead(id: string): void {
    const all = getItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const notif = all.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      setItem(STORAGE_KEYS.NOTIFICATIONS, [...all]);
    }
  }

  // --- In-App Chatbox Support ---
  getConversations(userId: string): ChatConversation[] {
    const all = getItem<ChatConversation[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
    return all.filter(c => c.tenantId === userId || c.ownerId === userId);
  }

  getMessages(conversationId: string): ChatMessage[] {
    const all = getItem<ChatMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    return all.filter(m => m.conversationId === conversationId);
  }

  sendMessage(conversationId: string, sender: User, text: string): ChatMessage {
    const allMessages = getItem<ChatMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    const allConvs = getItem<ChatConversation[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);

    const convIndex = allConvs.findIndex(c => c.id === conversationId);
    if (convIndex === -1) throw new Error('Conversation not found');

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: sender.role,
      text: text.trim(),
      timestamp: now
    };

    // Update conversation last message
    allConvs[convIndex].lastMessage = text.trim();
    allConvs[convIndex].lastMessageTime = now;
    if (sender.role === 'TENANT') {
      allConvs[convIndex].unreadCountOwner += 1;
    } else {
      allConvs[convIndex].unreadCountTenant += 1;
    }

    setItem(STORAGE_KEYS.MESSAGES, [...allMessages, newMsg]);
    setItem(STORAGE_KEYS.CONVERSATIONS, [...allConvs]);

    // Send push notification to the recipient
    const recipientId = sender.role === 'TENANT' ? allConvs[convIndex].ownerId : allConvs[convIndex].tenantId;
    this.addNotification({
      userId: recipientId,
      title: `New Message from ${sender.name}`,
      message: text.length > 50 ? `${text.slice(0, 50)}...` : text,
      category: 'CHAT',
      linkTab: 'chat'
    });

    return newMsg;
  }

  getOrCreateConversation(propertyId: string, tenantId: string, ownerId: string): ChatConversation {
    const allConvs = getItem<ChatConversation[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
    const existing = allConvs.find(
      c => c.propertyId === propertyId && c.tenantId === tenantId && c.ownerId === ownerId
    );
    if (existing) return existing;

    const prop = this.getPropertyById(propertyId);
    const users = this.getUsers();
    const tenant = users.find(u => u.id === tenantId);
    const owner = users.find(u => u.id === ownerId);

    const newConv: ChatConversation = {
      id: `conv_${Date.now()}`,
      propertyId,
      propertyTitle: prop?.title || 'Rental Property',
      tenantId,
      tenantName: tenant?.name || 'Tenant',
      ownerId,
      ownerName: owner?.name || 'Property Owner',
      lastMessage: 'Conversation initialized on SafeNest encrypted channel.',
      lastMessageTime: 'Just now',
      unreadCountTenant: 0,
      unreadCountOwner: 0
    };

    const updated = [newConv, ...allConvs];
    setItem(STORAGE_KEYS.CONVERSATIONS, updated);

    // Initial system privacy note
    const allMessages = getItem<ChatMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    const systemNote: ChatMessage = {
      id: `msg_sys_${Date.now()}`,
      conversationId: newConv.id,
      senderId: 'system',
      senderName: 'SafeNest Privacy Shield',
      senderRole: 'ADMIN',
      text: '🔒 End-to-end SafeNest privacy active. Neither tenant nor owner personal mobile numbers are disclosed.',
      timestamp: 'Just now',
      isSystemNote: true
    };
    setItem(STORAGE_KEYS.MESSAGES, [...allMessages, systemNote]);

    return newConv;
  }

  // --- Government Fraud & Spam Reporting ---
  getGovernmentReports(): GovernmentReport[] {
    return getItem<GovernmentReport[]>(STORAGE_KEYS.GOV_REPORTS, INITIAL_GOV_REPORTS);
  }

  submitGovernmentReport(reportData: {
    targetType: 'PROPERTY_SCAM' | 'FAKE_LANDLORD' | 'PHISHING_SPAM' | 'DEED_FORGERY';
    targetId: string;
    targetTitle: string;
    offenderName: string;
    offenderEmail: string;
    description: string;
    evidenceNotes: string;
    adminUser: User;
    regulatoryBody: 'RERA_CYBER_CRIME_CELL' | 'NATIONAL_CONSUMER_HELPLINE' | 'HOUSING_MINISTRY_FRAUD_MONITOR';
  }): GovernmentReport {
    const existing = this.getGovernmentReports();
    const token = `ACK-IND-${Date.now().toString().slice(-6)}`;
    const reportNum = `GOV-REPORT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReport: GovernmentReport = {
      id: `gov_${Date.now()}`,
      reportNumber: reportNum,
      targetType: reportData.targetType,
      targetId: reportData.targetId,
      targetTitle: reportData.targetTitle,
      offenderName: reportData.offenderName,
      offenderEmail: reportData.offenderEmail,
      description: reportData.description,
      evidenceNotes: reportData.evidenceNotes,
      reportedByAdminId: reportData.adminUser.id,
      reportedByAdminName: reportData.adminUser.name,
      regulatoryBody: reportData.regulatoryBody,
      status: 'SUBMITTED_TO_PORTAL',
      acknowledgementToken: token,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setItem(STORAGE_KEYS.GOV_REPORTS, [newReport, ...existing]);

    // Flag target property or user if applicable
    if (reportData.targetId.startsWith('prop_')) {
      this.flagPropertyAsSpam(reportData.targetId, reportData.description);
    }

    return newReport;
  }

  resetToDemo(): void {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.PROPERTIES);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.AGREEMENTS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.MAINTENANCE);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.GOV_REPORTS);
  }
}

export const storage = new StorageService();
