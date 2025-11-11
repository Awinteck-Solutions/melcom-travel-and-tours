import mongoose, { Schema } from 'mongoose';

// CountryListCategory schema (name, status)
const CountryListCategorySchema = new Schema(
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

export const CountryListCategory = mongoose.model(
  'CountryListCategory',
  CountryListCategorySchema
);

// CountryList schema (url, status, category, title optional)
const CountryListSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'DEACTIVE'],
      default: 'ACTIVE',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'CountryListCategory',
      required: true,
    },
    title: { type: String, required: false, trim: true },
    position: { type: Number, required: false, default: 0 },
  },
  { timestamps: true }
);

export const CountryList = mongoose.model('CountryList', CountryListSchema);

export default CountryList;