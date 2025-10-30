import { Router } from "express";
import { getMessagesByChatId, createMessage, updateReadAt } from "../controllers/message.controller.js";

const messageRouter = Router();

messageRouter.get("/:chatId", getMessagesByChatId)
messageRouter.post("/", createMessage);
messageRouter.patch("/read/:chatId/:userId", updateReadAt);

export default messageRouter;