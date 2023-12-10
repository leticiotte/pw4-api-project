import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { Student } from "../../../domain/models/Student";
import { StudentRepository } from "../../../domain/repositories/StudentRepository";
import { StudentRepositoryImpl } from "../../../infrastructure/repositories/impl/StudentRepositoryImpl";
import { InvalidDataError } from "../../../shared/errors/InvalidDataError";
import logger from "../../../shared/utils/logger";

const studentRepository: StudentRepository = new StudentRepositoryImpl();

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
        const id: number = params.id;
        const student: Student = await studentRepository.findById(id);

        return res.status(StatusCodes.OK).json({ student });
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
