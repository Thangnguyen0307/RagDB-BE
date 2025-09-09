import { authService } from "../services/auth.service.js";
import { otpService } from '../services/otp.service.js';
import { mailService } from '../services/mail.service.js';
import e from "cors";

const login = async (req, res) => {
    try {
        const user = await authService.login(req.body);

        // Generated token

        let token = "token"

        return res.json({ message: "Đăng nhập thành công", token });
    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message || "Lỗi server" });
    }
};

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);

        // Generated token

        let token = "token"

        res.status(201).json({ message: "Đăng ký thành công", data: user, token });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || "Lỗi server" });
    }
};

const resetPassword = async (req, res) => {
    try {

        const user = await authService.resetPassword(req.body);

        // Generated token

        let token = "token"
        res.status(201).json({ message: "Thay đổi mật khẩu thành công", data: user, token });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || "Lỗi server" });
    }
};

const introspect = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.json({ data: { active: false } });
    }
    try {
        // Verify token

        return res.json({ data: { active: true } });
    } catch (err) {
        return res.json({ data: { active: false } });
    }
};

const refreshToken = async (req, res) => {
    // Verify refresh token
    let { token } = req.body;


    // Generate new token
    let newToken = "token"

    res.json({ token: newToken });
};

const sendOtp = async (req, res) => {
    const { email } = req.body;
    const { type } = req.query;
    try {
        await authService.sendOtp(email, type);
        res.json({ message: 'OTP đã được gửi về email' });
    } catch (err) {
        console.error(err);
        res.status(err.status).json({ message: err.message || 'Lỗi server' });
    }
};

export { login, register, resetPassword, introspect, refreshToken, sendOtp };