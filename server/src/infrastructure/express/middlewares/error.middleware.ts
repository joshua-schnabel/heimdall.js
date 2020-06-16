import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";
import { log } from "../../../application/logging/logger";

const internelError = 500;

function errorMiddleware (error: HttpException, _req: Request, res: Response, _next: NextFunction): void {
  const status: number = error.status || internelError;
  const message: string = error.message || "Something went wrong";

  log("http").error(status, message);

  res.status(status).json({ message });
}

export default errorMiddleware;
