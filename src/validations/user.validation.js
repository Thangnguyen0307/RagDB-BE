import Joi from 'joi';

// Schema response user info (GET /me) - chỉ để validate dữ liệu trả về nếu cần
export const userInfoSchema = Joi.object({
  _id: Joi.string().required(),
  fullName: Joi.string().required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{9,11}$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Số điện thoại không hợp lệ (phải có 9–11 số)'
    }),
  address: Joi.string().allow(null, '').max(255),
  role: Joi.string().valid('ADMIN', 'CUSTOMER').required(),
  isActive: Joi.boolean().required(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional()
}).options({ abortEarly: false, stripUnknown: true });

// Schema validate body khi update user (PUT /me)
export const userUpdateSchema = Joi.object({
  fullName: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.base': 'Họ tên phải là chuỗi',
      'string.min': 'Họ tên phải có ít nhất {#limit} ký tự',
      'string.max': 'Họ tên không được vượt quá {#limit} ký tự'
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .optional()
    .messages({
      'string.email': 'Email không hợp lệ',
    }),

  password: Joi.string()
    .min(6)
    .optional()
    .messages({
      'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự',
    }),

  phoneNumber: Joi.string()
    .pattern(/^[0-9]{9,11}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Số điện thoại không hợp lệ (phải có 9–11 số)',
    }),

  address: Joi.string()
    .max(255)
    .optional()
    .messages({
      'string.max': 'Địa chỉ không được vượt quá {#limit} ký tự',
    }),

  isActive: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'isActive phải là true hoặc false',
    }),

  role: Joi.string()
    .valid('ADMIN', 'CUSTOMER')
    .optional()
    .messages({
      'any.only': 'Role chỉ có thể là ADMIN hoặc CUSTOMER',
    })
}).options({ abortEarly: false, stripUnknown: true });
