import mongoose, { Schema } from 'mongoose';

// Contact/Support form based on existing content ContactUsFormSchema
const SupportFormSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    inquiryType: {
      type: Schema.Types.ObjectId,
      ref: 'InquiryTypes',
      required: true,
    },
    status: {
      type: String,
      enum: ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "NEW",
    },
    response: { type: String },
    respondedAt: { type: Date },
    respondedBy: { type: String },
  },
  { timestamps: true }
);

const SupportForm = mongoose.model('SupportForm', SupportFormSchema);
export default SupportForm;