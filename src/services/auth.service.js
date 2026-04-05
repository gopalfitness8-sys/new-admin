import api from './api';

const login = async (email, password) => {
  const response = await api.post('/auth/admin-login', { email, password });
  if (response.data.success) {
    localStorage.setItem('adminToken', response.data.data.token);
    localStorage.setItem('adminUser', JSON.stringify(response.data.data.user));
    return response.data.data;
  }
  throw new Error(response.data.message || 'Login failed');
};

const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

const getCurrentUser = () => {
  const user = localStorage.getItem('adminUser');
  return user ? JSON.parse(user) : null;
};

export default { login, logout, getCurrentUser };
