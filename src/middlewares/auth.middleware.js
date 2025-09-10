import { jwtUtils } from "../utils/jwt.js";    

export const authenticate = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers.authorization;
    if ( !authHeader) {
        return res.status(401).json({ message: "Thiếu token" });
    }

    // Bearer tokenString
    const token = authHeader.split(" ")[1];

    try {
        // Verify token
        const decoded = jwtUtils.verifyAccessToken(token);
        // Attach user info to request
        req.payload = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token không hợp lệ" });
    }
};