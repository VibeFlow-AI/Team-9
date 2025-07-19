import { Router } from 'express'
import {
  getMentorProfile,
  onboardMentor,
  updateMentorProfile,
  getMentorSessions,
  createMentorSession,
  getAllMentorSessions
} from '../controllers/mentorController'

const router = Router()

// Mentor profile endpoints
router.get('/:id', getMentorProfile)
router.post('/onboard', onboardMentor)
router.put('/:id', updateMentorProfile)

// Mentor sessions
router.get('/:id/sessions', getMentorSessions)
router.post('/sessions', createMentorSession)
router.get('/sessions/all', getAllMentorSessions)

export default router 