import { v4 as uuidv4 } from 'uuid';
import { Subject } from '../../../domain/models/Subject';
import { SubjectRepository } from '../../../domain/repositories/SubjectRepository';
import { SubjectNotFoundError } from '../../../shared/errors/SubjectNotFoundError';
import logger from '../../../shared/utils/logger';
import { subjects } from '../../db/data';

export class SubjectRepositoryImpl implements SubjectRepository {
    findAll(): Subject[] {
        logger.info('SubjectRepository findAll');

        return subjects;
    }

    findById(id: string): Subject {
        logger.info(`SubjectRepository findById: ${id}`);

        const index = subjects.findIndex(subject => subject.id == id);
        if (index == -1) {
            logger.error('Subject not found');
            throw new SubjectNotFoundError('Disciplina não encontrado');
        }

        return subjects[index];
    }

    create(subject: Subject): Subject {
        logger.info('SubjectRepository create');

        const id = uuidv4();
        subject.id = id;
        subjects.push(subject);

        return subject;
    }

    update(id: string, updatedSubject: Subject): Subject {
        logger.info(`SubjectRepository update: ${id}`);

        const index = subjects.findIndex(subject => subject.id == id);
        if (index == -1) {
            logger.error('Subject not found');
            throw new SubjectNotFoundError('Disciplina não encontrado');
        }

        updatedSubject.id = id;
        subjects[index] = updatedSubject;
        return updatedSubject;
    }

    delete(id: string): boolean {
        logger.info(`SubjectRepository delete: ${id}`);

        const index = subjects.findIndex(subject => subject.id == id);
        if (index == -1) {
            logger.error('Subject not found');
            throw new SubjectNotFoundError('Disciplina não encontrado');
        }

        subjects.splice(index, 1);
        return true;
    }
}
