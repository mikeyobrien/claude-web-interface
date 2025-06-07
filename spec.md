# Claude Web Interface Specification

## Overview
A mobile-first web interface for Claude Code, designed to run on Termux and provide browser-based access to Claude conversations with a warm, 70s-inspired aesthetic.

## Core Concept
- **Purpose**: Web interface to interact with Claude Code from Android browser
- **Platform**: Runs on Termux, accessed via mobile browser
- **Architecture**: Vue.js frontend + Node.js backend spawning Claude Code CLI

## Technology Stack

### Frontend
- **Framework**: Vue.js 3 with Vite
- **Styling**: Tailwind CSS
- **Build Tool**: Vite (development and production)
- **No additional UI framework** - custom components only

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Integration**: Child process spawning Claude Code CLI with JSON output
- **Configuration**: Environment variables

## MVP Features

### Phase 1: Basic Chat (Initial Release)
1. Text-based conversation with Claude
2. Session persistence across browser refreshes
3. "Claude is thinking..." loading indicator
4. Mobile-optimized responsive design
5. Local access only (127.0.0.1)

### Future Phases (Not in MVP)
- Real-time streaming responses
- File browsing and editing
- Code syntax highlighting
- Multiple conversation management
- Command execution interface
- Tool integrations

## API Design

### Endpoints

#### POST /api/chat
Send a message to Claude and receive a response.

**Request:**
```json
{
  "message": "user's message text",
  "sessionId": "optional-existing-session-id"
}
```

**Response:**
```json
{
  "response": "Claude's response text",
  "sessionId": "session-id-for-persistence",
  "metadata": {
    "cost": 0.001,
    "duration": 1234
  }
}
```

#### GET /api/sessions
List all available conversation sessions.

**Response:**
```json
{
  "sessions": [
    {
      "id": "session-id",
      "lastActive": "2024-01-20T10:30:00Z",
      "messageCount": 5
    }
  ]
}
```

#### GET /api/session/:id
Retrieve conversation history for a specific session.

**Response:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello Claude",
      "timestamp": "2024-01-20T10:30:00Z"
    },
    {
      "role": "assistant", 
      "content": "Hello! How can I help you today?",
      "timestamp": "2024-01-20T10:30:05Z"
    }
  ]
}
```

## User Interface Design

### Layout Structure
- **Header**: Fixed, minimal height with "Claude" title
- **Message Area**: Scrollable, takes majority of viewport
- **Input Area**: Fixed bottom with multiline textarea and send button

### Interaction Patterns
- **Text Input**: Auto-expanding textarea (max 5 lines)
- **Send Message**: Enter key sends, Shift+Enter for new line
- **Loading State**: "Claude is thinking..." message appears as temporary chat bubble
- **Error Handling**: Errors appear as red chat bubbles with retry button

### Visual Design

#### Color Palette
Earthy, muted 70s-inspired tones that adapt to system light/dark preference:

**Light Mode:**
- Background: Warm cream (#FAF7F0)
- User Messages: Soft olive green (#8B956D)
- Claude Messages: Mushroom taupe (#C9B8A8)
- Primary Action: Burnt sienna (#C65D00)
- Text: Dark coffee brown (#3E2723)

**Dark Mode:**
- Background: Charcoal brown (#2C2416)
- User Messages: Deep olive (#4A5240)
- Claude Messages: Dark taupe (#6B5D54)
- Primary Action: Muted terra cotta (#D4754E)
- Text: Warm off-white (#FFF8E7)

#### Typography
- Clean, readable sans-serif font
- Larger font sizes for mobile readability
- High contrast ratios for accessibility

## Configuration

### Environment Variables
```bash
PORT=5080              # Server port (default: 5080)
HOST=127.0.0.1        # Bind address (default: localhost only)
NODE_ENV=production   # Environment mode
```

### Server Configuration
- Default port: 5080 (configurable via PORT env variable)
- Bind to localhost only for security
- No authentication required for local access

## Technical Implementation Details

### Backend Architecture
1. Express server handles HTTP requests
2. Spawns Claude Code CLI using Node.js child_process
3. Executes commands with `--output-format json` flag
4. Manages session IDs using `--resume` flag
5. Parses JSON responses and forwards to frontend

### Frontend Architecture
1. Vue 3 Composition API for reactive state management
2. Tailwind CSS for utility-first styling
3. Local storage for session persistence
4. Responsive design with mobile breakpoints
5. System theme detection via CSS media queries

### Error Handling
- Network errors: Display in chat as error bubbles
- Claude Code errors: Parse from JSON output and display
- Validation errors: Inline validation before sending
- Server errors: Generic fallback error message

## Development Workflow

### Setup
```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build

# Start production server
npm start
```

### Directory Structure
```
claude-web/
├── server/
│   ├── index.js         # Express server
│   ├── routes/          # API routes
│   └── services/        # Claude Code integration
├── client/
│   ├── src/
│   │   ├── components/  # Vue components
│   │   ├── stores/      # State management
│   │   └── styles/      # Global styles
│   └── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Security Considerations
- Localhost-only binding prevents external access
- No sensitive data stored in browser
- Environment variables for configuration
- Sanitized user input before CLI execution
- No direct shell command execution

## Performance Optimization
- Minimal bundle size for fast mobile loading
- Lazy loading for future features
- Efficient message rendering with Vue virtual scrolling
- Debounced API calls during typing
- Local caching of session data

## Testing Strategy
- Unit tests for API endpoints
- Component tests for Vue components
- End-to-end tests for critical user flows
- Manual testing on actual Android device

## Success Metrics
- Page load time under 2 seconds on mobile
- Smooth scrolling with 100+ messages
- Response time matches Claude Code CLI performance
- Zero authentication friction for local use