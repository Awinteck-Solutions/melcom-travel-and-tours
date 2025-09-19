const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "info",
        "warning",
        "success",
        "error",
        "booking",
        "promo",
        "system",
      ],
      default: "info",
    },
    read: { type: Boolean, default: false },
    actionUrl: { type: String, default: null },
    metadata: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
