import nodemailer from "nodemailer";
import { envVars } from "../../config/config";

export const sendEmail = async (to: string, html: string, subject: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: envVars.EMAIL_USER,
      pass: envVars.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"CineVerse" <${envVars.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
