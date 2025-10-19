import api from './api';

export default {
    getAll() {
        return api.get('/users');
    },
    get(id) {
        return api.get(`/users/${id}`);
    },
    perfil() {
        return api.get(`/perfil`);
    },
    promover(id) {
        return api.post(`/user/promover/${id}`);
    },
    rebaixar(id) {
        return api.post(`/user/rebaixar/${id}`);
    },
    create(data) {
        return api.post('/users', data);
    },
    update(id, data) {
        return api.put(`/users/${id}`, data);
    },
    updatePerfil(data) {
        return api.put(`/perfil/update`, data);
    },
    delete(id) {
        return api.delete(`/users/${id}`);
    },
    logout() {
        return api.get('/logout');
    },
    login(credentials) {
        return api.post('/login', credentials);
    }
};
