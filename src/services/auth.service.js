import { toUserResponse } from "../mappers/user.mapper.js";
import { User } from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { otpService } from '../services/otp.service.js';
import { mailService } from "./mail.service.js";
import { jwtUtils } from "../utils/jwt.js";
import { RefreshToken } from "../models/refreshToken.model.js";
import { sha256 } from "../utils/crypto.js";

export const authService = {
    async register({ fullName, email, password, otpCode }) {
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

        await mailService.sendMail({
            to: email,
            subject: 'Đăng ký thành công',
            template: 'register-success',
            content: { fullName },
        });

        //Generate token
        const accessToken = jwtUtils.signAccessToken({ userId: user.userId, email: user.email, role: user.role });
        const refreshToken = jwtUtils.signRefreshToken({ userId: user.userId, email: user.email, role: user.role });

        const refreshTokenHash = sha256(refreshToken);
        await RefreshToken.create({
            //Save hash of token to DB must be in _id not userId
            user: user._id,
            tokenHash: refreshTokenHash,
            expiresAt: new Date(Date.now() + 7*24*60*60*1000),
        });

        return {
            user: toUserResponse(user),
            accessToken,
            refreshToken
        };

    },

    async login({ email, password }) {
        const user = await User.findOne({ email });
        if (!user) throw { status: 404, message: "Không tìm thấy người dùng" };

        if (!await comparePassword(password, user.password)) {
            throw { status: 401, message: "Sai mật khẩu" };
        }

        //Generate token
        const accessToken = jwtUtils.signAccessToken({ userId: user.userId, email: user.email, role: user.role });
        const refreshToken = jwtUtils.signRefreshToken({ userId: user.userId, email: user.email, role: user.role });

        const refreshTokenHash = sha256(refreshToken);
        await RefreshToken.create({
            //Save hash of token to DB must be in _id not userId
            user: user._id,
            tokenHash: refreshTokenHash,
            expiresAt: new Date(Date.now() + 7*24*60*60*1000),
        });

        console.log ("Refresh token hash:", refreshTokenHash);

        return {
            user: toUserResponse(user),
            accessToken,
            refreshToken
        };
    },

    async resetPassword({ email, otpCode, newPassword }) {
        const user = await User.findOne({ email });
        if (!user) throw { status: 404, message: "Không tìm thấy người dùng" };

        // Validate OTP code
        if (!otpService.verify(email, otpCode)) {
            throw { status: 400, message: "Mã OTP không hợp lệ" };
        }
        newPassword = await hashPassword(newPassword);
        user.password = newPassword;

        await user.save();

        //Generate token
        const accessToken = jwtUtils.signAccessToken({ userId: user.userId, email: user.email, role: user.role });
        const refreshToken = jwtUtils.signRefreshToken({ userId: user.userId, email: user.email, role: user.role });

        const refreshTokenHash = sha256(refreshToken);
        await RefreshToken.create({
            //Save hash of token to DB must be in _id not userId
            user: user._id,
            tokenHash: refreshTokenHash,
            expiresAt: new Date(Date.now() + 7*24*60*60*1000),
        });

        return {
            user: toUserResponse(user),
            accessToken,
            refreshToken
        };
    },

    async sendOtp(email, type) {
        const otp = await otpService.generate(email);

        let subject, template;
        if (type === 'RESET_PASSWORD') {
            let isExist = await User.findOne({ email });

            if (!isExist) {
                throw { status: 404, message: "Không tìm thấy người dùng" };
            }

            subject = 'Mã OTP đặt lại mật khẩu';
            template = 'reset-password';
        }

        if (type === 'SIGN_UP') {
            let isExist = await User.findOne({ email });

            if (isExist) {
                throw { status: 400, message: "Email đã được sử dụng" };
            }

            subject = 'Mã OTP đăng ký';
            template = 'sign-up';
        }

        await mailService.sendMail({
            to: email,
            subject,
            template,
            content: { otp },
        });
    }

};