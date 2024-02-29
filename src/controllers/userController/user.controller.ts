import { Request, Response, NextFunction } from "express";
import { prisma } from "../../db";
import { comparePassword, hashPassword } from "../../plugins/auth";
import { BadRequest, NotfoundRequest } from "../../handlers/response.handler";
import { omit } from "lodash";
import { getUser } from "../../bussiness/user";
import { User } from "@prisma/client";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userName, fullName, password, role } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        userName,
      },
    });
    if (user) {
      throw new BadRequest({
        message: "Username already exists",
      });
    }
    const hash = hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        fullName,
        userName,
        hash,
        role,
      },
    });

    res.status(201).json({
      message: "User created",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const take = limit;

    const user = await prisma.user.findMany({
      where: {
        role: "USER",
        deletedAt: null,
      },
      take,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    });
    const totalUser = await prisma.user.count({
      where: {
        role: "USER",
      },
    });
    // console.log(page);

    const usersPromise = await Promise.all(
      user.map(async (user) => {
        const { hash, ...rest } = user;
        return {
          ...rest,
        };
      })
    );
    res.status(200).json({
      message: "Users fetched",
      data: {
        user: usersPromise,
        meta: {
          page,
          limit,
          total: totalUser,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      throw new BadRequest({
        message: "No user found",
      });
    }
    res.status(200).json({
      message: "Users fetched",
      data: omit(user, "hash"),
    });
  } catch (error) {
    next(error);
  }
};

//Admin được chỉnh sửa user
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { fullName } = req.body;
    const user = await getUser(Number(id));
    if (!user) {
      throw new NotfoundRequest({
        message: "user not found",
      });
    }

    const newUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        fullName,
      },
    });

    res.status(200).json({
      data: newUser,
      message: "updated success",
    });
  } catch (error) {
    next(error);
  }
};

//Admin được xoá
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await getUser(Number(id));
    if (!user) {
      throw new NotfoundRequest({
        message: "User not found",
      });
    }
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({
      message: "Deleted success",
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as User;
    const { currentPassword, newPassword } = req.body;
    const compare = comparePassword(currentPassword, user.hash);
    if (!compare) {
      throw new BadRequest({
        message: "current password invalid",
      });
    }
    const hash = hashPassword(newPassword);
    const newUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        hash,
      },
    });
    res.status(200).json({
      data: omit(newUser, "hash"),
      message: "Update password successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
};
