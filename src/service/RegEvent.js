import api from './api';

export default {
    get() {
        return api.get(`/checks/my`);
    },

    show(number) {
        return api.get(`/check/barcode/${number}`);
    },

    certificados() {
        return api.get(`/certificados`);
    },

    gerarCertificado($number) {
        return api.get(`/certificado/${number}`);
    },

    confirm(number) {
        return api.put(`/check/confirmar/${number}`);
    },

    store(id) {
        return api.post('/check/store', id);
    },

    destroy(number) {
        return api.delete(`/check/apagar/${number}`);
    }
};
