import type { HttpContext } from '@adonisjs/core/http'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js'
import { randomUUID } from 'node:crypto'
import mcp from '../../services/mcp.js'

export default class McpController {
  async post(ctx: HttpContext) {
    const req = ctx.request.request
    const res = ctx.response.response
    const sessionId = req.headers['mcp-session-id'] as string | undefined
    let transport: StreamableHTTPServerTransport
    const server = mcp.getServer()

    if (sessionId && mcp.get(sessionId)) {
      transport = mcp.get(sessionId)
    } else if (!sessionId && isInitializeRequest(ctx.request.body())) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sId) => {
          mcp.add(sId, transport)
        },
      })

      transport.onclose = () => {
        if (transport.sessionId) {
          mcp.delete(transport.sessionId)
        }
      }
      await server.connect(transport)
    } else {
      return ctx.response.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: null,
      })
    }
    await transport.handleRequest(req, res, ctx.request.body())
  }

  async get(ctx: HttpContext) {
    const req = ctx.request.request
    const res = ctx.response.response
    const sessionId = req.headers['mcp-session-id'] as string | undefined
    if (!sessionId || !mcp.get(sessionId)) {
      return ctx.response.status(400).send('Invalid or missing session ID')
    }

    const transport = mcp.get(sessionId)
    await transport.handleRequest(req, res)
  }

  async delete(ctx: HttpContext) {
    const req = ctx.request.request
    const res = ctx.response.response
    const sessionId = req.headers['mcp-session-id'] as string | undefined
    if (!sessionId || !mcp.get(sessionId)) {
      return ctx.response.status(400).send('Invalid or missing session ID')
    }

    const transport = mcp.get(sessionId)
    await transport.handleRequest(req, res)
  }
}
