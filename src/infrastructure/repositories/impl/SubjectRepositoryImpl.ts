import _ from "lodash";
import { Op } from "sequelize";
import { Student } from "../../../domain/models/Student";
import { StudentSubject } from "../../../domain/models/StudentSubject";
import { Subject } from "../../../domain/models/Subject";
import { SubjectRepository } from "../../../domain/repositories/SubjectRepository";
import { DatabaseError } from "../../../shared/errors/DatabaseError";
import { ForeignKeyConstraintError } from "../../../shared/errors/ForeignKeyConstraintError";
import { StudentNotFoundError } from "../../../shared/errors/StudentNotFoundError";
import { SubjectNotFoundError } from "../../../shared/errors/SubjectNotFoundError";
import logger from "../../../shared/utils/logger";
import { StudentDb } from "../../db/tables/StudentDb";
import { StudentSubjectDb } from "../../db/tables/StudentSubjectDb";
import { SubjectDb } from "../../db/tables/SubjectDb";
import { studentDbIntoStudent } from "../../db/utils/StudentDbUtils";
import { studentSubjectDbArrayIntoStudentSubjectArray } from "../../db/utils/StudentSubjectDbUtils";
import {
    subjectDbArrayIntoSubjectArray,
    subjectDbIntoSubject,
} from "../../db/utils/SubjectDbUtils";

export class SubjectRepositoryImpl implements SubjectRepository {
    async findAll(): Promise<Subject[]> {
        logger.info("SubjectRepository findAll");

        const results = await SubjectDb.findAll().catch((error) => {
            console.error("Erro ao procurar registro: ", error);
            throw new DatabaseError(
                "Erro de banco de dados ao procurar registro"
            );
        });

        const subjects: Subject[] = subjectDbArrayIntoSubjectArray(results);

        return subjects;
    }

    async findById(id: number): Promise<Subject> {
        logger.info(`SubjectRepository findById: ${id}`);

        const result = await SubjectDb.findByPk(id).catch((error) => {
            console.error("Erro ao procurar registro: ", error);
            throw new DatabaseError(
                "Erro de banco de dados ao procurar registro"
            );
        });

        if (result == null) {
            logger.error("Subject not found");
            throw new SubjectNotFoundError("Disciplina não encontrada");
        }

        return subjectDbIntoSubject(result);
    }

    async findAllStudents(subjectId: number): Promise<Student[]> {
        logger.info("SubjectRepository findAllStudents");

        const whereClause = {
            where: {
                subjectId: {
                    [Op.eq]: subjectId,
                },
            },
        };

        const results = await StudentSubjectDb.findAll(whereClause).catch(
            (error) => {
                console.error("Erro ao procurar registros: ", error);
                throw new DatabaseError(
                    "Erro de banco de dados ao procurar registros"
                );
            }
        );

        const studentSubjects: StudentSubject[] =
            studentSubjectDbArrayIntoStudentSubjectArray(results);

        const students: Student[] = [];
        await Promise.all(
            studentSubjects.map(async (s) => {
                const result = await StudentDb.findByPk(s.studentId).catch(
                    (error) => {
                        console.error("Erro ao procurar registro: ", error);
                        throw new DatabaseError(
                            "Erro de banco de dados ao procurar registro"
                        );
                    }
                );

                if (result == null) {
                    logger.error("Student not found");
                    throw new StudentNotFoundError("Estudante não encontrado");
                }

                students.push(studentDbIntoStudent(result));
            })
        );

        return students;
    }

    async create(subject: Subject): Promise<Subject> {
        logger.info("SubjectRepository create");

        const result = await SubjectDb.create(subject).catch((error) => {
            console.error("Erro ao criar registro: ", error);
            throw new DatabaseError("Erro de banco de dados ao criar registro");
        });

        return subjectDbIntoSubject(result);
    }

    async update(id: number, updatedSubject: Subject): Promise<Subject | null> {
        logger.info(`SubjectRepository update: ${id}`);
        const findRegisterOnDb = await SubjectDb.findByPk(id);
        if (!findRegisterOnDb) {
            logger.error("Student not found");
            throw new SubjectNotFoundError("Matéria não encontrado");
        }
        const subjectToCompareChanges: Subject = { ...updatedSubject, id: id };

        if (_.isEqual(findRegisterOnDb.dataValues, subjectToCompareChanges)) {
            logger.warn("No changes detected");
            return null;
        }

        try {
            const [rowsUpdated] = await SubjectDb.update(updatedSubject, {
                where: {
                    id: id,
                },
            });

            if (rowsUpdated > 0) {
                const updatedModel = await SubjectDb.findByPk(id);

                if (updatedModel) {
                    return subjectDbIntoSubject(updatedModel.toJSON());
                } else {
                    logger.error("Subject not found after update");
                    throw new SubjectNotFoundError("Disciplina não encontrado");
                }
            } else {
                logger.error("Subject not found");
                throw new SubjectNotFoundError("Disciplina não encontrado");
            }
        } catch (error) {
            console.error("Erro ao atualizar registro: ", error);
            throw new DatabaseError(
                "Erro de banco de dados ao atualizar registro"
            );
        }
    }

    async delete(id: number): Promise<boolean> {
        logger.info(`SubjectRepository delete: ${id}`);

        logger.info("Verify if subject has enrolled students ");
        const students: StudentSubject[] = await this.findAllStudentsIds(id);
        if (students.length != 0) {
            logger.error("Subject is being used as ForeignKey");
            throw new ForeignKeyConstraintError(
                "A matéria possui alunos matriculados"
            );
        }

        try {
            const rowsAffected = await SubjectDb.destroy({
                where: {
                    id: id,
                },
            });

            if (rowsAffected > 0) {
                return true;
            } else {
                logger.error("Subject not found");
                throw new SubjectNotFoundError("Disciplina não encontrado");
            }
        } catch (error) {
            console.error("Erro ao excluir registro: ", error);
            throw new DatabaseError(
                "Erro de banco de dados ao excluir registro"
            );
        }
    }

    private async findAllStudentsIds(
        subjectId: number
    ): Promise<StudentSubject[]> {
        logger.info("SubjectRepository findAllStudents");

        const whereClause = {
            where: {
                subjectId: {
                    [Op.eq]: subjectId,
                },
            },
        };

        const results = await StudentSubjectDb.findAll(whereClause).catch(
            (error) => {
                console.error("Erro ao procurar registros: ", error);
                throw new DatabaseError(
                    "Erro de banco de dados ao procurar registros"
                );
            }
        );

        const studentSubjects: StudentSubject[] =
            studentSubjectDbArrayIntoStudentSubjectArray(results);

        return studentSubjects;
    }
}
