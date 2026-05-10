<script setup>
import { onMounted } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import { useProduct } from '@/composables/useProduct';

const props = defineProps({
    id: [String, Number]
});


const { product, loading, error, fetchProduct } = useProduct();

onMounted(() => {
    fetchProduct(props.id);
});
</script>

<template>
    <Head :title="product ? product.attributes.name : 'Загрузка товара...'" />

    <div class="max-w-5xl mx-auto p-6 md:p-12 font-sans text-slate-800">
        <Link href="/" class="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold mb-8 transition-colors group">
            <span class="mr-2 transform group-hover:-translate-x-1 transition-transform">&larr;</span>
            Назад в каталог
        </Link>

        <div v-if="loading" class="flex flex-col items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p class="text-slate-500 animate-pulse">Загружаем детали продукта...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
            <p class="font-bold">{{ error }}</p>
            <Link href="/" class="text-sm underline mt-2 inline-block">Вернуться на главную</Link>
        </div>

        <div v-else-if="product" class="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-w-lg mx-auto">
            <div class="p-8 md:p-10 flex flex-col">
                <div class="mb-6">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-indigo-50 text-indigo-600">
                        {{ product.attributes.category?.name || 'Общее' }}
                    </span>
                </div>

                <h1 class="text-4xl font-black text-slate-900 mb-4 leading-tight tracking-tight">
                    {{ product.attributes.name }}
                </h1>

                <div class="flex items-center gap-3 mb-10 pb-6 border-b border-slate-50">
                    <span class="text-4xl font-black text-indigo-600 tracking-tighter">
                        {{ product.attributes.price.toLocaleString() }}
                    </span>
                </div>

                <div class="space-y-3 mb-12">
                    <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Описание товара</h3>
                    <p class="text-slate-600 text-lg leading-relaxed italic">
                        «{{ product.attributes.description || 'Описание временно отсутствует.' }}»
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>