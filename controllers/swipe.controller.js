import likeModel from "../models/likes.js";
import matchModel from "../models/matches.js";
import skipModel from "../models/skips.js";

export const likeUser = async (req, res) => {
    try {
        const { liker_id, liked_id } = req.body;
        const newLike = new likeModel({ liker_id, liked_id });
        
        await newLike.save();

        // Check for mutual like to create a match
        const mutualLike = await likeModel.findOne({ liker_id: liked_id, liked_id: liker_id });
        
        if (mutualLike) {
            const newMatch = new matchModel({ user1_id: liker_id, user2_id: liked_id });
            await newMatch.save();
        }

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

export const getLikesForUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const likes = await likeModel.find({ liked_id: userId });
        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const skipUser = async (req, res) => {
    try {
        const { skipper_id, skipped_id } = req.body;
        const newSkip = new skipModel({ skipper_id, skipped_id });
        
        await newSkip.save();
        
        res.status(201).json({ message: "User skipped successfully", skip: newSkip });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
