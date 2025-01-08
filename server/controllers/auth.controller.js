import { authService } from '../services/auth.services.js';
import createError from '../utils/createError.utils.js';


export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.signup({ name, email, password });
    await authService.handleTokens(user, res);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.signin(email, password);
    await authService.handleTokens(user, res);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};;

export const googleAuth = async (req, res, next) => {
  try {
    const user = await authService.googleAuth(req.body.token);
    await authService.handleTokens(user, res);
    res.status(200).json({ user });
  } catch (error) {
    next(createError(500, "Google Authentication Failed"));
  }
};


export const logout = async (req, res, next) => {
  try {
      const refreshToken = req.cookies.refreshToken;
      await authService.logout(refreshToken);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
      next(error);
  }
};


export const forgotPassword = async (req, res, next) => {
  try {
    await authService.initiatePasswordReset(req.body.email);
    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email'
    });
  } catch (error) {
    console.log('Forgot Password Error', error.message);
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;
    await authService.resetPassword(resetToken, newPassword);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.log('Reset Password Error', error.message);
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { accessToken } = await authService.refreshAccessToken(req.cookies.refreshToken);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });
    res.status(200).json({ message: "Token Refreshed Successfully" });
  } catch (error) {
    next(error);
  }
};
