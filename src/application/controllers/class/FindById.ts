import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { Class } from '../../../domain/models/Class';
import { ClassRepository } from '../../../domain/repositories/ClassRepository';
import { ClassRepositoryImpl } from '../../../infrastructure/repositories/impl/ClassRepositoryImpl';
import { InvalidDataError } from '../../../shared/errors/InvalidDataError';
import logger from '../../../shared/utils/logger';

const classRepository: ClassRepository = new ClassRepositoryImpl();

interface IParamsProps {
    id: string
}

export const findById = async (req: Request<IParamsProps>, res: Response, next: NextFunction) => {
    const params: IParamsProps = req.params;
    const validationResult = validateId(params);

    if (validationResult.error) {
        logger.error('Id inválido');
        const error = new InvalidDataError('Informe um id corretamente!');
        next(error);
        return;
    }

    try {
        const id: string = params.id;
        const c: Class = classRepository.findById(id);
        return res.status(StatusCodes.OK).json(c);
    } catch (error) {
        next(error);
        return;
    }
};

const paramsSchema = Joi.object<IParamsProps>({
    id: Joi.string().required()
});

function validateId(params: IParamsProps): Joi.ValidationResult {
    return paramsSchema.validate(params);
}
