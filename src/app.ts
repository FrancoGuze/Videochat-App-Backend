import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import { MemoryUserRepository } from "./repositories/memoryUserRepository";
import { UserService } from "./services/userService";
import { socketEvents } from "./sockets/socketHandler";
import { createUserRoutes } from "./routes/userRoutes";

export const app = express();
export const server = createServer(app);

export const userRepo = new MemoryUserRepository();
export const userService = new UserService(userRepo);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
  })
);

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "*", methods: ["GET", "POST"] },
});
app.use(express.json());

io.on("connection", (socket) => {
  console.log("a user connected");
  socketEvents(io, socket, userService);
});

app.use(createUserRoutes(userService));

const PORT = Number(process.env.PORT);

if (!PORT) {
  throw new Error("PORT no definido");
}

if (process.env.NODE_ENV !== "test") {
  server.listen(
    {
      port: PORT,
      host: "0.0.0.0",
    },
    () => {
      console.log(`Server escuchando en ${PORT}`);
    }
  );
}
