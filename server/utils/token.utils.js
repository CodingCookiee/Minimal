import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const generateResetToken = (userId) => {
  return jwt.sign({ userId }, process.env.RESET_PASSWORD_SECRET, {
    expiresIn: "15m",
  });
};

export const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refreshToken:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60,
  );
};

export const setCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true, 
    sameSite: 'none',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  };

  const refreshCookieOptions = {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
};


export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

export const verifyResetToken = (token) => {
  return jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};
