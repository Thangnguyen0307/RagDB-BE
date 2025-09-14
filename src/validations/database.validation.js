import Joi from "joi";

// Schema tạo database
export const databaseCreateSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "Tên database phải là chuỗi",
    "string.empty": "Tên database không được để trống",
    "string.min": "Tên database phải có ít nhất {#limit} ký tự",
    "string.max": "Tên database không được vượt quá {#limit} ký tự",
    "any.required": "Tên database là bắt buộc",
  }),
  filePath: Joi.string().allow(null, "").optional(),
}).options({
  abortEarly: false, // gom tất cả lỗi
  stripUnknown: true, // bỏ field không khai báo
});

// Schema update database
export const databaseUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional().messages({
    "string.base": "Tên database phải là chuỗi",
    "string.min": "Tên database phải có ít nhất {#limit} ký tự",
    "string.max": "Tên database không được vượt quá {#limit} ký tự",
  }),
  filePath: Joi.string().allow(null, "").optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});
