const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const staticContentSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["terms-and-conditions", "privacy-policy", "cookies", "about-us"],
      required: true,
      unique: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
    version: { type: String, default: "1.0" },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

const StaticContent = mongoose.model("StaticContent", staticContentSchema);

const faqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "general",
        "booking",
        "payment",
        "flights",
        "cancellation",
        "support",
      ],
      default: "general",
    },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

const FAQ = mongoose.model("FAQ", faqSchema);

const contactInfoSchema = new Schema(
  {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, default: null },
    address: {
      street: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      country: { type: String, default: null },
      postalCode: { type: String, default: null },
    },
    socialMedia: {
      facebook: { type: String, default: null },
      twitter: { type: String, default: null },
      instagram: { type: String, default: null },
      linkedin: { type: String, default: null },
      youtube: { type: String, default: null },
    },
    businessHours: {
      monday: { type: String, default: "9:00 AM - 5:00 PM" },
      tuesday: { type: String, default: "9:00 AM - 5:00 PM" },
      wednesday: { type: String, default: "9:00 AM - 5:00 PM" },
      thursday: { type: String, default: "9:00 AM - 5:00 PM" },
      friday: { type: String, default: "9:00 AM - 5:00 PM" },
      saturday: { type: String, default: "10:00 AM - 2:00 PM" },
      sunday: { type: String, default: "Closed" },
    },
    isDefault: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ContactInfo = mongoose.model("ContactInfo", contactInfoSchema);

export { StaticContent, FAQ, ContactInfo };
