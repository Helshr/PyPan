import { print } from '../utils/utils';
import axiosRequest from '../utils/axios';

export function login({ formData }) {
    print(`login info: ${JSON.stringify(formData)}`);
    return axiosRequest("POST", `/api/login`, formData);
}


export function register({ formData }) {
    print(`register info: ${JSON.stringify(formData)}`);
    return axiosRequest("POST", `/api/register`, formData);
}
