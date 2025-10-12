<template>
    <div id="barcode-page" class="p-4 flex flex-col items-center gap-6">
        <div class="manual-input-area w-full max-w-sm">
            <h2 class="text-lg font-semibold mb-3 text-center">Inserir Código Manualmente</h2>
            <div class="flex gap-2">
                <InputText type="text" v-model="manualCode" placeholder="Digite o código de barras/QR" class="flex-grow" :disabled="isSending" @keyup.enter="submitManualCode" />
                <Button @click="submitManualCode" :icon="isSending ? 'pi pi-spin pi-spinner' : 'pi pi-check'" :label="isSending ? 'Enviando...' : 'Enviar'" :loading="isSending" :disabled="isSending || manualCode.trim() === ''" />
            </div>
        </div>

        <Divider align="center">
            <b>OU</b>
        </Divider>

        <div class="scanner-area w-full max-w-md">
            <h2 class="text-lg font-semibold mb-3 text-center">Escanear com a Câmera</h2>
            <div class="scanner-container border p-2 rounded shadow-lg">
                <StreamQrcodeBarcodeReader v-if="isScanning" @result="onScanSuccess" @loading="onLoading">
                    <div v-if="!isLoading" class="text-center p-4 text-gray-500">Aguardando código...</div>
                </StreamQrcodeBarcodeReader>

                <div v-if="isLoading" class="loading-indicator absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Carregando" />
                    <p class="ml-3">Iniciando câmera...</p>
                </div>

                <div v-if="!isScanning && !isLoading" class="text-center p-8 text-lg text-gray-700">
                    Código capturado.
                    <Button label="Escanear Novamente" icon="pi pi-refresh" class="mt-3 p-button-outlined" @click="resetScanner" />
                </div>
            </div>
        </div>

        <div v-if="finalCode" :class="[isSending ? 'bg-blue-100 border-blue-500' : 'bg-green-100 border-green-500']" class="mt-4 p-3 border-l-4 text-gray-700 w-full max-w-md text-center rounded">
            Status: <b>{{ statusMessage }}</b>
            <div v-if="finalCode" class="mt-1 text-sm">Código: {{ finalCode }}</div>
        </div>
    </div>
</template>

<script setup>
import RegEvent from '@/service/RegEvent';
import { Button, Divider, InputText, ProgressSpinner } from 'primevue';
import { ref } from 'vue';
import { StreamQrcodeBarcodeReader } from 'vue3-barcode-qrcode-reader';

const manualCode = ref('');
const isLoading = ref(false);
const isScanning = ref(true);
const isSending = ref(false);
const finalCode = ref('');
const statusMessage = ref('Aguardando entrada...');

const sendCodeToServer = async (code) => {
    isSending.value = true;
    statusMessage.value = `Enviando código: ${code}...`;

    await RegEvent.confirm(code);

    isSending.value = false;
    statusMessage.value = `Ticket ${code} confirmado com SUCESSO! ✅`;

    return { success: true, message: 'Ticket Confirmado' };
};

const onScanSuccess = (result) => {
    if (result && result.text && isScanning.value && !isSending.value) {
        isScanning.value = false;

        finalCode.value = result.text;

        (async () => {
            await sendCodeToServer(result.text);
        })();
    }
};

const onLoading = (loadingState) => {
    isLoading.value = loadingState;
};

const submitManualCode = () => {
    const code = manualCode.value.trim();
    if (code !== '' && !isSending.value) {
        isScanning.value = false;

        finalCode.value = code;
        manualCode.value = '';
        (async () => {
            await sendCodeToServer(code);
        })();
    }
};

const resetScanner = () => {
    finalCode.value = '';
    manualCode.value = '';
    isSending.value = false;
    isScanning.value = true;
    statusMessage.value = 'Pronto para escanear ou inserir código.';
};
</script>

<style scoped>
.scanner-container {
    position: relative;
    max-height: 350px;
    max-width: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.loading-indicator {
    position: absolute;
    inset: 0;
    z-index: 10;
}
</style>
