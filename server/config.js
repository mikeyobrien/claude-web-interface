// ABOUTME: Configuration module that loads environment variables with defaults
// ABOUTME: Provides centralized config for port, host, and other settings

import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

export const config = {
  port: parseInt(process.env.PORT) || 5080,
  host: process.env.HOST || '127.0.0.1',
  nodeEnv: process.env.NODE_ENV || 'development'
}