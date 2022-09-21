import { defineStore } from 'pinia';
import { getRoles, addRoles, editRoles, deleteRoles, deleteRoleRight, assignRoleRights } from './../api/roles'
import { getRightsTree } from '@/api/rights'

interface addRoleList {
    roleName: string;
    roleDesc?: string;
}

interface editRoleList {
    id:number;
    roleName:string;
    roleDesc?: string;
}

interface deleteList {
    roleId:number;
    rightId:number;
}

interface assignList {
    roleId:number;
    rightIds:string;
}

export const roleStore = defineStore('role', {
    state: () => {
        return {
            roles: [],
            rights: []
        }
    },
    actions: {
        async getRolesList() {
            const res:any = await getRoles();
            if(res.meta.status !== 200) {
                throw new Error('获取权限列表失败');
            }
            this.roles = res.data;
            // console.log(res);
        },

        async addRoles(data:addRoleList) {
            const res:any = await addRoles(data.roleName,data.roleDesc);
                if (res.meta.status !== 201) {
                    throw new Error('添加角色失败');
                }
        },

        async editRoles(data: editRoleList) {
            const res:any = await editRoles(data.id,data.roleName,data.roleDesc);
            if (res.meta.status !== 200) {
                throw new Error('修改角色失败');
            }
        },

        async deleteRoles(id:number){
            const res:any = await deleteRoles(id)
            if(res.meta.status !== 200){
                throw new Error('删除角色失败');
            }
        },

        async deleteRoleRight(data: deleteList){
            const res:any = await deleteRoleRight(data.roleId, data.rightId);
            if(res.meta.status !== 200){
                throw new Error('删除权限失败');
            }
        },

        async assignRoleRights(data: assignList) {
            // console.log(data);
            const res: any = await assignRoleRights(data.roleId, data.rightIds);
            // console.log(res);
            if(res.meta.status !== 200){
                throw new Error('添加权限失败');
            }            
        },

        async getRightsTree() {
            const res: any = await getRightsTree();
            // console.log(res);
            if(res.meta.status !== 200){
                throw new Error('获取权限列表失败');
            }
            this.rights = res.data;             
        }
    }
})