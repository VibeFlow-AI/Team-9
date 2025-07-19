import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { auth } from '../lib/auth';
import { fromNodeHeaders } from 'better-auth/node';

export const getMentorProfile = async (req: Request, res: Response) => {
  try {
    const mentor = await prisma.mentor.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        mentorSessions: {
          include: {
            bookings: {
              include: {
                student: { include: { user: true } },
                payment: true,
                review: true,
              },
            },
          },
        },
        reviews: {
          include: {
            student: { include: { user: true } },
          },
        },
      },
    });
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentor profile', error });
  }
};

export const onboardMentor = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session?.user) return res.status(401).json({ message: 'Unauthorized' });
    const existing = await prisma.mentor.findUnique({ where: { userId: session.user.id } });
    if (existing) return res.status(400).json({ message: 'Mentor already onboarded' });
    const mentor = await prisma.mentor.create({
      data: {
        userId: session.user.id,
        ...req.body,
      },
    });
    res.status(201).json(mentor);
  } catch (error) {
    res.status(500).json({ message: 'Error onboarding mentor', error });
  }
};

export const updateMentorProfile = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session?.user) return res.status(401).json({ message: 'Unauthorized' });
    const mentor = await prisma.mentor.update({
      where: { id: req.params.id, userId: session.user.id },
      data: req.body,
    });
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating mentor profile', error });
  }
};

export const listMentorSessions = async (req: Request, res: Response) => {
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