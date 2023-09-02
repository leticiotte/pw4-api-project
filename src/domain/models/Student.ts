import { GenderEnum } from './enums/GenderEnum';

export type Student = {
    id?: string;
    name: string;
    studentNumber: string;
    birthDate: string;
    gender: GenderEnum;
    email: string;
    phone?: string;
    classId: string;
}