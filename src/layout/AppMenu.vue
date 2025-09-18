<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Users',
        items: [
            { label: 'Gerenciar', icon: 'pi pi-fw pi-users', to: '/pages/gerenciar-usuario' },
            { label: 'Cadastrar', icon: 'pi pi-fw pi-user-plus', to: '/pages/cadastrar-usuario' }
        ]
    },
    {
        label: 'Eventos',
        items: [
            { label: 'Gerenciar', icon: 'pi pi-fw pi-calendar', to: '/pages/GerenciarEventos' },
            { label: 'Cadastrar', icon: 'pi pi-fw pi-calendar-plus', to: '/pages/CadastrarEventos' }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
