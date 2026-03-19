import { SocketData } from "../../types/socketsInterface"
import { UserServiceInterface } from "../../types/userInterface"

interface Data extends SocketData {
    userService: UserServiceInterface
    room: string, userId: string
}

export const handleJoinRoom = (data: Data) => {
    const { room, userId, socket,userService } = data
    if (!room || !userId) {
        console.error("room or userId is undefined")
        return false
    }
    socket.join(room)
    // userService.joinRoom

}