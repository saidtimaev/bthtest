import { ref } from 'vue';
import axios from 'axios';

// Рекомендую создать интерфейс для товара, если ты знаешь структуру
interface Product {
    id: number;
    attributes: {
        name: string;
        price: number;
        description: string;
        category?: { id: number; name: string };
    };
}

export function useProduct() {
    const product = ref<Product | null>(null);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null); 

    const fetchProduct = async (id: number) => {
        loading.value = true;
        error.value = null; 
        try {
            const response = await axios.get(`/api/products/${id}`);
            product.value = response.data.data;
        } catch (e: any) {
            console.error("Ошибка загрузки товара:", e);
            error.value = e.response?.status === 404 
                ? "Товар не найден" 
                : "Произошла ошибка при загрузке данных";
        } finally {
            loading.value = false;
        }
    };

    return {
        product,
        loading,
        error,
        fetchProduct
    };
}