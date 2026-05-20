import { fetchWithAuth } from './api';

export const authService = {
    register: (userData) => fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    
    login: async (email, password) => {
        // FastAPI OAuth2 requires form data, not JSON
        const formData = new URLSearchParams();
        formData.append('username', email); 
        formData.append('password', password);

        const data = await fetchWithAuth('/auth/login', {
            method: 'POST',
            body: formData,
        });
        
        localStorage.setItem('token', data.access_token);
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    isAuthenticated: () => !!localStorage.getItem('token')
};