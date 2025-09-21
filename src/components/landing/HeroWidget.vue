<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const navigateToEvents = () => {
    router.push({ name: 'mostrar-eventos' });
};
</script>

<template>
    <div id="hero" class="flex flex-col items-center justify-center py-20 px-6 lg:px-20 bg-surface-900">
        <div class="text-center max-w-4xl">
            <h1 class="text-6xl font-bold leading-tight text-white">
                <span class="font-light block">Bem-vindo ao</span>FIT 2025
            </h1>
            
            <p class="font-normal text-2xl leading-normal mt-4 text-gray-300">
                Descrição principal do evento
            </p>
            
            <Button label="Ver Eventos" @click="navigateToEvents" rounded class="!text-xl mt-8 !px-4"></Button>
        </div>
        <div class="mt-12 w-full max-w-5xl">
            <div class="h-96 bg-surface-800 rounded-lg flex items-center justify-center border-2 border-dashed border-surface-700">
                <span class="text-gray-500 text-lg">Imagem Principal</span>
            </div>
        </div>
    </div>
</template>