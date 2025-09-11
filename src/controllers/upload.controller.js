import { uploadService } from "../services/upload.service.js"

export const uploadController = {

    // Upload file đơn
    single: (req, res) => {
        try { 
            const fileData = uploadService.single(req.file);
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

