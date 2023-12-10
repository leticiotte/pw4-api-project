export class SubjectNotFoundError extends Error {
    details: string = "SUBJECT_NOT_FOUND";
    constructor(message: string) {
        super(message);
    }
}
