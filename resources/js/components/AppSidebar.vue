<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { computed } from 'vue';
import { LayoutGrid, LogIn, LogOut } from 'lucide-vue-next';
import NavMain from '@/components/NavMain.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarFooter
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const { isAuthenticated, logout } = useAuth();

const mainNavItems = computed((): NavItem[] => {
    const items: NavItem[] = [];
    if (isAuthenticated.value) {
        items.push({
            title: 'Управление товарами',
            href: '/admin/products',
            icon: LayoutGrid,
        });
    } 
    // Добавляем "Войти", только если пользователь НЕ авторизован
    if (!isAuthenticated.value) {
        items.push({
            title: 'Войти',
            href: '/login',
            icon: LogIn,
        });
    } 
    return items;
});

</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
            <SidebarMenu>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMain :items="mainNavItems" />
        </SidebarContent>
        <SidebarFooter v-if="isAuthenticated">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton 
                        @click="logout" 
                        class="flex items-center gap-2 cursor-pointer"
                        tooltip="Выйти"
                    >
                        <LogOut class="h-4 w-4" />
                        
                        <span class="group-data-[collapsible=icon]:hidden">Выйти</span>
                        
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
