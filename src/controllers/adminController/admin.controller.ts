import { Request, Response, NextFunction } from "express";
import { prisma } from "../../db";
import { hashPassword } from "../../plugins/auth";
import { BadRequest } from "../../handlers/response.handler";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userName, fullName, password, role } = req.body;

    const admin = await prisma.user.findFirst({
      where: {
        userName,
      },
    });
    if (admin) {
      throw new BadRequest({
        message: "User name already exists",
      });
    }
    const hash = hashPassword(password);
    const newAdmin = await prisma.user.create({
      data: {
        fullName,
        userName,
        hash,
        role,
      },
    });

    res.status(201).json({
      message: "Admin created",
      data: newAdmin,
    });
  } catch (error) {
    next(error);
  }
};

export { createAdmin };
