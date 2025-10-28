import userModel from "../models/users.js";
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