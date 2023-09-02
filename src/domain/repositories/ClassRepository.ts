import { Class } from '../models/Class';

export interface ClassRepository {
    findAll(): Class[];
    findById(id: string): Class;
    create(newClass: Class): Class;
    update(id: string, updatedClass: Class): Class;
    delete(id: string): boolean;
}