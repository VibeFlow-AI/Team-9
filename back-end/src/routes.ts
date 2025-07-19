import { Router } from 'express';
import studentRoutes from './routes/studentRoutes';
import mentorRoutes from './routes/mentorRoutes';
import sessionRoutes from './routes/sessionRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import userRoutes from './routes/userRoutes';

const router = Router();

router.use('/students', studentRoutes);
router.use('/mentors', mentorRoutes);
router.use('/sessions', sessionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);

export default router; 