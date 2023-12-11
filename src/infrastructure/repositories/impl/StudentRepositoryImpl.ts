import {
    ForeignKeyConstraintError,
    Op,
    UniqueConstraintError,
} from "sequelize";
import { Class } from "../../../domain/models/Class";
import { Student } from "../../../domain/models/Student";
import { StudentSubject } from "../../../domain/models/StudentSubject";
import { Subject } from "../../../domain/models/Subject";
import { StudentRepository } from "../../../domain/repositories/StudentRepository";
import { ClassNotFoundError } from "../../../shared/errors/ClassNotFoundError";
import { DatabaseError } from "../../../shared/errors/DatabaseError";
import { DuplicateRecordError } from "../../../shared/errors/DuplicateRecordError";
import { StudentNotFoundError } from "../../../shared/errors/StudentNotFoundError";
import { SubjectNotFoundError } from "../../../shared/errors/SubjectNotFoundError";
import logger from "../../../shared/utils/logger";
import { ClassDb } from "../../db/tables/ClassDb";
import { StudentDb } from "../../db/tables/StudentDb";
import { StudentSubjectDb } from "../../db/tables/StudentSubjectDb";
import { SubjectDb } from "../../db/tables/SubjectDb";
import { classDbIntoClass } from "../../db/utils/ClassDbUtils";
import {
    studentDbArrayIntoStudentArray,
    studentDbIntoStudent,
} from "../../db/utils/StudentDbUtils";
import { studentSubjectDbArrayIntoStudentSubjectArray } from "../../db/utils/StudentSubjectDbUtils";
import { subjectDbIntoSubject } from "../../db/utils/SubjectDbUtils";

export class StudentRepositoryImpl implements StudentRepository {
    async findAll(): Promise<Student[]> {
        logger.info("StudentRepository findAll");

        const results = await StudentDb.findAll().catch((error) => {
            console.error("Erro ao procurar registros: ", error);
            throw new DatabaseError(
                "Erro de banco de dados ao procurar registros"
            );
        });

        const students: Student[] = studentDbArrayIntoStudentArray(results);
        await Promise.all(
            students.map(async (s) => {
                const classResult: Class = await this.findClassById(s.classId);
                s.class = classResult;
            })
        );

        return students;
    }

    async findById(id: number): Promise<Student> {
        logger.info(`StudentRepository findById: ${id}`);

        const result = await StudentDb.findByPk(id).catch((error) => {
            console.error("Erro ao procurar registro: ", error);
            throw new DatabaseError(
                "Erro de banco de dados ao procurar registro"
            );
        });

        if (result == null) {
            logger.error("Student not found");
            throw new StudentNotFoundError("Estudante não encontrado");
        }

        const student: Student = studentDbIntoStudent(result);

        const classResult: Class = await this.findClassById(student.classId);
        student.class = classResult;

        return student;
    }

    async findSubjectsById(id: number): Promise<Subject[]> {
        logger.info("StudentRepository findSubjectsById");

        const studentSubjects: StudentSubject[] =
            await this.findAllStudentSubjects(id);

        const subjects: Subject[] = [];
        await Promise.all(
            studentSubjects.map(async (s) => {
                const subject: Subject = await this.findSubjectById(
                    s.subjectId
                );
                subjects.push(subject);
            })
        );

        return subjects;
    }

    async findStudentsByClassId(classId: number): Promise<Student[]> {
        logger.info("StudentRepository findStudentsByClassId");

        const whereClause = {
            where: {
                classId: {
                    [Op.eq]: classId,
                },
            },
        };

        const students: Student[] = await StudentDb.findAll(whereClause).catch(
            (error) => {
                console.error("Erro ao procurar registros: ", error);
                throw new DatabaseError(
                    "Erro de banco de dados ao procurar registros"
                );
            }
        );

        students.map((s) => {
            delete s.class;
        });

        return students;
    }

    async create(student: Student): Promise<Student> {
        logger.info("StudentRepository create");

        try {
            const result = await StudentDb.create(student);
            return studentDbIntoStudent(result);
        } catch (error) {
            if (error instanceof ForeignKeyConstraintError) {
                console.error("Foreign key error: ", error);
                throw new ClassNotFoundError("Turma não encontrada");
            } else {
                console.error("Erro ao criar registro: ", error);
                throw new DatabaseError(
                    "Erro de banco de dados ao criar registro"
                );
            }
        }
    }

    async addSubject(id: number, subjectId: number): Promise<boolean> {
        logger.info("StudentRepository addSubject");

        await this.addStudentSubject(id, subjectId);
        return true;
    }

    async deleteSubject(id: number, subjectId: number): Promise<boolean> {
        logger.info("StudentRepository deleteSubject");

        await this.deleteStudentSubject(id, subjectId);

        return true;
    }

    async update(id: number, updatedStudent: Student): Promise<Student> {
        logger.info(`StudentRepository update: ${id}`);

        try {
            const [rowsUpdated] = await StudentDb.update(updatedStudent, {
                where: {
                    id: id,
                },
            }).catch((error) => {
                if (error.name === "SequelizeForeignKeyConstraintError") {
                    console.error("Foreign key error: ", error);
                    throw new ClassNotFoundError(
                        `Turma com id ${updatedStudent.classId} não encontrada`
                    );
                } else {
                    console.error("Erro ao atualizar registro: ", error);
                    throw new DatabaseError(
                        "Erro de banco de dados ao atualizar registro"
                    );
                }
            });

            if (rowsUpdated > 0) {
                const updatedModel = await StudentDb.findByPk(id);

                if (updatedModel) {
                    return studentDbIntoStudent(updatedModel.toJSON());
                } else {
                    logger.error("Student not found after update");
                    throw new StudentNotFoundError(
                        "Estudante não encontrado após a atualização"
                    );
                }
            } else {
                logger.error("Student not found");
                throw new StudentNotFoundError("Estudante não encontrado");
            }
        } catch (error) {
            console.error("Erro ao atualizar registro: ", error);
            throw new DatabaseError(
                "Erro de banco de dados ao atualizar registro"
            );
        }
    }

    async delete(id: number): Promise<boolean> {
        logger.info(`StudentRepository delete: ${id}`);

        try {
            const rowsAffected = await StudentDb.destroy({
                where: {
                    id: id,
                },
            });

            if (rowsAffected > 0) {
                await this.deleteStudentSubjects(id);

                return true;
            } else {
                logger.error("Student not found");
                throw new StudentNotFoundError("Estudante não encontrado");
            }
        } catch (error) {
            if (error instanceof ForeignKeyConstraintError) {
                console.error("Foreign key error: ", error);
                throw new DatabaseError(
                    "Aluno possui disciplinas em que está matriculado"
                );
            }
            console.error("Erro ao excluir registro: ", error);
            throw new DatabaseError(
                "Erro de banco de dados ao excluir registro"
            );
        }
    }

    private async findClassById(id: number): Promise<Class> {
        logger.info(`StudentRepository findById: ${id}`);

        const result = await ClassDb.findByPk(id).catch((error) => {
            console.error("Erro ao procurar registro: ", error);
            throw new DatabaseError(
                "Erro de banco de dados ao procurar registro"
            );
        });

        if (result == null) {
            logger.error("Class not found");
            throw new ClassNotFoundError("Turma não encontrada");
        }

        return classDbIntoClass(result);
    }

    private async findAllStudentSubjects(
        studentId: number
    ): Promise<StudentSubject[]> {
        logger.info("StudentRepository findAllSubjects");

        const whereClause = {
            where: {
                studentId: {
                    [Op.eq]: studentId,
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

    private async findSubjectById(id: number): Promise<Subject> {
        logger.info(`StudentRepository findById: ${id}`);

        const result = await SubjectDb.findByPk(id).catch((error) => {
            console.error("Erro ao procurar registro: ", error);
            throw new DatabaseError(
                "Erro de banco de dados ao procurar registro"
            );
        });

        if (result == null) {
            logger.error("Subject not found");
            throw new SubjectNotFoundError("Disciplina não encontrado");
        }

        return subjectDbIntoSubject(result);
    }

    private async addStudentSubject(
        studentId: number,
        subjectId: number
    ): Promise<boolean> {
        logger.info("StudentRepository addStudentSubject");

        const studentSubject: StudentSubject = {
            studentId: studentId,
            subjectId: subjectId,
        };

        try {
            await StudentSubjectDb.create(studentSubject);
            return true;
        } catch (error) {
            if (error instanceof ForeignKeyConstraintError) {
                console.error("Foreign key error: ", error);
                throw new SubjectNotFoundError("Disciplina não encontrada");
            } else if (error instanceof UniqueConstraintError) {
                console.error("Duplicated key error: ", error);
                throw new DuplicateRecordError(
                    "Aluno já está cadastrado nessa disciplinas"
                );
            } else {
                console.error("Erro ao criar registro: ", error);
                throw new DatabaseError(
                    "Erro de banco de dados ao criar registro"
                );
            }
        }
    }

    private async deleteStudentSubject(
        id: number,
        subjectId: number
    ): Promise<boolean> {
        logger.info("StudentRepository deleteStudentSubjects");

        const whereClause = {
            where: {
                studentId: id,
                subjectId: subjectId,
            },
        };

        try {
            await StudentSubjectDb.destroy(whereClause);

            return true;
        } catch (error) {
            console.error("Erro ao excluir registro: ", error);
            throw new DatabaseError(
                "Erro de banco de dados ao excluir registro"
            );
        }
    }

    private async deleteStudentSubjects(studentId: number): Promise<boolean> {
        logger.info("StudentRepository deleteStudentSubjects");

        const whereClause = {
            where: {
                studentId: studentId,
            },
        };

        try {
            await StudentSubjectDb.destroy(whereClause);

            return true;
        } catch (error) {
            console.error("Erro ao excluir registro: ", error);
            throw new DatabaseError(
                "Erro de banco de dados ao excluir registro"
            );
        }
    }
}
