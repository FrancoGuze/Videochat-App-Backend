import { SocketData } from "../../types/socketsInterface"
import { UserServiceInterface } from "../../types/userInterface"

interface IceCandidateBody {
    room: string
    candidate: unknown
    from: string
    to: string
}

interface Data extends SocketData {
    userService: UserServiceInterface
    body: IceCandidateBody
}

export const handleIceCandidate = (data: Data) => {
    const { candidate, from, to } = data.body
    const { socket, userService } = data

    console.log("LLego ice candidate")
    const findTo = userService.findUserSocket(to)
    if (findTo) {
        socket.to(findTo[0]).emit("ice-candidate", { candidate, from })
    }
}
