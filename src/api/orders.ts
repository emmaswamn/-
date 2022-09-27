import myRequest from './api'

interface orderList {
  pagenum:number,
  pagesize:number,
  query?:string
}

export function getOrders(data:orderList) {
    return myRequest.request({
      url: '/orders',
      params:data
    })
}
export function editOrders(id:number,order_price:number, is_send?:number,order_pay?:number) {
    return myRequest.request({
        url: `/orders/${id}`,
        method:'put',
        data:{
        order_price,
        is_send,
        order_pay
        }
    })
}