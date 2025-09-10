import { toUserResponse } from "../mappers/user.mapper.js";
import { User } from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { otpService } from '../services/otp.service.js';
import { sendMail } from "./mail.service.js";
import { jwtUtils } from "../utils/jwt.js";
import { RefreshToken } from "../models/refreshToken.model.js";
import { sha256 } from "../utils/crypto.js";
import { MailType } from "../constants/mail.constant.js";
import { env } from "../config/environment.js";

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

        await sendMail(
            email,
            MailType.REGISTER_SUCCESS,
            { fullName },
        );

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
        //Check if user exists
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
        if (!await otpService.verify(email, otpCode)) {
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

    async refreshToken(oldToken) {
        // Verify refresh token
        const decoded = jwtUtils.verifyRefreshToken(oldToken);

        // Check token in DB
        const tokenHash = sha256(oldToken);
        const storedToken = await RefreshToken.findOne({
            user: decoded.userId,
            tokenHash,
            revokedAt: null,
            expiresAt: { $gt: new Date() }
        });

        if (!storedToken) {
            throw { status: 401, message: "Refresh token không hợp lệ hoặc đã hết hạn" };
        }

        // Generate new access token
        const newAccessToken = jwtUtils.signAccessToken({
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        });

        return { accessToken: newAccessToken };
    }


};