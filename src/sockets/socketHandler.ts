import { Server, Socket } from "socket.io"
import { UserServiceInterface } from "../types/userInterface"
import { handleAnswer } from "./events/answer"
import { handleDisconnect } from "./events/disconnect"
import { handleIceCandidate } from "./events/iceCandidate"
import { handleJoinRoom } from "./events/joinRoom"
import { handleMediaUpdate } from "./events/mediaUpdate"
import { handleOffer } from "./events/offer"

export const socketEvents = (io: Server, socket: Socket, userService: UserServiceInterface) => {
    socket.on("join-room", (body) => handleJoinRoom({ io, socket, body, userService }))
    socket.on("offer", (body) => handleOffer({ io, socket, body, userService }))
    socket.on("answer", (body) => handleAnswer({ io, socket, body, userService }))
    socket.on("ice-candidate", (body) => handleIceCandidate({ io, socket, body, userService }))
    socket.on("media-update", (body) => handleMediaUpdate({ io, socket, body, userService }))
    socket.on("disconnect", () => handleDisconnect({ io, socket, userService }))
}
