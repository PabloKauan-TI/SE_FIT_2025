<script setup>
import AppTopbar from '@/layout/AppTopbar.vue';
import UserService from '@/service/UserService.js';
import { Toolbar } from 'primevue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

import Button from 'primevue/button';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Skeleton from 'primevue/skeleton';
import Toast from 'primevue/toast';

const dt = ref();
const users = ref();
const selectedUsers = ref([]);
const confirm = useConfirm();
const submitted = ref(false);
const userDialog = ref(false);
const user = ref({});
const isLoading = ref(false);
const error = ref(null);
const toast = useToast();
const isSaving = ref(false);

onMounted(() => {
    fetchUsers();
});

function openNew() {
    user.value = {};
    submitted.value = false;
    userDialog.value = true;
}

function hideDialog() {
    userDialog.value = false;
    submitted.value = false;
}

function exportCSV() {
    dt.value.exportCSV();
}

const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

const fetchUsers = async () => {
    isLoading.value = true;
    error.value = null;
    try {
        const response = await UserService.getAll();
        users.value = response.data;
    } catch (err) {
        console.error('Falha ao buscar usuários:', err);
        error.value = 'Não foi possível carregar a lista de usuários.';
    } finally {
        isLoading.value = false;
    }
};

const saveUser = async () => {
    submitted.value = true;
    if (!user.value.name || !user.value.email) {
        return;
    }

    try {
        if (user.value.id) {
            const response = await UserService.update(user.value.id, user.value);
            const index = users.value.findIndex((u) => u.id === user.value.id);
            users.value[index] = response.data;
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado!', life: 3000 });
        } else {
            const response = await UserService.create(user.value);
            users.value.push(response.data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário criado!', life: 3000 });
        }
        userDialog.value = false;
        user.value = {};
    } catch (err) {
        console.error('Erro ao salvar usuário:', err);
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível salvar o usuário.', life: 3000 });
    }
};

const confirmDeleteSelected = () => {
    if (!selectedUsers.value || !selectedUsers.value.length) {
        return;
    }

    confirm.require({
        message: 'Você tem certeza que quer deletar os usuários selecionados?',
        header: 'Confirmar Exclusão',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-danger',
        acceptLabel: 'Deletar',
        accept: async () => {
            try {
                const deletePromises = selectedUsers.value.map((user) => UserService.delete(user.id));

                await Promise.all(deletePromises);

                const selectedIds = selectedUsers.value.map((u) => u.id);
                users.value = users.value.filter((user) => !selectedIds.includes(user.id));

                selectedUsers.value = [];

                toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Usuários deletados com sucesso!',
                    life: 3000
                });
            } catch (error) {
                console.error('Erro ao deletar usuários:', error);
                toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível deletar os usuários. Tente novamente.',
                    life: 3000
                });
            }
        },
        reject: () => {
            toast.add({ severity: 'info', summary: 'Cancelado', detail: 'A exclusão foi cancelada.', life: 3000 });
        }
    });
};
</script>

<template>
    <AppTopbar />
    <Toast />
    <ConfirmDialog />
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedUsers || !selectedUsers.length" />
            </template>

            <template #end>
                <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
            </template>
        </Toolbar>

        <div v-if="isLoading" class="space-y-3">
            <div v-for="n in 10" :key="n" class="flex gap-4 items-center">
                <Skeleton class="w-8 h-8 rounded" />
                <!-- checkbox -->
                <Skeleton class="flex-1 h-6" />
                <Skeleton class="w-32 h-6" />
                <Skeleton class="w-32 h-6" />
                <Skeleton class="w-32 h-6" />
                <Skeleton class="w-32 h-6" />
                <Skeleton class="w-24 h-8 rounded" />
            </div>
        </div>

        <DataTable
            v-else
            ref="dt"
            :value="users"
            selectionMode="checkbox"
            :selection="selectedUsers"
            @selection-change="(e) => (selectedUsers = e.value)"
            dataKey="id"
            paginator
            :rows="10"
            :rowsPerPageOptions="[5, 10, 25]"
            class="datatable-responsive"
            :paginatorTemplate="'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'"
            :currentPageReportTemplate="'Showing {first} to {last} of {totalRecords} users'"
            :filters="filters"
            :globalFilterFields="['name', 'email', 'escola', 'indentifield']"
        >
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Gerenciar usuários</h4>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText placeholder="Search..." />
                    </IconField>
                </div>
            </template>

            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            <Column field="code" header="Code" sortable style="min-width: 12rem"></Column>
            <Column field="name" header="Nome" sortable style="min-width: 16rem"></Column>
            <Column field="escola" header="Escola" sortable style="min-width: 14rem"></Column>
            <Column field="indentifield" header="Identificação" sortable style="min-width: 14rem"></Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="userDialog" :style="{ width: '450px' }" header="Cadastro" :modal="true">
        <div class="flex flex-col gap-6">
            <div>
                <label for="name" class="block font-bold mb-3">Nome</label>
                <InputText id="name" v-model.trim="user.name" :required="true" autofocus :invalid="submitted && !user.name" fluid />
                <small v-if="submitted && !user.name" class="text-red-500">Name is required.</small>
            </div>
            <div>
                <label for="email" class="block font-bold mb-3">E-mail</label>
                <InputText id="email" v-model="user.email" :required="true" rows="3" cols="20" fluid />
            </div>
            <div>
                <label for="escola" class="block font-bold mb-3">Escola</label>
                <InputText id="escola" v-model="user.escola" :required="true" rows="3" cols="20" fluid />
            </div>
            <div>
                <label for="indentifield" class="block font-bold mb-3">Identificação</label>
                <InputText id="indentifield" v-model="user.indentifield" :required="true" rows="3" cols="20" fluid />
            </div>
            <div>
                <label for="password" class="block font-bold mb-3">Senha</label>
                <Password id="password" type="password" :required="true" :toggleMask="true" class="mb-4" fluid :feedback="false" v-model="user.password" />
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" @click="saveUser" :loading="isSaving" />
        </template>
    </Dialog>
</template>
