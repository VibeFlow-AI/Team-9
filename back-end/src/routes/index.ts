import { Router } from 'express'
import studentRoutes from './studentRoutes'
import mentorRoutes from './mentorRoutes'
import sessionRoutes from './sessionRoutes'
import dashboardRoutes from './dashboardRoutes'
import itemRoutes from './itemRoutes'

const router = Router()

// API v1 routes - following the base URL pattern from context.md
router.use('/students', studentRoutes)
router.use('/mentors', mentorRoutes)
router.use('/sessions', sessionRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/items', itemRoutes) // Existing route

export default router 