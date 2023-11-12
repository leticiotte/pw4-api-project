import { Class } from './Class';
import { GenderEnum } from './enums/GenderEnum';
import { Subject } from './Subject';

export type Student = {
    id?: number;
    name: string;
    studentNumber: string;
    birthDate: string;
    gender: GenderEnum;
    email: string;
    phone?: string;
    classId: number;
    class?: Class;
    subjects?: Subject[];
}