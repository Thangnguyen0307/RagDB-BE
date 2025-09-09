import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ROLE } from '../constants/role.constant.js';

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true, default: uuidv4 },
    fullName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"]
    },
    role: { type: String, enum: ['ADMIN', 'CUSTOMER'], default: ROLE.CUSTOMER },
    isActive: { type: Boolean, default: true },
    password: { type: String, required: true },
}, { timestamps: true });

userSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret.userId;    // Trả về id là số tăng userId
        delete ret._id;         // Ẩn _id mặc định MongoDB
        delete ret.password;    // Ẩn password
        delete ret.userId;      // Ẩn trường userId gốc
    },
});

export const User = mongoose.model('User', userSchema);
