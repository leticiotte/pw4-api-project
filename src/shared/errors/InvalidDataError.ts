export class InvalidDataError extends Error {
    details: string = 'INVALID_DATA_ERROR';
    constructor(message: string) {
        super(message);
    }
}