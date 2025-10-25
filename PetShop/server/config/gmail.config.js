import "../config/dotenv.config.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, text, html) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM, // fallback
      to,
      subject,
      text,
      html,
    });

  } catch (error) {
    console.error("❌ Resend email error:", error);
    throw new Error("Email failed to send.");
  }
};


