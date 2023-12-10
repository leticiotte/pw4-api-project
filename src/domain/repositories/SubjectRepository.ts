import { Student } from "../models/Student";
import { Subject } from "../models/Subject";

export interface SubjectRepository {
    findAll(): Promise<Subject[]>;
    findById(id: number): Promise<Subject>;
    findAllStudents(subjectId: number): Promise<Student[]>;
    create(subject: Subject): Promise<Subject>;
    update(id: number, updatedSubject: Subject): Promise<Subject>;
    delete(id: number): Promise<boolean>;
}
