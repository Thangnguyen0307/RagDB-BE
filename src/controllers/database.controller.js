import { databaseService } from "../services/database.service.js";
import { ROLE } from "../constants/role.constant.js";

// Tạo database
export const createDatabase = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.payload.userId; // Lấy userId từ JWT
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    const db = await databaseService.createDatabase({ name, user: userId, filePath });
    res.status(201).json({ message: "Tạo database thành công", data: db });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Lỗi server" });
  }
};

// Lấy tất cả database theo userId
export const getDatabasesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const dbs = await databaseService.getDatabasesByUser(userId);
    res.json({ message: "Lấy danh sách database thành công", data: dbs });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Lỗi server" });
  }
};

// Lấy database theo databaseId
export const getDatabaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await databaseService.getDatabaseById(id);
    res.json({ message: "Lấy database thành công", data: db });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Lỗi server" });
  }
};

// Cập nhật database
export const updateDatabase = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.payload.userId;
    const role = req.payload.role || ROLE.CUSTOMER; // Lấy role từ JWT, default CUSTOMER
    const updates = { ...req.body };
    if (req.file) updates.filePath = `/uploads/${req.file.filename}`;
    updates.userId = userId;
    updates.role = role;

    const db = await databaseService.updateDatabase(id, updates);
    res.json({ message: "Cập nhật database thành công", data: db });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Lỗi server" });
  }
};

// Xóa database
export const deleteDatabase = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.payload.userId;
    const role = req.payload.role || ROLE.CUSTOMER;

    await databaseService.deleteDatabase(id, { userId, role });
    res.json({ message: "Xóa database thành công" });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Lỗi server" });
  }
};
