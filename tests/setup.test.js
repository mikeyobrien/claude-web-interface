// ABOUTME: Initial test to verify the test environment is properly configured
// ABOUTME: Tests ES module imports and basic assertions work correctly

import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

describe('Test Environment Setup', () => {
  it('should have test environment configured', () => {
    expect(true).toBe(true)
  })

  it('should support ES module imports', () => {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    
    expect(typeof __filename).toBe('string')
    expect(typeof __dirname).toBe('string')
    expect(__filename).toContain('setup.test.js')
  })

  it('should have proper Node.js version', () => {
    const nodeVersion = process.version
    const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1))
    
    expect(majorVersion).toBeGreaterThanOrEqual(18)
  })

  it('should have environment variables available', () => {
    expect(process.env).toBeDefined()
    expect(typeof process.env).toBe('object')
  })
})