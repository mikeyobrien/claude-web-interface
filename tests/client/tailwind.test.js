// ABOUTME: Tests for Tailwind CSS configuration with custom color palette
// ABOUTME: Verifies design system colors and dark mode configuration

import { describe, it, expect, beforeAll } from 'vitest'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '../..')

describe('Tailwind CSS Configuration', () => {
  let tailwindConfig
  
  beforeAll(async () => {
    // Check if tailwind.config.js exists
    const configPath = join(rootDir, 'tailwind.config.js')
    if (fs.existsSync(configPath)) {
      const configModule = await import(configPath)
      tailwindConfig = configModule.default
    }
  })

  it('should export a valid Tailwind configuration', () => {
    expect(tailwindConfig).toBeDefined()
    expect(typeof tailwindConfig).toBe('object')
  })

  it('should have custom color palette defined', () => {
    expect(tailwindConfig.theme).toBeDefined()
    expect(tailwindConfig.theme.extend).toBeDefined()
    expect(tailwindConfig.theme.extend.colors).toBeDefined()
    
    const colors = tailwindConfig.theme.extend.colors
    
    // Light mode colors
    expect(colors.cream).toBe('#FAF7F0')
    expect(colors.olive).toBe('#8B956D')
    expect(colors.taupe).toBe('#C9B8A8')
    expect(colors.sienna).toBe('#C65D00')
    expect(colors.coffee).toBe('#3E2723')
    
    // Dark mode colors
    expect(colors.charcoal).toBe('#2C2416')
    expect(colors['deep-olive']).toBe('#4A5240')
    expect(colors['dark-taupe']).toBe('#6B5D54')
    expect(colors['terra-cotta']).toBe('#D4754E')
    expect(colors['off-white']).toBe('#FFF8E7')
  })

  it('should have dark mode configuration', () => {
    expect(tailwindConfig.darkMode).toBe('class')
  })

  it('should have proper content paths', () => {
    expect(tailwindConfig.content).toBeDefined()
    expect(Array.isArray(tailwindConfig.content)).toBe(true)
    expect(tailwindConfig.content).toContain('./client/index.html')
    expect(tailwindConfig.content).toContain('./client/src/**/*.{vue,js,ts,jsx,tsx}')
  })

  it('should have required plugins', () => {
    expect(tailwindConfig.plugins).toBeDefined()
    expect(Array.isArray(tailwindConfig.plugins)).toBe(true)
  })
})