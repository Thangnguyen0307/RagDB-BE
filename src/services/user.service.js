import { User } from "../models/user.model.js";

export const userService = {
  getMe: async (_id) => {
    const user = await User.findOne({ _id }).lean();
    if (!user) throw { status: 404, message: "User không tồn tại" };
    return user;
  },

  updateMe: async (_id, updates) => {
    const allowedUpdates = ["fullName", "email"];
    const filteredUpdates = {};
    allowedUpdates.forEach((key) => {
      if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
    });

    const user = await User.findOneAndUpdate(
      { _id },
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    ).lean();

    if (!user) throw { status: 404, message: "User không tồn tại" };
    return user;
  },
};
