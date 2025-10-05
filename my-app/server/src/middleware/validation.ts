import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '../utils/logger';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        logger.warn('Validation error', { errors: errorMessages, body: req.body });
        
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errorMessages,
        });
        return;
      }
      
      logger.error('Unexpected validation error', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        logger.warn('Query validation error', { errors: errorMessages, query: req.query });
        
        res.status(400).json({
          success: false,
          error: 'Query validation failed',
          details: errorMessages,
        });
        return;
      }
      
      logger.error('Unexpected query validation error', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };
};