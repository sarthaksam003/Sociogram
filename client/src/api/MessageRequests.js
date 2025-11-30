import axios from 'axios'


const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'https://sociogram-backend-v2ax.onrender.com' });

export const getMessages = (id) => API.get(`/message/${id}`);

export const addMessage = (data) => API.post('/message/', data);