<script setup>
import EventService from '@/service/EventService';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import { onMounted, ref } from 'vue';

const events = ref([]);
const loading = ref(true);
const selectedEvent = ref(null);
const selectedEventVisible = ref(false);

const normalizeEvent = (event) => {
    if (!event) return null;

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    let imageUrl = 'https://primefaces.org/cdn/primevue/images/product/product-placeholder.svg';
    const rawImage = event.imagem || event.image || event.foto || event.imagem_url;

    if (rawImage) {
        if (rawImage.startsWith('http')) {
            imageUrl = rawImage;
        } else {
            imageUrl = `${API_BASE_URL}/storage/${rawImage}`;
        }
    }

    console.log('URL da imagem gerada:', imageUrl);

    return {
        id: event.id || Math.random(),
        nome: event.nome || event.name || 'Evento sem nome',
        description: event.description || 'Descrição não disponível',
        data: event.data || event.dataEvento,
        location: event.location || 'Local não definido',
        palestrante: event.palestrante || 'Palestrante não definido',
        limite: event.limite || 0,
        imagem: imageUrl
    };
};

const openDetails = (event) => {
    selectedEvent.value = event;
    selectedEventVisible.value = true;
};

const formatDate = (date) => {
    if (!date) return 'Data a definir';
    try {
        const [datePart, timePart] = date.split(' ');
        const [day, month, year] = datePart.split('/');
        const isoDateString = `${year}-${month}-${day}T${timePart}`;
        const dateObject = new Date(isoDateString);

        const formattedDate = dateObject.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        const formattedTime = dateObject.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        return `${formattedDate} às ${formattedTime}`;
    } catch {
        return 'Data inválida';
    }
};

onMounted(async () => {
    try {
        const response = await EventService.getAll();
        const eventData = response.data;

        let eventList = [];
        if (Array.isArray(eventData)) {
            eventList = eventData.map(normalizeEvent).filter(Boolean);
        } else if (eventData && typeof eventData === 'object') {
            eventList = [normalizeEvent(eventData)].filter(Boolean);
        }
        events.value = eventList;
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        events.value = [];
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="p-4">
        <!-- Loader -->
        <div v-if="loading" class="flex justify-center items-center h-48">
            <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
            <span class="ml-2">Carregando eventos...</span>
        </div>

        <!-- Mensagem se não houver eventos -->
        <div v-else-if="events.length === 0" class="text-center text-gray-500 py-8">
            <i class="pi pi-calendar-times text-6xl text-gray-300 mb-4"></i>
            <p class="text-lg">Nenhum evento encontrado.</p>
            <p class="text-sm">Tente novamente mais tarde.</p>
        </div>

        <!-- Lista de eventos -->
        <div v-else class="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            <Card v-for="event in events" :key="event.id" class="shadow-lg hover:shadow-xl transition-all duration-300 border-round-lg">
                <template #header>
                    <img :src="event.imagem" :alt="event.nome" class="w-full h-[300px] rounded-t-xl" @error="(e) => (e.target.src = 'https://primefaces.org/cdn/primevue/images/product/product-placeholder.svg')" />
                </template>

                <template #title>
                    <h3 class="text-lg font-semibold line-clamp-1">{{ event.nome }}</h3>
                </template>

                <template #subtitle>
                    <div class="flex flex-col gap-1">
                        <span class="text-sm"> <i class="pi pi-calendar mr-1"></i>{{ formatDate(event.data) }} </span>
                        <span class="text-sm"> <i class="pi pi-map-marker mr-1"></i>{{ event.location }} </span>
                    </div>
                </template>

                <template #content>
                    <div class="flex justify-between text-xs text-gray-500">
                        <span> <i class="pi pi-user mr-1"></i>{{ event.palestrante }} </span>
                        <span> <i class="pi pi-users mr-1"></i>{{ event.limite }} vagas </span>
                    </div>
                </template>

                <template #footer>
                    <Button label="Ver detalhes" icon="pi pi-eye" @click="openDetails(event)" class="w-full" severity="secondary" />
                </template>
            </Card>
        </div>

        <!-- Modal de detalhes -->
        <Dialog v-model:visible="selectedEventVisible" modal :header="selectedEvent ? selectedEvent.nome : 'Detalhes do Evento'" class="w-11/12 md:w-1/2 lg:w-2/5" :breakpoints="{ '960px': '75vw', '641px': '90vw' }">
            <div v-if="selectedEvent" class="flex flex-col gap-4">
                <img :src="selectedEvent.imagem" :alt="selectedEvent.nome" class="w-full h-60 object-cover rounded-lg" @error="(e) => (e.target.src = 'https://primefaces.org/cdn/primevue/images/product/product-placeholder.svg')" />

                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-calendar text-primary"></i>
                        <span>{{ formatDate(selectedEvent.data) }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-map-marker text-primary"></i>
                        <span>{{ selectedEvent.location }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-user text-primary"></i>
                        <span>{{ selectedEvent.palestrante }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-users text-primary"></i>
                        <span>{{ selectedEvent.limite }} vagas</span>
                    </div>
                </div>

                <div>
                    <h4 class="font-semibold mb-2">Descrição</h4>
                    <p class="text-justify text-gray-700">{{ selectedEvent.description }}</p>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.border-round-lg {
    border-radius: 12px;
}
</style>
