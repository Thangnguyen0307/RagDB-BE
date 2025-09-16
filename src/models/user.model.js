import mongoose from 'mongoose';
import { ROLE } from '../constants/role.constant.js';

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"]
    },
    phoneNumber: {
        type: String,
        trim: true,
        match: [/^[0-9]{9,11}$/, "Số điện thoại không hợp lệ"] // 9–11 số
    },
    address: {
        type: String,
        trim: true,
        maxlength: 255
    },
    role: { type: String, enum: ['ADMIN', 'CUSTOMER'], default: ROLE.CUSTOMER },
    isActive: { type: Boolean, default: true },
    password: { type: String, required: true },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
