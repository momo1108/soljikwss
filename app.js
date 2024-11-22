const express = require("express");
const { createServer } = require("http");
const WebSocket = require("ws");

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

const rooms = new Map();

wss.on("connection", (ws) => {
  console.log("New client connected!");

  let currentRoomId = null;

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      if (data.type === "join") {
        // 클라이언트가 특정 상품 채팅방에 참여
        const { roomId } = data;
        currentRoomId = roomId;

        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set());
        }
        rooms.get(roomId).add(ws);
        console.log(`Client joined room: ${roomId}`);
        ws.send(
          JSON.stringify({
            type: "notification",
            message: `채팅에 연결됐습니다.`,
          })
        );
      } else if (data.type === "message") {
        // 메시지를 같은 방의 모든 클라이언트에게 브로드캐스트
        const { roomId, message } = data;

        if (rooms.has(roomId)) {
          rooms.get(roomId).forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(data));
            }
          });
          console.log(`Message sent to room ${roomId}: ${message}`);
        } else {
          ws.send(JSON.stringify({ type: "error", message: "Room not found" }));
        }
      }
    } catch (err) {
      console.error("Error processing message:", err);
      ws.send(
        JSON.stringify({ type: "error", message: "Invalid message format" })
      );
    }
  });

  ws.on("close", () => {
    if (currentRoomId && rooms.has(currentRoomId)) {
      rooms.get(currentRoomId).delete(ws);
      console.log(`Client disconnected from room: ${currentRoomId}`);

      if (rooms.get(currentRoomId).size === 0) {
        rooms.delete(currentRoomId);
        console.log(`Room ${currentRoomId} deleted`);
      }
    }
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
