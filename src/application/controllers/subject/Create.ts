import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { Subject } from "../../../domain/models/Subject";
import { SubjectRepository } from "../../../domain/repositories/SubjectRepository";
import { SubjectRepositoryImpl } from "../../../infrastructure/repositories/impl/SubjectRepositoryImpl";
import { InvalidDataError } from "../../../shared/errors/InvalidDataError";
import logger from "../../../shared/utils/logger";

const subjectRepository: SubjectRepository = new SubjectRepositoryImpl();

export const create = async (
    req: Request<{}, {}, Subject>,
    res: Response,
    next: NextFunction
) => {
    const subject: Subject = req.body;
    const validateSubjectResult = validateSubject(subject);

    if (validateSubjectResult.error) {
        logger.error("Body inválido");
        const error = new InvalidDataError("Body inválido");
        next(error);
        return;
    }

    try {
        const createdSubject: Subject = await subjectRepository.create(subject);

        return res
            .status(StatusCodes.CREATED)
            .json({ subject: createdSubject });
    } catch (error) {
        next(error);
        return;
    }
};

const studentSchema = Joi.object<Subject>({
    id: Joi.not,
    name: Joi.string().required(),
    description: Joi.string().required(),
});

function validateSubject(subject: Subject): Joi.ValidationResult {
    return studentSchema.validate(subject);
}
