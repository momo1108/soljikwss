const express = require("express");
const { createServer } = require("http");
const WebSocket = require("ws");

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("new client!");
  ws.send("welcome~");

  ws.on("message", (msg) => {
    console.log(`msg received : ${msg}`);
    ws.send(`msg successfully received. msg : ${msg}`);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
