import { User } from '../models/user.model.js';
import { hashPassword } from '../utils/bcrypt.util.js';
import { sendMail } from './mail.service.js';

export const adminService = {
  // ---------------- CREATE ----------------
  async createAccount({ email, password, role }) {
    const existing = await User.findOne({ email });
    if (existing) throw { status: 400, message: 'Email đã tồn tại trong hệ thống' };

    let rawPassword = password;
    if (!rawPassword) {
      // nếu không nhập password thì generate ngẫu nhiên 6 ký tự
      rawPassword = generateRandomPassword(6);
    }

    const hashedPassword = await hashPassword(rawPassword);

    const newUser = await User.create({
      fullName: 'New User',
      email,
      role,
      password: hashedPassword,
      createdBy: 'ADMIN',
    });

    await sendMail(email, 'ACCOUNT_CREATED', { email, password: rawPassword });

    return {
      message: `Tài khoản đã được tạo và mật khẩu đã gửi tới ${email}`,
      userId: newUser._id,
    };
  },

  // ---------------- READ ----------------
  async getAllUsers() {
    return User.find().select('-password'); // ẩn password
  },

  async getUserById(id) {
    return User.findById(id).select('-password');
  },

  // ---------------- UPDATE ----------------
  async updateUser(id, updateData) {
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    return User.findByIdAndUpdate(id, updateData, { new: true }).select(
      '-password'
    );
  },

  // ---------------- DELETE ----------------
  async deleteUser(id) {
    return User.findByIdAndDelete(id);
  },
};
