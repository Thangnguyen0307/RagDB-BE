import joiToSwagger from 'joi-to-swagger';
import { resetPasswordSchema, loginSchema, userRegisterSchema, updatePasswordSchema, refreshTokenSchema, sendOtpSchema, logoutSchema } from '../validations/auth.validation.js';
import { userUpdateSchema } from '../validations/user.validation.js';

const { swagger: LoginRequest } = joiToSwagger(loginSchema);
const { swagger: RegisterRequest } = joiToSwagger(userRegisterSchema);
const { swagger: ResetPasswordRequest } = joiToSwagger(resetPasswordSchema);
const { swagger: UserUpdateRequest } = joiToSwagger(userUpdateSchema);
const { swagger: UpdatePasswordRequest } = joiToSwagger(updatePasswordSchema);
const { swagger: RefreshTokenRequest } = joiToSwagger(refreshTokenSchema);
const { swagger: SendOtpRequest } = joiToSwagger(sendOtpSchema);
const { swagger: LogoutRequest } = joiToSwagger(logoutSchema);

export default {
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    RefreshTokenRequest,
    SendOtpRequest,
    LogoutRequest,
    UserUpdateRequest,
    UpdatePasswordRequest
};
