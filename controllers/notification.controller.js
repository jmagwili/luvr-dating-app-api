import notificationSchema from "../models/notifications.js";

export const getUserNotifications = async (req, res) => {
    const { userId } = req.params;
    try {
        const notifications = await notificationSchema.find({ user_id: userId }).sort({ created_at: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error });
    }
};
