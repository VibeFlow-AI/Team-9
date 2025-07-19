import { z } from 'zod'

// Enum validation schemas
export const UserRoleSchema = z.enum(['STUDENT', 'MENTOR', 'ADMIN'])

export const EducationLevelSchema = z.enum([
  'GRADE_9', 
  'ORDINARY_LEVEL', 
  'ADVANCED_LEVEL', 
  'UNIVERSITY'
])

export const SkillLevelSchema = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])

export const LearningStyleSchema = z.enum(['VISUAL', 'HANDS_ON', 'THEORETICAL', 'MIXED'])

export const BookingStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])

export const PaymentStatusSchema = z.enum(['PENDING', 'VERIFIED', 'REJECTED'])

export const LanguageSchema = z.enum(['ENGLISH', 'SINHALA', 'TAMIL', 'OTHER'])

export const ExperienceSchema = z.enum([
  'NONE',
  'ONE_TO_THREE_YEARS',
  'THREE_TO_FIVE_YEARS',
  'FIVE_PLUS_YEARS'
])

// Base validation schemas
export const EmailSchema = z.string().email('Invalid email address')

export const PhoneSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must be at most 15 digits')
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')

export const URLSchema = z.string().url('Invalid URL format')

export const LinkedInURLSchema = z.string()
  .url('Invalid LinkedIn URL')
  .regex(/^https:\/\/(www\.)?linkedin\.com\/.*/, 'Must be a valid LinkedIn URL')

export const PasswordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number')

// User Authentication Schemas
export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Password is required')
})

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: EmailSchema,
  password: PasswordSchema,
  role: UserRoleSchema
})

// Student Onboarding Schemas
export const StudentOnboardingPart1Schema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  age: z.number()
    .int('Age must be a whole number')
    .min(13, 'Must be at least 13 years old')
    .max(100, 'Age must be at most 100'),
  email: EmailSchema,
  contactNumber: PhoneSchema
})

export const StudentOnboardingPart2Schema = z.object({
  educationLevel: EducationLevelSchema,
  school: z.string()
    .min(2, 'School name must be at least 2 characters')
    .max(200, 'School name must be at most 200 characters')
})

export const SubjectSkillSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  skillLevel: SkillLevelSchema
})

export const StudentOnboardingPart3Schema = z.object({
  subjectsOfInterest: z.array(z.string().min(1))
    .min(1, 'At least one subject is required')
    .max(10, 'Maximum 10 subjects allowed'),
  currentYear: z.number()
    .int('Year must be a whole number')
    .min(1, 'Year must be positive')
    .max(2030, 'Invalid year'),
  subjectSkills: z.array(SubjectSkillSchema)
    .min(1, 'At least one subject skill is required'),
  preferredLearningStyle: LearningStyleSchema,
  hasLearningDisabilities: z.boolean(),
  learningAccommodations: z.string().max(500, 'Accommodations description too long').optional()
})

export const StudentOnboardingSchema = StudentOnboardingPart1Schema
  .merge(StudentOnboardingPart2Schema)
  .merge(StudentOnboardingPart3Schema)

// Mentor Onboarding Schemas
export const MentorOnboardingPart1Schema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  age: z.number()
    .int('Age must be a whole number')
    .min(18, 'Must be at least 18 years old')
    .max(100, 'Age must be at most 100'),
  email: EmailSchema,
  contactNumber: PhoneSchema,
  preferredLanguage: LanguageSchema,
  currentLocation: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be at most 100 characters'),
  shortBio: z.string()
    .min(50, 'Bio must be at least 50 characters')
    .max(500, 'Bio must be at most 500 characters'),
  professionalRole: z.string()
    .min(2, 'Professional role must be at least 2 characters')
    .max(100, 'Professional role must be at most 100 characters')
})

export const MentorOnboardingPart2Schema = z.object({
  subjectsToTeach: z.array(z.string().min(1))
    .min(1, 'At least one subject is required')
    .max(10, 'Maximum 10 subjects allowed'),
  teachingExperience: ExperienceSchema,
  preferredStudentLevels: z.array(EducationLevelSchema)
    .min(1, 'At least one education level is required')
})

export const MentorOnboardingPart3Schema = z.object({
  linkedinProfile: LinkedInURLSchema,
  githubPortfolio: URLSchema.optional(),
  profilePictureUrl: URLSchema.optional()
})

export const MentorOnboardingSchema = MentorOnboardingPart1Schema
  .merge(MentorOnboardingPart2Schema)
  .merge(MentorOnboardingPart3Schema)

// Mentor Session Schemas
export const CreateMentorSessionSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be at most 1000 characters'),
  subject: z.string().min(1, 'Subject is required'),
  tags: z.array(z.string().min(1))
    .max(10, 'Maximum 10 tags allowed'),
  price: z.number()
    .positive('Price must be positive')
    .max(1000, 'Price too high'),
  availableSlots: z.array(z.date())
    .min(1, 'At least one available slot is required')
})

export const UpdateMentorSessionSchema = CreateMentorSessionSchema.partial()

// Booking Schemas
export const CreateBookingSchema = z.object({
  mentorSessionId: z.string().min(1, 'Mentor session ID is required'),
  scheduledDateTime: z.date().refine(
    (date) => date > new Date(),
    'Scheduled time must be in the future'
  ),
  sessionNotes: z.string().max(500, 'Session notes too long').optional()
})

export const UpdateBookingSchema = z.object({
  status: BookingStatusSchema,
  sessionNotes: z.string().max(500, 'Session notes too long').optional()
})

// Payment Schemas
export const CreatePaymentSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters').default('USD')
})

export const UploadBankSlipSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
  bankSlipUrl: URLSchema,
  bankSlipName: z.string().min(1, 'Bank slip filename is required')
})

export const VerifyPaymentSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
  status: PaymentStatusSchema,
  rejectionReason: z.string().min(1).optional()
})

// Review Schemas
export const CreateReviewSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  rating: z.number()
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: z.string()
    .max(1000, 'Comment must be at most 1000 characters')
    .optional(),
  isPublic: z.boolean().default(true)
})

// Search and Filter Schemas
export const MentorSearchSchema = z.object({
  subjects: z.array(z.string()).optional(),
  minRating: z.number().min(0).max(5).optional(),
  maxPrice: z.number().positive().optional(),
  experience: z.array(ExperienceSchema).optional(),
  languages: z.array(LanguageSchema).optional(),
  educationLevels: z.array(EducationLevelSchema).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(10)
})

export const SessionSearchSchema = z.object({
  subject: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  minRating: z.number().min(0).max(5).optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(10)
})

// Analytics Schemas
export const DateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date()
}).refine(
  (data) => data.endDate >= data.startDate,
  {
    message: 'End date must be after start date',
    path: ['endDate']
  }
)

export const AnalyticsQuerySchema = z.object({
  dateRange: DateRangeSchema.optional(),
  groupBy: z.enum(['day', 'week', 'month', 'year']).default('month')
})

// File Upload Schemas
export const FileUploadSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  mimetype: z.string().min(1, 'File type is required'),
  size: z.number().positive('File size must be positive').max(10485760, 'File size must be less than 10MB') // 10MB limit
})

export const ProfilePictureUploadSchema = FileUploadSchema.extend({
  mimetype: z.string().regex(/^image\/(jpeg|png|webp)$/, 'Only JPEG, PNG, and WebP images are allowed')
})

export const BankSlipUploadSchema = FileUploadSchema.extend({
  mimetype: z.string().regex(/^(image\/(jpeg|png|webp)|application\/pdf)$/, 'Only images and PDFs are allowed')
})

// Pagination Schema
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// ID Validation Schemas
export const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format')

export const ParamsWithIdSchema = z.object({
  id: ObjectIdSchema
})

// Query Parameter Schemas
export const BooleanQuerySchema = z.union([
  z.boolean(),
  z.enum(['true', 'false']).transform(val => val === 'true')
])

export const NumberQuerySchema = z.union([
  z.number(),
  z.string().regex(/^\d+$/).transform(Number)
])

// Multi-part form validation helper
export const validateMultiPartForm = <T>(
  data: unknown,
  schemas: z.ZodSchema<any>[],
  currentStep: number
): { isValid: boolean; errors: z.ZodError | null; validatedData: T | null } => {
  try {
    const schema = schemas[currentStep - 1]
    const validatedData = schema.parse(data)
    return { isValid: true, errors: null, validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, errors: error, validatedData: null }
    }
    throw error
  }
}

// Export validation error formatter
export const formatValidationErrors = (error: z.ZodError): Record<string, string> => {
  const formattedErrors: Record<string, string> = {}
  
  error.issues.forEach((err) => {
    const field = err.path.join('.')
    formattedErrors[field] = err.message
  })
  
  return formattedErrors
}

// Type exports for better TypeScript support
export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type StudentOnboardingInput = z.infer<typeof StudentOnboardingSchema>
export type MentorOnboardingInput = z.infer<typeof MentorOnboardingSchema>
export type CreateMentorSessionInput = z.infer<typeof CreateMentorSessionSchema>
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>
export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>
export type MentorSearchInput = z.infer<typeof MentorSearchSchema>
export type SessionSearchInput = z.infer<typeof SessionSearchSchema> 