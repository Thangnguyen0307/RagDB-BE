import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { clientInfo } from "../middlewares/client-info.middleware.js";

import {
  createDatabase,
  getDatabasesByUser,
  getDatabaseById,
  updateDatabase,
  deleteDatabase
} from "../controllers/database.controller.js";

import {
  databaseCreateSchema,
  databaseUpdateSchema
} from "../validations/database.validation.js";

const databaseRouter = express.Router();

// POST: Tạo database mới
databaseRouter.post(
  "/create",
  authenticate,
  clientInfo,
  validate(databaseCreateSchema),
  createDatabase
);

// GET: Lấy tất cả database của user hiện tại
databaseRouter.get(
  "/my-databases",
  authenticate,
  clientInfo,
  getDatabasesByUser
);

// GET: Lấy database theo id
databaseRouter.get(
  "/detail/:id",
  authenticate,
  clientInfo,
  getDatabaseById
);

// PUT: Cập nhật database
databaseRouter.put(
  "/update/:id",
  authenticate,
  clientInfo,
  validate(databaseUpdateSchema),
  updateDatabase
);

// DELETE: Xóa database
databaseRouter.delete(
  "/delete/:id",
  authenticate,
  clientInfo,
  deleteDatabase
);

export default databaseRouter;
