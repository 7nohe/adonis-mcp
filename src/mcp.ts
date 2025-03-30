import { Route } from '@adonisjs/core/http'
import { HttpRouterService } from '@adonisjs/core/types'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

const McpController = () => import('./controllers/mcp_controller.js')

export type McpConfig = {
  ssePath: string
  messagesPath: string
}

export class Mcp {
  transports: { [sessionId: string]: SSEServerTransport } = {}
  #router: HttpRouterService
  config: McpConfig

  constructor(config: McpConfig, router: HttpRouterService) {
    this.#router = router
    this.config = config
  }

  add(sessionId: string, transport: SSEServerTransport) {
    this.transports[sessionId] = transport
  }

  delete(sessionId: string) {
    delete this.transports[sessionId]
  }

  get(sessionId: string) {
    return this.transports[sessionId]
  }

  async registerRoutes(
    init: (server: McpServer) => void,
    routeHandlerModifier?: (route: Route) => void
  ) {
    const mcpController = await McpController()
    class McpControllerImpl extends mcpController.default {
      constructor() {
        super()
        init(this.server)
      }
    }

    const sseRoute = this.#router.get(this.config.ssePath, [McpControllerImpl, 'sse'])
    const messagesRoute = this.#router.post(this.config.messagesPath, [
      McpControllerImpl,
      'messages',
    ])

    if (routeHandlerModifier) {
      routeHandlerModifier(sseRoute)
      routeHandlerModifier(messagesRoute)
    }
  }
}
