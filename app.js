const express = require("express");
const { Server } = require("socket.io");

const app = express();
const port = 3000;
const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(socket.id, "a user connected");
});
