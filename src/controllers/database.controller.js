import { databaseService } from "../services/database.service.js";

// Tạo database
export const createDatabase = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.payload._id; // user từ JWT
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    const db = await databaseService.createDatabase({
      name,
      user: userId,
      filePath
    });

    res.status(201).json({
      message: "Tạo database thành công",
      data: db
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || "Lỗi server"
    });
  }
};

// Update database
export const updateDatabase = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Nếu có file upload mới thì gán lại filePath
    if (req.file) {
      updates.filePath = `/uploads/${req.file.filename}`;
    }

    const db = await databaseService.updateDatabase(id, updates);

    res.json({
      message: "Cập nhật database thành công",
      data: db
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || "Lỗi server"
    });
  }
};
