import Joi from 'joi';

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
}).options({ abortEarly: false, stripUnknown: true });


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
}).options({ abortEarly: false, stripUnknown: true });
