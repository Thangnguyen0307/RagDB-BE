import { User } from "../models/user.model.js";

// Lấy thông tin user dựa vào _id từ payload
export const getMe = async (req, res) => {
  try {
    const { _id } = req.payload; // payload chứa _id do JWT sign khi login
    const user = await User.findById(_id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }
    res.json({ message: "Lấy thông tin user thành công", data: user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Update thông tin user dựa vào _id
export const updateMe = async (req, res) => {
  try {
    const { _id } = req.payload;
    const updates = req.body;

    // Chỉ update những trường cho phép
    const allowedUpdates = ["fullName", "email", "role", "isActive", "password"];
    const filteredUpdates = {};
    allowedUpdates.forEach(key => {
      if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
    });

    const user = await User.findByIdAndUpdate(_id, filteredUpdates, {
      new: true,
      runValidators: true,
      select: "-password"
    });

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    res.json({ message: "Cập nhật thành công", data: user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
