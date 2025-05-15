const nodemailer = require("nodemailer");
const User = require("../model/User");
const NotificationPreference = require("../model/NotificationPreference");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmailNotification = async (userId, subject, message) => {
  const user = await User.findById(userId);
  const preferences = await NotificationPreference.findOne({ userId });
  if (!preferences.emailNotifications) return;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
};