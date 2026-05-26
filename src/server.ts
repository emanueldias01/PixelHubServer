import fastify from "fastify";
import { authRoute } from "./routes/routes.js";

const PORT = 8000

const app = fastify({
    logger: true
})

app.register(authRoute)

app.listen({
    port:PORT
})