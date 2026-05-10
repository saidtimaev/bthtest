<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import { useProducts } from '@/composables/useProducts';
import { useProduct } from '@/composables/useProduct';
import { useProductActions } from '@/composables/useProductActions';
import { computed } from 'vue'; 

const props = defineProps<{
    id?: number; 
}>();
console.log('Received props:', props);
const { product, fetchProduct, loading: productLoading } = useProduct();
const { categories, fetchCategories } = useProducts();
const { createProduct, updateProduct, errors, loading: actionLoading } = useProductActions();

interface ProductForm {
    name: string;
    category_id: number | null | undefined;
    price: number | string;
    description: string;
}

const form = reactive<ProductForm>({
    name: '',
    category_id: null,
    price: 0,
    description: '',
});

const loading = ref(false);
const isEdit = !!props.id;
const isProcessing = computed(() => productLoading.value || actionLoading.value);

onMounted(async () => {
    await fetchCategories();
    if (isEdit && props.id) {
        await fetchProduct(props.id);
       if (product.value?.attributes) {
            const attrs = product.value.attributes;
            form.name = attrs.name ?? '';
            form.category_id = attrs.category?.id;
            form.price = attrs.price ?? 0;
            form.description = attrs.description ?? '';
        }
    }
});

const submit = async () => {
    const payload = { 
        ...form,
        price: typeof form.price === 'string' 
            ? parseFloat(form.price.replace(',', '.')) 
            : form.price
    };
    try {
        if (isEdit) {
            await updateProduct(props.id, payload);
        } else {
            await createProduct(payload);
        }
        window.location.href = '/admin/products';
    } catch (e) {
    }
};
</script>

<template>
    <Head :title="isEdit ? 'Редактировать товар' : 'Новый товар'" />

    <div class="max-w-3xl mx-auto p-10 font-sans text-slate-800">
        <Link href="/admin/products" class="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 mb-6 font-semibold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад к списку
        </Link>

        <h1 class="text-4xl font-extrabold text-slate-900 mb-8">
            {{ isEdit ? 'Редактирование товара' : 'Добавление нового товара' }}
        </h1>

        <div v-if="productLoading" class="flex flex-col items-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-200">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
            <p>Загрузка данных товара...</p>
        </div>

        <form v-else @submit.prevent="submit" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-8 space-y-6">
                
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-bold text-slate-600 uppercase tracking-wider">Название товара</label>
                    <input 
                        v-model="form.name"
                        type="text" 
                        class="w-full bg-slate-50 border text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 block p-3 outline-none transition-all"
                        :class="errors?.name ? 'border-rose-500' : 'border-slate-300'"
                    >
                    <p v-if="errors?.name" class="text-xs text-rose-500 font-medium">{{ errors.name[0] }}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-bold text-slate-600 uppercase tracking-wider">Категория</label>
                        <select 
                            v-model="form.category_id"
                            class="w-full bg-slate-50 border text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 block p-3 outline-none transition-all"
                            :class="errors?.category_id ? 'border-rose-500' : 'border-slate-300'"
                        >
                            <option value="" disabled>Выберите категорию</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                        </select>
                        <p v-if="errors?.category_id" class="text-xs text-rose-500 font-medium">{{ errors.category_id[0] }}</p>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-bold text-slate-600 uppercase tracking-wider">Цена</label>
                        <input 
                            v-model.number="form.price"
                            type="number" 
                            step="any"
                            class="w-full bg-slate-50 border text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 block p-3 outline-none transition-all"
                            :class="errors?.price ? 'border-rose-500' : 'border-slate-300'"
                        >
                        <p v-if="errors?.price" class="text-xs text-rose-500 font-medium">{{ errors.price[0] }}</p>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-bold text-slate-600 uppercase tracking-wider">Описание</label>
                    <textarea 
                        v-model="form.description"
                        rows="4"
                        class="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 block p-3 outline-none transition-all resize-none"
                    ></textarea>
                </div>
            </div>

            <div class="bg-slate-50 p-8 border-t border-slate-200 flex justify-end">
                <button 
                    type="submit" 
                    :disabled="isProcessing"
                    class="px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:bg-slate-400 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                >
                    <span v-if="actionLoading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    {{ isEdit ? 'Сохранить изменения' : 'Создать товар' }}
                </button>
            </div>
        </form>
    </div>
</template>