import { Request, Response, NextFunction } from "express";
import { prisma } from "../../db";

const getProvinces = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const provinces = await prisma.addressLevel.findMany({
      where: {
        level: 0,
      },
    });
    res.status(200).json({
      message: "Get province success",
      data: provinces,
    });
  } catch (error) {
    next(error);
  }
};

const getDistrictsByProvince = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { parentId } = req.query;
  try {
    const addressLevel = await prisma.addressLevel.findMany({
      where: {
        parentId: parentId as string,
      },
    });
    res.status(200).json({
      message: "Get province success",
      data: addressLevel,
    });
  } catch (error) {
    next(error);
  }
};

const getWardsByDistrict = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { parentId } = req.query;
  try {
    const addressLevel = await prisma.addressLevel.findMany({
      where: {
        parentId: parentId as string,
      },
    });
    res.status(200).json({
      message: "Get province success",
      data: addressLevel,
    });
  } catch (error) {
    next(error);
  }
};

export { getProvinces, getDistrictsByProvince, getWardsByDistrict };
