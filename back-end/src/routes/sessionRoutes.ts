import { Router } from 'express';
import * as sessionController from '../controllers/sessionController';

const router = Router();

router.post('/book', sessionController.bookSession);
router.get('/:id', sessionController.getSessionDetails);
router.put('/:id/upload', sessionController.uploadBankSlip);
router.get('/student/:id', sessionController.getStudentSessions);
router.get('/mentor/:id', sessionController.getMentorSessions);

export default router; 