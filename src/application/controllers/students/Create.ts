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

export const create = async (req: Request<{}, {}, Student>, res: Response, next: NextFunction) => {
    const student: Student = req.body;
    const validateStudentResult = validateStudent(student);

    if (validateStudentResult.error) {
        logger.error('Body inválido');
        const error = new InvalidDataError('Body inválido');
        next(error);
        return;
    }

    const createdStudent: Student = studentRepository.create(student);

    return res.status(StatusCodes.OK).json(createdStudent);
};

const studentSchema = Joi.object<Student>({
    id: Joi.not,
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