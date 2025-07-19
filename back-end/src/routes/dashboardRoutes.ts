import { Router } from 'express'
import {
  getStudentDashboard,
  getMentorDashboard
} from '../controllers/dashboardController'

const router = Router()

// Dashboard endpoints
router.get('/student/:id', getStudentDashboard)
router.get('/mentor/:id', getMentorDashboard)

export default router 