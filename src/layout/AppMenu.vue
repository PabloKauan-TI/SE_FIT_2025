<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Conta',
        items: [{ label: 'Meus Ingressos', icon: 'pi pi-fw pi-ticket', to: { name: 'meus-ingressos' } }]
    },
    {
        label: 'Users',
        items: [{ label: 'Gerenciar', icon: 'pi pi-fw pi-users', to: '/pages/gerenciar-usuario' }]
    },
    {
        label: 'Eventos',
        items: [
            { label: 'Ver Eventos', icon: 'pi pi-fw pi-eye', to: { name: 'mostrar-eventos' } },

            { label: 'Detalhes (Exemplo)', icon: 'pi pi-fw pi-search', to: { name: 'detalhes-evento', params: { id: 1 } } },

            { label: 'Gerenciar', icon: 'pi pi-fw pi-calendar', to: '/pages/gerenciar-eventos' },
            { label: 'Cadastrar', icon: 'pi pi-fw pi-calendar-plus', to: '/pages/cadastrar-eventos' }
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
