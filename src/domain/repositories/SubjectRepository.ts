import { Subject } from '../models/Subject';

export interface SubjectRepository {
    findAll(): Subject[];
    findById(id: string): Subject;
    create(subject: Subject): Subject;
    update(id: string, updatedSubject: Subject): Subject;
    delete(id: string): boolean;
}