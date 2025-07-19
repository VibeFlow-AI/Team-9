import { Router } from 'express'
import {
  bookSession,
  getSessionDetails,
  uploadBankSlip,
  getStudentSessions,
  getMentorSessions
} from '../controllers/sessionController'

const router = Router()

// Session booking endpoints
router.post('/book', bookSession)
router.get('/:id', getSessionDetails)
router.put('/:id/upload', uploadBankSlip)

// User-specific sessions
router.get('/student/:id', getStudentSessions)
router.get('/mentor/:id', getMentorSessions)

export default router 