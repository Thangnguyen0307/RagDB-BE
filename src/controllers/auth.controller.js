import { authService } from "../services/auth.service.js";
import { jwtUtils } from "../utils/jwt.js";
import { sha256 } from "../utils/crypto.js";
import { RefreshToken } from "../models/refreshToken.model.js";

const login = async (req, res) => {
    try {
        const { user, accessToken, refreshToken } = await authService.login(req.body);

        // Generated token  

        return res.json({ 
            message: "Đăng nhập thành công", 
            data: user, 
            accessToken, 
            refreshToken 
        });
    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message || "Lỗi server" });
    }
};

const register = async (req, res) => {
    try {
        const { user, accessToken, refreshToken } = await authService.register(req.body);

        // Generated token

        res.status(201).json({ 
            message: "Đăng ký thành công",
            data: user, 
            accessToken, 
            refreshToken  
        });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || "Lỗi server" });
    }
};

const resetPassword = async (req, res) => {
    try {

        const { user, accessToken, refreshToken } = await authService.resetPassword(req.body);

        // Generated token

        res.status(201).json({ 
            message: "Thay đổi mật khẩu thành công",
            data: user, 
            accessToken, 
            refreshToken   
        });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || "Lỗi server" });
    }
};

const introspect = async (req, res) => {
    const { accessToken } = req.body;

    if (!accessToken) {
        return res.json({ data: { active: false } });
    }
    try {
        // Verify access token
        const decoded = jwtUtils.verifyAccessToken(accessToken);
        return res.json({ data: { active: true, user: decoded } });
    } catch (err) {
        return res.json({ data: { active: false } });
    }
};

const refreshToken = async (req, res) => {
    const { accessToken } = req.body;

    if (!accessToken) {
        return res.status(400).json({ message: "Thiếu refresh token" });
    }

    try {
        // Verify refresh token
        const decoded = jwtUtils.verifyRefreshToken(accessToken);

        // Check token in DB
        const tokenHash = sha256(accessToken);
        const storedToken = await RefreshToken.findOne({ 
            user: decoded.userId, 
            tokenHash, 
            revokedAt: null , 
            expiresAt: { $gt: new Date() } 
        });

        // Check if token exists
        if (!storedToken) {
            return res.status(401).json({ message: "Refresh token không hợp lệ hoặc đã hết hạn" });
        }

        // Generate new access token
        const newAccessToken = jwtUtils.signAccessToken({ userId: decoded.userId, email: decoded.email });

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(401).json({ message: "Refresh token không hợp lệ" });
    }
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