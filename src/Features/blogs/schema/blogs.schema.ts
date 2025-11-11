import mongoose, { Schema } from "mongoose";

// Blogs Schema
const BlogsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: false
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'BlogCategories',
        required: true,
      },
    author: {
        type: String,
        required: true
    },
    imageUrl: String,
    tags: [String],
    readTime: {
        type: Number, // in minutes
        default: 5
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
        default: "DRAFT",
    },
    publishedAt: Date,
}, { timestamps: true });

// Blog Categories Schema
const BlogCategoriesSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    imageUrl: String,
    status: {
        type: String,
        enum: ["ACTIVE", "DEACTIVE"],
        default: "ACTIVE",
    },
}, { timestamps: true });

// Create and export models
const Blogs = mongoose.model("Blogs", BlogsSchema);
const BlogCategories = mongoose.model("BlogCategories", BlogCategoriesSchema);

export { Blogs, BlogCategories };

export default Blogs;