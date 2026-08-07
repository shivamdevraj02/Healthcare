const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  res.set("Cache-Control", "no-store");
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json(notifications);
};
exports.markRead = async (req, res) => {
  res.set("Cache-Control", "no-store");
  const notif = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );
  res.json(notif);
};

exports.markAllRead = async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json({ message: "All marked read" });
};