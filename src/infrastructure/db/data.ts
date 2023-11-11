import { Class } from '../../domain/models/Class';
import { GenderEnum } from '../../domain/models/enums/GenderEnum';
import { Student } from '../../domain/models/Student';
import { Subject } from '../../domain/models/Subject';

export const students: Student[] = [
    {
        'name': 'Letícia Gonçalves',
        'studentNumber': 'SC3011534',
        'birthDate': '14/03/2002',
        'gender': GenderEnum.FEMININE,
        'email': 'leticia@email.com',
        'phone': '016991389999',
        'classId': 'teste',
        'id': 'bf2855a1-6543-4e79-aceb-72fb623a645b'
    }
];
export const classes: Class[] = [
    {
        'key': '2020-01',
        'name': 'Turma 1',
        'course': 'ADS',
        'id': 1,
        'students': []
    }
];
export const subjects: Subject[] = [
    {
        'name': 'PW4',
        'description': 'Programação para Web 4',
        'id': 2
    }
];
