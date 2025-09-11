export const uploadService = {

    // Xử lý file đơn
    single(file) {
        if (!file) {
            throw new Error("Không có file để upload");
        }

        // Trả về thông tin file đã upload
        return {
            url: `public/images/${file.filename}`,    
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
        };
    },
};

export default uploadService;

// Sử dụng trong upload.controller.js
// import uploadService from '../services/upload.service.js';
// const fileData = uploadService.single(req.file);
// const filesData = uploadService.multiple(req.files);