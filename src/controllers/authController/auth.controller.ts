import { NextFunction, Request, Response } from "express";
import { UnauthorizedRequest } from "../../handlers/response.handler";

const refreshToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies) {
      throw new UnauthorizedRequest({ message: "Please login" });
    }

    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      throw new UnauthorizedRequest({ message: "Please login" });
    }
  } catch (error) {
    next(error);
  }
};

export { refreshToken };
