import User from "../models/user.model.js";
import createError from "../utils/createError.utils.js";

export const getProfile = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password, profilePicture } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      throw createError(404, "User not found");
    }
    user.name = name || user.name;
    user.email = email || user;
    user.password = password || user.password;
    user.profilePicture = profilePicture || user.profilePicture;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const addressData = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { address: addressData },
      { new: true },
    );

    if (!user) {
      throw createError(404, "User not found");
    }

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

export const editAddress = async (req, res, next) => {
  try {
    const addressData = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { address: addressData },
      { new: true },
    );
    if (!user) {
      throw createError(404, "User not found");
    }
    res.status(200).json({ user });
    next();
  }
    catch (err) {
    next(err);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        address: {
          name: "",
          address1: "",
          address2: "",
          city: "",
          country: "",
          postalCode: "",
          phone: "",
          isDefault: false,
        },
      },
      { new: true },
    );

    if (!user) {
      throw createError(404, "User not found");
    }

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};
