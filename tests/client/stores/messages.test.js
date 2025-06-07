// ABOUTME: Tests for message store covering state management, message operations, and computed properties
// ABOUTME: Verifies the store handles message CRUD operations and maintains reactive state

import { describe, it, expect, beforeEach } from 'vitest'
import { useMessages } from '../../../client/src/stores/messages.js'

describe('Messages Store', () => {
  let messageStore
  
  beforeEach(() => {
    // Get fresh instance for each test
    messageStore = useMessages()
    // Clear any existing messages
    if (messageStore.clearMessages) {
      messageStore.clearMessages()
    }
  })

  describe('Initial State', () => {
    it('should have empty messages array', () => {
      expect(messageStore.messages).toBeDefined()
      expect(Array.isArray(messageStore.messages.value)).toBe(true)
      expect(messageStore.messages.value).toHaveLength(0)
    })
  })

  describe('addMessage', () => {
    it('should add a message to the array', () => {
      const message = {
        role: 'user',
        content: 'Hello, Claude!'
      }
      
      messageStore.addMessage(message)
      
      expect(messageStore.messages.value).toHaveLength(1)
      expect(messageStore.messages.value[0].content).toBe('Hello, Claude!')
      expect(messageStore.messages.value[0].role).toBe('user')
    })

    it('should add multiple messages in order', () => {
      messageStore.addMessage({ role: 'user', content: 'First message' })
      messageStore.addMessage({ role: 'assistant', content: 'Second message' })
      messageStore.addMessage({ role: 'user', content: 'Third message' })
      
      expect(messageStore.messages.value).toHaveLength(3)
      expect(messageStore.messages.value[0].content).toBe('First message')
      expect(messageStore.messages.value[1].content).toBe('Second message')
      expect(messageStore.messages.value[2].content).toBe('Third message')
    })

    it('should generate unique IDs for messages', () => {
      messageStore.addMessage({ role: 'user', content: 'Message 1' })
      messageStore.addMessage({ role: 'user', content: 'Message 2' })
      
      const ids = messageStore.messages.value.map(m => m.id)
      expect(ids[0]).toBeDefined()
      expect(ids[1]).toBeDefined()
      expect(ids[0]).not.toBe(ids[1])
    })

    it('should add timestamp to messages', () => {
      const before = Date.now()
      messageStore.addMessage({ role: 'user', content: 'Test message' })
      const after = Date.now()
      
      const message = messageStore.messages.value[0]
      expect(message.timestamp).toBeDefined()
      expect(message.timestamp).toBeInstanceOf(Date)
      expect(message.timestamp.getTime()).toBeGreaterThanOrEqual(before)
      expect(message.timestamp.getTime()).toBeLessThanOrEqual(after)
    })

    it('should handle error messages', () => {
      messageStore.addMessage({
        role: 'assistant',
        content: 'Error: Something went wrong',
        isError: true
      })
      
      expect(messageStore.messages.value[0].isError).toBe(true)
    })

    it('should provide default values for optional fields', () => {
      messageStore.addMessage({
        role: 'user',
        content: 'Minimal message'
      })
      
      const message = messageStore.messages.value[0]
      expect(message.isError).toBe(false)
      expect(message.id).toBeDefined()
      expect(message.timestamp).toBeDefined()
    })
  })

  describe('Computed Properties', () => {
    it('should have hasMessages computed property', () => {
      expect(messageStore.hasMessages).toBeDefined()
      expect(messageStore.hasMessages.value).toBe(false)
      
      messageStore.addMessage({ role: 'user', content: 'Test' })
      expect(messageStore.hasMessages.value).toBe(true)
    })

    it('should have messageCount computed property', () => {
      expect(messageStore.messageCount).toBeDefined()
      expect(messageStore.messageCount.value).toBe(0)
      
      messageStore.addMessage({ role: 'user', content: 'One' })
      expect(messageStore.messageCount.value).toBe(1)
      
      messageStore.addMessage({ role: 'assistant', content: 'Two' })
      expect(messageStore.messageCount.value).toBe(2)
    })

    it('should have lastMessage computed property', () => {
      expect(messageStore.lastMessage).toBeDefined()
      expect(messageStore.lastMessage.value).toBe(null)
      
      messageStore.addMessage({ role: 'user', content: 'First' })
      expect(messageStore.lastMessage.value.content).toBe('First')
      
      messageStore.addMessage({ role: 'assistant', content: 'Last' })
      expect(messageStore.lastMessage.value.content).toBe('Last')
    })

    it('should update computed properties reactively', () => {
      // Start empty
      expect(messageStore.hasMessages.value).toBe(false)
      expect(messageStore.messageCount.value).toBe(0)
      expect(messageStore.lastMessage.value).toBe(null)
      
      // Add a message
      messageStore.addMessage({ role: 'user', content: 'Hello' })
      
      // All computed properties should update
      expect(messageStore.hasMessages.value).toBe(true)
      expect(messageStore.messageCount.value).toBe(1)
      expect(messageStore.lastMessage.value.content).toBe('Hello')
    })
  })

  describe('Store Actions', () => {
    describe('clearMessages', () => {
      it('should clear all messages', () => {
        messageStore.addMessage({ role: 'user', content: 'Message 1' })
        messageStore.addMessage({ role: 'assistant', content: 'Message 2' })
        expect(messageStore.messages.value).toHaveLength(2)
        
        messageStore.clearMessages()
        
        expect(messageStore.messages.value).toHaveLength(0)
        expect(messageStore.hasMessages.value).toBe(false)
      })
    })

    describe('updateMessage', () => {
      it('should update message by ID', () => {
        messageStore.addMessage({ role: 'user', content: 'Original' })
        const messageId = messageStore.messages.value[0].id
        
        messageStore.updateMessage(messageId, { content: 'Updated' })
        
        expect(messageStore.messages.value[0].content).toBe('Updated')
        expect(messageStore.messages.value[0].role).toBe('user') // Unchanged
      })

      it('should handle updating non-existent message', () => {
        messageStore.addMessage({ role: 'user', content: 'Test' })
        
        // Should not throw
        expect(() => {
          messageStore.updateMessage('non-existent-id', { content: 'Updated' })
        }).not.toThrow()
        
        // Original message unchanged
        expect(messageStore.messages.value[0].content).toBe('Test')
      })

      it('should update multiple properties', () => {
        messageStore.addMessage({ role: 'assistant', content: 'Original' })
        const messageId = messageStore.messages.value[0].id
        
        messageStore.updateMessage(messageId, {
          content: 'Updated content',
          isError: true
        })
        
        const message = messageStore.messages.value[0]
        expect(message.content).toBe('Updated content')
        expect(message.isError).toBe(true)
      })
    })

    describe('deleteMessage', () => {
      it('should delete message by ID', () => {
        messageStore.addMessage({ role: 'user', content: 'Message 1' })
        messageStore.addMessage({ role: 'assistant', content: 'Message 2' })
        messageStore.addMessage({ role: 'user', content: 'Message 3' })
        
        const messageId = messageStore.messages.value[1].id
        messageStore.deleteMessage(messageId)
        
        expect(messageStore.messages.value).toHaveLength(2)
        expect(messageStore.messages.value[0].content).toBe('Message 1')
        expect(messageStore.messages.value[1].content).toBe('Message 3')
      })

      it('should handle deleting non-existent message', () => {
        messageStore.addMessage({ role: 'user', content: 'Test' })
        
        // Should not throw
        expect(() => {
          messageStore.deleteMessage('non-existent-id')
        }).not.toThrow()
        
        // Messages unchanged
        expect(messageStore.messages.value).toHaveLength(1)
      })

      it('should update computed properties after deletion', () => {
        messageStore.addMessage({ role: 'user', content: 'First' })
        messageStore.addMessage({ role: 'assistant', content: 'Last' })
        
        expect(messageStore.messageCount.value).toBe(2)
        expect(messageStore.lastMessage.value.content).toBe('Last')
        
        const lastId = messageStore.messages.value[1].id
        messageStore.deleteMessage(lastId)
        
        expect(messageStore.messageCount.value).toBe(1)
        expect(messageStore.lastMessage.value.content).toBe('First')
      })
    })
  })

  describe('Error Handling', () => {
    it('should validate message role', () => {
      expect(() => {
        messageStore.addMessage({ role: 'invalid', content: 'Test' })
      }).toThrow('Invalid message role')
    })

    it('should validate message content', () => {
      expect(() => {
        messageStore.addMessage({ role: 'user', content: '' })
      }).toThrow('Message content cannot be empty')
      
      expect(() => {
        messageStore.addMessage({ role: 'user', content: '   ' })
      }).toThrow('Message content cannot be empty')
    })

    it('should require role and content', () => {
      expect(() => {
        messageStore.addMessage({ content: 'No role' })
      }).toThrow('Message role is required')
      
      expect(() => {
        messageStore.addMessage({ role: 'user' })
      }).toThrow('Message content is required')
    })
  })

  describe('Type Safety', () => {
    it('should have proper JSDoc types', () => {
      // This test ensures our store has proper type annotations
      // It doesn't test runtime behavior but documents expected types
      const message = {
        role: 'user',
        content: 'Test message',
        isError: false
      }
      
      messageStore.addMessage(message)
      
      const stored = messageStore.messages.value[0]
      expect(typeof stored.id).toBe('string')
      expect(stored.timestamp).toBeInstanceOf(Date)
      expect(typeof stored.role).toBe('string')
      expect(typeof stored.content).toBe('string')
      expect(typeof stored.isError).toBe('boolean')
    })
  })
})