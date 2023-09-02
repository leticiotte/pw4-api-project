import { Student } from '../../../domain/models/Student';
import { StudentRepository } from '../../../domain/repositories/StudentRepository';
import { students } from '../../db/data';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../../shared/utils/logger';
import { StudentNotFoundError } from '../../../shared/errors/StudentNotFoundError';

export class StudentRepositoryImpl implements StudentRepository {
    findAll(): Student[] {
        logger.info('StudentRepository findAll');

        return students;
    }

    findById(id: string): Student {
        logger.info(`StudentRepository findById: ${id}`);

        const index = students.findIndex(student => student.id == id);
        if (index == -1) {
            logger.error('Student not found');
            throw new StudentNotFoundError('Estudante não encontrado');
        }

        return students[index];
    }

    create(student: Student): Student {
        logger.info('StudentRepository create');

        const id = uuidv4();
        student.id = id;
        students.push(student);

        return student;
    }

    update(id: string, updatedStudent: Student): Student {
        logger.info(`StudentRepository update: ${id}`);

        const index = students.findIndex(student => student.id == id);
        if (index == -1) {
            logger.error('Student not found');
            throw new StudentNotFoundError('Estudante não encontrado');
        }
        updatedStudent.id = id;
        students[index] = updatedStudent;
        return updatedStudent;
    }

    delete(id: string): boolean {
        logger.info(`StudentRepository delete: ${id}`);

        const index = students.findIndex(student => student.id == id);
        if (index == -1) {
            logger.error('Student not found');
            throw new StudentNotFoundError('Estudante não encontrado');
        }
        students.splice(index, 1);
        return true;
    }
}
