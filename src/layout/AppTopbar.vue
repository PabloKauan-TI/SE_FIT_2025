<script setup>
import { useLayout } from '@/layout/composables/layout';
import userService from '@/service/UserService';
import { useRouter } from 'vue-router';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const router = useRouter();

async function logout() {
    try {
        await userService.logout();
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    } finally {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('type');

        router.push('/login');
    }
}

</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img v-if="isDarkTheme" src="/logo_fit_b.svg" class="h-10 w-auto"></img>
                <img v-else src="/logo_fit_p.svg" class="h-10 w-auto"></img>
                <span>Sistema de Eventos</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
            </div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <router-link to="/pages/perfil-usuario" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </router-link>
                    <Button icon="pi pi-sign-out" severity="danger" variant="text" rounded aria-label="logout" @click="logout"/>
                </div>
            </div>
        </div>
    </div>
</template>
