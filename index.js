// PACKAGE IMPORTS
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { databaseInit } from "./database.js";

// ROUTERS IMPORTS
import userRouter from "./routes/user.route.js";
import swipeRouter from "./routes/swipe.route.js";
import matchRouter from "./routes/match.route.js";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";
import notificationRouter from "./routes/notification.route.js";

dotenv.config();

// Initialize database connection
databaseInit();

// --- EXPRESS AND SOCKET SERVER SETUP ---
const app = express();
const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.1.4:3000", "https://luvr-dating-app.vercel.app"], // allow your frontend domain
    methods: ["GET", "POST", "DELETE", "PATCH" ],
  },
});

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.1.4:3000", "https://luvr-dating-app.vercel.app"] // or specify frontend origin e.g. "https://myapp.vercel.app"
  })
);

// In-memory store to track which user is viewing which chat
const userActiveChats = new Map();

// 👇 Socket.IO setup
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;
  console.log("Client connected:", userId);

  if (userId) {
    socket.join(userId.toString());
    console.log(`User ${userId} joined room ${userId}`);
  }

  // User joins a chat
  socket.on("join_chat", ({ userId, chatId }) => {
    socket.join(chatId);
    userActiveChats.set(userId, chatId);
    console.log(`User ${userId} joined chat ${chatId}`);
  });

  // User leaves a chat
  socket.on("leave_chat", ({ userId }) => {
    userActiveChats.delete(userId);
    console.log(`User ${userId} left the chat`);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    for (const [userId, chatId] of userActiveChats.entries()) {
      if (socket.rooms.has(chatId)) {
        userActiveChats.delete(userId);
      }
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Routes
app.use("/users", userRouter);
app.use("/swipes", swipeRouter);
app.use("/matches", matchRouter);
app.use("/chats", chatRouter);
app.use("/messages", messageRouter);
app.use("/notifications", notificationRouter);

export { io, userActiveChats };

// --- Start Server ---
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});