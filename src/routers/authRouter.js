import express from 'express';
import { introspect, login, refreshToken, register, resetPassword, sendOtp } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { loginSchema, resetPasswordSchema, userRegisterSchema } from '../validations/auth.validation.js';

const authRouter = express.Router();

authRouter.post('/login', validate(loginSchema), login);
authRouter.post('/register', validate(userRegisterSchema), register);
authRouter.put('/reset-password', validate(resetPasswordSchema), resetPassword);
authRouter.post('/introspect', introspect);
authRouter.post('/refresh-token', refreshToken);
authRouter.post('/send-otp', sendOtp);

export default authRouter;