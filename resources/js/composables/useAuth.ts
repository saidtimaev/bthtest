import { ref, computed } from 'vue';
import axios from 'axios';

// Состояние выносим за пределы функции, чтобы оно было единым (singleton)
const user = ref(null);
const token = ref<string | null>(null);

// Проверка среды
const isBrowser = typeof window !== 'undefined';

// Безопасная инициализация токена
if (isBrowser) {
    token.value = localStorage.getItem('auth_token');
    if (token.value) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    }
}

export function useAuth() {
    const loading = ref(false);
    const error = ref<string | null>(null);

    const isAuthenticated = computed(() => !!token.value);

    const login = async (credentials: object) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.post('/api/login', credentials);
            const newToken = response.data.token;
            
            token.value = newToken;
            
            if (isBrowser) {
                localStorage.setItem('auth_token', newToken);
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            
            if (response.data.user) {
                user.value = response.data.user;
            }

            return true;
        } catch (e: any) {
            error.value = e.response?.data?.message || 'Неверный логин или пароль';
            return false;
        } finally {
            loading.value = false;
        }
    };

    const logout = () => {
        token.value = null;
        user.value = null;
        
        if (isBrowser) {
            localStorage.removeItem('auth_token');
            // Перенаправление тоже только в браузере
            window.location.href = '/login';
        }
        
        delete axios.defaults.headers.common['Authorization'];
    };

    return {
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        logout
    };
}