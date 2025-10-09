<script setup>
import AppTopbar from '@/layout/AppTopbar.vue';
import EventService from '@/service/EventService.js';
import { Skeleton } from 'primevue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

// estado
const dt = ref(null);
const events = ref([]);
const isLoading = ref(false);
const error = ref(null);

const eventDialog = ref(false);

// form local (usado pelo Dialog)
const form = ref({
    id: null,
    nome: '',
    palestrante: '',
    data: '',
    time: '',
    location: '',
    limite: '',
    description: '',
    imagem: null,
    imagePreview: ''
});

const errors = ref({});
const fileInput = ref(null);
const search = ref('');
const toast = useToast();
const confirm = useConfirm();

// busca inicial
onMounted(() => {
    fetchEvents();
});

const fetchEvents = async () => {
    isLoading.value = true;
    error.value = null;
    try {
        const response = await EventService.getAll();
        const eventList = response.data ?? response;

        // Garante que a lista não tenha itens nulos ou indefinidos
        if (Array.isArray(eventList)) {
            events.value = eventList.filter((event) => event);
        } else {
            events.value = [];
        }
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

    form.value.imagem = file;
    form.value.imagePreview = URL.createObjectURL(file);
}

function removeImage() {
    form.value.imagem = null;
    form.value.imagePreview = '';
    if (fileInput.value) fileInput.value.value = null;
}

function onEdit(evt) {
    // preenche o form com os dados do evento
    form.value.id = evt.id ?? null;
    form.value.nome = evt.nome ?? '';
    form.value.palestrante = evt.palestrante ?? '';
    if (evt.data) {
        const d = new Date(evt.data);
        if (!Number.isNaN(d.getTime())) {
            form.value.data = d.toISOString().split('T')[0];
            form.value.time = d.toTimeString().split(' ')[0].substring(0, 5);
        } else {
            form.value.data = evt.data;
            form.value.time = evt.time ?? '';
        }
    }
    form.value.limite = evt.limite ?? '';
    form.value.location = evt.location ?? '';
    form.value.description = evt.description ?? '';
    form.value.imagem = null;
    form.value.imagePreview = evt.imagem ?? '';
    errors.value = {};
    eventDialog.value = true;
}

function confirmDeleteEvent(eventToDelete) {
    confirm.require({
        message: `Você tem certeza que quer deletar o evento "${eventToDelete.nome}"?`,
        header: 'Confirmação de Exclusão',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        acceptLabel: 'Deletar',
        rejectLabel: 'Cancelar',
        accept: async () => {
            try {
                await EventService.destroy(eventToDelete.id);
                events.value = events.value.filter((val) => val.id !== eventToDelete.id);
                toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Evento deletado!', life: 3000 });
            } catch (err) {
                console.error('Falha ao deletar evento:', err);
                toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível deletar o evento.', life: 3000 });
            }
        }
    });
}

function validateForm() {
    errors.value = {};
    if (!form.value.nome) errors.value.nome = 'Nome é obrigatório';
    if (!form.value.data) errors.value.data = 'Data é obrigatória';
    if (!form.value.time) errors.value.time = 'Horário é obrigatório';
    return Object.keys(errors.value).length === 0;
}

async function submitForm() {
    if (!validateForm()) {
        toast.add({ severity: 'warn', summary: 'Aviso', detail: 'Preencha os campos obrigatórios.', life: 3000 });
        return;
    }

    const payload = new FormData();

    // Formata a data de 'YYYY-MM-DD' para 'DD/MM/YYYY'
    const dataFormatada = form.value.data.split('-').reverse().join('/');
    const dataCompleta = `${dataFormatada} ${form.value.time}`;

    // Adiciona os campos ao payload no formato correto
    payload.append('nome', form.value.nome);
    payload.append('palestrante', form.value.palestrante);
    payload.append('data', dataCompleta);
    payload.append('limite', form.value.limite);
    payload.append('location', form.value.location);
    payload.append('description', form.value.description);

    if (form.value.imagem instanceof File) {
        payload.append('imagem', form.value.imagem);
    }

    if (form.value.id) {
        payload.append('_method', 'PUT');
    }

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
        let detail = 'Falha ao salvar.';
        if (err.response?.data?.errors) {
            const errors = err.response.data.errors;
            const firstErrorKey = Object.keys(errors)[0];
            detail = errors[firstErrorKey][0];
        } else if (err.response?.data?.message) {
            detail = err.response.data.message;
        }
        toast.add({ severity: 'error', summary: 'Erro de Validação', detail: detail, life: 4000 });
    }
}

function onCancel() {
    eventDialog.value = false;
    resetForm();
}

function resetForm() {
    form.value = {
        id: null,
        nome: '',
        palestrante: '',
        data: '',
        time: '',
        location: '',
        description: '',
        imagem: null,
        imagePreview: ''
    };
    errors.value = {};
    if (fileInput.value) fileInput.value.value = null;
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
    events.value = (events.value.valueRaw ?? events.value).filter((e) => (e.nome ?? '').toLowerCase().includes(q) || (e.location ?? '').toLowerCase().includes(q));
}
</script>

<template>
    <ConfirmDialog />
    <AppTopbar />

    <div class="card">
        <Toast />

        <Toolbar class="mb-6">
            <template #start>
                <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
            </template>
            <template #end>
                <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV" />
            </template>
        </Toolbar>
        <div v-if="isLoading" class="space-y-3">
            <div v-for="n in 10" :key="n" class="flex gap-4 items-center">
                <Skeleton class="w-8 h-8 rounded" /><!-- checkbox -->
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
            :value="events"
            dataKey="id"
            paginator
            :rows="10"
            :rowsPerPageOptions="[5, 10, 25]"
            class="datatable-responsive"
            :paginatorTemplate="'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'"
            :currentPageReportTemplate="'Mostrando {first} a {last} de {totalRecords} eventos'"
            responsiveLayout="scroll"
        >
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Gerenciar eventos</h4>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-search" style="font-size: 1.1rem"></i>
                        <InputText v-model="search" placeholder="Buscar..." @input="onSearchInput" />
                    </div>
                </div>
            </template>

            <Column field="nome" header="Nome" sortable style="min-width: 16rem" />
            <Column field="palestrante" header="Palestrante" sortable style="min-width: 12rem" />
            <Column field="data" header="Data" sortable style="min-width: 12rem">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.data) }}
                </template>
            </Column>
            <Column field="location" header="Local" sortable style="min-width: 14rem" />
            <Column field="limite" header="Limite" sortable style="min-width: 8rem" />
            <Column header="Ações" style="min-width: 14rem" :exportable="false">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2" @click="onEdit(slotProps.data)" />
                    <Button icon="pi pi-trash" variant="outlined" rounded severity="danger" @click="confirmDeleteEvent(slotProps.data)" />
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
                        <InputText v-model.trim="form.nome" placeholder="Ex: Workshop de Tecnologia" class="w-full" :class="{ 'p-invalid': errors.nome }" />
                        <small v-if="errors.nome" class="p-error">{{ errors.nome }}</small>
                    </div>

                    <!-- Palestrante -->
                    <div class="col-12 md:col-6">
                        <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                            <i class="pi pi-user text-gray-600"></i>
                            Palestrante
                        </label>
                        <InputText v-model.trim="form.palestrante" placeholder="Ex: Nome do Palestrante" class="w-full" />
                    </div>

                    <!-- Data -->
                    <div class="col-6 md:col-3">
                        <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                            <i class="pi pi-calendar text-gray-600"></i>
                            Data
                        </label>
                        <InputText type="date" v-model="form.data" class="w-full" :class="{ 'p-invalid': errors.data }" />
                        <small v-if="errors.data" class="p-error">{{ errors.data }}</small>
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

                    <div class="col-12">
                        <label class="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                            <i class="pi pi-users text-gray-600"></i>
                            limite
                        </label>
                        <InputText v-model.trim="form.limite" class="w-full" />
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
                        <input type="file" ref="fileInput" @change="handleFileUpload" accept="imagem/*" class="hidden" />

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

<style scoped>
.event-registration-container .p-invalid {
    border-color: var(--red-500);
}
.preview-image {
    display: block;
}
</style>
