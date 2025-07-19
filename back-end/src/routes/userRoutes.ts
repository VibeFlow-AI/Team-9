import { Router } from 'express';
import { register, login, getProfile, requireAuth } from '../controllers/userController';
import { onboardStudent } from '../controllers/studentController';
import { onboardMentor } from '../controllers/mentorController';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', requireAuth, getProfile);
router.patch('/role', requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const { role } = req.body;
  
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if (!role || !['STUDENT', 'MENTOR'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });
    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update role', error });
  }
});

router.post('/student/onboard', requireAuth, onboardStudent);
router.post('/mentor/onboard', requireAuth, onboardMentor);

export default router; 