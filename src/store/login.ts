import { defineStore } from 'pinia';
import { userLogin } from './../api/loginRequest';
import localCache from './../utils/cache';
import { getMenu } from './../api/menu';

interface Account {
    username: string;
    password: string
}

export const loginStore = defineStore('login', {
    persist: true,
    state: () => {
        return {
            account: {},
            menus: [] as any[],
            isExpand: true,
            activePath: ''
        }
    },
    actions: {
        async loginAction(account: Account) {
            const res: any = await userLogin(account);
            // this.account = res.data; 
            localCache.setCache('token', res.data.token);
            // console.log(res);
            // console.log(res.meta.status);
            if(res?.message === 'Network Error') {
                throw new Error('未连接服务器, 请稍后再试');
            }
            if (res.meta.status !== 200){
                throw new Error(`${res.meta.msg}`);
            }
        },

        async getMenuList() {
            const menu: any = await getMenu();
            // console.log(menu);
            if(menu?.message === 'Network Error') {
                throw new Error('未连接服务器, 请稍后再试');
            }
            if (menu.meta.status !== 200){
                throw new Error(`${menu.meta.msg}`);
            }
            // console.log(menu);
            this.menus = menu.data;
        }
    }
})

