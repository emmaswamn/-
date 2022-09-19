import myRequest from './api';
interface userList {
    query?:string,
    pagenum:number,
    pagesize:number
}

interface addUserList {
  username?:string,
  password:string,
  email:string,
  mobile:string
}

export function getUsers(data:userList) {
    return myRequest.request({
      url: '/users',
      params:data
    })
}

export function changeUserStatus(uId:number,type:boolean) {
  return myRequest.request({
    url: `users/${uId}/state/${type}`,
    method:'put',
  })
}

export function addUser(data:addUserList) {
  return myRequest.request({
    url: '/users',
    method:'post',
    data
  })
}

export function getUsersById(id:number) {
  return myRequest.request({
    url: `users/${id}`,
  })
}

export function editUsersById(id:number,email?:string,mobile?:string) {
  return myRequest.request({
    url: `users/${id}`,
    method:'put',
    data:{
      email,
      mobile
    }
  })
}

export function deleteUsersById(id:number) {
  return myRequest.request({
    url: `users/${id}`,
    method:'delete'
  })
}