// ABOUTME: Tests for CSS custom properties and theme system
// ABOUTME: Verifies CSS variables are generated for light/dark modes

import { describe, it, expect, beforeAll } from 'vitest'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '../..')

describe('CSS Architecture', () => {
  let mainCssContent
  
  beforeAll(() => {
    // Check if main.css exists
    const cssPath = join(rootDir, 'client/src/styles/main.css')
    if (fs.existsSync(cssPath)) {
      mainCssContent = fs.readFileSync(cssPath, 'utf-8')
    }
  })

  it('should have main.css file', () => {
    expect(mainCssContent).toBeDefined()
    expect(mainCssContent.length).toBeGreaterThan(0)
  })

  it('should include Tailwind directives', () => {
    expect(mainCssContent).toContain('@tailwind base')
    expect(mainCssContent).toContain('@tailwind components')
    expect(mainCssContent).toContain('@tailwind utilities')
  })

  it('should define CSS custom properties for light mode', () => {
    expect(mainCssContent).toContain(':root')
    expect(mainCssContent).toContain('--color-background: #FAF7F0')
    expect(mainCssContent).toContain('--color-text: #3E2723')
    expect(mainCssContent).toContain('--color-primary: #C65D00')
    expect(mainCssContent).toContain('--color-user-message: #8B956D')
    expect(mainCssContent).toContain('--color-assistant-message: #C9B8A8')
  })

  it('should define CSS custom properties for dark mode', () => {
    expect(mainCssContent).toContain('@media (prefers-color-scheme: dark)')
    expect(mainCssContent).toContain('--color-background: #2C2416')
    expect(mainCssContent).toContain('--color-text: #FFF8E7')
    expect(mainCssContent).toContain('--color-primary: #D4754E')
    expect(mainCssContent).toContain('--color-user-message: #4A5240')
    expect(mainCssContent).toContain('--color-assistant-message: #6B5D54')
  })

  it('should have dark class overrides', () => {
    expect(mainCssContent).toContain('.dark')
    expect(mainCssContent).toMatch(/\.dark\s*{[^}]*--color-background:\s*#2C2416/)
  })
})