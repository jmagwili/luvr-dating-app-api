import { Router } from "express";
import { getChatByUserId, createChat } from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.get("/:userId", getChatByUserId)
chatRouter.post("/", createChat);

export default chatRouter;