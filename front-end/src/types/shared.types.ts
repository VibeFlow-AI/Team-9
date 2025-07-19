// Shared Types for EduVibe Frontend Application
// These types are used across React components and API interactions

// Enums (matching backend)
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

// Core Entity Types
export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface Student {
  id: string
  userId: string
  user?: User
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
  createdAt: string
  updatedAt: string
}

export interface Mentor {
  id: string
  userId: string
  user?: User
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
  createdAt: string
  updatedAt: string
}

export interface SubjectSkill {
  id: string
  studentId: string
  subject: string
  skillLevel: SkillLevel
  createdAt: string
  updatedAt: string
}

export interface MentorSession {
  id: string
  mentorId: string
  mentor?: Mentor
  title: string
  description: string
  subject: string
  tags: string[]
  duration: number
  price: number
  maxStudents: number
  isActive: boolean
  availableSlots: string[]
  totalBookings: number
  averageRating?: number
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  studentId: string
  student?: Student
  mentorId: string
  mentor?: Mentor
  mentorSessionId: string
  mentorSession?: MentorSession
  scheduledDateTime: string
  status: BookingStatus
  sessionNotes?: string
  payment?: Payment
  review?: Review
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  bookingId: string
  amount: number
  currency: string
  status: PaymentStatus
  bankSlipUrl?: string
  bankSlipName?: string
  verifiedAt?: string
  verifiedBy?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  bookingId: string
  studentId: string
  mentorId: string
  mentorSessionId: string
  rating: number
  comment?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// Form Data Types for Multi-step Onboarding

// Student Onboarding Form Data
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

// Mentor Onboarding Form Data
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
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
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
  availability?: string[]
  experience?: Experience[]
  languages?: Language[]
  educationLevels?: EducationLevel[]
  page?: number
  limit?: number
}

export interface SessionSearchFilters {
  subject?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  tags?: string[]
  availability?: string[]
  page?: number
  limit?: number
}

// UI State Types
export interface LoadingState {
  isLoading: boolean
  error?: string
}

export interface FormError {
  field: string
  message: string
}

export interface OnboardingState {
  currentStep: number
  totalSteps: number
  data: Partial<StudentOnboardingData | MentorOnboardingData>
  errors: FormError[]
  isSubmitting: boolean
}

// Booking Flow Types
export interface BookingFormData {
  mentorSessionId: string
  scheduledDateTime: string
  sessionNotes?: string
}

export interface PaymentFormData {
  bookingId: string
  amount: number
  bankSlip: File | null
}

// Dashboard Tab Types
export type StudentDashboardTab = 'explore' | 'booked-sessions' | 'profile'
export type MentorDashboardTab = 'dashboard' | 'sessions' | 'bookings' | 'profile'

// Component Props Types
export interface MentorCardProps {
  mentor: Mentor
  onSelect?: (mentor: Mentor) => void
  showBookButton?: boolean
}

export interface SessionCardProps {
  session: MentorSession
  onBook?: (session: MentorSession) => void
  onViewDetails?: (session: MentorSession) => void
}

export interface BookingCardProps {
  booking: Booking
  onCancel?: (bookingId: string) => void
  onViewDetails?: (booking: Booking) => void
  showActions?: boolean
}

// Modal and Dialog Types
export interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  isDestructive?: boolean
}

// Chart Data Types for Analytics
export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface PieChartData {
  data: ChartDataPoint[]
  centerLabel?: string
}

export interface BarChartData {
  categories: string[]
  series: Array<{
    name: string
    data: number[]
    color?: string
  }>
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

// Form Field Types for Dynamic Forms
export interface FormFieldConfig {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'file'
  placeholder?: string
  required?: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
    customMessage?: string
  }
  options?: Array<{
    label: string
    value: string
  }>
}

// Navigation and Routing Types
export interface NavigationItem {
  label: string
  path: string
  icon?: React.ComponentType<any>
  requiresAuth?: boolean
  roles?: UserRole[]
}

// File Upload Types
export interface FileUploadState {
  file: File | null
  preview?: string
  uploadProgress?: number
  isUploading: boolean
  error?: string
}

// Notification Types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Theme Types
export interface ThemeConfig {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  border: string
}

// Export label mappings for enums (useful for UI display)
export const EducationLevelLabels: Record<EducationLevel, string> = {
  [EducationLevel.GRADE_9]: 'Grade 9',
  [EducationLevel.ORDINARY_LEVEL]: 'Ordinary Level',
  [EducationLevel.ADVANCED_LEVEL]: 'Advanced Level',
  [EducationLevel.UNIVERSITY]: 'University'
}

export const SkillLevelLabels: Record<SkillLevel, string> = {
  [SkillLevel.BEGINNER]: 'Beginner',
  [SkillLevel.INTERMEDIATE]: 'Intermediate',
  [SkillLevel.ADVANCED]: 'Advanced'
}

export const LearningStyleLabels: Record<LearningStyle, string> = {
  [LearningStyle.VISUAL]: 'Visual',
  [LearningStyle.HANDS_ON]: 'Hands-On',
  [LearningStyle.THEORETICAL]: 'Theoretical',
  [LearningStyle.MIXED]: 'Mixed'
}

export const LanguageLabels: Record<Language, string> = {
  [Language.ENGLISH]: 'English',
  [Language.SINHALA]: 'Sinhala',
  [Language.TAMIL]: 'Tamil',
  [Language.OTHER]: 'Other'
}

export const ExperienceLabels: Record<Experience, string> = {
  [Experience.NONE]: 'No Experience',
  [Experience.ONE_TO_THREE_YEARS]: '1-3 Years',
  [Experience.THREE_TO_FIVE_YEARS]: '3-5 Years',
  [Experience.FIVE_PLUS_YEARS]: '5+ Years'
}

export const BookingStatusLabels: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: 'Pending',
  [BookingStatus.CONFIRMED]: 'Confirmed',
  [BookingStatus.COMPLETED]: 'Completed',
  [BookingStatus.CANCELLED]: 'Cancelled'
}

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pending',
  [PaymentStatus.VERIFIED]: 'Verified',
  [PaymentStatus.REJECTED]: 'Rejected'
} 