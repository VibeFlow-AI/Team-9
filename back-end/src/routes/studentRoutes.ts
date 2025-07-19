import { Router } from 'express'
import {
  getStudentProfile,
  onboardStudent,
  updateStudentProfile,
  getStudentSessions,
  getMatchingMentors
} from '../controllers/studentController'

const router = Router()

// Student profile endpoints
router.get('/:id', getStudentProfile)
router.post('/onboard', onboardStudent)
router.put('/:id', updateStudentProfile)

// Student sessions
router.get('/:id/sessions', getStudentSessions)

// AI mentor matching
router.get('/match-mentors', getMatchingMentors)

export default router 