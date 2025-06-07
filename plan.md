# Claude Web Interface Implementation Plan

## Overview
This plan breaks down the Claude Web Interface project into small, iterative steps that build upon each other. Each step is designed to be implementable in a single session while providing tangible progress.

## Phase 1: Foundation (Steps 1-5)
Setting up the basic project structure and tooling.

### Step 1: Initialize Project Structure
- Create package.json with basic dependencies
- Set up directory structure
- Create .gitignore
- Create basic README.md

### Step 2: Set Up Express Server
- Create minimal Express server
- Configure environment variables
- Add basic health check endpoint
- Test server runs on port 5080

### Step 3: Set Up Vite and Vue
- Configure Vite for Vue development
- Create basic Vue app structure
- Set up development proxy to backend
- Verify hot reload works

### Step 4: Configure Tailwind CSS
- Install and configure Tailwind
- Create CSS variables for color palette
- Set up light/dark mode detection
- Create basic layout components

### Step 5: Create Base Layout
- Implement header component
- Create message area container
- Build input area component
- Wire components together

## Phase 2: Core Functionality (Steps 6-10)
Building the chat interface and basic Claude integration.

### Step 6: Create Message Components
- Build message bubble component
- Style user vs assistant messages
- Add timestamp display
- Implement auto-scroll behavior

### Step 7: Implement Input Handling
- Create auto-expanding textarea
- Handle Enter/Shift+Enter behavior
- Add send button functionality
- Implement basic validation

### Step 8: Add Loading States
- Create "Claude is thinking..." indicator
- Add typing animation
- Implement loading message placement
- Handle loading state transitions

### Step 9: Integrate Claude CLI
- Create Claude service module
- Implement spawn process logic
- Parse JSON responses
- Handle basic errors

### Step 10: Connect Frontend to Backend
- Implement /api/chat endpoint
- Wire up message sending
- Display responses in UI
- Test end-to-end flow

## Phase 3: Session Management (Steps 11-15)
Adding persistence and session handling.

### Step 11: Implement Session Storage
- Create session management service
- Store sessions in memory (for MVP)
- Generate session IDs
- Track message history

### Step 12: Add Session Endpoints
- Implement GET /api/sessions
- Create GET /api/session/:id
- Return proper session metadata
- Handle missing sessions

### Step 13: Frontend Session Integration
- Store current session ID in localStorage
- Load session on page refresh
- Display message history
- Update UI with session data

### Step 14: Error Handling
- Create error message component
- Display errors as chat bubbles
- Add retry functionality
- Handle network failures

### Step 15: Polish and Testing
- Add proper TypeScript types
- Write basic unit tests
- Test on mobile device
- Fix responsive issues

## Implementation Prompts

### Step 1: Initialize Project Structure

```text
Create a new Node.js project for a Claude web interface. Initialize the project with:
1. A package.json file with name "claude-web-interface", version "1.0.0", and type "module"
2. Basic dependencies: express, dotenv, cors
3. Dev dependencies: nodemon, @types/node
4. Scripts for "start", "dev", and "build"
5. A comprehensive .gitignore for Node.js projects
6. Create the following directory structure:
   - server/ (for backend code)
   - client/ (for frontend code)
   - server/index.js with a comment placeholder
   - A basic README.md explaining the project

Make sure to use ES modules syntax and include all necessary configurations.
```

### Step 2: Set Up Express Server

```text
Create a minimal Express server in server/index.js that:
1. Uses ES module imports
2. Loads environment variables from a .env file
3. Sets up CORS for local development
4. Binds to HOST (default 127.0.0.1) and PORT (default 5080) from environment
5. Has a GET /api/health endpoint that returns { status: "ok", timestamp: new Date() }
6. Includes proper error handling middleware
7. Logs when the server starts with the full URL

Also create a .env.example file showing PORT=5080 and HOST=127.0.0.1

The server should be production-ready with proper error handling and security headers.
```

### Step 3: Set Up Vite and Vue

```text
Add Vue 3 and Vite to the project:
1. Install dependencies: vue@next, @vitejs/plugin-vue, vite
2. Create vite.config.js with Vue plugin and proxy configuration to forward /api requests to localhost:5080
3. Create client/index.html with a div#app and script module reference
4. Create client/src/main.js that creates and mounts a Vue app
5. Create client/src/App.vue with a simple "Hello Claude" message
6. Update package.json scripts to include "dev:client" and "build:client" commands
7. Ensure Vite dev server runs on port 5173

The setup should support hot module replacement and proxy API requests correctly.
```

### Step 4: Configure Tailwind CSS

```text
Set up Tailwind CSS with a custom 70s-inspired color palette:
1. Install tailwindcss, postcss, autoprefixer as dev dependencies
2. Create tailwind.config.js with custom colors:
   - Light mode: cream background (#FAF7F0), olive user messages (#8B956D), taupe Claude messages (#C9B8A8), sienna primary (#C65D00), coffee text (#3E2723)
   - Dark mode: charcoal background (#2C2416), deep olive user (#4A5240), dark taupe Claude (#6B5D54), terra cotta primary (#D4754E), off-white text (#FFF8E7)
3. Create client/src/style.css with Tailwind directives
4. Configure CSS custom properties for theme switching
5. Add system color scheme detection with @media (prefers-color-scheme)
6. Import styles in main.js

Ensure the color system supports automatic light/dark mode switching based on system preferences.
```

### Step 5: Create Base Layout

```text
Create the base layout components for the chat interface:
1. Create client/src/components/AppHeader.vue:
   - Fixed header with "Claude" title
   - Minimal height (3rem)
   - Uses primary color for accent
2. Create client/src/components/MessageArea.vue:
   - Scrollable container that fills available space
   - Padding for safe area on mobile
   - Placeholder text when no messages
3. Create client/src/components/InputArea.vue:
   - Fixed bottom position
   - Contains textarea and send button
   - Proper padding and spacing
4. Update App.vue to use these components in a flex column layout
5. Ensure the layout is responsive and works on mobile viewports

The layout should feel native on mobile with proper spacing and no overlapping elements.
```

### Step 6: Create Message Components

```text
Build the message components for the chat interface:
1. Create client/src/components/MessageBubble.vue that accepts:
   - role: "user" or "assistant"
   - content: message text
   - timestamp: Date object
   - isError: boolean (optional)
2. Style messages with:
   - Rounded corners with tail on appropriate side
   - User messages: right-aligned, olive/deep olive color
   - Assistant messages: left-aligned, taupe color
   - Error messages: red-tinted version of assistant style
   - Timestamp shown below in smaller, muted text
3. Create client/src/composables/useMessages.js:
   - Reactive messages array
   - addMessage function
   - Auto-scroll to bottom function
4. Update MessageArea to render MessageBubbles
5. Add smooth scroll behavior and proper spacing

Messages should be clearly distinguished and easy to read on mobile.
```

### Step 7: Implement Input Handling

```text
Create the input handling functionality:
1. Update client/src/components/InputArea.vue:
   - Multi-line textarea that expands (min 2 lines, max 5 lines)
   - Calculate height based on scrollHeight
   - Send button with proper disabled state
2. Implement keyboard handling:
   - Enter key sends message (preventDefault)
   - Shift+Enter adds new line
   - Trim whitespace before sending
3. Add client/src/composables/useInput.js:
   - Reactive message text
   - Sending state
   - Handle send action
   - Clear input after sending
4. Emit events to parent for message sending
5. Focus management after sending

The input should feel responsive and natural on mobile keyboards.
```

### Step 8: Add Loading States

```text
Implement loading indicators for better UX:
1. Create client/src/components/LoadingIndicator.vue:
   - Shows "Claude is thinking..." text
   - Subtle pulsing animation
   - Renders as a temporary message bubble
2. Update useMessages composable:
   - Add loading message when sending
   - Remove loading message when response received
   - Handle loading message positioning
3. Add loading state to InputArea:
   - Disable input while loading
   - Change send button to loading state
   - Maintain focus for better UX
4. Add transition animations:
   - Fade in/out for loading message
   - Smooth height transitions
5. Test loading states with setTimeout mock

Loading states should provide clear feedback without being intrusive.
```

### Step 9: Integrate Claude CLI

```text
Create the backend service for Claude CLI integration:
1. Create server/services/claude.js with:
   - ES module exports
   - Function to spawn Claude CLI process
   - Pass message and sessionId as arguments
   - Use --output-format json flag
   - Parse JSON response
2. Handle process spawning:
   - Proper error handling for spawn failures
   - Timeout handling (30 seconds)
   - Parse stdout for JSON response
   - Capture stderr for errors
3. Create response parser:
   - Extract response text
   - Extract session ID
   - Extract metadata (cost, duration)
   - Handle malformed responses
4. Add input sanitization:
   - Escape special characters
   - Validate message length
   - Prevent command injection
5. Export clean interface for route handlers

The service should be robust and handle all error cases gracefully.
```

### Step 10: Connect Frontend to Backend

```text
Wire up the complete chat flow:
1. Create server/routes/chat.js:
   - POST /api/chat endpoint
   - Validate request body
   - Call Claude service
   - Return formatted response
   - Handle errors with proper status codes
2. Update server/index.js:
   - Import and use chat routes
   - Add JSON body parser middleware
   - Add request logging
3. Create client/src/services/api.js:
   - Fetch wrapper with proper headers
   - POST to /api/chat
   - Handle response parsing
   - Throw meaningful errors
4. Update App.vue:
   - Wire up message sending to API
   - Handle responses and add to messages
   - Show errors as error bubbles
   - Update loading states
5. Test the complete flow end-to-end

The integration should feel seamless with proper error handling throughout.
```

### Step 11: Implement Session Storage

```text
Add session management to the backend:
1. Create server/services/sessions.js:
   - In-memory Map for session storage
   - Session object structure: { id, messages, lastActive, createdAt }
   - Methods: create, get, update, list, addMessage
2. Generate session IDs:
   - Use crypto.randomUUID()
   - Ensure uniqueness
   - Return session metadata
3. Update claude.js service:
   - Accept sessionId parameter
   - Pass --resume flag when sessionId exists
   - Return sessionId with response
4. Message history tracking:
   - Store both user and assistant messages
   - Include timestamps
   - Limit history to last 100 messages
5. Add session cleanup:
   - Remove sessions older than 24 hours
   - Run cleanup every hour

Sessions should persist across server restarts for better development experience.
```

### Step 12: Add Session Endpoints

```text
Create the session API endpoints:
1. Create server/routes/sessions.js:
   - GET /api/sessions - returns list with metadata
   - GET /api/session/:id - returns full message history
   - Proper error handling for missing sessions
2. Session list response:
   - Include id, messageCount, lastActive
   - Sort by lastActive descending
   - Limit to 50 most recent
3. Session detail response:
   - Full message history
   - Format timestamps consistently
   - Include session metadata
4. Update server/index.js:
   - Import and mount session routes
   - Add route ordering
5. Add integration with chat endpoint:
   - Create session if not provided
   - Update session with each message
   - Return sessionId in response

The API should be RESTful and follow consistent patterns.
```

### Step 13: Frontend Session Integration

```text
Integrate session management in the frontend:
1. Create client/src/composables/useSession.js:
   - Current sessionId in localStorage
   - Load session on mount
   - Save sessionId after each message
   - Clear session function
2. Update API service:
   - Include sessionId in chat requests
   - Add methods for session endpoints
   - Handle session-related errors
3. Modify App.vue:
   - Load message history on mount
   - Restore scroll position
   - Update sessionId from responses
4. Add session persistence:
   - Check localStorage on load
   - Fetch history if session exists
   - Handle invalid/expired sessions
5. Add "New Chat" functionality:
   - Clear current session
   - Reset message history
   - Remove from localStorage

The app should seamlessly continue conversations after refresh.
```

### Step 14: Error Handling

```text
Implement comprehensive error handling:
1. Create client/src/components/ErrorMessage.vue:
   - Extends MessageBubble with error styling
   - Shows error text and retry button
   - Emits retry event
2. Define error types:
   - Network errors: "Failed to connect"
   - API errors: Show actual error message
   - Timeout errors: "Request timed out"
   - Session errors: "Session not found"
3. Update composables for error handling:
   - Add error state tracking
   - Implement retry logic
   - Exponential backoff for retries
4. Backend error improvements:
   - Consistent error format
   - Meaningful error messages
   - Proper HTTP status codes
   - Log errors for debugging
5. User-friendly error messages:
   - Avoid technical jargon
   - Provide actionable next steps
   - Include retry options

Errors should be helpful and not break the user experience.
```

### Step 15: Polish and Testing

```text
Final polish and testing setup:
1. Add TypeScript declarations:
   - Create type definitions for API responses
   - Add JSDoc comments for better IDE support
   - Define component prop types
2. Create basic test suite:
   - Set up Vitest for unit tests
   - Test message components
   - Test API service functions
   - Test error handling
3. Mobile optimizations:
   - Add viewport meta tag
   - Test on real Android device
   - Fix any input focus issues
   - Ensure proper keyboard behavior
4. Performance improvements:
   - Implement message virtualization for long chats
   - Add debouncing to input
   - Optimize bundle size
   - Add loading="lazy" where appropriate
5. Documentation:
   - Update README with setup instructions
   - Add inline code comments
   - Document API endpoints
   - Create troubleshooting guide

The app should feel polished and production-ready.
```

## GitHub Issues

Each step above should be created as a GitHub issue with:
- Clear acceptance criteria
- Technical implementation notes
- Dependencies on previous steps
- Estimated complexity (Small/Medium/Large)

## Success Criteria

After completing all steps, the application should:
1. Load quickly on mobile devices
2. Handle conversations smoothly
3. Persist sessions between refreshes
4. Show clear error messages
5. Feel native on Android browsers
6. Be easy to extend with new features