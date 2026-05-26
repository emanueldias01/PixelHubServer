import fastify from "fastify";
import websocket from "@fastify/websocket";

import { authRoute } from "./routes/routes.js";
import {
  broadcast,
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

    socket.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === "draw") {
          broadcast(data, socket);
        }
      } catch (error) {
        console.error("Erro ao fazer parse da mensagem:", error);
      }
    });

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