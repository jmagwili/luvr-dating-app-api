import mongoose from "mongoose";

const skipSchema = mongoose.Schema({
    skipper_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    skipped_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    created_at : {
        type: Date,
        default: Date.now
    }
});

const skipModel = mongoose.model("Skip", skipSchema);

export default skipModel;