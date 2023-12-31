import _ from "lodash";
import { Op } from "sequelize";
import { Class } from "../../../domain/models/Class";
import { Student } from "../../../domain/models/Student";
import { ClassRepository } from "../../../domain/repositories/ClassRepository";
import { ClassNotFoundError } from "../../../shared/errors/ClassNotFoundError";
import { DatabaseError } from "../../../shared/errors/DatabaseError";
import { ForeignKeyConstraintError } from "../../../shared/errors/ForeignKeyConstraintError";
import logger from "../../../shared/utils/logger";
import { ClassDb } from "../../db/tables/ClassDb";
import { StudentDb } from "../../db/tables/StudentDb";
import {
    classDbArrayIntoClassArray,
    classDbIntoClass,
} from "../../db/utils/ClassDbUtils";

export class ClassRepositoryImpl implements ClassRepository {
    async findAll(): Promise<Class[]> {
        logger.info("ClassRepository findAll");

        const results = await ClassDb.findAll().catch((error) => {
            console.error("Erro ao procurar registros: ", error);
            throw new DatabaseError(
                "Erro de banco de dados ao procurar registros"
            );
        });
        const classes: Class[] = classDbArrayIntoClassArray(results);

        return classes;
    }

    async findById(id: number): Promise<Class> {
        logger.info(`ClassRepository findById: ${id}`);

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

    async findStudentsById(id: number): Promise<Student[]> {
        logger.info("ClassRepository findStudentsById");

        return this.findStudentsByClassId(id);
    }

    async create(newClass: Class): Promise<Class> {
        logger.info("ClassRepository create");

        const result = await ClassDb.create(newClass).catch((error) => {
            console.error("Erro ao criar registro: ", error);
            throw new DatabaseError("Erro de banco de dados ao criar registro");
        });

        return classDbIntoClass(result);
    }

    async update(id: number, updatedClass: Class): Promise<Class | null> {
        logger.info(`ClassRepository update: ${id}`);
        const findRegisterOnDb = await ClassDb.findByPk(id);
        if (!findRegisterOnDb) {
            logger.error("Class not found");
            throw new ClassNotFoundError("Classe não encontrada");
        }
        const classToCompareChanges: Class = { ...updatedClass, id: id };

        if (_.isEqual(findRegisterOnDb.dataValues, classToCompareChanges)) {
            logger.warn("No changes detected");
            return null;
        }

        try {
            const [rowsUpdated] = await ClassDb.update(updatedClass, {
                where: {
                    id: id,
                },
            });

            if (rowsUpdated > 0) {
                const updatedModel = await ClassDb.findByPk(id);

                if (updatedModel) {
                    return classDbIntoClass(updatedModel.toJSON());
                } else {
                    logger.error("Class not found after update");
                    throw new ClassNotFoundError(
                        "Turma não encontrada após a atualização"
                    );
                }
            } else {
                logger.error("Class not found");
                throw new ClassNotFoundError("Turma não encontrada");
            }
        } catch (error) {
            console.error("Erro ao atualizar registro: ", error);
            throw new DatabaseError(
                "Erro de banco de dados ao atualizar registro"
            );
        }
    }

    async delete(id: number): Promise<boolean> {
        logger.info(`ClassRepository delete: ${id}`);

        logger.info("Verify if class has enrolled students");
        const students: Student[] = await this.findStudentsByClassId(id);
        if (students.length != 0) {
            logger.error("Class is being used as ForeignKey");
            throw new ForeignKeyConstraintError("A classe possui alunos");
        }

        try {
            const rowsAffected = await ClassDb.destroy({
                where: {
                    id: id,
                },
            });

            if (rowsAffected > 0) {
                return true;
            } else {
                logger.error("Class not found");
                throw new ClassNotFoundError("Turma não encontrada");
            }
        } catch (error) {
            console.error("Erro ao excluir registro: ", error);
            throw new DatabaseError(
                "Erro de banco de dados ao excluir registro"
            );
        }
    }

    private async findStudentsByClassId(classId: number): Promise<Student[]> {
        logger.info("ClassRepository findStudentsByClassId");

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
}
