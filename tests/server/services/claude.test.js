// ABOUTME: Tests for Claude CLI service covering process spawning, response parsing, and error handling
// ABOUTME: Mocks child_process to test Claude integration without actual CLI calls

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock child_process module
vi.mock('child_process', () => ({
  default: {
    spawn: vi.fn()
  }
}))

import { sendMessage } from '../../../server/services/claude.js'
import childProcess from 'child_process'

describe('Claude Service', () => {
  let mockProcess
  
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
    
    // Create mock process object
    mockProcess = {
      stdout: {
        on: vi.fn(),
        setEncoding: vi.fn()
      },
      stderr: {
        on: vi.fn(),
        setEncoding: vi.fn()
      },
      on: vi.fn(),
      kill: vi.fn()
    }
    
    // Default spawn behavior
    childProcess.spawn.mockReturnValue(mockProcess)
  })
  
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('sendMessage', () => {
    it('should exist and be a function', () => {
      expect(sendMessage).toBeDefined()
      expect(typeof sendMessage).toBe('function')
    })
    
    it('should have mocked spawn', () => {
      expect(vi.isMockFunction(childProcess.spawn)).toBe(true)
    })

    it('should spawn claude process with correct arguments', async () => {
      const message = 'Hello, Claude!'
      
      // Setup mock to simulate successful response
      childProcess.spawn.mockImplementation(() => {
        // Simulate immediate response
        setTimeout(() => {
          mockProcess.stdout.on.mock.calls
            .find(call => call[0] === 'data')[1](
              JSON.stringify({ response: 'Hello!' })
            )
          mockProcess.on.mock.calls
            .find(call => call[0] === 'close')[1](0)
        }, 0)
        
        return mockProcess
      })
      
      await sendMessage(message)
      
      expect(childProcess.spawn).toHaveBeenCalledWith('claude', [
        '--output-format', 'json',
        message
      ], {
        shell: false,
        timeout: 30000
      })
    })

    it('should handle JSON response correctly', async () => {
      const mockResponse = {
        response: 'Hello! How can I help you today?',
        session_id: 'test-session-123',
        metadata: { version: '1.0' }
      }
      
      childProcess.spawn.mockImplementation(() => {
        setTimeout(() => {
          mockProcess.stdout.on.mock.calls
            .find(call => call[0] === 'data')[1](
              JSON.stringify(mockResponse)
            )
          mockProcess.on.mock.calls
            .find(call => call[0] === 'close')[1](0)
        }, 0)
        
        return mockProcess
      })
      
      const result = await sendMessage('Test message')
      
      expect(result).toEqual(mockResponse)
    })

    it('should handle session ID in options', async () => {
      const message = 'Continue conversation'
      const sessionId = 'existing-session-123'
      
      childProcess.spawn.mockImplementation(() => {
        setTimeout(() => {
          mockProcess.stdout.on.mock.calls
            .find(call => call[0] === 'data')[1](
              JSON.stringify({ response: 'Continuing...' })
            )
          mockProcess.on.mock.calls
            .find(call => call[0] === 'close')[1](0)
        }, 0)
        
        return mockProcess
      })
      
      await sendMessage(message, { sessionId })
      
      expect(childProcess.spawn).toHaveBeenCalledWith('claude', [
        '--output-format', 'json',
        '--session-id', sessionId,
        message
      ], {
        shell: false,
        timeout: 30000
      })
    })

    it('should escape special characters in message', async () => {
      const message = 'Test with "quotes" and $pecial characters'
      
      childProcess.spawn.mockImplementation(() => {
        setTimeout(() => {
          mockProcess.stdout.on.mock.calls
            .find(call => call[0] === 'data')[1](
              JSON.stringify({ response: 'Handled special chars' })
            )
          mockProcess.on.mock.calls
            .find(call => call[0] === 'close')[1](0)
        }, 0)
        
        return mockProcess
      })
      
      await sendMessage(message)
      
      // The message should be passed as-is since we're using spawn with shell: false
      expect(childProcess.spawn).toHaveBeenCalledWith('claude', [
        '--output-format', 'json',
        message
      ], expect.any(Object))
    })

    it('should collect stdout data chunks', async () => {
      const chunks = [
        '{"resp',
        'onse": "Hello",',
        ' "session_id": "123"}'
      ]
      
      childProcess.spawn.mockImplementation(() => {
        setTimeout(() => {
          // Send data in chunks
          chunks.forEach(chunk => {
            mockProcess.stdout.on.mock.calls
              .find(call => call[0] === 'data')[1](chunk)
          })
          mockProcess.on.mock.calls
            .find(call => call[0] === 'close')[1](0)
        }, 0)
        
        return mockProcess
      })
      
      const result = await sendMessage('Test')
      
      expect(result).toEqual({
        response: 'Hello',
        session_id: '123'
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle timeout', async () => {
      childProcess.spawn.mockImplementation(() => {
        // Never send close event to simulate timeout
        return mockProcess
      })
      
      await expect(sendMessage('Test', { timeout: 100 }))
        .rejects.toThrow('Claude CLI request timed out')
    })

    it('should handle invalid JSON response', async () => {
      childProcess.spawn.mockImplementation(() => {
        setTimeout(() => {
          mockProcess.stdout.on.mock.calls
            .find(call => call[0] === 'data')[1](
              'This is not valid JSON'
            )
          mockProcess.on.mock.calls
            .find(call => call[0] === 'close')[1](0)
        }, 0)
        
        return mockProcess
      })
      
      await expect(sendMessage('Test'))
        .rejects.toThrow('Invalid JSON response from Claude CLI')
    })

    it('should handle process spawn errors', async () => {
      childProcess.spawn.mockImplementation(() => {
        throw new Error('Command not found: claude')
      })
      
      await expect(sendMessage('Test'))
        .rejects.toThrow('Failed to spawn Claude CLI process')
    })

    it('should capture stderr output', async () => {
      const errorMessage = 'Claude CLI error: Invalid API key'
      
      childProcess.spawn.mockImplementation(() => {
        setTimeout(() => {
          mockProcess.stderr.on.mock.calls
            .find(call => call[0] === 'data')[1](errorMessage)
          mockProcess.on.mock.calls
            .find(call => call[0] === 'close')[1](1)
        }, 0)
        
        return mockProcess
      })
      
      await expect(sendMessage('Test'))
        .rejects.toThrow(`Claude CLI error: ${errorMessage}`)
    })

    it('should handle non-zero exit codes', async () => {
      childProcess.spawn.mockImplementation(() => {
        setTimeout(() => {
          mockProcess.on.mock.calls
            .find(call => call[0] === 'close')[1](1)
        }, 0)
        
        return mockProcess
      })
      
      await expect(sendMessage('Test'))
        .rejects.toThrow('Claude CLI exited with code 1')
    })

    it('should kill process on timeout', async () => {
      let timeoutId
      
      childProcess.spawn.mockImplementation(() => {
        // Set up timeout simulation
        timeoutId = setTimeout(() => {
          // Process would normally close here
        }, 200)
        
        return mockProcess
      })
      
      try {
        await sendMessage('Test', { timeout: 100 })
      } catch (error) {
        expect(mockProcess.kill).toHaveBeenCalledWith('SIGTERM')
      }
      
      clearTimeout(timeoutId)
    })

    it('should handle process errors', async () => {
      childProcess.spawn.mockImplementation(() => {
        setTimeout(() => {
          mockProcess.on.mock.calls
            .find(call => call[0] === 'error')[1](
              new Error('Process error')
            )
        }, 0)
        
        return mockProcess
      })
      
      await expect(sendMessage('Test'))
        .rejects.toThrow('Claude CLI process error')
    })
  })

  describe('Response Parsing', () => {
    it('should extract response text', async () => {
      const mockResponse = {
        response: 'This is the response text',
        other_field: 'ignored'
      }
      
      childProcess.spawn.mockImplementation(() => {
        setTimeout(() => {
          mockProcess.stdout.on.mock.calls
            .find(call => call[0] === 'data')[1](
              JSON.stringify(mockResponse)
            )
          mockProcess.on.mock.calls
            .find(call => call[0] === 'close')[1](0)
        }, 0)
        
        return mockProcess
      })
      
      const result = await sendMessage('Test')
      
      expect(result.response).toBe('This is the response text')
    })

    it('should extract session ID when present', async () => {
      const mockResponse = {
        response: 'Hello',
        session_id: 'session-abc-123'
      }
      
      childProcess.spawn.mockImplementation(() => {
        setTimeout(() => {
          mockProcess.stdout.on.mock.calls
            .find(call => call[0] === 'data')[1](
              JSON.stringify(mockResponse)
            )
          mockProcess.on.mock.calls
            .find(call => call[0] === 'close')[1](0)
        }, 0)
        
        return mockProcess
      })
      
      const result = await sendMessage('Test')
      
      expect(result.session_id).toBe('session-abc-123')
    })

    it('should handle missing optional fields', async () => {
      const mockResponse = {
        response: 'Minimal response'
        // No session_id or metadata
      }
      
      childProcess.spawn.mockImplementation(() => {
        setTimeout(() => {
          mockProcess.stdout.on.mock.calls
            .find(call => call[0] === 'data')[1](
              JSON.stringify(mockResponse)
            )
          mockProcess.on.mock.calls
            .find(call => call[0] === 'close')[1](0)
        }, 0)
        
        return mockProcess
      })
      
      const result = await sendMessage('Test')
      
      expect(result.response).toBe('Minimal response')
      expect(result.session_id).toBeUndefined()
      expect(result.metadata).toBeUndefined()
    })

    it('should handle response with metadata', async () => {
      const mockResponse = {
        response: 'Hello',
        session_id: '123',
        metadata: {
          model: 'claude-2',
          tokens_used: 150,
          timestamp: '2024-01-15T10:00:00Z'
        }
      }
      
      childProcess.spawn.mockImplementation(() => {
        setTimeout(() => {
          mockProcess.stdout.on.mock.calls
            .find(call => call[0] === 'data')[1](
              JSON.stringify(mockResponse)
            )
          mockProcess.on.mock.calls
            .find(call => call[0] === 'close')[1](0)
        }, 0)
        
        return mockProcess
      })
      
      const result = await sendMessage('Test')
      
      expect(result.metadata).toEqual({
        model: 'claude-2',
        tokens_used: 150,
        timestamp: '2024-01-15T10:00:00Z'
      })
    })

    it('should throw error if response field is missing', async () => {
      const mockResponse = {
        // Missing required 'response' field
        session_id: '123'
      }
      
      childProcess.spawn.mockImplementation(() => {
        setTimeout(() => {
          mockProcess.stdout.on.mock.calls
            .find(call => call[0] === 'data')[1](
              JSON.stringify(mockResponse)
            )
          mockProcess.on.mock.calls
            .find(call => call[0] === 'close')[1](0)
        }, 0)
        
        return mockProcess
      })
      
      await expect(sendMessage('Test'))
        .rejects.toThrow('Invalid Claude CLI response: missing response field')
    })
  })

  describe('Options', () => {
    it('should support custom timeout', async () => {
      childProcess.spawn.mockImplementation(() => {
        setTimeout(() => {
          mockProcess.stdout.on.mock.calls
            .find(call => call[0] === 'data')[1](
              JSON.stringify({ response: 'Quick response' })
            )
          mockProcess.on.mock.calls
            .find(call => call[0] === 'close')[1](0)
        }, 0)
        
        return mockProcess
      })
      
      await sendMessage('Test', { timeout: 60000 })
      
      expect(childProcess.spawn).toHaveBeenCalledWith('claude', expect.any(Array), {
        shell: false,
        timeout: 60000
      })
    })

    it('should validate message parameter', async () => {
      await expect(sendMessage()).rejects.toThrow('Message is required')
      await expect(sendMessage('')).rejects.toThrow('Message cannot be empty')
      await expect(sendMessage('   ')).rejects.toThrow('Message cannot be empty')
      await expect(sendMessage(123)).rejects.toThrow('Message must be a string')
    })

    it('should validate options parameter', async () => {
      await expect(sendMessage('Test', 'invalid'))
        .rejects.toThrow('Options must be an object')
      
      await expect(sendMessage('Test', { timeout: 'invalid' }))
        .rejects.toThrow('Timeout must be a number')
      
      await expect(sendMessage('Test', { sessionId: 123 }))
        .rejects.toThrow('Session ID must be a string')
    })
  })
})