import joiToSwagger from 'joi-to-swagger';
import { resetPasswordSchema, loginSchema, userRegisterSchema, userInfoSchema,userUpdateSchema } from '../validations/auth.validation.js';

const { swagger: LoginRequest } = joiToSwagger(loginSchema);
const { swagger: RegisterRequest } = joiToSwagger(userRegisterSchema);
const { swagger: ResetPasswordRequest } = joiToSwagger(resetPasswordSchema);
const { swagger: UserInfoRequest } = joiToSwagger(userInfoSchema);
const { swagger: UserUpdateRequest } = joiToSwagger(userUpdateSchema);

export default {
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    UserInfoRequest,
    UserUpdateRequest
};
