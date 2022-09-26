import { defineStore } from 'pinia';
import { getGoods, addGood, getGoodById, editGoodById, deleteGoodById} from '@/api/goods'

interface goodList {
    query?:string,
    pagenum:number,
    pagesize:number
}

interface addGoodList {
    goods_name:string,
    goods_cat:string,
    goods_price:number,
    goods_number:number,
    goods_weight:number,
    goods_introduce?: string,
    pics?:any[],
    attrs?:any[]
}

interface editGoodList{
    id:number,
    goods_name:string,
    goods_price:number,
    goods_number:number, 
    goods_weight:number,
    goods_introduce?:string
}

export const goodsStore = defineStore('goods', {
    persist: true,
    state: () => {
        return {
            goodlist:[] as any[],
            total:0
        };
    },

    actions:{
        async getGoods(value: goodList){
            const res: any = await getGoods(value);
            // console.log(res);
            if(res.meta.status !== 200){
                throw new Error('获取商品列表失败');
            }
            this.goodlist = res.data.goods;
            this.total = res.data.total;
        },

        async addGood(data:addGoodList){
            const res:any = await addGood(data);
            if(res.meta.status !== 201){
                throw new Error('添加商品失败')
            }
        },

        async getGoodById(id: number) {
            const res:any = await getGoodById(id);
            if(res.meta.status !== 200) {
                throw new Error('查询失败,请输入正确id');
            }

            return {...res.data};
        },

        async editGoodById(data:editGoodList){
            const res:any = await editGoodById(data.id, data.goods_name, data.goods_price, data.goods_number, data.goods_weight, data.goods_introduce);
            // console.log(res);
            if(res.meta.status !== 200){
                throw new Error('更新商品失败')
            }
        },

        async deleteGoodById(id:number){
            const res:any = await deleteGoodById(id);
            // console.log(res);
            if(res.meta.status !== 200){
                throw new Error('删除商品失败')
            }
        },

    }
});