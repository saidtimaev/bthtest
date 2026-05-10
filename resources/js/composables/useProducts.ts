import { ref } from 'vue';
import axios from 'axios';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    attributes: {
        name: string;
        price: number;
        description: string;
        category?: Category;
    };
}

export function useProducts() {
    const products = ref<Product[]>([]);
    const categories = ref<Category[]>([]);
    const loading = ref(false);
    const pagination = ref(null);
    const selectedCategory = ref('');
    const perPage = ref(10);
    const searchQuery = ref('')

    const fetchProducts = async (page = 1) => {
        loading.value = true;
        try {
            const params = {
                page,
                per_page: perPage.value,
                search: searchQuery.value || undefined,
                category_id: selectedCategory.value || undefined
            };
            const response = await axios.get('/api/products', { params });
            products.value = response.data.data;
            pagination.value = response.data.meta;
        } catch (error) {
            console.error("Ошибка при загрузке товаров:", error);
        } finally {
            loading.value = false;
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            categories.value = response.data.data || response.data;
        } catch (e) {
            console.error("Не удалось загрузить категории:", e);
        }
    };

    return {
        products,
        categories,
        loading,
        pagination,
        selectedCategory,
        perPage,
        searchQuery,
        fetchProducts,
        fetchCategories
    };
}