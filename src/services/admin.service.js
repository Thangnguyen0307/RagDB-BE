import { User } from '../models/user.model.js';
import { hashPassword } from '../utils/bcrypt.util.js';
import { sendMail } from './mail.service.js';
import { generateRandomPassword } from '../utils/password.util.js';
import { toUserResponse } from '../mappers/user.mapper.js';

export const adminService = {
  // ---------------- CREATE ----------------
  async createAccount({ email, role }) {
    const existing = await User.findOne({ email });
    if (existing) throw { status: 400, message: 'Email đã tồn tại trong hệ thống' };

    const rawPassword = generateRandomPassword(6);

    const hashedPassword = await hashPassword(rawPassword);

    const newUser = await User.create({
      fullName: 'New User',
      email,
      role,
      password: hashedPassword
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
    let { isActive, role } = updateData;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { isActive, role } },
      { new: true, runValidators: true } 
    );

    return toUserResponse(updatedUser);
  },

  // ---------------- DELETE ----------------
  async deleteUser(id) {
    return User.findByIdAndDelete(id);
  },
};
