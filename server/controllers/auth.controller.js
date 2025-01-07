import { OAuth2Client } from 'google-auth-library';
import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenUtils.js";
import { sendEmail } from "../utils/email.js";
import jwt from "jsonwebtoken";
import { createTransport } from 'nodemailer';


const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
});

const validatePassword = (password) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password) &&
         /[!@#$%^&*(),.?":{}|<>]/.test(password);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refreshToken:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60,
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw createError(400, "User already exists");
    }
    const user = new User({ 
      name, 
      email, 
      password,
      role: role || "user" 
    });
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);
    res.status(201).json({ user });
  } catch (err) {
    if(err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ errors });
    }
    next(err);
  }
};


export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(401, "Invalid Email, Please try again");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw createError(401, "Invalid Password, Please try again");
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({ user });
  } catch (error) {
    if (error.status === 401) {
      return res.status(401).json({ message: error.message });
    }
    next(error)
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw createError(401, "Refreshed Token is Missing");
    }
    const userId = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    ).userId;
    await redis.del(`refreshToken:${userId}`);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log("Error Logging Out:", error.message);
    next(
      createError(500, {
        message: "Internal Server Error",
        error: error.message,
      }),
    );
  }
};



export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.RESET_PASSWORD_SECRET,
      { expiresIn: '15m' }
    );

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const transporter = createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Password Reset - Minimal',
      html: `
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
      `
    };

    await transporter.verify();
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    next(createError(500, 'Failed to send reset email'));
  }
};


export const resetPassword = async (req, res, next) => {
  const { resetToken, newPassword } = req.body;
  try {
      if (!validatePassword(newPassword)) {
          return res.status(400).json({ 
              message: 'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters'
          });
      }

      const decoded = jwt.verify(resetToken, process.env.RESET_PASSWORD_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
      if (error.name === 'JsonWebTokenError') {
          return res.status(400).json({ message: 'Invalid or expired reset token' });
      }
      next(createError(500, 'Error resetting password'));
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw createError(401, "Refresh Token is Missing");
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refreshToken:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      throw createError(401, "Invalid Refresh Token");
    }
    const accessToken = generateAccessToken(decoded.userId);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });
    res
      .status(200)
      .json({ accessToken, message: "Token Refreshed Successfully" });
  } catch (error) {
    console.log("Error Refreshing Token:", error.message);
    next(
      createError(500, {
        message: "Internal Server Error",
        error: error.message,
      }),
    );
  }
};




export const googleAuth = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const { email, name, picture, sub: googleId } = await response.json();
    
    let user = await User.findOne({ email });
    if (!user) {
      
      const validPassword = `${googleId.slice(0, 4)}Aa1!${process.env.GOOGLE_CLIENT_SECRET.slice(0, 4)}`;
      
      user = new User({
        email,
        name,
        password: validPassword,
        profilePicture: picture,
        googleId
      });
      await user.save();
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({ user });
  } catch (error) {
    console.log('Google Auth Error:', error);
    next(createError(500, "Google Authentication Failed"));
  }
};









