<script setup>
import AppTopbar from '@/layout/AppTopbar.vue';
import UserService from '@/service/UserService.js';
import { Toolbar } from 'primevue';
import { onMounted, ref } from 'vue';

const dt = ref();
const users = ref();
const submitted = ref(false);
const userDialog = ref(false);
const user = ref({});
const isLoading = ref(false);
const error = ref(null);

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
</script>

<template>
    <FloatingConfigurator />
    <AppTopbar />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                :value="users"
                selectionMode="checkbox"
                :selection="selectedUsers"
                @selection-change="(e) => (selectedUsers = e.value)"
                dataKey="code"
                paginator
                :rows="10"
                :rowsPerPageOptions="[5, 10, 25]"
                class="datatable-responsive"
                :paginatorTemplate="'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'"
                :currentPageReportTemplate="'Showing {first} to {last} of {totalRecords} users'"
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
    </div>

    <Dialog v-model:visible="userDialog" :style="{ width: '450px' }" header="Detalhes do Usuário" :modal="true">
        <div class="flex flex-col gap-6">
            <div>
                <label for="name" class="block font-bold mb-3">Nome</label>
                <InputText id="name" v-model.trim="user.name" required="true" autofocus :invalid="submitted && !user.name" fluid />
                <small v-if="submitted && !user.name" class="text-red-500">Name is required.</small>
            </div>
            <div>
                <label for="email" class="block font-bold mb-3">E-mail</label>
                <InputText id="email" v-model="user.email" required="true" rows="3" cols="20" fluid />
            </div>
            <div>
                <label for="escola" class="block font-bold mb-3">Escola</label>
                <InputText id="escola" v-model="user.escola" required="true" rows="3" cols="20" fluid />
            </div>
            <div>
                <label for="indentifield" class="block font-bold mb-3">Identificação</label>
                <InputText id="indentifield" v-model="user.indentifield" required="true" rows="3" cols="20" fluid />
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" @click="saveProduct" />
        </template>
    </Dialog>
</template>
