export interface CategoryResponse {
    status: string;
    data: Category[];
    meta: {
        current: number;
        total: number;
        page_size: number;
    };
    message: string;
}
export interface Category {
    _id: string;
    title: string;
}