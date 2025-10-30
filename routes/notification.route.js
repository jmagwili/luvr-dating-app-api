import { Router } from "express";
import { getUserNotifications, markNotificationAsRead } from "../controllers/notification.controller.js";

const notificationRouter = Router();

notificationRouter.get("/:userId", getUserNotifications);
notificationRouter.patch("/read/:notificationId", markNotificationAsRead);

export default notificationRouter;