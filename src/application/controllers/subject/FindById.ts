import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { Subject } from "../../../domain/models/Subject";
import { SubjectRepository } from "../../../domain/repositories/SubjectRepository";
import { SubjectRepositoryImpl } from "../../../infrastructure/repositories/impl/SubjectRepositoryImpl";
import { InvalidDataError } from "../../../shared/errors/InvalidDataError";
import logger from "../../../shared/utils/logger";

const subjectRepository: SubjectRepository = new SubjectRepositoryImpl();

interface IParamsProps {
    id: number;
}

export const findById = async (
    req: Request<IParamsProps>,
    res: Response,
    next: NextFunction
) => {
    const params: IParamsProps = req.params;
    const validationResult = validateId(params);

    if (validationResult.error) {
        logger.error("Id inválido");
        const error = new InvalidDataError("Informe um id corretamente!");
        next(error);
        return;
    }

    try {
        const id: number = Number(params.id);
        const subject: Subject = await subjectRepository.findById(id);

        return res.status(StatusCodes.OK).json({ subject });
    } catch (error) {
        next(error);
        return;
    }
};

const paramsSchema = Joi.object<IParamsProps>({
    id: Joi.number().required(),
});

function validateId(params: IParamsProps): Joi.ValidationResult {
    return paramsSchema.validate(params);
}
