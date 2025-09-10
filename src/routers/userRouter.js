import express from "express";
import { getMe, updateMe } from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { userUpdateSchema } from "../validations/auth.validation.js";
import { ROLE } from "../constants/role.constant.js";

const userRouter = express.Router();

// // GET thông tin user
userRouter.get(
  "/load",
  authenticate,
  authorize([ROLE.ADMIN, ROLE.CUSTOMER]),
  getMe
);

// PUT cập nhật thông tin user hiện tại
userRouter.put(
  "/update",
  authenticate,
  authorize([ROLE.ADMIN, ROLE.CUSTOMER]),
  validate(userUpdateSchema),
  updateMe
);

// Route test payload (có thể giữ để debug)
userRouter.get(
  "/test",
  authenticate,
  authorize([ROLE.ADMIN, ROLE.CUSTOMER]),
  (req, res) => {
    console.log(req.payload);
    res.json({ message: "User router is working!", payload: req.payload });
  }
);

export default userRouter;
