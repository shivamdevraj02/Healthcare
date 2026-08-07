const Notification = require("../models/Notification");
const User = require("../models/User");
const { sendEmail } = require("./emailService");

exports.createNotification = async (userId, title, message, type = "info", sourceId = null) => {
  try {
    const notif = await Notification.create({
      user: userId,
      title,
      message,
      type,
      read: false,
      sourceId,
    });

    // Socket.io se connected user ko live notification event bhejen
    const req = global.currentReq; // ya controller me direct req.app.get("io") se emit karein
    if (global.io) {
      global.io.to(userId.toString()).emit("new_notification", notif);
    }

    const user = await User.findById(userId).select("email");
    if (user?.email) {
      await sendEmail(user.email, title, message);
    }
    return notif;
  } catch (err) {
    console.error("Notification create error:", err.message);
  }
};