import express from 'express';
import { introspect, login, logout, refreshToken, register, resetPassword, sendOtp } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginSchema, resetPasswordSchema, userRegisterSchema } from '../validations/auth.validation.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { ROLE } from '../constants/role.constant.js';
import { clientInfo } from '../middlewares/client-info.middleware.js';

const authRouter = express.Router();

authRouter.post('/login', validate(loginSchema), clientInfo, login);
authRouter.post('/register', validate(userRegisterSchema), clientInfo, register);
authRouter.put('/reset-password', validate(resetPasswordSchema), clientInfo, resetPassword);
authRouter.post('/introspect', introspect);
authRouter.post('/refresh-token', clientInfo, refreshToken);
authRouter.post('/send-otp', sendOtp);
authRouter.post('/logout', clientInfo, logout);

export default authRouter;