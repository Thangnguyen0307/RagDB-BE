import joiToSwagger from 'joi-to-swagger';
import { resetPasswordSchema, loginSchema, userRegisterSchema } from '../validations/auth.validation.js';
import { userUpdateSchema } from '../validations/user.validation.js';

const { swagger: LoginRequest } = joiToSwagger(loginSchema);
const { swagger: RegisterRequest } = joiToSwagger(userRegisterSchema);
const { swagger: ResetPasswordRequest } = joiToSwagger(resetPasswordSchema);
const { swagger: UserUpdateRequest } = joiToSwagger(userUpdateSchema);

export default {
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    UserUpdateRequest
};
