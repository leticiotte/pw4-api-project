import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Subject } from '../../../domain/models/Subject';
import { SubjectRepository } from '../../../domain/repositories/SubjectRepository';
import { SubjectRepositoryImpl } from '../../../infrastructure/repositories/impl/SubjectRepositoryImpl';

const subjectRepository: SubjectRepository = new SubjectRepositoryImpl();

export const findAll = async (req: Request<{}, {}, Subject>, res: Response, next: NextFunction) => {
    const subjects: Subject[] = await subjectRepository.findAll();

    return res.status(StatusCodes.OK).json(subjects);
};