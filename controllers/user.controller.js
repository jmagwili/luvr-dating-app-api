import userModel from "../models/users.js";

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

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};