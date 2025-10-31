import userModel from "../models/users.js";
import likeModel from "../models/likes.js";
import skipModel from "../models/skips.js";
import Fuse from "fuse.js";

export const createUser = async (req, res) => {
    try {
        const { email, image_url, first_name, last_name, birthdate, bio } = req.body;

        const newUser = new userModel({
            email,
            image_url,
            first_name,
            last_name,
            birthdate,
            bio
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }   
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};

export const queryUser = async (req, res) => {
  try {
    const name = (req.params.name || "").trim();
    if (!name) return res.status(400).json({ message: "Name parameter is required" });

    // Fetch all users (you can limit if you have a large dataset)
    const candidates = await userModel.find({}).limit(1000).lean();

    // Add a combined field for better fuzzy matching
    const dataWithFullName = candidates.map(u => ({
      ...u,
      full_name: `${u.first_name} ${u.last_name}`.toLowerCase(),
    }));

    const fuse = new Fuse(dataWithFullName, {
      keys: [
        { name: "first_name", weight: 0.4 },
        { name: "last_name", weight: 0.3 },
        { name: "full_name", weight: 0.6 }, // ✅ search across full name too
      ],
      threshold: 0.45, // increase for more tolerance to typos
      includeScore: true,
      minMatchCharLength: 2,
    });

    const results = fuse.search(name.toLowerCase());

    const users = results
      .filter(r => r.score != null && r.score <= 0.6)
      .map(r => r.item);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

export const getUnviewedProfiles = async (req, res) => {
  try {
    const { userId } = req.params;
    const excludeParam = req.query.exclude || ""; 
    const limit = parseInt(req.query.limit) || 1; // default 1 if not provided

    const excludeFromClient = excludeParam.split(",").filter(Boolean);

    const likedUsers = await likeModel.find({ liker_id: userId }).select("liked_id -_id");
    const skippedUsers = await skipModel.find({ skipper_id: userId }).select("skipped_id -_id");

    const excludedUserIds = [
      ...likedUsers.map(like => like.liked_id.toString()),
      ...skippedUsers.map(skip => skip.skipped_id.toString()),
      userId,
      ...excludeFromClient,
    ];

    const unviewedProfiles = await userModel
      .find({ _id: { $nin: excludedUserIds } })
      .limit(limit);

    const structuredProfiles = unviewedProfiles.map(profile => ({
      id: profile._id,
      name: `${profile.first_name} ${profile.last_name}`,
      image: profile.image_url,
      bio: profile.bio,
      age: Math.floor((Date.now() - new Date(profile.birthdate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    }));

    res.status(200).json(structuredProfiles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching unviewed profiles", error: error.message });
  }
};
