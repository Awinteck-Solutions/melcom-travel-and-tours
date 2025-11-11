import mongoose, { Schema } from 'mongoose';

// SpecialDealsCategory schema (name, status)
const SpecialDealsCategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'DEACTIVE'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

export const SpecialDealsCategory = mongoose.model(
  'SpecialDealsCategory',
  SpecialDealsCategorySchema
);

// SpecialDeals schema (url, title, state, country, amount, category, status)
const SpecialDealsSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    state: { type: String, required: false, trim: true },
    country: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'SpecialDealsCategory',
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'DEACTIVE'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

export const SpecialDeals = mongoose.model('SpecialDeals', SpecialDealsSchema);

export default SpecialDeals;

       