const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

exports.sendEmail = async (toEmail, subject, message) => {
  try {
    if (!toEmail) {
      console.log("No email found for user, skipping email");
      return;
    }
    await transporter.sendMail({
      from: `"SwasthSetu" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject,
      text: message,
    });
    console.log(`📧 Email sent to ${toEmail}`);
  } catch (err) {
    console.error("Email send error:", err.message);
  }
};