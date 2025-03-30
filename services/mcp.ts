import { Mcp } from '../src/mcp.js'
import app from '@adonisjs/core/services/app'

let mcp: Mcp

await app.booted(async () => {
  mcp = await app.container.make('mcp')
})

export { mcp as default }
