import api from './api';

export default {
    getAll() {
        return api.get('/users');
    },
    get(id) {
        return api.get(`/users/${id}`);
    },
    create(data) {
        return api.post('/users', data);
    },
    update(id, data) {
        return api.put(`/users/${id}`, data);
    },
    delete(id) {
        return api.delete(`/users/${id}`);
    },
    logout() {
        return api.get('/logout');
    },
    login(credentials) {
        api.post('/login', credentials);
    }
};
