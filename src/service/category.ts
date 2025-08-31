export const fetchCategories = async () => {
    try {
        const response = await fetch('/api/category', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    return response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}