import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getUserById,
  updatePassword,
  updateUser,
} from "../controllers/userController/user.controller";
import { adminMiddleware } from "../middlewares/admin";
import {
  createUserValidator,
  updatePasswordValidator,
} from "../validators/user";

export const userRouter = Router();

userRouter.post("/create", [adminMiddleware, createUserValidator], createUser);
userRouter.post("/update/:id", [adminMiddleware], updateUser);
userRouter.get("/:id", [adminMiddleware], getUserById);
userRouter.get("/", [adminMiddleware], getAllUser);
userRouter.get("/delete/:id", [adminMiddleware], deleteUser);
userRouter.post(
  "/update-password",
  [adminMiddleware, updatePasswordValidator],
  updatePassword
);
