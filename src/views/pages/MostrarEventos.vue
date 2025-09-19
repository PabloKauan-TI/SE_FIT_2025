<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DataView from 'primevue/dataview';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const router = useRouter();

// teste que nao deu certo
const events = ref([
    {
        id: 1,
        name: 'Teste',
        location: 'Teste',
        date: '2025-10-20T19:00:00.000000Z',
        image_url: 'https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg'
    },
]);

const goToDetails = (eventId) => {
    router.push({ name: 'detalhes-evento', params: { id: eventId } });
};

const formatDate = (dateString) => {
    if (!dateString) return 'Data a definir';
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
};
</script>

<template>
    <div class="card">
        <h2 class="text-3xl font-bold text-surface-800 dark:text-surface-0 mb-2">Próximos Eventos</h2>
        <p class="text-surface-500 dark:text-surface-400 mb-6">Confira os eventos disponíveis e garanta sua participação.</p>

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