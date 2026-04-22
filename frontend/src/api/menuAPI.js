import axiosInstance from './axiosInstance';

export const getAllMenuItems = (params) => 
  axiosInstance.get('/menu', { params });

export const getMenuItem = (id) => 
  axiosInstance.get(`/menu/${id}`);
