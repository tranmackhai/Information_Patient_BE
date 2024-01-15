import { NextFunction, Request, Response } from "express";
import { AppErrorArgs, ErrorName } from "./response.handler";

const errorHandler = (
  err: AppErrorArgs,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let message = err.message;
  let errorName = err.name;

  if (err?.name === "PrismaClientKnownRequestError") {
    // eslint-disable-next-line no-console
    console.log("PRISMA ERROR:", err.message);

    message = "";
    errorName = ErrorName.Error;
  }

  return res
    .status(err?.httpCode || 500)
    .json({ error: errorName, message: message || "Request failed!" });
};

export { errorHandler };
