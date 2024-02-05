import { Router } from "express";
import { createPatientValidator } from "../validators/patient";
import {
  createPatient,
  deletePatient,
  getAllPatient,
  getPatientById,
  updatePatient,
} from "../controllers/patientController/patient.controller";
import { authMiddleware } from "../middlewares/auth";

export const patientRouter = Router();

patientRouter.post(
  "/create",
  [authMiddleware, createPatientValidator],
  createPatient
);
patientRouter.get("/", [authMiddleware], getAllPatient);
patientRouter.get("/:id", [authMiddleware], getPatientById);
patientRouter.post("/update/:id", [authMiddleware], updatePatient);
patientRouter.delete("/delete/:id", [authMiddleware], deletePatient);
