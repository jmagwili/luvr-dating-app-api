import likeModel from "../models/likes";

export const likeUser = async (req, res) => {
    try {
        const { liker_id, liked_id } = req.body;
        const newLike = new likeModel({ liker_id, liked_id });
        
        await newLike.save();

        res.status(201).json({ message: "User liked successfully", like: newLike });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const checkLike = async (req, res) => {
    try {
        const { liker, liked } = req.params;
        const existingLike = await likeModel.findOne({ liker_id: liker, liked_id: liked });
        if (existingLike) {
            return res.status(200).json({ liked: true });
        }
        res.status(200).json({ liked: false });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};