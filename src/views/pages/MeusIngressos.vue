<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const router = useRouter();

// dados de exemplo
const tickets = ref([
    {
        registrationId: 'FIT-2025',
        eventName: 'Introdução a alguma coisa',
        eventDate: '2025-10-20T19:00:00.000000Z',
        eventLocation: 'Auditório Principal',
        status: 'Confirmado',
        qrCodeUrl: 'https://placehold.co/150x150/png?text=QR+CODE',
        eventId: 1
    },
    {
        registrationId: 'FIT-2025',
        eventName: 'PHP e Laravel: por que aprender tecnologia primitiva?',
        eventDate: '2025-11-05T14:30:00.000000Z',
        eventLocation: 'Sala 1',
        status: 'Confirmado',
        qrCodeUrl: 'https://placehold.co/150x150/png?text=QR+CODE',
        eventId: 2
    }
]);

const formatDate = (dateString) => {
    if (!dateString) return 'Data a definir';
    return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
    });
};

const getStatusSeverity = (status) => {
    if (status === 'Confirmado') return 'success';
    return 'info';
};

const goToEventDetails = (eventId) => {
    router.push({ name: 'detalhes-evento', params: { id: eventId } });
};
</script>

<template>
    <div class="card">
        <h2 class="text-3xl font-bold text-surface-800 dark:text-surface-0 mb-6">Meus Ingressos</h2>

        <div v-if="tickets.length > 0">
            <div v-for="ticket in tickets" :key="ticket.registrationId" class="flex flex-col xl:flex-row xl:items-start p-4 gap-4 w-full card shadow-md mb-4">
                <img class="w-9 sm:w-16rem xl:w-10rem sm:block mx-auto xl:mx-0 rounded" :src="ticket.qrCodeUrl" :alt="ticket.eventName" />
                <div class="flex flex-col sm:flex-row justify-between items-center xl:items-start flex-1 gap-4">
                    <div class="flex flex-col items-center sm:items-start gap-3">
                        <div class="text-2xl font-bold text-900">{{ ticket.eventName }}</div>
                        <div class="flex items-center gap-3">
                            <Tag :value="ticket.status" :severity="getStatusSeverity(ticket.status)"></Tag>
                            <span class="font-semibold">{{ ticket.registrationId }}</span>
                        </div>
                        <div class="text-surface-500 dark:text-surface-400">
                            <p class="m-0"><i class="pi pi-calendar mr-2"></i>{{ formatDate(ticket.eventDate) }}</p>
                            <p class="m-0"><i class="pi pi-map-marker mr-2"></i>{{ ticket.eventLocation }}</p>
                        </div>
                    </div>
                    <div class="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 mt-auto">
                        <Button label="Ver Detalhes do Evento" @click="goToEventDetails(ticket.eventId)" class="w-full"></Button>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-else class="text-center p-4">
            Você ainda não possui ingressos.
        </div>
    </div>
</template>