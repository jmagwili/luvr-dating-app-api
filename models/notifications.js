import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sender : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    type : {
        type: String,
        required: true
    },
    reference_id : {
        type: mongoose.Schema.Types.ObjectId,
    },
    message : {
        type: String,
        required: true
    },
    is_read : {
        type: Boolean,
        default: false
    },
    created_at : {
        type: Date,
        default: Date.now
    }
});

const notificationModel = mongoose.model("Notification", notificationSchema);

export default notificationModel;