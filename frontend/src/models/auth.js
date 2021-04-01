import router from 'umi/router';
import { message } from 'antd';
import * as authService from '../services/auth';
import { print } from '../utils/utils';

export default {
    namespace: 'auth',
    state: {
        username: "helonghuan",
    },
    reducers: {
    },
    effects: {
        *login({payload: { formData }}, {call}) {
            const { rawData } = yield call(authService.login, { formData });
            const { status, data } = rawData;
            if (status === 200) {
                message.success("login success.");
                router.replace(`/`);
            } else {
                message.error("login failed.");
            }
        },
        *register({payload: { formData }}, {call}) {
            const { rawData } = yield call(authService.register, { formData });
            const { status, data } = rawData;
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
