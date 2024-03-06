#!/usr/bin/env bun
import fs from "node:fs";
import { cac } from "cac";
import { build } from "../../build";
import { createWebSocketServer } from "../../ws/server";
import { serveRSC } from "../../server/rsc";
import { log } from "../../utils/server";
import packageJson from "../../../package.json";

const cli = cac("bun-rsc");

// Dev server
cli.command("dev:rsc").action(async () => {
  log.i("Starting rsc dev server on port 3001");
  try {
    const sockets = createWebSocketServer();
    await build();
    const devServerRSC = Bun.serve({ port: 3001, fetch: serveRSC });

    fs.watch("./src", { recursive: true }, async (event, filename) => {
      if (event === "rename" && filename === "router.tsx") return;
      log.i(`Detected ${event} in ${filename}`);
      await build();
      devServerRSC.reload({ fetch: serveRSC });
      for (const socket of sockets) {
        socket.send("refresh");
      }
    });
  } catch (e: unknown) {
    log.e(`error when starting dev server:\n${e}`);
    process.exit(1);
  }
});


cli.command("serve-rsc").action(async () => {
  log.title();
  const server = Bun.serve({
    port: 3001,
    fetch: serveRSC,
  });
  log.i(`RSC server listening on ${server.port}`);
});

cli.help();
cli.version(packageJson.version);
cli.parse();
