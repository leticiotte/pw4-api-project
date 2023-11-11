import { Subject } from '../models/Subject';

export interface SubjectRepository {
    findAll(): Promise<Subject[]>;
    findById(id: number): Promise<Subject>;
    create(subject: Subject): Promise<Subject>;
    update(id: number, updatedSubject: Subject): Promise<Subject>;
    delete(id: number): Promise<boolean>;
}