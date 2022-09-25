import { defineStore } from 'pinia';
import { getCatelist, addCategories, editCategories, deleteCategories, getCateById, addAttrByCatid, editAttr, deleteAttr } from '@/api/categories'

interface cateList {
    type?:number,
    pagenum?:number,
    pagesize?:number
}

interface addCateList {
    cat_pid:number;
    cat_name: string;
    cat_level: number;
}

interface editCateList {
    id:number;
    name:string;
}

interface attrList{
    id:number;
    sel:string;
}

interface addAttrList{
    id:number;
    attr_name:string;
    attr_sel:string;
    attr_vals?:string;
}

interface editAttrList{
    id:number;
    attrId:number;
    attr_name:string;
    attr_sel:string;
    attr_vals?:string;  
}

export const categoriesStore = defineStore('categories', {
    persist: true,
    state: () => {
        return {
            catelist:[] as any[],
            secCatelist:[] as any[],
            attrbList: [] as any[],
            total:0
        };
    },
    actions:{
        async getCatelist(data: cateList) {
            const res:any = await getCatelist(data);
            if(res.meta.status !== 200) {
                throw new Error('获取分类列表失败');
            }
            // console.log(res);
            if(data.pagenum) {
                this.catelist = res.data.result;
            }else {
                this.secCatelist = res.data;
            }
            this.total = res.data.toal;
        },

        async addCategories(data:addCateList) {
            const res:any = await addCategories(data.cat_pid, data.cat_name, data.cat_level);
            if(res.meta.status !== 201) {
                throw new Error('添加分类失败');
            }
        },

        async editCategories (data:editCateList) {
            const res:any = await editCategories(data.id, data.name);
            if(res.meta.status !== 200) {
                throw new Error('编辑分类失败');
            }
        },

        async deleteCategories (id:number) {
            const res:any = await deleteCategories(id);
            if(res.meta.status !== 200) {
                throw new Error('删除分类失败');
            }            
        },

        async getCateById (data: attrList) {
            // console.log(data);
            const res:any = await getCateById(data.id, data.sel);
            // console.log(res);
            if(res.meta.status !== 200) {
                throw new Error('获取参数列表失败');
            }
            res.data.forEach((item:any) => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                item.inputVisible = false;
                item.inputValue ='';
            });
            // console.log(res.data);
            return res.data;
        },

        async addAttrByCatid (data: addAttrList) {
            // console.log(data);
            const res:any = await addAttrByCatid(data.id, data.attr_name, data.attr_sel);
            // console.log(res);
            if(res.meta.status !== 201) {
                throw new Error('添加参数/属性失败');
            }
            return res.data;
        },

        async editAttr (data: editAttrList) {
            // console.log(data.attr_vals);
            const res:any = await editAttr(data.id, data.attrId, data.attr_name, data.attr_sel, data.attr_vals);
            // console.log(res);
            if(res.meta.status !== 200) {
                throw new Error('编辑参数/属性失败');
            }
        },

        async deleteAttr (id:number,attrId:number) {
            const res:any = await deleteAttr(id, attrId);
            // console.log(res);
            if(res.meta.status !== 200) {
                throw new Error('删除参数/属性失败');
            }
        }
    }
})