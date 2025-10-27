import mongoose from "mongoose";

const likeSchema = mongoose.Schema({
    liker_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    liked_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    timestamp : {
        type: Date,
        default: Date.now,
        required: true
    },
});

const likeModel = mongoose.model("Like", likeSchema);

export default likeModel;