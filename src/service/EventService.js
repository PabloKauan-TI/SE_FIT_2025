import api from './api'; // Este arquivo deve configurar a instância do Axios com a baseURL e headers.

export default {
    getAll() {
        return api.get('/events');
    },

    get(id) {
        return api.get(`/events/${id}`);
    },

    store(data) {
        return api.post('/events', data);
    },

    update(id, data) {
        return api.post(`/events/${id}`, data);
    },

    destroy(id) {
        return api.delete(`/events/${id}`);
    }
};
