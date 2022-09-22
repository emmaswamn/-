import myRequest from './api';

interface cateList {
    type?:number,
    pagenum?:number,
    pagesize?:number
}

export function getCatelist(data:cateList) {
    return myRequest.request({
      url: '/categories',
      params:data
    })
}

export function addCategories(cat_pid:number,cat_name:string,cat_level:number) {
    return myRequest.request({
        url: 'categories',
        method:'post',
        data:{
            cat_pid,
            cat_name,
            cat_level
        }
    })
}

export function editCategories(id:number,name:string) {
    return myRequest.request({
      url: `categories/${id}`,
      method:'put',
      data:{
        cat_name:name
      }
    })
}

export function deleteCategories(id:number) {
    return myRequest.request({
      url: `categories/${id}`,
      method:'delete'
    })
}