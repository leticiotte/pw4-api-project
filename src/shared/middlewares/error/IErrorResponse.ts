export interface IErrorResponse {
    error: {
        code: string;
        message: string;
        details?: string;
    };
}
