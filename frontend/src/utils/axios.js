import axios from 'axios'
import { notification } from 'antd'
import { print } from './utils'

axios.default.retry = 4
axios.default.retryDelay = 1000

axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    let config = err.config
    if (!config || !config.retry) return Promise.reject(err)

    config.__retryCount = config.__retryCount || 0

    if (config.__retryCount >= config.retry) {
        return Promise.reject(err)
    }

    config.__retryCount += 1

    let backoff = new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, config.retryDelay || 1)
    })

    return backoff.then(() => {
        return axios
    })
})

function parseJSON(response) {
    let data = response.data
    return data
}

function checkStatus(response) {
    if (response.status === 200) {
         return response;
    } 
    else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

const axiosRequest = (method, url, data, config={}) => {
    // axios.default.timeout = 6000
    return axios({
        method,
        url,
        data,
        ...config,
        withCredentials: true,
    })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ rawData: data}))
    .catch(err => {
        notification.error({
            message: `${err}.`
        })
        return {data: []} 
    });
    
}

export default axiosRequest