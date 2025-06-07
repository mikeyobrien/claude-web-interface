// ABOUTME: Test setup for Vue component testing with test utilities
// ABOUTME: Configures global test environment for Vue components

import { config } from '@vue/test-utils'

// Configure Vue Test Utils
config.global = {
  // Add any global properties, components, directives, etc.
  stubs: {
    // Stub router-link and router-view if we add Vue Router later
  }
}

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})