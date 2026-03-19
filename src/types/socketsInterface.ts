import { Server, Socket } from "socket.io";

export interface SocketData {
    io: Server;
    socket: Socket
}

