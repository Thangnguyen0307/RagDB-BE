import { uploadService } from "../services/upload.service.js"

export const uploadController = {

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

    multiple: (req, res) => {
        try {
            const filesData = uploadService.multiple(req.files);
            return res.status(200).json({
                message: "Upload files thành công",
                files: filesData,
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
};

export default uploadController;

