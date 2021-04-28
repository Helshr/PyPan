import { print } from '../utils/utils';
import axiosRequest from '../utils/axios';

export function checkFileMd5(fileMd5) {
    print("checkFileMd5: ", fileMd5);
    return axiosRequest("POST", `/api/checkFileMD5`, fileMd5);
}

export function uploadFile({ formData, config }) {
    print("will upload file: ", config);
    return axiosRequest("POST", `/api/uploadFile`, formData, config);
}

export function getAllFilesInfo() {
    return axiosRequest("GET", `/api/userFile`);
}

export function deleteFile({ fileMd5 }) {
    print(`will delete ${fileMd5}`);
    return axiosRequest("DELETE", `/api/deleteFile/${fileMd5}`);
}