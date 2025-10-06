<template>
    <div class="scanner-container">
        <h1>Leitor de QR Code</h1>
        <div id="qr-reader" class="qr-scanner"></div>
        <div v-if="result" class="result">
            <h3>✅ Código Encontrado!</h3>
            <p>{{ result }}</p>
        </div>
    </div>
</template>

<script setup>
import { Html5QrcodeScanner } from 'html5-qrcode';
import { onMounted, onUnmounted, ref } from 'vue';

const result = ref('');
let html5QrcodeScanner = null;

onMounted(() => {
    const config = {
        fps: 10,
        qrbox: 250,
        aspectRatio: 1.0,
        rememberLastUsedCamera: true
    };

    html5QrcodeScanner = new Html5QrcodeScanner('qr-reader', config);

    html5QrcodeScanner.render(
        (decodedText, decodedResult) => {
            result.value = decodedText;
            console.log('✅ Código lido:', decodedText);
            // Optional: Stop scanning after a successful read
            html5QrcodeScanner.stop().catch((err) => console.error('Failed to stop scanner', err));
        },
        (errorMessage) => {
            // Ignore "NotFoundException" as it is a constant log
            if (!errorMessage.includes('NotFoundException')) {
                console.warn('⚠️ Erro de leitura:', errorMessage);
            }
        }
    );
});

onUnmounted(() => {
    if (html5QrcodeScanner) {
        html5QrcodeScanner.stop().catch((err) => console.error('Failed to stop scanner', err));
    }
});
</script>

<style scoped>
.scanner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: #fff;
}

h1 {
    color: #333;
    margin-bottom: 1.5rem;
}

.qr-scanner {
    width: 100%;
    max-width: 500px;
    border: 2px solid #007bff;
    border-radius: 8px;
    overflow: hidden;
}

.result {
    margin-top: 1.5rem;
    padding: 1rem;
    width: 100%;
    border-radius: 8px;
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}
</style>
