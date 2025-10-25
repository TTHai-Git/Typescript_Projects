import "../config/dotenv.config.js";
import nodemailer from "nodemailer";

export const sendEmail = async (from, to, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SECRET, 
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
};

