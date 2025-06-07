// ABOUTME: Tests for the health check endpoint to verify API availability
// ABOUTME: Ensures the endpoint returns proper status and timestamp

import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { app, addErrorHandling } from '../../../server/app.js'
import healthRouter from '../../../server/routes/health.js'

describe('Health Check Endpoint', () => {
  beforeAll(() => {
    // Mount the health router
    app.use('/api', healthRouter)
    // Add error handling after routes
    addErrorHandling()
  })

  describe('GET /api/health', () => {
    it('should return 200 status code', async () => {
      const response = await request(app)
        .get('/api/health')
      
      expect(response.status).toBe(200)
    })

    it('should return status: "ok"', async () => {
      const response = await request(app)
        .get('/api/health')
      
      expect(response.body).toHaveProperty('status')
      expect(response.body.status).toBe('ok')
    })

    it('should return a timestamp', async () => {
      const response = await request(app)
        .get('/api/health')
      
      expect(response.body).toHaveProperty('timestamp')
      expect(typeof response.body.timestamp).toBe('string')
    })

    it('should return valid ISO date timestamp', async () => {
      const response = await request(app)
        .get('/api/health')
      
      const timestamp = response.body.timestamp
      const date = new Date(timestamp)
      
      // Check if date is valid
      expect(date instanceof Date).toBe(true)
      expect(isNaN(date.getTime())).toBe(false)
      
      // Check if it's in ISO format
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
    })

    it('should return JSON content type', async () => {
      const response = await request(app)
        .get('/api/health')
      
      expect(response.headers['content-type']).toMatch(/application\/json/)
    })
  })

  describe('Route Integration', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
      
      expect(response.status).toBe(404)
    })

    it('should handle method not allowed', async () => {
      const response = await request(app)
        .post('/api/health')
        .send({ test: 'data' })
      
      expect(response.status).toBe(404)
    })

    it('should be accessible at the correct path', async () => {
      // Test that health is not available at root
      const rootResponse = await request(app)
        .get('/health')
      
      expect(rootResponse.status).toBe(404)
      
      // Test that it is available at /api/health
      const apiResponse = await request(app)
        .get('/api/health')
      
      expect(apiResponse.status).toBe(200)
    })
  })
})