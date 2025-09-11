    import crypto from 'crypto';

    // Hàm băm SHA-256
    export function sha256(str) {
        return crypto.createHash('sha256').update(str).digest('hex');
    }

    // Sử dụng trong refresh-token.service.js