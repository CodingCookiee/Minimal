import User from '../models/user.model.js';
import { redis } from '../lib/redis.js';
import { generateAccessToken, generateRefreshToken, storeRefreshToken, setCookies, generateResetToken, verifyResetToken } from '../utils/token.utils.js';
import { sendResetPasswordEmail, sendWelcomeEmail } from '../utils/email.utils.js';
import createError from '../utils/createError.utils.js';
import { OAuth2Client } from 'google-auth-library';


export const authService = {
    signup: async function(userData) {
    const { name, email, password } = userData;
    
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      throw createError(400, "User already exists, please use another email");
    }

    const user = new User({ name, email, password });
    await user.save();
    await sendWelcomeEmail(email, name);
    
    return user;
  },

  signin: async function(email, password) {
    const user = await User.findOne({ email: email.toString() });
    if (!user) {
      throw createError(401, "Invalid email, please try again");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw createError(401, "Invalid password, please try again");
    }

    return user;
  },
  googleAuth: async function(token) {
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
    
    return user;
  },

  handleTokens: async function(user, res) {
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);
  },

  logout: async function(refreshToken) {
    if (!refreshToken) {
      throw createError(401, "Refresh Token is Missing");
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    await redis.del(`refreshToken:${decoded.userId}`);
  },

  initiatePasswordReset: async function(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, "User not found, please try again");
    }

    const resetToken = generateResetToken(user._id);
    await sendResetPasswordEmail(email, resetToken);
  },

  resetPassword: async function(resetToken, newPassword) {
    const decoded = verifyResetToken(resetToken);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw createError(404, "User not found, please try again");
    }

    user.password = newPassword;
    await user.save();
  }
};
