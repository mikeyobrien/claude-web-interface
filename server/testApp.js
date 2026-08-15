// ABOUTME: Test-only Express app factory for isolated route testing
// ABOUTME: Builds a fresh app with JSON/CORS middleware, a mounted router, and error handling

import express from 'express'
import cors from 'cors'
import { addErrorHandling } from './app.js'

/**
 * Creates an isolated Express app with the given router(s) mounted under /api.
 * Mirrors the production app's middleware (JSON, CORS) so route tests exercise
 * realistic request handling without polluting the shared `app` singleton.
 * @param {...import('express').Router} routers - Routers to mount under /api
 * @returns {import('express').Express} A fresh app instance
 */
export function createApp(...routers) {
  const app = express()

  const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5080'
      ]
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true
  }

  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  for (const router of routers) {
    app.use('/api', router)
  }

  addErrorHandling()
  return app
}
