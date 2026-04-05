import api from './api';

const getWithdrawalRequests = async (params) => {
    const response = await api.get('/admin/wallet/withdrawals', { params });
    return response.data.data;
};

const updateWithdrawalStatus = async (id, status) => {
    const response = await api.put(`/admin/wallet/withdrawals/${id}`, { status });
    return response.data.data;
};

const getTransactions = async (params) => {
    const response = await api.get('/admin/wallet/transactions', { params });
    return response.data.data;
};

const walletService = {
    getWithdrawalRequests,
    updateWithdrawalStatus,
    getTransactions
};

export default walletService;
