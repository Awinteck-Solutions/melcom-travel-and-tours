const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inquiryTypeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: null },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

const InquiryType = mongoose.model("InquiryType", inquiryTypeSchema);

const contactUsFormSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: null },
    inquiryType: {
      type: Schema.Types.ObjectId,
      ref: "InquiryType",
      required: true,
    },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    attachments: [
      {
        filename: String,
        url: String,
        mimeType: String,
      },
    ],
    status: {
      type: String,
      enum: ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "NEW",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
    responseNotes: [
      {
        note: String,
        respondedBy: { type: Schema.Types.ObjectId, ref: "User" },
        respondedAt: { type: Date, default: Date.now },
      },
    ],
    resolvedAt: { type: Date, default: null },
    source: {
      type: String,
      enum: ["WEBSITE", "MOBILE_APP", "EMAIL", "PHONE", "SOCIAL_MEDIA"],
      default: "WEBSITE",
    },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
  },
  { timestamps: true }
);

const ContactUsForm = mongoose.model("ContactUsForm", contactUsFormSchema);

export { InquiryType, ContactUsForm };
