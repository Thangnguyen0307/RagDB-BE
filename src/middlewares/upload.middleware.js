    import multer from "multer";
    import path from "path";
    import fs from "fs";

    const storage = multer.diskStorage ({
        destination: (req, file, cb) => {
            const uploadDir = "public/images";

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir); 
        },

        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, uniqueName + ext);
        }
    });

    const fileFilter = (req, file, cb) => {
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Chỉ chấp nhận file ảnh (jpeg, png, gif)"), false);
        }
    };

    export const upload = multer({
        storage,
        fileFilter,
    }
    );

    export default upload;


    // Sử dụng middleware trong route
    // import upload from '../middlewares/upload.middleware.js';
    // import express from 'express';
    // const router = express.Router();