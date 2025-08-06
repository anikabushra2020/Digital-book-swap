import axios from "axios";

const API_URL = "http://localhost:8080/api";

const instance = axios.create({
  baseURL: API_URL,
});

// Add request interceptor for debugging
instance.interceptors.request.use(request => {
  console.log('API Request:', {
    url: request.url,
    method: request.method,
    headers: request.headers,
    data: request.data,
    params: request.params
  });
  return request;
});

// Add response interceptor for debugging
instance.interceptors.response.use(
  response => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Clear token if unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('jwtToken');
      // You might want to redirect to login page here
      window.location.href = '/login';
    }

    // Format error message
    const errorMessage = error.response?.data || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

export const register = (data) => instance.post("/auth/register", data);
export const login = (data) => instance.post("/auth/login", data);

export const getBooks = (params) => instance.get("/books", { params });
export const addBook = (data) => instance.post("/books", data);
export const updateBook = (id, data) => instance.put(`/books/${id}`, data);
export const updateBookStatus = (id, status) => instance.put(`/books/${id}/status`, { status });
export const deleteBook = (id) => instance.delete(`/books/${id}`);

export const getUserBooks = (userId, params) =>
  instance.get(`/users/${userId}/books`, { params });