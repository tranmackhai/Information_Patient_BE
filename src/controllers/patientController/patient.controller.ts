import { NextFunction, Request, Response } from "express";
import { prisma } from "../../db";
import { BadRequest } from "../../handlers/response.handler";
import moment from "moment";

const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      patientCode,
      guarantor,
      fullName,
      gender,
      DOB,
      phone,
      address,
      addressLevelIds,
    } = req.body;

    // console.log({
    //   DOB,
    //   addressLevelIds,
    //   abc: moment(DOB).toDate(),
    // });

    const existingPatient = await prisma.patient.findFirst({
      where: { patientCode },
    });

    if (existingPatient) {
      throw new BadRequest({
        message: "Patient code already exists",
      });
    }

    const newPatient = await prisma.patient.create({
      data: {
        patientCode,
        fullName,
        guarantor,
        gender,
        DOB,
        phone,
        address,
        addressLevelIds,
      },
    });

    res.status(201).json({
      message: "Patient created",
      data: newPatient,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const take = limit;

    const patient = await prisma.patient.findMany({
      take,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalPatient = await prisma.patient.count();
    res.status(200).json({
      message: "Patient fetched",
      data: {
        patient,
        meta: {
          page,
          limit,
          totalPatient,
        },
      },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const getPatientById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const patient = await prisma.patient.findUnique({
      where: {
        id,
      },
    });
    if (!patient) {
      throw new BadRequest({
        message: "No patient found",
      });
    }
    res.status(200).json({
      message: "Patient fetched",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const updatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      patientCode,
      guarantor,
      gender,
      DOB,
      phone,
      address,
      addressLevelIds,
    } = req.body;

    const patient = await prisma.patient.findFirst({
      where: {
        id,
      },
    });

    if (!patient) {
      throw new BadRequest({
        message: "Patient not found",
      });
    }

    const newPatient = await prisma.patient.update({
      where: {
        id: patient.id,
      },
      data: {
        patientCode,
        fullName,
        guarantor,
        gender,
        DOB,
        phone,
        address,
        addressLevelIds,
      },
    });

    res.status(200).json({
      data: newPatient,
      message: "Update success",
    });
  } catch (error) {
    next(error);
  }
};

const deletePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const patient = await prisma.patient.findFirst({
      where: {
        id,
      },
    });
    if (!patient) {
      throw new BadRequest({
        message: "Patient not found",
      });
    }
    await prisma.patient.delete({
      where: {
        id: patient.id,
      },
    });

    res.status(200).json({
      message: "Deleted success",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createPatient,
  updatePatient,
  deletePatient,
  getPatientById,
  getAllPatient,
};
