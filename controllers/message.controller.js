import messageModel from "../models/messages.js";
import chatModel from "../models/chats.js";
import matchModel from "../models/matches.js";
import notificationModel from "../models/notifications.js";
import userModel from "../models/users.js";

import { io } from "../index.js";

export const getMessagesByChatId = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const messages = await messageModel.find({ chat_id: chatId }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const createMessage = async (req, res) => {
    try {
        const { chat_id, sender_id, content } = req.body;
        const newMessage = new messageModel({ chat_id, sender_id, content });
        const savedMessage = await newMessage.save();

        // Update the last_message_id in the corresponding chat
        await chatModel.findByIdAndUpdate(chat_id, { last_message_id: savedMessage._id });

        // Fetch recipient ans sender information
        const chat = await chatModel.findById(chat_id);
        const match = await matchModel.findById(chat.match_id);
        const recipientId = match.user1_id === sender_id ? match.user2_id : match.user1_id;
        const recipientUser = await userModel.findById(recipientId);
        const recipientName = `${recipientUser.first_name} ${recipientUser.last_name}`;
        const senderUser = await userModel.findById(sender_id);
        const senderName = `${senderUser.first_name} ${senderUser.last_name}`;

        // Create a notification for the recipient
        const newNotification = new notificationModel({
            user_id: recipientId,
            type: "message",
            message: `New message from ${recipientName}: ${content}`
        });

        await newNotification.save();

        // Emit a Socket.IO event to the recipient
        io.to(recipientId.toString()).emit("new_message", { message: savedMessage.content, sender:  senderName});    

        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
        console.error(error);
    }
};