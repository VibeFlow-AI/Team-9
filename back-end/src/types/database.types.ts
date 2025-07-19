// Database Types for EduVibe Application
// These types correspond to the Prisma schema models

// Enums
export enum UserRole {
  STUDENT = 'STUDENT',
  MENTOR = 'MENTOR',
  ADMIN = 'ADMIN'
}

export enum EducationLevel {
  GRADE_9 = 'GRADE_9',
  ORDINARY_LEVEL = 'ORDINARY_LEVEL',
  ADVANCED_LEVEL = 'ADVANCED_LEVEL',
  UNIVERSITY = 'UNIVERSITY'
}

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export enum LearningStyle {
  VISUAL = 'VISUAL',
  HANDS_ON = 'HANDS_ON',
  THEORETICAL = 'THEORETICAL',
  MIXED = 'MIXED'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export enum Language {
  ENGLISH = 'ENGLISH',
  SINHALA = 'SINHALA',
  TAMIL = 'TAMIL',
  OTHER = 'OTHER'
}

export enum Experience {
  NONE = 'NONE',
  ONE_TO_THREE_YEARS = 'ONE_TO_THREE_YEARS',
  THREE_TO_FIVE_YEARS = 'THREE_TO_FIVE_YEARS',
  FIVE_PLUS_YEARS = 'FIVE_PLUS_YEARS'
}

// Core Models
export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  student?: Student
  mentor?: Mentor
  sessions?: Session[]
  accounts?: Account[]
}

export interface Student {
  id: string
  userId: string
  user: User
  age: number
  contactNumber: string
  educationLevel: EducationLevel
  school: string
  currentYear: number
  subjectsOfInterest: string[]
  preferredLearningStyle: LearningStyle
  hasLearningDisabilities: boolean
  learningAccommodations?: string
  subjectSkills: SubjectSkill[]
  bookings: Booking[]
  reviews: Review[]
  createdAt: Date
  updatedAt: Date
}

export interface Mentor {
  id: string
  userId: string
  user: User
  age: number
  contactNumber: string
  preferredLanguage: Language
  currentLocation: string
  shortBio: string
  professionalRole: string
  subjectsToTeach: string[]
  teachingExperience: Experience
  preferredStudentLevels: EducationLevel[]
  linkedinProfile: string
  githubPortfolio?: string
  profilePictureUrl?: string
  averageRating?: number
  totalSessions: number
  isActive: boolean
  mentorSessions: MentorSession[]
  bookings: Booking[]
  reviews: Review[]
  createdAt: Date
  updatedAt: Date
}

export interface SubjectSkill {
  id: string
  studentId: string
  student: Student
  subject: string
  skillLevel: SkillLevel
  createdAt: Date
  updatedAt: Date
}

export interface MentorSession {
  id: string
  mentorId: string
  mentor: Mentor
  title: string
  description: string
  subject: string
  tags: string[]
  duration: number
  price: number
  maxStudents: number
  isActive: boolean
  availableSlots: Date[]
  totalBookings: number
  averageRating?: number
  bookings: Booking[]
  reviews: Review[]
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id: string
  studentId: string
  student: Student
  mentorId: string
  mentor: Mentor
  mentorSessionId: string
  mentorSession: MentorSession
  scheduledDateTime: Date
  status: BookingStatus
  sessionNotes?: string
  payment?: Payment
  review?: Review
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  bookingId: string
  booking: Booking
  amount: number
  currency: string
  status: PaymentStatus
  bankSlipUrl?: string
  bankSlipName?: string
  verifiedAt?: Date
  verifiedBy?: string
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  bookingId: string
  booking: Booking
  studentId: string
  student: Student
  mentorId: string
  mentor: Mentor
  mentorSessionId: string
  mentorSession: MentorSession
  rating: number
  comment?: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

// Authentication Models
export interface Session {
  id: string
  expiresAt: Date
  token: string
  createdAt: Date
  updatedAt: Date
  ipAddress?: string
  userAgent?: string
  userId: string
  user: User
}

export interface Account {
  id: string
  accountId: string
  providerId: string
  userId: string
  user: User
  accessToken?: string
  refreshToken?: string
  idToken?: string
  accessTokenExpiresAt?: Date
  refreshTokenExpiresAt?: Date
  scope?: string
  password?: string
  createdAt: Date
  updatedAt: Date
}

export interface Verification {
  id: string
  identifier: string
  value: string
  expiresAt: Date
  createdAt?: Date
  updatedAt?: Date
}

// Legacy Model
export interface Item {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

// Utility Types for API responses and forms

// Student Onboarding Types
export interface StudentOnboardingPart1 {
  name: string
  age: number
  email: string
  contactNumber: string
}

export interface StudentOnboardingPart2 {
  educationLevel: EducationLevel
  school: string
}

export interface StudentOnboardingPart3 {
  subjectsOfInterest: string[]
  currentYear: number
  subjectSkills: Array<{
    subject: string
    skillLevel: SkillLevel
  }>
  preferredLearningStyle: LearningStyle
  hasLearningDisabilities: boolean
  learningAccommodations?: string
}

export interface StudentOnboardingData 
  extends StudentOnboardingPart1, 
          StudentOnboardingPart2, 
          StudentOnboardingPart3 {}

// Mentor Onboarding Types
export interface MentorOnboardingPart1 {
  name: string
  age: number
  email: string
  contactNumber: string
  preferredLanguage: Language
  currentLocation: string
  shortBio: string
  professionalRole: string
}

export interface MentorOnboardingPart2 {
  subjectsToTeach: string[]
  teachingExperience: Experience
  preferredStudentLevels: EducationLevel[]
}

export interface MentorOnboardingPart3 {
  linkedinProfile: string
  githubPortfolio?: string
  profilePictureUrl?: string
}

export interface MentorOnboardingData 
  extends MentorOnboardingPart1, 
          MentorOnboardingPart2, 
          MentorOnboardingPart3 {}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

// Dashboard Analytics Types
export interface StudentAnalytics {
  totalStudents: number
  ageDistribution: Record<string, number>
  subjectInterests: Record<string, number>
  educationLevelDistribution: Record<EducationLevel, number>
  learningStyleDistribution: Record<LearningStyle, number>
}

export interface MentorAnalytics {
  totalSessions: number
  averageRating: number
  studentAgeGroups: Record<string, number>
  popularSubjects: Record<string, number>
  bookingsByMonth: Record<string, number>
  recentBookings: Booking[]
}

// Search and Filter Types
export interface MentorSearchFilters {
  subjects?: string[]
  minRating?: number
  maxPrice?: number
  availability?: Date[]
  experience?: Experience[]
  languages?: Language[]
  educationLevels?: EducationLevel[]
}

export interface SessionSearchFilters {
  subject?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  tags?: string[]
  availability?: Date[]
}

// Matching Algorithm Types
export interface StudentPreferences {
  subjects: string[]
  skillLevels: Record<string, SkillLevel>
  learningStyle: LearningStyle
  educationLevel: EducationLevel
  preferredLanguage?: Language
}

export interface MentorCompatibility {
  mentor: Mentor
  compatibilityScore: number
  matchingFactors: string[]
  availableSessions: MentorSession[]
} 