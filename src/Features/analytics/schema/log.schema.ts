const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    sessionId: { type: String, default: null },
    action: {
      type: String,
      enum: [
        "SEARCH_FLIGHTS",
        "CLICK_FLIGHT",
        "CLICK_FLIGHT_DEAL",
        "USE_PROMO",
        "CLICK_BLOG",
        "CLICK_FAQ",
        "VIEW_COUNTRY",
        "BOOK_FLIGHT",
        "CANCEL_BOOKING",
        "CONTACT_FORM",
        "LOGIN",
        "REGISTER",
        "VIEW_PAGE",
      ],
      required: true,
    },
    category: {
      type: String,
      enum: ["SEARCH", "CLICK", "BOOKING", "USER_ACTION", "PAGE_VIEW"],
      required: true,
    },
    metadata: {
      // For flight searches
      from: { type: String },
      to: { type: String },
      passengers: { type: Number },
      flightType: { type: String },

      // For clicks
      itemId: { type: String },
      itemType: { type: String },
      itemTitle: { type: String },

      // For promos
      promoCode: { type: String },
      promoValue: { type: Number },

      // For bookings
      bookingId: { type: String },
      amount: { type: Number },
      currency: { type: String },

      // For page views
      page: { type: String },
      referrer: { type: String },

      // Additional data
      additional: { type: Schema.Types.Mixed },
    },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
    country: { type: String, default: null },
    city: { type: String, default: null },
    device: {
      type: String,
      enum: ["DESKTOP", "MOBILE", "TABLET", "UNKNOWN"],
      default: "UNKNOWN",
    },
    browser: { type: String, default: null },
    os: { type: String, default: null },
  },
  { timestamps: true }
);

// Index for performance
logSchema.index({ action: 1, createdAt: -1 });
logSchema.index({ userId: 1, createdAt: -1 });
logSchema.index({ category: 1, createdAt: -1 });

const Log = mongoose.model("Log", logSchema);

export default Log;
