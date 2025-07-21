import { McpConfig } from './mcp.js'

export function defineConfig<T extends McpConfig>(config: T): T {
  if (!config.path) {
    config.path = '/mcp'
  }
  return config
}
