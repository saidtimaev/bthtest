<script setup>
import { onMounted, watch } from 'vue';
import { useProducts } from '@/composables/useProducts';
import { Head, Link } from '@inertiajs/vue3';
import axios from 'axios';

const { 
    products, categories, loading, pagination, perPage, searchQuery,
    selectedCategory, fetchProducts, fetchCategories 
} = useProducts();

onMounted(() => {
    fetchProducts();
    fetchCategories();
});

let timeout = null;
const handleSearch = () => {
    clearTimeout(timeout); 
    timeout = setTimeout(() => fetchProducts(1), 500);
};

const deleteProduct = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
    try {
        await axios.delete(`/api/products/${id}`);
        fetchProducts(pagination.value.current_page);
    } catch (e) {
        alert('Ошибка при удалении товара');
    }
};

watch(selectedCategory, () => fetchProducts(1));
</script>

<template>
    <Head title="Управление товарами" />

    <div class="max-w-7xl mx-auto p-10 font-sans text-slate-800">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 class="text-4xl font-extrabold text-indigo-600">Панель управления</h1>
            <Link href="/admin/products/create">
                <button class="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Добавить товар
                </button>
            </Link>
        </div>

        <div class="flex flex-col md:flex-row gap-5 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-200 items-end">
            <div class="flex flex-col gap-1.5 w-full md:w-48">
                <label class="text-sm font-semibold text-slate-500">Категория</label>
                <select v-model="selectedCategory" @change="fetchProducts(1)" 
                        class="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none transition-all">
                    <option value="">Все категории</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
            </div>

            <div class="flex flex-col gap-1.5 w-full md:w-24">
                <label class="text-sm font-semibold text-slate-500">Лимит</label>
                <select v-model="perPage" @change="fetchProducts(1)"
                        class="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none transition-all">
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                </select>
            </div>

            <div class="flex flex-col gap-1.5 flex-grow w-full md:w-auto">
                <label class="text-sm font-semibold text-slate-500">Поиск</label>
                <div class="relative">
                    <input v-model="searchQuery" @input="handleSearch" type="text" placeholder="Поиск по названию"
                           class="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 pl-10 outline-none transition-all">
                    <span class="absolute left-3 top-2.5 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>

        <div v-if="loading" class="flex flex-col items-center py-20 text-slate-500">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
            <span>Синхронизация данных...</span>
        </div>

        <div v-else-if="products.length > 0" class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead class="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-slate-600">Товар</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-slate-600">Категория</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-slate-600">Цена</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-slate-600">Описание</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-slate-600 text-right">Действия</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-for="product in products" :key="product.id" class="hover:bg-slate-50 transition-colors">
                        <td class="p-4">
                            <div class="flex flex-col">
                                <span class="text-slate-900 font-semibold">{{ product.attributes?.name || product.name }}</span>
                            </div>
                        </td>
                        <td class="p-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {{ product.attributes.category?.name || 'Нет' }}
                            </span>
                        </td>
                        <td class="p-4 font-bold text-slate-900">
                            {{ (product.attributes?.price || product.price).toLocaleString() }} 
                        </td>
                        <td class="p-4 text-slate-500 text-sm max-w-xs truncate">
                            {{ product.attributes.description }}
                        </td>
                        <td class="p-4 text-right">
                            <div class="flex justify-end gap-2">
                                <Link :href="'/admin/products/' + product.id + '/edit'" class="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </Link>
                                <button @click="deleteProduct(product.id)" class="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="pagination && pagination.last_page > 1" class="p-5 flex justify-center items-center gap-5 border-t border-slate-100 bg-slate-50/50">
                <button :disabled="pagination.current_page === 1" @click="fetchProducts(pagination.current_page - 1)"
                        class="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm">
                    Назад
                </button>
                <div class="text-sm font-medium text-slate-500">
                    <span class="text-indigo-600">{{ pagination.current_page }}</span> / {{ pagination.last_page }}
                </div>
                <button :disabled="pagination.current_page === pagination.last_page" @click="fetchProducts(pagination.current_page + 1)"
                        class="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm">
                    Вперед
                </button>
            </div>
        </div>

        <div v-else class="text-center py-20 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            База данных пуста или товары не найдены.
        </div>
    </div>
</template>