import mongoose from "mongoose";

const userSchema = mongoose.Schema({

    email : {
        type: String,
        required: true
    },
    image_url : {
        type: String,
        required: true
    },
    first_name : {
        type: String,
        required: true
    },
    last_name : {
        type: String,
        required: true
    },
    birthdate : {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;