<script setup>
import AppTopbar from '@/layout/AppTopbar.vue';
import UserService from '@/service/UserService.js';
import Toolbar from 'primevue/toolbar';
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
import { useConfirm } from 'primevue/useconfirm';

const dt = ref();
const users = ref([]);
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
    user.value = { type: 'client' };
    submitted.value = false;
    userDialog.value = true;
}

function hideDialog() {
    userDialog.value = false;
    submitted.value = false;
}

function exportCSV() {
    if (dt.value && users.value?.length) dt.value.exportCSV();
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

    if (!user.value.name || !user.value.email) return;

    isSaving.value = true;

    try {
        const payload = { ...user.value };
        if (!payload.password) delete payload.password;

        let response;
        if (user.value.id) {
            response = await UserService.update(user.value.id, payload);
            users.value = users.value.map((u) => (u.id === user.value.id ? response.data : u));
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado!', life: 3000 });
        } else {
            response = await UserService.create(payload);
            users.value.push(response.data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário criado!', life: 3000 });
        }

        userDialog.value = false;
        user.value = {};
    } catch (err) {
        console.error('Erro ao salvar usuário:', err);
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível salvar o usuário.', life: 3000 });
    } finally {
        isSaving.value = false;
    }
};

const deleteUser = async () => {
    try {
        await UserService.delete(user.value.id);
        users.value = users.value.filter((val) => val.id !== user.value.id);
        user.value = {};
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário deletado!', life: 3000 });
    } catch (err) {
        console.error('Erro ao deletar usuário:', err);
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível deletar o usuário.', life: 3000 });
    }
};

const promoverUser = async (userToPromote) => {
    try {
        const id = userToPromote.id;
        await UserService.promover(id);
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário Promovido!', life: 3000 });
        fetchUsers();
    } catch (err) {
        console.error('Erro ao promover usuário:', err);
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível promover o usuário.', life: 3000 });
    }
};

const rebaixarUser = async (userToPromote) => {
    try {
        const id = userToPromote.id;
        await UserService.rebaixar(id);
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário Promovido!', life: 3000 });
        fetchUsers();
    } catch (err) {
        console.error('Erro ao promover usuário:', err);
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível promover o usuário.', life: 3000 });
    }
};

const confirmDeleteUser = (userToDelete) => {
    user.value = userToDelete;
    confirm.require({
        message: 'Você tem certeza que quer deletar este usuário?',
        header: 'Confirmação de Exclusão',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-text p-button-text',
        acceptClass: 'p-button-danger p-button-text',
        acceptLabel: 'Deletar',
        rejectLabel: 'Cancelar',
        accept: () => {
            deleteUser();
        }
    });
};

const confirmRebaixarUser = (userToRebaixar) => {
    const user_r = userToRebaixar;
    confirm.require({
        message: 'Você tem certeza que quer rebaixar este usuário?',
        header: 'Confirmação de Rebaixamento',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-danger p-button-text',
        acceptClass: 'p-button-text p-button-text',
        acceptLabel: 'Rebaixar',
        rejectLabel: 'Cancelar',
        accept: () => {
            rebaixarUser(user_r);
        }
    });
};

const confirmPromoteUser = (userToPromote) => {
    const user_p = userToPromote;
    confirm.require({
        message: 'Você tem certeza que quer promover este usuário?',
        header: 'Confirmação de Promoção',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-danger p-button-text',
        acceptClass: 'p-button-text p-button-text',
        acceptLabel: 'Promover',
        rejectLabel: 'Cancelar',
        accept: () => {
            promoverUser(user_p);
        }
    });
};

function editUser(userToEdit) {
    user.value = { ...userToEdit };
    userDialog.value = true;
}
</script>

<template>
    <AppTopbar />
    <Toast />
    <ConfirmDialog />
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
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
                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                    </IconField>
                </div>
            </template>
            <Column field="name" header="Nome" sortable style="min-width: 16rem"></Column>
            <Column field="email" header="E-mail" sortable style="min-width: 16rem"></Column>
            <Column field="escola" header="Escola" sortable style="min-width: 14rem"></Column>
            <Column field="indentifield" header="Identificação" sortable style="min-width: 14rem"></Column>
            <Column :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <Button v-if="slotProps.data.type == 'client'" icon="pi pi-angle-double-up" variant="outlined" rounded class="mr-2" @click="confirmPromoteUser(slotProps.data)" />
                    <Button v-else icon="pi pi-angle-double-down" variant="outlined" rounded class="mr-2" @click="confirmRebaixarUser(slotProps.data)" />
                    <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2" @click="editUser(slotProps.data)" />
                    <Button icon="pi pi-trash" variant="outlined" rounded severity="danger" @click="confirmDeleteUser(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="userDialog" :style="{ width: '450px' }" :header="user.id ? 'Editar Usuário' : 'Novo Usuário'" :modal="true">
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
            <div v-if="!user.id">
                <label for="password" class="block font-bold mb-3">Senha</label>
                <Password id="password" v-model="user.password" toggleMask fluid :feedback="false" />
            </div>
        </div>

        <template #footer>
            <Button label="Salvar" icon="pi pi-check" @click="saveUser" :loading="isSaving" />
            <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
        </template>
    </Dialog>
</template>
