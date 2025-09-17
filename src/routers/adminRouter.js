import express from 'express';
import { createAccountSchema, updateAccountSchema } from '../validations/admin.validation.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { ROLE } from '../constants/role.constant.js';
import {
  createAccount,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/admin.controller.js';
import { validate } from '../middlewares/validate.middleware.js';

const adminRouter = express.Router();

// Admin tạo account mới (gửi mail cho user)
adminRouter.post(
  '/create',
  authenticate,                  // Xác thực token
  authorize([ROLE.ADMIN]),        // Chỉ cho ADMIN
  validate(createAccountSchema),  // Validate body request
  createAccount
);

// Admin lấy danh sách tất cả users
adminRouter.get(
  '/showall',
  authenticate,
  authorize([ROLE.ADMIN]),
  getAllUsers
);

// Admin lấy thông tin user theo ID
adminRouter.get(
  '/show/:id',
  authenticate,
  authorize([ROLE.ADMIN]),
  getUserById
);

// Admin update thông tin user theo ID
adminRouter.put(
  '/update/:id',
  authenticate,
  authorize([ROLE.ADMIN]),
  validate(updateAccountSchema),
  updateUser
);

// Admin xóa user theo ID
adminRouter.delete(
  '/delete/:id',
  authenticate,
  authorize([ROLE.ADMIN]),
  deleteUser
);

export default adminRouter;
