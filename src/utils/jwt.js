import jwt from "jsonwebtoken";
import { env } from "../config/environtment.js";

export const jwtUtils = {

    //Generate access token
    signAccessToken(payload) {
        return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN || "1h" });
    },

    //Generate refresh token
    signRefreshToken(payload) {
        return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN || "7d" });
    },

    //Verify access token
    verifyAccessToken(token) {
        return jwt.verify(token, env.JWT_SECRET);
    },

    //Verify refresh token
    verifyRefreshToken(token) {
        return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
    }
};
