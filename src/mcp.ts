import type { Route } from '@adonisjs/core/http'
import type { HttpRouterService } from '@adonisjs/core/types'
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { Implementation } from '@modelcontextprotocol/sdk/types.js'

const McpController = () => import('./controllers/mcp_controller.js')

export type McpConfig = {
  path?: string
  serverOptions?: Implementation
}

export class Mcp {
  transports: { [sessionId: string]: StreamableHTTPServerTransport } = {}
  #router: HttpRouterService
  #server: McpServer
  config: McpConfig

  constructor(config: McpConfig, router: HttpRouterService) {
    this.#router = router
    this.config = config
    this.#server = new McpServer({
      name: 'adonis-mcp-server',
      version: '1.0.0',
      ...this.config.serverOptions,
    })
  }

  add(sessionId: string, transport: StreamableHTTPServerTransport) {
    this.transports[sessionId] = transport
  }

  delete(sessionId: string) {
    delete this.transports[sessionId]
  }

  get(sessionId: string) {
    return this.transports[sessionId]
  }

  getServer() {
    return this.#server
  }

  async registerRoutes(
    init: (server: McpServer) => void,
    routeHandlerModifier?: (route: Route) => void
  ) {
    const mcpController = await McpController()
    init(this.#server)

    const postRoute = this.#router.post(this.config.path!, [mcpController.default, 'post'])
    const getRoute = this.#router.get(this.config.path!, [mcpController.default, 'get'])
    const deleteRoute = this.#router.delete(this.config.path!, [mcpController.default, 'delete'])

    if (routeHandlerModifier) {
      routeHandlerModifier(postRoute)
      routeHandlerModifier(getRoute)
      routeHandlerModifier(deleteRoute)
    }
  }
}
