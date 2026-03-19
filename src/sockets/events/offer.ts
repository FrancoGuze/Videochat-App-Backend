import { SocketData } from "../../types/socketsInterface"
import { UserServiceInterface } from "../../types/userInterface"

interface OfferBody {
    room: string
    offer: unknown
    from: string
    to: string
}

interface Data extends SocketData {
    userService: UserServiceInterface
    body: OfferBody
}

export const handleOffer = (data: Data) => {
    const { offer, from, to } = data.body
    const { socket, userService } = data

    console.log("Envio de offer", { from, to })
    const findTo = userService.findUserSocket(to)
    if (findTo) {
        socket.to(findTo[0]).emit("offer", { offer, from })
        return
    }

    socket.to(to).emit("offer", { offer, from })
}
