import matchModel from "../models/matches.js";
import userModel from "../models/users.js";

export const getMatchById = async (req, res) => {
    try {
        const matchId = req.params.id;
        const match = await matchModel.findById(matchId);

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        res.status(200).json(match);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const createMatch = async (req, res) => {
    try {
        const { user1_id, user2_id } = req.body;
        const newMatch = new matchModel({ user1_id, user2_id });
        const savedMatch = await newMatch.save();

        res.status(201).json(savedMatch);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getAllMatches = async (req, res) => {
    try {
        const matches = await matchModel.find({
            $or: [
                { user1_id: req.params.id },
                { user2_id: req.params.id }
            ],
        });

        // collect the matched user ids (as strings)
        const matchedUserIds = matches.map(match =>
            match.user1_id.toString() === req.params.id ? match.user2_id.toString() : match.user1_id.toString()
        );

        // fetch unique users in one query
        const uniqueUserIds = [...new Set(matchedUserIds)];
        const users = await userModel.find({ _id: { $in: uniqueUserIds } })
            .select("image_url first_name last_name bio birthdate");

        const usersById = users.reduce((acc, u) => {
            acc[u._id.toString()] = u;
            return acc;
        }, {});

        const structuredMatches = matches.map(match => {
            const matchedUserId = match.user1_id.toString() === req.params.id ? match.user2_id.toString() : match.user1_id.toString();
            const user = usersById[matchedUserId] || {};
            return {
                match_id: match._id,
                user_id: matchedUserId,
                image_url: user.image_url || null,
                name: `${user.first_name} ${user.last_name}` || null,
                bio: user.bio || null,
                age: Math.floor((Date.now() - new Date(user.birthdate).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) ?? null
            };
        });

        res.status(200).json(structuredMatches);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const deleteMatch = async (req, res) => {
    try {
        const matchId = req.params.id;
        const deletedMatch = await matchModel.findByIdAndDelete(matchId);
        
        if (!deletedMatch) {
            return res.status(404).json({ message: "Match not found" });
        }
        
        res.status(200).json({ message: "Match deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};