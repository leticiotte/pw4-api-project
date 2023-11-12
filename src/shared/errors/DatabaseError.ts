export class DatabaseError extends Error {
    details: string = 'DATABASE_ERROR';
    constructor(message: string) {
        super(message);
    }
}