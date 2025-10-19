<script setup>
import EventService from '@/service/EventService';
import RegEvent from '@/service/RegEvent';
import { Image, useToast } from 'primevue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import { onMounted, ref } from 'vue';

const events = ref([]);
const loading = ref(true);
const selectedEvent = ref(null);
const selectedEventVisible = ref(false);
const toast = useToast();

const parseToISO = (date) => {
    // retorna uma string ISO "YYYY-MM-DDTHH:MM:SS" ou null
    if (!date) return null;

    // se já for Date ou timestamp numérico
    if (date instanceof Date && !isNaN(date)) return date.toISOString();
    if (typeof date === 'number') return new Date(date).toISOString();

    // string: caso comum -> "DD/MM/YYYY" ou "DD/MM/YYYY HH:mm[:ss]"
    if (typeof date === 'string') {
        // normaliza separador de espaço para time
        const parts = date.trim().split(' ');
        const datePart = parts[0];
        const timePart = parts[1] || '00:00:00';

        // detecta formato DD/MM/YYYY
        if (datePart.includes('/')) {
            const [d, m, y] = datePart.split('/');
            if (!d || !m || !y) return null;
            // garante formato de tempo com segundos
            let t = timePart;
            const timeSegments = t.split(':');
            if (timeSegments.length === 2) t = `${t}:00`;
            // monta ISO
            const iso = `${y.padStart(4, '0')}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${t}`;
            return iso;
        }

        // se já estiver em formato ISO ou "YYYY-MM-DD HH:MM:SS"
        // substitui espaço por T se necessário
        if (date.includes(' ')) {
            return date.replace(' ', 'T');
        }

        // caso padrão (já ISO)
        return date;
    }

    return null;
};

const normalizeEvent = (event) => {
    if (!event) return null;

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    let imageUrl = 'https://primefaces.org/cdn/primevue/images/product/product-placeholder.svg';
    const rawImage = event.imagem || event.image || event.foto || event.imagem_url;

    if (rawImage) {
        if (rawImage.startsWith('http')) {
            imageUrl = rawImage;
        } else {
            imageUrl = `${API_BASE_URL}/uploads/${rawImage}`;
        }
    }

    // pega valor bruto da data vindo da API
    const rawDate = event.data || event.dataEvento || event.date || null;
    const iso = parseToISO(rawDate); // string ISO se possível
    const dateObj = iso ? new Date(iso) : null; // Date válido ou null
    const timestamp = dateObj && !isNaN(dateObj) ? dateObj.getTime() : null;

    return {
        id: event.id || Math.random(),
        nome: event.nome || event.name || 'Evento sem nome',
        description: event.description || 'Descrição não disponível',
        data: rawDate, // mantém o raw (para compatibilidade com seu formatDate)
        dateISO: iso, // ISO string (padrão)
        dateObj: dateObj, // objeto Date (pode ser usado direto)
        timestamp: timestamp, // número para ordenar
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

const formatDate = (dateOrEvent) => {
    // aceita: raw string (DD/MM/YYYY ...), ISO string, Date object, ou um evento (com dateObj)
    let dateObject = null;

    if (!dateOrEvent) return 'Data a definir';

    // se passou um evento (objeto com dateObj)
    if (typeof dateOrEvent === 'object' && dateOrEvent !== null && dateOrEvent.dateObj) {
        dateObject = dateOrEvent.dateObj;
    } else if (dateOrEvent instanceof Date) {
        dateObject = dateOrEvent;
    } else if (typeof dateOrEvent === 'string') {
        const iso = parseToISO(dateOrEvent);
        dateObject = iso ? new Date(iso) : null;
    } else if (typeof dateOrEvent === 'number') {
        dateObject = new Date(dateOrEvent);
    }

    if (!dateObject || isNaN(dateObject)) return 'Data inválida';

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
};

const inscribe = async (data) => {
    try {
        const response = await RegEvent.store(data);
        if (response.data.alert) {
            toast.add({
                severity: 'warn',
                summary: 'Informação',
                detail: response.data.alert, // mostra a mensagem vinda da API
                life: 3000
            });
        } else {
            toast.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Inscrição efetuada!',
                life: 3000
            });
            allEvents();
        }
    } catch (err) {
        console.error('Erro ao deletar usuário:', err);
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível efetuar a incrição.', life: 3000 });
    }
};

const allEvents = async () => {
    try {
        const response = await EventService.getAll();
        const eventData = response.data;

        let eventList = [];
        if (Array.isArray(eventData)) {
            eventList = eventData.map(normalizeEvent).filter(Boolean);
        } else if (eventData && typeof eventData === 'object') {
            eventList = [normalizeEvent(eventData)].filter(Boolean);
        }

        // Ordena usando timestamp (mais robusto)
        eventList.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)); // do mais recente ao mais antigo

        events.value = eventList;
    } catch (error) {
        events.value = [];
        console.error('Erro ao carregar eventos:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    allEvents();
});
</script>

<template>
    <Toast />
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
                <div class="flex justify-center">
                    <Image :src="selectedEvent.imagem" :alt="selectedEvent.nome" preview />
                </div>

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

                <div class="pt-4 flex justify-end">
                    <button class="p-button p-component p-button-primary" @click="inscribe((data = { event_id: selectedEvent.id }))">
                        <span class="p-button-icon p-c pi pi-check"></span>
                        <span class="p-button-label p-c">Inscrever-se</span>
                    </button>
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
