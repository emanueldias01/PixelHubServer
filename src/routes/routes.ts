import type { FastifyInstance } from "fastify";
import { userSchema } from "../types/user.js";
import { login, logout } from "../service/service.js";

export async function authRoute(app: FastifyInstance) {
  app.post("/login", async (request, reply) => {
    const user = userSchema.parse(request.body)
    try {
        await login(user)
        reply.status(200).send({
            message : "Login is sucessful!"
        })
    }catch(err) {
        const error = err as Error
        reply.status(409).send({
            message : error.message
        })
    }
  })

  app.post("/logout", async (request, reply) => {
    const user = userSchema.parse(request.body)
    try {
        await logout(user)
        reply.status(200).send({
            message : "Logout is sucessful!"
        })
    }catch(err) {
        const error = err as Error
        reply.status(404).send({
            message : error.message
        })
    }
  })
}