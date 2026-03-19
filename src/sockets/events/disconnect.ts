import { SocketData } from "../../types/socketsInterface"
import { UserServiceInterface } from "../../types/userInterface"

interface Data extends SocketData {
    userService: UserServiceInterface
}

export const handleDisconnect = (data: Data) => {
    const { socket, userService } = data

    const leavingUser = userService.findUserIdBySocket(socket.id)
    console.log({ leavingUser, rooms: socket.rooms })
    userService.removeBySocket(socket.id)
    socket.broadcast.emit("remove-user", { user: leavingUser })
}
