import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { StudentRepository } from "../../../domain/repositories/StudentRepository";
import { StudentRepositoryImpl } from "../../../infrastructure/repositories/impl/StudentRepositoryImpl";
import { InvalidDataError } from "../../../shared/errors/InvalidDataError";
import logger from "../../../shared/utils/logger";

const studentRepository: StudentRepository = new StudentRepositoryImpl();

interface IParamsProps {
    id: number;
}

interface IBody {
    subjectId: number;
}

export const addSubject = async (
    req: Request<IParamsProps, {}, IBody>,
    res: Response,
    next: NextFunction
) => {
    const params: IParamsProps = req.params;
    const body: IBody = req.body;
    const validationResult = validateId(params);
    const validateBodyResult = validateBody(body);

    if (validationResult.error) {
        logger.error("[student-create-subject] Invalid id");
        const error = new InvalidDataError("Informe um id corretamente!");
        next(error);
        return;
    }

    if (validateBodyResult.error) {
        logger.error("[student-create-subject] Invalid body");
        const error = new InvalidDataError("Body inválido");
        next(error);
        return;
    }

    try {
        const id: number = Number(params.id);
        await studentRepository.addSubject(id, body.subjectId);

        return res.status(StatusCodes.NO_CONTENT).send();
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

const bodySchema = Joi.object<IBody>({
    subjectId: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
});

function validateBody(body: IBody): Joi.ValidationResult {
    return bodySchema.validate(body);
}
