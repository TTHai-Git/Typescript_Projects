import nodemailer from "nodemailer";
import "../config/dotenv.config.js"; // ✅ loads environment variables once

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SECRET,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = (
  res,
  from,
  to,
  subject,
  text,
  html,
  successMessage,
  failMessage
) => {
  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };
  transporter.sendMail(mailOptions, (error, _info) => {
    if (error) {
      return res.status(500).send({ message: failMessage });
    }
    return res.status(200).send({ message: successMessage });
  });
  return res.status(200).json({message: "Finish send email"})
};
