import joiToSwagger from 'joi-to-swagger';
import { resetPasswordSchema, loginSchema, userRegisterSchema } from '../validations/auth.validation.js';

const { swagger: LoginRequest } = joiToSwagger(loginSchema);
const { swagger: RegisterRequest } = joiToSwagger(userRegisterSchema);
const { swagger: ResetPasswordRequest } = joiToSwagger(resetPasswordSchema);

export default {
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest
};
