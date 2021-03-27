export default {
    namespace: 'sys',
    state: {
        collapsed: false,
    },

    reducers: {
        changeSiderStatus(state, {payload: { collapsed }}) {
            return {...state, collapsed}
        },
    },
    effects: {
    },
}
