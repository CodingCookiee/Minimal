import jwt from 'jsonwebtoken';
import { redis } from "../lib/redis.js";

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.ACCESS_TOKEN_SECRET, 
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.REFRESH_TOKEN_SECRET, 
    { expiresIn: "7d" }
  );
};

export const generateResetToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.RESET_PASSWORD_SECRET,
    { expiresIn: "15m" }
  );
};

export const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refreshToken:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

export const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000
  });
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
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
