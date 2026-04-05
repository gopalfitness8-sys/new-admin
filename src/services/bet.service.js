import api from './api';

const getAllBets = async (params) => {
    const response = await api.get('/admin/bets', { params });
    return response.data.data;
};

const getBetById = async (id) => {
    const response = await api.get(`/admin/bets/${id}`);
    return response.data.data;
};

const updateBetStatus = async (id, status) => {
    const response = await api.put(`/admin/bets/${id}/status`, { status });
    return response.data.data;
};

const betService = {
    getAllBets,
    getBetById,
    updateBetStatus
};

export default betService;
