import { classes } from '../../db/data';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../../shared/utils/logger';
import { ClassRepository } from '../../../domain/repositories/ClassRepository';
import { Class } from '../../../domain/models/Class';
import { ClassNotFoundError } from '../../../shared/errors/ClassNotFoundError';

export class ClassRepositoryImpl implements ClassRepository {
    findAll(): Class[] {
        logger.info('ClassRepository findAll');

        return classes;
    }

    findById(id: string): Class {
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

        const id = uuidv4();
        newClass.id = id;
        classes.push(newClass);

        return newClass;
    }

    update(id: string, updatedClass: Class): Class {
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

    delete(id: string): boolean {
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
