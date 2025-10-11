<script setup>
import RegEvent from '@/service/RegEvent';
import { useToast } from 'primevue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { nextTick, onMounted, ref } from 'vue';

const tickets = ref([]);
const isBarcodeVisible = ref(false);
const selectedBarcode = ref('');
const barcodeSvgRef = ref(null);
const toast = useToast();

const isDeleteDialogVisible = ref(false);
const selectedTicketToDelete = ref(null);

onMounted(() => {
    fetchTickets();
});

const fetchTickets = async () => {
    try {
        const response = await RegEvent.get();
        tickets.value = response.data;
    } catch (error) {
        console.error('Erro ao buscar ingressos:', error);
    }
};

const formatDate = (dateString) => {
    if (!dateString) return 'Data a definir';
    return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Gera e exibe o código de barras
const gerarBarCode = async (codigo) => {
    try {
        selectedBarcode.value = codigo;
        isBarcodeVisible.value = true;

        await nextTick();

        const svg = barcodeSvgRef.value;
        if (svg) {
            svg.innerHTML = '';
            window.JsBarcode(svg, String(codigo), {
                format: 'CODE128',
                lineColor: '#000',
                width: 2,
                height: 100,
                displayValue: true
            });
        }
    } catch (err) {
        console.error('Erro ao gerar código de barras:', err);
    }
};

const baixarBarCode = () => {
    const svg = barcodeSvgRef.value;
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `codigo_barras_${selectedBarcode.value}.png`;
        a.click();
    };

    img.src = url;
};

const abrirDialogExclusao = (ticket) => {
    selectedTicketToDelete.value = ticket;
    isDeleteDialogVisible.value = true;
};

const confirmarExclusao = async () => {
    try {
        await RegEvent.destroy(selectedTicketToDelete.value.codigo_de_barras);

        tickets.value = tickets.value.filter((t) => t.codigo_de_barras !== selectedTicketToDelete.value.codigo_de_barras);

        isDeleteDialogVisible.value = false;

        toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Ingresso excluído com sucesso.',
            life: 3000
        });
    } catch (error) {
        console.error('Erro ao excluir ingresso:', error);

        toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível excluir o ingresso.',
            life: 3000
        });
    }
};
</script>

<template>
    <div class="card">
        <h2 class="text-3xl font-bold text-surface-800 dark:text-surface-0 mb-6">Meus Ingressos</h2>

        <div v-if="tickets.length > 0">
            <div v-for="ticket in tickets" :key="ticket.registrationId" class="flex flex-col xl:flex-row xl:items-start p-4 gap-4 w-full card shadow-md mb-4">
                <div class="flex flex-col sm:flex-row justify-between items-center xl:items-start flex-1 gap-4">
                    <div class="flex flex-col items-center sm:items-start gap-3">
                        <div class="text-2xl font-bold text-900">{{ ticket.evento }}</div>
                        <div class="text-surface-500 dark:text-surface-400">
                            <p class="m-0"><i class="pi pi-calendar mr-2"></i>{{ formatDate(ticket.data) }}</p>
                            <p class="m-0"><i class="pi pi-map-marker mr-2"></i>{{ ticket.location }}</p>
                            <p class="m-0"><i class="pi pi-barcode mr-2"></i>{{ ticket.codigo_de_barras }}</p>
                        </div>
                    </div>

                    <div class="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 mt-auto">
                        <Button label="Gerar Código de Barras" @click="gerarBarCode(ticket.codigo_de_barras)" class="w-full" />
                        <Button label="Cancelar Ingresso" severity="danger" @click="abrirDialogExclusao(ticket)" class="w-full" />
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="text-center p-4">Você ainda não possui ingressos.</div>

        <!-- Dialog com o código de barras -->
        <Dialog v-model:visible="isBarcodeVisible" header="Código de Barras" modal :style="{ width: '350px' }">
            <div class="flex flex-col items-center gap-3">
                <svg ref="barcodeSvgRef" id="barcode"></svg>

                <Button label="Baixar código de barras" icon="pi pi-download" class="w-full" @click="baixarBarCode" />
            </div>
        </Dialog>

        <Dialog v-model:visible="isDeleteDialogVisible" header="Cancelar Ingresso" modal :style="{ width: '350px' }">
            <p>
                Tem certeza que deseja cancelar o ingresso para o evento <strong>{{ selectedTicketToDelete?.evento }}</strong
                >?
            </p>
            <div class="flex justify-end gap-2 mt-4">
                <Button label="Não" severity="secondary" @click="isDeleteDialogVisible = false" />
                <Button label="Sim, cancelar" severity="danger" @click="confirmarExclusao" />
            </div>
        </Dialog>
    </div>
</template>
