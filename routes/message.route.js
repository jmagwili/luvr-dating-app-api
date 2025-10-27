import { Router } from "express";
import { getMessagesByChatId, createMessage } from "../controllers/message.controller.js";

const messageRouter = Router();

messageRouter.get("/:chatId", getMessagesByChatId)
messageRouter.post("/", createMessage);

export default messageRouter;