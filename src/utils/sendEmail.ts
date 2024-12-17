/* eslint-disable no-console */
import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: config.nodemailer_email,
      pass: config.nodemailer_app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.sendMail({
      from: '"Jhotpot-store" <mahfuz@gmail.com>', 
      to,
      subject: 'Password Reset Request',
      text: `Dear User,

      We received a request to reset your password for your Shoply account. Please click the link below to reset your password. This link will be valid for 10 minutes.

      Reset your password: ${resetLink}

      If you did not request a password reset, please ignore this email or contact our support team.

     Thank you,
     The Shoply Team`, 

      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Dear User,</p>
        <p>We received a request to reset your password for your TravelTrove account. Please click the button below to reset your password. This link will be valid for <strong>10 minutes</strong>.</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 15px; margin-top: 10px; background-color: #f5840c; color: white; text-decoration: none; border-radius: 5px;">Reset Your Password</a>
        <p>If you did not request a password reset, please ignore this email or <a href="mailto:support@traveltrove.com" style="color: #f5840c; text-decoration: none;">contact our support team</a>.</p>
        <p>Thank you,</p>
        <p>The Jhotpot-store Team</p>
        <footer style="margin-top: 20px; font-size: 12px; color: #666;">
          <p>Jhotpot-store, Inc. | 1234 Street Address | City, State ZIP</p>
        </footer>
      </div>`, // HTML body
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};