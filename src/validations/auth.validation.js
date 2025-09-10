import Joi from 'joi';

export const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.email': 'Email không hợp lệ',
            'string.empty': 'Email không được để trống',
            'any.required': 'Email là bắt buộc'
        }),

    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Mật khẩu không được để trống',
            'any.required': 'Mật khẩu là bắt buộc',
        })
}).options({ abortEarly: false, stripUnknown: true });

export const resetPasswordSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.email': 'Email không hợp lệ',
            'string.empty': 'Email không được để trống',
            'any.required': 'Email là bắt buộc'
        }),

    otpCode: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            'string.length': 'OTP phải gồm đúng 6 chữ số',
            'string.pattern.base': 'OTP chỉ được chứa chữ số',
            'string.empty': 'OTP không được để trống',
            'any.required': 'OTP là bắt buộc'
        }),

    newPassword: Joi.string()
        .required()
        .messages({
            'string.empty': 'Mật khẩu mới không được để trống',
            'any.required': 'Mật khẩu mới là bắt buộc'
        })
}).options({ abortEarly: false, stripUnknown: true });

export const userRegisterSchema = Joi.object({

    fullName: Joi.string()
        .required()
        .messages({
            'string.empty': 'Họ tên không được để trống',
            'any.required': 'Họ tên là bắt buộc'
        }),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.email': 'Email không hợp lệ',
            'string.empty': 'Email không được để trống',
            'any.required': 'Email là bắt buộc'
        }),

    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Mật khẩu không được để trống',
            'any.required': 'Mật khẩu là bắt buộc'
        }),

    otpCode: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            'string.length': 'OTP phải gồm đúng 6 chữ số',
            'string.pattern.base': 'OTP chỉ được chứa chữ số',
            'string.empty': 'OTP không được để trống',
            'any.required': 'OTP là bắt buộc'
        })
}).options({ abortEarly: false, stripUnknown: true });


// Schema lấy thông tin user (thực ra GET /me không có body nên schema này chỉ mô tả response)
export const userInfoSchema = Joi.object({
    userId: Joi.string().required(),
    fullName: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    role: Joi.string().valid('ADMIN', 'CUSTOMER').required(),
    isActive: Joi.boolean().required(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
});

// Schema update thông tin user
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


