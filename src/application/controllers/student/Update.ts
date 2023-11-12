import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { GenderEnum } from '../../../domain/models/enums/GenderEnum';
import { Student } from '../../../domain/models/Student';
import { StudentRepository } from '../../../domain/repositories/StudentRepository';
import { StudentRepositoryImpl } from '../../../infrastructure/repositories/impl/StudentRepositoryImpl';
import { InvalidDataError } from '../../../shared/errors/InvalidDataError';
import logger from '../../../shared/utils/logger';

const studentRepository: StudentRepository = new StudentRepositoryImpl();

interface IParamsProps {
    id: number
}

export const update = async (req: Request<IParamsProps, {}, Student>, res: Response, next: NextFunction) => {
    const params: IParamsProps = req.params;
    const student: Student = req.body;
    const validateIdResult = validateId(params);
    const validateStudentResult = validateStudent(student);

    if (validateIdResult.error) {
        logger.error('Id inválido');
        const error = new InvalidDataError('Informe um id corretamente!');
        next(error);
        return;
    }
    if (validateStudentResult.error) {
        logger.error('Body inválido');
        const error = new InvalidDataError('Body inválido');
        next(error);
        return;
    }

    try {
        const id: number = params.id;
        const updatedStudent: Student = await studentRepository.update(id, student);

        return res.status(StatusCodes.OK).json({ student: updatedStudent });
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

const studentSchema = Joi.object<Student>({
    id: Joi.number().optional(),
    name: Joi.string().required(),
    studentNumber: Joi.string().required(),
    birthDate: Joi.string().required(),
    gender: Joi.string().valid(...Object.values(GenderEnum)).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    classId: Joi.string().required(),
});

function validateStudent(student: Student): Joi.ValidationResult {
    return studentSchema.validate(student);
}

