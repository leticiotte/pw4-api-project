import { Class } from '../../../domain/models/Class';
import { ClassRepository } from '../../../domain/repositories/ClassRepository';
import { ClassNotFoundError } from '../../../shared/errors/ClassNotFoundError';
import { DatabaseError } from '../../../shared/errors/DatabaseError';
import logger from '../../../shared/utils/logger';
import { ClassDb } from '../../db/tables/ClassDb';
import { classDbArrayIntoClassArray, classDbIntoClass } from '../../db/utils/ClassDbUtils';


export class ClassRepositoryImpl implements ClassRepository {
    async findAll(): Promise<Class[]> {
        logger.info('ClassRepository findAll');

        const results = await ClassDb.findAll().catch((error) => {
            console.error('Erro ao procurar registros: ', error);
            throw new DatabaseError('Erro de banco de dados ao procurar registros');
        });
        const classes: Class[] = classDbArrayIntoClassArray(results);

        return classes;
    }


    async findById(id: number): Promise<Class> {
        logger.info(`ClassRepository findById: ${id}`);

        const result = await ClassDb.findByPk(id).catch((error) => {
            console.error('Erro ao procurar registro: ', error);
            throw new DatabaseError('Erro de banco de dados ao procurar registro');
        });

        if (result == null) {
            logger.error('Class not found');
            throw new ClassNotFoundError('Turma não encontrada');
        }

        return classDbIntoClass(result);
    }

    async create(newClass: Class): Promise<Class> {
        logger.info('ClassRepository create');

        const result = await ClassDb.create(newClass).catch((error) => {
            console.error('Erro ao atualizar registro: ', error);
            throw new DatabaseError('Erro de banco de dados ao atualizar registro');
        });

        return classDbIntoClass(result);
    }

    async update(id: number, updatedClass: Class): Promise<Class> {
        logger.info(`ClassRepository update: ${id}`);

        try {
            const [rowsUpdated] = await ClassDb.update(updatedClass, {
                where: {
                    id: id
                }
            });

            if (rowsUpdated > 0) {
                const updatedModel = await ClassDb.findByPk(id);

                if (updatedModel) {
                    return classDbIntoClass(updatedModel.toJSON());
                } else {
                    logger.error('Class not found after update');
                    throw new ClassNotFoundError('Turma não encontrada após a atualização');
                }
            } else {
                logger.error('Class not found');
                throw new ClassNotFoundError('Turma não encontrada');
            }
        } catch (error) {
            console.error('Erro ao atualizar registro: ', error);
            throw new DatabaseError('Erro de banco de dados ao atualizar registro');
        }
    }

    async delete(id: number): Promise<boolean> {
        logger.info(`ClassRepository delete: ${id}`);

        try {
            const rowsAffected = await ClassDb.destroy({
                where: {
                    id: id
                }
            });

            if (rowsAffected > 0) {
                return true;
            } else {
                logger.error('Class not found');
                throw new ClassNotFoundError('Turma não encontrada');
            }
        } catch (error) {
            console.error('Erro ao excluir registro: ', error);
            throw new DatabaseError('Erro de banco de dados ao excluir registro');
        }
    }
}
