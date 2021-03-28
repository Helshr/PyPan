import * as filesService from '../services/uploadFiles';

export default {
    namespace: 'uploadFiles',
    state: {
        fileInfoList: [],
        formData: null,
    },

    reducers: {
        saveFromData(state, {payload: { fromData }}) {
            return {...state, fromData};
        },
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
            yield put({type: "saveFromData", payload: { formData }});
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
