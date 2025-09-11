import { toUserResponse } from "../mappers/user.mapper.js";
import { User } from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.util.js";
import { otpService } from '../services/otp.service.js';
import { sendMail } from "./mail.service.js";
import { jwtUtils } from "../utils/jwt.util.js";
import { RefreshToken } from "../models/refreshToken.model.js";
import { MailType } from "../constants/mail.constant.js";
import { env } from "../config/environment.js";
import { refreshTokenService } from "./refresh-token.service.js";

export const authService = {
    async register({ fullName, email, password, otpCode }, ip, device) {
        const existing = await User.findOne({ email });
        if (existing) {
            throw { status: 400, message: "Email đã được sử dụng" };
        }

        password = await hashPassword(password);

        // Validate OTP code
        if (!await otpService.verify(email, otpCode)) {
            console.log("Invalid OTP");
            throw { status: 400, message: "Mã OTP không hợp lệ" };
        }

        const user = new User({ fullName, email, password });
        await user.save();

        // Send welcome mail
        await sendMail(
            email,
            MailType.REGISTER_SUCCESS,
            { fullName },
        );

        //Generate token
        const accessToken = jwtUtils.signAccessToken(user);
        const refreshToken = await refreshTokenService.generate(user, ip, device);

        return {
            user: toUserResponse(user),
            accessToken,
            refreshToken
        };

    },

    async login({ email, password }, ip, device) {
        //Check if user exists
        const user = await User.findOne({ email });
        if (!user) throw { status: 404, message: "Không tìm thấy người dùng" };

        if (!await comparePassword(password, user.password)) {
            throw { status: 401, message: "Sai mật khẩu" };
        }

        //Generate token
        const accessToken = jwtUtils.signAccessToken(user);
        const refreshToken = await refreshTokenService.generate(user, ip, device);
        return {
            user: toUserResponse(user),
            accessToken,
            refreshToken
        };
    },

    async resetPassword({ email, otpCode, newPassword }, ip, device) {
        const user = await User.findOne({ email });
        if (!user) throw { status: 404, message: "Không tìm thấy người dùng" };

        // Validate OTP code
        if (!await otpService.verify(email, otpCode)) {
            throw { status: 400, message: "Mã OTP không hợp lệ" };
        }
        newPassword = await hashPassword(newPassword);
        user.password = newPassword;

        await user.save();

        await RefreshToken.updateMany(
            { user: user._id, revokedAt: null },
            { $set: { revokedAt: new Date(), revokedByIp: ip } }
        );


        //Generate token
        const accessToken = jwtUtils.signAccessToken(user);
        const refreshToken = await refreshTokenService.generate(user, ip, device);

        return {
            accessToken,
            refreshToken
        };
    },

    async sendOtp(email, type) {
        const otp = await otpService.generate(email);


        let isExist;
        switch (type) {
            case 'RESET_PASSWORD':
                isExist = await User.findOne({ email });
                if (!isExist) {
                    throw { status: 404, message: "Không tìm thấy người dùng" };
                }
                break;
            case 'SIGN_UP':
                isExist = await User.findOne({ email });
                if (isExist) {
                    throw { status: 400, message: "Email đã được sử dụng" };
                }
                break;
            default:
                break;

        }

        await sendMail(
            email,
            type,
            { otp, otpExpiresInMinutes: env.OTP_EXPIRE_MINUTES }
        );
    },

    async refreshToken(refreshToken, ip, device) {
        const decoded = await refreshTokenService.verify(refreshToken);

        const user = await User.findOne({ _id: decoded.userId });
        if (!user) throw { status: 404, message: "User không tồn tại" };

        // Phát hành token mới
        const newAccessToken = jwtUtils.signAccessToken(user);
        const newRefreshToken = await refreshTokenService.rotate(refreshToken, user, ip, device);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };

    },

    async logout(refreshToken, ip) {
        if (!refreshToken) {
            throw { status: 400, message: "Thiếu refresh token" };
        }

        // revoke token trong DB
        await refreshTokenService.revoke(refreshToken, ip);

        return { message: "Đăng xuất thành công" };
    },
};

// Sử dụng trong auth.controller.js
// import { authService } from '../services/auth.service.js';
