// ABOUTME: Tests for Vite configuration to ensure proper Vue setup
// ABOUTME: Verifies Vue plugin is configured and proxy settings are correct

import { describe, it, expect, beforeAll } from 'vitest'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '../..')

describe('Vite Configuration', () => {
  let viteConfig
  
  beforeAll(async () => {
    // Check if vite.config.js exists
    const configPath = join(rootDir, 'vite.config.js')
    if (fs.existsSync(configPath)) {
      const configModule = await import(configPath)
      viteConfig = configModule.default
    }
  })

  it('should export a valid Vite configuration', () => {
    expect(viteConfig).toBeDefined()
    expect(typeof viteConfig).toBe('object')
  })

  it('should have Vue plugin configured', () => {
    expect(viteConfig.plugins).toBeDefined()
    expect(Array.isArray(viteConfig.plugins)).toBe(true)
    expect(viteConfig.plugins.length).toBeGreaterThan(0)
    
    // Check if Vue plugin is in the plugins array
    const hasVuePlugin = viteConfig.plugins.some(plugin => 
      plugin && plugin.name && plugin.name.includes('vue')
    )
    expect(hasVuePlugin).toBe(true)
  })

  it('should have proxy configuration for /api routes', () => {
    expect(viteConfig.server).toBeDefined()
    expect(viteConfig.server.proxy).toBeDefined()
    expect(viteConfig.server.proxy['/api']).toBeDefined()
    
    const apiProxy = viteConfig.server.proxy['/api']
    expect(apiProxy.target).toBe('http://localhost:5080')
    expect(apiProxy.changeOrigin).toBe(true)
  })

  it('should have correct dev server port', () => {
    expect(viteConfig.server.port).toBe(5173)
  })

  it('should have proper build configuration', () => {
    expect(viteConfig.build).toBeDefined()
    expect(viteConfig.build.outDir).toBe('dist')
    expect(viteConfig.build.sourcemap).toBe(true)
  })
})