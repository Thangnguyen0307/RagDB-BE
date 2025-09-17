import Joi from 'joi';
import { ROLE } from '../constants/role.constant.js';

// Schema khi Admin tạo account mới cho user
export const createAccountSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là bắt buộc'
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
  isActive: Joi.boolean().messages({
    'boolean.base': 'isActive phải là kiểu boolean'
  }),
  role: Joi.string()
    .valid(ROLE.CUSTOMER, ROLE.ADMIN)
    .optional()
    .messages({
      'any.only': 'Role không hợp lệ'
    })
}).min(1); // Bắt buộc phải có ít nhất 1 field để update
