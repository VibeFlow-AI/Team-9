import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { auth } from '../lib/auth'
import { 
  BookSessionSchema,
  ObjectIdSchema
} from '../schemas/validation.schemas'
import { log } from '../config/logger.config'
import { generalUpload } from '../config/multer.config'
import { fromNodeHeaders } from 'better-auth/node'
import type { 
  BookingResponse,
  ApiResponse
} from '../types/api.types'

// Book a mentor session
export const bookSession = async (req: Request, res: Response, next: NextFunction) => {
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
      where: { userId: session.user.id }
    })

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      })
    }

    const validatedData = BookSessionSchema.parse(req.body)

    // Check if mentor session exists and is active
    const mentorSession = await prisma.mentorSession.findUnique({
      where: { id: validatedData.mentorSessionId },
      include: { mentor: true }
    })

    if (!mentorSession || !mentorSession.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Mentor session not found or inactive'
      })
    }

    // Check if the selected time slot is available
    const selectedSlot = new Date(validatedData.scheduledDateTime)
    const isSlotAvailable = mentorSession.availableSlots.some(
      slot => Math.abs(slot.getTime() - selectedSlot.getTime()) < 60000 // 1 minute tolerance
    )

    if (!isSlotAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is not available'
      })
    }

    // Check for conflicting bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        mentorSessionId: validatedData.mentorSessionId,
        scheduledDateTime: selectedSlot,
        status: { notIn: ['CANCELLED'] }
      }
    })

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: 'Time slot already booked'
      })
    }

    // Create booking with payment
    const booking = await prisma.booking.create({
      data: {
        studentId: student.id,
        mentorId: mentorSession.mentorId,
        mentorSessionId: validatedData.mentorSessionId,
        scheduledDateTime: selectedSlot,
        status: 'PENDING',
        sessionNotes: validatedData.notes,
        payment: {
          create: {
            amount: mentorSession.price,
            status: 'PENDING'
          }
        }
      },
      include: {
        student: {
          include: { user: true }
        },
        mentor: {
          include: { user: true }
        },
        mentorSession: true,
        payment: true
      }
    })

    // Update mentor session booking count
    await prisma.mentorSession.update({
      where: { id: validatedData.mentorSessionId },
      data: { totalBookings: { increment: 1 } }
    })

    // Update mentor total sessions
    await prisma.mentor.update({
      where: { id: mentorSession.mentorId },
      data: { totalSessions: { increment: 1 } }
    })

    log.info('Session booked successfully', { 
      bookingId: booking.id,
      studentId: student.id,
      mentorId: mentorSession.mentorId,
      sessionId: validatedData.mentorSessionId
    })

          res.status(201).json({
        success: true,
        data: booking,
        message: 'Session booked successfully. Please complete payment.'
      } as any)

  } catch (error) {
    log.error('Failed to book session', error)
    next(error)
  }
}

// Get session details
export const getSessionDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = ObjectIdSchema.parse(req.params.id)
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
    
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        student: {
          include: { user: true }
        },
        mentor: {
          include: { user: true }
        },
        mentorSession: true,
        payment: true,
        review: true
      }
    })

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      })
    }

    // Check access rights - user must be either the student or mentor
    const userStudent = await prisma.student.findUnique({ where: { userId: session.user.id } })
    const userMentor = await prisma.mentor.findUnique({ where: { userId: session.user.id } })

    const hasAccess = 
      (userStudent && booking.studentId === userStudent.id) ||
      (userMentor && booking.mentorId === userMentor.id)

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    log.info('Session details retrieved', { bookingId: id })

    res.json({
      success: true,
      data: booking
    } as BookingResponse)

  } catch (error) {
    log.error('Failed to get session details', error, { bookingId: req.params.id })
    next(error)
  }
}

// Upload bank slip for payment
export const uploadBankSlip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = ObjectIdSchema.parse(req.params.id)
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
    
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    // Get student profile
    const student = await prisma.student.findUnique({
      where: { userId: session.user.id }
    })

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      })
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { payment: true }
    })

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }

    if (booking.studentId !== student.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    if (booking.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Payment not required for this booking'
      })
    }

    // Handle file upload - cast to any to fix middleware type issue
    const uploadMiddleware = (generalUpload as any).single('bankSlip')
    
    uploadMiddleware(req, res, async (error: any) => {
      if (error) {
        log.error('File upload failed', error)
        return res.status(400).json({
          success: false,
          message: 'File upload failed'
        })
      }

      const file = req.file
      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        })
      }

      try {
        // Create or update payment record
        const payment = await prisma.payment.upsert({
          where: { bookingId: id },
          update: {
            bankSlipUrl: file.path,
            status: 'PENDING',
            updatedAt: new Date()
          },
          create: {
            bookingId: id,
            amount: booking.payment?.amount || 100, // Default amount
            status: 'PENDING',
            bankSlipUrl: file.path
          }
        })

        // Update booking status
        await prisma.booking.update({
          where: { id },
          data: { 
            status: 'CONFIRMED',
            updatedAt: new Date()
          }
        })

        log.info('Bank slip uploaded successfully', { 
          bookingId: id,
          paymentId: payment.id,
          filePath: file.path
        })

        res.json({
          success: true,
          data: {
            payment,
            uploadedFile: {
              originalName: file.originalname,
              fileName: file.filename,
              path: file.path,
              size: file.size
            }
          },
          message: 'Bank slip uploaded successfully. Payment verification in progress.'
        })

      } catch (dbError) {
        log.error('Failed to save payment record', dbError)
        next(dbError)
      }
    })

  } catch (error) {
    log.error('Failed to upload bank slip', error, { bookingId: req.params.id })
    next(error)
  }
}

// Get all sessions for a student
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

    // Verify student ownership
    const student = await prisma.student.findUnique({ where: { id } })
    if (!student || student.userId !== session.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
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
      orderBy: { scheduledDateTime: 'desc' }
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

// Get all sessions for a mentor
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
    const mentor = await prisma.mentor.findUnique({ where: { id } })
    if (!mentor || mentor.userId !== session.user.id) {
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
      orderBy: { scheduledDateTime: 'desc' }
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