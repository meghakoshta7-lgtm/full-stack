import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

function resolveIPv4(host: string): Promise<string> {
  return new Promise((resolve, reject) => {
    dns.resolve4(host, (err, addresses) => {
      if (err || !addresses.length) {
        reject(err || new Error('No IPv4 addresses found'));
      } else {
        resolve(addresses[0]);
      }
    });
  });
}

async function createTransport() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);

  const ipv4 = await resolveIPv4(host);
  console.log('[EmailService] Resolved IPv4:', host, '->', ipv4);

  return nodemailer.createTransport({
    host: ipv4,
    port,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
  });
}

export class EmailService {
  static async sendPasswordResetEmail(to: string, rawToken: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;

    console.log('[EmailService] Sending to:', to);

    const transporter = await createTransport();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Store Rating System <noreply@gmail.com>',
      to,
      subject: 'Password Reset Request - Store Rating System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset</h2>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: #fff; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #888; font-size: 13px;">This link expires in 1 hour. If you did not request this, ignore this email.</p>
        </div>
      `,
    });

    console.log('[EmailService] Email sent. MessageId:', info.messageId);
  }
}
