import axios from 'axios';

const API_BASE_URL = '/api/bin';
const REGISTRY_BASE_URL = '/api/registry';

export const getBinStatus = async (deviceId = null) => {
    try {
        const url = deviceId ? `${API_BASE_URL}/status?deviceId=${deviceId}` : `${API_BASE_URL}/status`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching bin status:', error);
        return null;
    }
};

export const getHistory = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/history`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Error fetching history:', error);
        return [];
    }
};

export const getRegistry = async () => {
    try {
        const response = await axios.get(`${REGISTRY_BASE_URL}/list`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Error fetching registry:', error);
        return [];
    }
};

export const addRegistry = async (data) => {
    try {
        const response = await axios.post(`${REGISTRY_BASE_URL}/add`, data);
        return response.data;
    } catch (error) {
        console.error('Error adding to registry:', error);
        throw error;
    }
};

export const updateRegistry = async (data) => {
    try {
        const response = await axios.put(`${REGISTRY_BASE_URL}/update`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating registry:', error);
        throw error;
    }
};

export const deleteRegistry = async (id) => {
    try {
        const response = await axios.delete(`${REGISTRY_BASE_URL}/delete`, {
            params: { id }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting from registry:', error);
        throw error;
    }
};
