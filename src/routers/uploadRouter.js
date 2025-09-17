import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { ROLE } from '../constants/role.constant.js';
import uploadController from '../controllers/upload.controller.js';
import upload from '../middlewares/upload.middleware.js';
import { validate } from "../middlewares/validate.middleware.js";
import { aiUploadSchema, feUploadSchema } from '../validations/upload.validation.js';

// Tạo router
const uploadRouter = express.Router();

// Định nghĩa các route
uploadRouter.post(
    '/fe-to-be',
    authenticate,
    authorize([ROLE.ADMIN, ROLE.CUSTOMER]),
    upload.single('file'),
    validate(feUploadSchema),
    uploadController.feToBe
);

uploadRouter.post(
    '/ai-to-be',
    validate(aiUploadSchema),
    upload.single('file'),
    uploadController.aiToBe
);


export default uploadRouter;

// Sử dụng trong rootRouter.js
// import uploadRouter from './uploadRouter.js';
// rootRouter.use('/upload', uploadRouter);