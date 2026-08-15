// ABOUTME: Chat endpoint router (Step 10) - POST /api/chat
// ABOUTME: Validates the request, delegates to the Claude CLI service, maps errors to HTTP statuses

import { Router } from 'express'
import { sendMessage } from '../services/claude.js'

const router = Router()

const MAX_MESSAGE_LENGTH = 10000

/**
 * Validates the chat request body. Attaches errors to req.validationError on failure.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function validateChatRequest(req, res, next) {
  const { message, sessionId } = req.body || {}

  if (message === undefined || message === null) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Message is required' } })
  }

  if (typeof message !== 'string') {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Message must be a string' } })
  }

  if (!message.trim()) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Message cannot be empty' } })
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer` } })
  }

  if (sessionId !== undefined && sessionId !== null && typeof sessionId !== 'string') {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Session ID must be a string' } })
  }

  next()
}

/**
 * Maps a Claude service error to an HTTP status code.
 * @param {Error} error
 * @returns {number} The HTTP status
 */
function mapErrorStatus(error) {
  const msg = (error && error.message) || ''
  if (msg.includes('timed out')) return 504
  if (msg.includes('Claude CLI error') || msg.includes('Claude CLI exited') || msg.includes('Claude CLI process error')) return 502
  return 500
}

// POST /api/chat - Send a message to Claude and return the response
router.post('/chat', validateChatRequest, async (req, res, next) => {
  const { message, sessionId } = req.body

  try {
    const result = await sendMessage(message, { sessionId })
    res.status(200).json({
      success: true,
      response: result.response,
      sessionId: result.session_id || sessionId || null,
      metadata: result.metadata || null
    })
  } catch (error) {
    if (!error.status && error.isClaudeTimeout) {
      return res.status(504).json({ error: { code: 'CLAUDE_TIMEOUT', message: error.message } })
    }
    const status = error.status || mapErrorStatus(error)
    res.status(status).json({ error: { code: 'CLAUDE_ERROR', message: error.message } })
  }
})

export default router
