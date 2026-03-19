import { UserRepositoryInterface } from "../types/userInterface"

class UserService {
    constructor(private userRepo: UserRepositoryInterface) { }
    joinRoom(socketId: string, userId: string) {
        this.userRepo.add(socketId, userId)
    }
    findUserSocket(userId: string) {
        return this.userRepo.findByUserId(userId)
    }
}