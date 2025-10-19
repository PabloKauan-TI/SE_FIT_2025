<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { useLayout } from '@/layout/composables/layout';
import userService from '@/service/UserService';
import { useToast } from 'primevue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { isDarkTheme } = useLayout();

const email = ref('');
const password = ref('');
const router = useRouter();
const toast = useToast();

const Login = async () => {
    try {
        const response = await userService.login({
            email: email.value,
            password: password.value
        });

        if (response.data && response.data.token) {
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('type', response.data.user['type']);
            router.push('/eventos');
        } else {
            toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Falha no login, por favor cheque suas credenciais.', life: 3000 });
        }
    } catch (error) {
        // ... (Seu tratamento de erro seguro já está bom aqui)
        console.error('Erro ao fazer login:', error);
        const apiMessage = error.response?.data?.message;

        if (apiMessage) {
            toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Falha no login, por favor cheque suas credenciais.', life: 3000 });
        } else {
            toast.add({ severity: 'error', summary: 'Atenção', detail: 'Falha em se comunicar com servidor.', life: 3000 });
        }
    }
};
</script>

<template>
    <Toast />
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8 flex flex-col items-center justify-center">
                        <img v-if="isDarkTheme" src="/logo_fit_b.svg" class="h-20 w-auto mb-4" />
                        <img v-else src="/logo_fit_p.svg" class="h-20 w-auto mb-4" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to FIT 2K25!</div>
                        <span class="text-muted-color font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false" />

                        <Button label="Sign In" class="w-full" @click="Login" />
                        <p class="mt-4 text-center">
                            Não possui uma conta?
                            <RouterLink to="/pages/cadastrar-usuario" class="text-primary-600 hover:underline font-medium">Cadastre-se</RouterLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
