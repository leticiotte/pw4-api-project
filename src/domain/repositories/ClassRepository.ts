import { Class } from '../models/Class';
import { Student } from '../models/Student';

export interface ClassRepository {
    findAll(): Promise<Class[]>;
    findById(id: number): Promise<Class>;
    findStudentsById(id: number): Promise<Student[]>
    create(newClass: Class): Promise<Class>;
    update(id: number, updatedClass: Class): Promise<Class>;
    delete(id: number): Promise<boolean>;
}