import axiosInstance from './axiosInstance';

export const getAvailableTables = (date, time) => 
  axiosInstance.get(`/reserve/available-tables`, { params: { date, time } });

export const createReservation = (data) => 
  axiosInstance.post('/reserve', data);

export const getMyReservations = (phone) => 
  axiosInstance.get('/reserve/my', { params: { phone } });
