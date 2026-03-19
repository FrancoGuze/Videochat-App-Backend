import { UserRepositoryInterface } from "../types/userInterface"

export class MemoryUserRepository implements UserRepositoryInterface{
    private users = new Map<string, string>()


    add(socketId: string, userId: string) {
        this.users.set(socketId, userId)
    }
    remove(socketId: string) {
        this.users.delete(socketId)
    }
    findByUserId(userId: string) {
        return Array.from(this.users.entries()).find((user) => user[1] === userId)
    }
    findBySocketId(socketId: string) {
        return this.users.get(socketId)
    }
    listSocketIds() {
        return Array.from(this.users.keys())
    }
}
