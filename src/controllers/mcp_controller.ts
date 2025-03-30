import type { HttpContext } from '@adonisjs/core/http'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
import mcp from '../../services/mcp.js'

export default class McpController {
  server: McpServer

  constructor() {
    this.server = new McpServer({
      name: 'adonis-mcp-server',
      version: '1.0.0',
    })
  }

  async sse(ctx: HttpContext) {
    const res = ctx.response.response
    const transport = new SSEServerTransport('/messages', res)
    mcp.add(transport.sessionId, transport)
    res.on('close', () => {
      mcp.delete(transport.sessionId)
    })
    await this.server.connect(transport)
  }

  async messages(ctx: HttpContext) {
    const res = ctx.response.response
    const req = ctx.request.request
    const { sessionId } = ctx.request.qs()
    const transport = mcp.get(sessionId)
    if (transport) {
      await transport.handlePostMessage(req, res, ctx.request.raw())
    } else {
      ctx.response.status(400).send('No transport found for sessionId')
    }
  }
}
