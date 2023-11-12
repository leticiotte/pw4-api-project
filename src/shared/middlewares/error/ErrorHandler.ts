import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ClassNotFoundError } from '../../errors/ClassNotFoundError';
import { DatabaseError } from '../../errors/DatabaseError';
import { DuplicateRecordError } from '../../errors/DuplicateRecordError';
import { ForeignKeyConstraintError } from '../../errors/ForeignKeyConstraintError';
import { InvalidDataError } from '../../errors/InvalidDataError';
import { StudentNotFoundError } from '../../errors/StudentNotFoundError';
import { SubjectNotFoundError } from '../../errors/SubjectNotFoundError';
import logger from '../../utils/logger';
import { ErrorCodes } from './ErrorCodes';
import { IErrorResponse } from './IErrorResponse';

const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.warn('Error handler');
    if (err instanceof InvalidDataError) {
        logger.warn('InvalidDataError type');

        const errorResponse: IErrorResponse = {
            error: {
                code: ErrorCodes.InvalidDataError,
                details: err.details,
                message: err.message
            }
        };
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    if (err instanceof StudentNotFoundError) {
        logger.warn('StudentNotFoundError type');

        const errorResponse: IErrorResponse = {
            error: {
                code: ErrorCodes.StudentNotFoundError,
                details: err.details,
                message: err.message
            }
        };
        return res.status(StatusCodes.NOT_FOUND).json(errorResponse);
    }

    if (err instanceof ClassNotFoundError) {
        logger.warn('ClassNotFoundError type');

        const errorResponse: IErrorResponse = {
            error: {
                code: ErrorCodes.ClassNotFoundError,
                details: err.details,
                message: err.message
            }
        };
        return res.status(StatusCodes.NOT_FOUND).json(errorResponse);
    }

    if (err instanceof SubjectNotFoundError) {
        logger.warn('SubjectNotFoundError type');

        const errorResponse: IErrorResponse = {
            error: {
                code: ErrorCodes.SubjectNotFoundError,
                details: err.details,
                message: err.message
            }
        };
        return res.status(StatusCodes.NOT_FOUND).json(errorResponse);
    }

    if (err instanceof DatabaseError) {
        logger.warn('DatabaseError type');

        const errorResponse: IErrorResponse = {
            error: {
                code: ErrorCodes.DatabaseError,
                details: err.details,
                message: err.message
            }
        };
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }

    if (err instanceof ForeignKeyConstraintError) {
        logger.warn('ForeignKeyConstraintError type');

        const errorResponse: IErrorResponse = {
            error: {
                code: ErrorCodes.ForeignKeyConstraintError,
                details: err.details,
                message: err.message
            }
        };
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    if (err instanceof DuplicateRecordError) {
        logger.warn('DuplicateRecordError type');

        const errorResponse: IErrorResponse = {
            error: {
                code: ErrorCodes.DuplicateRecordError,
                details: err.details,
                message: err.message
            }
        };
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    logger.warn('Default error type');
    const unknownErrorResponse: IErrorResponse = {
        error: {
            code: ErrorCodes.UnknownError,
            details: 'UNKNOWN_ERROR',
            message: 'Ocorreu um erro inesperado'
        }
    };
    return res.status(500).json(unknownErrorResponse);
};

export default errorHandler;
