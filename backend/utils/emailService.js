const nodemailer = require("nodemailer");

const brevoUser = String(process.env.BREVO_SMTP_USER || "").trim();
const brevoPass = String(process.env.BREVO_SMTP_KEY || "").replace(/\s+/g, "");
const gmailUser = String(process.env.GMAIL_USER || "").trim();
const gmailPass = String(process.env.GMAIL_APP_PASS || "").replace(/\s+/g, "");

let transporter = null;
let senderEmail = brevoUser || gmailUser;

if (brevoUser && brevoPass) {
  transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: brevoUser,
      pass: brevoPass,
    },
  });
  senderEmail = process.env.BREVO_SENDER_EMAIL || brevoUser;
} else if (gmailUser && gmailPass) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });
  senderEmail = gmailUser;
} else {
  console.warn("Email credentials missing. No email transport configured.");
}

exports.sendEmail = async (toEmail, subject, message) => {
  try {
    if (!toEmail) {
      console.log("No email found for user, skipping email");
      return;
    }

    if (!transporter) {
      console.warn("No email transporter configured. Skipping email send.");
      return;
    }

    await transporter.sendMail({
      from: `"SwasthSetu" <${senderEmail}>`,
      to: toEmail,
      subject,
      text: message,
    });
    console.log(`📧 Email sent to ${toEmail}`);
  } catch (err) {
    console.error("Email send error:", err.message);
  }
};