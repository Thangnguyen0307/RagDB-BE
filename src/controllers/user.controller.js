import { userService } from "../services/user.service.js";

// GET thông tin user hiện tại
const getMe = async (req, res) => {
  try {
    const { userId } = req.payload;
    if (!userId) return res.status(401).json({ message: "Chưa đăng nhập" });

    const user = await userService.getMe(userId);
    res.json({ message: "Lấy thông tin user thành công", data: user });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Lỗi server" });
  }
};

// PUT cập nhật user hiện tại
const updateMe = async (req, res) => {
  try {
    const { userId } = req.payload;
    if (!userId) return res.status(401).json({ message: "Chưa đăng nhập" });

    const user = await userService.updateMe(userId, req.body);
    res.json({ message: "Cập nhật thông tin thành công", data: user });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Lỗi server" });
  }
};

export { getMe, updateMe };
