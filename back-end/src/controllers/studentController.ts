import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getStudentProfile = async (req: Request, res: Response) => {
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
        },
      },
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student profile', error });
  }
};

export const onboardStudent = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const existing = await prisma.student.findUnique({ where: { userId } });
    if (existing) return res.status(400).json({ message: 'Student already onboarded' });
    const student = await prisma.student.create({
      data: {
        userId,
        ...req.body,
      },
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error onboarding student', error });
  }
};

export const updateStudentProfile = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const student = await prisma.student.findFirst({ where: { id: req.params.id, userId } });
    if (!student) return res.status(403).json({ message: 'Forbidden' });
    const updated = await prisma.student.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student profile', error });
  }
};

export const listStudentSessions = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const student = await prisma.student.findFirst({ where: { id: req.params.id, userId } });
    if (!student) return res.status(403).json({ message: 'Forbidden' });
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

export const matchMentors = async (req: Request, res: Response) => {
  // Public endpoint
  try {
    let subjects: string[] | undefined = undefined;
    if (req.query.subjectsOfInterest) {
      if (Array.isArray(req.query.subjectsOfInterest)) {
        subjects = req.query.subjectsOfInterest.map(String);
      } else {
        subjects = [String(req.query.subjectsOfInterest)];
      }
    }
    const mentors = await prisma.mentor.findMany({
      where: subjects ? { subjectsToTeach: { hasSome: subjects } } : {},
      include: { user: true },
      take: 10,
      orderBy: { averageRating: 'desc' },
    });
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Error matching mentors', error });
  }
}; 