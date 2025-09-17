import { adminService } from '../services/admin.service.js';

// ---------------- CREATE ----------------
export const createAccount = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const result = await adminService.createAccount({ name, email, password, role });
    res.status(201).json(result);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Lỗi server' });
  }
};

// ---------------- READ ----------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Lỗi server' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await adminService.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    res.status(200).json(user);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Lỗi server' });
  }
};

// ---------------- UPDATE ----------------
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await adminService.updateUser(id, updateData);

    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy user để update' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Lỗi server' });
  }
};

// ---------------- DELETE ----------------
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await adminService.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy user để xóa' });
    }

    res.status(200).json({ message: 'Xóa user thành công' });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Lỗi server' });
  }
};
