import fastify from "fastify";
import websocket from "@fastify/websocket";

import { authRoute } from "./routes/routes.js";
import {
  addClient,
  removeClient,
} from "./websockets/connections.js";

const PORT = 8000;

const app = fastify({
  logger: true,
});

await app.register(websocket);

app.register(authRoute);

app.get(
  "/ws",
  { websocket: true },
  (socket) => {

    addClient(socket);

    console.log("Client connected");

    socket.on("close", () => {
      removeClient(socket);

      console.log("Client disconnected");
    });

  }
);

await app.listen({
  port: PORT,
  host: "0.0.0.0",
});