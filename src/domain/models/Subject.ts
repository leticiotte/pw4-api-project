import { Student } from "./Student";

export type Subject = {
    id?: number;
    name: string;
    description: string;
    students?: Student[];
};
