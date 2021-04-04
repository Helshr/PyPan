import router from 'umi/router';
import { message } from 'antd';
import * as authService from '../services/auth';
import { print } from '../utils/utils';

export default {
    namespace: 'auth',
    state: {
        username: "",
    },
    reducers: {
        saveUsername(state, {payload: { username }}) {
            return {...state, username}
        },
    },
    effects: {
        *login({payload: { formData }}, { call, put }) {
            const rawData = yield call(authService.login, { formData });
            const { status } = rawData;
            if (status === 200) {
                const { access_token } = rawData;
                // print(`username: ${username}`);
                // save session storage
                window.sessionStorage.setItem('token', access_token)
                // authorization
                const d = yield call(authService.authorization, {});
                print("authserverice: ", d);
                const username = d['user_name'];
                print(`username: ${username}`);
                message.success("login success.");
                yield put({ type: 'saveUsername', payload: {username} });
                router.replace(`/`);
            } else {
                message.error("Bad username or password.");
            }
        },
        *authorization({}, { call, put }) {
            const { user_name } = yield call(authService.authorization, {});
            print(`username: ${user_name}`);
            yield put({ type: 'saveUsername', payload: {username: user_name} });
        },
        *register({payload: { formData }}, { call }) {
            const { status } = yield call(authService.register, { formData });
            if (status === 200) {
                router.replace(`/login`);
                message.success("register failed.");
            } else {
                message.error("register failed.");
            }
        },
    },
    subscriptions: {
    }
}
