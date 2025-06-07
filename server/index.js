// ABOUTME: Main server entry point that starts the Express application
// ABOUTME: Handles server startup with proper logging and error handling

import { app } from './app.js'
import { config } from './config.js'

// Start the server
const server = app.listen(config.port, config.host, () => {
  const { address, port } = server.address()
  console.log(`✅ Server running at http://${address}:${port}`)
  console.log(`📍 Environment: ${config.nodeEnv}`)
})

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})