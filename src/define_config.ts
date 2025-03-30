import { McpConfig } from './mcp.js'

export function defineConfig<T extends McpConfig>(config: T): T {
  if (!config.ssePath) {
    config.ssePath = '/sse'
  }
  if (!config.messagesPath) {
    config.messagesPath = '/messages'
  }
  return config
}
