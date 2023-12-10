import { Student } from "../models/Student";
import { Subject } from "../models/Subject";

export interface StudentRepository {
    findAll(): Promise<Student[]>;
    findById(id: number): Promise<Student>;
    findSubjectsById(id: number): Promise<Subject[]>;
    findStudentsByClassId(classId: number): Promise<Student[]>;
    create(student: Student): Promise<Student>;
    addSubject(id: number, subjectId: number): Promise<boolean>;
    deleteSubject(id: number, subjectId: number): Promise<boolean>;
    update(id: number, updatedStudent: Student): Promise<Student>;
    delete(id: number): Promise<boolean>;
}
