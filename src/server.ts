import fastify from "fastify";
import websocket from "@fastify/websocket";
import cors from "@fastify/cors"

import { authRoute } from "./routes/routes.js";
import {
  unicast,
  broadcast,
  addClient,
  removeClient,
} from "./websockets/connections.js";

import { BoardEntity } from "./entitys/BoardEntity.js";

const boardEntity = new BoardEntity(1000, 1000, "#FFFFFF")

const PORT = 8000;

const app = fastify({
  logger: true,
});

await app.register(cors, {
  origin: "*"
})

await app.register(websocket);

app.register(authRoute);

app.get(
  "/ws",
  { websocket: true },
  (socket) => {
    addClient(socket);
    unicast(boardEntity.raw(), socket)

    socket.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === "draw") {
          boardEntity.setPixel(data.start, data.color, data.username)
          broadcast(data, socket);
        }

        if (data.type === "bucket") {
          boardEntity.applyBucket(data)
          broadcast(boardEntity.raw())
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