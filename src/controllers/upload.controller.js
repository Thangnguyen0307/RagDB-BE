import { uploadService } from "../services/upload.service.js"
import { getIO } from "../socketio/index.js";
import { UploadType } from '../constants/upload.constant.js';

export const uploadController = {

    // Upload file đơn
    single: (req, res) => {
        try {

            // Lấy loại upload từ body hoặc query (mặc định là FE_TO_BE)
            const type = req.body.type || req.query.type;


            // Nếu type không hợp lệ, trả về lỗi
            if (!Object.values(UploadType).includes(type)) {
                return res.status(400).json({ 
                    message: "Loại upload không hợp lệ", 
                    allowed: Object.values(UploadType) 
                });
            }

            const fileData = uploadService.single(req.file);

            const io = getIO();

            if ( type === UploadType.FE_TO_BE ) {
                io.to("file-listener").emit("file:uploaded", {
                    message: "File mới được upload từ Frontend",
                    file: fileData.url,
                    userId: req.payload.userId,
                    uploadedAt: new Date(),
                });
            }
            else if ( type === UploadType.AI_TO_BE ) {
                io.to("file-listener").emit("file:uploaded", {
                    message: "File mới được upload từ AI",
                    file: fileData.url,
                    userId: req.payload.userId,
                    uploadedAt: new Date(),
                });
            }

            return res.status(200).json({
                message: "Upload file thành công",
                file: fileData,
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

