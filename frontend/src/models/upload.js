import SparkMD5 from 'spark-md5';
import { message } from 'antd';
import * as fileService from '../services/uploadImgs';
import { print, readFileAsync } from '../utils/utils';

export default {
    namespace: 'upload',
    state: {
        userFileList: [],
    },

    reducers: {
        saveFileInfoList(state, {payload: { userFileList }}) {
            return {...state, userFileList};
        },
    },
    effects: {
        *getAllFilesInfo({payload: {}}, {call, put}) {
            const { userFileList } = yield call(fileService.getAllFilesInfo, { });
            yield put({type: "saveFileInfoList", payload: { userFileList }});
        },
        *uploadFile({payload: { file, config }}, {call, put, select}) {
            let fileMd5 = 0;
            const spark = new SparkMD5.ArrayBuffer();
            const fileBuffer = yield readFileAsync(file);
            spark.append(fileBuffer);
            fileMd5 = spark.end(); // 计算整个文件的fileMd5
            print("file md5 is: ", fileMd5);
            // check md5 exist
            const fileExist = yield call(fileService.checkFileMd5, { fileMd5 });
            if (fileExist['file_exist'] === "true") {
                message.success("save file success.");
            } else {
                const formData = new FormData();
                formData.append("file", file);
                const { status, msg } = yield call(fileService.uploadFile, { formData, config });
                if (status === "success") {
                    message.success(msg);
                }
            }
            const { userFileList } = yield call(fileService.getAllFilesInfo, { });
            yield put({type: "saveFileInfoList", payload: { userFileList }});
        },
        *deleteFile({payload: { fileMd5 }}, {call, put, select}) {
            const { file_name } = yield call(fileService.deleteFile, { fileMd5 });
            message.success(`delete ${file_name} success.`);
            const { userFileList } = yield call(fileService.getAllFilesInfo, { });
            print("userFileList: ", userFileList);
            yield put({type: "saveFileInfoList", payload: { userFileList }});
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === "/upload") {
                    dispatch({type: "getAllFilesInfo", payload: {}});
                }
            })
        }
    }
}
