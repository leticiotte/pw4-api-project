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

export const update = async (
    req: Request<IParamsProps, {}, Subject>,
    res: Response,
    next: NextFunction
) => {
    const params: IParamsProps = req.params;
    const subject: Subject = req.body;
    const validateIdResult = validateId(params);
    const validateSubjectResult = validateSubject(subject);

    if (validateIdResult.error) {
        logger.error("[subject-update] Invalid id");
        const error = new InvalidDataError("Informe um id corretamente!");
        next(error);
        return;
    }

    if (validateSubjectResult.error) {
        logger.error("[subject-update] Invalid body");
        const error = new InvalidDataError("Body inválido");
        next(error);
        return;
    }

    try {
        const id: number = Number(params.id);
        const updateSubject: Subject | null = await subjectRepository.update(
            id,
            subject
        );
        if (updateSubject == null)
            return res.status(StatusCodes.NO_CONTENT).send();

        return res.status(StatusCodes.OK).json({ subject: updateSubject });
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

const subjectSchema = Joi.object<Subject>({
    id: Joi.number().optional(),
    name: Joi.string().required(),
    description: Joi.string().required(),
});

function validateSubject(subject: Subject): Joi.ValidationResult {
    return subjectSchema.validate(subject);
}
