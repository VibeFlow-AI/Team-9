import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { auth } from '../lib/auth'
import { 
  MentorOnboardingSchema,
  ObjectIdSchema
} from '../schemas/validation.schemas'
import { log } from '../config/logger.config'
import { fromNodeHeaders } from 'better-auth/node'
import type { 
  MentorResponse,
  ApiResponse
} from '../types/api.types'

// Get mentor profile
export const getMentorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = ObjectIdSchema.parse(req.params.id)
    
    const mentor = await prisma.mentor.findUnique({
      where: { id },
      include: {
        user: true,
        mentorSessions: {
          include: {
            bookings: {
              include: {
                student: {
                  include: { user: true }
                },
                payment: true,
                review: true
              }
            }
          }
        },
        reviews: {
          include: {
            student: {
              include: { user: true }
            }
          }
        }
      }
    })

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      })
    }

    log.info('Mentor profile retrieved', { mentorId: id })

    res.json({
      success: true,
      data: mentor
    } as MentorResponse)

  } catch (error) {
    log.error('Failed to get mentor profile', error, { mentorId: req.params.id })
    next(error)
  }
}

// Multi-part mentor onboarding
export const onboardMentor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get current user from better-auth session
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const validatedData = MentorOnboardingSchema.parse(req.body)

    // Check if mentor profile already exists
    const existingMentor = await prisma.mentor.findUnique({
      where: { userId: session.user.id }
    })

    if (existingMentor) {
      return res.status(400).json({
        success: false,
        message: 'Mentor profile already exists'
      })
    }

    // Create mentor profile
    const mentor = await prisma.mentor.create({
      data: {
        userId: session.user.id,
        age: validatedData.age,
        contactNumber: validatedData.contactNumber,
        preferredLanguage: validatedData.preferredLanguage,
        currentLocation: validatedData.currentLocation,
        shortBio: validatedData.shortBio,
        professionalRole: validatedData.professionalRole,
        subjectsToTeach: validatedData.subjectsToTeach,
        teachingExperience: validatedData.teachingExperience,
        preferredStudentLevels: validatedData.preferredStudentLevels,
        linkedinProfile: validatedData.linkedinProfile,
        githubPortfolio: validatedData.githubPortfolio,
        profilePictureUrl: validatedData.profilePictureUrl,
        isActive: true,
        totalSessions: 0
      },
      include: {
        user: true
      }
    })

    log.info('Mentor onboarded successfully', { 
      mentorId: mentor.id, 
      userId: session.user.id,
      subjects: validatedData.subjectsToTeach 
    })

    res.status(201).json({
      success: true,
      data: mentor,
      message: 'Mentor profile created successfully'
    } as any)

  } catch (error) {
    log.error('Mentor onboarding failed', error)
    next(error)
  }
}

// Update mentor profile
export const updateMentorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = ObjectIdSchema.parse(req.params.id)
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
    
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    // Check if mentor exists and belongs to current user
    const existingMentor = await prisma.mentor.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!existingMentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      })
    }

    if (existingMentor.userId !== session.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    // Update mentor profile
    const updatedMentor = await prisma.mentor.update({
      where: { id },
      data: {
        ...req.body,
        updatedAt: new Date()
      },
      include: {
        user: true,
        mentorSessions: true
      }
    })

    log.info('Mentor profile updated', { mentorId: id })

    res.json({
      success: true,
      data: updatedMentor
    } as MentorResponse)

  } catch (error) {
    log.error('Failed to update mentor profile', error, { mentorId: req.params.id })
    next(error)
  }
}

// Get mentor's booked sessions
export const getMentorSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = ObjectIdSchema.parse(req.params.id)
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
    
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    // Verify mentor ownership
    const mentor = await prisma.mentor.findUnique({
      where: { id }
    })

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      })
    }

    if (mentor.userId !== session.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    const bookings = await prisma.booking.findMany({
      where: { mentorId: id },
      include: {
        student: {
          include: { user: true }
        },
        mentorSession: true,
        payment: true,
        review: true
      },
      orderBy: { scheduledDateTime: 'asc' }
    })

    log.info('Mentor sessions retrieved', { 
      mentorId: id, 
      sessionCount: bookings.length 
    })

    res.json({
      success: true,
      data: bookings
    })

  } catch (error) {
    log.error('Failed to get mentor sessions', error, { mentorId: req.params.id })
    next(error)
  }
}

// Create a new mentor session
export const createMentorSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
    
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    // Get mentor profile
    const mentor = await prisma.mentor.findUnique({
      where: { userId: session.user.id }
    })

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found'
      })
    }

    const mentorSession = await prisma.mentorSession.create({
      data: {
        mentorId: mentor.id,
        title: req.body.title,
        description: req.body.description,
        subject: req.body.subject,
        tags: req.body.tags,
        price: req.body.price,
        availableSlots: req.body.availableSlots.map((slot: string) => new Date(slot)),
        isActive: true,
        totalBookings: 0
      },
      include: {
        mentor: {
          include: { user: true }
        }
      }
    })

    log.info('Mentor session created', { 
      sessionId: mentorSession.id, 
      mentorId: mentor.id,
      subject: mentorSession.subject 
    })

    res.status(201).json({
      success: true,
      data: mentorSession,
      message: 'Mentor session created successfully'
    })

  } catch (error) {
    log.error('Failed to create mentor session', error)
    next(error)
  }
}

// Get all available mentor sessions for booking
export const getAllMentorSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const subject = req.query.subject as string
    const skip = (page - 1) * limit

    const where = {
      isActive: true,
      ...(subject && { subject: { contains: subject, mode: 'insensitive' as const } })
    }

    const [mentorSessions, totalCount] = await Promise.all([
      prisma.mentorSession.findMany({
        where,
        include: {
          mentor: {
            include: { user: true }
          },
          reviews: {
            include: {
              student: {
                include: { user: true }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.mentorSession.count({ where })
    ])

    log.info('Mentor sessions retrieved', { 
      page,
      limit,
      totalCount,
      sessionCount: mentorSessions.length 
    })

    res.json({
      success: true,
      data: mentorSessions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
        limit
      }
    })

  } catch (error) {
    log.error('Failed to get mentor sessions', error)
    next(error)
  }
} 