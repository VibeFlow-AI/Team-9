import { Router } from 'express';
import { register, login, getProfile, requireAuth } from '../controllers/userController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', requireAuth, getProfile);

export default router; 