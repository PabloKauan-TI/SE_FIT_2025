<script setup>
import { useLayout } from '@/layout/composables/layout';
import userService from '@/service/UserService';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Toast from 'primevue/toast';

const router = useRouter();
const toast = useToast();

const { isDarkTheme } = useLayout();

const formData = ref({
    name: '',
    email: '',
    escola: '',
    indentifield: '',
    password: '',
    type: 'client'
});

const isLoading = ref(false);

const register = async () => {
    //validação de campos obrigatórios
    if (!formData.value.name || !formData.value.email || !formData.value.password) {
        toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Nome, e-mail e senha são obrigatórios.', life: 3000 });
        return;
    }

    isLoading.value = true;
    try {
        await userService.create(formData.value);

        toast.add({ severity: 'success', summary: 'Sucesso!', detail: 'Conta criada com sucesso. Por favor, faça o login.', life: 3000 });

        router.push('/pages/login');
    } catch (error) {
        console.error('Erro ao criar conta:', error);
        const errorMessage = error.response?.data?.message || 'Não foi possível criar a conta. Tente novamente.';
        toast.add({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 3000 });
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <Toast />
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div class="w-full bg-surface-0 dark:bg-surface-900 py-5 px-5 sm:px-5" style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8 flex flex-col items-center justify-center">
                        <img v-if="isDarkTheme" src="/logo_fit_b.svg" class="h-20 w-auto mb-4" />
                        <img v-else src="/logo_fit_p.svg" class="h-20 w-auto mb-4" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to FIT 2K25!</div>
                        <span class="text-muted-color font-medium">Cadastre-se para continuar</span>
                    </div>

                    <form @submit.prevent="register" class="flex flex-col gap-6">
                        <div class="field">
                            <label for="name" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Nome</label>
                            <InputText id="name" type="text" v-model="formData.name" />
                        </div>

                        <div class="field">
                            <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <InputText id="email" type="email" v-model="formData.email" />
                        </div>

                        <div class="field">
                            <label for="escola" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Escola</label>
                            <InputText id="escola" type="text" v-model="formData.escola" />
                        </div>

                        <div class="field">
                            <label for="indentifield" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Identificação</label>
                            <InputText id="indentifield" type="text" v-model="formData.indentifield" />
                            <Message size="small" severity="secondary" variant="simple">Se for aluno da UFC, digite sua matrícula. Se for público externo, digite seu CPF.</Message>
                        </div>

                        <div class="field">
                            <label for="senha" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Senha</label>
                            <Password id="senha" type="password" :toggleMask="true" class="mb-4" fluid v-model="formData.password" />
                        </div>
                        <div class="field">
                            <Button type="submit" label="Criar conta" class="w-full mt-4" :loading="isLoading" />
                        </div>
                    </form>

                    <p class="mt-4 text-center">
                        Já possui uma conta?
                        <router-link to="/auth/login" class="text-primary-600 hover:underline font-medium">Entrar</router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
