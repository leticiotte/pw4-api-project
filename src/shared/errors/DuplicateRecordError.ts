export class DuplicateRecordError extends Error {
    details: string = 'DUPLICATE_RECORD_ERROR';
    constructor(message: string) {
        super(message);
    }
}