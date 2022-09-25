import myRequest from './api';

interface cateList {
    type?:number,
    pagenum?:number,
    pagesize?:number
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

export function getCateById(id:number, sel:string) {
  return myRequest.request({
    url: `categories/${id}/attributes`,
    params: {sel}
  })
}

export function addAttrByCatid(id:number,attr_name:string, attr_sel:string, attr_vals?:string) {
  let data:addAttrList;
  if(!attr_vals) {
    data = {
      id,
      attr_name,
      attr_sel
    }
  }else {
    data = {
      id,
      attr_name,
      attr_sel,
      attr_vals
    }
  }
  return myRequest.request({
    url: `categories/${id}/attributes`,
    method: 'post',
    data: data
  })
}

export function editAttr(id:number,attrId:number, attr_name:string, attr_sel:string, attr_vals?:string) {
  let data:editAttrList;
  if(!attr_vals) {
    data = {
      id,
      attrId,
      attr_name,
      attr_sel
    }
  }else {
    data = {
      id,
      attrId,
      attr_name,
      attr_sel,
      attr_vals
    }
  }
  return myRequest.request({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'put',
    data: data
  })
}

export function deleteAttr(id:number,attrId:number) {
  return myRequest.request({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'delete'
  })
}