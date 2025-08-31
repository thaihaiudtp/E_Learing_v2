export interface ResponseDTO<T = unknown> {
    status: number;
    meta?: {
        current: number;
        total: number;
        page_size: number;
    }
    data?: T | null;
    error?: string;
    message?: string;
}
