import { print } from '../utils/utils';
import axiosRequest from '../utils/axios';

export function uploadFile(formData) {
    return axiosRequest("POST", `/api/uploadFile`, formData);
}

export function getAllFilesInfo() {
    return axiosRequest("GET", `/api/getFileList`);
}

export function deleteFile({ fileMd5 }) {
    print(`will delete ${fileMd5}`);
    return axiosRequest("DELETE", `/api/deleteFile/${fileMd5}`);
}