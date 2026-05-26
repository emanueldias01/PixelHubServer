import type { User } from "../types/user.js";
import { broadcast } from "../websockets/connections.js";

export const users: User[] = []

export async function login(user: User) {
    const findUser = users.find(u => u.username === user.username)
    if(findUser) {
        throw new Error("This user already use board")
    }else {
        users.push(user)
        broadcast({
            type: "users",
            users,
        });
    }
}

export async function logout(user: User) {
    const findUser = users.find(u => u.username === user.username)
    if(findUser) {
        const index = users.indexOf(findUser)
        users.splice(index, 1)
        broadcast({
            type: "users",
            users,
        });
    }else {
        throw new Error("This user is not found")
    }
}

