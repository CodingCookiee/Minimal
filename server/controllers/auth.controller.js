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

const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
});


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
    console.log("Error Logging In:", error.message);
    next(
      createError(500, {
        message: "Internal Server Error",
        error: error.message,
      }),
    );
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
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, "User not found");
    }
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.RESET_PASSWORD_SECRET,
      { expiresIn: "15m" },
    );
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    const message = `Hi,\n\nYou requested a password reset. Please click on the following link to reset your password: ${resetUrl}\n\nRegards,\n\nMinimal Customer Support`;

    await sendEmail(user.email, "Password Reset Request", message);

    res.status(200).json({ message: "Reset Password Email Sent" });
  } catch (error) {
    console.log("Error Forgot Password:", error.message);
    next(
      createError(500, {
        message: "Internal Server Error",
        error: error.message,
      }),
    );
  }
};

export const resetPassword = async (req, res, next) => {
  const { resetToken, newPassword } = req.body;
  try {
    const { userId } = jwt.verify(
      resetToken,
      process.env.RESET_PASSWORD_SECRET,
    );
    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    console.log("Error Reset Password:", error.message);
    next(
      createError(500, {
        message: "Internal Server Error",
        error: error.message,
      }),
    );
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
    
    const client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID
    });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const { email, name, picture, sub: googleId } = ticket.getPayload();
    
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        name,
        password: `${googleId}${process.env.GOOGLE_CLIENT_SECRET}#1Aa`,
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






