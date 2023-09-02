import { Student } from '../models/Student';

export interface StudentRepository {
    findAll(): Student[];
    findById(id: string): Student;
    create(student: Student): Student;
    update(id: string, updatedStudent: Student): Student;
    delete(id: string): boolean;
}