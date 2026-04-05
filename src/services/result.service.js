import api from './api';

const getAllResults = async (params) => {
    const response = await api.get('/admin/results', { params });
    return response.data.data;
};

const declareResult = async (resultData) => {
    const response = await api.post('/admin/results', resultData);
    return response.data.data;
};

const declareOpen = async (data) => {
    // Corrected path to match backend result.routes.js (mounted on /result)
    const response = await api.post('/result/declare-open', data);
    return response.data.data;
};

const declareClose = async (data) => {
    const response = await api.post('/result/declare-close', data);
    return response.data.data;
};

const declareHoliday = async (data) => {
    const response = await api.post('/result/holiday', data);
    return response.data.data;
};

const getResultHistory = async (params) => {
    // Corrected path to match backend admin.routes.js (mounted on /admin)
    const response = await api.get('/admin/results', { params });
    return response.data.data;
};

const revertResult = async (id) => {
    const response = await api.post(`/admin/results/${id}/revert`);
    return response.data.data;
};

const resultService = {
    getAllResults,
    declareResult,
    declareOpen,
    declareClose,
    declareHoliday,
    getResultHistory,
    revertResult
};

export default resultService;
