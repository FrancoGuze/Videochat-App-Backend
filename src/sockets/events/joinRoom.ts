import { SocketData } from "../../types/socketsInterface"
import { UserServiceInterface } from "../../types/userInterface"

interface JoinRoomBody {
    room: string
    userId: string
}

interface Data extends SocketData {
    userService: UserServiceInterface
    body: JoinRoomBody
}

export const handleJoinRoom = (data: Data) => {
    const { room, userId } = data.body
    const { socket, userService } = data

    if (!room || !userId) {
        console.error("room or userId is undefined")
        return false
    }

    socket.join(room)
    userService.joinRoom(socket.id, userId)

    console.log(`${userId} entro en la sala ${room}`)
    console.log(socket.rooms)
    socket.to(room).emit("user-joined", { userId })
}
