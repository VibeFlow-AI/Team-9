import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { auth } from '../lib/auth'
import { ObjectIdSchema } from '../schemas/validation.schemas'
import { log } from '../config/logger.config'
import { fromNodeHeaders } from 'better-auth/node'
import type { 
  ApiResponse,
  StudentDashboard,
  MentorDashboard
} from '../types/api.types'

// Get student dashboard data
export const getStudentDashboard = async (req: Request, res: Response, next: NextFunction) => {
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
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        subjectSkills: true
      }
    })

    if (!student || student.userId !== session.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    // Get bookings with all related data
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

    // Calculate statistics
    const totalBookings = bookings.length
    const completedSessions = bookings.filter(b => b.status === 'COMPLETED').length
    const upcomingSessions = bookings.filter(b => 
      b.status === 'CONFIRMED' && new Date(b.scheduledDateTime) > new Date()
    ).length
    const pendingSessions = bookings.filter(b => 
      ['PENDING_PAYMENT', 'PAYMENT_PENDING_VERIFICATION'].includes(b.status)
    ).length

    // Calculate total spent
    const totalSpent = bookings
      .filter(b => b.payment && b.payment.status === 'VERIFIED')
      .reduce((sum, b) => sum + (b.payment?.amount || 0), 0)

    // Get recent bookings (last 5)
    const recentBookings = bookings.slice(0, 5)

    // Get upcoming sessions (next 3)
    const upcomingBookings = bookings
      .filter(b => b.status === 'CONFIRMED' && new Date(b.scheduledDateTime) > new Date())
      .sort((a, b) => new Date(a.scheduledDateTime).getTime() - new Date(b.scheduledDateTime).getTime())
      .slice(0, 3)

    // Get favorite subjects based on booking frequency
    const subjectBookings = bookings.reduce((acc, booking) => {
      const subject = booking.mentorSession.subject
      acc[subject] = (acc[subject] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const favoriteSubjects = Object.entries(subjectBookings)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([subject, count]) => ({ subject, sessionCount: count }))

    // Get learning progress based on completed sessions and reviews
    const completedBookingsWithReviews = bookings.filter(b => 
      b.status === 'COMPLETED' && b.review
    )

    const averageRating = completedBookingsWithReviews.length > 0
      ? completedBookingsWithReviews.reduce((sum, b) => sum + ((b.review as any)?.rating || 0), 0) / completedBookingsWithReviews.length
      : 0

    const dashboardData: StudentDashboard = {
      student: {
        id: student.id,
        name: student.user.name,
        email: student.user.email,
        profilePicture: student.user.image,
        educationLevel: student.educationLevel,
        school: student.school,
        subjectsOfInterest: student.subjectsOfInterest,
        memberSince: student.createdAt
      },
      statistics: {
        totalBookings,
        completedSessions,
        upcomingSessions,
        pendingSessions,
        totalSpent,
        averageSessionRating: averageRating
      },
      recentBookings: recentBookings.map(booking => ({
        id: booking.id,
        mentorName: booking.mentor.user.name,
        mentorProfilePicture: booking.mentor.user.image,
        sessionTitle: booking.mentorSession.title,
        subject: booking.mentorSession.subject,
        scheduledDateTime: booking.scheduledDateTime,
        status: booking.status,
        amount: booking.payment?.amount || 0,
        hasReview: !!booking.review
      })),
      upcomingSessions: upcomingBookings.map(booking => ({
        id: booking.id,
        mentorName: booking.mentor.user.name,
        mentorProfilePicture: booking.mentor.user.image,
        sessionTitle: booking.mentorSession.title,
        subject: booking.mentorSession.subject,
        scheduledDateTime: booking.scheduledDateTime,
        meetingLink: booking.meetingLink,
        notes: booking.bookingNotes
      })),
      favoriteSubjects,
      learningProgress: {
        completedHours: completedSessions, // Assuming 1 hour per session
        subjectProgress: student.subjectSkills.map(skill => ({
          subject: skill.subject,
          currentLevel: skill.skillLevel,
          sessionsCompleted: bookings.filter(b => 
            b.status === 'COMPLETED' && 
            b.mentorSession.subject.toLowerCase().includes(skill.subject.toLowerCase())
          ).length
        }))
      },
      recommendations: {
        suggestedMentors: [], // This would be populated by AI matching algorithm
        recommendedSessions: [],
        learningGoals: student.subjectsOfInterest.map(subject => ({
          subject,
          targetLevel: 'INTERMEDIATE', // Default suggestion
          estimatedHours: 10 // Default suggestion
        }))
      }
    }

    log.info('Student dashboard retrieved', { 
      studentId: id,
      totalBookings,
      completedSessions,
      upcomingSessions
    })

    res.json({
      success: true,
      data: dashboardData
    })

  } catch (error) {
    log.error('Failed to get student dashboard', error, { studentId: req.params.id })
    next(error)
  }
}

// Get mentor analytics and dashboard data
export const getMentorDashboard = async (req: Request, res: Response, next: NextFunction) => {
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
      where: { id },
      include: {
        user: true,
        mentorSessions: {
          include: {
            bookings: {
              include: {
                student: { include: { user: true } },
                payment: true,
                review: true
              }
            },
            reviews: {
              include: {
                student: { include: { user: true } }
              }
            }
          }
        }
      }
    })

    if (!mentor || mentor.userId !== session.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    // Get all bookings for this mentor
    const allBookings = mentor.mentorSessions.flatMap(session => session.bookings)

    // Calculate statistics
    const totalBookings = allBookings.length
    const completedSessions = allBookings.filter(b => b.status === 'COMPLETED').length
    const upcomingSessions = allBookings.filter(b => 
      b.status === 'CONFIRMED' && new Date(b.scheduledDateTime) > new Date()
    ).length
    const pendingSessions = allBookings.filter(b => 
      ['PENDING_PAYMENT', 'PAYMENT_PENDING_VERIFICATION'].includes(b.status)
    ).length

    // Calculate earnings
    const totalEarnings = allBookings
      .filter(b => b.payment && b.payment.status === 'VERIFIED')
      .reduce((sum, b) => sum + (b.payment?.amount || 0), 0)

    const thisMonthEarnings = allBookings
      .filter(b => {
        const bookingMonth = new Date(b.scheduledDateTime)
        const currentMonth = new Date()
        return b.payment && 
               b.payment.status === 'VERIFIED' &&
               bookingMonth.getMonth() === currentMonth.getMonth() &&
               bookingMonth.getFullYear() === currentMonth.getFullYear()
      })
      .reduce((sum, b) => sum + (b.payment?.amount || 0), 0)

    // Calculate average rating
    const allReviews = mentor.mentorSessions.flatMap(session => session.reviews)
    const averageRating = allReviews.length > 0
      ? allReviews.reduce((sum, review) => sum + review.mentorRating, 0) / allReviews.length
      : 0

    // Get recent bookings
    const recentBookings = allBookings
      .sort((a, b) => new Date(b.scheduledDateTime).getTime() - new Date(a.scheduledDateTime).getTime())
      .slice(0, 5)

    // Get upcoming sessions
    const upcomingBookings = allBookings
      .filter(b => b.status === 'CONFIRMED' && new Date(b.scheduledDateTime) > new Date())
      .sort((a, b) => new Date(a.scheduledDateTime).getTime() - new Date(b.scheduledDateTime).getTime())
      .slice(0, 5)

    // Calculate monthly earnings for chart (last 6 months)
    const monthlyEarnings = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      const earnings = allBookings
        .filter(b => {
          const bookingDate = new Date(b.scheduledDateTime)
                     return b.payment && 
                  b.payment.status === 'VERIFIED' &&
                 bookingDate.getMonth() === date.getMonth() &&
                 bookingDate.getFullYear() === date.getFullYear()
        })
        .reduce((sum, b) => sum + (b.payment?.amount || 0), 0)
      
      monthlyEarnings.push({ month: monthName, earnings })
    }

    // Get top performing sessions
    const topSessions = mentor.mentorSessions
      .map(session => ({
        ...session,
        totalBookings: session.bookings.length,
        averageRating: session.reviews.length > 0
          ? session.reviews.reduce((sum, r) => sum + r.mentorRating, 0) / session.reviews.length
          : 0
      }))
      .sort((a, b) => b.totalBookings - a.totalBookings)
      .slice(0, 5)

    const dashboardData: MentorDashboard = {
      mentor: {
        id: mentor.id,
        name: mentor.user.name,
        email: mentor.user.email,
        profilePicture: mentor.profilePictureUrl || mentor.user.image,
        professionalRole: mentor.professionalRole,
        subjectsToTeach: mentor.subjectsToTeach,
        averageRating: mentor.averageRating || averageRating,
        totalSessions: mentor.totalSessions,
        memberSince: mentor.createdAt,
        isActive: mentor.isActive
      },
      statistics: {
        totalBookings,
        completedSessions,
        upcomingSessions,
        pendingSessions,
        totalEarnings,
        thisMonthEarnings,
        averageRating,
        totalStudents: new Set(allBookings.map(b => b.studentId)).size,
        activeSessions: mentor.mentorSessions.filter(s => s.isActive).length
      },
      recentBookings: recentBookings.map(booking => ({
        id: booking.id,
        studentName: booking.student.user.name,
        studentProfilePicture: booking.student.user.image,
        sessionTitle: booking.mentorSession.title,
        subject: booking.mentorSession.subject,
        scheduledDateTime: booking.scheduledDateTime,
        status: booking.status,
        amount: booking.totalAmount,
        hasReview: !!booking.review
      })),
      upcomingSessions: upcomingBookings.map(booking => ({
        id: booking.id,
        studentName: booking.student.user.name,
        studentProfilePicture: booking.student.user.image,
        sessionTitle: booking.mentorSession.title,
        subject: booking.mentorSession.subject,
        scheduledDateTime: booking.scheduledDateTime,
        meetingLink: booking.meetingLink,
        studentNotes: booking.bookingNotes
      })),
      analytics: {
        monthlyEarnings,
        popularSubjects: mentor.subjectsToTeach.map(subject => ({
          subject,
          bookings: allBookings.filter(b => 
            b.mentorSession.subject.toLowerCase().includes(subject.toLowerCase())
          ).length
        })).sort((a, b) => b.bookings - a.bookings),
        studentRetentionRate: allBookings.length > 0 
          ? (new Set(allBookings.map(b => b.studentId)).size / allBookings.length) * 100 
          : 0,
        peakHours: [] // This would require more complex analysis
      },
      topSessions: topSessions.map(session => ({
        id: session.id,
        title: session.title,
        subject: session.subject,
        totalBookings: session.totalBookings,
        averageRating: session.averageRating,
        price: session.price
      })),
      reviews: allReviews.slice(0, 10).map(review => ({
        id: review.id,
        studentName: review.student.user.name,
        rating: review.mentorRating,
        comment: review.reviewText,
        sessionTitle: review.booking?.mentorSession.title,
        createdAt: review.createdAt
      }))
    }

    log.info('Mentor dashboard retrieved', { 
      mentorId: id,
      totalBookings,
      completedSessions,
      totalEarnings,
      averageRating
    })

    res.json({
      success: true,
      data: dashboardData
    })

  } catch (error) {
    log.error('Failed to get mentor dashboard', error, { mentorId: req.params.id })
    next(error)
  }
} 