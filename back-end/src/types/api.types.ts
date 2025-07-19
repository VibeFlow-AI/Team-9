// API Types for EduVibe Backend
// Request and Response types for all API endpoints

import type { Request, Response } from 'express'
import type { User, Student, Mentor, MentorSession, Booking, Payment, Review, UserRole } from './database.types'

// Base API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
  timestamp?: string
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors?: string[]
  statusCode: number
  timestamp: string
}

export interface PaginatedApiResponse<T> extends ApiResponse {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasNextPage: boolean
    hasPrevPage: boolean
    limit: number
  }
}

// Extended Express Types
export interface AuthenticatedRequest extends Request {
  user?: User
  userId?: string
}

export interface AuthenticatedResponse extends Response {}

// Authentication API Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: true
  data: {
    user: User
    token: string
    refreshToken: string
    expiresIn: number
  }
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface RegisterResponse {
  success: true
  data: {
    user: User
    message: string
  }
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  success: true
  data: {
    token: string
    refreshToken: string
    expiresIn: number
  }
}

export interface VerifyEmailRequest {
  token: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

// Student API Types
export interface CreateStudentRequest {
  // Part 1: Personal Information
  name: string
  age: number
  email: string
  contactNumber: string
  
  // Part 2: Academic Background
  educationLevel: string
  school: string
  
  // Part 3: Subject & Skills
  subjectsOfInterest: string[]
  currentYear: number
  subjectSkills: Array<{
    subject: string
    skillLevel: string
  }>
  preferredLearningStyle: string
  hasLearningDisabilities: boolean
  learningAccommodations?: string
}

export interface UpdateStudentRequest {
  age?: number
  contactNumber?: string
  educationLevel?: string
  school?: string
  currentYear?: number
  subjectsOfInterest?: string[]
  preferredLearningStyle?: string
  hasLearningDisabilities?: boolean
  learningAccommodations?: string
}

export interface StudentResponse {
  success: true
  data: Student & { user: User }
}

export interface StudentsListResponse extends PaginatedApiResponse<Student> {}

// Mentor API Types
export interface CreateMentorRequest {
  // Part 1: Personal Information
  name: string
  age: number
  email: string
  contactNumber: string
  preferredLanguage: string
  currentLocation: string
  shortBio: string
  professionalRole: string
  
  // Part 2: Areas of Expertise
  subjectsToTeach: string[]
  teachingExperience: string
  preferredStudentLevels: string[]
  
  // Part 3: Social & Professional Links
  linkedinProfile: string
  githubPortfolio?: string
  profilePictureUrl?: string
}

export interface UpdateMentorRequest {
  age?: number
  contactNumber?: string
  preferredLanguage?: string
  currentLocation?: string
  shortBio?: string
  professionalRole?: string
  subjectsToTeach?: string[]
  teachingExperience?: string
  preferredStudentLevels?: string[]
  linkedinProfile?: string
  githubPortfolio?: string
  profilePictureUrl?: string
  isActive?: boolean
}

export interface MentorResponse {
  success: true
  data: Mentor & { user: User }
}

export interface MentorsListResponse extends PaginatedApiResponse<Mentor> {}

export interface MentorSearchRequest {
  subjects?: string[]
  minRating?: number
  maxPrice?: number
  experience?: string[]
  languages?: string[]
  educationLevels?: string[]
  isActive?: boolean
  page?: number
  limit?: number
  sortBy?: 'averageRating' | 'totalSessions' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// Mentor Session API Types
export interface CreateMentorSessionRequest {
  title: string
  description: string
  subject: string
  tags: string[]
  price: number
  availableSlots: string[] // ISO date strings
}

export interface UpdateMentorSessionRequest {
  title?: string
  description?: string
  subject?: string
  tags?: string[]
  price?: number
  availableSlots?: string[]
  isActive?: boolean
}

export interface MentorSessionResponse {
  success: true
  data: MentorSession & { mentor: Mentor & { user: User } }
}

export interface MentorSessionsListResponse extends PaginatedApiResponse<MentorSession> {}

export interface SessionSearchRequest {
  subject?: string
  mentorId?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  tags?: string[]
  isActive?: boolean
  availability?: string[] // ISO date strings
  page?: number
  limit?: number
  sortBy?: 'price' | 'averageRating' | 'totalBookings' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// Booking API Types
export interface CreateBookingRequest {
  mentorSessionId: string
  scheduledDateTime: string // ISO date string
  sessionNotes?: string
}

export interface UpdateBookingRequest {
  scheduledDateTime?: string
  status?: string
  sessionNotes?: string
}

export interface BookingResponse {
  success: true
  data: Booking & {
    student: Student & { user: User }
    mentor: Mentor & { user: User }
    mentorSession: MentorSession
    payment?: Payment
    review?: Review
  }
}

export interface BookingsListResponse extends PaginatedApiResponse<Booking> {}

export interface BookingSearchRequest {
  studentId?: string
  mentorId?: string
  mentorSessionId?: string
  status?: string
  scheduledFrom?: string // ISO date string
  scheduledTo?: string // ISO date string
  page?: number
  limit?: number
  sortBy?: 'scheduledDateTime' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// Payment API Types
export interface CreatePaymentRequest {
  bookingId: string
  amount: number
  currency?: string
}

export interface UploadBankSlipRequest {
  paymentId: string
  bankSlip: Express.Multer.File
}

export interface VerifyPaymentRequest {
  paymentId: string
  status: 'VERIFIED' | 'REJECTED'
  rejectionReason?: string
}

export interface PaymentResponse {
  success: true
  data: Payment & {
    booking: Booking & {
      student: Student & { user: User }
      mentorSession: MentorSession
    }
  }
}

export interface PaymentsListResponse extends PaginatedApiResponse<Payment> {}

// Review API Types
export interface CreateReviewRequest {
  bookingId: string
  rating: number // 1-5
  comment?: string
  isPublic?: boolean
}

export interface UpdateReviewRequest {
  rating?: number
  comment?: string
  isPublic?: boolean
}

export interface ReviewResponse {
  success: true
  data: Review & {
    student: Student & { user: User }
    mentor: Mentor & { user: User }
    mentorSession: MentorSession
    booking: Booking
  }
}

export interface ReviewsListResponse extends PaginatedApiResponse<Review> {}

// Analytics API Types
export interface AnalyticsRequest {
  startDate?: string
  endDate?: string
  groupBy?: 'day' | 'week' | 'month' | 'year'
}

export interface StudentAnalyticsResponse {
  success: true
  data: {
    totalStudents: number
    ageDistribution: Record<string, number>
    subjectInterests: Record<string, number>
    educationLevelDistribution: Record<string, number>
    learningStyleDistribution: Record<string, number>
    registrationTrend: Array<{
      period: string
      count: number
    }>
  }
}

export interface MentorAnalyticsResponse {
  success: true
  data: {
    mentorId: string
    totalSessions: number
    averageRating: number
    totalEarnings: number
    studentAgeGroups: Record<string, number>
    popularSubjects: Record<string, number>
    bookingsByMonth: Record<string, number>
    recentBookings: Booking[]
    performanceMetrics: {
      completionRate: number
      responseTime: number
      repeatBookingRate: number
    }
  }
}

export interface PlatformAnalyticsResponse {
  success: true
  data: {
    totalUsers: number
    totalStudents: number
    totalMentors: number
    totalSessions: number
    totalBookings: number
    totalRevenue: number
    conversionRates: {
      signupToOnboarding: number
      onboardingToFirstBooking: number
      firstBookingToRepeat: number
    }
    popularSubjects: Record<string, number>
    userGrowth: Array<{
      period: string
      students: number
      mentors: number
    }>
    revenueGrowth: Array<{
      period: string
      revenue: number
    }>
  }
}

// File Upload API Types
export interface FileUploadRequest {
  file: Express.Multer.File
  type: 'profile-picture' | 'bank-slip' | 'document'
}

export interface FileUploadResponse {
  success: true
  data: {
    filename: string
    originalname: string
    mimetype: string
    size: number
    url: string
    uploadedAt: string
  }
}

// Matching Algorithm API Types
export interface GetMatchingMentorsRequest {
  studentId: string
  limit?: number
}

export interface MentorMatchResponse {
  mentorId: string
  mentor: Mentor & { user: User }
  compatibilityScore: number
  matchingFactors: string[]
  availableSessions: MentorSession[]
  reasonsToChoose: string[]
}

export interface MatchingMentorsResponse {
  success: true
  data: {
    matches: MentorMatchResponse[]
    totalMatches: number
    algorithm: string
    calculatedAt: string
  }
}

// Notification API Types
export interface NotificationRequest {
  userId: string
  type: 'booking_confirmed' | 'payment_verified' | 'session_reminder' | 'review_request' | 'system_alert'
  title: string
  message: string
  data?: Record<string, any>
}

export interface NotificationResponse {
  success: true
  data: {
    id: string
    userId: string
    type: string
    title: string
    message: string
    data?: Record<string, any>
    isRead: boolean
    createdAt: string
  }
}

export interface NotificationsListResponse extends PaginatedApiResponse<NotificationResponse['data']> {}

// Error Types
export interface ValidationError {
  field: string
  message: string
  value?: any
}

export interface ApiError extends Error {
  statusCode: number
  isOperational: boolean
  errors?: ValidationError[]
}

// Middleware Types
export interface AuthMiddleware {
  (req: AuthenticatedRequest, res: AuthenticatedResponse, next: Function): void | Promise<void>
}

export interface ValidationMiddleware {
  (req: Request, res: Response, next: Function): void | Promise<void>
}

// Route Handler Types
export type ApiHandler<TReq = any, TRes = any> = (
  req: AuthenticatedRequest & { body: TReq },
  res: AuthenticatedResponse
) => Promise<void | Response<ApiResponse<TRes>>>

export type PublicApiHandler<TReq = any, TRes = any> = (
  req: Request & { body: TReq },
  res: Response
) => Promise<void | Response<ApiResponse<TRes>>>

// Query Parameter Types
export interface PaginationQuery {
  page?: string
  limit?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchQuery extends PaginationQuery {
  q?: string
  filter?: string
}

export interface DateRangeQuery {
  startDate?: string
  endDate?: string
}

// Utility Types for API Development
export type ApiSuccessResponse<T> = ApiResponse<T> & { success: true }
export type ApiErrorResponseType = ApiResponse & { success: false; errors: string[] }

export type WithPagination<T> = T & {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// WebSocket Types (for real-time features)
export interface WebSocketMessage {
  type: string
  payload: any
  timestamp: string
  userId?: string
}

export interface BookingUpdateMessage extends WebSocketMessage {
  type: 'booking_update'
  payload: {
    bookingId: string
    status: string
    studentId: string
    mentorId: string
  }
}

export interface PaymentUpdateMessage extends WebSocketMessage {
  type: 'payment_update'
  payload: {
    paymentId: string
    status: string
    bookingId: string
  }
}

// Health Check Types
export interface HealthCheckResponse {
  success: true
  data: {
    status: 'healthy' | 'unhealthy'
    timestamp: string
    uptime: number
    version: string
    environment: string
    database: {
      status: 'connected' | 'disconnected'
      responseTime: number
    }
    services: Record<string, {
      status: 'up' | 'down'
      responseTime?: number
      lastChecked: string
    }>
  }
}

// Dashboard Types
export interface StudentDashboard {
  student: {
    id: string
    name: string | null
    email: string
    profilePicture?: string | null
    educationLevel: string
    school: string
    subjectsOfInterest: string[]
    memberSince: Date
  }
  statistics: {
    totalBookings: number
    completedSessions: number
    upcomingSessions: number
    pendingSessions: number
    totalSpent: number
    averageSessionRating: number
  }
  recentBookings: Array<{
    id: string
    mentorName: string | null
    mentorProfilePicture?: string | null
    sessionTitle: string
    subject: string
    scheduledDateTime: Date
    status: string
    amount: number
    hasReview: boolean
  }>
  upcomingSessions: Array<{
    id: string
    mentorName: string | null
    mentorProfilePicture?: string | null
    sessionTitle: string
    subject: string
    scheduledDateTime: Date
    meetingLink?: string | null
    notes?: string | null
  }>
  favoriteSubjects: Array<{
    subject: string
    sessionCount: number
  }>
  learningProgress: {
    completedHours: number
    subjectProgress: Array<{
      subject: string
      currentLevel: string
      sessionsCompleted: number
    }>
  }
  recommendations: {
    suggestedMentors: any[]
    recommendedSessions: any[]
    learningGoals: Array<{
      subject: string
      targetLevel: string
      estimatedHours: number
    }>
  }
}

export interface MentorDashboard {
  mentor: {
    id: string
    name: string | null
    email: string
    profilePicture?: string | null
    professionalRole: string
    subjectsToTeach: string[]
    averageRating?: number | null
    totalSessions: number
    memberSince: Date
    isActive: boolean
  }
  statistics: {
    totalBookings: number
    completedSessions: number
    upcomingSessions: number
    pendingSessions: number
    totalEarnings: number
    thisMonthEarnings: number
    averageRating: number
    totalStudents: number
    activeSessions: number
  }
  recentBookings: Array<{
    id: string
    studentName: string | null
    studentProfilePicture?: string | null
    sessionTitle: string
    subject: string
    scheduledDateTime: Date
    status: string
    amount: number
    hasReview: boolean
  }>
  upcomingSessions: Array<{
    id: string
    studentName: string | null
    studentProfilePicture?: string | null
    sessionTitle: string
    subject: string
    scheduledDateTime: Date
    meetingLink?: string | null
    studentNotes?: string | null
  }>
  analytics: {
    monthlyEarnings: Array<{
      month: string
      earnings: number
    }>
    popularSubjects: Array<{
      subject: string
      bookings: number
    }>
    studentRetentionRate: number
    peakHours: any[]
  }
  topSessions: Array<{
    id: string
    title: string
    subject: string
    totalBookings: number
    averageRating: number
    price: number
  }>
  reviews: Array<{
    id: string
    studentName: string | null
    rating: number
    comment: string
    sessionTitle?: string
    createdAt: Date
  }>
} 