import myRequest from './api';
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

export function getGoods(data:goodList) {
    return myRequest.request({
      url: '/goods',
      params:data
    })
}

export function addGood(data:addGoodList) {
  return myRequest.request({
    url: '/goods',
    method:'post',
    data
  })
}

export function getGoodById(id:number) {
  return myRequest.request({
    url: `goods/${id}`,
  })
}

export function editGoodById(id:number,goods_name:string,goods_price:number, goods_number:number, goods_weight:number,goods_introduce?:string) {
  return myRequest.request({
    url: `goods/${id}`,
    method:'put',
    data:{
        goods_name,
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce
    }
  })
}

export function deleteGoodById(id:number) {
  return myRequest.request({
    url: `goods/${id}`,
    method:'delete'
  })
}