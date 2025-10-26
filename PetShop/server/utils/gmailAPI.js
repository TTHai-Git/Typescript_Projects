import nodemailer from "nodemailer";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export const sendEmailByGmailAPI = async (email, subject, text, html) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();
    // console.log("accessToken", accessToken);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.SENDER_EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    await transporter.sendMail({
      from: `"Pet Shop" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
  }
};
