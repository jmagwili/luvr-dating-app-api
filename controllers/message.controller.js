import messageModel from "../models/messages.js";
import chatModel from "../models/chats.js";

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

        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};