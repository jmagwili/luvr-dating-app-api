import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { databaseInit } from "./database.js";

// ROUTES
import userRouter from "./routes/user.route.js";
import swipeRouter from "./routes/swipe.route.js";
import matchRouter from "./routes/match.route.js";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";

dotenv.config();

// Initialize database connection
databaseInit();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000", // or specify frontend origin e.g. "https://myapp.vercel.app"
  })
);

// Routes
app.use("/users", userRouter);
app.use("/swipes", swipeRouter);
app.use("/matches", matchRouter);
app.use("/chats", chatRouter);
app.use("/messages", messageRouter);

// --- Socket.IO Setup ---
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // allow your frontend domain
    methods: ["GET", "POST", "DELETE", "PATCH" ],
  },
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Example event: join chat room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Example event: send message
  socket.on("send_message", (data) => {
    console.log("Message received:", data);
    // broadcast message to the room
    io.to(data.roomId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// --- Start Server ---
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { io };
