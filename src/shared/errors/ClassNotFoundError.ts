export class ClassNotFoundError extends Error {
    details: string = 'CLASS_NOT_FOUND';
    constructor(message: string) {
        super(message);
    }
}