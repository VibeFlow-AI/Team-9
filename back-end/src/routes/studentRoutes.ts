import { Router } from 'express';
import * as studentController from '../controllers/studentController';

const router = Router();

router.get('/:id', studentController.getStudentProfile);
router.post('/onboard', studentController.onboardStudent);
router.put('/:id', studentController.updateStudentProfile);
router.get('/:id/sessions', studentController.listStudentSessions);
router.get('/match-mentors', studentController.matchMentors);

export default router; 