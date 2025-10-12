<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([]);

const userType = sessionStorage.getItem('type');

const adminMenu = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
    },
    {
        label: 'Tickets',
        items: [
            { label: 'Meus Tickets', icon: 'pi pi-fw pi-ticket', to: { name: 'meus-ingressos' } },
            { label: 'Checar Tickets', icon: 'pi pi-qrcode', to: '/scan_ticket' }
        ]
    },
    {
        label: 'Certificados',
        items: [{ label: 'Ver Certificados', icon: 'pi pi-fw pi-eye', to: '/pages/certificados' }]
    },
    {
        label: 'Users',
        items: [{ label: 'Gerenciar', icon: 'pi pi-fw pi-users', to: '/pages/gerenciar-usuario' }]
    },
    {
        label: 'Eventos',
        items: [
            { label: 'Ver Eventos', icon: 'pi pi-fw pi-eye', to: { name: 'mostrar-eventos' } },
            { label: 'Gerenciar', icon: 'pi pi-fw pi-calendar', to: '/pages/gerenciar-eventos' }
        ]
    }
];

const userMenu = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
    },
    {
        label: 'Eventos',
        items: [{ label: 'Ver Eventos', icon: 'pi pi-fw pi-eye', to: { name: 'mostrar-eventos' } }]
    },
    {
        label: 'Tickets',
        items: [{ label: 'Meus Tickets', icon: 'pi pi-fw pi-ticket', to: { name: 'meus-ingressos' } }]
    },
    {
        label: 'Certificados',
        items: [{ label: 'Ver Certificados', icon: 'pi pi-fw pi-eye', to: '/pages/certificados' }]
    },
    {
        label: 'Conta',
        items: [{ label: 'Meus Ingressos', icon: 'pi pi-fw pi-ticket', to: { name: 'meus-ingressos' } }]
    }
];

if (userType === 'admin') {
    model.value = adminMenu;
} else if (userType === 'user' || userType) {
    model.value = userMenu;
} else {
}
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item.label || i">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>
