import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { SubjectRepository } from '../../../domain/repositories/SubjectRepository';
import { SubjectRepositoryImpl } from '../../../infrastructure/repositories/impl/SubjectRepositoryImpl';
import { InvalidDataError } from '../../../shared/errors/InvalidDataError';
import logger from '../../../shared/utils/logger';

const subjectRepository: SubjectRepository = new SubjectRepositoryImpl();

interface IParamsProps {
    id: string
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
        const id: string = params.id;
        subjectRepository.delete(id);
        return res.status(StatusCodes.NO_CONTENT).send();
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

