import { Server, Socket } from "socket.io"
import { UserServiceInterface } from "../types/userInterface"

export const socketEvents = (io: Server, socket: Socket, UserService: UserServiceInterface) => {
    // socket.on()
}