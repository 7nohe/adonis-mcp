import type { ApplicationService } from '@adonisjs/core/types'
import { Mcp, McpConfig } from '../src/mcp.js'

export default class McpProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton('mcp', async () => {
      const router = await this.app.container.make('router')
      const config = this.app.config.get<McpConfig>('mcp', {})
      return new Mcp(config, router)
    })
  }
}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    mcp: Mcp
  }
}
