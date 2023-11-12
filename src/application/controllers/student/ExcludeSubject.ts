import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { StudentRepository } from '../../../domain/repositories/StudentRepository';
import { StudentRepositoryImpl } from '../../../infrastructure/repositories/impl/StudentRepositoryImpl';
import { InvalidDataError } from '../../../shared/errors/InvalidDataError';
import logger from '../../../shared/utils/logger';

const studentRepository: StudentRepository = new StudentRepositoryImpl();

interface IParamsProps {
    id: number,
    subjectId: number
}

export const excludeSubject = async (req: Request<IParamsProps>, res: Response, next: NextFunction) => {
    const params: IParamsProps = req.params;
    const validationResult = validatePathIds(params);

    if (validationResult.error) {
        logger.error('Id inválido');
        const error = new InvalidDataError('Informe os ids corretamente!');
        next(error);
        return;
    }

    try {
        const id: number = params.id;
        const subjectId: number = params.subjectId;
        await studentRepository.deleteSubject(id, subjectId);

        return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        next(error);
        return;
    }
};

const paramsSchema = Joi.object<IParamsProps>({
    id: Joi.number().required(),
    subjectId: Joi.number().required()
});

function validatePathIds(params: IParamsProps): Joi.ValidationResult {
    return paramsSchema.validate(params);
}

