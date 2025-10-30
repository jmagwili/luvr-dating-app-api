import { Router } from "express";
import { getUserNotifications } from "../controllers/notification.controller.js";

const notificationRouter = Router();

notificationRouter.get("/:userId", getUserNotifications);

export default notificationRouter;