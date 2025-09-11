    import multer from "multer";
    import path from "path";
    import fs from "fs";

    const storage = multer.diskStorage ({
        // Thư mục lưu trữ file
        destination: (req, file, cb) => {
            const uploadDir = "public/uploads";

        // Tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        // Lưu file vào thư mục
        cb(null, uploadDir); 
        },

        // Đặt tên file để tránh trùng lặp
        filename: (req, file, cb) => {
            // Lấy phần mở rộng của file
            const ext = path.extname(file.originalname);
            // Tạo tên file mới với timestamp và số ngẫu nhiên
            const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
            // Gọi callback với tên file mới
            cb(null, uniqueName + ext);
        }
    });

    // Lọc file để chỉ chấp nhận ảnh, txt, pdf, docx
    const fileFilter = (req, file, cb) => {
        const allowedMimeTypes = [
            "image/jpeg", 
            "image/png", 
            "image/gif",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        
        // Kiểm tra xem MIME type có nằm trong danh sách hoặc có bắt đầu bằng 'text/' không
        if (allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('text/')) {
            cb(null, true);
        } else {
            cb(new Error("Chỉ chấp nhận file ảnh, văn bản (.txt), PDF và Word (.docx)"), false);
        }
    };

    // Cấu hình multer
    export const upload = multer({
        storage,
        fileFilter,
    }
    );

    export default upload;


    // Sử dụng middleware trong uploadRouter.js
    // import upload from '../middlewares/upload.middleware.js';
    // import express from 'express';
    // const router = express.Router();