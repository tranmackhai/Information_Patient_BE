import { NextFunction, Request, Response } from "express";
import * as Joi from "joi";
import { BadRequest } from "../handlers/response.handler";

const createUserValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    userName: Joi.string(),
    fullName: Joi.string().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("USER").required(),
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

const updatePasswordValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    currentPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
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

export { createUserValidator, updatePasswordValidator };
