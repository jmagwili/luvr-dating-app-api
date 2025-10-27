import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGO_URI;

export const databaseInit = () => {
    mongoose.connect(url)
        .then(() => {
            console.log('CONNECTED TO THE DATABASE');
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error.message);
        });
};