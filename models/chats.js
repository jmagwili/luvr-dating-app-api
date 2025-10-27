import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    match_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Match"
    },
    last_message_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    updated_at : {
        type: Date,
        default: Date.now,
        required: true
    },
});

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;
