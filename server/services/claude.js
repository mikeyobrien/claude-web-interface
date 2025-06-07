// ABOUTME: Claude CLI service for spawning and communicating with the Claude command-line interface
// ABOUTME: Handles process spawning, JSON parsing, error handling, and response validation

import childProcess from 'child_process'
const { spawn } = childProcess

/**
 * @typedef {Object} ClaudeResponse
 * @property {string} response - The text response from Claude
 * @property {string} [session_id] - Optional session ID for conversation continuity
 * @property {Object} [metadata] - Optional metadata about the response
 */

/**
 * @typedef {Object} SendMessageOptions
 * @property {string} [sessionId] - Session ID to continue a conversation
 * @property {number} [timeout=30000] - Request timeout in milliseconds
 */

/**
 * Sends a message to Claude CLI and returns the response
 * @param {string} message - The message to send to Claude
 * @param {SendMessageOptions} [options={}] - Options for the request
 * @returns {Promise<ClaudeResponse>} The response from Claude
 * @throws {Error} If the request fails or times out
 */
export async function sendMessage(message, options = {}) {
  // Validate inputs
  if (message === undefined || message === null) {
    throw new Error('Message is required')
  }
  
  if (typeof message !== 'string') {
    throw new Error('Message must be a string')
  }
  
  if (!message.trim()) {
    throw new Error('Message cannot be empty')
  }
  
  if (options !== null && typeof options !== 'object' || Array.isArray(options)) {
    throw new Error('Options must be an object')
  }
  
  if (options.timeout !== undefined && typeof options.timeout !== 'number') {
    throw new Error('Timeout must be a number')
  }
  
  if (options.sessionId !== undefined && typeof options.sessionId !== 'string') {
    throw new Error('Session ID must be a string')
  }
  
  const timeout = options.timeout || 30000
  
  return new Promise((resolve, reject) => {
    // Build command arguments
    const args = ['--output-format', 'json']
    
    if (options.sessionId) {
      args.push('--session-id', options.sessionId)
    }
    
    args.push(message)
    
    let stdout = ''
    let stderr = ''
    let processKilled = false
    let timeoutHandle = null
    
    try {
      // Spawn Claude process
      const claudeProcess = spawn('claude', args, {
        shell: false,
        timeout: timeout
      })
      
      // Set up timeout handler
      timeoutHandle = setTimeout(() => {
        processKilled = true
        claudeProcess.kill('SIGTERM')
        reject(new Error('Claude CLI request timed out'))
      }, timeout)
      
      // Handle stdout
      claudeProcess.stdout.setEncoding('utf8')
      claudeProcess.stdout.on('data', (chunk) => {
        stdout += chunk
      })
      
      // Handle stderr
      claudeProcess.stderr.setEncoding('utf8')
      claudeProcess.stderr.on('data', (chunk) => {
        stderr += chunk
      })
      
      // Handle process errors
      claudeProcess.on('error', (error) => {
        clearTimeout(timeoutHandle)
        reject(new Error(`Claude CLI process error: ${error.message}`))
      })
      
      // Handle process close
      claudeProcess.on('close', (code) => {
        clearTimeout(timeoutHandle)
        
        if (processKilled) {
          // Already rejected due to timeout
          return
        }
        
        if (code !== 0) {
          if (stderr) {
            reject(new Error(`Claude CLI error: ${stderr}`))
          } else {
            reject(new Error(`Claude CLI exited with code ${code}`))
          }
          return
        }
        
        // Parse JSON response
        try {
          const response = JSON.parse(stdout)
          
          // Validate response
          if (!response.response) {
            reject(new Error('Invalid Claude CLI response: missing response field'))
            return
          }
          
          resolve(response)
        } catch (error) {
          reject(new Error('Invalid JSON response from Claude CLI'))
        }
      })
    } catch (error) {
      clearTimeout(timeoutHandle)
      reject(new Error(`Failed to spawn Claude CLI process: ${error.message}`))
    }
  })
}