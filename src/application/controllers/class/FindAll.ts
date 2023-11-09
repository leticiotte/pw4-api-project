import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Class } from '../../../domain/models/Class';
import { Student } from '../../../domain/models/Student';
import { ClassRepository } from '../../../domain/repositories/ClassRepository';
import { ClassRepositoryImpl } from '../../../infrastructure/repositories/impl/ClassRepositoryImpl';

const classRepository: ClassRepository = new ClassRepositoryImpl();

export const findAll = async (req: Request<{}, {}, Student>, res: Response, next: NextFunction) => {
    const classes: Class[] = await classRepository.findAll();

    return res.status(StatusCodes.OK).json(classes);
};