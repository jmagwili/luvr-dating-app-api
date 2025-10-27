import mongoose from "mongoose";

const matchSchema = mongoose.Schema({
    user1_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    user2_id : {
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

const matchModel = mongoose.model("Match", matchSchema);

export default matchModel;