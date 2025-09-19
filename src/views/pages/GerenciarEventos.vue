<template>
    <AppTopbar />

    <div class="card">
        <Toast />

        <Toolbar class="mb-6">
            <template #start>
                <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedEvents || !selectedEvents.length" />
            </template>
            <template #end>
                <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV" />
            </template>
        </Toolbar>

        <DataTable
            ref="dt"
            :value="events"
            v-model:selection="selectedEvents"
            dataKey="id"
            paginator
            :rows="10"
            :rowsPerPageOptions="[5, 10, 25]"
            class="datatable-responsive"
            :paginatorTemplate="'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'"
            :currentPageReportTemplate="'Showing {first} to {last} of {totalRecords} events'"
            :loading="isLoading"
            responsiveLayout="scroll"
        >
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Gerenciar eventos</h4>

                    <div class="flex items-center gap-2">
                        <i class="pi pi-search" style="font-size: 1.1rem"></i>
                        <InputText v-model="search" placeholder="Search..." @input="onSearchInput" />
                    </div>
                </div>
            </template>

            <Column selectionMode="multiple" style="width: 3rem" :exportable="false" />
            <Column field="id" header="ID" sortable style="min-width: 8rem" />
            <Column field="name" header="Nome" sortable style="min-width: 16rem" />
            <Column field="date" header="Data" sortable style="min-width: 12rem">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.date) }}
                </template>
            </Column>
            <Column field="location" header="Local" sortable style="min-width: 14rem" />
            <Column header="Ações" style="min-width: 14rem" :exportable="false">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="onEdit(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="eventDialog" :style="{ width: '650px' }" header="Cadastro de Evento" :modal="true" class="rounded-2xl shadow-lg">
        <div class="event-registration-container">
            <!-- Form -->
            <form @submit.prevent="submitForm" class="space-y-5">
                <div class="grid grid-nogutter gap-4">
                    <!-- Nome -->
                    <div class="col-12 md:col-6">
                        <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                            <i class="pi pi-tag text-gray-600"></i>
                            Nome do Evento
                        </label>
                        <InputText v-model.trim="form.name" placeholder="Ex: Workshop de Tecnologia" class="w-full" :class="{ 'p-invalid': errors.name }" />
                        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
                    </div>

                    <!-- Data -->
                    <div class="col-6 md:col-3">
                        <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                            <i class="pi pi-calendar text-gray-600"></i>
                            Data
                        </label>
                        <InputText type="date" v-model="form.date" class="w-full" :class="{ 'p-invalid': errors.date }" />
                        <small v-if="errors.date" class="p-error">{{ errors.date }}</small>
                    </div>

                    <!-- Hora -->
                    <div class="col-6 md:col-3">
                        <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                            <i class="pi pi-clock text-gray-600"></i>
                            Horário
                        </label>
                        <InputText type="time" v-model="form.time" class="w-full" :class="{ 'p-invalid': errors.time }" />
                        <small v-if="errors.time" class="p-error">{{ errors.time }}</small>
                    </div>

                    <!-- Local -->
                    <div class="col-12">
                        <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                            <i class="pi pi-map-marker text-gray-600"></i>
                            Local
                        </label>
                        <InputText v-model.trim="form.location" placeholder="Ex: Auditório Central" class="w-full" />
                    </div>

                    <!-- Descrição -->
                    <div class="col-12">
                        <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                            <i class="pi pi-align-left text-gray-600"></i>
                            Descrição
                        </label>
                        <Textarea v-model.trim="form.description" rows="4" placeholder="Escreva uma breve descrição do evento..." class="w-full" />
                    </div>

                    <!-- Upload de Imagem -->
                    <div class="col-12">
                        <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                            <i class="pi pi-image text-gray-600"></i>
                            Imagem do Evento
                        </label>
                        <div class="p-4 border-2 border-dashed border-surface-400 rounded-lg text-center hover:bg-gray-50 transition cursor-pointer" @click="triggerFileInput">
                            <i class="pi pi-cloud-upload text-4xl text-gray-500"></i>
                            <p class="mt-2 text-gray-600 text-sm">Clique para enviar uma imagem (JPG/PNG, até 5MB)</p>
                        </div>
                        <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" class="hidden" />

                        <div v-if="form.imagePreview" class="mt-3 text-center">
                            <img :src="form.imagePreview" class="max-h-48 mx-auto rounded-md shadow-md object-contain" />
                            <div class="mt-2">
                                <Button label="Remover Imagem" icon="pi pi-times" class="p-button-sm p-button-danger" @click="removeImage" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ações -->
                <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button label="Cancelar" icon="pi pi-times" class="p-button-text p-button-plain" @click="onCancel" />
                    <Button label="Salvar Evento" icon="pi pi-check" type="submit" class="p-button-success" />
                </div>
            </form>
        </div>
    </Dialog>
</template>

<script setup>
import AppTopbar from '@/layout/AppTopbar.vue';
import EventService from '@/service/EventService.js';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

// estado
const dt = ref(null);
const events = ref([]);
const selectedEvents = ref([]);
const isLoading = ref(false);
const error = ref(null);

const eventDialog = ref(false);

// form local (usado pelo Dialog)
const form = ref({
    id: null,
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: null,
    imagePreview: ''
});

const errors = ref({});
const fileInput = ref(null);
const search = ref('');
const toast = useToast();

// busca inicial
onMounted(() => {
    fetchEvents();
});

const fetchEvents = async () => {
    isLoading.value = true;
    error.value = null;
    try {
        const response = await EventService.getAll();
        events.value = response.data ?? response;
    } catch (err) {
        console.error('Falha ao buscar eventos:', err);
        error.value = 'Não foi possível carregar a lista de eventos.';
        toast.add({ severity: 'error', summary: 'Erro', detail: error.value, life: 3000 });
    } finally {
        isLoading.value = false;
    }
};

function openNew() {
    resetForm();
    eventDialog.value = true;
}

function onEdit(evt) {
    // preenche o form com os dados do evento
    form.value.id = evt.id ?? null;
    form.value.name = evt.name ?? '';
    if (evt.date) {
        const d = new Date(evt.date);
        if (!Number.isNaN(d.getTime())) {
            form.value.date = d.toISOString().split('T')[0];
            form.value.time = d.toTimeString().split(' ')[0].substring(0, 5);
        } else {
            form.value.date = evt.date;
            form.value.time = evt.time ?? '';
        }
    }
    form.value.location = evt.location ?? '';
    form.value.description = evt.description ?? '';
    form.value.image = null;
    form.value.imagePreview = evt.image_url ?? '';
    errors.value = {};
    eventDialog.value = true;
}

function triggerFileInput() {
    fileInput.value && fileInput.value.click();
}

function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // validação tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
        toast.add({ severity: 'warn', summary: 'Aviso', detail: 'Imagem muito grande (máx 5MB).', life: 3000 });
        return;
    }

    form.value.image = file;
    form.value.imagePreview = URL.createObjectURL(file);
}

function removeImage() {
    form.value.image = null;
    form.value.imagePreview = '';
    if (fileInput.value) fileInput.value.value = null;
}

function validateForm() {
    errors.value = {};
    if (!form.value.name) errors.value.name = 'Nome é obrigatório';
    if (!form.value.date) errors.value.date = 'Data é obrigatória';
    if (!form.value.time) errors.value.time = 'Horário é obrigatório';
    return Object.keys(errors.value).length === 0;
}

async function submitForm() {
    if (!validateForm()) {
        toast.add({ severity: 'warn', summary: 'Aviso', detail: 'Preencha os campos obrigatórios.', life: 3000 });
        return;
    }

    // monta FormData para enviar imagem caso exista
    const payload = new FormData();
    payload.append('name', form.value.name);
    payload.append('date', `${form.value.date} ${form.value.time}:00`);
    if (form.value.location) payload.append('location', form.value.location);
    if (form.value.description) payload.append('description', form.value.description);
    if (form.value.image instanceof File) payload.append('image', form.value.image);

    try {
        if (form.value.id) {
            await EventService.update(form.value.id, payload);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Evento atualizado', life: 3000 });
        } else {
            await EventService.store(payload);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Evento criado', life: 3000 });
        }
        eventDialog.value = false;
        await fetchEvents();
    } catch (err) {
        console.error('Erro ao salvar evento:', err);
        toast.add({ severity: 'error', summary: 'Erro', detail: err.response?.data?.message || 'Falha ao salvar.', life: 4000 });
    }
}

function onCancel() {
    eventDialog.value = false;
    resetForm();
}

function resetForm() {
    form.value = {
        id: null,
        name: '',
        date: '',
        time: '',
        location: '',
        description: '',
        image: null,
        imagePreview: ''
    };
    errors.value = {};
    if (fileInput.value) fileInput.value.value = null;
}

async function confirmDeleteSelected() {
    if (!selectedEvents.value?.length) return;
    if (!confirm(`Deletar ${selectedEvents.value.length} eventos?`)) return;
    try {
        const promises = selectedEvents.value.map((ev) => EventService.destroy(ev.id));
        await Promise.all(promises);
        events.value = events.value.filter((val) => !selectedEvents.value.some((s) => s.id === val.id));
        selectedEvents.value = [];
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Eventos deletados', life: 3000 });
    } catch (err) {
        console.error('Falha ao deletar selecionados:', err);
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao deletar eventos', life: 3000 });
    }
}

function exportCSV() {
    dt.value && dt.value.exportCSV();
}

function formatDate(value) {
    if (!value) return '';
    try {
        return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
        return value;
    }
}

// (opcional) busca simples por nome — só filtra localmente
function onSearchInput() {
    const q = search.value?.toLowerCase?.() ?? '';
    if (!q) return fetchEvents();
    events.value = (events.valueRaw ?? events.value).filter((e) => (e.name ?? '').toLowerCase().includes(q) || (e.location ?? '').toLowerCase().includes(q));
}
</script>

<style scoped>
.event-registration-container .p-invalid {
    border-color: var(--red-500);
}
.preview-image {
    display: block;
}
</style>
