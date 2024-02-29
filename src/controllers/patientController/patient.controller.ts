import { NextFunction, Request, Response } from "express";
import { prisma } from "../../db";
import { BadRequest } from "../../handlers/response.handler";

const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      fullName,
      patientCode,
      guarantor,
      gender,
      DOB,
      phone,
      address,
      province,
      district,
      ward,
      motherBloodGroup,
      childBloodGroup,
    } = req.body;
    console.log(req.body);
    const existingPatient = await prisma.patient.findFirst({
      where: { patientCode },
    });

    if (existingPatient) {
      // console.log("Tồn tại");
      throw new BadRequest({
        message: "Patient code already exists",
      });
    }

    const newPatient = await prisma.patient.create({
      data: {
        fullName,
        patientCode,
        guarantor,
        gender,
        DOB,
        phone,
        address,
        province,
        district,
        ward,
        motherBloodGroup,
        childBloodGroup,
      },
    });

    res.status(201).json({
      message: "Patient created",
      data: newPatient,
    });
  } catch (error) {
    console.log(error);
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
        id: Number(id),
      },
    });
    if (!patient) {
      throw new BadRequest({
        message: "No patient found",
      });
    }
    res.status(200).json({
      message: "Thông tin bệnh nhân được truy xuất bằng ID",
      data: patient,
    });
  } catch (error) {
    next(error);
    console.log(error);
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
      province,
      district,
      ward,
      motherBloodGroup,
      childBloodGroup,
    } = req.body;

    const patient = await prisma.patient.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!patient) {
      throw new BadRequest({
        message: "Patient not found",
      });
    }

    // const updatedBeforePregnancyCondition = beforePregnancyCondition?.map(
    //   (pathology: { key: string; isSelect: boolean; note: string }) => ({
    //     key: pathology.key,
    //     isSelect: pathology.isSelect,
    //     note: pathology.note,
    //   })
    // );

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
        province,
        district,
        ward,
        motherBloodGroup,
        childBloodGroup,
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
        id: Number(id),
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
  deletePatient,
  getAllPatient,
  getPatientById,
  updatePatient,
};
