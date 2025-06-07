// ABOUTME: Express application setup with middleware configuration
// ABOUTME: Exports configured app instance for testing and server startup

import express from 'express'
import cors from 'cors'
import { config } from './config.js'

// Create Express application
export const app = express()

// Configure CORS for local development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from localhost ports or no origin (same-origin requests)
    const allowedOrigins = [
      'http://localhost:5173',  // Vite dev server
      'http://localhost:5080',  // Production build
      `http://localhost:${config.port}`,
      `http://127.0.0.1:${config.port}`
    ]
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

// Apply middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Function to add error handling middleware (must be called after routes are added)
export function addErrorHandling() {
  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(err.status || 500).json({
      error: {
        message: err.message || 'Internal Server Error',
        ...(config.nodeEnv === 'development' && { stack: err.stack })
      }
    })
  })
}