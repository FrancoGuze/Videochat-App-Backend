import express from "express";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
const app = express();
const server = createServer(app);
const users = new Map();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);
//Cambiar origin con la url de front

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});
app.use(express.json());

const findByValue = (value: string) => {
  let found: [string, string] | undefined;
  Array.from(users.entries()).map((user, i) => {
    if (user.includes(value)) {
      found = user;
      return;
    }
  });
  return found || false;
};

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("join-room", ({ room, userId }) => {
    socket.join(room);
    users.set(socket.id, userId);
    console.log(`${userId} entro en la sala ${room}`);
    console.log(socket.rooms);
    socket.to(room).emit("user-joined", { userId, socketId: socket.id });
  });

  socket.on("offer", ({ room, offer, from, to }) => {
    console.log("Envio de offer", { from, to });
    const findTo = findByValue(to);
    findTo && socket.to(findTo[0]).emit("offer", { offer, from: from });
  });
  socket.on("answer", ({ room, answer, to, from }) => {
    console.log("Envio de answer", { to });
    const findTo = findByValue(to);

    findTo && socket.to(findTo[0]).emit("answer", { answer, from: from });
  });

  socket.on("ice-candidate", ({ room, candidate, from, to }) => {
    console.log("LLego ice candidate");
    const findTo = findByValue(to);

    findTo && socket.to(findTo[0]).emit("ice-candidate", { candidate, from });
  });

  socket.on("media-update", ({ room, user, state }) => {
    console.log(`${user} notifica a ${room} cambio de media`);
    console.log({ state });
    socket.to(room).emit("media-update", {
      user,
      state,
    });
  });

  socket.on("disconnect", (e) => {
    const leavinguser = users.get(socket.id);
    console.log({ leavinguser, rooms: socket.rooms });
    users.delete(socket.id);
    socket.broadcast.emit("remove-user", { user: leavinguser });
  });
});

app.get("/a", (req, res) => {
  let showUsers: string[] = [];
  console.log(users);
  Array.from(users.keys()).forEach((user) => showUsers.push(user));
  res.send({ status: "ok", data: showUsers || "No hay" });
});
app.get("/b/:userId", (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  console.log(users.get(userId));
  res.send(userId || "nada");
});
app.get("/userExists/:userName", (req, res) => {
  const userName = req.params.userName;
  const exists = findByValue(userName);
  console.log(userName, "||", exists);
  if (!exists) {
    res.json({ exists, message: "This user name can be used!" });
  } else {
    res.json({ exists: true, message: "This user name cannot be used..." });
  }
});
app.get("/ping", (req, res) => {
  res.send("pong");
});
const PORT = process.env.PORT
server.listen(PORT || 3000, () => {
  console.log(`Server corriendo en el puerto ${PORT || 3000}`);
});
