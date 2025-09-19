const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recommendedCountrySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true }, // ISO country code
    image: { type: String, required: true },
    numberOfDestinations: { type: Number, default: 0 },
    description: { type: String, default: null },
    continent: {
      type: String,
      enum: [
        "Africa",
        "Asia",
        "Europe",
        "North America",
        "South America",
        "Australia",
        "Antarctica",
      ],
      required: true,
    },
    currency: { type: String, default: null },
    language: { type: String, default: null },
    bestTimeToVisit: { type: String, default: null },
    averageTemperature: { type: String, default: null },
    featured: { type: Boolean, default: false },
    popular: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

const RecommendedCountry = mongoose.model(
  "RecommendedCountry",
  recommendedCountrySchema
);

export default RecommendedCountry;
