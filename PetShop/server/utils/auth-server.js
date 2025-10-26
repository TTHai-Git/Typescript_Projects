// auth-server.js
import { google } from "googleapis";
import fs from "fs";
import "../config/dotenv.config.js"; // loads .env

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = [
  // "https://www.googleapis.com/auth/gmail.send",
  "https://mail.google.com/", // nếu muốn đầy đủ
];

export const auth = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // quan trọng để có refresh_token
    prompt: "consent", // buộc ask again để có refresh token nếu đã từng cấp
    scope: SCOPES,
  });
  // Redirect user to Google consent screen
  res.redirect(authUrl);
};

export const oauth2CallBack = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Missing code");
  try {
    const { tokens } = await oauth2Client.getToken(code);
    // tokens contains access_token, refresh_token (maybe), expiry_date...
    console.log("TOKENS:", tokens);

    // 1) show user the refresh token and also save to a file token.json locally (only for initial setup)
    if (tokens.refresh_token) {
      const rt = tokens.refresh_token;
      // show on page + write to file (local testing)
      fs.writeFileSync("refresh_token.txt", rt);
      res.send(
        `<h3>Got refresh token — copy this value and save to your Render env var REFRESH_TOKEN</h3>
         <pre>${rt}</pre>
         <p>Also saved to refresh_token.txt on server (local only). After copying, remove the file for security.</p>`
      );
    } else {
      // If no refresh_token returned, inform user (maybe it was already granted before)
      res.send(`<h3>No refresh token returned. Maybe it was already granted. Check server logs for tokens object:</h3><pre>${JSON.stringify(
        tokens
      )}</pre>
                <p>If you need a refresh token, try /auth with prompt=consent or remove previous grants in Google account security settings.</p>`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error exchanging code: " + err.message);
  }
};
