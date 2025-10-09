import api from './api'; // Este arquivo deve configurar a instância do Axios com a baseURL e headers.

export default {
    /**
     * Busca todos os eventos.
     */
    getAll() {
        return api.get('/events');
    },

    /**
     * Busca um evento específico pelo ID.
     * @param {number} id O ID do evento.
     */
    get(id) {
        return api.get(`/events/${id}`);
    },

    /**
     * Cria um novo evento.
     * @param {FormData} data Os dados do evento, incluindo a imagem.
     */
    store(data) {
        // Usamos o 'qs' para serializar os dados, o que ajuda o backend (PHP) a interpretar o FormData corretamente.
        // O Axios cuidará do Content-Type automaticamente.
        return api.post('/events', data);
    },

    /**
     * Atualiza um evento existente.
     * A rota do backend espera um POST para atualização.
     * @param {number} id O ID do evento a ser atualizado.
     * @param {FormData} data Os novos dados do evento.
     */
    update(id, data) {
        // A sua rota de backend para update é: Route::post('/eventos/{id}', ...)
        // O campo `_method: 'PUT'` já está no FormData, e o Axios vai lidar com o Content-Type.
        // A rota está correta (/eventos/{id}).
        return api.post(`/events/${id}`, data);
    },

    /**
     * Deleta um evento.
     * @param {number} id O ID do evento a ser deletado.
     */
    destroy(id) {
        return api.delete(`/events/${id}`);
    }
};
