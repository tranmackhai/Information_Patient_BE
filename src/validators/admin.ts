import { NextFunction, Request, Response } from "express";
import * as Joi from "joi";
import { BadRequest } from "../handlers/response.handler";

const createAdminValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    userName: Joi.string(),
    fullName: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid("ADMIN").required(),
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

export { createAdminValidator };
