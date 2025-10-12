import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/eventos',
            component: AppLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/pages/gerenciar-usuario',
                    name: 'gerenciar-usuario',
                    component: () => import('@/views/pages/GerenciarUsuario.vue')
                },
                {
                    path: '/pages/certificados',
                    name: 'certificados',
                    component: () => import('@/views/pages/GerenciarCertificados.vue')
                },
                {
                    path: '/pages/cadastrar-eventos',
                    name: 'CadastroEventos',
                    component: () => import('@/views/pages/CadastroEventos.vue')
                },
                {
                    path: '/pages/gerenciar-eventos',
                    name: 'GerenciarEventos',
                    component: () => import('@/views/pages/GerenciarEventos.vue')
                },
                {
                    path: '/pages/perfil-usuario',
                    name: 'perfil-usuario',
                    component: () => import('@/views/pages/PerfilUsuario.vue')
                },
                {
                    path: '/eventos',
                    name: 'mostrar-eventos',
                    component: () => import('@/views/pages/MostrarEventos.vue')
                },
                {
                    path: '/eventos/:id',
                    name: 'detalhes-evento',
                    component: () => import('@/views/pages/DetalhesEvento.vue')
                },
                // --- ROTA ADICIONADA ---
                {
                    path: '/meus-ingressos',
                    name: 'meus-ingressos',
                    component: () => import('@/views/pages/MeusIngressos.vue')
                },
                {
                    path: '/scan_ticket',
                    component: () => import('@/views/pages/Scan.vue')
                }
            ]
        },
        {
            path: '/pages/cadastrar-usuario',
            name: 'cadastrar-usuario',
            component: () => import('@/views/pages/CadastrarUsuario.vue')
        },
        {
            path: '/',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

export default router;
