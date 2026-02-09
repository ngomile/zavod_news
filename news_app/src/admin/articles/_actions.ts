import { getAuthToken } from '@/app/auth/actions';
import type { Article } from '@/types';
import { API_URL } from '@/lib/config';

import type {
    ArticleFormData
} from '@/admin/articles/_types';

export const createArticle = async (data: ArticleFormData): Promise<Article | undefined> => {
    const url = `${API_URL}articles/`;
    const token = getAuthToken();

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('text', data.content);
    formData.append('main_image', data.lead_img[0]);
    
    if (data.images) {
        Array.from(data.images).forEach((file) => {
            formData.append('images', file);
        });
    }
    
    if (data.tags) {
        data.tags.forEach((tag) => {
            formData.append('tags', tag.toString());
        });
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const toPrint = await response.json();
            console.error(toPrint);
            throw new Error(`Error creating news item: ${response.statusText}`);
        }

        const jsonData = await response.json();
        return {
            id: jsonData.id,
            title: jsonData.title,
            lead_img: jsonData.lead_image,
            images: [],
            content: jsonData.content,
            tags: jsonData.tags,
            created_at: jsonData.created_at,
            updated_at: jsonData.updated_at,
        };
    } catch (error) {
        console.error("Failed to create news item:", error);
    }

    return undefined;
};

export const updateArticle = async (id: number, data: ArticleFormData): Promise<Article | undefined> => {
    const url = `${API_URL}articles/${id}/`;
    const token = getAuthToken();

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    
    if (data.lead_img && data.lead_img.length > 0) {
        formData.append('main_image', data.lead_img[0]);
    }
    
    if (data.images) {
        Array.from(data.images).forEach((file) => {
            formData.append('images', file);
        });
    }
    
    if (data.tags) {
        data.tags.forEach((tag) => {
            formData.append('tags', tag.toString());
        });
    }

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Token ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const toPrint = await response.json();
            console.error(toPrint);
            throw new Error(`Error updating news item: ${response.statusText}`);
        }

        const jsonData = await response.json();
        return {
            id: jsonData.id,
            title: jsonData.title,
            lead_img: jsonData.lead_image,
            images: [],
            content: jsonData.content,
            tags: jsonData.tags,
            created_at: jsonData.created_at,
            updated_at: jsonData.updated_at,
        };
    } catch (error) {
        console.error("Failed to update news item:", error);
    }

    return undefined;
};

export const deleteArticle = async (id: number): Promise<boolean> => {
    const url = `${API_URL}articles/${id}/`;
    const token = getAuthToken();

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error deleting news item: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Failed to delete news item:", error);
    }

    return false;
};
