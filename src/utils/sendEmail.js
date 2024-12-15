"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
/* eslint-disable no-console */
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendEmail = (to, resetLink) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: config_1.default.NODE_ENV === 'production',
        auth: {
            user: config_1.default.nodemailer_email,
            pass: config_1.default.nodemailer_app_pass,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    try {
        yield transporter.sendMail({
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
        <p>The Shoply Team</p>
        <footer style="margin-top: 20px; font-size: 12px; color: #666;">
          <p>Jhotpot-store, Inc. | 1234 Street Address | City, State ZIP</p>
        </footer>
      </div>`, // HTML body
        });
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
});
exports.sendEmail = sendEmail;
