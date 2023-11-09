import { Class } from '../../../domain/models/Class';
import { ClassRepository } from '../../../domain/repositories/ClassRepository';
import { ClassNotFoundError } from '../../../shared/errors/ClassNotFoundError';
import logger from '../../../shared/utils/logger';
import { classes } from '../../db/data';
import { ClassDb } from '../../db/tables/ClassDb';


export class ClassRepositoryImpl implements ClassRepository {
    async findAll(): Promise<Class[]> {
        logger.info('ClassRepository findAll');
        const results = await ClassDb.findAll();
        const classes: Class[] = results.map(c => {
            return {
                id: c.id,
                key: c.key,
                name: c.name,
                course: c.course,
                students: []
            };
        });

        return classes;
    }


    findById(id: number): Class {
        logger.info(`ClassRepository findById: ${id}`);

        const index = classes.findIndex(c => c.id == id);
        if (index == -1) {
            logger.error('Class not found');
            throw new ClassNotFoundError('Turma não encontrada');
        }

        return classes[index];
    }

    create(newClass: Class): Class {
        logger.info('ClassRepository create');

        newClass.id = 1;
        classes.push(newClass);

        return newClass;
    }

    update(id: number, updatedClass: Class): Class {
        logger.info(`ClassRepository update: ${id}`);

        const index = classes.findIndex(c => c.id == id);
        if (index == -1) {
            logger.error('Class not found');
            throw new ClassNotFoundError('Turma não encontrada');
        }
        updatedClass.id = id;
        classes[index] = updatedClass;
        return updatedClass;
    }

    delete(id: number): boolean {
        logger.info(`ClassRepository delete: ${id}`);

        const index = classes.findIndex(c => c.id == id);
        if (index == -1) {
            logger.error('Class not found');
            throw new ClassNotFoundError('Turma não encontrada');
        }
        classes.splice(index, 1);
        return true;
    }
}
