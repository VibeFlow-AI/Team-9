import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getStudentDashboard = async (req: Request, res: Response) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        subjectSkills: true,
        bookings: {
          include: {
            mentor: { include: { user: true } },
            mentorSession: true,
            payment: true,
            review: true,
          },
          orderBy: { scheduledDateTime: 'desc' },
        },
      },
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    // Calculate statistics
    const totalBookings = student.bookings.length;
    const completedSessions = student.bookings.filter(b => b.status === 'COMPLETED').length;
    const upcomingSessions = student.bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.scheduledDateTime) > new Date()).length;
    const pendingSessions = student.bookings.filter(b => b.status === 'PENDING').length;
    const totalSpent = student.bookings.reduce((sum, b) => sum + (b.payment?.amount || 0), 0);
    const averageSessionRating = student.bookings.reduce((sum, b) => sum + (b.review?.rating || 0), 0) / (student.bookings.filter(b => b.review).length || 1);
    res.json({
      student,
      statistics: {
        totalBookings,
        completedSessions,
        upcomingSessions,
        pendingSessions,
        totalSpent,
        averageSessionRating,
      },
      recentBookings: student.bookings.slice(0, 5),
      // Add more fields as needed
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student dashboard', error });
  }
};

export const getMentorDashboard = async (req: Request, res: Response) => {
  try {
    const mentor = await prisma.mentor.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        mentorSessions: true,
        bookings: {
          include: {
            student: { include: { user: true } },
            mentorSession: true,
            payment: true,
            review: true,
          },
          orderBy: { scheduledDateTime: 'desc' },
        },
        reviews: {
          include: {
            student: { include: { user: true } },
          },
        },
      },
    });
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });
    // Calculate statistics
    const totalBookings = mentor.bookings.length;
    const completedSessions = mentor.bookings.filter(b => b.status === 'COMPLETED').length;
    const upcomingSessions = mentor.bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.scheduledDateTime) > new Date()).length;
    const pendingSessions = mentor.bookings.filter(b => b.status === 'PENDING').length;
    const totalEarnings = mentor.bookings.reduce((sum, b) => sum + (b.payment?.amount || 0), 0);
    const averageRating = mentor.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / (mentor.reviews.length || 1);
    res.json({
      mentor,
      statistics: {
        totalBookings,
        completedSessions,
        upcomingSessions,
        pendingSessions,
        totalEarnings,
        averageRating,
      },
      recentBookings: mentor.bookings.slice(0, 5),
      // Add more fields as needed
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentor dashboard', error });
  }
}; 