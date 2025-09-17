import Joi from "joi";

export const aiUploadSchema = Joi.object({
    userId: Joi.string()
        .required()
        .messages({
            "string.empty": "userId không được để trống",
            "any.required": "userId là bắt buộc",
        }),

    databaseId: Joi.string()
        .required()
        .messages({
            "string.empty": "databaseId không được để trống",
            "any.required": "databaseId là bắt buộc",
        }),
}).options({ abortEarly: false, stripUnknown: true });

export const feUploadSchema = Joi.object({
    databaseId: Joi.string()
        .required()
        .messages({
            "string.empty": "databaseId không được để trống",
            "any.required": "databaseId là bắt buộc",
        }),
}).options({ abortEarly: false, stripUnknown: true });
