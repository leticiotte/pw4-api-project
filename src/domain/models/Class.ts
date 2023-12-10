import { Student } from "./Student";

export type Class = {
    id?: number;
    key: string;
    name: string;
    course: string;
    students?: Student[];
};
