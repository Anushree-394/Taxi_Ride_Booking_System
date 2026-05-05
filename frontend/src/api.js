import axios from 'axios';

const API_URL = 'http://localhost:8080/api/rides';

export const requestRide = async (data) => {
    const response = await axios.post(`${API_URL}/request`, data);
    return response.data;
};

export const acceptRide = async (id, driverData) => {
    const response = await axios.post(`${API_URL}/${id}/accept`, driverData);
    return response.data;
};

export const startRide = async (id) => {
    const response = await axios.post(`${API_URL}/${id}/start`);
    return response.data;
};

export const endRide = async (id) => {
    const response = await axios.post(`${API_URL}/${id}/end`);
    return response.data;
};

export const getRideStatus = async (id) => {
    const response = await axios.get(`${API_URL}/${id}/status`);
    return response.data;
};

export const getAllRides = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getRequestedRides = async () => {
    const response = await axios.get(`${API_URL}/requested`);
    return response.data;
};
