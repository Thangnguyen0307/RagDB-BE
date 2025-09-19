import { User } from "../models/user.model.js";
import { uploadService } from "../services/upload.service.js"
import { getIO } from "../socketio/index.js";
import fs from 'fs';
import path from 'path';

export const uploadController = {

    // Upload file fe to be
    feToBe: (req, res) => {
        try {
            const { databaseId } = req.body;
            const fileData = uploadService.single(req.file);

            console.log("📂 File mới được upload từ AI:", {
                file: fileData.url,
                databaseId
            });

            const io = getIO();
            io.to("file-listener").emit("file:uploaded", {
                message: "File mới được upload từ Frontend",
                file: fileData.url,
                userId: req.payload.userId,
                databaseId,
                uploadedAt: new Date(),
            });
            return res.status(200).json({
                message: "Upload file thành công",
                file: fileData,
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },

    // Upload file ai to be
    aiToBe: (req, res) => {
        try {
            const { userId, databaseId } = req.body;
            const fileData = uploadService.single(req.file);

            console.log("📂 File mới được upload từ AI:", {
                file: fileData.url,
                userId,
                databaseId
            });


            const room = `room-${userId}-${databaseId}`;
            const io = getIO();
            io.to(room).emit("file:from-ai", {
                message: "File mới được AI upload",
                file: fileData.url,
                userId,
                databaseId,
                uploadedAt: new Date()
            });

            return res.status(200).json({
                message: "Upload file thành công",
                file: fileData,
                userId,
                databaseId
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },
    avatar: async (req, res) => {
        try {
            // Cập nhật avatar cho user
            const userId = req.payload.userId;
            const fileData = uploadService.avatar(req.file);

            // Cập nhật avatarURL trong database
            const user = await User.findByIdAndUpdate(userId);
            if (!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }

            if (user.avatarURL) {
                const oldAvatarPath = path.join(process.cwd(), user.avatarURL);
                // Xoá file avatar cũ nếu tồn tại
                if (fs.existsSync(oldAvatarPath)) {
                    fs.unlinkSync(oldAvatarPath);
                    console.log("Xoá avatar cũ:", oldAvatarPath);
                }
            }

            // Cập nhật lại avatarURL cho user trong DB 
            user.avatarURL = fileData.url;
            await user.save();

            return res.status(200).json({
                message: "Upload avatar thành công",
                file: fileData, 
                user: { fullName: user.fullName, email: user.email, avatarURL: user.avatarURL }
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },
};

export default uploadController;

// Sử dụng trong uploadRouter.js
// import uploadController from '../controllers/upload.controller.js';
// uploadRouter.post('/singleFile', upload.single('file'), uploadController.single);
// uploadRouter.post('/multipleFiles', upload.array('file', 10), uploadController.multiple);

