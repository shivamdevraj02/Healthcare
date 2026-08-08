const nodemailer = require("nodemailer");

const gmailUser = String(process.env.GMAIL_USER || "").trim();
const gmailPass = String(process.env.GMAIL_APP_PASS || "").replace(/\s+/g, "");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

exports.sendEmail = async (toEmail, subject, message) => {
  try {
    if (!toEmail) {
      console.log("No email found for user, skipping email");
      return;
    }

    if (!gmailUser || !gmailPass) {
      console.warn("Email credentials missing. Skipping email send.");
      return;
    }

    await transporter.sendMail({
      from: `"SwasthSetu" <${gmailUser}>`,
      to: toEmail,
      subject,
      text: message,
    });
    console.log(`📧 Email sent to ${toEmail}`);
  } catch (err) {
    console.error("Email send error:", err.message);
  }
};