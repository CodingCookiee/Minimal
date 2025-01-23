/* eslint-disable prettier/prettier */
import User from "../models/user.model.js";
import createError from "../utils/createError.utils.js";
import { redis } from "../lib/redis.js";

export const getProfile = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      throw createError(404, "User not found");
    }

    // Check if new values are different from current ones
    if (name && name === user.name) {
      throw createError(
        400,
        "Please use a different name than your current one",
      );
    }

    if (email && email === user.email) {
      throw createError(
        400,
        "Please use a different email than your current one",
      );
    }

    if (password && (await user.comparePassword(password))) {
      throw createError(
        400,
        "New password must be different from your current one",
      );
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password && password.trim()) {
      user.password = password;
    }

    const updatedUser = await user.save();
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (err) {
    next(err);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const addressData = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      throw createError(404, "User not found");
    }

    if (user.addresses.length >= 3) {
      throw createError(
        400,
        "You have reached the maximum number of addresses.",
      );
    }

    // If this is marked as default, unmark other addresses first
    if (addressData.isDefault) {
      await User.updateOne(
        { _id: req.user._id },
        { $set: { "addresses.$[].isDefault": false } },
      );
    }

    // Then add the new address
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { addresses: addressData } },
      { new: true, runValidators: false },
    );

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    next(err);
  }
};

export const editAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const addressData = req.body;

    // If this is marked as default, unmark other addresses first
    if (addressData.isDefault) {
      await User.updateOne(
        { _id: req.user._id },
        { $set: { "addresses.$[].isDefault": false } },
      );
    }

    const user = await User.findOneAndUpdate(
      {
        _id: req.user._id,
        "addresses._id": addressId,
      },
      {
        $set: { "addresses.$": addressData },
      },
      { new: true },
    );

    if (!user) {
      throw createError(404, "Address not found");
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { addresses: { _id: addressId } } },
      { new: true, runValidators: false },
    );

    if (!user) {
      throw createError(404, "User not found");
    }

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.log("Error Getting All Users", err.message);
    next(err);
  }
};

export const toggleAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw createError(404, "User not found");
    }

    // Toggle role between 'admin' and 'user'
    const newRole = user.role === "admin" ? "user" : "admin";

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: newRole, adminRequest: false },
      { new: true },
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log("Error Toggling Admin Status", err.message);
    next(err);
  }
};

export const requestAdminAccess = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { adminRequest: true },
      { new: true },
    );
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getAdminRequests = async (req, res, next) => {
  try {
    // Only fetch pending requests
    const requests = await User.find({
      adminRequest: true,
      role: { $ne: "admin" }, // Exclude users who are already admins
    }).select("-password");
    res.status(200).json(requests);
  } catch (err) {
    next(err);
  }
};

export const rejectAdminRequest = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { adminRequest: false },
      { new: true },
    );

    if (!user) {
      throw createError(404, "User not found");
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const forceLogoutUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Clear user's refresh token from Redis
    await redis.del(`refreshToken:${userId}`);
    
    // Clear user's cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    next(err);
  }
};


export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw createError(404, "User not found");
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log("Error Deleting User:", err.message);
    next(err);
  }
};
