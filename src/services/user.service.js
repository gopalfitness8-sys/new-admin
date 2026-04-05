import api from './api';

const getAllUsers = async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data.data;
};

const getUserById = async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.data;
};

const updateUserStatus = async (id, isActive) => {
    const response = await api.put(`/admin/users/${id}/status`, { isActive });
    return response.data.data;
};

const getUserBets = async (id) => {
    const response = await api.get(`/admin/users/${id}/bets`);
    return response.data.data;
};

const getUserTransactions = async (id) => {
    const response = await api.get(`/admin/users/${id}/transactions`);
    return response.data.data;
};

const manualAddWallet = async (id, amount, note) => {
    const response = await api.put(`/admin/users/${id}/wallet/add`, { amount, note });
    return response.data.data;
};

const manualDeductWallet = async (id, amount, note) => {
    const response = await api.put(`/admin/users/${id}/wallet/deduct`, { amount, note });
    return response.data.data;
};

const userService = {
    getAllUsers,
    getUserById,
    updateUserStatus,
    getUserBets,
    getUserTransactions,
    manualAddWallet,
    manualDeductWallet
};

export default userService;
