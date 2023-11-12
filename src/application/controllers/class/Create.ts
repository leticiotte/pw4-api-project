import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { Class } from '../../../domain/models/Class';
import { ClassRepository } from '../../../domain/repositories/ClassRepository';
import { ClassRepositoryImpl } from '../../../infrastructure/repositories/impl/ClassRepositoryImpl';
import { InvalidDataError } from '../../../shared/errors/InvalidDataError';
import logger from '../../../shared/utils/logger';

const classRepository: ClassRepository = new ClassRepositoryImpl();

export const create = async (req: Request<{}, {}, Class>, res: Response, next: NextFunction) => {
    const newClass: Class = req.body;
    const validateStudentResult = validateClass(newClass);

    if (validateStudentResult.error) {
        logger.error('Body inválido');
        const error = new InvalidDataError('Body inválido');
        next(error);
        return;
    }

    try {
        const createdClass: Class = await classRepository.create(newClass);

        return res.status(StatusCodes.CREATED).json({ class: createdClass });
    } catch (error) {
        next(error);
        return;
    }
};

const classSchema = Joi.object<Class>({
    id: Joi.not,
    key: Joi.string().required(),
    name: Joi.string().required(),
    course: Joi.string().required()
});

function validateClass(c: Class): Joi.ValidationResult {
    return classSchema.validate(c);
}