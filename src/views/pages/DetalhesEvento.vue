<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Card from 'primevue/card';

const route = useRoute();

const mockEventDetail = {
    id: 1,
    name: 'Introdução a Viadagem',
    date: '2025-10-20T19:00:00.000000Z',
    location: 'Auditório Principal, Bloco 69',
    speaker: 'Pedro Kauan',
    description: 'Aprenda a ser viado',
    image_url: 'https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg'
};

const event = ref(null);

onMounted(() => {
    console.log("ID recebido na página de detalhes:", route.params.id);
    event.value = mockEventDetail;
});

const formatFullDate = (dateString) => {
    if (!dateString) return 'Data e hora a definir';
    return new Date(dateString).toLocaleString('pt-BR', {
        dateStyle: 'full', timeStyle: 'short'
    });
};
</script>

<template>
    <div class="p-4 md:p-6 lg:p-8">
        <div class="w-full lg:w-10/12 xl:w-9/12 mx-auto">
            <Card v-if="event" class="overflow-hidden">
                <template #content>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <img :src="event.image_url" :alt="event.name" class="w-full h-auto object-cover rounded-lg shadow-md" />
                        </div>
                        <div>
                            <h1 class="text-4xl font-bold">{{ event.name }}</h1>
                            <p class="text-primary text-xl font-semibold mt-2">{{ formatFullDate(event.date) }}</p>
                            <p class="text-surface-500 text-lg mt-1"><i class="pi pi-map-marker mr-2"></i>{{ event.location }}</p>
                            <p class="text-surface-500 text-lg mt-1"><i class="pi pi-user mr-2"></i>Palestrante: {{ event.speaker }}</p>
                            <Divider class="my-6" />
                            <h3 class="text-xl font-semibold mb-3">Sobre o Evento</h3>
                            <p class="leading-relaxed">{{ event.description }}</p>
                            <div class="mt-8">
                                <Button label="Quero meu Ingresso!" icon="pi pi-ticket" class="p-button-lg"></Button>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>