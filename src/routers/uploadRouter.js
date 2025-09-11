import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { ROLE } from '../constants/role.constant.js';
import uploadController from '../controllers/upload.controller.js';
import upload from '../middlewares/upload.middleware.js';

// Tạo router
const uploadRouter = express.Router();

// Định nghĩa các route
uploadRouter.post(
    '/singleFile',
    authenticate,
    authorize([ROLE.ADMIN, ROLE.CUSTOMER]),
    upload.single('file'),
    uploadController.single
);

uploadRouter.post(
    '/multipleFiles',
    authenticate,
    authorize([ROLE.ADMIN, ROLE.CUSTOMER]),
    upload.array('file', 10),  
    uploadController.multiple
);

export default uploadRouter;

// Sử dụng trong rootRouter.js
// import uploadRouter from './uploadRouter.js';
// rootRouter.use('/upload', uploadRouter);