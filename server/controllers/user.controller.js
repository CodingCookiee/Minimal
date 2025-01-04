import User from "../models/user.model.js";
import createError from "../utils/createError.js";

export const getProfile = async (req, res, next) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        next(err);
    }
    }

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
    }
    catch (err) {
        next(err);
    }
    }
