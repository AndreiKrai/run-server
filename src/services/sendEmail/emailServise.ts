import nodemailer from 'nodemailer';

const { EMAIL_ADRESS, EMAIL_PASS } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: { user: EMAIL_ADRESS, pass: EMAIL_PASS },
};

const transport = nodemailer.createTransport(nodemailerConfig);

interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Base function to send emails
 */
const sendEmail = async (data: EmailData): Promise<boolean> => {
  try {
    const mail = {
      ...data,
      from: EMAIL_ADRESS,
    };

    await transport.sendMail(mail);
    console.log("Mail sent successfully");
    return true;
  } catch (err) {
    console.error("Email sending error:", err);
    return false;
  }
};

/**
 * Send verification email
 */
const sendVerificationEmail = async (
  email: string, 
  verificationToken: string, 
  baseUrl: string
): Promise<boolean> => {
  const url = `${baseUrl}/api/users/verify/${verificationToken}`;
  
  const data: EmailData = {
    to: email,
    subject: "Verify your email address",
    text: `Verify your email by this link: ${url}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2>Email Verification</h2>
        <p>Hello,</p>
        <p>Thanks for signing up! Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Verify Email
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p><a href="${url}">${url}</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The Run4Fun Team</p>
      </div>
    `
  };
  
  return await sendEmail(data);
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (
  email: string, 
  resetToken: string, 
  baseUrl: string
): Promise<boolean> => {
  const url = `${baseUrl}/reset-password/${resetToken}`;
  
  const data: EmailData = {
    to: email,
    subject: "Password Reset Request",
    text: `Reset your password by this link: ${url}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2>Password Reset</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #2196F3; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p><a href="${url}">${url}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Run4Fun Team</p>
      </div>
    `
  };
  
  return await sendEmail(data);
};

export default {
  send: sendEmail,
  verification: sendVerificationEmail,
  passwordReset: sendPasswordResetEmail
};