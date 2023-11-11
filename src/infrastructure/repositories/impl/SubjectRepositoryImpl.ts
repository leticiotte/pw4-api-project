import { Subject } from '../../../domain/models/Subject';
import { SubjectRepository } from '../../../domain/repositories/SubjectRepository';
import { DatabaseError } from '../../../shared/errors/DatabaseError';
import { SubjectNotFoundError } from '../../../shared/errors/SubjectNotFoundError';
import logger from '../../../shared/utils/logger';
import { SubjectDb } from '../../db/tables/SubjectDb';
import { subjectDbArrayIntoSubjectArray, subjectDbIntoSubject } from '../../db/utils/SubjectDbUtils';

export class SubjectRepositoryImpl implements SubjectRepository {
    async findAll(): Promise<Subject[]> {
        logger.info('SubjectRepository findAll');

        const results = await SubjectDb.findAll().catch((error) => {
            console.error('Erro ao procurar registro: ', error);
            throw new DatabaseError('Erro de banco de dados ao procurar registro');
        });

        const subjects: Subject[] = subjectDbArrayIntoSubjectArray(results);

        return subjects;
    }

    async findById(id: number): Promise<Subject> {
        logger.info(`SubjectRepository findById: ${id}`);


        const result = await SubjectDb.findByPk(id).catch((error) => {
            console.error('Erro ao procurar registro: ', error);
            throw new DatabaseError('Erro de banco de dados ao procurar registro');
        });

        if (result == null) {
            logger.error('Subject not found');
            throw new SubjectNotFoundError('Disciplina não encontrado');
        }

        return subjectDbIntoSubject(result);
    }

    async create(subject: Subject): Promise<Subject> {
        logger.info('SubjectRepository create');

        const result = await SubjectDb.create(subject).catch((error) => {
            console.error('Erro ao atualizar registro: ', error);
            throw new DatabaseError('Erro de banco de dados ao atualizar registro');
        });

        return subjectDbIntoSubject(result);
    }

    async update(id: number, updatedSubject: Subject): Promise<Subject> {
        logger.info(`SubjectRepository update: ${id}`);

        try {
            const [rowsUpdated] = await SubjectDb.update(updatedSubject, {
                where: {
                    id: id
                }
            });

            if (rowsUpdated > 0) {
                const updatedModel = await SubjectDb.findByPk(id);

                if (updatedModel) {
                    return subjectDbIntoSubject(updatedModel.toJSON());
                } else {
                    logger.error('Subject not found after update');
                    throw new SubjectNotFoundError('Disciplina não encontrado');
                }
            } else {
                logger.error('Subject not found');
                throw new SubjectNotFoundError('Disciplina não encontrado');
            }
        } catch (error) {
            console.error('Erro ao atualizar registro: ', error);
            throw new DatabaseError('Erro de banco de dados ao atualizar registro');
        }
    }

    async delete(id: number): Promise<boolean> {
        logger.info(`SubjectRepository delete: ${id}`);

        try {
            const rowsAffected = await SubjectDb.destroy({
                where: {
                    id: id
                }
            });

            if (rowsAffected > 0) {
                return true;
            } else {
                logger.error('Subject not found');
                throw new SubjectNotFoundError('Disciplina não encontrado');
            }
        } catch (error) {
            console.error('Erro ao excluir registro: ', error);
            throw new DatabaseError('Erro de banco de dados ao excluir registro');
        }
    }
}
