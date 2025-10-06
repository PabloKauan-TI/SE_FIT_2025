<template>
    <div class="event-registration-container">
        <Toast />
        <div class="event-header">
            <h1 class="event-title">Cadastro de Eventos</h1>
            <p class="event-subtitle">Preencha os dados do novo evento</p>
        </div>

        <form @submit.prevent="submitForm">
            <div class="form-grid">
                <div class="form-group" :class="{ error: errors.nome }">
                    <label class="form-label">Nome do Evento</label>
                    <input type="text" class="form-control" v-model="form.nome" placeholder="Digite o nome do evento" />
                </div>

                <div class="form-group" :class="{ error: errors.palestrante }">
                    <label class="form-label">Palestrante</label>
                    <input type="text" class="form-control" v-model="form.palestrante" placeholder="Nome do palestrante" />
                </div>

                <div class="form-group" :class="{ error: errors.data }">
                    <label class="form-label">Data do Evento</label>
                    <input type="date" class="form-control" v-model="form.data" />
                </div>

                <div class="form-group" :class="{ error: errors.limit }">
                    <label class="form-label">Limite de Vagas</label>
                    <input type="number" class="form-control" v-model.number="form.limit" placeholder="Ex: 50" />
                </div>

                <div class="form-group" :class="{ error: errors.time }">
                    <label class="form-label">Horário</label>
                    <input type="time" class="form-control" v-model="form.time" />
                </div>

                <div class="form-group full-width" :class="{ error: errors.location }">
                    <label class="form-label">Local</label>
                    <input type="text" class="form-control" v-model="form.location" placeholder="Digite o local do evento" />
                </div>

                <div class="form-group full-width" :class="{ error: errors.description }">
                    <label class="form-label">Descrição</label>
                    <textarea class="form-control" v-model="form.description" placeholder="Descreva o evento em detalhes..."></textarea>
                </div>

                <div class="form-group full-width">
                    <label class="form-label">Imagem do Evento</label>
                    <div class="upload-area" @click="triggerFileInput">
                        <i class="pi pi-cloud-upload upload-icon"></i>
                        <p class="upload-text">Clique para enviar uma imagem</p>
                        <p class="upload-hint">Formatos suportados: JPG, PNG (Máx. 5MB)</p>
                        <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" style="display: none" />
                    </div>

                    <div class="image-preview" v-if="form.imagePreview">
                        <img :src="form.imagePreview" alt="Preview" class="preview-image" />
                        <button type="button" class="btn btn-secondary" @click="removeImage" style="margin-top: 10px">Remover Imagem</button>
                    </div>
                </div>
            </div>

            <div class="actions">
                <button type="button" class="btn btn-secondary" @click="resetForm">Cancelar</button>
                <button type="submit" class="btn btn-primary">Salvar Evento</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import EventService from '@/service/EventService'; // 1. Importar o EventService
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { reactive, ref } from 'vue';

const toast = useToast();

// Estado do formulário
const form = reactive({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: null,
    imagePreview: '',
    speaker: '',
    limit: null
});

// Estado de erros
const errors = reactive({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: ''
});

const fileInput = ref(null);

// Métodos
const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        errors.image = 'Formato de arquivo inválido. Use JPG ou PNG.';
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        errors.image = 'O arquivo é muito grande. Máximo 5MB.';
        return;
    }

    errors.image = '';
    form.image = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        form.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
};

const removeImage = () => {
    form.image = null;
    form.imagePreview = '';
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const validateForm = () => {
    let isValid = true;
    Object.keys(errors).forEach((key) => (errors[key] = ''));

    if (!form.name.trim()) {
        errors.name = 'Nome do evento é obrigatório';
        isValid = false;
    }
    if (!form.speaker.trim()) {
        errors.speaker = 'Nome do palestrante é obrigatório';
        isValid = false;
    }
    if (!form.limit || form.limit <= 0) {
        errors.limit = 'Limite de vagas deve ser um número maior que zero';
        isValid = false;
    }
    if (!form.date) {
        errors.date = 'Data é obrigatória';
        isValid = false;
    }
    if (!form.time) {
        errors.time = 'Horário é obrigatório';
        isValid = false;
    }
    if (!form.location.trim()) {
        errors.location = 'Local é obrigatório';
        isValid = false;
    }
    if (!form.description.trim()) {
        errors.description = 'Descrição é obrigatória';
        isValid = false;
    }
    return isValid;
};

const resetForm = () => {
    Object.assign(form, {
        name: '',
        date: '',
        time: '',
        location: '',
        description: '',
        image: null,
        imagePreview: '',
        speaker: '',
        limit: null
    });
    Object.keys(errors).forEach((key) => (errors[key] = ''));
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const submitForm = async () => {
    if (!validateForm()) {
        toast.add({ severity: 'error', summary: 'Erro de Validação', detail: 'Por favor, preencha todos os campos obrigatórios.', life: 3000 });
        return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    // Formata a data e hora corretamente para o backend
    formData.append('date', `${form.date} ${form.time}:00`);
    formData.append('location', form.location);
    formData.append('description', form.description);
    formData.append('speaker', form.speaker);
    formData.append('limit', form.limit);
    if (form.image) {
        formData.append('image', form.image);
    }

    console.log('Form Data:', formData);

    // 2. Usar o EventService para criar o evento
    try {
        await EventService.store(formData);
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Evento cadastrado com sucesso!', life: 3000 });
        resetForm();
    } catch (error) {
        console.error('Erro de conexão:', error);
        const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao salvar o evento.';
        toast.add({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 4000 });
    }
};
</script>

<style scoped>
:root {
    --surface-ground: #f8fafc;
    --surface-card: #ffffff;
    --text-color: #334155;
    --text-muted: #64748b;
    --primary-color: #f7931e;
    --primary-light: rgba(247, 147, 30, 0.1);
    --border-color: #cbd5e1;
    --content-border-radius: 12px;
    --focus-ring-shadow: 0 0 0 0.2rem rgba(247, 147, 30, 0.2);
}

.event-registration-container {
    max-width: 960px;
    margin: 2rem auto;
    padding: 2.5rem;
    background-color: var(--surface-card);
    border-radius: var(--content-border-radius);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.event-header {
    text-align: center;
    margin-bottom: 2.5rem;
}

.event-title {
    color: var(--primary-color);
    font-weight: 700;
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.event-subtitle {
    color: var(--text-muted);
    font-size: 1.1rem;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-color);
}

.form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--content-border-radius);
    font-size: 1rem;
    transition: all 0.2s ease;
    background-color: #f8fafc;
}

.form-control:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: var(--focus-ring-shadow);
}

textarea.form-control {
    min-height: 120px;
    resize: vertical;
}

.full-width {
    grid-column: 1 / -1;
}

.btn {
    padding: 0.75rem 1.5rem;
    border-radius: var(--content-border-radius);
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    font-size: 1rem;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background: #e48417;
}

.btn-secondary {
    background: #e2e8f0;
    color: #475569;
}

.btn-secondary:hover {
    background: #cbd5e1;
}

.actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
    gap: 1rem;
}

.upload-area {
    border: 2px dashed var(--border-color);
    border-radius: var(--content-border-radius);
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: #f8fafc;
}

.upload-area:hover {
    border-color: var(--primary-color);
    background: var(--primary-light);
}

.upload-icon {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.upload-text {
    color: var(--text-muted);
    margin-bottom: 1rem;
}

.upload-hint {
    font-size: 0.875rem;
    color: #94a3b8;
}

.image-preview {
    margin-top: 1rem;
    text-align: center;
}

.preview-image {
    max-width: 100%;
    max-height: 200px;
    border-radius: var(--content-border-radius);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.error-message {
    color: #e53e3e;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
}

.form-group.error .form-control {
    border-color: #e53e3e;
}

@media (max-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr;
    }

    .event-registration-container {
        margin: 1rem;
        padding: 1.5rem;
    }

    .actions {
        flex-direction: column;
        gap: 0.5rem;
    }

    .btn-secondary {
        order: 2;
    }
}
</style>
