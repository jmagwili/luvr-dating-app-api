import matchModel from "../models/matches.js";

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

        const structuredMatches = matches.map(match => {
            const matchedUserId = match.user1_id.toString() === req.params.id ? match.user2_id : match.user1_id;
            return {
                match_id: match._id,
                user_id: matchedUserId
            };
        });

        res.status(200).json(structuredMatches);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};