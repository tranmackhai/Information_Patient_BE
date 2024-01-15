import { Router } from "express";
import { createAdmin } from "../controllers/adminController/admin.controller";
import { createAdminValidator } from "../validators/admin";

export const adminRouter = Router();

adminRouter.post("/create", [createAdminValidator], createAdmin);
