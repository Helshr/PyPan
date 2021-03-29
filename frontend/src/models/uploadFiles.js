import { message } from 'antd';
import * as filesService from '../services/uploadFiles';
import { print } from '../utils/utils';

export default {
    namespace: 'uploadFiles',
    state: {
        fileInfoList: [],
        formData: null,
    },

    reducers: {
        saveFileInfoList(state, {payload: { fileInfoList }}) {
            return {...state, fileInfoList};
        },
    },
    effects: {
        *getAllFilesInfo({payload: {}}, {call, put}) {
            const { data } = yield call(filesService.getAllFilesInfo, { });
            yield put({type: "saveFileInfoList", payload: { fileInfoList: data['files'] }});
        },
        *uploadFile({payload: { formData }}, {call, put}) {
            const { data } = yield call(filesService.uploadFile, { formData });
            print("uploadFile result: ", JSON.stringify(data));
            // yield put({type: "saveFromData", payload: { formData }});
        },
        *deleteFile({payload: { fileMd5 }}, {call, put, select}) {
            const { data } = yield call(filesService.deleteFile, { fileMd5 });
            const fileName = data['file_name'];
            message.success(`delete ${fileName} success.`);
            const r = yield select(state => state.uploadFiles.fileInfoList);
            print(`fileMd5: `, fileMd5);
            print(`r: ${r}`);
            yield put({type: "saveFileInfoList", payload: { fileInfoList: r.filter(i => i['uid'] !== fileMd5)}});
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === "/uploadFiles") {
                    dispatch({type: "getAllFilesInfo", payload: {}});
                }
            })
        }
    }
}