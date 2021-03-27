export default {
    namespace: 'test',
    state: {
        a: [],
        isLoading: false,
    },

    reducers: {
        changeSiderStatus(state, {payload: { collapsed }}) {
            return {...state, collapsed}
        },
    },
    effects: {
    },
}
