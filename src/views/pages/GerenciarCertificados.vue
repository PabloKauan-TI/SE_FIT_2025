<script setup>
import AppTopbar from '@/layout/AppTopbar.vue';
import RegEventService from '@/service/RegEvent.js';
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
const Certifields = ref([]);
const selectedCertifields = ref([]);
const confirm = useConfirm();
const submitted = ref(false);
const userDialog = ref(false);
const user = ref({});
const isLoading = ref(false);
const error = ref(null);
const toast = useToast();
const isSaving = ref(false);

onMounted(() => {
    fetchCertifields();
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
    if (dt.value && Certifields.value?.length) dt.value.exportCSV();
}

const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

const fetchCertifields = async () => {
    isLoading.value = true;
    error.value = null;
    try {
        const response = await RegEventService.certificados();
        Certifields.value = response.data;
    } catch (err) {
        error.value = 'Não foi possível carregar a lista de certificados.';
    } finally {
        isLoading.value = false;
    }
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
            :value="Certifields"
            selectionMode="checkbox"
            :selection="selectedCertifields"
            @selection-change="(e) => (selectedCertifields = e.value)"
            dataKey="id"
            paginator
            :rows="10"
            :rowsPerPageOptions="[5, 10, 25]"
            class="datatable-responsive"
            :paginatorTemplate="'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'"
            :currentPageReportTemplate="'Showing {first} to {last} of {totalRecords} Certifields'"
            :filters="filters"
            :globalFilterFields="['evento', 'codigo']"
        >
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Certificados</h4>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                    </IconField>
                </div>
            </template>
            <Column field="evento" header="Evento" sortable style="min-width: 16rem"></Column>
            <Column field="codigo" header="Código" sortable style="min-width: 16rem"></Column>
            <Column :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2" @click="Gerar(slotProps.data)" />
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
