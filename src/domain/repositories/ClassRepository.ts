import { Class } from '../models/Class';

export interface ClassRepository {
    findAll(): Promise<Class[]>;
    findById(id: number): Promise<Class>;
    create(newClass: Class): Promise<Class>;
    update(id: number, updatedClass: Class): Promise<Class>;
    delete(id: number): Promise<boolean>;
}