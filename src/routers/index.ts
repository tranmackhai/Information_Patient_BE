import { Router } from "express";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { patientRouter } from "./patient";

export const rootRouter = Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/admin", adminRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/patient", patientRouter);
