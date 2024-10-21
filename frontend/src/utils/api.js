// src/utils/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Reemplaza con la URL de tu back-end si es diferente
});

export default api;
