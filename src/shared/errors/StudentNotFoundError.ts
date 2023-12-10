export class StudentNotFoundError extends Error {
    details: string = "STUDENT_NOT_FOUND";
    constructor(message: string) {
        super(message);
    }
}
