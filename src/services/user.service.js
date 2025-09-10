import { User } from "../models/user.model.js";

export const userService = {
  getMe: async (userId) => {
    const user = await User.findOne({ userId }).lean();
    if (!user) throw { status: 404, message: "User không tồn tại" };
    return user;
  },

  updateMe: async (userId, updates) => {
    const allowedUpdates = ["fullName", "email"];
    const filteredUpdates = {};
    allowedUpdates.forEach((key) => {
      if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
    });

    const user = await User.findOneAndUpdate(
      { userId },
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    ).lean();

    if (!user) throw { status: 404, message: "User không tồn tại" };
    return user;
  },
};
