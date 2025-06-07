// ABOUTME: Health check endpoint router for API availability monitoring
// ABOUTME: Returns OK status with current timestamp in ISO format

import { Router } from 'express'

const router = Router()

// GET /api/health - Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

export default router