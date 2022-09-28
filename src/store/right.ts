import { defineStore } from 'pinia';
import { getRightsList } from '@/api/rights';
// import { getRoles } from './../api/roles'

export const rightStore = defineStore('right', {
    state: () => {
        return {
            rights: []
        }
    },
    actions: {
        async getRightsList() {
            const res:any = await getRightsList();
            if(res.meta.status !== 200) {
                throw new Error('获取权限列表失败');
            }
            this.rights = res.data;
            // console.log(res);
        }
    }
})