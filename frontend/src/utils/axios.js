import axios from 'axios'
import { notification } from 'antd'
import { print } from './utils'

axios.default.retry = 4
axios.default.retryDelay = 1000

axios.interceptors.request.use(    
    config => {        
        const t = window.sessionStorage.getItem('token');
        let token = "";
        if (t !== null) {
            token = `Bearer ${window.sessionStorage.getItem('token')}`;        
        }
        token && (config.headers.Authorization = token);        
        return config;    
    },    
    error => {        
        return Promise.error(error);    
})

axios.interceptors.response.use(
    response => {
        print("DEBUG response: ", response);
        if (response.status === 200) {            
            return Promise.resolve(response);        
        }
        else if (response.status === 401) {            
            window.location = "/login";
        }
        else {            
            return Promise.reject(response);        
        } 
    },
    error => {
        console.log("error", error);
        if (error.response) {
          switch (error.response.status) {
            case 401:
                window.location.replace("/login");
            case 500:
                print("server error.");
            }
        }
    }
)

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

const axiosRequest = (method, url, data, config={}) => {
    print("method: ", method);
    print("url: ", url);
    // axios.default.timeout = 6000
    return new Promise((resolve, reject) => {
        axios({
            method,
            url,
            data,
            ...config,
            withCredentials: true,
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)        
        }) 
    })
}

export default axiosRequest