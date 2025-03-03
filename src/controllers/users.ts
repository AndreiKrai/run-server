import { Request, Response, NextFunction } from 'express';
import prisma from "../services/prisma";
import RequestError from "../utils/errors";

// Add proper TypeScript types
const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, name, password } = req.body;
  
  // No need for try-catch here since ctrlWrapper handles it
  const user = await prisma.user.create({
    data: { 
      email, 
      password,
      name: name || null // Handle optional fields
    },
  });
  
  if (!user) {
    return RequestError(res, 400);
  }
  
  return res.status(201).json(user);
};

export { register };