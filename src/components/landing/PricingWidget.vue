<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DataView from 'primevue/dataview';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const router = useRouter();

// usar dados dos eventos do backend
const events = ref([
    {
        id: 1,
        name: 'Introdução ao alguma coisa',
        location: 'Auditório Principal',
        date: '2025-10-20T19:00:00.000000Z',
        image_url: 'https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg'
    },
]);

const formatDate = (dateString) => {
    if (!dateString) return 'Data a definir';
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
};

const goToDetails = (eventId) => {
    router.push({ name: 'detalhes-evento', params: { id: eventId } });
};
</script>

<template>
    <div id="pricing" class="py-6 px-6 lg:px-20 my-2 md:my-6">
        <div class="text-center mb-6">
            <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Programação do Evento</div>
            <span class="text-muted-color text-2xl">Confira algumas das nossas principais palestras e oficinas.</span>
        </div>

        <DataView :value="events" layout="grid">
            <template #grid="slotProps">
                <div class="col-12 md:col-6 lg:col-4 p-3">
                    <div class="card h-full flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300">
                        <img :src="slotProps.image_url || 'https://primefaces.org/cdn/primevue/images/product/product-placeholder.svg'" :alt="slotProps.name" class="w-full h-48 object-cover rounded-t-lg" />
                        <div class="p-4 flex-grow flex flex-col">
                            <Tag value="Disponível" severity="success" class="w-min mb-2"></Tag>
                            <h3 class="text-xl font-bold m-0 mb-2">{{ slotProps.name }}</h3>
                            <div class="text-surface-500 dark:text-surface-400 mb-4">
                                <p><i class="pi pi-calendar mr-2"></i>{{ formatDate(slotProps.date) }}</p>
                                <p><i class="pi pi-map-marker mr-2"></i>{{ slotProps.location }}</p>
                            </div>
                            <div class="mt-auto">
                                <Button 
                                    label="Ver Detalhes" 
                                    icon="pi pi-arrow-right" 
                                    iconPos="right" 
                                    class="w-full" 
                                    @click="goToDetails(slotProps.id)">
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>
    </div>
</template>

<style scoped>
.card {
    border-radius: 12px;
}
</style>