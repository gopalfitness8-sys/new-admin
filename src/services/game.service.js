import api from './api';

const getAllGames = async (params) => {
    const response = await api.get('/admin/games', { params });
    return response.data.data;
};

const createGame = async (gameData) => {
    const response = await api.post('/admin/games', gameData);
    return response.data.data;
};

const updateGame = async (id, gameData) => {
    const response = await api.put(`/admin/games/${id}`, gameData);
    return response.data.data;
};

const deleteGame = async (id) => {
    const response = await api.delete(`/admin/games/${id}`);
    return response.data.data;
};

const getGameById = async (id) => {
    const response = await api.get(`/games/${id}`);
    return response.data.data;
};

const gameService = {
    getAllGames,
    createGame,
    updateGame,
    deleteGame,
    getGameById
};

export default gameService;
