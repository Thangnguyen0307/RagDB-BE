import joiToSwagger from 'joi-to-swagger';
import { resetPasswordSchema, loginSchema, userRegisterSchema, introspectSchema, refreshTokenSchema, logoutSchema, sendOtpSchema } from '../validations/auth.validation.js';

const { swagger: LoginRequest } = joiToSwagger(loginSchema);
const { swagger: RegisterRequest } = joiToSwagger(userRegisterSchema);
const { swagger: ResetPasswordRequest } = joiToSwagger(resetPasswordSchema);
const { swagger: IntrospectRequest } = joiToSwagger(introspectSchema);
const { swagger: RefreshTokenRequest } = joiToSwagger(refreshTokenSchema);
const { swagger: SendOtpRequest } = joiToSwagger(sendOtpSchema);
const { swagger: LogoutRequest } = joiToSwagger(logoutSchema);

export default {
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    IntrospectRequest,
    RefreshTokenRequest,
    SendOtpRequest,
    LogoutRequest
};
