<script setup>
import AppTopbar from '@/layout/AppTopbar.vue';
import RegEventService from '@/service/RegEvent.js';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

import Axios from 'axios';
import Button from 'primevue/button';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import DataTable from 'primevue/datatable';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Skeleton from 'primevue/skeleton';
import Toast from 'primevue/toast';

const dt = ref();
const Certifields = ref([]);
const selectedCertifields = ref([]);
const isLoading = ref(false);
const error = ref(null);
const toast = useToast();

onMounted(() => {
    fetchCertifields();
});

const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

const fetchCertifields = async () => {
    isLoading.value = true;
    error.value = null;
    try {
        const response = await RegEventService.certificados();
        Certifields.value = response.data;
    } catch (err) {
        error.value = 'Não foi possível carregar a lista de certificados.';
    } finally {
        isLoading.value = false;
    }
};

const Gerar = async (data) => {
    try {
        const api2 = Axios.create({
            baseURL: 'http://localhost:8000/api', // <- baseURL
            withCredentials: true,
            responseType: 'blob', // faz a instância esperar blob
            headers: {
                Accept: 'application/pdf'
            }
        });

        api2.interceptors.request.use(
            (config) => {
                const token = sessionStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // use rota relativa, não a URL completa
        const response = await api2.get(`/certificado/${data.codigo}`);

        // DEBUG: inspecione a resposta
        console.log('response.status:', response.status);
        console.log('response.headers:', response.headers);
        console.log('response.data (blob):', response.data);

        const contentType = response.headers['content-type'] || '';

        // se o servidor enviou JSON de erro mesmo com responseType blob:
        if (contentType.includes('application/json')) {
            // ler blob como texto e tentar parsear JSON para ver o erro
            const text = await response.data.text();
            let json;
            try {
                json = JSON.parse(text);
            } catch (e) {
                json = { raw: text };
            }
            console.error('Servidor retornou JSON em vez de PDF:', json);
            throw new Error('Servidor retornou JSON em vez de PDF. Veja console para detalhes.');
        }

        // garantir que é um pdf (ou qualquer binário)
        if (!response.data || response.data.size === 0) {
            throw new Error('Blob vazio recebido do servidor.');
        }

        // criar URL e forçar download
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdfBlob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'certificado.pdf');
        document.body.appendChild(link);
        link.click();
        // limpar
        link.remove();
        // revogar depois de um pequeno delay para garantir o download
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
        console.error('Erro ao buscar o PDF:', error);
        // mostrar feedback para o usuário ou analisar error.response (quando houver)
        if (error.response) {
            console.error('error.response status:', error.response.status);
            // se o backend respondeu com JSON, inspecione-o:
            try {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        console.error('Resposta do servidor (texto):', reader.result);
                    } catch {}
                };
                if (error.response.data) reader.readAsText(error.response.data);
            } catch (e) {}
        }
    }
};
</script>

<template>
    <AppTopbar />
    <Toast />
    <ConfirmDialog />
    <div class="card">
        <div v-if="isLoading" class="space-y-3">
            <div v-for="n in 10" :key="n" class="flex gap-4 items-center">
                <Skeleton class="w-8 h-8 rounded" />
                <!-- checkbox -->
                <Skeleton class="flex-1 h-6" />
                <Skeleton class="w-32 h-6" />
                <Skeleton class="w-32 h-6" />
                <Skeleton class="w-32 h-6" />
                <Skeleton class="w-32 h-6" />
                <Skeleton class="w-24 h-8 rounded" />
            </div>
        </div>

        <DataTable
            v-else
            ref="dt"
            :value="Certifields"
            selectionMode="checkbox"
            :selection="selectedCertifields"
            @selection-change="(e) => (selectedCertifields = e.value)"
            dataKey="id"
            paginator
            :rows="10"
            :rowsPerPageOptions="[5, 10, 25]"
            class="datatable-responsive"
            :paginatorTemplate="'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'"
            :currentPageReportTemplate="'Showing {first} to {last} of {totalRecords} Certifields'"
            :filters="filters"
            :globalFilterFields="['evento', 'codigo']"
        >
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Certificados</h4>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                    </IconField>
                </div>
            </template>
            <Column field="evento" header="Evento" sortable style="min-width: 16rem"></Column>
            <Column field="codigo" header="Codigo" sortable style="min-width: 16rem"></Column>
            <Column :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <Button icon="pi pi-file-pdf" variant="outlined" rounded class="mr-2" @click="Gerar(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
