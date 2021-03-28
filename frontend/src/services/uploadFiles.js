import axiosRequest from '../utils/axios';

export function uploadFile(formData) {
    return axiosRequest("POST", `/api/uploadFile`, formData);
}

export function getAllFilesInfo() {
    return axiosRequest("GET", `/api/getFileList`);
}