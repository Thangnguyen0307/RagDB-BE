import express from 'express';
import authRouter from './authRouter.js';
import userRouter from './userRouter.js';
import uploadRouter from './uploadRouter.js';

const rootRouter = express.Router();

rootRouter.get('/', (req, res) => {
    res.send('Welcome to the API root!');
});

rootRouter.use('/auth', authRouter);
rootRouter.use('/users', userRouter);
rootRouter.use('/upload', uploadRouter);

export default rootRouter;