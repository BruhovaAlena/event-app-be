import { NextFunction, Response, Request } from 'express';
import { validationResult } from 'express-validator/src/validation-result';

export const validateRequestSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
