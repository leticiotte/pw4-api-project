import { Class } from '../../domain/models/Class';
import { Courses } from '../../domain/models/Courses';
import { GenderEnum } from '../../domain/models/enums/GenderEnum';
import { Student } from '../../domain/models/Student';

export const students: Student[] = [
    {
        'name': 'Letícia Gonçalves',
        'studentNumber': 'SC3011534',
        'birthDate': '14/03/2002',
        'gender': GenderEnum.FEMININE,
        'email': 'leticia@email.com',
        'phone': '016991380686',
        'classId': 'teste',
        'id': 'bf2855a1-6543-4e79-aceb-72fb623a645b'
    }
];
export const classes: Class[] = [];
export const courses: Courses[] = [];
