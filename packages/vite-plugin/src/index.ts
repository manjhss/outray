import type { Plugin, ViteDevServer } from "vite";
import { OutrayClient } from "./client";
import type { OutrayPluginOptions } from "./types";

const DEFAULT_SERVER_URL = "wss://api.outray.dev/";

/**
 * Vite plugin that automatically starts an Outray tunnel when the dev server starts.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite'
 * import outray from '@outray/vite'
 *
 * export default defineConfig({
 *   plugins: [outray()]
 * })
 * ```
 *
 * @example
 * ```ts
 * // With options
 * import { defineConfig } from 'vite'
 * import outray from '@outray/vite'
 *
 * export default defineConfig({
 *   plugins: [
 *     outray({
 *       subdomain: 'my-app',
 *       apiKey: process.env.OUTRAY_API_KEY,
 *     })
 *   ]
 * })
 * ```
 */
export default function outrayPlugin(
  options: OutrayPluginOptions = {}
): Plugin {
  let client: OutrayClient | null = null;
  let tunnelUrl: string | null = null;

  return {
    name: "vite-plugin-outray",

    // Only run in dev mode
    apply: "serve",

    configureServer(server: ViteDevServer) {
      const {
        enabled = process.env.OUTRAY_ENABLED !== "false",
        silent = false,
      } = options;

      if (!enabled) return;

      server.httpServer?.once("listening", () => {
        const address = server.httpServer?.address();
        if (!address || typeof address === "string") return;

        const port = address.port;
        const apiKey = options.apiKey ?? process.env.OUTRAY_API_KEY;
        const subdomain = options.subdomain ?? process.env.OUTRAY_SUBDOMAIN;
        const serverUrl =
          options.serverUrl ??
          process.env.OUTRAY_SERVER_URL ??
          DEFAULT_SERVER_URL;

        client = new OutrayClient({
          localPort: port,
          serverUrl,
          apiKey,
          subdomain,
          customDomain: options.customDomain,
          silent,
          onTunnelReady: (url) => {
            tunnelUrl = url;

            if (!silent) {
              // Print tunnel URL in Vite's style
              const colorUrl = `\x1b[36m${url}\x1b[0m`; // cyan color
              server.config.logger.info(`  \x1b[32m➜\x1b[0m  \x1b[1mTunnel:\x1b[0m  ${colorUrl}`);
            }

            options.onTunnelReady?.(url);
          },
          onError: (error) => {
            if (!silent) {
              server.config.logger.error(`  \x1b[31m✗\x1b[0m  Outray: ${error.message}`);
            }
            options.onError?.(error);
          },
          onReconnecting: () => {
            if (!silent) {
              server.config.logger.info(`  \x1b[33m⟳\x1b[0m  Outray: Reconnecting...`);
            }
          },
          onClose: () => {
            if (!silent) {
              server.config.logger.info(`  \x1b[33m○\x1b[0m  Outray: Tunnel closed`);
            }
          },
        });

        client.start();
      });

      // Cleanup when server closes
      server.httpServer?.once("close", () => {
        if (client) {
          client.stop();
          client = null;
        }
      });
    },
  };
}

// Named exports for better tree-shaking
export { outrayPlugin as outray };
export type { OutrayPluginOptions };
