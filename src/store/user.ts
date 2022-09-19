import { defineStore } from 'pinia';
import { getUsers, changeUserStatus, addUser, getUsersById, editUsersById, deleteUsersById } from './../api/users'
import { getRoles } from './../api/roles'
import localCache from './../utils/cache';

interface userList {
    query?:string,
    pagenum:number,
    pagesize:number
}

interface userStatus {
    uid:number
    type:boolean
}

interface addUserList {
    username?:string,
    password:string,
    email:string,
    mobile:string
}

interface editUserList {
    id:number
    email?:string,
    mobile?:string
}

export const usersStore = defineStore('users', {
    persist: true,
    state: () => {
        return {
            users:[] as any[],
            total:-1,
            roles:[] as any[]
        };
    },
    actions: {
        async getUsers(value:userList) {
            const res: any = await getUsers(value);
            // console.log(res);
            if(res.meta.status === 200){
               this.users = res.data.users;
               this.total = res.data.total;
               const res1: any = await getRoles();
               this.roles = res1.data;
            }else {
                throw new Error('获取用户列表失败');
            }
        },

        async changeUserStatus(data:userStatus){
            const res:any = await changeUserStatus(data.uid,data.type);
            if(res.meta.status !== 200) {
              throw new Error('更新状态失败');
            }
        },

        async addUser(data:addUserList){
            const res:any = await addUser(data);
            if(res.meta.status !== 201){
                throw new Error('创建用户失败')
            }
        },

        async getUsersById(id: number) {
            const res:any = await getUsersById(id);
            if(res.meta.status !== 200) {
                throw new Error('查询失败,请输入正确id');
            }

            return {...res.data};
        },

        async editUsersById(data:editUserList){
            const res:any = await editUsersById(data.id,data.email,data.mobile);
            console.log(res);
            if(res.meta.status !== 200){
                throw new Error('更新用户失败')
            }
        },
        async deleteUsersFromId(id:number){
            const res:any = await deleteUsersById(id);
            if(res.meta.status !== 200){
                throw new Error('删除用户失败')
            }
        },
    }
})