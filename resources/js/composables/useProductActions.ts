import { ref } from 'vue';
import axios from 'axios';

export function useProductActions() {
    const loading = ref(false);
    const errors = ref<Record<string, string[] | string> | null>(null);

    // Создание товара
    const createProduct = async (data: object) => {
        loading.value = true;
        errors.value = null;
        try {
            const response = await axios.post('/api/products', data);
            return response.data;
        } catch (e: any) {
            if (e.response?.status === 422) {
                errors.value = e.response.data.errors;
            }
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // Обновление товара
    const updateProduct = async (id: number | string, data: object) => {
        loading.value = true;
        errors.value = null;
        try {
            const response = await axios.patch(`/api/products/${id}`, data);
            return response.data;
        } catch (e: any) {
            if (e.response?.status === 422) {
                errors.value = e.response.data.errors;
            }
            throw e;
        } finally {
            loading.value = false;
        }
    };

    // Удаление товара
    const deleteProduct = async (id: number | string) => {
        loading.value = true;
        try {
            await axios.delete(`/api/products/${id}`);
            return true;
        } catch (e: any) {
            console.error("Ошибка при удалении:", e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        errors,
        createProduct,
        updateProduct,
        deleteProduct
    };
}