import Joi from 'joi';
import { ROLE } from '../constants/role.constant.js';

// Schema khi Admin tạo account mới cho user
export const createAccountSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là bắt buộc'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
    'any.required': 'Mật khẩu là bắt buộc'
  }),
  role: Joi.string()
    .valid(ROLE.CUSTOMER, ROLE.ADMIN) // Cho phép tạo user thường hoặc admin
    .default(ROLE.CUSTOMER)
    .messages({
      'any.only': 'Role không hợp lệ'
    })
});

// Schema khi Admin cập nhật thông tin user
export const updateAccountSchema = Joi.object({
  email: Joi.string().email().optional().messages({
    'string.email': 'Email không hợp lệ'
  }),
  password: Joi.string().min(6).optional().messages({
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự'
  }),
  role: Joi.string()
    .valid(ROLE.CUSTOMER, ROLE.ADMIN)
    .optional()
    .messages({
      'any.only': 'Role không hợp lệ'
    })
}).min(1); // Bắt buộc phải có ít nhất 1 field để update
