import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { Class } from "../../../domain/models/Class";
import { ClassRepository } from "../../../domain/repositories/ClassRepository";
import { ClassRepositoryImpl } from "../../../infrastructure/repositories/impl/ClassRepositoryImpl";
import { InvalidDataError } from "../../../shared/errors/InvalidDataError";
import logger from "../../../shared/utils/logger";

const classRepository: ClassRepository = new ClassRepositoryImpl();

interface IParamsProps {
    id: number;
}

export const update = async (
    req: Request<IParamsProps, {}, Class>,
    res: Response,
    next: NextFunction
) => {
    const params: IParamsProps = req.params;
    const classBody: Class = req.body;
    const validateIdResult = validateId(params);
    const validateStudentResult = validateClass(classBody);

    if (validateIdResult.error) {
        logger.error("Id inválido");
        const error = new InvalidDataError("Informe um id corretamente!");
        next(error);
        return;
    }
    if (validateStudentResult.error) {
        logger.error("Body inválido");
        const error = new InvalidDataError("Body inválido");
        next(error);
        return;
    }

    try {
        const id: number = Number(params.id);
        const updatedClass: Class | null = await classRepository.update(
            id,
            classBody
        );

        if (updatedClass == null)
            return res.status(StatusCodes.NO_CONTENT).send();

        return res.status(StatusCodes.OK).json({ class: updatedClass });
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

const classSchema = Joi.object<Class>({
    id: Joi.number().optional(),
    key: Joi.string().required(),
    name: Joi.string().required(),
    course: Joi.string().required(),
});

function validateClass(c: Class): Joi.ValidationResult {
    return classSchema.validate(c);
}
