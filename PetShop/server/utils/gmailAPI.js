import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

export const sendEmailByGmailAPI = async (email, subject, text, html) => {
  try {
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const messageParts = [
      `From: "Pet Shop" <${process.env.SENDER_EMAIL}>`,
      `To: ${email}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="boundary_string"`,
      "",
      "--boundary_string",
      "Content-Type: text/plain; charset=UTF-8",
      "",
      text,
      "",
      "--boundary_string",
      "Content-Type: text/html; charset=UTF-8",
      "",
      html,
      "",
      "--boundary_string--",
    ];

    const rawMessage = Buffer.from(messageParts.join("\n"))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: rawMessage,
      },
    });

    console.log("✅ Email sent successfully via Gmail API (NO SMTP)");
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
  }
};
