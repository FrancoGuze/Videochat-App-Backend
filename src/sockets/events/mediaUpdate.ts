import { SocketData } from "../../types/socketsInterface"
import { UserServiceInterface } from "../../types/userInterface"

interface MediaUpdateBody {
    room: string
    user: string
    state: unknown
}

interface Data extends SocketData {
    userService: UserServiceInterface
    body: MediaUpdateBody
}

export const handleMediaUpdate = (data: Data) => {
    const { room, user, state } = data.body
    const { socket } = data

    console.log(`${user} notifica a ${room} cambio de media`)
    console.log({ state })
    socket.to(room).emit("media-update", { user, state })
}
