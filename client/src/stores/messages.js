// ABOUTME: Message store for managing chat messages with reactive state and computed properties
// ABOUTME: Provides useMessages composable for adding, updating, and deleting messages

import { ref, computed } from 'vue'

/**
 * @typedef {Object} Message
 * @property {string} id - Unique message identifier
 * @property {'user'|'assistant'} role - Message sender role
 * @property {string} content - Message text content
 * @property {Date} timestamp - When message was created
 * @property {boolean} isError - Whether message represents an error
 */

/**
 * Creates a new message store instance
 * @returns {Object} Message store with state and methods
 */
export function useMessages() {
  // Reactive state
  const messages = ref([])

  /**
   * Generates a unique ID for messages
   * @returns {string} Unique identifier
   */
  function generateId() {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Validates message data
   * @param {Object} message - Message to validate
   * @throws {Error} If message is invalid
   */
  function validateMessage(message) {
    if (!message.role) {
      throw new Error('Message role is required')
    }
    
    if (!['user', 'assistant'].includes(message.role)) {
      throw new Error('Invalid message role')
    }
    
    if (message.content === undefined || message.content === null) {
      throw new Error('Message content is required')
    }
    
    if (typeof message.content === 'string' && !message.content.trim()) {
      throw new Error('Message content cannot be empty')
    }
  }

  /**
   * Adds a new message to the store
   * @param {Object} messageData - Message data
   * @param {string} messageData.role - Message role (user or assistant)
   * @param {string} messageData.content - Message content
   * @param {boolean} [messageData.isError=false] - Whether message is an error
   */
  function addMessage(messageData) {
    validateMessage(messageData)
    
    const message = {
      id: generateId(),
      role: messageData.role,
      content: messageData.content,
      timestamp: new Date(),
      isError: messageData.isError || false
    }
    
    messages.value.push(message)
  }

  /**
   * Clears all messages from the store
   */
  function clearMessages() {
    messages.value = []
  }

  /**
   * Updates a message by ID
   * @param {string} id - Message ID to update
   * @param {Object} updates - Properties to update
   */
  function updateMessage(id, updates) {
    const index = messages.value.findIndex(msg => msg.id === id)
    if (index !== -1) {
      messages.value[index] = {
        ...messages.value[index],
        ...updates
      }
    }
  }

  /**
   * Deletes a message by ID
   * @param {string} id - Message ID to delete
   */
  function deleteMessage(id) {
    const index = messages.value.findIndex(msg => msg.id === id)
    if (index !== -1) {
      messages.value.splice(index, 1)
    }
  }

  // Computed properties
  const hasMessages = computed(() => messages.value.length > 0)
  const messageCount = computed(() => messages.value.length)
  const lastMessage = computed(() => {
    const len = messages.value.length
    return len > 0 ? messages.value[len - 1] : null
  })

  return {
    messages,
    addMessage,
    clearMessages,
    updateMessage,
    deleteMessage,
    hasMessages,
    messageCount,
    lastMessage
  }
}