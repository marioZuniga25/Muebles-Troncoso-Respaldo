// src/services/promocionesService.js
import axios from 'axios';

const API_URL = 'http://localhost:5194/api/PromocionesRandom';
const PRODUCTOS_API_URL = 'http://localhost:5194/api/Producto/ListadoProductos'; // Asegúrate de que este endpoint exista

const getPromocionesRandom = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching promociones:', error);
    throw error; // Lanza el error para que pueda ser manejado en el componente
  }
};

const getProductos = async () => {
  try {
    const response = await axios.get(PRODUCTOS_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching productos:', error);
    throw error; // Lanza el error para que pueda ser manejado en el componente
  }
};

export default {
  getPromocionesRandom,
  getProductos,
};
