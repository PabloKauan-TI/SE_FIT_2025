<template>
    <div id="barcode-page">
        <header>
            <h1>Leitor de Código de Barras</h1>
            <p>Escolha como deseja inserir o código do produto.</p>
        </header>

        <main>
            <div class="input-mode-selector">
                <button @click="setMode('scan')" :class="{ active: mode === 'scan' }">Escanear com a Câmera</button>
                <button @click="setMode('manual')" :class="{ active: mode === 'manual' }">Digitar Manualmente</button>
            </div>

            <div class="reader-area">
                <div v-if="mode === 'scan'" class="scanner-container">
                    <StreamQrcodeBarcodeReader @result="onScanSuccess" @loading="onLoading" @error="onScanError"></StreamQrcodeBarcodeReader>
                    <div v-if="isLoading" class="loading-indicator">Iniciando câmera...</div>
                    <div v-if="scanError" class="error-message">
                        {{ scanError }}
                    </div>
                </div>

                <div v-if="mode === 'manual'" class="manual-input-container">
                    <form @submit.prevent="submitManualCode">
                        <input type="text" v-model="manualCode" placeholder="Digite o código de barras" class="manual-input" />
                        <button type="submit" class="submit-button">Enviar</button>
                    </form>
                </div>
            </div>

            <div v-if="finalCode" class="result-container">
                <h3>Código Identificado:</h3>
                <p class="result-code">{{ finalCode }}</p>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { StreamQrcodeBarcodeReader } from 'vue3-barcode-qrcode-reader';

// Estado para controlar o modo de entrada ('scan' ou 'manual')
const mode = ref('scan'); // Inicia no modo de escaneamento por padrão

// Estado para o modo manual
const manualCode = ref('');

// Estado para o modo de scanner
const isLoading = ref(false);
const scanError = ref('');

// Estado para armazenar o resultado final
const finalCode = ref('');

// Funções de controle
const setMode = (selectedMode) => {
    mode.value = selectedMode;
    // Limpa o resultado anterior ao trocar de modo
    finalCode.value = '';
    scanError.value = '';
};

// Funções para o Scanner
const onScanSuccess = (result) => {
    if (result && result.text) {
        finalCode.value = result.text;
        // Opcional: parar a câmera após a leitura (neste caso, trocamos o modo)
        // mode.value = 'manual';
    }
};

const onLoading = (loadingState) => {
    isLoading.value = loadingState;
};

const onScanError = (error) => {
    if (error.name === 'NotAllowedError') {
        scanError.value = 'Você precisa conceder permissão para acessar a câmera.';
    } else {
        scanError.value = `Erro na câmera: ${error.message}`;
    }
};

// Função para o modo manual
const submitManualCode = () => {
    if (manualCode.value.trim() !== '') {
        finalCode.value = manualCode.value.trim();
        manualCode.value = ''; // Limpa o campo após o envio
    }
};
</script>

<style>
/* Estilos Globais */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: #f4f7f9;
    color: #333;
    margin: 0;
    padding: 20px;
}

#barcode-page {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    padding: 2rem;
}

header h1 {
    color: #2c3e50;
}

/* Seletor de Modo */
.input-mode-selector {
    margin: 2rem 0;
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.input-mode-selector button {
    padding: 12px 24px;
    border: 2px solid transparent;
    background-color: #e9ecef;
    color: #495057;
    border-radius: 50px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.input-mode-selector button:hover {
    background-color: #dee2e6;
}

.input-mode-selector button.active {
    background-color: #007bff;
    color: #fff;
    border-color: #007bff;
}

/* Área do Leitor */
.reader-area {
    min-height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #ccc;
    border-radius: 8px;
    overflow: hidden; /* Garante que o vídeo não ultrapasse as bordas */
    position: relative;
}

.scanner-container {
    width: 100%;
    height: 100%;
}

.scanner-container .loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 5px;
}

.scanner-container .error-message {
    padding: 20px;
    color: #721c24;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 5px;
}

/* Modo Manual */
.manual-input-container form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 80%;
}

.manual-input {
    width: 100%;
    padding: 12px;
    font-size: 1.2rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-align: center;
}

.submit-button {
    padding: 12px 30px;
    font-size: 16px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.submit-button:hover {
    background-color: #218838;
}

/* Área de Resultado */
.result-container {
    margin-top: 2rem;
    padding: 1.5rem;
    background-color: #e3f2fd;
    border-left: 5px solid #007bff;
    text-align: left;
}

.result-container h3 {
    margin-top: 0;
    color: #004085;
}

.result-code {
    font-size: 1.5rem;
    font-weight: bold;
    word-wrap: break-word;
}
</style>
