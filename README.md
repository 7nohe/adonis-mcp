# Adonis MCP

Adonis MCP is a package designed for the AdonisJS framework that provides support for the Model Context Protocol (MCP). With this package, you can easily build remote MCP servers using Server-Sent Events (SSE).

## Installation

Run the following command to install the package:

```bash
node ace add @7nohe/adonis-mcp
```

## Configuration

After installation, a `config/mcp.ts` file will be generated. Edit this file to customize the MCP server settings.

Example:

```ts
import { defineConfig } from '@7nohe/adonis-mcp'

export default defineConfig({
  ssePath: '/sse',
  messagesPath: '/messages',
})
```

## Usage

### Registering Routes

You can use the `registerRoutes` method in `start/routes.ts` to define tools and prompts. Below is an example:

```ts
import mcp from '@7nohe/adonis-mcp/services/main'
import { z } from 'zod'

await mcp.registerRoutes((server) => {
  server.tool('echo', { message: z.string() }, async ({ message }) => ({
    content: [{ type: 'text', text: `Tool echo: ${message}` }],
  }))

  server.prompt('echo', { message: z.string() }, ({ message }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Please process this message: ${message}`,
        },
      },
    ],
  }))
})
```

### Starting the Server

After defining the routes, start the MCP server by running the following command:

```bash
npm run dev
```

## Debugging

### Using Configuration File

To debug, edit the MCP server configuration file (e.g., for Claude Desktop or Cursor) as follows:

```json
{
  "mcpServers": {
    "mymcp": {
      "url": "http://localhost:3333/sse"
    }
  }
}
```

### Using Inspector

Another debugging method is to use the Inspector. Start it with the following command:

```bash
npx @modelcontextprotocol/inspector
```

1. Set the Transport Type to `SSE`.
2. Enter the URL `http://localhost:3333/sse`.
3. Click the `Connect` button.
4. Confirm that the status changes to `Connected`.

For more details, refer to the [Inspector Documentation](https://modelcontextprotocol.io/docs/tools/inspector).

## License

This project is provided under the [MIT License](./LICENSE.md).
