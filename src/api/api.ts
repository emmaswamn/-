import Request from './request/request';
import localCache from '../utils/cache';

const myRequest = new Request({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000,
    interceptors: {
        requestInterceptor: (config: any) => {
            const token = localCache.getCache('token');
            if (token) {
                config.headers.Authorization = `${token}`;
            }
            return config;
        },
        requestInterceptorCatch: (err) => {
            return err;
        },
        responseInterceptor: (res) => {
            return res.data;
        },
        responseInterceptorCatch: (err) => {
            return err;
        }
    }
})

export default myRequest;