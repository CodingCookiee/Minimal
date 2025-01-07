import { createTransport } from 'nodemailer';

const createTransporter = () => {
  return createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const generateResetPasswordTemplate = (resetUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Password Reset Request</h1>
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
          style="background-color: #5724ff; color: white; padding: 12px 24px; 
          text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>This link will expire in 15 minutes for security reasons.</p>
      <p>If you didn't request this reset, you can safely ignore this email.</p>
      <p>Best regards,<br>Minimal Team</p>
    </div>
  `;
};

export const sendResetPasswordEmail = async (email, resetToken) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset - Minimal',
    html: generateResetPasswordTemplate(resetUrl)
  };

  await transporter.verify();
  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to Minimal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Welcome to Minimal!</h1>
        <p>Hello ${name},</p>
        <p>Thank you for joining Minimal. We're excited to have you on board!</p>
        <p>Best regards,<br>Minimal Team</p>
      </div>
    `
  };

  await transporter.verify();
  await transporter.sendMail(mailOptions);
};
