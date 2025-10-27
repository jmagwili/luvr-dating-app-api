import chatModel from "../models/chats.js";


export const getChatByUserId = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    const chats = await chatModel.aggregate([
      // Join with the Match collection
      {
        $lookup: {
          from: "matches", // Mongo pluralized collection name
          localField: "match_id",
          foreignField: "_id",
          as: "match"
        }
      },
      // Unwind the array from lookup
      { $unwind: "$match" },

      // Filter where the user is either user1_id or user2_id
      {
        $match: {
          $or: [
            { "match.user1_id": userId },
            { "match.user2_id": userId }
          ]
        }
      },

      // Optionally populate the last message
      {
        $lookup: {
          from: "messages",
          localField: "last_message_id",
          foreignField: "_id",
          as: "last_message"
        }
      },
      { $unwind: { path: "$last_message", preserveNullAndEmptyArrays: true } },

      // Sort by most recently updated chats
      { $sort: { updated_at: -1 } }
    ]);

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const createChat = async (req, res) => {
    try {
        const { match_id, last_message_id } = req.body;
        const newChat = new chatModel({ match_id, last_message_id });
        const savedChat = await newChat.save();
        res.status(201).json(savedChat);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};