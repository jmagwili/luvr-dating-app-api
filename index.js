import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { databaseInit } from './database.js';

//ROUTES IMPORTS WOULD GO HERE
import userRouter from './routes/user.route.js';
import likeRouter from './routes/like.route.js';
import matchRouter from './routes/match.route.js';
import chatRouter from './routes/chat.route.js';
import messageRouter from './routes/message.route.js';

// Load environment variables from .env file
dotenv.config();

// Initialize database connection
databaseInit();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/users', userRouter);
app.use('/likes', likeRouter);
app.use('/matches', matchRouter);
app.use('/chats', chatRouter);
app.use('/messages', messageRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});