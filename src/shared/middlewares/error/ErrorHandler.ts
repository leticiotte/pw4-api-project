import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DatabaseError } from '../../errors/DatabaseError';
import { InvalidDataError } from '../../errors/InvalidDataError';
import { StudentNotFoundError } from '../../errors/StudentNotFoundError';
import logger from '../../utils/logger';
import { IErrorResponse } from './IErrorResponse';

const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.warn('Error handler');
    if (err instanceof InvalidDataError) {
        logger.warn('InvalidDataError type');

        const errorResponse: IErrorResponse = {
            error: {
                code: '0001',
                message: err.message,
                details: err.details
            }
        };
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    if (err instanceof StudentNotFoundError) {
        logger.warn('StudentNotFoundError type');

        const errorResponse: IErrorResponse = {
            error: {
                code: '0002',
                message: err.message,
                details: err.details
            }
        };
        return res.status(StatusCodes.NOT_FOUND).json(errorResponse);
    }

    if (err instanceof DatabaseError) {
        logger.warn('DatabaseError type');

        const errorResponse: IErrorResponse = {
            error: {
                code: 'DATABASE_ERROR',
                message: err.message
            }
        };
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }

    logger.warn('Default error type');
    const unknownErrorResponse: IErrorResponse = {
        error: {
            code: 'UNKNOWN_ERROR',
            message: 'An error occurred'
        }
    };
    return res.status(500).json(unknownErrorResponse);
};

export default errorHandler;
