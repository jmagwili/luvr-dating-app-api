import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    chat_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Chat"
    },
    sender_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    content : {
        type: String,
        required: true
    },
    timestamp : {
        type: Date,
        default: Date.now,
        required: true
    },
    read_at : {
        type: Date,
    },
});

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;