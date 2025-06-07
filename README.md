# Claude Web Interface

A mobile-first web interface for Claude AI, designed to run on Termux and provide browser-based access to Claude conversations.

## Features

- Text-based conversation with Claude
- Session persistence across browser refreshes  
- Mobile-optimized responsive design
- 70s-inspired aesthetic with light/dark mode support

## Technology Stack

- **Frontend**: Vue.js 3 with Vite
- **Backend**: Node.js with Express
- **Styling**: Tailwind CSS
- **Testing**: Vitest with 80%+ coverage requirement

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Run tests:
   ```bash
   npm test
   ```

## Development

- `npm run dev` - Start development server
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

## Project Structure

```
claude-web-interface/
├── server/          # Backend Express server
├── client/          # Frontend Vue application
├── tests/           # Test files
├── package.json     # Dependencies and scripts
└── vitest.config.js # Test configuration
```

## License

MIT