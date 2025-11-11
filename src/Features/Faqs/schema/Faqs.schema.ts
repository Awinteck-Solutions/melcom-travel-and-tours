import mongoose, { Schema } from 'mongoose';
import { Status } from '../../auth/enums/status.enum';

const FaqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: false },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Status,
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

const Faqs = mongoose.model('Faqs', FaqSchema);

export default Faqs;