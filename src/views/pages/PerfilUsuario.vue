<script setup>
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

import AppConfigurator from '@/layout/AppConfigurator.vue';
import UserService from '@/service/UserService';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Card from 'primevue/card';
import ConfirmDialog from 'primevue/confirmdialog';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Toast from 'primevue/toast';

const toast = useToast();
const confirm = useConfirm();

const user = ref({});
const error = ref(null);

const userInitial = computed(() => user.value?.name?.charAt(0).toUpperCase() || '?');
const colors = ['#4CAF50', '#E91E63', '#9C27B0', '#2196F3', '#FF5722', '#FFC107'];
const getColorForName = (name) => {
    if (!name) return colors[0];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
};

const isEditing = ref(false);
const isLoading = ref(false);
const isSaving = ref(false);
const editableUser = ref({});
const passwordFields = ref({
    current_password: '',
    password: '',
    password_confirmation: ''
});

const fetchPerfil = async () => {
    isLoading.value = true;
    error.value = null;
    try {
        const response = await UserService.perfil();
        user.value = response.data;
    } catch (err) {
        console.error('Falha ao buscar perfil:', err);
        error.value = 'Não foi possível carregar o perfil.';
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchPerfil();
});

const startEditing = () => {
    editableUser.value = { ...user.value };
    isEditing.value = true;
};

const cancelEditing = () => {
    confirm.require({
        message: 'Você tem certeza que quer descartar as alterações?',
        header: 'Descartar Alterações',
        icon: 'pi pi-info-circle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            isEditing.value = false;
        }
    });
};

const saveProfile = () => {
    isSaving.value = true;
    setTimeout(() => {
        user.value = { ...editableUser.value };
        isSaving.value = false;
        isEditing.value = false;
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Perfil atualizado com sucesso!', life: 3000 });
    }, 1000);
};

const changePassword = () => {
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Senha alterada!', life: 3000 });
};
</script>

<template>
    <Toast />
    <ConfirmDialog />
    <AppConfigurator />
    <div class="p-4 md:p-6 lg:p-8">
        <div class="w-full lg:w-8/12 xl:w-7/12 mx-auto">
            <header class="mb-6">
                <h1 class="text-3xl font-bold text-surface-800 dark:text-surface-0">Configurações da Conta</h1>
                <p class="text-surface-500 dark:text-surface-400">Gerencie suas informações pessoais e de segurança.</p>
            </header>

            <Card v-if="isLoading"> </Card>

            <Card v-else>
                <template #content>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <Avatar :label="userInitial" :style="{ backgroundColor: getColorForName(user.name), color: '#ffffff' }" size="xlarge" shape="circle" class="w-20 h-20 text-4xl mr-5" />
                            <div>
                                <h2 class="text-2xl font-bold m-0">{{ user.name }}</h2>
                                <p class="text-surface-500 dark:text-surface-400 m-0 mt-1">{{ user.email }}</p>
                            </div>
                        </div>
                        <Button v-if="!isEditing" label="Editar" icon="pi pi-user-edit" @click="startEditing" class="p-button-text" />
                    </div>

                    <Divider class="my-6" />

                    <div v-if="!isEditing" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div class="field">
                            <label class="block text-sm font-medium text-surface-500 dark:text-surface-400 mb-2">Nome</label>
                            <span class="text-lg text-surface-800 dark:text-surface-0">{{ user.name }}</span>
                        </div>
                        <div class="field">
                            <label class="block text-sm font-medium text-surface-500 dark:text-surface-400 mb-2">Email</label>
                            <span class="text-lg text-surface-800 dark:text-surface-0">{{ user.email }}</span>
                        </div>
                        <div class="field">
                            <label class="block text-sm font-medium text-surface-500 dark:text-surface-400 mb-2">Escola</label>
                            <span class="text-lg text-surface-800 dark:text-surface-0">{{ user.escola }}</span>
                        </div>
                        <div class="field">
                            <label class="block text-sm font-medium text-surface-500 dark:text-surface-400 mb-2">Indentificador</label>
                            <span class="text-lg text-surface-800 dark:text-surface-0">{{ user.indentifield }}</span>
                        </div>
                    </div>

                    <div v-else>
                        <h3 class="text-xl font-semibold mb-6">Editar Informações</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div class="field">
                                <label for="name" class="font-semibold">Nome</label>
                                <InputText id="name" v-model="editableUser.name" class="w-full mt-2" />
                            </div>
                            <div class="field">
                                <label for="email" class="font-semibold">Email</label>
                                <InputText id="email" v-model="editableUser.email" class="w-full mt-2" />
                            </div>
                            <div class="field">
                                <label for="escola" class="font-semibold">Escola</label>
                                <InputText id="escola" v-model="editableUser.escola" class="w-full mt-2" />
                            </div>
                            <div class="field">
                                <label for="indentifield" class="font-semibold">Indentificador</label>
                                <InputText id="indentifield" v-model="editableUser.indentifield" class="w-full mt-2" />
                            </div>
                        </div>
                        <div class="flex justify-end mt-6 gap-2">
                            <Button label="Cancelar" severity="secondary" @click="cancelEditing" />
                            <Button label="Salvar Alterações" icon="pi pi-check" @click="saveProfile" :loading="isSaving" />
                        </div>
                    </div>

                    <Divider class="my-8" />
                    <div>
                        <h3 class="text-xl font-semibold mb-6">Alterar Senha</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div class="field col-span-2 md:col-span-1">
                                <label for="current_password">Senha Atual</label>
                                <Password id="current_password" v-model="passwordFields.current_password" class="w-full mt-2" :feedback="false" toggleMask />
                            </div>
                            <div></div>
                            <div class="field col-span-2 md:col-span-1">
                                <label for="password">Nova Senha</label>
                                <Password id="password" v-model="passwordFields.password" class="w-full mt-2" toggleMask />
                            </div>
                            <div class="field col-span-2 md:col-span-1">
                                <label for="password_confirmation">Confirmar Nova Senha</label>
                                <Password id="password_confirmation" v-model="passwordFields.password_confirmation" class="w-full mt-2" :feedback="false" toggleMask />
                            </div>
                        </div>
                        <div class="flex justify-end mt-6">
                            <Button label="Atualizar Senha" @click="changePassword" />
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>
