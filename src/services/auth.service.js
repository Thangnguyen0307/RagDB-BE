import { toUserResponse } from "../mappers/user.mapper.js";
import { User } from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";

async function register({ fullName, email, password, otpCode }) {
    const existing = await User.findOne({ email });
    if (existing) {
        throw { status: 400, message: "Email đã được sử dụng" };
    }

    password = await hashPassword(password);

    // Validate OTP code
    if (otpCode !== "123456") {
        throw { status: 400, message: "Mã OTP không hợp lệ" };
    }

    const user = new User({ fullName, email, password });
    await user.save();

    return toUserResponse(user);

}

async function login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throw { status: 404, message: "Không tìm thấy người dùng" };

    if (!await comparePassword(password, user.password)) {
        throw { status: 401, message: "Sai mật khẩu" };
    }

    return toUserResponse(user);
}

async function resetPassword({ email, otpCode, newPassword }) {
    const user = await User.findOne({ email });
    if (!user) throw { status: 404, message: "Không tìm thấy người dùng" };

    // Validate OTP code
    if (otpCode !== "123456") {
        throw { status: 400, message: "Mã OTP không hợp lệ" };
    }
    newPassword = await hashPassword(newPassword);
    user.password = newPassword;

    await user.save();

    return toUserResponse(user);
}

export const authService = {
    register,
    login,
    resetPassword
};