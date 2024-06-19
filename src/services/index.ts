import axios, {AxiosRequestConfig} from 'axios';
import {API_URL} from '../utils/constants';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  },
);

export const makeRequest = (options: AxiosRequestConfig) => {
  return axiosInstance(options);
};
