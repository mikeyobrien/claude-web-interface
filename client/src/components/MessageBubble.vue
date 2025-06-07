<!-- ABOUTME: Message bubble component that displays chat messages with role-based styling -->
<!-- ABOUTME: Supports user/assistant roles, timestamps, error states, and responsive design -->

<template>
  <article
    class="message-bubble message-wrap"
    :class="{
      'message-user': role === 'user',
      'message-assistant': role === 'assistant',
      'message-error': isError
    }"
    :data-role="role"
    :data-error="isError ? 'true' : undefined"
    role="article"
    :aria-label="`${role} message${isError ? ' - error' : ''}`"
    :aria-live="isError ? 'polite' : undefined"
    tabindex="0"
  >
    <span class="sr-only">{{ role }} says:</span>
    <div class="message-content" data-testid="message-content">
      {{ content }}
    </div>
    <time 
      v-if="timestamp" 
      class="message-timestamp"
      :datetime="timestamp.toISOString()"
    >
      {{ formatTime(timestamp) }}
    </time>
  </article>
</template>

<script>
export default {
  name: 'MessageBubble',
  props: {
    role: {
      type: String,
      required: true,
      validator: (value) => ['user', 'assistant'].includes(value)
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      required: false,
      default: null
    },
    isError: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    formatTime(date) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }
}
</script>

<style scoped>
.message-bubble {
  @apply p-4 rounded-lg mb-4 max-w-[80%];
}

.message-wrap {
  @apply break-words whitespace-pre-wrap;
}

.message-user {
  @apply ml-auto bg-primary text-white;
}

.message-assistant {
  @apply mr-auto bg-cream-dark text-charcoal;
}

.message-error {
  @apply border-2 border-error bg-error-light;
}

.message-content {
  @apply text-base;
}

.message-timestamp {
  @apply text-xs opacity-70 mt-2 block;
}

.sr-only {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
  clip: rect(0, 0, 0, 0);
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .message-assistant {
    @apply bg-charcoal-light text-cream;
  }
  
  .message-error {
    @apply bg-error-dark;
  }
}
</style>