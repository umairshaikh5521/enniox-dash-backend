import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import logger from "../../../common/utils/logger";

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("firstName").notEmpty().trim(),
  body("lastName").notEmpty().trim(),
  validateRequest,
];

export const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

export const updateValidation = [
  body("email").optional().isEmail().normalizeEmail(),
  body("password").optional().isLength({ min: 6 }),
  body("firstName").optional().notEmpty().trim(),
  body("lastName").optional().notEmpty().trim(),
];
