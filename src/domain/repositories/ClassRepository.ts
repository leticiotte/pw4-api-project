import { Class } from '../models/Class';

export interface ClassRepository {
    findAll(): Promise<Class[]>;
    findById(id: number): Class;
    create(newClass: Class): Class;
    update(id: number, updatedClass: Class): Class;
    delete(id: number): boolean;
}