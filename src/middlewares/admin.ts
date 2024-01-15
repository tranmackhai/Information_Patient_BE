import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { omit } from "lodash";
import { prisma } from "../db";
import { BadRequest } from "../handlers/response.handler";

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers?.authorization?.split(" ")[1] || "";
    const { id } = jwt.decode(accessToken) as { id: string };
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new BadRequest({
        message: "Unauthorized",
      });
    }
    if (user.role === "ADMIN") {
      req.user = omit(user, ["hash"]);
      return next();
    }
    return res.status(401).send({ error: "Unauthenticated!" });
  } catch (error) {
    return res.status(401).send({ error: "Unauthenticated!" });
  }
};

export { adminMiddleware };
