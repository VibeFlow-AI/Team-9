import { Router } from 'express';
import * as mentorController from '../controllers/mentorController';

const router = Router();

router.get('/:id', mentorController.getMentorProfile);
router.post('/onboard', mentorController.onboardMentor);
router.put('/:id', mentorController.updateMentorProfile);
router.get('/:id/sessions', mentorController.listMentorSessions);

export default router; 