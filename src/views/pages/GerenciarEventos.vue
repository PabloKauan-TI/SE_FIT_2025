<script setup>
import EventService from '@/service/EventService.js';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

// --- Estado do Componente ---
const toast = useToast();
const dt = ref();
const events = ref([]);
const selectedEvents = ref([]);

const eventDialog = ref(false);
const deleteEventDialog = ref(false);
const deleteEventsDialog = ref(false);

const event = ref({});
const submitted = ref(false);
const isLoading = ref(true);

// --- Ciclo de Vida ---
onMounted(() => {
    fetchEvents();
});

// --- Funções de API ---
const fetchEvents = async () => {
    isLoading.value = true;
    try {
        const response = await EventService.getAll();
        events.value = response.data || response;
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar a lista de eventos.', life: 3000 });
    } finally {
        isLoading.value = false;
    }
};

const saveEvent = async () => {
    submitted.value = true;
    if (!event.value.name || !event.value.date || !event.value.time) {
        toast.add({ severity: 'warn', summary: 'Aviso', detail: 'Preencha os campos obrigatórios.', life: 3000 });
        return;
    }

    const formData = new FormData();
    Object.keys(event.value).forEach((key) => {
        if (key === 'image' && event.value.image instanceof File) {
            formData.append('image', event.value.image);
        } else if (event.value[key] !== null && event.value[key] !== undefined) {
            if (key !== 'imagePreview') {
                formData.append(key, event.value[key]);
            }
        }
    });

    if (event.value.date && event.value.time) {
        formData.set('date', `${event.value.date} ${event.value.time}:00`);
    }

    try {
        if (event.value.id) {
            await EventService.update(event.value.id, formData);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Evento atualizado', life: 3000 });
        } else {
            await EventService.store(formData);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Evento criado', life: 3000 });
        }
        hideDialog();
        fetchEvents();
    } catch (err) {
        const errorMessage = err.response?.data?.message || 'Falha ao salvar o evento.';
        toast.add({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 3000 });
    }
};

const deleteEvent = async () => {
    try {
        await EventService.destroy(event.value.id);
        events.value = events.value.filter((val) => val.id !== event.value.id);
        deleteEventDialog.value = false;
        event.value = {};
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Evento deletado', life: 3000 });
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível deletar o evento.', life: 3000 });
    }
};

const deleteSelectedEvents = async () => {
    try {
        const promises = selectedEvents.value.map((eventToDelete) => EventService.destroy(eventToDelete.id));
        await Promise.all(promises);

        events.value = events.value.filter((val) => !selectedEvents.value.some((selected) => selected.id === val.id));
        deleteEventsDialog.value = false;
        selectedEvents.value = [];
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Eventos deletados', life: 3000 });
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível deletar os eventos selecionados.', life: 3000 });
    }
};

// --- Funções de UI ---
const openNew = () => {
    event.value = {};
    submitted.value = false;
    eventDialog.value = true;
};

const editEvent = (eventData) => {
    event.value = { ...eventData };
    if (event.value.date) {
        const dateObj = new Date(event.value.date);
        event.value.date = dateObj.toISOString().split('T')[0];
        event.value.time = dateObj.toTimeString().split(' ')[0].substring(0, 5);
    }
    event.value.imagePreview = event.value.image_url;
    eventDialog.value = true;
};

const confirmDeleteEvent = (eventData) => {
    event.value = eventData;
    deleteEventDialog.value = true;
};

const confirmDeleteSelected = () => {
    deleteEventsDialog.value = true;
};

const hideDialog = () => {
    eventDialog.value = false;
    submitted.value = false;
};

const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        event.value.image = file;
        event.value.imagePreview = URL.createObjectURL(file);
    }
};

const formatDate = (value) => {
    if (value) return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    return '';
};

const exportCSV = () => dt.value.exportCSV();
</script>

<template>
    <div class="card">
        <Toast />

        <DataTable
            ref="dt"
            :value="events"
            v-model:selection="selectedEvents"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 25]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} eventos"
            :loading="isLoading"
            responsiveLayout="scroll"
        >
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Gerenciar Eventos</h4>
                </div>
            </template>

            <Column selectionMode="multiple" style="width: 3rem" />
            <Column field="name" header="Nome" sortable style="min-width: 16rem" />
            <Column field="date" header="Data" sortable style="min-width: 12rem">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.date) }}
                </template>
            </Column>
            <Column field="location" header="Local" sortable style="min-width: 14rem" />
            <Column headerStyle="min-width:10rem;" bodyClass="text-center">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editEvent(slotProps.data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteEvent(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <!-- Modal de Criação/Edição -->
        <Dialog v-model:visible="eventDialog" :style="{ width: '450px' }" header="Detalhes do Evento" :modal="true" class="p-fluid">
            <div class="field">
                <label for="name">Nome</label>
                <InputText id="name" v-model.trim="event.name" required="true" autofocus :class="{ 'p-invalid': submitted && !event.name }" />
                <small class="p-error" v-if="submitted && !event.name">O nome é obrigatório.</small>
            </div>

            <div class="formgrid grid">
                <div class="field col">
                    <label for="date">Data</label>
                    <InputText id="date" type="date" v-model="event.date" :class="{ 'p-invalid': submitted && !event.date }" />
                </div>
                <div class="field col">
                    <label for="time">Horário</label>
                    <InputText id="time" type="time" v-model="event.time" :class="{ 'p-invalid': submitted && !event.time }" />
                </div>
            </div>

            <div class="field">
                <label for="location">Local</label>
                <InputText id="location" v-model="event.location" />
            </div>

            <div class="field">
                <label for="description">Descrição</label>
                <Textarea id="description" v-model="event.description" rows="3" />
            </div>

            <div class="field">
                <label>Imagem do Evento</label>
                <input
                    type="file"
                    @change="handleFileUpload"
                    accept="image/*"
                    class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
                <img v-if="event.imagePreview" :src="event.imagePreview" class="mt-2 w-full border-round" style="max-height: 200px; object-fit: contain" />
            </div>
            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Salvar" icon="pi pi-check" @click="saveEvent" />
            </template>
        </Dialog>

        <!-- Modal de Confirmação de Deleção -->
        <Dialog v-model:visible="deleteEventDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="event"
                    >Tem certeza que deseja deletar <b>{{ event.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" text @click="deleteEventDialog = false" />
                <Button label="Sim" icon="pi pi-check" @click="deleteEvent" />
            </template>
        </Dialog>

        <!-- Modal de Confirmação de Deleção Múltipla -->
        <Dialog v-model:visible="deleteEventsDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>Tem certeza que deseja deletar os eventos selecionados?</span>
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" text @click="deleteEventsDialog = false" />
                <Button label="Sim" icon="pi pi-check" @click="deleteSelectedEvents" />
            </template>
        </Dialog>
    </div>
</template>
