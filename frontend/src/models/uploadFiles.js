import { message } from 'antd';
import * as filesService from '../services/uploadFiles';
import { print } from '../utils/utils';

export default {
    namespace: 'uploadFiles',
    state: {
        fileInfoList: [],
    },

    reducers: {
        saveFileInfoList(state, {payload: { fileInfoList }}) {
            return {...state, fileInfoList};
        },
    },
    effects: {
        *getAllFilesInfo({payload: {}}, {call, put}) {
            print("debug: getAllFilesInfo: ");
            const { rawData } = yield call(filesService.getAllFilesInfo, { });
            const { data } = rawData;
            const { files } = data;
            yield put({type: "saveFileInfoList", payload: { fileInfoList: files }});
        },
        *uploadFile({payload: { formData, config }}, {call, put, select}) {
            const { rawData } = yield call(filesService.uploadFile, { formData, config });
            const { status, data } = rawData;
            if (status === 200) {
                const { name, url, thumbnailUrl, md5 } = data['fileList'][0];
                const fileInfoDict = {
                    name,
                    url,
                    thumbUrl: thumbnailUrl,
                    uid: md5,
                }
                const r = yield select(state => state.uploadFiles.fileInfoList);
                r.push(fileInfoDict)
                yield put({type: "saveFileInfoList", payload: { fileInfoList: r}});
                message.success(`upload success.`);
            } else {
                message.success(`upload falied.`);
            }
            
            // yield put({type: "saveFromData", payload: { formData }});
        },
        *deleteFile({payload: { fileMd5 }}, {call, put, select}) {
            const { rawData } = yield call(filesService.deleteFile, { fileMd5 });
            const { fileName } = rawData
            message.success(`delete ${fileName} success.`);
            const r = yield select(state => state.uploadFiles.fileInfoList);
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
