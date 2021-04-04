import { print } from '../utils/utils';
import axiosRequest from '../utils/axios';

export function login({ formData }) {
    return axiosRequest("POST", `/api/login`, formData);
}

export function register({ formData }) {
    return axiosRequest("POST", `/api/register`, formData);
}

export function authorization({}) {
    return axiosRequest("GET", `/api/authorization`);
}

