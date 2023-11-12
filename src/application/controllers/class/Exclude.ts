import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { ClassRepository } from '../../../domain/repositories/ClassRepository';
import { ClassRepositoryImpl } from '../../../infrastructure/repositories/impl/ClassRepositoryImpl';
import { InvalidDataError } from '../../../shared/errors/InvalidDataError';
import logger from '../../../shared/utils/logger';

const classRepository: ClassRepository = new ClassRepositoryImpl();

interface IParamsProps {
    id: number
}

export const exclude = async (req: Request<IParamsProps>, res: Response, next: NextFunction) => {
    const params: IParamsProps = req.params;
    const validationResult = validateId(params);

    if (validationResult.error) {
        logger.error('Id inválido');
        const error = new InvalidDataError('Informe um id corretamente!');
        next(error);
        return;
    }

    try {
        const id: number = params.id;
        await classRepository.delete(id);

        return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        next(error);
        return;
    }
};

const paramsSchema = Joi.object<IParamsProps>({
    id: Joi.number().required()
});

function validateId(params: IParamsProps): Joi.ValidationResult {
    return paramsSchema.validate(params);
}

