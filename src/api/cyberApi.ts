import axios, { AxiosInstance } from 'axios';

const cyberAxiosClient: AxiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_CYBER_API_BASE_URL}/api`,
});

const addInterceptors = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.request.use((config) => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            try {
                const { response } = error;
                if (response && response.status === 401) {
                    localStorage.removeItem('ACCESS_TOKEN');
                }
            } catch (error) {
                console.error(error);
            }
            throw error;
        }
    );
};

addInterceptors(cyberAxiosClient);

export default cyberAxiosClient;
