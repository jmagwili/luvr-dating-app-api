import likeModel from "../models/likes.js";
import matchModel from "../models/matches.js";
import skipModel from "../models/skips.js";
import notificationModel from "../models/notifications.js";
import userModel from "../models/users.js";

import { io } from "../index.js";

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

            const liker = await userModel.findById(liker_id);
            const liked = await userModel.findById(liked_id);

            const likerName = `${liker.first_name} ${liker.last_name}`;
            const likedName = `${liked.first_name} ${liked.last_name}`;

            // Create notifications for both users
            const notificationForLiker = new notificationModel({
                user_id: liker_id,
                type: "match",
                message: `You have a new match with ${likedName}!`
            });
            const notificationForLiked = new notificationModel({
                user_id: liked_id,
                type: "match",
                message: `You have a new match with ${likerName}!`
            });

            await notificationForLiker.save();
            await notificationForLiked.save();

            // Emit Socket.IO events to both users
            io.to(liker_id.toString()).emit("new_match", { match: newMatch, message: notificationForLiker.message });
            io.to(liked_id.toString()).emit("new_match", { match: newMatch, message: notificationForLiked.message });
        }

        res.status(201).json({ message: "User liked successfully", like: newLike });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const unlikeUser = async (req, res) => {
    try {
        const { liker_id, liked_id } = req.body;
        const deletedLike = await likeModel.findOneAndDelete({ liker_id, liked_id });

        if (!deletedLike) {
            return res.status(404).json({ message: "Like not found" });
        }

        // Also remove match if it exists
        await matchModel.findOneAndDelete({
            $or: [
                { user1_id: liker_id, user2_id: liked_id },
                { user1_id: liked_id, user2_id: liker_id }
            ]
        });

        res.status(200).json({ message: "User unliked successfully" });
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
