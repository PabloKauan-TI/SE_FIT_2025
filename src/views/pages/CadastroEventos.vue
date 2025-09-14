<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FIT 2K25 - Cadastro de Eventos</title>
    <link rel="stylesheet" href="https://unpkg.com/primevue/resources/themes/aura-light-cyan/theme.css" />
    <link rel="stylesheet" href="https://unpkg.com/primeicons/primeicons.css" />
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://unpkg.com/primevue/dist/primevue.umd.min.js"></script>
    <script src="https://unpkg.com/primevue/toastservice/toastservice.min.js"></script>
    <style>
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

        body {
            font-family: 'Lato', sans-serif;
            background-color: var(--surface-ground);
            color: var(--text-color);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .event-registration-container {
            max-width: 960px;
            margin: 2rem auto;
            padding: 2.5rem;
            background-color: var(--surface-card);
            border-radius: var(--content-border-radius);
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
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
</head>
<body>
    <div id="app">
        <div class="event-registration-container">
            <toast></toast>
            <div class="event-header">
                <h1 class="event-title">Cadastro de Eventos</h1>
                <p class="event-subtitle">Preencha os dados do novo evento</p>
            </div>

            <form @submit.prevent="submitForm">
                <div class="form-grid">
                    <div class="form-group" :class="{ error: errors.name }">
                        <label class="form-label">Nome do Evento</label>
                        <input type="text" class="form-control" v-model="form.name" placeholder="Digite o nome do evento">
                    </div>

                    <div class="form-group" :class="{ error: errors.date }">
                        <label class="form-label">Data do Evento</label>
                        <input type="date" class="form-control" v-model="form.date">
                    </div>

                    <div class="form-group" :class="{ error: errors.time }">
                        <label class="form-label">Horário</label>
                        <input type="time" class="form-control" v-model="form.time">
                    </div>

                    <div class="form-group full-width" :class="{ error: errors.location }">
                        <label class="form-label">Local</label>
                        <input type="text" class="form-control" v-model="form.location" placeholder="Digite o local do evento">
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
                            <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" style="display: none;">
                        </div>

                        <div class="image-preview" v-if="form.imagePreview">
                            <img :src="form.imagePreview" alt="Preview" class="preview-image">
                            <button type="button" class="btn btn-secondary" @click="removeImage" style="margin-top: 10px;">Remover Imagem</button>
                        </div>
                    </div>
                </div>

                <div class="actions">
                    <button type="button" class="btn btn-secondary" @click="resetForm">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar Evento</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        const { createApp, ref, reactive } = Vue;

        const RootComponent = {
            setup() {
                const toast = primevue.usetoast();

                // Estado do formulário
                const form = reactive({
                    name: '',
                    date: '',
                    time: '',
                    location: '',
                    description: '',
                    image: null,
                    imagePreview: ''
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
                    fileInput.value.value = '';
                };

                const validateForm = () => {
                    let isValid = true;
                    Object.keys(errors).forEach(key => errors[key] = '');

                    if (!form.name.trim()) {
                        errors.name = 'Nome do evento é obrigatório';
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
                        name: '', date: '', time: '',
                        location: '', description: '', image: null, imagePreview: ''
                    });
                    Object.keys(errors).forEach(key => errors[key] = '');
                    if (fileInput.value) {
                        fileInput.value.value = '';
                    }
                };

                // --- FUNÇÃO MODIFICADA ---
                const submitForm = async () => {
                    if (!validateForm()) {
                        toast.add({ severity: 'error', summary: 'Erro de Validação', detail: 'Por favor, preencha todos os campos obrigatórios.', life: 3000 });
                        return;
                    }

                    // 1. Substitua pela URL da sua API Laravel
                    const apiUrl = 'http://localhost:8000/api/events';

                    // 2. O token deve ser obtido dinamicamente após o login do usuário
                    // Exemplo: const authToken = localStorage.getItem('user_token');
                    const authToken = 'SEU_TOKEN_DE_AUTENTICACAO_AQUI';

                    // 3. Usamos FormData para enviar arquivos (imagem) junto com os dados do formulário
                    const formData = new FormData();
                    formData.append('name', form.name);
                    formData.append('date', `${form.date} ${form.time}`); // Combine data e hora se o backend esperar um datetime
                    formData.append('location', form.location);
                    formData.append('description', form.description);
                    if (form.image) {
                        formData.append('image', form.image);
                    }

                    try {
                        const response = await fetch(apiUrl, {
                            method: 'POST',
                            headers: {
                                // O cabeçalho 'Authorization' envia o token para o Sanctum
                                'Authorization': `Bearer ${authToken}`,
                                'Accept': 'application/json',
                                // Não defina 'Content-Type' ao usar FormData, o navegador faz isso
                            },
                            body: formData,
                        });

                        const result = await response.json();

                        if (response.ok) {
                            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Evento cadastrado com sucesso!', life: 3000 });
                            resetForm();
                        } else {
                            // Exibe erros de validação do Laravel ou outras mensagens de erro
                            const errorMessage = result.message || 'Ocorreu um erro ao salvar o evento.';
                            toast.add({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 4000 });
                        }

                    } catch (error) {
                        console.error('Erro de conexão:', error);
                        toast.add({ severity: 'error', summary: 'Erro de Conexão', detail: 'Não foi possível conectar ao servidor.', life: 4000 });
                    }
                };

                return {
                    form,
                    errors,
                    fileInput,
                    triggerFileInput,
                    handleFileUpload,
                    removeImage,
                    submitForm,
                    resetForm
                };
            }
        };

        const app = createApp(RootComponent);

        app.use(primevue.config.default);
        app.use(primevue.toastservice);

        app.component('Toast', primevue.toast);

        app.mount('#app');
    </script>
</body>
</html>
