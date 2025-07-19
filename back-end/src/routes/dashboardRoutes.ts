import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';

const router = Router();

router.get('/student/:id', dashboardController.getStudentDashboard);
router.get('/mentor/:id', dashboardController.getMentorDashboard);

export default router; 