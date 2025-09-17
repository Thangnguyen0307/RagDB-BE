import { User } from "../models/user.model.js";

export const userService = {
  // Lấy thông tin user
  getMe: async (_id) => {
    const user = await User.findById(_id).select("-password").lean();
    if (!user) throw { status: 404, message: "User không tồn tại" };
    return user;
  },

  // Cập nhật thông tin user
  updateMe: async (_id, updates) => {
    const allowedUpdates = ["fullName", "email", "phoneNumber", "address"];
    const filteredUpdates = {};

    allowedUpdates.forEach((key) => {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      _id,
      { $set: filteredUpdates },
      { new: true, runValidators: true, select: "-password" }
    ).lean();

    if (!user) throw { status: 404, message: "User không tồn tại" };
    return user;
  },
};