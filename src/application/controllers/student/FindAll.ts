import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Student } from "../../../domain/models/Student";
import { StudentRepository } from "../../../domain/repositories/StudentRepository";
import { StudentRepositoryImpl } from "../../../infrastructure/repositories/impl/StudentRepositoryImpl";

const studentRepository: StudentRepository = new StudentRepositoryImpl();

export const findAll = async (
    req: Request<{}, {}, Student>,
    res: Response,
    next: NextFunction
) => {
    try {
        const students: Student[] = await studentRepository.findAll();

        return res.status(StatusCodes.OK).json({ students });
    } catch (error) {
        next(error);
        return;
    }
};
