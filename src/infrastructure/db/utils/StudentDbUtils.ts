import { Student } from '../../../domain/models/Student';
import { StudentDb } from '../tables/StudentDb';

export function studentDbArrayIntoStudentArray(results: StudentDb[]): Student[] {
    return results.map(s => {
        return {
            id: s.id,
            name: s.name,
            studentNumber: s.studentNumber,
            birthDate: s.birthDate,
            gender: s.gender,
            email: s.email,
            phone: s.phone,
            classId: s.classId
        };
    });
}

export function studentDbIntoStudent(result: StudentDb): Student {
    return {
        id: result.id,
        name: result.name,
        studentNumber: result.studentNumber,
        birthDate: result.birthDate,
        gender: result.gender,
        email: result.email,
        phone: result.phone,
        classId: result.classId
    };
}