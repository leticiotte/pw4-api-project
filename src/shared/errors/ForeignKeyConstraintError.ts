export class ForeignKeyConstraintError extends Error {
    details: string = 'FOREIGN_KEY_CONSTRAINT_ERROR';
    constructor(message: string) {
        super(message);
    }
}