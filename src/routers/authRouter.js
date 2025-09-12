import express from 'express';
import { login, logout, refreshToken, register, resetPassword, sendOtp, updatePassword } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginSchema, resetPasswordSchema, userRegisterSchema, updatePasswordSchema } from '../validations/auth.validation.js';
import { clientInfo } from '../middlewares/client-info.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/login', validate(loginSchema), clientInfo, login);
authRouter.post('/register', validate(userRegisterSchema), clientInfo, register);
authRouter.put('/reset-password', validate(resetPasswordSchema), clientInfo, resetPassword);
authRouter.put('/update-password', validate(updatePasswordSchema), authenticate, updatePassword);
authRouter.post('/refresh-token', clientInfo, refreshToken);
authRouter.post('/send-otp', sendOtp);
authRouter.post('/logout', clientInfo, logout);

export default authRouter;