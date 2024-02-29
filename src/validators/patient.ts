import { NextFunction, Request, Response } from "express";
import * as Joi from "joi";
import { BadRequest } from "../handlers/response.handler";

const createPatientValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vietnamesePhoneNumberRegex = /^(0[1-9][0-9]{8,9})$/;
  const schema = Joi.object({
    patientCode: Joi.string().max(14).options({ convert: false }).required(),
    gender: Joi.boolean().required(),
    DOB: Joi.date().required(),
    phone: Joi.string()
      .pattern(vietnamesePhoneNumberRegex)
      .required()
      .messages({
        "string.pattern.base":
          "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.",
      }),
    fullName: Joi.string().required(),
    guarantor: Joi.string().required(),
    address: Joi.string(),
    province: Joi.string().required(),
    district: Joi.string().required(),
    ward: Joi.string().required(),
  });

  const { error } = schema.validate({
    ...req.body,
  });

  if (error) {
    throw new BadRequest({
      message: error.details.map((detail) => detail.message).join(", "),
    });
  }

  next();
};

export { createPatientValidator };
