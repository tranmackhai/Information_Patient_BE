import { Request, Response, Router } from "express";
import { authLocalMiddleware } from "../middlewares/auth";

export const authRouter = Router();

authRouter.post(
  "/login",
  [authLocalMiddleware],
  (req: Request, res: Response) => {
    res.status(200).json({ message: "Success", data: req.user });
  }
);
