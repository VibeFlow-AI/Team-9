import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { auth } from '../lib/auth';
import { fromNodeHeaders } from 'better-auth/node';

export const bookSession = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session?.user) return res.status(401).json({ message: 'Unauthorized' });
    // Find student by userId
    const student = await prisma.student.findUnique({ where: { userId: session.user.id } });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    // Validate mentorSessionId and mentorId
    const { mentorSessionId, scheduledDateTime, sessionNotes } = req.body;
    const mentorSession = await prisma.mentorSession.findUnique({ where: { id: mentorSessionId } });
    if (!mentorSession) return res.status(404).json({ message: 'Mentor session not found' });
    const booking = await prisma.booking.create({
      data: {
        studentId: student.id,
        mentorId: mentorSession.mentorId,
        mentorSessionId,
        scheduledDateTime: new Date(scheduledDateTime),
        sessionNotes,
      },
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error booking session', error });
  }
};

export const getSessionDetails = async (req: Request, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        student: { include: { user: true } },
        mentor: { include: { user: true } },
        mentorSession: true,
        payment: true,
        review: true,
      },
    });
    if (!booking) return res.status(404).json({ message: 'Session not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching session details', error });
  }
};

export const uploadBankSlip = async (req: Request, res: Response) => {
  // This assumes a file upload middleware is used before this handler
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // Simulate file upload: req.file should be set by multer
    const { file } = req as unknown as { file: Express.Multer.File };
    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    const payment = await prisma.payment.upsert({
      where: { bookingId: booking.id },
      update: {
        bankSlipUrl: file.path,
        bankSlipName: file.originalname,
        status: 'PENDING',
      },
      create: {
        bookingId: booking.id,
        amount: 0, // Should be set appropriately
        status: 'PENDING',
        currency: 'USD',
        bankSlipUrl: file.path,
        bankSlipName: file.originalname,
      },
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading bank slip', error });
  }
};

export const getStudentSessions = async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.booking.findMany({
      where: { studentId: req.params.id },
      include: {
        mentor: { include: { user: true } },
        mentorSession: true,
        payment: true,
        review: true,
      },
      orderBy: { scheduledDateTime: 'desc' },
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student sessions', error });
  }
};

export const getMentorSessions = async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.booking.findMany({
      where: { mentorId: req.params.id },
      include: {
        student: { include: { user: true } },
        mentorSession: true,
        payment: true,
        review: true,
      },
      orderBy: { scheduledDateTime: 'desc' },
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentor sessions', error });
  }
}; 