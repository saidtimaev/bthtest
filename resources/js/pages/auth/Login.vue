<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { reactive } from 'vue'; // Добавляем для сбора данных
import { useAuth } from '@/composables/useAuth'; // Наш новый хук

import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

// Настройка макета для AuthLayout
defineOptions({
    layout: {
        title: 'Вход в аккаунт',
        description: 'Введите вашу почту и пароль для входа',
    },
});

defineProps<{
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}>();

// Данные формы
const credentials = reactive({
    email: '',
    password: '',
    remember: false
});

// Достаем логику из нашего Composable
const { login, loading, error: authError } = useAuth();

const handleSubmit = async () => {
    const success = await login(credentials);
    if (success) {
        window.location.href = '/'; 
    }
};
</script>

<template>
    <Head title="Войти" />

    <div v-if="status" class="mb-4 text-center text-sm font-medium text-green-600">
        {{ status }}
    </div>

    <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
        <div class="grid gap-6">
            
            <div class="grid gap-2">
                <Label for="email">Электронная почта</Label>
                <Input
                    id="email"
                    v-model="credentials.email"
                    type="email"
                    required
                    autofocus
                    autocomplete="username"
                    placeholder="email@example.com"
                />
            </div>

            <div class="grid gap-2">
                <Label for="password">Пароль</Label>
                <PasswordInput
                    id="password"
                    v-model="credentials.password"
                    required
                    placeholder="Password"
                    autocomplete="current-password"
                />
                <InputError v-if="authError" :message="authError" />
            </div>

            <Button
                type="submit"
                class="mt-4 w-full"
                :disabled="loading"
            >
                <Spinner v-if="loading" />
                Войти
            </Button>
        </div>
    </form>
</template>