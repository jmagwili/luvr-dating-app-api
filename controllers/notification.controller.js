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

export const markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params;
    
    try {
        const notification = await notificationSchema.findById(notificationId);

        if (notification.is_read) {
            return res.status(400).json({ message: "Notification is already marked as read" });
        }

        notification.is_read = true;
        await notification.save();

        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error updating notification", error });
    }
};
