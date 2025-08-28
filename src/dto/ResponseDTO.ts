export interface ResponseDTO<T = unknown> {
    status: number;
    data?: T | null;
    error?: string;
    message?: string;
}
