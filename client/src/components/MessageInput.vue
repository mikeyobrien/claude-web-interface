<!-- ABOUTME: Message input component with textarea for composing messages -->
<!-- ABOUTME: Supports v-model binding, Enter to send, Shift+Enter for newlines, and send button -->

<template>
  <div class="message-input-container">
    <textarea
      ref="textarea"
      v-model="message"
      class="message-input"
      data-testid="message-input"
      placeholder="Type a message..."
      aria-label="Message input"
      role="textbox"
      aria-multiline="true"
      :disabled="disabled"
      @keydown.enter="handleEnter"
      @input="adjustHeight"
    />
    <button
      class="send-button"
      data-testid="send-button"
      aria-label="Send message"
      :disabled="disabled || !message.trim()"
      @click="sendMessage"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="send-icon"
      >
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'MessageInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'send'],
  computed: {
    message: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  mounted() {
    this.$refs.textarea.focus()
    this.adjustHeight()
  },
  methods: {
    handleEnter(event) {
      if (!event.shiftKey && !this.disabled) {
        event.preventDefault()
        this.sendMessage()
      }
    },
    sendMessage() {
      if (this.message.trim() && !this.disabled) {
        this.$emit('send', this.message)
        this.message = ''
        this.$nextTick(() => {
          this.resetHeight()
        })
      }
    },
    adjustHeight() {
      const textarea = this.$refs.textarea
      if (!textarea) return
      
      // Reset height to auto to get accurate scrollHeight
      textarea.style.height = 'auto'
      
      // Calculate new height based on content
      const scrollHeight = textarea.scrollHeight
      const minHeight = 48 // 3rem
      const maxHeight = 160 // 10rem
      
      // Set the height within constraints
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)
      textarea.style.height = `${newHeight}px`
    },
    resetHeight() {
      const textarea = this.$refs.textarea
      if (textarea) {
        textarea.style.height = 'auto'
        this.adjustHeight()
      }
    }
  },
  watch: {
    modelValue() {
      this.$nextTick(() => {
        this.adjustHeight()
      })
    }
  }
}
</script>

<style scoped>
.message-input-container {
  @apply relative flex items-end gap-2 p-4 bg-white dark:bg-charcoal-light;
}

.message-input {
  @apply flex-1 px-4 py-3 rounded-lg border border-taupe dark:border-dark-taupe;
  @apply bg-cream dark:bg-charcoal text-coffee dark:text-cream;
  @apply placeholder-taupe dark:placeholder-dark-taupe;
  @apply focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-terra-cotta;
  @apply resize-none overflow-y-auto;
  @apply min-h-[3rem] max-h-[10rem];
  @apply transition-colors duration-200;
}

.message-input:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.send-button {
  @apply p-3 rounded-lg bg-primary dark:bg-terra-cotta text-white;
  @apply hover:bg-sienna dark:hover:bg-terra-cotta/90;
  @apply focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-terra-cotta;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transition-all duration-200;
}

.send-icon {
  @apply w-5 h-5;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .message-input-container {
    @apply p-3;
  }
  
  .message-input {
    @apply text-base;
  }
}
</style>