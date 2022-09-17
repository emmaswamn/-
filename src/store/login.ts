import { defineStore } from 'pinia';
import { userLogin } from './../api/loginRequest';
import localCache from './../utils/cache';

interface Account {
    username: string;
    password: string
}

export const loginStore = defineStore('login', {
    persist: true,
    state: () => {
        return {
            account: {}
        }
    },
    actions: {
        async loginAction(account: Account) {
            const res: any = await userLogin(account);
            // this.account = res.data; 
            localCache.setCache('token', res.data.token);
            console.log(res);
            // console.log(res.meta.status);
            if(res?.message === 'Network Error') {
                throw new Error('未连接服务器, 请稍后再试');
            }
            if (res.meta.status !== 200){
                throw new Error(`${res.meta.msg}`);
            }

        }
    }
})

