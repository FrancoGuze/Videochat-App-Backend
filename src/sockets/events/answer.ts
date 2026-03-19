import { SocketData } from "../../types/socketsInterface"
import { UserServiceInterface } from "../../types/userInterface"

interface AnswerBody {
    room: string
    answer: unknown
    from: string
    to: string
}

interface Data extends SocketData {
    userService: UserServiceInterface
    body: AnswerBody
}

export const handleAnswer = (data: Data) => {
    const { answer, to, from } = data.body
    const { socket, userService } = data

    console.log("Envio de answer", { to })
    const findTo = userService.findUserSocket(to)
    if (findTo) {
        socket.to(findTo[0]).emit("answer", { answer, from })
    }
}
