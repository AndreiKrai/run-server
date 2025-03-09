import { Response } from "express";

interface ErrorMessages {
  [key: number]: string;
}

const errorMessages: ErrorMessages = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  500: "Internal Server Error",
};

const RequestError = (
  res: Response,
  status: number,
  message?: string
): void => {
  res.status(status).json({
    success: false,
    error: message,
    status,
  });
};

export default RequestError;
