const mongoose = require("mongoose");

const notificationPreferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  emailNotifications: { type: Boolean, default: true },
  inAppNotifications: { type: Boolean, default: true },
  mutedCategories: [{ type: String }],
});

module.exports = mongoose.model("NotificationPreference", notificationPreferenceSchema);