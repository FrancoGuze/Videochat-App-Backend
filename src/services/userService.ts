import { UserRepositoryInterface, UserServiceInterface } from "../types/userInterface"

export class UserService implements UserServiceInterface {
    constructor(private userRepo: UserRepositoryInterface) { }

    joinRoom(socketId: string, userId: string) {
        this.userRepo.add(socketId, userId)
    }

    findUserSocket(userId: string) {
        return this.userRepo.findByUserId(userId)
    }

    findUserIdBySocket(socketId: string) {
        return this.userRepo.findBySocketId(socketId)
    }

    removeBySocket(socketId: string) {
        this.userRepo.remove(socketId)
    }

    listSocketIds() {
        return this.userRepo.listSocketIds()
    }
}
