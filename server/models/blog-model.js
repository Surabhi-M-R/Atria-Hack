const { Schema, model } = require("mongoose");

const blogSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        author: { type: String, required: true, trim: true },
        tags: [{ type: String, trim: true }],
        publishedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Blog = model("Blog", blogSchema);

module.exports = Blog;

