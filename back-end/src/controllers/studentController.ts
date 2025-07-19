import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { auth } from '../lib/auth'
import { 
  StudentOnboardingSchema,
  ObjectIdSchema
} from '../schemas/validation.schemas'
import { log } from '../config/logger.config'
import { fromNodeHeaders } from 'better-auth/node'
import type { 
  StudentResponse,
  ApiResponse 
} from '../types/api.types'
import type { MentorCompatibility } from '../types/database.types'

// Get student profile
export const getStudentProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = ObjectIdSchema.parse(req.params.id)
    
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        subjectSkills: true,
        bookings: {
          include: {
            mentor: {
              include: { user: true }
            },
            mentorSession: true,
            payment: true,
            review: true
          }
        }
      }
    })

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      })
    }

    log.info('Student profile retrieved', { studentId: id })

    res.json({
      success: true,
      data: student
    } as StudentResponse)

  } catch (error) {
    log.error('Failed to get student profile', error, { studentId: req.params.id })
    next(error)
  }
}

// Multi-part student onboarding
export const onboardStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get current user from better-auth session
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const validatedData = StudentOnboardingSchema.parse(req.body)

    // Check if student profile already exists
    const existingStudent = await prisma.student.findUnique({
      where: { userId: session.user.id }
    })

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student profile already exists'
      })
    }

    // Create student profile with subject skills
    const student = await prisma.student.create({
      data: {
        userId: session.user.id,
        age: validatedData.age,
        contactNumber: validatedData.contactNumber,
        educationLevel: validatedData.educationLevel,
        school: validatedData.school,
        currentYear: validatedData.currentYear,
        subjectsOfInterest: validatedData.subjectsOfInterest,
        preferredLearningStyle: validatedData.preferredLearningStyle,
        hasLearningDisabilities: validatedData.hasLearningDisabilities,
        learningAccommodations: validatedData.learningAccommodations,
        subjectSkills: {
          create: validatedData.subjectSkills.map(skill => ({
            subject: skill.subject,
            skillLevel: skill.skillLevel
          }))
        }
      },
      include: {
        user: true,
        subjectSkills: true
      }
    })

    log.info('Student onboarded successfully', { 
      studentId: student.id, 
      userId: session.user.id,
      subjects: validatedData.subjectsOfInterest 
    })

    res.status(201).json({
      success: true,
      data: student,
      message: 'Student profile created successfully'
    } as any)

  } catch (error) {
    log.error('Student onboarding failed', error)
    next(error)
  }
}

// Update student profile
export const updateStudentProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = ObjectIdSchema.parse(req.params.id)
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
    
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    // Check if student exists and belongs to current user
    const existingStudent = await prisma.student.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      })
    }

    if (existingStudent.userId !== session.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    // Update student profile
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        ...req.body,
        updatedAt: new Date()
      },
      include: {
        user: true,
        subjectSkills: true
      }
    })

    log.info('Student profile updated', { studentId: id })

    res.json({
      success: true,
      data: updatedStudent
    } as StudentResponse)

  } catch (error) {
    log.error('Failed to update student profile', error, { studentId: req.params.id })
    next(error)
  }
}

// Get student's booked sessions
export const getStudentSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = ObjectIdSchema.parse(req.params.id)
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
    
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const bookings = await prisma.booking.findMany({
      where: { studentId: id },
      include: {
        mentor: {
          include: { user: true }
        },
        mentorSession: true,
        payment: true,
        review: true
      },
      orderBy: { scheduledDateTime: 'asc' }
    })

    log.info('Student sessions retrieved', { 
      studentId: id, 
      sessionCount: bookings.length 
    })

    res.json({
      success: true,
      data: bookings
    })

  } catch (error) {
    log.error('Failed to get student sessions', error, { studentId: req.params.id })
    next(error)
  }
}

// Get AI-matched mentor recommendations
export const getMatchingMentors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
    
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    // Get student profile
    const student = await prisma.student.findUnique({
      where: { userId: session.user.id },
      include: { subjectSkills: true }
    })

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      })
    }

    // Get all active mentors with their sessions
    const mentors = await prisma.mentor.findMany({
      where: { isActive: true },
      include: {
        user: true,
        mentorSessions: {
          where: { isActive: true },
          include: { reviews: true }
        }
      }
    })

    // Simple matching algorithm based on subjects and education level
    const matches: any[] = mentors.map(mentor => {
      let compatibilityScore = 0
      const matchingFactors: string[] = []

      // Subject matching
      const commonSubjects = student.subjectsOfInterest.filter(subject => 
        mentor.subjectsToTeach.includes(subject)
      )
      compatibilityScore += commonSubjects.length * 30

      if (commonSubjects.length > 0) {
        matchingFactors.push(`Common subjects: ${commonSubjects.join(', ')}`)
      }

      // Education level matching
      if (mentor.preferredStudentLevels.includes(student.educationLevel)) {
        compatibilityScore += 25
        matchingFactors.push('Education level match')
      }

      // Experience bonus
      const experienceMap = {
        'NONE': 5,
        'ONE_TO_THREE_YEARS': 15,
        'THREE_TO_FIVE_YEARS': 20,
        'FIVE_PLUS_YEARS': 25
      }
      compatibilityScore += experienceMap[mentor.teachingExperience] || 0

      // Rating bonus
      if (mentor.averageRating) {
        compatibilityScore += mentor.averageRating * 5
        matchingFactors.push(`High rating: ${mentor.averageRating.toFixed(1)} stars`)
      }

      return {
        mentor: mentor,
        compatibilityScore,
        matchingFactors,
        availableSessions: mentor.mentorSessions,
        reasonsToChoose: [
          `${mentor.totalSessions} completed sessions`,
          `Teaches ${mentor.subjectsToTeach.join(', ')}`,
          `${mentor.teachingExperience.replace(/_/g, ' ').toLowerCase()} experience`
        ].filter(Boolean)
      }
    })

    // Sort by compatibility score and limit to top 10
    const topMatches = matches
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 10)

    log.info('Mentor matching completed', { 
      studentId: student.id,
      totalMentors: mentors.length,
      topMatches: topMatches.length,
      topScore: topMatches[0]?.compatibilityScore || 0
    })

    res.json({
      success: true,
      data: {
        matches: topMatches,
        totalMatches: topMatches.length,
        algorithm: 'subject-education-experience-rating',
        calculatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    log.error('Failed to get mentor matches', error)
    next(error)
  }
} 