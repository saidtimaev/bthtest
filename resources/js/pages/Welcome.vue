<script setup>
import { onMounted, watch } from 'vue';
import { useProducts } from '@/composables/useProducts';

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
    timeout = setTimeout(() => {
        fetchProducts(1); 
    }, 500);
};

watch(selectedCategory, () => {
    fetchProducts(1); 
});
</script>

<template>
    <div class="max-w-6xl mx-auto p-10 font-sans text-slate-800">
        <h1 class="text-4xl font-extrabold text-indigo-600 mb-8">Каталог товаров</h1>

        <div class="flex flex-col md:flex-row gap-5 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-200 items-end">
        
            <div class="flex flex-col gap-1.5 w-full md:w-48">
                <label for="category" class="text-sm font-semibold text-slate-500">Категория</label>
                <select id="category" v-model="selectedCategory" @change="fetchProducts(1)" 
                        class="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none transition-all">
                    <option value="">Все категории</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
            </div>

            <div class="flex flex-col gap-1.5 w-full md:w-24">
                <label for="perPage" class="text-sm font-semibold text-slate-500">Лимит</label>
                <select id="perPage" v-model="perPage" @change="fetchProducts(1)"
                        class="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none transition-all">
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                </select>
            </div>

            <div class="flex flex-col gap-1.5 flex-grow w-full md:w-auto">
                <label for="search" class="text-sm font-semibold text-slate-500 ">Поиск</label>
                <div class="relative">
                    <input 
                        id="search"
                        v-model="searchQuery"
                        @input="handleSearch"
                        type="text" 
                        placeholder="Поиск по названию"
                        class="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 pl-10 outline-none transition-all "
                    >
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
            <span>Загружаем данные...</span>
        </div>

        <div v-else-if="products.length > 0" class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead class="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-slate-600">Название</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-slate-600">Категория</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-slate-600">Цена</th>
                        <th class="p-4 text-xs font-bold uppercase tracking-wider text-slate-600">Описание</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-for="product in products" :key="product.attributes.id" class="hover:bg-slate-50 transition-colors">
                        <td class="p-4">
                            <a :href="'/products/' + product.attributes.id" class="text-indigo-600 font-semibold hover:underline">
                                {{ product.attributes.name }}
                            </a>
                        </td>
                        <td class="p-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {{ product.attributes.category?.name || 'Нет' }}
                            </span>
                        </td>
                        <td class="p-4 font-bold text-slate-900">
                            {{ product.attributes.price.toLocaleString() }} 
                        </td>
                        <td class="p-4 text-slate-500 text-sm max-w-xs truncate">
                            {{ product.attributes.description }}
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

        <div v-else class="text-center py-20 text-slate-500">
            Товары не найдены.
        </div>
    </div>
</template>

