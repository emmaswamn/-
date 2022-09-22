import { defineStore } from 'pinia';
import { getCatelist, addCategories, editCategories, deleteCategories } from '@/api/categories'

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

export const categoriesStore = defineStore('categories', {
    persist: true,
    state: () => {
        return {
            catelist:[] as any[],
            secCatelist:[] as any[],
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
        }

    }
})