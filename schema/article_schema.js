import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true, unique: true },
    author: { type: String },
    comments: [
      {
        _id: String, // Ensure unique comment IDs
        content: String,
        author: String, // Store the comment author
        createdTime: { type: Date, default: Date.now }, // Track comment creation time
      }
    ],
    createdTime: { type: Date, default: Date.now },
    updatedTime: { type: Date, default: Date.now }
  });


export default articleSchema;