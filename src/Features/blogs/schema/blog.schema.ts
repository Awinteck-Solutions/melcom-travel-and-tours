const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: null },
    image: { type: String, default: null },
    slug: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: null },
    featuredImage: { type: String, default: null },
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
    },
    publishedAt: { type: Date, default: null },
    viewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    seoTitle: { type: String, default: null },
    seoDescription: { type: String, default: null },
    seoKeywords: [{ type: String }],
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export { Blog, BlogCategory };
