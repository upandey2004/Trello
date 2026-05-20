const API_URL = 'http://localhost:8000/api/v1';

// Centralized fetch wrapper to handle authorization headers
export async function fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = { ...options.headers };

    // Inject token if it exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Default to JSON if not explicitly set (e.g., for form-data)
    if (!headers['Content-Type'] && !(options.body instanceof URLSearchParams)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'An API error occurred');
    }
    
    return response.json();
}