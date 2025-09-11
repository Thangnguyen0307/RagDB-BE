import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tokenHash: { type: String, required: true, index: true, unique: true }, // SHA256(token)
  expiresAt: { type: Date, required: true, index: true },
  createdByIp: { type: String },
  revokedAt: { type: Date },
  revokedByIp: { type: String },
  replacedByTokenHash: { type: String },
  device: { type: String }, // tuỳ chọn: “chrome-win”, “ios-app”
  createdAt: { type: Date, default: Date.now },
});

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

// Chú ý: không lưu trữ refresh token plaintext trong DB, chỉ lưu hash của nó
//Sử dụng trong refreshToken.service.js
//Sử dụng trong auth.service.js