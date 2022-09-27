import { defineStore } from 'pinia'
import { getOrders ,editOrders} from '@/api/orders'

interface orderList {
    pagenum:number,
    pagesize:number,
    query?:string
}
interface editOrder {
    id:number,
    order_price:number,
    is_send?:number,
    order_pay?:number
}

export const ordersStore = defineStore('orders', {
    // persist: true,
    state: () => {
      return {
        orders:[],
        total:0
      }
    },
    actions: {
        async getOrders(data:orderList) {
            const res:any = await getOrders(data);
            if(res.meta.status !== 200){
                throw new Error('获取订单列表失败');
            }
            this.orders = res.data.goods;
            this.total = res.data.total;
        },

        async editOrders(data:editOrder) {
            const res:any = await editOrders(data.id,data.order_price,data.is_send,data.order_pay);
            if(res.meta.status !== 201){
                throw new Error('更新订单失败');
            }
        }

    }
});