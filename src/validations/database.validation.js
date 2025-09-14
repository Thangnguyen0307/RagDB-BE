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
  // file chỉ để swagger biết có field này, multer sẽ xử lý upload
  file: Joi.any().optional().description("File upload đi kèm"),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

// Schema update database
export const databaseUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional().messages({
    "string.base": "Tên database phải là chuỗi",
    "string.min": "Tên database phải có ít nhất {#limit} ký tự",
    "string.max": "Tên database không được vượt quá {#limit} ký tự",
  }),
  file: Joi.any().optional().description("File upload mới (nếu có)"),
}).options({
  abortEarly: false,
  stripUnknown: true,
});
