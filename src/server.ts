import fastify from "fastify";

const PORT = 8000

const app = fastify({
    logger: true
})

app.get("/ping", (request, reply) => {
    reply.status(200).send({"message" : "pong"})
})

app.listen({
    port:PORT
})