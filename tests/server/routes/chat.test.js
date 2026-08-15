// ABOUTME: Tests for the chat endpoint (Step 10) - POST /api/chat
// ABOUTME: Verifies request validation, Claude service integration, and error mapping

import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

// Mock the Claude CLI service so we don't spawn a real process
vi.mock('../../../server/services/claude.js', () => ({
  sendMessage: vi.fn()
}))

import { sendMessage } from '../../../server/services/claude.js'
import { createApp } from '../../../server/testApp.js'
import chatRouter from '../../../server/routes/chat.js'

describe('Chat Endpoint', () => {
  let app

  beforeEach(() => {
    vi.clearAllMocks()
    // Build a fresh app with only the chat router mounted for these tests
    app = createApp(chatRouter)
  })

  describe('POST /api/chat', () => {
    it('should return 200 and the service response for a valid message', async () => {
      sendMessage.mockResolvedValue({
        response: 'Hello from Claude',
        session_id: 'sess-123'
      })

      const response = await request(app)
        .post('/api/chat')
        .send({ message: 'Hello' })

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        success: true,
        response: 'Hello from Claude',
        sessionId: 'sess-123'
      })
      expect(sendMessage).toHaveBeenCalledWith('Hello', expect.objectContaining({}))
    })

    it('should forward a sessionId to the Claude service', async () => {
      sendMessage.mockResolvedValue({
        response: 'Reply',
        session_id: 'sess-456'
      })

      await request(app)
        .post('/api/chat')
        .send({ message: 'Continue', sessionId: 'sess-456' })

      expect(sendMessage).toHaveBeenCalledWith('Continue', expect.objectContaining({ sessionId: 'sess-456' }))
    })

    it('should return 400 for a missing message', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({})

      expect(response.status).toBe(400)
      expect(response.body.error).toBeDefined()
      expect(sendMessage).not.toHaveBeenCalled()
    })

    it('should return 400 for an empty or whitespace-only message', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({ message: '   ' })

      expect(response.status).toBe(400)
    })

    it('should return 400 for a non-string message', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({ message: 42 })

      expect(response.status).toBe(400)
    })

    it('should return 400 for a message over the 10k char limit', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({ message: 'x'.repeat(10001) })

      expect(response.status).toBe(400)
    })

    it('should return 400 for a non-string sessionId', async () => {
      sendMessage.mockResolvedValue({ response: 'r', session_id: 's' })

      const response = await request(app)
        .post('/api/chat')
        .send({ message: 'Hi', sessionId: 123 })

      expect(response.status).toBe(400)
    })

    it('should map a timeout to 504', async () => {
      sendMessage.mockRejectedValue(new Error('Claude CLI request timed out'))

      const response = await request(app)
        .post('/api/chat')
        .send({ message: 'Hello' })

      expect(response.status).toBe(504)
    })

    it('should map a CLI process failure to 502', async () => {
      sendMessage.mockRejectedValue(new Error('Claude CLI error: boom'))

      const response = await request(app)
        .post('/api/chat')
        .send({ message: 'Hello' })

      expect(response.status).toBe(502)
    })

    it('should return 500 via error middleware for unexpected errors', async () => {
      sendMessage.mockRejectedValue(new Error('something unexpected'))

      const response = await request(app)
        .post('/api/chat')
        .send({ message: 'Hello' })

      expect(response.status).toBe(500)
    })
  })
})
